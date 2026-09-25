#!/usr/bin/env node
/** ── PERTURBATION — does a theorem NOTICE the values it is about? ──────────────────────────────────────
 *
 *  scripts/vacuity.ts rejects a theorem whose quantifier ranges over nothing, and says plainly what it
 *  cannot reach. Measured 2026-09-25 it reported 403 theorem(s) quantifying over nothing at all — a
 *  concrete equality has no domain to be empty — and did not claim them as checked. That count grows with
 *  the corpus and is dated for that reason; `npm run vacuity` prints it. THE PROPORTION IS THE DURABLE
 *  FIGURE and it has not moved: 35% of the corpus then and 35% now, declared unchecked by the check that
 *  exists for deciding nothing.
 *
 *  A concrete equality has a second way to decide nothing, and I shipped one and deleted it the same hour.
 *  `molarGas % naDigits = 0`, where `molarGas` IS `kDigits * naDigits`, restates its own definition: true
 *  for every product, true whatever the constants are, and it reads like a test of exactness. Beside it,
 *  `molarGas = 831446261815324` pins a published CODATA value that could have failed to match. Both close
 *  by decide. Both are concrete equalities. Only one of them is about anything.
 *
 *  WHAT SEPARATES THEM IS WHETHER THEY NOTICE. Change a definition's literal and recompile: a theorem that
 *  pins the value errors, a theorem that restates structure does not. That is gates-fire's own argument —
 *  what turns red when this is false — pointed at the theorems instead of at the gates.
 *
 *  WHAT THIS IS NOT, and the limit is the whole of its honesty:
 *
 *    · ONE perturbation, +1, on each simple `def NAME : Nat := LITERAL`. A theorem insensitive to +1 could
 *      still be sensitive to something else, so a theorem that notices nothing is a CANDIDATE and never a
 *      verdict. This reports; it does not condemn, and it must not be read as proving triviality.
 *    · A theorem in a file with no such def cannot be perturbed at all. Those are NOT MEASURED, counted
 *      apart, and never folded into the ones that were checked and noticed nothing.
 *    · A perturbation that breaks elaboration for an unrelated reason tells us nothing about any theorem in
 *      that file, and is reported as an unusable probe rather than as every theorem noticing.
 *
 *  WHAT IT COSTS, MEASURED — because a tool nobody can afford to run is a tool nobody runs. One compile per
 *  definition per perturbation size, and the compile is the expensive part: energy.lean is 17 definitions,
 *  51 compiles, 688 seconds. Across the tree that is 76 definitions and 228 compiles, hours rather than
 *  minutes. So this is a PER-FILE instrument, run against a file whose constants you are reading, and not a
 *  sweep and not a gate. `--file energy.lean` is the intended use.
 *
 *  usage:  node scripts/perturb-gate.ts [--file planck.lean] [--list] */
import { readFileSync, writeFileSync, mkdtempSync, rmSync, readdirSync } from 'node:fs'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { laneBudget } from '../src/api/lanes.ts'
import { merkleFold, toUuid } from '../src/0/index.ts'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { arg, flag } from '../src/cli/index.ts'

const DIR = 'src/proof'
// THE COMMENT IS NOT OPTIONAL IN THIS TREE, SO THE PATTERN CANNOT TREAT IT AS ABSENT. This required the
// line to END with the literal, and every constant carrying an explanation was skipped:
//   def splitCost : Nat := 52000  -- Wh to electrolyse 1 kg H₂
// A constant with a comment saying where the number came from is the NORMAL case here — the doctrine is to
// say where a number came from — so the probe systematically skipped the best-documented constants and
// reported their theorems as having nothing to notice. 35 definitions seen of 76 that exist, and the 41 it
// missed were the ones somebody had bothered to source.
const DEF = /^def ([a-zA-Z_][a-zA-Z0-9_]*) *: *Nat *:= *(\d+) *(--.*)?$/
const THM = /^theorem ([a-zA-Z_][a-zA-Z0-9_']*)/

const only = arg('--file')
const files = readdirSync(DIR).filter((f) => f.endsWith('.lean')).filter((f) => !only || f === only).sort()
const work = mkdtempSync(join(tmpdir(), 'perturb-'))

type Row = { file: string; thm: string; noticed: string[]; probes: number }
type Job = { file: string; lines: string[]; defIndex: number; name: string; to: bigint; comment: string
             thms: { name: string; line: number }[]; owner: (line: number) => string | null; noticed: Map<string, Set<string>> }
const jobs: Job[] = []
const fileOf = new Map<string, { thms: { name: string; line: number }[]; noticed: Map<string, Set<string>>; defs: number }>()
const rows: Row[] = []
let unprobed = 0, unusable = 0, filesWithDefs = 0

// ── SPLIT ACROSS LANES, COMBINED BY A FOLD THAT DOES NOT CARE WHEN ANYTHING FINISHED ────────────────────
//
// Every probe is one compile and they are independent: perturbing `ellP` tells you nothing about the probe
// of `tP`, and neither waits on the other. That is the shape a computation has to have before it may be
// split, and the second half of the shape is how the pieces come back together — `merkleFold` SORTS its
// leaves before combining, so the root is a function of the SET of outcomes and not of the order they
// arrived in. Run the same work over two lanes or over ten and the address is the same, which is what makes
// the split safe to trust rather than merely fast.
//
// The lane count is the one src/proof/lanes.lean decides: never zero, never more than the cores, and never
// more than the measured memory affords at ~2.9 GB per lean process. Those theorems are why raising it here
// is safe — and why it is bounded rather than set to the number of jobs.
const runAsync = promisify(execFile)
const compileAsync = async (path: string): Promise<number[]> => {
  try { await runAsync('lean', [path], { env: { ...process.env, LEAN_PATH: DIR } }); return [] }
  catch (e) {
    const out = String((e as { stdout?: string }).stdout ?? '') + String((e as { stderr?: string }).stderr ?? '')
    return [...out.matchAll(/^[^\s:]+:(\d+):\d+: error/gm)].map((m) => Number(m[1]))
  }
}

for (const f of files) {
  const src = readFileSync(`${DIR}/${f}`, 'utf8')
  const lines = src.split('\n')
  const defs = lines.map((l, i) => ({ m: l.match(DEF), i })).filter((x) => x.m) as { m: RegExpMatchArray; i: number }[]
  // Every theorem with the line it starts on, so an error line maps to the declaration containing it.
  const thms = lines.map((l, i) => ({ m: l.match(THM), i })).filter((x) => x.m)
    .map((x) => ({ name: (x.m as RegExpMatchArray)[1], line: x.i }))
  if (!thms.length) continue
  if (!defs.length) { unprobed += thms.length; continue }
  filesWithDefs++
  // A TOOL THAT SAYS NOTHING FOR EIGHT MINUTES IS INDISTINGUISHABLE FROM A HUNG ONE. Each file needs one
  // compile per definition per perturbation size, and planck alone is five definitions at ten seconds a
  // compile. Progress is printed as it goes, so a reader can see which file is being probed and stop
  // waiting on a guess about whether it is working.
  // Every (definition × size) is one independent compile. They are collected as JOBS here and run across
  // lanes below, rather than one after another inside this loop.
  const owner = (line: number) => {
    let best: string | null = null
    for (const t of thms) if (t.line <= line - 1) best = t.name
    return best
  }
  const noticed = new Map<string, Set<string>>(thms.map((t) => [t.name, new Set<string>()]))
  for (const d of defs) {
    const name = d.m[1], lit = BigInt(d.m[2])
    // ONE PERTURBATION IS NOT A PROBE, IT IS A GUESS ABOUT SCALE. A +1 on a seven-digit mantissa is 0.6 ppm,
    // below anything that rounds, and it reported 19 of planck's 27 theorems as noticing nothing — including
    // one that measures parts per million. Three sizes: one, a tenth, and double.
    const sizes = [...new Set([lit + 1n, lit + (lit / 10n > 0n ? lit / 10n : 1n), lit * 2n])]
    for (const to of sizes) jobs.push({ file: f, lines, defIndex: d.i, name, to, comment: d.m[3] ?? '', thms, owner, noticed })
  }
  fileOf.set(f, { thms, noticed, defs: defs.length })
}

// ── THE LANES, AND THE FOLD ─────────────────────────────────────────────────────────────────────────────
// PERTURB_LANES forces the count, which is how the order-independence is TESTED rather than asserted: run
// the same probes over one lane and over many, and the fold root must be identical. Without this the claim
// "the same at any lane count" could only be checked by luck.
const BUDGET = laneBudget({ perJobMB: 2900, procName: 'lean', envLanes: process.env.PERTURB_LANES })
const LANES = Math.max(1, Math.min(BUDGET.lanes, jobs.length))
console.log(`  ${jobs.length} independent probe(s) across ${LANES} lane(s): ${BUDGET.why}`)

// EACH LANE WRITES ITS OWN FILE. lean.ts records the same lesson: a variant path keyed on the source name
// alone collides the moment two lanes probe the same file, and one lane then compiles the other's mutation.
// The lane index is in the path.
let next = 0
const leaves: string[] = []
let done = 0
const t0 = Date.now()
await Promise.all(Array.from({ length: LANES }, async (_unused, lane) => {
  for (;;) {
    const i = next++
    if (i >= jobs.length) return
    const j = jobs[i]
    const variant = [...j.lines]
    variant[j.defIndex] = `def ${j.name} : Nat := ${j.to}${j.comment ? ' ' + j.comment : ''}`
    const path = join(work, `lane${lane}_${j.file}`)
    writeFileSync(path, variant.join('\n'))
    const errs = await compileAsync(path)
    // A PROBE THAT BREAKS BEFORE THE FIRST THEOREM MEASURES NOTHING — reading that as "everything noticed"
    // would turn a broken probe into a clean bill of health.
    const usable = !(errs.length && Math.min(...errs) < j.thms[0].line)
    if (usable) { for (const line of errs) { const o = j.owner(line); if (o) j.noticed.get(o)?.add(j.name) } }
    else unusable++
    // The leaf is a content-address of THIS probe's outcome. Folding the set of leaves gives a root that is
    // the same however the lanes were scheduled — which is the property that makes splitting safe, and is
    // checked by running the sweep at two different lane counts and comparing.
    leaves.push(toUuid(`${j.file}:${j.name}:${j.to}:${usable ? [...new Set(errs)].sort((a, b) => a - b).join(',') : 'unusable'}`))
    done++
    if (done % 10 === 0) process.stdout.write(`\r  ${done}/${jobs.length} probes …`)
  }
}))
process.stdout.write(`\r  ${done}/${jobs.length} probes in ${((Date.now() - t0) / 1000).toFixed(0)}s${' '.repeat(20)}\n`)

for (const [f, st] of fileOf) {
  for (const t of st.thms) rows.push({ file: f, thm: t.name, noticed: [...(st.noticed.get(t.name) ?? [])], probes: st.defs })
}
const root = merkleFold(leaves)

rmSync(work, { recursive: true, force: true })

const probed = rows.filter((r) => r.probes > 0)
const blind = probed.filter((r) => r.noticed.length === 0)
const pinned = probed.filter((r) => r.noticed.length > 0)

console.log(`  ${filesWithDefs} file(s) carry a perturbable \`def … : Nat := <literal>\` · ${probed.length} theorem(s) probed`)
console.log(`  ${pinned.length} NOTICED a perturbed definition — those pin the values they are about`)
console.log(`  ${blind.length} noticed none of the perturbations run against their file`)
console.log(`  ${unprobed} theorem(s) sit in files with no such def and were NOT MEASURED · ${unusable} probe(s) unusable`)
console.log(`  fold root ${root} — the same at any lane count, because merkleFold sorts its leaves`)

if (flag('--list')) {
  for (const r of blind) console.log(`    · ${r.file.replace(/\.lean$/, '').padEnd(14)} ${r.thm}`)
} else if (blind.length) {
  console.log(`\n  the first few, run with --list for all:`)
  for (const r of blind.slice(0, 12)) console.log(`    · ${r.file.replace(/\.lean$/, '').padEnd(14)} ${r.thm}`)
}

// REPORTED, NEVER ENFORCED. Noticing nothing under one +1 is a candidate, not a finding: the theorem may
// pin something this probe cannot move. A gate that failed the release on that would be condemning
// theorems on an instrument that cannot tell the two apart, which is the error it exists to look for.
console.log(`\n○ perturb: reported, not enforced. Noticing nothing under a +1 is a CANDIDATE for deciding`)
console.log(`  nothing about its values — not a verdict. Read each one; the question is whether its literal`)
console.log(`  could ever have been otherwise.`)
