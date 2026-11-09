set_option maxRecDepth 100000
set_option exponentiation.threshold 1100
-- title: The T-count wall — why a classical Pauli-path computation, which has no width limit, still cannot run Shor's circuit on a thousand-bit modulus, and why a physical processor is needed there: a statement about cost, not a factoring
-- wing: the floor
-- prior_art: named
-- prior_art_domain: the seven-T Toffoli decomposition (Nielsen, Chuang, Quantum Computation and Quantum Information, Fig.
--   4.9; its T-count of 7 shown optimal by Amy, Maslov, Mosca, Roetteler 2013); the Cuccaro ripple-carry adder of 2n
--   Toffolis (Cuccaro, Draper, Kutin, Moulton 2004); schoolbook modular exponentiation for Shor's algorithm as 2n controlled
--   modular multiplications of n controlled additions each (Vedral, Barenco, Ekert 1996); Beauregard's 2n + 3-qubit circuit
--   (Beauregard 2003); and the Pauli-path cost of non-Clifford gates, at most doubling per T (src/proof/pauli_paths.lean).
-- prior_art_note: none of this is new and none of it is a factoring. What is decided HERE is the COST: the seven-T Toffoli
--   checked exactly against the Toffoli gate in ℤ[ω]; the T-count of one NAMED construction as a function of the bit length
--   n — 28n³, an UNDERCOUNT for that construction because its modular reduction is left out, so the wall it shows is if
--   anything lower than the true one; the Pauli-path worst case 2^T beside it; and the two facts that place the wall. The
--   width is not it — 2n + 3 qubits fit in a handful of UUIDs' particles. The T-count is: at n = 1000 it is 28·10⁹, and the
--   worst-case term bound passes 10⁸⁰ already at n = 3. Better constructions (windowed arithmetic) lower the count by
--   constant factors and keep it polynomial in n, so the bound stays exponential in a polynomial of n. This decides no
--   factoring, claims no quantum speedup, and leaves qpu_crypto.lean's floor exactly where it stands: the deposit does not
--   factor a thousand-bit integer.
-- prior_art_search: not performed — every construction is named above and none is claimed as new.
-- prior_art_pool: named
-- prior_art_own: the cost decided as a function of n for a named construction, with the Toffoli decomposition checked
--   exactly and the wall located; and the width shown not to be the obstacle in UUID particles.
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- No axioms, no Mathlib, no sorry.

namespace TCountWall

-- ── ℤ[ω] amplitudes over three qubits, qubit k = bit k of the index; the Hadamard unnormalised (H·H = 2·I) ─────────
abbrev Zw := Int × Int × Int × Int
def zadd (x y : Zw) : Zw := (x.1 + y.1, x.2.1 + y.2.1, x.2.2.1 + y.2.2.1, x.2.2.2 + y.2.2.2)
def zneg (x : Zw) : Zw := (-x.1, -x.2.1, -x.2.2.1, -x.2.2.2)
def zmul (x y : Zw) : Zw :=
  let (a, b, c, d) := x; let (e, f, g, h) := y
  (a * e - b * h - c * g - d * f, a * f + b * e - c * h - d * g, a * g + b * f + c * e - d * h, a * h + b * g + c * f + d * e)
def w1 : Zw := (0, 1, 0, 0)          -- ω
def w7 : Zw := (0, 0, 0, -1)         -- ω⁷ = ω̄ = −ω³
def bit (i k : Nat) : Nat := i / 2 ^ k % 2
def flip (i k : Nat) : Nat := if bit i k == 1 then i - 2 ^ k else i + 2 ^ k
def at' (v : List Zw) (i : Nat) : Zw := v.getD i (0, 0, 0, 0)
def gen (f : Nat → Zw) : List Zw := (List.range 8).map f

inductive G | h (q : Nat) | t (q : Nat) | tdg (q : Nat) | cx (c t : Nat)
def step (v : List Zw) : G → List Zw
  | .h q => gen (fun i => if bit i q == 0 then zadd (at' v i) (at' v (flip i q)) else zadd (at' v (flip i q)) (zneg (at' v i)))
  | .t q => gen (fun i => if bit i q == 1 then zmul w1 (at' v i) else at' v i)
  | .tdg q => gen (fun i => if bit i q == 1 then zmul w7 (at' v i) else at' v i)
  | .cx c t => gen (fun i => at' v (if bit i c == 1 then flip i t else i))
def run (gs : List G) (v : List Zw) : List Zw := gs.foldl step v
def basis (i : Nat) : List Zw := gen (fun j => if j == i then (1, 0, 0, 0) else (0, 0, 0, 0))
def toffoliOf (i : Nat) : Nat := if bit i 0 == 1 && bit i 1 == 1 then flip i 2 else i

/-- Nielsen–Chuang Fig. 4.9: the Toffoli on controls 0, 1 and target 2 from H, CNOT, T and T† — seven T gates -/
def sevenT : List G :=
  [.h 2, .cx 1 2, .tdg 2, .cx 0 2, .t 2, .cx 1 2, .tdg 2, .cx 0 2, .t 1, .t 2, .h 2, .cx 0 1, .t 0, .tdg 1, .cx 0 1]
def tGates (gs : List G) : Nat := (gs.filter (fun g => match g with | .t _ => true | .tdg _ => true | _ => false)).length

-- ── 1 · THE TOFFOLI IS SEVEN T GATES, EXACTLY ───────────────────────────────────────────────────────────────────
-- On all eight basis inputs the circuit equals the Toffoli (at the scale 2 of its two unnormalised H), and it holds seven
-- T and T† gates. This is where "seven T per Toffoli" in every count below comes from: checked, not assumed.
theorem the_toffoli_is_exactly_a_circuit_of_seven_t_gates :
  (List.range 8).all (fun i => run sevenT (basis i) == gen (fun j => if j == toffoliOf i then (2, 0, 0, 0) else (0, 0, 0, 0)))
  ∧ tGates sevenT = 7 := by decide

-- ── the named construction, as a function of the bit length n ───────────────────────────────────────────────────
/-- Cuccaro's ripple-carry adder: 2n Toffolis for n bits -/
def adderToffolis (n : Nat) : Nat := 2 * n
/-- schoolbook modular exponentiation: 2n controlled multiplications, each n controlled additions (reduction left out) -/
def shorToffolis (n : Nat) : Nat := (2 * n) * n * adderToffolis n
def shorT (n : Nat) : Nat := 7 * shorToffolis n
/-- Beauregard's circuit: 2n + 3 qubits -/
def shorQubits (n : Nat) : Nat := 2 * n + 3
/-- the Pauli-path worst case after t T gates: each T at most doubles the terms (pauli_paths.lean, theorem 7) -/
def worstTerms (t : Nat) : Nat := 2 ^ t

-- ── 2 · THE CONSTRUCTION'S T-COUNT IS 28n³ ──────────────────────────────────────────────────────────────────────
-- 2n multiplications × n additions × 2n Toffolis × 7 T = 28n³, for every n from 1 to 64, and at the thousand-bit modulus
-- it is 28 000 000 000. An undercount for this construction — its modular reduction adds more — never an overcount.
theorem the_schoolbook_shor_construction_has_t_count_twenty_eight_n_cubed :
  (List.range' 1 64).all (fun n => shorT n == 28 * n ^ 3)
  ∧ shorT 1000 = 28000000000 := by decide

-- ── 3 · THE WIDTH IS NOT THE WALL ───────────────────────────────────────────────────────────────────────────────
-- A thousand-bit modulus needs 2n + 3 = 2003 qubits: seventeen UUIDs' 122 particles hold them, sixteen do not. The UUID
-- space holds 2^122 UUIDs. Width is free for Pauli paths (pauli_paths.lean); what remains is the T-count.
theorem a_thousand_bit_shor_circuit_fits_in_seventeen_uuids_of_particles :
  shorQubits 1000 = 2003 ∧ 2003 ≤ 17 * 122 ∧ ¬ (2003 ≤ 16 * 122) := by decide

-- ── 4 · THE WORST CASE PASSES 10⁸⁰ AT THREE BITS ────────────────────────────────────────────────────────────────
-- 2^T terms in the worst case: at n = 2 the construction's T-count is 224 and 2^224 < 10⁸⁰; at n = 3 it is 756 and
-- 2^756 > 10⁸⁰. The worst case is pessimistic — light cones and cancellation can keep the true term count far lower —
-- but it is the only bound the method guarantees, and it is already past any physical count of anything at three bits.
theorem the_pauli_path_worst_case_passes_ten_to_the_eighty_at_three_bits :
  shorT 2 = 224 ∧ worstTerms (shorT 2) < 10 ^ 80
  ∧ shorT 3 = 756 ∧ worstTerms (shorT 3) > 10 ^ 80 := by decide

-- ── 5 · THE THOUSAND-BIT MODULUS OF THE FLOOR IS A THOUSAND BITS ────────────────────────────────────────────────
-- qpu_crypto.lean §6 names N = 2^999 + 1 and leaves it unfactored here. It has exactly 1000 bits — at least 2^999, below
-- 2^1000 — so the construction's T-count for it is shorT 1000, the 28·10⁹ of theorem 2.
theorem the_floors_modulus_two_to_the_999_plus_one_has_exactly_a_thousand_bits :
  2 ^ 999 ≤ 2 ^ 999 + 1 ∧ 2 ^ 999 + 1 < 2 ^ 1000 ∧ shorT 1000 = 7 * 4 * 1000 ^ 3 := by decide

-- ── 6 · THE COST IS EXPONENTIAL IN THE T-COUNT AND BLIND TO THE WIDTH (control) ─────────────────────────────────
-- A Clifford circuit (T-count 0) costs one term whatever its width, and each extra T at most doubles it: the bound depends
-- on t alone. The control is a width that changes nothing — the same t at width 2 and at the 2003 qubits of theorem 3.
def cost (t _width : Nat) : Nat := worstTerms t
theorem the_bound_depends_on_the_t_count_and_not_on_the_width :
  (List.range 9).all (fun t => cost t 2 == cost t 2003 && cost (t + 1) 2003 == 2 * cost t 2003)
  ∧ cost 0 2003 = 1 := by decide

-- ── 7 · A BETTER CONSTRUCTION MOVES THE WALL BY A CONSTANT, NOT OFF THE MAP ─────────────────────────────────────
-- Halving the Toffolis per addition, or the additions per multiplication, divides the T-count by a constant; the count stays
-- cubic in n, so the worst case stays 2^(c·n³). Decided for halving and quartering: at n = 1000 both still exceed 10⁹ T.
theorem a_constant_factor_saving_leaves_the_t_count_cubic :
  (List.range' 1 64).all (fun n => shorT n / 2 * 2 == shorT n && shorT n / 4 * 4 == shorT n)
  ∧ shorT 1000 / 4 > 10 ^ 9 ∧ shorT 1000 / 2 > 10 ^ 9 := by decide

-- ── 8 · AND A SMALL MODULUS IS INSIDE THE WALL (control) ────────────────────────────────────────────────────────
-- The wall is located, not asserted everywhere: at n = 1 the construction's T-count is 28 and its worst case 2^28 terms is
-- within reach, which is why the small instances the deposit does run (91 = 7 × 13 in qpu_crypto.lean) are classical work,
-- and the thousand-bit one is not: its T-count is exactly 10⁹ times the one-bit count — 1000³, the cube of the ratio of
-- the bit lengths — so its worst case is 2^(28·10⁹), not 2^28.
theorem a_one_bit_instance_is_within_reach_and_the_thousand_bit_one_is_not :
  shorT 1 = 28 ∧ worstTerms (shorT 1) < 10 ^ 9 ∧ shorT 1000 = shorT 1 * 10 ^ 9 := by decide

end TCountWall
