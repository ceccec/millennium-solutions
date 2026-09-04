#!/usr/bin/env node
// WHAT IS ALREADY PROVED BUT STILL RECORDED AS UNPROVED.
//
// 1757 entries are withdrawn with the reason "not backed by a Lean proof — its evidence is a TypeScript
// test". Some of them have since been proved: the theorem was written, the kernel accepts it, and the old
// entry was never told. The record then reports "nothing proving them" about a fact the kernel checks on
// every run, which is an UNDERCLAIM — the deposit understating itself, which is the direction this session
// found it erring in over and over.
//
// THE MATCHER IS A HEURISTIC AND IS TREATED AS ONE. It compares the withdrawn key's word-tokens against a
// live theorem's name, with digits spelled out. On the current tree that surfaces 12 candidates and THREE
// OF THEM ARE WRONG:
//
//   · genus_g_moduli_dim claims the dimension for general g and cites g=2 AND g=3; genus2_moduli_dim
//     decides only 6*2-6 == 6. The theorem is narrower than the claim, so it cannot carry it.
//   · consecutive_fibonacci_coprime says "verified n ≤ 20"; the theorem walks 1..15. Narrower again.
//   · a claim that 2^10 = 1024 matched a theorem about the repetend of one seventh. Shared tokens, nothing
//     else — the false-positive shape a sibling session warned about: a surname, or here a numeral, inside
//     a body is not the body's subject.
//
// So this REPORTS candidates and carries only keys on an explicit list, each read against the theorem's
// STATEMENT rather than its name. Marking a claim proved when it is not would be the one error this ledger
// cannot take back.
import { writeFileSync, readFileSync } from 'node:fs'
import { ledger as __ledger, leanTheorems, statusOf, theoremOfKey } from '../src/api/index.ts'

// THE HEIR IS A LEDGER KEY, NOT `lean_` + THE THEOREM NAME. A theorem's live key is an address and is often
// namespaced — lean_z9_euler_units_pow_six, not lean_euler_units_pow_six. Building it by concatenation set
// six of seven entries to point at keys that do not exist, and statusOf correctly left them withdrawn: a
// claim carried by a key nobody can resolve is worse than one honestly marked unproved. This is the same
// error made earlier today addressing theorem pages by name instead of key, so the map is inverted through
// theoremOfKey — the resolver the ledger itself uses — rather than assembled from a string.
const keyFor = (name: string, l: { key: string; revoked?: boolean }[], thms = leanTheorems()): string | null => {
  for (const e of l) {
    if (e.revoked) continue
    const t = theoremOfKey(e.key, thms)
    if (t && t.name === name) return e.key
  }
  return null
}

// Read, one by one, against the theorem's statement — not its name, and not a token score.
const VERIFIED: Record<string, string> = {
  euler_units_pow6: 'euler_units_pow_six',            // units.all (u^6 == 1) — the same proposition
  cubes_in_0_1_8: 'cubes_land_exactly_in_zero_one_eight',   // and stronger: it also proves surjectivity
  squares_in_0_1_4_7: 'squares_land_exactly_in_zero_one_four_seven', // likewise both directions
  tetrahedra_sums_cancel: 'the_tetrahedra_residue_sums_cancel',      // the same sums, and their total
  grundy_single_heap: 'grundy_of_a_single_heap_is_its_size',         // n ≤ 8 in the claim, range N here
  mobius_divisor_sum: 'the_mobius_divisor_sum_is_the_identity',      // claim n≤12, theorem 1..30 — wider
  xor_is_parity_k8: 'xor_is_parity_up_to_eight_bits',                 // the full 2^8 enumeration, same
}

const NUM: Record<string, string> = { '1': 'one', '2': 'two', '3': 'three', '4': 'four', '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine' }
const toks = (s: string) => new Set(String(s).toLowerCase().replace(/[0-9]/g, (d) => ' ' + (NUM[d] ?? d) + ' ')
  .split(/[^a-z]+/).filter((x) => x.length > 2))

const ledger = __ledger() as { key: string; name: string; revoked?: boolean; reason?: string; supersededBy?: string }[]
const T = leanTheorems()
const live = new Set(T.map((t) => t.name))
const withdrawn = ledger.filter((e) => statusOf(e as never, ledger as never) === 'withdrawn')

// ── the verified carries ─────────────────────────────────────────────────────────────────────────────────
let carried = 0
const missing: string[] = []
for (const [key, thm] of Object.entries(VERIFIED)) {
  const e = ledger.find((x) => x.key === key)
  if (!e) { missing.push(`${key} — no such ledger entry`); continue }
  if (!live.has(thm)) { missing.push(`${key} → ${thm} — no such live theorem`); continue }
  const heir = keyFor(thm, ledger)
  if (!heir) { missing.push(`${key} → ${thm} — the theorem exists but carries no live ledger key to point at`); continue }
  if (e.supersededBy) continue
  if (process.argv.includes('--carry')) {
    e.supersededBy = heir
    e.reason = `carried: withdrawn for having only a TypeScript test behind it, and since proved — \`${thm}\` `
      + `states the same proposition at ${heir}, and the kernel checks it on every run. Verified by reading the theorem's `
      + `STATEMENT against this claim, not by matching names. Marked in place; the receipt is untouched and `
      + `stays in the append-only chain.`
  }
  carried++
}
for (const m of missing) console.log('  ✗ ' + m)

// ── the candidates NOT carried, reported so they are not lost ────────────────────────────────────────────
const thmToks = T.map((t) => ({ t, s: toks(t.name) }))
const candidates: [string, string][] = []
for (const e of withdrawn) {
  if (VERIFIED[e.key]) continue
  const es = toks(e.key)
  if (es.size < 3) continue
  for (const { t, s } of thmToks) {
    let i = 0; for (const x of es) if (s.has(x)) i++
    if (i === es.size) { candidates.push([e.key, t.name]); break }
  }
}

if (process.argv.includes('--carry')) {
  writeFileSync('src/proof/discovered.json', JSON.stringify(ledger, null, 2) + '\n')
}

const after = ledger.filter((e) => statusOf(e as never, ledger as never) === 'withdrawn').length
console.log(`\n${missing.length ? '✗' : '✓'} carry: ${carried} withdrawn claim(s) are proved by a live theorem and `
  + `${process.argv.includes('--carry') ? 'now say so' : 'would be marked (run with --carry)'}; ${withdrawn.length} → ${after} still recorded as unproved`)
if (candidates.length) {
  console.log(`\n  ○ ${candidates.length} further token-match candidate(s), NOT carried — each needs its statement read:`)
  for (const [k, n] of candidates) console.log(`      ${k}  →  ${n}`)
}
process.exit(missing.length ? 1 : 0)
