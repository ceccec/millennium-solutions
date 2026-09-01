#!/usr/bin/env node
// RETIRE-LEXICAL — separate "no proof yet" from "tests a component that was deleted".
//
// The ledger holds two kinds of withdrawn claim and they were filed under one reason. A claim that lacks a
// Lean proof may get one tomorrow — scripts/fold.ts exists precisely because twenty-seven of them did. A
// claim whose test asserts that the LEXICAL honesty gate drained a named boast can never come back: that
// layer (word-lists in 22 languages, a Glagolitic table, negation-parity scoring) was removed by order, the
// live gate only asks whether a cited theorem is sealed, and `computes('this is faster than light')` now
// answers 1. The boast did not become honest — the gate stopped looking, which scripts/gate-corpus.ts
// records as a measured limit. But a test that asserts the drain is no longer testing anything, and filing
// it beside "portable to Lean" reads as though a prover could rescue it. Nothing can.
//
// Nothing is deleted and nothing is un-revoked. The ledger is append-only: a withdrawn entry keeps its key
// and its receipt, and gains a reason that says what actually happened. Rewriting a receipt is TAMPER by
// this deposit's own forensics; `reason` is not chained, so recording one is not.
//
// MEASURED, NOT READ OFF THE NAMES. A key called gate_hard_in_dimension_ru tells you nothing about what its
// test asserts, and the reason written here must be true of the test, not of the title. So each revoked
// entry's candidate is RUN, with the gate instrumented to record every text it is asked about, and an entry
// is only retired on one of two witnesses:
//
//   FALSIFIED   its source asserts computes('<boast>').binary === 0, and the live gate, run here on that
//               exact text, answers 1. The assertion is decidably false today.
//   COUNTERFACTUAL  the test fails today and passes under a gate that DRAINS one or more of the texts it
//               feeds. Only a draining gate satisfies it — the power the lexical layer had and this one
//               does not. Used for tests that build their boasts at runtime, where no literal can be read.
//
// A failing test with neither witness is REPORTED and left alone. Its failure might be arithmetic, or a
// helper, or something nobody has looked at; guessing would put a sentence in the permanent record that
// nobody measured. That is the one thing this script must never do.
//
// It also checks the CONVERSE on every run: an entry already carrying the lexical reason whose test now
// PASSES would mean the reason overstates — the gate would have regained the power to drain, exactly the
// event gate-corpus.ts watches for. That is reported loudly and never silently rewritten; a person decides.
//
// WHAT IT FOUND ON ITS FIRST RUN, which is the reason it now exists as a check rather than a migration:
// 455 entries have a witness and ALL 455 already carried the reason — the by-hand pass in commit e6bb01bb5
// got the set exactly right, and there was nothing to write. 1407 revoked entries still PASS their test
// under the live gate; they are withdrawn for lacking a Lean proof, which is a different and still-correct
// reason, and this script must never touch them. Two failures have no witness and are left as reported:
// rosetta_manifests_messaging_in_seven_dimensions feeds the gate more texts than the search is allowed to
// enumerate, and the_verdict_is_deterministic_and_receipted asserts adjudicate(…).verdict === 'REFUTED' for
// a statement with no decidable test — adjudicate returns UNVERIFIED there whatever the gate says, so no
// gate satisfies it and the failure is not the gate's to own.
//
// Run: node scripts/retire-lexical.ts           measure and report, write nothing
//      node scripts/retire-lexical.ts --write   also record the reason on entries that lack it
import { readFileSync, writeFileSync } from 'node:fs'
import { registerHooks, type LoadFnOutput, type LoadHookContext } from 'node:module'
import { ledger as __ledger } from '../src/api/index.ts'
import { isLive as __isLive, isWithdrawn as __isWithdrawn } from '../src/api/index.ts'

// INSTRUMENT THE GATE, DO NOT EDIT IT. scripts/honesty-gate.ts is a bare re-export of the packaged gate; this
// hook swaps in a wrapper that records each text and, when an oracle is installed, answers from the oracle
// instead. It is loaded in-process before discover.ts, so nothing on disk changes and no other script sees it.
// The oracle is what makes the counterfactual a measurement rather than an opinion.
type Ask = { binary: 0 | 1; hit: string | null }
const g = globalThis as unknown as { __asked: string[]; __oracle: ((t: string) => 0 | 1 | null) | null }
g.__asked = []
g.__oracle = null
registerHooks({
  load(url: string, context: LoadHookContext, next: (u: string, c: LoadHookContext) => LoadFnOutput): LoadFnOutput {
    if (!url.endsWith('/scripts/honesty-gate.ts')) return next(url, context)
    return {
      format: 'module',
      shortCircuit: true,
      source: `import { computes as _c, reveal, slimGate, THEOREMS, theoremByKey } from '@uuidna/uuidna'
export const computes = (t) => {
  globalThis.__asked.push(t)
  const b = globalThis.__oracle ? globalThis.__oracle(t) : null
  return b === null ? _c(t) : { binary: b, hit: b ? null : 'oracle' }
}
export { reveal, slimGate, THEOREMS, theoremByKey }
`,
    }
  },
})

const { CANDIDATES } = await import('./discover.ts') as { CANDIDATES: { key: string; name: string; test: () => boolean }[] }
const { computes } = await import('./honesty-gate.ts') as { computes: (t: string) => Ask }

const LEDGER = 'src/proof/discovered.json'
type Entry = { key: string; name: string; receipt: string; revoked?: boolean; reason?: string; supersededBy?: string }
const ledger: Entry[] = __ledger()
const byKey = new Map(ledger.map((e) => [e.key, e]))
const write = process.argv.includes('--write')

// The reason a by-hand pass (commit e6bb01bb5) already recorded on most of this set. Reused verbatim so the
// class stays greppable as one class, with the witness this run measured appended after it.
const CLASS = 'revoked in place: its test asserted a lexical drain (computes(boast).binary === 0). The word-list gate was removed by order, so there is no lexicon to drain and the assertion tests nothing.'
// AN ENTRY IS ALREADY FILED CORRECTLY IF ITS REASON NAMES THE REMOVED LEXICAL GATE — in whatever words. Twelve
// entries carry a second, more specific wording ("circular by construction AND dependent on the removed
// lexical gate") that says everything CLASS says and one thing more. Matching on the exact CLASS string
// would have overwritten them and thrown the circularity away; that is not a retirement, it is a downgrade.
const isLexicalReason = (r?: string) => !!r && /lexical/i.test(r) && /remov/i.test(r)

// ── static read of the test's own source: computes(<string literal>).binary <cmp> <0|1>
const argOf = (src: string, from: number): { arg: string; end: number } | null => {
  let depth = 1, j = from
  while (j < src.length) { const c = src[j]; if (c === '(') depth++; else if (c === ')') { depth--; if (!depth) break } j++ }
  return j < src.length ? { arg: src.slice(from, j), end: j + 1 } : null
}
const literal = (arg: string): string | null => {
  const t = arg.trim()
  if (!/^['"`]/.test(t)) return null
  const q = t[0]
  if (q === '`' && t.includes('${')) return null           // interpolation — not a literal
  let out = '', k = 1
  while (k < t.length && t[k] !== q) { if (t[k] === '\\') { out += JSON.parse('"\\' + t[k + 1] + '"'); k += 2; continue } out += t[k++] }
  return k === t.length - 1 ? out : null                    // trailing anything (concatenation) — not a literal
}
const drainAssertions = (src: string): string[] => {
  const out: string[] = []
  for (let i = src.indexOf('computes('); i >= 0; i = src.indexOf('computes(', i + 1)) {
    const a = argOf(src, i + 'computes('.length)
    if (!a) continue
    const text = literal(a.arg)
    const cmp = src.slice(a.end, a.end + 30).match(/^\s*\.binary\s*(===|!==|==|!=)\s*([01])/)
    if (text === null || !cmp) continue
    if ((cmp[1][0] === '!' ? 1 - Number(cmp[2]) : Number(cmp[2])) === 0) out.push(text)   // wants a DRAIN
  }
  return out
}

// ── run one candidate, recording what it asked the gate
const run = (test: () => boolean, oracle: ((t: string) => 0 | 1 | null) | null): { passed: boolean; asked: string[] } => {
  g.__asked = []
  g.__oracle = oracle
  let passed = false
  try { passed = test() === true } catch { passed = false }
  g.__oracle = null
  return { passed, asked: [...new Set(g.__asked)] }
}

// COUNTERFACTUAL: is there a gate that drains, and satisfies this test? The test fails under the live gate,
// so if some gate satisfies it then the failure is the gate's answers and nothing else.
//
// The search has to be iterative, and the reason is worth stating: `&&` and `.every` short-circuit, so a
// single run only reveals the texts asked up to the first refusal. A test that feeds fourteen dialects to the
// gate shows exactly ONE of them while the first answer is wrong. The first version searched only the texts
// seen on the live run and reported twenty-five tests as unexplained that plainly assert a drain — it was
// measuring its own blind spot. Each round therefore re-runs with the best assignment so far, harvests the
// texts that become visible, and searches again, until nothing new appears.
const ROUNDS = 8, CAP = 14, BUDGET = 200000
const onlyADrainSatisfies = (test: () => boolean, seed: string[]): boolean => {
  let universe = [...seed], spent = 0
  const seen = new Set(universe)
  const tryBits = (bits: number[], fallback: 0 | 1 | null) => {
    if (spent++ > BUDGET) return null
    const r = run(test, (t) => { const i = universe.indexOf(t); return i < 0 ? fallback : (bits[i] as 0 | 1) })
    for (const t of r.asked) if (!seen.has(t)) { seen.add(t); universe.push(t) }
    return r.passed
  }
  for (let round = 0; round < ROUNDS; round++) {
    const n = universe.length
    if (tryBits(new Array(n).fill(0), 0)) return true                                       // a gate that drains everything
    for (let i = 0; i < n; i++) if (tryBits(new Array(n).fill(1).map((b, j) => (j === i ? 0 : b)), null)) return true
    if (n <= CAP) for (let m = 1; m < (1 << n) && spent <= BUDGET; m++) if (tryBits(universe.map((_, i) => (m >> i) & 1), null)) return true
    if (universe.length === n || spent > BUDGET) return false                               // nothing new came into view
  }
  return false
}

// ── measure every revoked entry that still has a candidate to run
type Row = { key: string; entry: Entry; witness: 'FALSIFIED' | 'COUNTERFACTUAL' | 'NONE'; note: string }
const retire: Row[] = [], unexplained: Row[] = [], holds: Row[] = []
let noCandidate = 0
for (const e of ledger) if (e.revoked && !CANDIDATES.some((c) => c.key === e.key)) noCandidate++

for (const c of CANDIDATES) {
  const e = byKey.get(c.key)
  if (!e?.revoked) continue
  const live = run(c.test, null)
  if (live.passed) { holds.push({ key: c.key, entry: e, witness: 'NONE', note: `holds under the live gate (${live.asked.length} text(s) asked, none drained)` }); continue }
  const falsified = drainAssertions(c.test.toString()).find((t) => computes(t).binary === 1)
  if (falsified !== undefined) { retire.push({ key: c.key, entry: e, witness: 'FALSIFIED', note: `the live gate answers computes(${JSON.stringify(falsified.slice(0, 90))}) → binary 1, and the test asserts 0` }); continue }
  if (onlyADrainSatisfies(c.test, live.asked)) { retire.push({ key: c.key, entry: e, witness: 'COUNTERFACTUAL', note: `fails today and passes only under a gate that drains ${live.asked.length === 1 ? 'the text' : 'one or more of the ' + live.asked.length + ' texts'} it feeds` }); continue }
  unexplained.push({ key: c.key, entry: e, witness: 'NONE', note: `fails today, and neither witness holds — its failure is not shown to be the gate's` })
}

// ── report, then (only with --write) record the reason on those that lack it
const already = retire.filter((r) => isLexicalReason(r.entry.reason))
const missing = retire.filter((r) => !isLexicalReason(r.entry.reason))
const overstated = ledger.filter((e) => isLexicalReason(e.reason) && holds.some((h) => h.key === e.key))

console.log(`ledger ${ledger.length} · live ${ledger.filter(__isLive).length} · revoked ${ledger.filter(__isWithdrawn).length} (${noCandidate} of them have no candidate left to run)`)
console.log(`\nRETIRE — asserts the removed lexical gate's behaviour: ${retire.length}`)
console.log(`  witness FALSIFIED (a literal drain assertion the live gate answers 1): ${retire.filter((r) => r.witness === 'FALSIFIED').length}`)
console.log(`  witness COUNTERFACTUAL (satisfiable only by a draining gate):          ${retire.filter((r) => r.witness === 'COUNTERFACTUAL').length}`)
console.log(`  already carry the reason: ${already.length} · missing it: ${missing.length}`)
console.log(`\nLEAVE ALONE — revoked, and their test still HOLDS under the live gate: ${holds.length}`)
console.log(`  these were withdrawn for lacking a Lean proof (or for circularity), which is a different and still-correct reason.`)
const reasonOf = (k: string): string | undefined => ledger.find((e) => e.key === k)?.reason

// A REASON THAT NAMES A MEASURED CAUSE IS AN EXPLANATION, even when no mechanical witness can be produced.
// Two entries fail with no witness the search can construct — one asserts a verdict adjudicate cannot return
// for a structural reason, the other feeds the gate more texts than the counterfactual search enumerates.
// Both were investigated by hand and their reasons record what was actually measured. Left in the open list
// they would be reported as unresolved on every run for ever, and a permanent false lead is exactly the kind
// of noise that teaches people to skim past a real one. They are separated, not silenced: still listed, and
// still counted, under what they are.
const explained = unexplained.filter((r) => /measured:/i.test(reasonOf(r.key) ?? ''))
const stillOpen = unexplained.filter((r) => !/measured:/i.test(reasonOf(r.key) ?? ''))
if (stillOpen.length) {
  console.log(`\nUNEXPLAINED — fails today, no witness, no recorded cause: ${stillOpen.length} (reported, never auto-written)`)
  for (const r of stillOpen.slice(0, 20)) console.log(`    ${r.key}`)
  if (stillOpen.length > 20) console.log(`    … and ${stillOpen.length - 20} more`)
}
if (explained.length) {
  console.log(`\nEXPLAINED BY HAND — no mechanical witness, but the reason records a measured cause: ${explained.length}`)
  for (const r of explained) console.log(`    ${r.key}`)
}
if (overstated.length) {
  console.log(`\n✗ THE REASON NOW OVERSTATES ${overstated.length} entr(y/ies) — they carry the lexical reason and their test PASSES today.`)
  console.log(`  That means the gate regained a power it had lost. Promote the case in scripts/gate-corpus.ts and rewrite these BY HAND:`)
  for (const o of overstated) console.log(`    ${o.key}`)
}
for (const r of missing.slice(0, 12)) console.log(`\n  ${r.key}\n    ${r.witness}: ${r.note}`)
if (missing.length > 12) console.log(`\n  … and ${missing.length - 12} more`)

if (!missing.length) {
  console.log(`\n· nothing to write: every entry with a witness already carries the reason. The invariant is now measured on every run instead of resting on one by-hand pass.`)
} else if (write) {
  for (const r of missing) r.entry.reason = `${CLASS} Measured: ${r.note}.`
  writeFileSync(LEDGER, JSON.stringify(ledger, null, 2) + '\n')
  console.log(`\n✓ recorded the reason on ${missing.length} entr(y/ies) — keys, receipts and revocations untouched; run node scripts/forensics.ts to confirm the chain`)
} else {
  console.log(`\nrun with --write to record the reason on the ${missing.length} that lack it`)
}
process.exit(overstated.length ? 1 : 0)
