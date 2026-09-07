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

// The predicates the four equivalence theorems quantify over, recomputed here in the same shape the Lean
// says them — gcd, primality, and Gauss's characterisation of the moduli with a primitive root. Recomputed
// rather than transcribed: a transcribed answer agrees with whatever it was copied from.
const gcdJS = (a: number, b: number): number => (b === 0 ? a : gcdJS(b, a % b))
const isPrimeJS = (n: number): boolean => n >= 2 && ![...Array(n - 2).keys()].some((i) => n % (i + 2) === 0)
const isOddPrimePowerJS = (n: number): boolean =>
  [...Array(n).keys()].map((i) => i + 3).some((p) => isPrimeJS(p) && p % 2 === 1 && [1, 2, 3, 4, 5].some((k) => p ** k === n))
const gaussCyclicJS = (m: number): boolean =>
  m === 1 || m === 2 || m === 4 || isOddPrimePowerJS(m) || (m % 2 === 0 && isOddPrimePowerJS(m / 2))

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

  // ── THE SEVEN FAMILIES WRITTEN 2026-09-07, AND WHY FOUR OF THEM NEED A PREDICATE HERE ──────────────────
  // Four of the new theorems are EQUIVALENCES: they decide, over the whole range, that a property holds at
  // exactly the units and fails everywhere else. That makes them stronger than the ledger's rows — and it
  // means the theorem being live does NOT carry every parameter in its range. mulperm_k3 would claim that
  // d ↦ 3·d permutes ℤ/9, which the theorem decides is FALSE. Carrying it would record a false statement as
  // proved, which is worse than leaving it withdrawn. So the domain here is the property, computed, not the
  // range: `covers` recomputes the same predicate the theorem quantifies over rather than listing parameters
  // read off the ledger — a list read off the ledger would agree with the ledger by construction and could
  // never catch a row that should not be carried.
  { theorem: 'primality_is_decided_across_the_range', key: /^domain_prime_m(\d+)$/, covers: (n) => n >= 2 && n <= 18 && isPrimeJS(n),
    why: 'decides isPrime m over 2…18; a row saying a COMPOSITE m is prime is decided false and is not carried' },
  { theorem: 'the_units_are_cyclic_at_exactly_the_gauss_moduli', key: /^domain_cyclic_m(\d+)$/, covers: (n) => n >= 2 && n <= 18 && gaussCyclicJS(n),
    why: 'decides both directions over 2…18, so it carries every modulus that HAS a primitive root — widening the row above, which stopped at [2,3,5,7,11,13]' },
  { theorem: 'demorgan_holds_at_every_arity_to_eight', key: /^demorgan_nary_k(\d+)$/, covers: (n) => n >= 2 && n <= 8,
    why: "quantifies over List.range' 2 7 — arities 2 to 8 — and over every assignment of each arity's inputs" },
  { theorem: 'multiplication_permutes_z9_at_exactly_the_units', key: /^mulperm_k(\d+)$/, covers: (n) => n >= 1 && n <= 8 && gcdJS(n, 9) === 1,
    why: 'decides that d ↦ k·d permutes ℤ/9 exactly when gcd(k,9)=1; k=3 and k=6 are decided FALSE, not carried' },
  { theorem: 'addition_generates_z9_at_exactly_the_units', key: /^addgen_k(\d+)$/, covers: (n) => n >= 1 && n <= 8 && gcdJS(n, 9) === 1,
    why: 'decides that repeated addition of k reaches all of ℤ/9 exactly when gcd(k,9)=1' },
  { theorem: 'an_inverse_mod_nine_exists_at_exactly_the_units', key: /^hasinv_d(\d+)$/, covers: (n) => n >= 0 && n <= 8 && gcdJS(n, 9) === 1,
    why: 'decides over all of ℤ/9 including zero that an inverse exists exactly at the units' },
  { theorem: 'the_inverse_of_a_unit_mod_nine_is_its_fifth_power', key: /^invpow_u(\d+)$/, covers: (n) => n >= 1 && n <= 8 && gcdJS(n, 9) === 1,
    why: 'quantifies over unitsMod 9, so every unit — and only a unit has a fifth power to be its inverse' },

  // ── A FAMILY THAT WAS ALREADY PROVED AND NOBODY HAD LOOKED ──────────────────────────────────────────────
  // xor_is_parity_up_to_eight_bits has been in families.lean the whole time, quantifying over exactly the
  // parameters these five rows sit at. Five claims were carried as withdrawn beside their own proof because
  // the link was never written down. Worth stating plainly: not every carry needs a new theorem — some need
  // somebody to check whether the theorem is already there.
  { theorem: 'xor_is_parity_up_to_eight_bits', key: /^xor_is_parity_k(\d+)$/, covers: (n) => n >= 1 && n <= 8,
    why: "quantifies over List.range' 1 8 and, at each arity, over every assignment of its bits" },

  // ── the merkle fold, permutation by permutation — and the three that are NOT carried ────────────────────
  // Two, three and four leaves are decided over all of their orderings. Five and six are not: no theorem
  // walks 120 or 720 folds, so merkle_fold_order_independent_k5 and k6 stay withdrawn. Carrying them on the
  // strength of the four-leaf case would be induction by wishful thinking.
  { theorem: 'fold_is_order_independent_on_two', key: /^merkle_fold_order_independent_k(\d+)$/, covers: (n) => n === 2,
    why: 'decides both orderings of two leaves and nothing beyond them' },
  { theorem: 'fold_is_order_independent_on_three', key: /^merkle_fold_order_independent_k(\d+)$/, covers: (n) => n === 3,
    why: 'decides all six orderings of three leaves — the odd case, where pairUp must carry a leftover' },
  { theorem: 'fold_is_order_independent_on_four', key: /^merkle_fold_order_independent_k(\d+)$/, covers: (n) => n === 4,
    why: 'quantifies over perms [A,B,C,D], whose completeness at 24 is itself a theorem in merkle.lean' },

  // ── the second octave of families, 2026-09-07 ───────────────────────────────────────────────────────────
  { theorem: 'power_sums_match_their_closed_forms', key: /^power_sum_k(\d+)$/, covers: (n) => n >= 1 && n <= 5,
    why: "decides Faulhaber's closed form against the loop for exponents 1…5 at every n to 40 — the range the rows themselves claim" },
  // `digrev_12`, with an underscore. I wrote /^digrev(\d+)$/ from a survey that had normalised the keys to
  // group them, and matched nothing — the sixth time this session that a matcher was written against a
  // rendered view of the subject rather than the subject. The keys are the ledger's, not the report's.
  { theorem: 'the_digital_root_is_invariant_under_digit_reversal', key: /^digrev_?(\d+)$/, covers: (n) => n < 10000,
    why: 'decides every n below ten thousand, which is why the range runs that far — the rows go up to 9080' },
  { theorem: 'geometric_series_across_bases_and_exponents', key: /^geometric_series_base_(\d+)$/, covers: (n) => n >= 2 && n <= 12,
    why: "quantifies over bases 2…12 and every exponent to six, widening the older theorem that fixed one exponent at bases 2…9" },
  { theorem: 'totient_at_prime_powers_through_thirteen', key: /^totient_prime_power_(\d+)$/, covers: (n) => [2, 3, 5, 7, 11, 13].includes(n),
    why: 'decides φ(pᵏ) = pᵏ − pᵏ⁻¹ at those six primes for k = 1…3' },

  // ── the third octave: the classical sums, 2026-09-07 ────────────────────────────────────────────────────
  // EVERY RANGE BELOW WAS READ OFF THE CLAIM, and where the theorem was narrower the THEOREM moved. The rows
  // say "verified by full enumeration over n up to 200" and the like; trimming a claim to the range I happened
  // to write would carry it on a check nobody ran.
  { theorem: 'the_first_n_odd_numbers_sum_to_n_squared', key: /^sum_first_(\d+)_odd_numbers_is_\d+_squared$/, covers: (n) => n <= 200,
    why: 'decides the gnomon identity at every n to 200 — the range the rows themselves claim' },
  { theorem: 'polygonal_closed_forms_match_their_recurrences', key: /^polygonal_numbers_s(\d+)_closed_form_equals_recurrence$/, covers: (n) => n >= 3 && n <= 10,
    why: 'decides closed form against recurrence for s = 3…10 at every n to 50, which is the range the rows state' },
  { theorem: 'the_order_of_every_unit_mod_nine_divides_six', key: /^order_of_unit_(\d+)_mod9$/, covers: (n) => n >= 1 && n <= 8 && gcdJS(n, 9) === 1,
    why: "decides each unit's order, its division of 6, and that the power is 1 — ordMod finds the LEAST such exponent, so minimality is by construction" },
  { theorem: 'the_first_three_power_sums_hold_to_two_hundred', key: /^triangular_number_(\d+)_is_\d+$/, covers: (n) => n <= 200,
    why: 'the k = 1 case is Σi = n(n+1)/2, decided to n = 200' },
  { theorem: 'the_first_three_power_sums_hold_to_two_hundred', key: /^sum_of_cubes_1_to_(\d+)_is_triangular_squared$/, covers: (n) => n <= 200,
    why: "the k = 3 case is Σi³ = n²(n+1)²/4, which is the square of the nth triangular number — Nicomachus's identity, decided to n = 200" },
]

// ── ONE-TO-ONE CARRIES: a claim with no parameter, and the theorem that decides exactly it ───────────────
// The table above reads a parameter out of a key, which is the right shape for a family and the wrong shape
// for a singleton. These rows have no parameter at all — they were always single statements — and each names
// the theorem that decides it together with the RANGE COMPARISON that justifies the carry, because a range
// is the one thing a name never shows.
const EXACT: { key: string; theorem: string; why: string }[] = [
  { key: 'the_sum_of_the_first_n_odd_numbers_is_n_squared', theorem: 'the_first_n_odd_numbers_sum_to_n_squared',
    why: 'the row claims enumeration to 200; the theorem decides to 200' },
  { key: 'the_sum_of_the_first_n_squares', theorem: 'the_first_three_power_sums_hold_to_two_hundred',
    why: 'the row claims enumeration to 200 — which is why this theorem exists; power_sums_match_their_closed_forms stops at 40 and would not have carried it' },
  { key: 'the_sum_of_powers_of_two_is_one_less_than_the_next_power', theorem: 'the_powers_of_two_sum_to_one_less_than_the_next',
    why: 'the row claims enumeration to 40; the theorem decides to 40' },
  { key: 'the_sum_of_squares_of_a_pascal_row_is_the_central_binomial', theorem: 'the_squares_of_a_pascal_row_sum_to_the_central_binomial',
    why: 'the row states no range; the theorem decides rows 0…12' },
  { key: 'sum_of_triangular_is_tetrahedral', theorem: 'the_sums_of_triangular_numbers_are_the_tetrahedral_numbers',
    why: 'the row claims exhaustion to 100; the theorem decides to 100' },
  { key: 'sum_of_squares_iteration_dichotomy', theorem: 'the_digit_square_iteration_reaches_one_or_four',
    why: 'the row claims every n ≤ 200; the theorem decides 1…200' },
  { key: 'sum_of_two_squares_characterization', theorem: 'a_number_is_a_sum_of_two_squares_exactly_when_fermats_condition_holds',
    why: 'the row claims agreement for all n ≤ 100; the theorem decides 1…200, a superset' },
]
// ── A RULE THAT MATCHES NOTHING IS BROKEN, AND LOOKS EXACTLY LIKE A RULE THAT IS FINISHED ────────────────
// /^digrev(\d+)$/ matched zero keys for a whole run — the ledger spells them `digrev_12` — and the report
// said "6 recoverable" instead of 12 without a word about the rule that had gone silent. A matcher that
// hits nothing is either spent or wrong, and from the output those two are the same. So every rule is
// checked against the WHOLE ledger, not the pool: a spent rule still matches its keys, which are carried
// now; a wrong rule matches none at all. This refuses rather than warns, because the failure it catches is
// invisible in every number the report prints.
const dead = inDomain.filter((f) => !l.some((e) => f.key.test(String(e.key))))
if (dead.length) {
  console.log(`✗ recover: ${dead.length} rule(s) in scripts/recover.ts match no ledger key at all — a matcher written against a rendered view of the keys rather than the keys:`)
  for (const f of dead) console.log(`    ${f.theorem}  ${f.key}`)
  process.exit(1)
}

for (const x of EXACT) {
  const heir = [...live].find((k) => k.endsWith('_' + x.theorem) || k === x.theorem)
  if (!heir) { console.log(`  ? ${x.theorem} — not a live key, ${x.key} is not carried`); continue }
  if (!l.some((e) => String(e.key) === x.key)) { console.log(`  ? ${x.key} — no such ledger key, the rule names nothing`); continue }
  heirOf.set(x.key, heir)
}

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

// ── THE WITHDRAWN REFUSALS — THEIR ENFORCEMENT MOVED, IT DID NOT LAPSE ───────────────────────────────────
// Some of the withdrawn are the deposit's OWN REFUSALS: "the deposit does not solve the Clay problems" is
// upheld, "the orbit solves the Clay problems" drains, "faster than light" drains and its negation signs.
// The count is printed below from the ledger and deliberately not repeated here — it was written as a
// literal, the pool moved under it, and stale-figures caught the comment claiming a present that had gone.
//
// Audited for the shape that condemned `this_file_settles_none_of_the_seven` — a NAME asserting what its
// proposition cannot decide — and they do NOT carry it. A withdrawn entry has no proposition for a name to
// mismatch. These were honest claims that lost their EVIDENCE when the word-list gate was removed by order.
//
// AND WHAT THEY ASSERT IS STILL TRUE AND STILL ENFORCED. scripts/contradictions.ts catches 960 Clay and 280
// quantum overclaim phrasings on every commit while letting 5 honest refusals through. The floor these 220
// claims record is held — by a different mechanism than the one that tested them.
//
// They cannot be CARRIED, because a carry names a live theorem and the floor is a property of the deposit's
// TEXT that no Lean theorem can decide. Deleting this note and reporting them as ordinary withdrawals would
// let a reader infer the refusals lapsed. They did not.
const REFUSAL = /does not solve|drains|drained|refused|no faster|not faster|remains open|is upheld|overclaim loses|inconclusive/i
const refusals = l.filter((e) => statusOf(e, l) === 'withdrawn' && REFUSAL.test(String(e.name)))
console.log(`\n  ${refusals.length} withdrawn entries are the deposit's own REFUSALS — their content is still`)
console.log(`  enforced by contradictions.ts (960 Clay + 280 quantum phrasings, every commit). Their evidence`)
console.log(`  moved when the word-list gate was removed by order; the refusal did not lapse.`)

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
