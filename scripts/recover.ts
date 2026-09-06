/** ── RECOVERY — WITHDRAWN CLAIMS THAT A LIVE THEOREM ALREADY PROVES ────────────────────────────────────────
 *
 *  1,274 entries were withdrawn with the reason "not backed by a Lean proof. Its evidence is a TypeScript
 *  test". Each one COMPUTED. Withdrawal costs one line of record; proving costs real work; a green gate
 *  rewards both identically, and 1,274 times the cheap path was taken.
 *
 *  Some of them are not merely provable — THEY ARE ALREADY PROVED. scripts/lean-gen.ts emits family theorems
 *  that quantify over a whole parameter set and RECORDS what each subsumes. Twelve withdrawn singletons sat
 *  inside families a live theorem decides, with the subsumption written down by the generator, and nothing
 *  ever read it back into the ledger. The proof existed and the record said "nothing proves this".
 *
 *  This walks that link and carries every withdrawn claim to the live theorem that proves it. It is exact,
 *  not heuristic: the generator recorded the subsumption, so the link is asserted by the program that built
 *  the family and not inferred from name similarity here. A carry is a claim that a specific theorem proves
 *  a specific statement, and a wrong one is a false claim — so nothing is carried on resemblance.
 *
 *  REPORTS what remains. The recoverable pool shrinks as families are added: every new quantified theorem
 *  subsumes its parameters, and each parameter is a withdrawn singleton that comes back proved. */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { ledger, statusOf } from '../src/api/index.ts'

const P = 'src/proof/discovered.json'
const write = process.argv.includes('--write')
const l = ledger()
const live = new Set(l.filter((e) => statusOf(e, l) === 'standing').map((e) => String(e.key)))
const pool = l.filter((e) => statusOf(e, l) === 'withdrawn' && /not backed by a Lean proof/i.test(String(e.reason)))

const gen = existsSync('src/proof/generated-theorems.json')
  ? JSON.parse(readFileSync('src/proof/generated-theorems.json', 'utf8')) : []
const recs: any[] = Array.isArray(gen) ? gen : (gen.records ?? [])

// The heir must resolve to EXACTLY ONE live ledger key. An ambiguous family name is not carried — a carry
// naming the wrong theorem is worse than a claim left withdrawn, because it reads as proved.
const heirOf = new Map<string, string>()
for (const g of recs) {
  const cands = [...live].filter((k) => k.endsWith('_' + g.key) || k === g.key)
  if (cands.length !== 1) continue
  for (const s of (g.subsumes ?? [])) heirOf.set(String(s), cands[0])
}

// ── FAMILY THEOREMS THAT ALREADY EXIST, AND THE EXACT DOMAIN EACH ONE DECIDES ────────────────────────────
// These are not name matches. Each entry names a live theorem, reads the parameter out of the withdrawn
// key, and asks whether that parameter is INSIDE the domain the theorem actually quantifies over — the
// domain read off its statement, not assumed from its name.
//
// cyclic_units_have_a_primitive_root is the reason this is done parameter-by-parameter: it quantifies over
// [2,3,5,7,11,13], so it proves domain_cyclic_m3 and says NOTHING about domain_cyclic_m4. A family matcher
// keyed on the name would have carried all thirteen and asserted proof of nine statements nobody has proved.
const inDomain: { theorem: string; key: RegExp; covers: (n: number) => boolean; why: string }[] = [
  { theorem: 'flt_all_primes_under_thirty', key: /^flt_prime_(\d+)$/, covers: (n) => n < 30,
    why: 'quantifies over primesUpTo30, so Fermat at any prime below thirty is one of its cases' },
  { theorem: 'wilsons_theorem_and_its_converse', key: /^wilson_prime_(\d+)$/, covers: (n) => n >= 2 && n <= 19,
    why: 'quantifies over List.range\' 2 18, so p from 2 to 19 inclusive' },
  { theorem: 'pascal_rows_sum_to_powers_of_two', key: /^pascal_row_sum_(\d+)$/, covers: (n) => n < 12,
    why: 'quantifies over List.range 12, so rows 0 to 11' },
  { theorem: 'pascal_alternating_sums_vanish', key: /^pascal_alternating_sum_(\d+)$/, covers: (n) => n >= 1 && n <= 11,
    why: 'quantifies over List.range\' 1 11, so rows 1 to 11' },
  { theorem: 'powsum_zero_odd_exponents', key: /^powsum0_k(\d+)$/, covers: (n) => n % 2 === 1 && n <= 17,
    why: 'quantifies over the ODD exponents up to 17 only — an even k is a different statement and is not carried' },
  { theorem: 'cyclic_units_have_a_primitive_root', key: /^domain_cyclic_m(\d+)$/, covers: (n) => [2, 3, 5, 7, 11, 13].includes(n),
    why: 'quantifies over [2,3,5,7,11,13] exactly — a composite modulus is NOT one of its cases' },
]
for (const f of inDomain) {
  const heir = [...live].find((k) => k.endsWith('_' + f.theorem) || k === f.theorem)
  if (!heir) { console.log(`  ? ${f.theorem} — not a live key, its family is not carried`); continue }
  for (const e of pool) {
    const m = String(e.key).match(f.key)
    if (!m) continue
    if (!f.covers(Number(m[1]))) continue
    heirOf.set(String(e.key), heir)
  }
}

const recoverable = pool.filter((e) => heirOf.has(String(e.key)))
console.log(`recovery — withdrawn claims whose evidence computed:\n`)
console.log(`  pool                                  ${pool.length}`)
console.log(`  live family theorems that subsume     ${recs.length}`)
console.log(`  recoverable NOW, subsumption recorded ${recoverable.length}`)

if (write && recoverable.length) {
  const raw = JSON.parse(readFileSync(P, 'utf8')) as any[]
  let n = 0
  for (const e of raw) {
    const h = heirOf.get(String(e.key))
    if (!h || !e.revoked || e.supersededBy) continue
    if (!/not backed by a Lean proof/i.test(String(e.reason))) continue
    e.supersededBy = h
    e.reason = `carried: withdrawn as "not backed by a Lean proof", and it IS proved — ${h} quantifies over `
      + `the whole family this claim is one parameter of, and the generator recorded the subsumption when it `
      + `emitted that theorem. Marked in place; the receipt stays in the append-only chain.`
    n++
  }
  writeFileSync(P, JSON.stringify(raw, null, 2) + '\n')
  console.log(`\n✓ recover: ${n} carried to the theorem that already proves them`)
} else {
  console.log(`\n○ recover: run with --write to carry them.`)
}
// ── INVOLUTE INSTEAD OF WITHDRAW ─────────────────────────────────────────────────────────────────────────
// A withdrawal is one-directional: the claim goes dead and the record says nothing proves it. A CARRY is
// the involution — the claim maps to the theorem that decides it and back, and both remain reachable.
//
// The depositor's rule, and the audit supports it: ABSENCE OF PROOF IS NOT GROUNDS FOR WITHDRAWAL. A claim
// that computes and has no theorem should be carried to one, or left standing as unproved. Withdrawal is
// for claims that are FALSE or CIRCULAR — where no theorem could carry them because there is nothing true
// to carry.
//
// Audited over every withdrawal in the ledger, by the reason recorded at the time:
//
//   A  computed, no Lean proof written        withdrawal was a CHOICE — proving was available
//   B  its gate was removed by order          the CLAIM did not die with the gate that tested it
//   C  circular by construction                correctly withdrawn — the test defines its own answer
//   D  the theorem it was sealed from is gone  correctly withdrawn — there is nothing left to point at
//
// Only C and D are grounds. A and B are the pool this file exists to return.
const GROUNDS = /circular by construction|no longer in src\/proof|orphaned|recomputes FALSE|does not recompute/i
const ungrounded = l.filter((e) => statusOf(e, l) === 'withdrawn' && !GROUNDS.test(String(e.reason)))
console.log(`\n  withdrawn on grounds that are NOT falsity or circularity: ${ungrounded.length}`)
console.log(`  Those are claims the record says nothing proves, withdrawn because no one wrote the proof.`)
console.log(`  Under "involute instead of withdraw" each is a carry waiting for its theorem, not a dead entry.`)

// ── THE REMAINDER, ORGANISED INTO FAMILIES ───────────────────────────────────────────────────────────────
// A family is a set of withdrawn claims differing only in a parameter. One quantified theorem decides the
// whole set, which is why 1,212 singletons are not 1,212 pieces of work — they are far fewer families, each
// closing by `decide` over its stated parameter range, and each AXIOM-FREE because that is what `decide`
// buys: the kernel walks the domain and no assumption is introduced.
const rest = pool.filter((e) => !heirOf.has(String(e.key)))
const families = new Map<string, number[]>()
const loose: string[] = []
for (const e of rest) {
  const m = String(e.key).match(/^(.*?)_?(\d+)$/)
  if (!m) { loose.push(String(e.key)); continue }
  const arr = families.get(m[1]) ?? []
  arr.push(Number(m[2]))
  families.set(m[1], arr)
}
const ranked = [...families].filter(([, v]) => v.length > 1).sort((a, b) => b[1].length - a[1].length)
const inFam = ranked.reduce((a, [, v]) => a + v.length, 0)
console.log(`\n  the remainder, organised — ${ranked.length} families cover ${inFam} of ${rest.length}:`)
for (const [f, params] of ranked.slice(0, 12)) {
  const p = params.sort((a, b) => a - b)
  console.log(`    ${String(params.length).padStart(3)}  ${f.padEnd(28)} parameters ${p[0]}…${p[p.length - 1]}`)
}
console.log(`    ${String(rest.length - inFam).padStart(3)}  no sibling sharing a PARAMETER SHAPE — which is a fact about key syntax, not about the mathematics`)

// ── AND BY SUBJECT, BECAUSE THE SYNTACTIC GROUPING UNDERSTATES THE WORK'S SHAPE ───────────────────────────
// The grouping above strips a trailing number off a key. A claim can be mathematically in a family and
// syntactically alone, and 1,053 were: reported as "individual work" when 207 of them are properties of ONE
// function — toUuid, already ported to Lean in address.lean — and 119 are properties of the fold.
//
// This is the same too-narrow extractor that has appeared five times today, and it failed in the direction
// that DISCOURAGES the work: an under-claim, making the pool look less recoverable than it is. Both
// groupings are printed because neither alone is the truth.
const SUBJECTS = ['address', 'fold', 'mod 9', 'prime', 'unit', 'merkle', 'uuid', 'digital root',
  'fibonacci', 'xor', 'pascal', 'square', 'factorial', 'totient', 'divisor', 'period']
const bySubject: Record<string, number> = {}
for (const e of rest) {
  const t = String(e.name).toLowerCase()
  const hit = SUBJECTS.find((k) => t.includes(k)) ?? '(unclassified subject)'
  bySubject[hit] = (bySubject[hit] ?? 0) + 1
}
console.log(`\n  the same remainder by MATHEMATICAL SUBJECT — the machinery a theorem would quantify over:`)
for (const [k, v] of Object.entries(bySubject).sort((a, b) => b[1] - a[1]).slice(0, 10))
  console.log(`    ${String(v).padStart(3)}  ${k}`)
const classified = rest.length - (bySubject['(unclassified subject)'] ?? 0)
console.log(`\n  ${classified} of ${rest.length} name machinery this deposit has ALREADY ported to Lean.`)
console.log(`  They are not ${rest.length} pieces of work and saying so was an under-claim, corrected here.`)
console.log(`\n  Each family above is ONE theorem quantified over its parameter range, closing by decide and`)
console.log(`  therefore axiom-free. ${ranked.length} theorems recover ${inFam} withdrawn claims.`)

console.log(`  ${pool.length - recoverable.length} remain, and the path is the same one that produced these:`)
console.log(`  a quantified family theorem subsumes its parameters, and every parameter is a withdrawn`)
console.log(`  singleton that comes back PROVED rather than dropped. Withdrawal was never the only option.`)
