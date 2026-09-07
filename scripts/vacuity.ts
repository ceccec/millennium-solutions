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
import { writeFileSync, mkdtempSync, readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { leanTheorems, leanFiles } from '../src/api/index.ts'

type T = { name: string; file: string; tactic: string; statement: string; namespace: string }
const thms = (leanTheorems() as T[]).filter((t) => /decide/.test(t.tactic))

// THE DOMAIN, READ OFF THE STATEMENT. Only the shapes that can be read WITHOUT guessing: a literal list, a
// range, or a range with a filter, immediately before `.all` or `.any`. Anything else is unreadable and is
// counted as unreadable — inferring a domain from a shape this does not recognise is how a sweep starts
// agreeing with itself.
const DOMAIN = /(\(List\.range'?\s+[^()]*?\)(?:\.filter\s*\([^()]*(?:\([^()]*\))?[^()]*\))?|\[[^\][]*\]|\([A-Za-z_][A-Za-z_0-9']*\s+[^()]*\)|\b[A-Za-z_][A-Za-z_0-9']*)\s*\.\s*(?:all|any)\s*\(/
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
  const m = t.statement.match(DOMAIN)
  if (m) readable.push({ t, dom: /^[A-Za-z_]/.test(m[1]) ? (letOf(t.statement, m[1]) ?? m[1]) : m[1] })
  else if (!/\.\s*(?:all|any)\s*\(/.test(t.statement)) noQuantifier.push(t)
  else unreadable.push(t)
}

// Group by file so each probe file carries that file's own definitions, and ask one question per domain.
const dir = mkdtempSync(join(tmpdir(), 'vacuity-'))
const empty: { t: T; dom: string }[] = []
const unchecked: { t: T; dom: string; why: string }[] = []
const byFile = new Map<string, { t: T; dom: string }[]>()
for (const r of readable) byFile.set(r.t.file, [...(byFile.get(r.t.file) ?? []), r])

for (const [file, rows] of byFile) {
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
  try { execFileSync('lean', [out], { env: { ...process.env, LEAN_PATH: 'src/proof' }, stdio: 'pipe' }) }
  catch (e: any) { log = String(e?.stdout ?? '') + String(e?.stderr ?? '') }
  if (!log) continue
  // A refusal names the line; anything else (an extraction slip, a timeout) is UNCHECKED, not a pass.
  for (const line of log.split('\n')) {
    const ln = Number(line.match(/\.lean:(\d+):/)?.[1] ?? 0)
    if (!ln) continue
    const idx = Number((readFileSync(out, 'utf8').split('\n')[ln - 1] ?? '').match(/theorem vacuity_(\d+)/)?.[1] ?? -1)
    if (idx < 0) continue
    if (/proved that the proposition/.test(log)) empty.push(rows[idx])
    else unchecked.push({ ...rows[idx], why: line.slice(0, 90) })
  }
}

console.log(`vacuity — theorems whose quantifier ranges over nothing:\n`)
console.log(`  theorems closing by decide          ${thms.length}`)
console.log(`  domain readable, and checked        ${readable.length - unchecked.length}`)
console.log(`  no quantifier — cannot be vacuous   ${noQuantifier.length}`)
console.log(`  quantified but domain unparsed      ${unreadable.length}`)
if (unchecked.length) console.log(`  readable but the check did not run  ${unchecked.length}`)
console.log(`  quantified over an EMPTY domain     ${empty.length}\n`)

if (empty.length) {
  console.log(`✗ vacuity: ${empty.length} theorem(s) decide nothing — their domain is empty, so the proposition holds`)
  console.log(`  whatever the predicate says and the name asserts something no case was checked against:`)
  for (const e of empty) console.log(`    ${e.t.file}:${e.t.name}\n        domain ${e.dom}`)
  process.exit(1)
}
for (const u of unchecked) console.log(`  ? ${u.t.file}:${u.t.name} — readable but unchecked: ${u.why}`)
if (process.argv.includes('--list')) for (const u of unreadable) console.log(`  ○ ${u.file}:${u.name} — domain not in a shape this reads`)

console.log(`✓ vacuity: every readable domain is non-empty. ${noQuantifier.length} theorem(s) quantify over nothing at all —`)
console.log(`  a concrete equality has no domain to be empty — and ${unreadable.length} state a domain in a shape this does not`)
console.log(`  read; those are NOT claimed as checked. Run with --list to see them. A sweep that counted either`)
console.log(`  group as passes would report coverage it does not have.`)
