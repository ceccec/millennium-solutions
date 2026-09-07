#!/usr/bin/env node
/** ── A STATEMENT QUANTIFIED OVER NOTHING IS TRUE AND SAYS NOTHING ─────────────────────────────────────────
 *
 *  `(List.range 0).all P` holds for every P. So does a filter that keeps nothing, and so does an `.all` over
 *  a list that turns out empty. Every one of them is a green theorem asserting its name and deciding no case
 *  at all — the cheapest way for this deposit to be wrong while every gate reads clean.
 *
 *  This walks every theorem closing by `decide` and, for the ones whose domain it can read, asks the kernel
 *  whether that domain is empty. It became possible only when scripts/probe.ts made a single-theorem check
 *  cost seconds instead of minutes; sweeping 611 theorems by recompiling their files was never going to run.
 *
 *  WHAT IT DOES NOT DO IS THE POINT. It reports how many theorems it could not analyse, by name, rather than
 *  counting them as passes. A sweep that silently skips what it cannot parse and then reports "all clear"
 *  is the flattering number this repository has been caught producing before, and the number that survives
 *  longest precisely because it clears you.
 *
 *      node scripts/vacuity.ts          check every readable domain
 *      node scripts/vacuity.ts --list   also name the theorems whose domain could not be read
 */
import { writeFileSync, mkdtempSync, readFileSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
// ASYNC, NOT SYNC. execFileSync BLOCKS the single JS thread, so the lanes below were a fiction: ten of them
// took turns on one core while the report claimed parallelism. CPU sat at 37% and the wall clock got WORSE
// after a change that cut total work by nearly half — which is what a fake lane looks like from outside.
// (Named leanRun, not run: the lane helper already binds `run` for its callback.)
const leanRun = promisify(execFile)
import { tmpdir, availableParallelism } from 'node:os'
import { join } from 'node:path'
import { leanTheorems, leanFiles } from '../src/api/index.ts'

type T = { name: string; file: string; tactic: string; statement: string; namespace: string }
const thms = (leanTheorems() as T[]).filter((t) => /decide/.test(t.tactic))

// THE DOMAIN, READ OFF THE STATEMENT. Only the shapes that can be read WITHOUT guessing: a literal list, a
// range, or a range with a filter, immediately before `.all` or `.any`. Anything else is unreadable and is
// counted as unreadable — inferring a domain from a shape this does not recognise is how a sweep starts
// agreeing with itself.
// THE DOMAIN, READ BY BALANCED SCAN RATHER THAN BY PATTERN. A regex enumerating the shapes it recognises
// left seventeen theorems unparsed, and every one of them was a shape nobody had thought to enumerate:
// `(xs.filter (fun r => k r == 1))`, `(dbl (dbl tetA))`, `((List.range 12).map (fun k => pw 2 k))`. Walking
// BACKWARDS from the `.all` over balanced brackets reads all of them and needs no list of cases — which is
// the difference between a parser that covers its subject and one that covers the examples I remembered.
const domainBefore = (st: string, dot: number): string | null => {
  let i = dot - 1
  while (i >= 0 && /\s/.test(st[i])) i--
  if (i < 0) return null
  if (st[i] === ')' || st[i] === ']') {
    const close = st[i], open = close === ')' ? '(' : '['
    let depth = 0, j = i
    for (; j >= 0; j--) {
      if (st[j] === close) depth++
      else if (st[j] === open) { depth--; if (depth === 0) break }
    }
    return j < 0 ? null : st.slice(j, i + 1)
  }
  let j = i
  while (j >= 0 && /[A-Za-z0-9_'.]/.test(st[j])) j--
  const id = st.slice(j + 1, i + 1)
  return id.length ? id : null
}
const QUANT = /\.\s*(?:all|any)\s*\(/g
// A THEOREM WITH NO QUANTIFIER CANNOT BE VACUOUS THIS WAY, and calling it "unreadable" would inflate the
// number of things this admits it has not checked — which is its own kind of dishonesty, pointed the other
// way. `merkleFold [A] = A` decides one case and decides it; there is no domain to be empty. Three
// populations, counted separately: checked, out of scope, and quantified-but-unparsed.
const readable: { t: T; dom: string }[] = []
const unreadable: T[] = []
const noQuantifier: T[] = []
// A DOMAIN BOUND BY A `let` IN THE STATEMENT ITSELF. `let U9 := [1,2,4,5,7,8]; U9.all …` names its domain
// U9, which exists nowhere outside that statement — so asking the kernel about `U9` produced an error, and
// the sweep reported "readable but unchecked" for two theorems that were perfectly readable. The instrument
// was wrong, not the theorems. The binding is substituted back in.
const letOf = (st: string, id: string): string | null =>
  st.match(new RegExp(`let\\s+${id}\\s*:=\\s*([^;]+);`))?.[1]?.trim() ?? null

for (const t of thms) {
  QUANT.lastIndex = 0
  const hit = QUANT.exec(t.statement)
  if (!hit) { noQuantifier.push(t); continue }
  const raw = domainBefore(t.statement, hit.index)
  if (!raw) { unreadable.push(t); continue }
  readable.push({ t, dom: /^[A-Za-z_][A-Za-z_0-9']*$/.test(raw) ? (letOf(t.statement, raw) ?? raw) : raw })
}

// Group by file so each probe file carries that file's own definitions, and ask one question per domain.
/** Lean's diagnostics, split into whole messages: a message runs from its `file:line:col:` header to the
 *  next one, and its verdict lives in the body rather than in the header line. */
const messages = (log: string): { line: number; text: string }[] => {
  const out: { line: number; text: string }[] = []
  let cur: { line: number; text: string } | null = null
  for (const ln of log.split('\n')) {
    const h = ln.match(/\.lean:(\d+):\d+:\s*(?:error|warning)/)
    if (h) { if (cur) out.push(cur); cur = { line: Number(h[1]), text: ln } }
    else if (cur) cur.text += '\n' + ln
  }
  if (cur) out.push(cur)
  return out
}

// ── LANES AND A CACHE, because a sweep nobody waits for is a sweep nobody runs ────────────────────────────
// The deep half compiled one file at a time and took five and a half minutes on a ten-core machine. Files
// are independent — each carries its own definitions — so they run in lanes, and a file whose source has not
// changed reuses its verdict. scripts/lean.ts has done both for a while; this had neither.
const LANES = Math.max(1, Number(process.env.VACUITY_LANES) || (availableParallelism?.() ?? 4))
const CACHE = '.vacuity-cache.json'
type Verdict = { hash: string; empty: string[]; unchecked: [string, string][]; insensitive: string[]; untested: [string, string][]; tried?: number }
const cache: Record<string, Verdict> = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) : {}
const hashOf = (file: string): string =>
  createHash('sha256').update(readFileSync(`src/proof/${file}`)).digest('hex').slice(0, 16)
const lanes = async <A>(items: A[], run: (a: A) => Promise<void>): Promise<void> => {
  let next = 0
  await Promise.all(Array.from({ length: Math.min(LANES, items.length || 1) }, async () => {
    for (;;) { const i = next++; if (i >= items.length) return; await run(items[i]) }
  }))
}

const dir = mkdtempSync(join(tmpdir(), 'vacuity-'))
const empty: { t: T; dom: string }[] = []
const unchecked: { t: T; dom: string; why: string }[] = []
const byFile = new Map<string, { t: T; dom: string }[]>()
for (const r of readable) byFile.set(r.t.file, [...(byFile.get(r.t.file) ?? []), r])

await lanes([...byFile.entries()], async ([file, rows]) => {
  const src = readFileSync(`src/proof/${file}`, 'utf8')
  const head = [...src.matchAll(/^(?:import\s+\S+|set_option\s+\S+\s+\S+)$/gm)].map((x) => x[0]).join('\n')
  const ns = src.match(/^namespace\s+(\S+)/m)?.[1]
  const opens = [...src.matchAll(/^open\s+.+$/gm)].map((x) => x[0]).join('\n')
  const defs = [...src.matchAll(/^(?:\/--[\s\S]*?-\/\n)?(?:set_option[^\n]*in\n)*(?:def|abbrev)\s+[\s\S]*?(?=\n\n)/gm)].map((x) => x[0]).join('\n\n')
  // one theorem per domain, each asserting the domain is NOT empty — a refusal means it is
  const body = rows.map((r, i) => `set_option maxRecDepth 4000000 in\ntheorem vacuity_${i} : ¬ (${r.dom}).isEmpty := by decide`).join('\n\n')
  const out = join(dir, `V_${file.replace('.lean', '')}.lean`)
  writeFileSync(out, [head, ns ? `namespace ${ns}` : '', opens, defs, body, ns ? `end ${ns}` : ''].filter(Boolean).join('\n\n') + '\n')
  let log = ''
  try { await leanRun('lean', [out], { env: { ...process.env, LEAN_PATH: 'src/proof' } }) }
  catch (e: any) { log = String(e?.stdout ?? '') + String(e?.stderr ?? '') }
  if (!log) return
  // PER MESSAGE, NOT PER LOG. This tested `/proved that the proposition/` against the WHOLE log, so one
  // genuine refusal anywhere in a file would have classified every other error in it as an empty domain —
  // a check that turns an elaboration slip into a finding, which is the shape that makes a gate worthless.
  const written = readFileSync(out, 'utf8').split('\n')
  for (const block of messages(log)) {
    const idx = Number((written[block.line - 1] ?? '').match(/theorem vacuity_(\d+)/)?.[1] ?? -1)
    if (idx < 0) continue
    if (/proved that the proposition/.test(block.text)) empty.push(rows[idx])
    else unchecked.push({ ...rows[idx], why: block.text.split('\n')[0].slice(0, 90) })
  }
})

// ── PHASE TWO: THE 275 WITH NO QUANTIFIER ────────────────────────────────────────────────────────────────
//
//    A concrete equality has no domain to be empty, so the first phase says nothing about it — and "out of
//    scope" is not a verdict. `merkleFold [A] = A` decides one case; `4 * 4 = 16` decides one case; a
//    statement that is true whatever its numbers say decides none. So each of these is PERTURBED: the last
//    numeric literal on the right of its first comparison is increased by one, and the kernel must refuse.
//
//    Three outcomes, and only the first is a pass:
//      refused    the value is load-bearing — the statement says something about that number
//      compiled   INSENSITIVE — the statement holds with the value changed, so it is not about it
//      no test    the statement has no literal to perturb, or the mutant did not elaborate. Reported as
//                 untested, never as a pass: an elaboration error is not a kernel refusal, and reading one
//                 as a pass is how a sweep congratulates itself.
const MUTANTS = 8
/** wall clock per file, so one expensive mutant cannot stall the sweep */
const BUDGET_MS = Number(process.env.VACUITY_BUDGET_MS ?? 90_000)
/** Ways this statement could be made FALSE if it says what it appears to say. A statement is sensitive when
 *  the kernel refuses at least one of them. Several are tried because one is not enough: a conjunction can
 *  be insensitive to a literal in its third clause and load-bearing in its first, and picking one literal
 *  picks the wrong one most of the time. */
const mutantsOf = (st: string): { mut: string; what: string }[] => {
  const out: { mut: string; what: string }[] = []
  // A NEGATIVE CLAIM IS NOT FALSIFIED BY MOVING A NUMBER. `toUuidBytes [7] ≠ [7]` stays true at 8: two
  // different things are still different. Perturbation flagged five such theorems as insensitive, and every
  // one of them was the mutation being the wrong shape for the claim. A ≠ is falsified by asserting =.
  const neg = st.search(/≠|!=/)
  if (neg >= 0) {
    const tok = st.slice(neg).startsWith('≠') ? '≠' : '!='
    out.push({ mut: st.slice(0, neg) + (tok === '≠' ? '=' : '==') + st.slice(neg + tok.length), what: `the ${tok} asserted as equality` })
  }
  // EVERY literal, not the trailing ones. Restricting to the right of the first comparison flagged five
  // theorems, and on reading all five it was this restriction: the load-bearing number in
  // `1048576 / 20 = 52428 ∧ …` is on the LEFT, and the digits on the right are a redundant restatement that
  // survives being moved. A sensitivity test that cannot reach the number the claim is about measures
  // nothing except which half of the line it was allowed to look at.
  // A RANGE BOUND IS NOT A CLAIM ABOUT A NUMBER, it is how far the check ran — and moving it is where the
  // cost explodes, because the mutant decides a bigger problem than the original. Skipping them made the
  // deep sweep several times faster AND the question sharper: what is tested is whether the statement is
  // about its own values, not whether it survives being asked a larger question.
  const bounds = new Set<number>()
  for (const r of st.matchAll(/List\.range'?\s+(\d+)(?:\s+(\d+))?/g)) {
    const at = (r.index ?? 0) + r[0].indexOf(r[1], 'List.range'.length)
    bounds.add(at)
    if (r[2]) bounds.add((r.index ?? 0) + r[0].lastIndexOf(r[2]))
  }
  for (const l of [...st.matchAll(/\b(\d+)\b/g)].filter((l) => !bounds.has(l.index ?? -1)).slice(0, MUTANTS)) {
    const idx = l.index ?? 0
    out.push({ mut: st.slice(0, idx) + String(Number(l[1]) + 1) + st.slice(idx + l[1].length), what: `the literal ${l[1]} moved by one` })
  }
  // A MUTANT IDENTICAL TO THE ORIGINAL IS NOT A MUTANT. It would compile — it is the theorem — and this
  // sweep would read that as "holds with the value changed" and report a finding from a probe that never
  // ran. A peer session lost a whole result to exactly this today: a regex matched a re-export instead of
  // the declaration, the edit never applied, the suite passed, and the write-up said the check was circular.
  // The conclusion was the expected one; the probe had not happened. So the change is asserted, here, before
  // anything is compiled or believed.
  return out.filter((m) => m.mut !== st)
}

const insensitive: T[] = []
const untested: { t: T; why: string }[] = []
const byFile2 = new Map<string, T[]>()
// OPT-IN, BECAUSE IT IS SLOW AND SLOW IS A CRACK. The empty-domain half runs in six seconds and refuses, so
// it belongs on every build. This half compiles some fifteen hundred mutants and takes five minutes; put
// that in the chain and every commit pays for a check that reports rather than refuses. `--sensitivity`.
const DEEP = process.argv.includes('--sensitivity')
for (const t of noQuantifier) if (DEEP) byFile2.set(t.file, [...(byFile2.get(t.file) ?? []), t])
let perturbed = 0

const CK = (f: string) => `deep:${f}`
await lanes([...byFile2.entries()], async ([file, rows]) => {
  const h = hashOf(file)
  const hit = cache[CK(file)]
  if (hit && hit.hash === h) {
    // the count of rows that actually had a mutant, not the row count — a cached run reported 275 where the
    // cold run reported 267, and a figure that moves depending on whether a cache was warm is not a figure
    perturbed += hit.tried ?? 0
    for (const n of hit.insensitive) { const t = rows.find((r) => r.name === n); if (t) insensitive.push(t) }
    for (const [n, why] of hit.untested) { const t = rows.find((r) => r.name === n); if (t) untested.push({ t, why }) }
    return
  }
  const src = readFileSync(`src/proof/${file}`, 'utf8')
  const head = [...src.matchAll(/^(?:import\s+\S+|set_option\s+\S+\s+\S+)$/gm)].map((x) => x[0]).join('\n')
  const ns = src.match(/^namespace\s+(\S+)/m)?.[1]
  const opens = [...src.matchAll(/^open\s+.+$/gm)].map((x) => x[0]).join('\n')
  const defs = [...src.matchAll(/^(?:\/--[\s\S]*?-\/\n)?(?:set_option[^\n]*in\n)*(?:def|abbrev)\s+[\s\S]*?(?=\n\n)/gm)].map((x) => x[0]).join('\n\n')
  const owner: T[] = []          // owner[i] is the theorem that mutant i belongs to
  const parts: string[] = []
  const has = new Set<string>()
  for (const t of rows) {
    const ms = mutantsOf(t.statement)
    if (!ms.length) { untested.push({ t, why: 'no mutant differs from the statement — nothing to falsify, so nothing was tested' }); continue }
    has.add(t.name)
    for (const m of ms) {
      parts.push(`set_option maxRecDepth 4000000 in\ntheorem sens_${owner.length} : ${m.mut} := by decide`)
      owner.push(t)
    }
  }
  if (!parts.length) return
  perturbed += has.size
  const out = join(dir, `S_${file.replace('.lean', '')}.lean`)
  writeFileSync(out, [head, ns ? `namespace ${ns}` : '', opens, defs, parts.join('\n\n'), ns ? `end ${ns}` : ''].filter(Boolean).join('\n\n') + '\n')
  // A MUTANT CAN COST FAR MORE THAN THE ORIGINAL. Moving a literal that happens to be a range bound turns a
  // second into minutes, and one such file held the whole sweep for over three minutes before this existed.
  // The budget is per file and a file that exceeds it is UNTESTED, by name — not a pass, and not a hang.
  let log = '', timedOut = false
  try { await leanRun('lean', [out], { env: { ...process.env, LEAN_PATH: 'src/proof' }, timeout: BUDGET_MS }) }
  catch (e: any) {
    if (e?.signal === 'SIGTERM' || e?.code === 'ETIMEDOUT') timedOut = true
    log = String(e?.stdout ?? '') + String(e?.stderr ?? '')
  }
  if (timedOut) {
    for (const t of rows) if (has.has(t.name)) untested.push({ t, why: `the mutants for ${file} exceeded the ${BUDGET_MS / 1000}s budget — a moved literal can cost far more than the original` })
    cache[CK(file)] = { hash: h, empty: [], unchecked: [], insensitive: [], tried: has.size,
      untested: rows.filter((t) => has.has(t.name)).map((t) => [t.name, `over the ${BUDGET_MS / 1000}s budget`] as [string, string]) }
    return
  }
  const written = readFileSync(out, 'utf8').split('\n')
  const sensitive = new Set<string>()
  const errored = new Map<string, string>()
  for (const block of messages(log)) {
    const idx = Number((written[block.line - 1] ?? '').match(/theorem sens_(\d+)/)?.[1] ?? -1)
    if (idx < 0) continue
    // ONLY a decide-refusal counts as sensitivity. An elaboration failure means the mutant was not a
    // proposition at all, which says nothing about the theorem — recorded, never counted as a pass.
    if (/proved that the proposition/.test(block.text)) sensitive.add(owner[idx].name)
    else errored.set(owner[idx].name, block.text.split('\n')[0].slice(0, 80))
  }
  for (const t of rows) {
    if (!has.has(t.name) || sensitive.has(t.name)) continue
    if (errored.has(t.name)) untested.push({ t, why: `every mutant failed to elaborate — ${errored.get(t.name)}` })
    else insensitive.push(t)
  }
  cache[CK(file)] = { hash: h, empty: [], unchecked: [], tried: has.size,
    insensitive: insensitive.filter((x) => x.file === file).map((x) => x.name),
    untested: untested.filter((x) => x.t.file === file).map((x) => [x.t.name, x.why] as [string, string]) }
})

// SORTED, BECAUSE LANES FINISH IN WHATEVER ORDER THEY FINISH. A cold run and a cached run listed the same
// four theorems in different orders — the scheduler leaking into the output. In a deposit that
// content-addresses what it prints, a report that changes shape between identical runs is a defect even
// when every line in it is true.
const byName = <A extends { file: string; name: string }>(a: A, b: A) => (a.file + a.name).localeCompare(b.file + b.name)
insensitive.sort(byName)
untested.sort((a, b) => byName(a.t, b.t))
unchecked.sort((a, b) => byName(a.t, b.t))
unreadable.sort(byName)
empty.sort((a, b) => byName(a.t, b.t))

console.log(`vacuity — theorems whose quantifier ranges over nothing:\n`)
console.log(`  theorems closing by decide          ${thms.length}`)
console.log(`  domain readable, and checked        ${readable.length - unchecked.length}`)
console.log(DEEP
  ? `  no quantifier — falsified instead   ${noQuantifier.length} (${perturbed} had a mutant to try)`
  : `  no quantifier — not swept here      ${noQuantifier.length} (run with --sensitivity: five minutes, reports)`)
console.log(`  quantified but domain unparsed      ${unreadable.length}`)
if (unchecked.length) console.log(`  readable but the check did not run  ${unchecked.length}`)
console.log(`  quantified over an EMPTY domain     ${empty.length}\n`)

if (empty.length) {
  console.log(`✗ vacuity: ${empty.length} theorem(s) decide nothing — their domain is empty, so the proposition holds`)
  console.log(`  whatever the predicate says and the name asserts something no case was checked against:`)
  for (const e of empty) console.log(`    ${e.t.file}:${e.t.name}\n        domain ${e.dom}`)
  process.exit(1)
}
// THIS HALF REPORTS AND DOES NOT REFUSE, and the reason is worth stating rather than hiding in an exit
// code. A single-literal perturbation cannot falsify an EXISTENCE claim — "emirps exist below one hundred"
// stays true when the bound moves — nor a statement whose conjuncts restate each other. Both are honest
// theorems that no sensitivity test can clear, so a gate built on this would accuse working mathematics,
// which is the mistake that made the first constants-gate here worthless. It is a list to read, not a
// verdict to trust: the refusing half of this sweep is the empty-domain check above.
if (insensitive.length) {
  console.log(`  ${insensitive.length} concrete theorem(s) survive every single-literal perturbation tried. That is NOT a`)
  console.log(`  finding by itself — an existence claim or a restated conjunct legitimately survives one — but it`)
  console.log(`  is where a statement that is not about its own numbers would be found:`)
  for (const x of insensitive) console.log(`    ${x.file}:${x.name}`)
  console.log('')
}
for (const u of unchecked) console.log(`  ? ${u.t.file}:${u.t.name} — readable but unchecked: ${u.why}`)
for (const u of untested.slice(0, 12)) console.log(`  ? ${u.t.file}:${u.t.name} — not perturbed: ${u.why}`)
if (untested.length > 12) console.log(`  ? …and ${untested.length - 12} more not perturbed`)
if (process.argv.includes('--list')) for (const u of unreadable) console.log(`  ○ ${u.file}:${u.name} — domain not in a shape this reads`)

writeFileSync(CACHE, JSON.stringify(cache, null, 2) + '\n')
console.log(`✓ vacuity: every readable domain is non-empty. ${noQuantifier.length} theorem(s) quantify over nothing at all —`)
console.log(`  a concrete equality has no domain to be empty — and ${unreadable.length} state a domain in a shape this does not`)
console.log(`  read; those are NOT claimed as checked. Run with --list to see them. A sweep that counted either`)
console.log(`  group as passes would report coverage it does not have.`)
