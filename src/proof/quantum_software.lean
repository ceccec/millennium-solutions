set_option maxRecDepth 100000
-- title: The rest of the quantum ideas, and the software layer — superdense coding, the two repetition codes correcting a state, the Toffoli gate, the swap test, and a compiler's rewrites, each decided exactly beside a control
-- wing: the floor
-- prior_art: named
-- prior_art_domain: superdense coding (Bennett, Wiesner 1992); the three-qubit bit-flip and phase-flip repetition codes and
--   stabilizer syndrome measurement (Shor 1995; Gottesman 1997); the Toffoli gate and reversible classical computation
--   (Toffoli 1980), with AND not affine over GF(2), which is why CNOT and NOT alone cannot compute it; the swap test
--   (Buhrman, Cleve, Watrous, de Wolf 2001), whose ancilla reads 0 with probability (1 + |⟨ψ|φ⟩|²)/2; and the textbook
--   circuit identities a compiler rewrites with — CNOT = (I⊗H)·CZ·(I⊗H) and SWAP = three alternating CNOTs (Nielsen,
--   Chuang, Quantum Computation and Quantum Information, §4.2–4.3, §10.1).
-- prior_art_note: none of this is new and none of it is this deposit's. What is decided HERE is each idea on exact integer
--   amplitudes — the Hadamard is kept unnormalised (H·H = 2·I), so every equality is between integer vectors and no float
--   or square root stands anywhere — over every input in a stated range, each beside a control that must come out the
--   other way. It is the specification an ideal device meets, §3.4.22 of ISO/IEC 4879 by definition, not a device run.
-- prior_art_search: not performed — every idea is named above and none is claimed as new.
-- prior_art_pool: named
-- prior_art_own: the exact-integer statement of each idea over a range, decided by exhaustion, with its control.
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- THE MODEL. An n-qubit state is a list of 2^n integer amplitudes; qubit k is bit k of the index. Gates act by index
-- arithmetic only — the bit flip is `i ± 2^k`, never Nat.xor, which would carry propext through well-founded recursion.
-- The Hadamard is unnormalised: H|0⟩ = |0⟩ + |1⟩, H|1⟩ = |0⟩ − |1⟩, so H·H = 2·I and every result is an integer vector
-- with a stated scale. A measurement of a stabilizer is its eigenvalue on the state: +1 if the operator fixes it, −1 if
-- it negates it — exactly what a syndrome measurement returns on a code state with at most the errors it is built for.
--
-- No axioms, no Mathlib, no sorry.

namespace QuantumSoftware

def bit (i k : Nat) : Nat := i / 2 ^ k % 2
def flip (i k : Nat) : Nat := if bit i k == 1 then i - 2 ^ k else i + 2 ^ k
def at' (v : List Int) (i : Nat) : Int := v.getD i 0
def gen (v : List Int) (f : Nat → Int) : List Int := (List.range v.length).map f

def X (k : Nat) (v : List Int) : List Int := gen v (fun i => at' v (flip i k))
def Z (k : Nat) (v : List Int) : List Int := gen v (fun i => if bit i k == 1 then -(at' v i) else at' v i)
def H (k : Nat) (v : List Int) : List Int := gen v (fun i => if bit i k == 0 then at' v i + at' v (flip i k) else at' v (flip i k) - at' v i)
def CX (c t : Nat) (v : List Int) : List Int := gen v (fun i => at' v (if bit i c == 1 then flip i t else i))
def CZ (a b : Nat) (v : List Int) : List Int := gen v (fun i => if bit i a == 1 && bit i b == 1 then -(at' v i) else at' v i)
def CCX (a b t : Nat) (v : List Int) : List Int := gen v (fun i => at' v (if bit i a == 1 && bit i b == 1 then flip i t else i))
-- controlled swap of qubits p and q, controlled by c: the index with bits p and q exchanged
def swapIdx (i p q : Nat) : Nat := if bit i p == bit i q then i else flip (flip i p) q
def CSWAP (c p q : Nat) (v : List Int) : List Int := gen v (fun i => at' v (if bit i c == 1 then swapIdx i p q else i))

def neg (v : List Int) : List Int := v.map (fun a => -a)
def scale (s : Int) (v : List Int) : List Int := v.map (fun a => s * a)
def basis (n i : Nat) : List Int := (List.range n).map (fun j => if j == i then 1 else 0)
def support (v : List Int) : List Nat := (List.range v.length).filter (fun i => at' v i != 0)
def sq (v : List Int) : List Nat := v.map (fun a => a.natAbs * a.natAbs)
/-- the eigenvalue a stabilizer measurement returns: +1 if the operator fixes the state, −1 if it negates it, 0 otherwise -/
def eig (op : List Int → List Int) (v : List Int) : Int := if op v == v then 1 else if op v == neg v then -1 else 0
def range5 : List Int := [-2, -1, 0, 1, 2]

-- ── 1 · SUPERDENSE CODING SENDS TWO BITS THROUGH ONE QUBIT ──────────────────────────────────────────────────────
-- Alice and Bob share the Bell pair |00⟩ + |11⟩. To send m = 2·z + x, Alice applies X^x then Z^z to HER qubit only and
-- sends it. Bob's Bell measurement — CNOT, then H on Alice's qubit — lands each of the four messages on its own basis
-- state with amplitude ±2 (the scale of one unnormalised H on a Bell pair of norm² 2): four messages, four outcomes.
def bell : List Int := [1, 0, 0, 1]
def encode (m : Nat) (v : List Int) : List Int :=
  let v1 := if m % 2 == 1 then X 0 v else v
  if m / 2 == 1 then Z 0 v1 else v1
def decode (v : List Int) : List Int := H 0 (CX 0 1 v)

theorem superdense_coding_sends_two_classical_bits_through_one_qubit :
  (List.range 4).all (fun m => (support (decode (encode m bell))).length == 1
      && ((decode (encode m bell)).map Int.natAbs).foldl (· + ·) 0 == 2)
  ∧ ((List.range 4).map (fun m => support (decode (encode m bell)))).eraseDups.length = 4 := by decide

-- ── 2 · AND IT NEEDS THE ENTANGLEMENT (control) ─────────────────────────────────────────────────────────────────
-- Start from the product state |00⟩ instead of the Bell pair and the same encode/decode leaves Bob only TWO
-- distinguishable outcome distributions for the four messages — one bit, which is all one qubit carries alone (Holevo).
theorem without_the_shared_pair_one_qubit_carries_only_one_bit :
  ((List.range 4).map (fun m => sq (decode (encode m [1, 0, 0, 0])))).eraseDups.length = 2
  ∧ ((List.range 4).map (fun m => sq (decode (encode m bell)))).eraseDups.length = 4 := by decide

-- ── 3 · THE BIT-FLIP CODE CORRECTS EVERY SINGLE BIT FLIP, ON EVERY STATE IN RANGE ───────────────────────────────
-- a|0⟩ + b|1⟩ is encoded as a|000⟩ + b|111⟩. The syndrome is the eigenvalues of Z₀Z₁ and Z₁Z₂, measured as stabilizers;
-- it names the flipped qubit, the matching X undoes it, and the encoded state returns exactly — for every a, b in
-- −2..2 and every error in {none, X₀, X₁, X₂}: 100 cases.
def bitCode (a b : Int) : List Int := [a, 0, 0, 0, 0, 0, 0, b]
def bitFix (v : List Int) : List Int :=
  let s1 := eig (fun w => Z 0 (Z 1 w)) v
  let s2 := eig (fun w => Z 1 (Z 2 w)) v
  if s1 == -1 && s2 == 1 then X 0 v else if s1 == -1 && s2 == -1 then X 1 v else if s1 == 1 && s2 == -1 then X 2 v else v
def bitErr (e : Nat) (v : List Int) : List Int := if e == 0 then v else X (e - 1) v

theorem the_bit_flip_code_corrects_every_single_bit_flip_on_every_state :
  range5.all (fun a => range5.all (fun b => (List.range 4).all (fun e =>
    bitFix (bitErr e (bitCode a b)) == bitCode a b))) := by decide

-- ── 4 · AND TWO FLIPS DEFEAT IT (control) ───────────────────────────────────────────────────────────────────────
-- Two flips produce the syndrome of the third qubit, so the "correction" completes a logical X: a|000⟩ + b|111⟩ becomes
-- b|000⟩ + a|111⟩ — exactly, for every state in range, and different from the original whenever a ≠ b. A distance-3
-- code corrects one error, which is what qec.lean's ⌊(d − 1)/2⌋ counts; here it is seen failing on the second.
theorem two_bit_flips_turn_the_correction_into_a_logical_error :
  range5.all (fun a => range5.all (fun b => bitFix (X 0 (X 1 (bitCode a b))) == bitCode b a))
  ∧ bitFix (X 0 (X 1 (bitCode 1 2))) != bitCode 1 2 := by decide

-- ── 5 · THE PHASE-FLIP CODE CORRECTS EVERY SINGLE PHASE FLIP ────────────────────────────────────────────────────
-- The same code in the Hadamard basis: a|+++⟩ + b|−−−⟩ (unnormalised: |+⟩ = |0⟩ + |1⟩). A Z error on qubit k is named
-- by the eigenvalues of X₀X₁ and X₁X₂ and undone by Z on that qubit — every a, b in −2..2, every error in
-- {none, Z₀, Z₁, Z₂}. Together with 3, the two halves Shor's nine-qubit code concatenates.
def plus3 : List Int := (List.range 8).map (fun _ => 1)
def minus3 : List Int := (List.range 8).map (fun i => if (bit i 0 + bit i 1 + bit i 2) % 2 == 1 then -1 else 1)
def phaseCode (a b : Int) : List Int := (List.range 8).map (fun i => a * at' plus3 i + b * at' minus3 i)
def phaseFix (v : List Int) : List Int :=
  let s1 := eig (fun w => X 0 (X 1 w)) v
  let s2 := eig (fun w => X 1 (X 2 w)) v
  if s1 == -1 && s2 == 1 then Z 0 v else if s1 == -1 && s2 == -1 then Z 1 v else if s1 == 1 && s2 == -1 then Z 2 v else v
def phaseErr (e : Nat) (v : List Int) : List Int := if e == 0 then v else Z (e - 1) v

theorem the_phase_flip_code_corrects_every_single_phase_flip_on_every_state :
  range5.all (fun a => range5.all (fun b => (List.range 4).all (fun e =>
    phaseFix (phaseErr e (phaseCode a b)) == phaseCode a b)))
  ∧ bitFix (Z 0 (bitCode 1 2)) != bitCode 1 2 := by decide

-- ── 6 · THE TOFFOLI GATE IS REVERSIBLE AND COMPUTES AND — WHICH CNOT AND NOT CANNOT ─────────────────────────────
-- On all eight basis states CCX is its own inverse, and with the target at 0 it writes a ∧ b there. The control is the
-- reason it is needed: every circuit of CNOTs and NOTs computes an AFFINE function over GF(2), and no affine function
-- c₀ ⊕ c₁a ⊕ c₂b equals a ∧ b — all eight are checked.
theorem the_toffoli_gate_is_reversible_and_computes_and_which_no_affine_circuit_can :
  (List.range 8).all (fun i => CCX 0 1 2 (CCX 0 1 2 (basis 8 i)) == basis 8 i)
  ∧ (List.range 2).all (fun a => (List.range 2).all (fun b =>
      CCX 0 1 2 (basis 8 (a + 2 * b)) == basis 8 (a + 2 * b + 4 * (a * b))))
  ∧ (List.range 8).all (fun c => !((List.range 2).all (fun a => (List.range 2).all (fun b =>
      (bit c 0 + bit c 1 * a + bit c 2 * b) % 2 == a * b)))) := by decide

-- ── 7 · THE SWAP TEST READS THE OVERLAP ─────────────────────────────────────────────────────────────────────────
-- Ancilla on qubit 0, |ψ⟩ on qubit 1, |φ⟩ on qubit 2; H, controlled swap, H. With the unnormalised H the ancilla's two
-- outcome weights are 2(‖ψ‖²‖φ‖² ± ⟨ψ,φ⟩²) — so P(0) = (1 + |⟨ψ|φ⟩|²)/2 after normalising — for every pair of real
-- states with amplitudes in −2..2: 625 pairs. Controls inside: identical states never read 1; orthogonal ones read 1
-- exactly as often as 0.
def pair (p0 p1 f0 f1 : Int) : List Int :=
  (List.range 8).map (fun i => if bit i 0 == 1 then 0 else (if bit i 1 == 1 then p1 else p0) * (if bit i 2 == 1 then f1 else f0))
def swapTest (v : List Int) : List Int := H 0 (CSWAP 0 1 2 (H 0 v))
def weight (v : List Int) (o : Nat) : Int := ((List.range 8).filter (fun i => bit i 0 == o)).foldl (fun s i => s + at' v i * at' v i) 0

theorem the_swap_test_reads_the_squared_overlap_on_every_pair_in_range :
  range5.all (fun p0 => range5.all (fun p1 => range5.all (fun f0 => range5.all (fun f1 =>
    let n := (p0 * p0 + p1 * p1) * (f0 * f0 + f1 * f1)
    let o := p0 * f0 + p1 * f1
    weight (swapTest (pair p0 p1 f0 f1)) 0 == 2 * (n + o * o) && weight (swapTest (pair p0 p1 f0 f1)) 1 == 2 * (n - o * o)))))
  ∧ weight (swapTest (pair 1 2 1 2)) 1 = 0
  ∧ weight (swapTest (pair 1 0 0 1)) 0 = weight (swapTest (pair 1 0 0 1)) 1 := by decide

-- ── 8 · A COMPILER'S REWRITES ARE SOUND — AND DROPPING ONE GATE IS NOT ──────────────────────────────────────────
-- The software layer: hardware that offers CZ but not CNOT runs CNOT as (I⊗H)·CZ·(I⊗H), and SWAP as three alternating
-- CNOTs. Both rewrites agree with the gate they replace on every basis state (the first at the scale 2 of two
-- unnormalised H). The control is the bug a transpiler can make: drop the second H and the result differs.
theorem a_compilers_cnot_and_swap_rewrites_are_exact_and_dropping_a_gate_breaks_them :
  (List.range 4).all (fun i => H 1 (CZ 0 1 (H 1 (basis 4 i))) == scale 2 (CX 0 1 (basis 4 i)))
  ∧ (List.range 4).all (fun i => CX 0 1 (CX 1 0 (CX 0 1 (basis 4 i))) == basis 4 (swapIdx i 0 1))
  ∧ (List.range 4).any (fun i => CZ 0 1 (H 1 (basis 4 i)) != scale 2 (CX 0 1 (basis 4 i))) := by decide

end QuantumSoftware
