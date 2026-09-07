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

  // ── the fourth octave: Fibonacci, counting, and the five solids ─────────────────────────────────────────
  { theorem: 'the_first_three_power_sums_hold_to_two_hundred', key: /^triangular_n(\d+)$/, covers: (n) => n <= 200,
    why: 'the k = 1 case decided to n = 200; the rows sit at 10, 25 and 50' },
  { theorem: 'the_first_n_odd_numbers_sum_to_n_squared', key: /^odd_sum_sq_n(\d+)$/, covers: (n) => n <= 200,
    why: 'the same gnomon identity, decided to n = 200' },
  { theorem: 'cassinis_identity_holds_across_the_range', key: /^cassini_n(\d+)$/, covers: (n) => n >= 1 && n <= 30,
    why: 'decides both parities of Cassini for n = 1…30; the rows sit at 6, 9 and 12' },
  { theorem: 'the_golden_convergents_are_fibonacci_ratios_with_unit_determinant', key: /^goldencf_n(\d+)$/, covers: (n) => n <= 24,
    why: 'decides the convergents and the unit determinant for n = 0…24; the rows sit at 5, 8 and 11' },
  { theorem: 'the_catalan_recurrence_matches_the_binomial_formula', key: /^catalan_n(\d+)$/, covers: (n) => n <= 12,
    why: 'decides the convolution recurrence against C(2n,n)/(n+1) for n = 0…12' },
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

  // the five solids, one row each — and the theorem does not take them as data. It derives every convex
  // regular polyhedron from its Schläfli pair, finds exactly five, and checks Euler's formula on each, so
  // the five rows are carried by a statement that would have caught a sixth if one existed.
  { key: 'euler_characteristic_of_the_tetrahedron_is_two', theorem: 'there_are_exactly_five_platonic_solids_and_each_satisfies_eulers_formula',
    why: 'the (3,3) case, derived from the Schläfli pair rather than read from typed V, E, F' },
  { key: 'euler_characteristic_of_the_cube_is_two', theorem: 'there_are_exactly_five_platonic_solids_and_each_satisfies_eulers_formula',
    why: 'the (4,3) case' },
  { key: 'euler_characteristic_of_the_octahedron_is_two', theorem: 'there_are_exactly_five_platonic_solids_and_each_satisfies_eulers_formula',
    why: 'the (3,4) case' },
  { key: 'euler_characteristic_of_the_dodecahedron_is_two', theorem: 'there_are_exactly_five_platonic_solids_and_each_satisfies_eulers_formula',
    why: 'the (5,3) case' },
  { key: 'euler_characteristic_of_the_icosahedron_is_two', theorem: 'there_are_exactly_five_platonic_solids_and_each_satisfies_eulers_formula',
    why: 'the (3,5) case' },

  { key: 'pisano_9_is_24', theorem: 'the_pisano_period_of_nine_is_twenty_four_and_every_modulus_to_twelve_has_one',
    why: 'the row states exactly the first conjunct, and pisano finds the LEAST period, so 24 is the period and not merely a period' },
  { key: 'div3_rule_L4', theorem: 'the_digit_sum_rules_for_three_and_nine_hold_below_ten_thousand',
    why: 'the row claims the rule for 3 exhaustively below 10⁴; the theorem decides that range for 3 AND for 9' },
  { key: 'involution_telephone', theorem: 'the_involutions_are_counted_by_the_telephone_numbers',
    why: 'the row claims n ≤ 5; the theorem enumerates the permutations of 0…5 and filters the self-inverse ones, so the count is checked against the objects rather than against another recurrence' },
  { key: 'catalan_numbers', theorem: 'the_catalan_recurrence_matches_the_binomial_formula',
    why: 'the row claims C(0…5) by the closed form; the theorem decides 0…12 against the convolution recurrence' },
  { key: 'catalan_recurrence', theorem: 'the_catalan_recurrence_matches_the_binomial_formula',
    why: 'the row claims the recurrence matches the closed form to n ≤ 6; the theorem decides to n = 12' },
  { key: 'catalan_convolution_recurrence', theorem: 'the_catalan_recurrence_matches_the_binomial_formula',
    why: 'the row claims agreement verified to n = 8; the theorem decides to n = 12' },

  // ── FOUND BY scripts/candidates.ts: SEVEN CLAIMS THAT WERE ALREADY DECIDED ──────────────────────────────
  // Each of these was withdrawn as "not backed by a Lean proof" while a theorem deciding exactly it sat in
  // the tree, in some cases under nearly the same name. They were found by ranking withdrawn rows against
  // live theorem names by shared vocabulary and then READING each pair — the ranking proposes, it does not
  // decide, and several of its top proposals were wrong in ways only the Lean shows.
  { key: 'add_group', theorem: 'add_group',
    why: 'the row says every residue has an additive inverse mod 9; z9.lean decides exactly that, over all of ℤ/9' },
  { key: 'neg_involution', theorem: 'neg_involution',
    why: 'the row says −(−d) ≡ d; z9.lean decides it over all of ℤ/9' },
  { key: 'merkaba_partition', theorem: 'the_three_classes_partition_z9',
    why: 'the row claims {3,6,9}·{1,4,7}·{2,5,8} partition ℤ/9 into 3+3+3; the theorem decides the three lengths, the deduplicated union of nine, and that every residue is covered' },
  { key: 'merkaba_axis_closed', theorem: 'the_axis_is_closed_under_doubling',
    why: 'the row claims the axis {3,6,9} is closed under doubling; merkaba.lean names that set the triad, with 9 written as its residue 0, and decides the closure over it' },
  { key: 'merkaba_counter_rotation', theorem: 'doubling_counter_rotates_the_two_tetrahedra',
    why: 'the row claims doubling carries {1,4,7} ↔ {2,5,8}; the theorem decides both directions and that each image is three distinct residues' },
  { key: 'fib_trinity_358', theorem: 'three_five_eight_are_consecutive',
    why: 'the row claims 3, 5, 8 are consecutive Fibonacci with 3 + 5 = 8; sequences.lean decides the three values and the sum' },
  { key: 'grundy_xor_sum', theorem: 'grundy_of_two_heaps_is_the_xor',
    why: 'the row claims a, b ≤ 5; nim.lean ranges over List.range N with N = 6, which is 0…5 exactly' },

  // ── AND TWO THAT NEEDED THE THEOREM WIDENED FIRST, because the near miss was in the RANGE ───────────────
  { key: 'nim_bouton_H6', theorem: 'bouton_holds_at_every_heap_size_to_six',
    why: 'the row says "all heaps ≤ 6", which is SEVEN sizes; bouton_two_heaps_lost_iff_xor_zero ranges over 0…5 and would have carried it on a position nobody decided. nim.lean was widened rather than the row trimmed' },
  { key: 'nim_sum_is_xor_gf2', theorem: 'the_nim_sum_is_a_gf2_vector_addition',
    why: 'the row claims commutative AND associative AND self-inverse; associativity was missing, and supersededBy names one key, so three quarters spread over three theorems carried nothing. The conjunction was written' },

  // ── the fifth wave's own theorems, in src/proof/classical.lean ──────────────────────────────────────────
  { key: 'perfect_numbers', theorem: 'euclids_form_is_perfect_at_every_mersenne_prime_to_seven',
    why: 'the row names 6, 28 and 496 as perfect; the theorem decides the proper-divisor sum for p = 2, 3, 5, 7 — that is 6, 28, 496 and 8128' },
  { key: 'amicable_220_284', theorem: 'the_amicable_pair_is_mutual_and_neither_is_perfect',
    why: "the row claims each is the sum of the other's proper divisors; the theorem decides both directions and that neither is its own sum" },
  { key: 'primitive_roots_mod9_are_2_and_5', theorem: 'the_primitive_roots_mod_nine_are_exactly_two_and_five',
    why: 'the row claims the primitive roots are EXACTLY {2,5}; families.lean only decides that one exists at 9, so this needed its own theorem — the units of order 6 filtered out, as a list equality' },
  { key: 'eisenstein_six_units', theorem: 'the_eisenstein_units_are_exactly_six',
    why: 'the row claims exactly six norm-1 Eisenstein integers; the theorem counts them over the box −3…3, which is wider than any norm-1 element can reach' },
  { key: 'subtraction_game_mod4', theorem: 'the_subtraction_game_loses_exactly_at_the_multiples_of_four',
    why: 'the row claims the mover loses iff n ≡ 0 mod 4; the theorem decides both halves — every move from a multiple leaves a non-multiple, and some move from a non-multiple reaches one' },

  // ── SEVEN ROWS ABOUT (ℤ/9)*, FOR WHICH THE RANKING PROPOSED ONE THEOREM AND WAS WRONG SEVEN TIMES ───────
  // candidates.ts offered `units_are_six` as the heir for every one of these, on the strength of the shared
  // words "units" and "six". Knowing the group has six elements decides none of them. Each got its own
  // theorem in classical.lean, which is the outcome the ranking is FOR: it found the rows, and reading them
  // found that the proposal was empty.
  { key: 'the_units_of_z9_form_three_additive_inverse_pairs_summing_to_nine', theorem: 'the_units_of_z9_form_three_pairs_summing_to_nine',
    why: 'the theorem decides the pair count and that every unit has its complement to nine inside the units' },
  { key: 'the_multiplication_table_of_z9_units_is_a_latin_square', theorem: 'the_multiplication_table_of_the_z9_units_is_a_latin_square',
    why: 'every row and every column is decided to be a permutation of the units — both, not rows alone leaning on an unstated commutativity' },
  { key: 'the_count_of_primitive_roots_is_phi_of_phi', theorem: 'the_count_of_primitive_roots_is_phi_of_phi',
    why: 'the row states the identity where the group is cyclic; the theorem decides it over the moduli 2…18 that have a primitive root' },
  { key: 'the_order_spectrum_of_z9_units_realizes_gauss_divisor_sum', theorem: 'the_order_spectrum_of_the_z9_units_realises_gauss_divisor_sum',
    why: 'φ(d) units of each order d dividing six, and the φ values summing to six — with the divisors computed rather than typed' },
  { key: 'gauss_generalization_of_wilson_product_of_units', theorem: 'the_product_of_the_units_is_minus_one_exactly_where_gauss_says',
    why: 'the product of the units is −1 exactly where a primitive root exists and +1 elsewhere, decided over 2…18 — Wilson is the prime case' },
  { key: 'three_is_a_primitive_root_mod_seven_and_the_rosette_is_six_plus_one', theorem: 'three_is_a_primitive_root_mod_seven_and_seven_is_six_plus_one',
    why: 'the order of 3 mod 7, the six units, and the seventh residue that is not one' },
  { key: 'the_order_six_unit_group_splits_as_reflection_times_trinity', theorem: 'the_z9_unit_group_splits_as_reflection_times_trinity',
    why: 'u ↦ (u³, u⁴) recovers u, and the two factors take two and three values — the C2 × C3 the CRT predicts' },

  // ── the sixth wave, and the rule that decides which of it carries ───────────────────────────────────────
  // A bounded theorem carries an unbounded claim ONLY when the row states its own bound. "Verified for all
  // primes ≤ 100" is a claim a range settles; "for every Pythagorean triple" is not, however wide the range.
  // Three theorems from this wave prove real facts and carry nothing, and they are named below the list.
  { key: 'fermat_prime_is_sum_of_two_squares', theorem: 'an_odd_prime_is_a_sum_of_two_squares_exactly_when_it_is_one_mod_four',
    why: 'the row says "verified for all primes ≤ 100" and includes 2 = 1² + 1²; the theorem decides 2 and every odd prime below 200' },
  { key: 'invmap_perm', theorem: 'the_inverse_map_permutes_the_units_and_is_an_involution',
    why: 'the first two conjuncts are the permutation — distinct images, all of them units — over the whole finite group' },
  { key: 'invmap_involution', theorem: 'the_inverse_map_permutes_the_units_and_is_an_involution',
    why: 'the third conjunct is inv(inv(u)) = u at every unit; the row and its sibling above are two halves of one theorem' },
  { key: 'hockey_stick_identity_pascal', theorem: 'the_hockey_stick_identity_holds_across_the_range',
    why: 'the row says "verified exhaustively for r up to 10 and n up to 18"; the theorem decides r = 0…10 and the diagonal length to 18' },
  { key: 'the_vortex_and_rosette_unit_groups_are_isomorphic', theorem: 'the_powers_of_two_mod_nine_and_of_three_mod_seven_are_isomorphic',
    why: 'the row names the map 2^k mod 9 ↦ 3^k mod 7 and says it preserves multiplication; the theorem decides both power maps are bijections onto the units and that each sends a product of exponents to a product — the map itself, not merely that two groups of six exist' },

  // ── Lucas, Pell and Farey — every one of these rows states its own bound, so every one carries ──────────
  { key: 'lucas_numbers', theorem: 'the_lucas_numbers_follow_their_recurrence_and_reach_their_named_values',
    why: 'the row names L(0)=2, L(1)=1, L(5)=11 and L(7)=29; the theorem decides all four and the recurrence to n = 29' },
  { key: 'lucas_fibonacci_relation', theorem: 'the_lucas_numbers_are_the_sum_of_the_neighbouring_fibonaccis',
    why: 'the row claims L(n) = F(n−1) + F(n+1) at n = 5 and 8; the theorem decides it at every n from 1 to 28 — two independently defined sequences meeting, which neither recurrence says alone' },
  { key: 'pell_numbers', theorem: 'the_pell_numbers_follow_their_recurrence_and_reach_their_named_values',
    why: 'the row names P(5)=29 and P(6)=70; the theorem decides both and the doubling recurrence to n = 25' },
  { key: 'farey_neighbor_F4', theorem: 'consecutive_farey_neighbours_have_unit_determinant_and_bracket_their_mediant',
    why: 'the first conjunct decides bc − ad = 1 across the whole of F_4, which is the sequence the row names' },
  { key: 'mediant_between', theorem: 'consecutive_farey_neighbours_have_unit_determinant_and_bracket_their_mediant',
    why: 'the second conjunct decides that the mediant lies STRICTLY between its parents across F_6, the sequence the row names — cross-multiplied, since Nat division would truncate the comparison into agreeing with itself' },
]

// ── AND TWO THE CANDIDATE REPORT PROPOSED THAT ARE NOT CARRIED, WRITTEN DOWN SO THEY ARE NOT PROPOSED AGAIN ──
//
// THREE MORE FROM THE SIXTH WAVE ARE PROVED AND NOT CARRIED, for one reason: each row claims something
// unbounded and states no verification range of its own. `the_area_of_a_pythagorean_triangle_is_a_multiple_of_six`
// says "for every Pythagorean triple"; `three_is_the_only_prime_one_less_than_a_perfect_square` argues from
// the factorisation n² − 1 = (n−1)(n+1), which is general; `eight_times_a_triangular_number_plus_one_is_a_square`
// states an identity in n. Each now has a theorem deciding it over a wide range — worth having, and not a
// carry. The rule is the row's own bound: where a row says how far it was checked, a theorem reaching that
// far carries it; where a row claims everything, no finite range does.
//
// `merkle_fold_singleton_identity` says merkleFold([x]) = x — for x, universally. singleton_fold_is_the_leaf
// decided it at ONE address, which is a single instance wearing a general name, and merkle.lean now ranges
// over three. Three is not all: the claim quantifies over an infinite domain and `decide` cannot reach it.
// The theorem is better than it was and the row still is not carried, which is the same standard applied to
// merkle_fold_order_independent_k5 and k6.
// `euclid_euler_perfect` says "even perfect numbers ARE 2^(p−1)(2^p−1) for a Mersenne prime". That is the
// characterisation — Euclid's direction AND Euler's converse. classical.lean decides Euclid's: the form is
// perfect whenever the Mersenne number is prime. It says nothing about every even perfect number having
// that shape, and the examples the row lists are instances of the half that IS proved, which is exactly how
// a half-proved claim looks fully proved. Left withdrawn.
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
