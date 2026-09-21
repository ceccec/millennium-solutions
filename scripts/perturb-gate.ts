#!/usr/bin/env node
/** ── PERTURBATION — does a theorem NOTICE the values it is about? ──────────────────────────────────────
 *
 *  scripts/vacuity.ts rejects a theorem whose quantifier ranges over nothing, and says plainly what it
 *  cannot reach: "344 theorem(s) quantify over nothing at all — a concrete equality has no domain to be
 *  empty — those are NOT claimed as checked." That is 35% of the corpus, declared unchecked by the check
 *  that exists for deciding nothing.
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
import { execFileSync } from 'node:child_process'
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
const rows: Row[] = []
let unprobed = 0, unusable = 0, filesWithDefs = 0

const compile = (path: string): number[] => {
  try { execFileSync('lean', [path], { env: { ...process.env, LEAN_PATH: DIR }, stdio: 'pipe' }); return [] }
  catch (e) {
    const out = String((e as { stdout?: Buffer }).stdout ?? '') + String((e as { stderr?: Buffer }).stderr ?? '')
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
  process.stdout.write(`  probing ${f.padEnd(20)} ${defs.length} def(s) × 3 size(s) …`)
  const t0 = Date.now()
  const owner = (line: number) => {
    let best: string | null = null
    for (const t of thms) if (t.line <= line - 1) best = t.name
    return best
  }
  const noticed = new Map<string, Set<string>>(thms.map((t) => [t.name, new Set<string>()]))
  let probes = 0
  for (const d of defs) {
    const name = d.m[1], lit = BigInt(d.m[2])
    // ONE PERTURBATION IS NOT A PROBE, IT IS A GUESS ABOUT SCALE. The first version moved each literal by
    // +1 and reported 19 of planck's 27 theorems as noticing nothing — including
    // `the_three_planck_units_share_one_relative_uncertainty`, which computes parts per million:
    // 18 × 10⁶ / 1616255 is 11, and so is 18 × 10⁶ / 1616256. A +1 on a seven-digit mantissa is 0.6 ppm,
    // below anything that rounds, so the probe could not move what those theorems measure. Sound theorems,
    // reported as candidates for deciding nothing, by an instrument too weak to disturb them.
    //
    // Three sizes now — one, a tenth, and double — and a theorem counts as having noticed if ANY of them
    // reaches it. A theorem that survives all three is a stronger candidate than one that survived a nudge,
    // and still only a candidate.
    const sizes = [lit + 1n, lit + (lit / 10n > 0n ? lit / 10n : 1n), lit * 2n]
    const errs: number[] = []
    let anyUsable = false
    for (const to of [...new Set(sizes)]) {
      const variant = [...lines]
      variant[d.i] = `def ${name} : Nat := ${to}${d.m[3] ? ' ' + d.m[3] : ''}`
      const path = join(work, f)
      writeFileSync(path, variant.join('\n'))
      const e = compile(path)
      if (e.length && Math.min(...e) < thms[0].line) continue   // broken probe, measures nothing
      anyUsable = true
      errs.push(...e)
    }
    if (!anyUsable) { unusable++; continue }
    probes++
    for (const line of errs) { const o = owner(line); if (o) noticed.get(o)?.add(name) }
  }
  for (const t of thms) rows.push({ file: f, thm: t.name, noticed: [...(noticed.get(t.name) ?? [])], probes })
  const seen = thms.filter((t) => (noticed.get(t.name)?.size ?? 0) > 0).length
  console.log(` ${((Date.now() - t0) / 1000).toFixed(0)}s · ${seen}/${thms.length} noticed`)
}
rmSync(work, { recursive: true, force: true })

const probed = rows.filter((r) => r.probes > 0)
const blind = probed.filter((r) => r.noticed.length === 0)
const pinned = probed.filter((r) => r.noticed.length > 0)

console.log(`  ${filesWithDefs} file(s) carry a perturbable \`def … : Nat := <literal>\` · ${probed.length} theorem(s) probed`)
console.log(`  ${pinned.length} NOTICED a perturbed definition — those pin the values they are about`)
console.log(`  ${blind.length} noticed none of the perturbations run against their file`)
console.log(`  ${unprobed} theorem(s) sit in files with no such def and were NOT MEASURED · ${unusable} probe(s) unusable`)

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
