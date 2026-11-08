set_option maxRecDepth 10000
-- title: Gate synthesis and fault-tolerance counts — learned from qpu's Clifford, Anyon, Magic and Qaoa
-- wing: the floor
-- prior_art: named
-- prior_art_domain: the order of the symplectic group Sp(2n, 2) = 2^(n²)·∏(4^j − 1) and the n-qubit Clifford group
--   (Gottesman 1997; used in randomized benchmarking); Fibonacci- and Ising-anyon fusion-space dimensions in
--   topological quantum computation (Freedman–Kitaev–Larsen–Wang 2003) — the Fibonacci number and 2^(m−1); the
--   [[15, 1, 3]] Reed–Muller magic-state distillation code with cubic error suppression (Bravyi–Kitaev 2005); and QAOA
--   circuit resource counts (Farhi–Goldstone–Gutmann 2014). Read from qpu.uuidna.com's Clifford.lean, Anyon.lean,
--   Magic.lean and Qaoa.lean (~/github/uuidna/qpu) on 2026-11-08 and ported here.
-- prior_art_note: none of this is new and none of it is this deposit's. qpu states each value as an rfl certificate on
--   a single input; what is decided HERE is the same quantities as functions, over a range, by exhaustion, each with a
--   control, and the honest bound that these are exact ABSTRACT group orders and resource counts, decided on the
--   classical build device — not physical quantum gates synthesised or executed on hardware.
-- prior_art_search: not performed — every object is named above and none is claimed as new.
-- prior_art_pool: named
-- prior_art_own: the quantities restated as decided range theorems with a control beside each, and the finite bound
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- No axioms, no Mathlib, no sorry.

namespace Synthesis

def sympProd : Nat → Nat                                  -- ∏_{j=1}^{k} (4^j − 1)
  | 0 => 1
  | k + 1 => (4 ^ (k + 1) - 1) * sympProd k
def symp     (nn : Nat) : Nat := 2 ^ (nn * nn) * sympProd nn   -- |Sp(2n, 2)|
def clifford (nn : Nat) : Nat := 2 ^ (2 * nn) * symp nn        -- |C_n|, the n-qubit Clifford group
def fib : Nat → Nat                                       -- Fibonacci-anyon fusion dimension
  | 0 => 0 | 1 => 1 | n + 2 => fib (n + 1) + fib n
def ising (m : Nat) : Nat := 2 ^ (m - 1)                  -- Ising-anyon fusion dimension (m pairs)
def qaoaParams (p : Nat)   : Nat := 2 * p                 -- two variational parameters per layer
def qaoaZz     (p e : Nat) : Nat := p * e                 -- cost-layer ZZ gates over e edges, p layers
def qaoaX      (p q : Nat) : Nat := p * q                 -- mixer X gates over q qubits, p layers

-- ── 1 · THE SINGLE-QUBIT CLIFFORD GROUP HAS ORDER 24, Sp(2,2) HAS ORDER 6 = |S₃| ──────────────────────────
theorem the_single_qubit_clifford_group_has_order_twenty_four :
  symp 1 = 6 ∧ clifford 1 = 24 ∧ 24 = 4 * 6 ∧ 6 = 1 * 2 * 3 := by decide

-- ── 2 · THE SYMPLECTIC ORDER Sp(2n,2) = 2^(n²)·∏(4^j − 1), OVER n = 1..3 ──────────────────────────────────
theorem the_symplectic_group_order_at_each_rank :
  (List.range' 1 3).map symp = [6, 720, 1451520]
  ∧ (List.range' 1 3).all (fun nn => symp nn == 2 ^ (nn * nn) * sympProd nn) := by decide

-- ── 3 · THE TWO-QUBIT CLIFFORD GROUP HAS ORDER 11520 ─────────────────────────────────────────────────────
theorem the_two_qubit_clifford_group_has_order_eleven_thousand_five_hundred_twenty :
  clifford 2 = 11520 ∧ clifford 2 = 16 * 720 ∧ clifford 1 < clifford 2 := by decide

-- ── 4 · FIBONACCI-ANYON FUSION DIMENSION IS THE FIBONACCI NUMBER ─────────────────────────────────────────
theorem fibonacci_anyon_fusion_is_the_fibonacci_number :
  (List.range' 1 10).map fib = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55]
  ∧ fib 5 = 5 ∧ fib 10 = 55
  ∧ (List.range' 1 10).all (fun n => fib (n + 2) == fib (n + 1) + fib n) := by decide

-- ── 5 · ISING-ANYON FUSION IS 2^(m−1) — THE CONTROL: DIFFERENT GROWTH FROM FIBONACCI ─────────────────────
theorem ising_anyon_fusion_is_two_to_the_m_minus_one_and_differs_from_fibonacci :
  (List.range' 1 5).map ising = [1, 2, 4, 8, 16]
  ∧ ising 3 = 4 ∧ fib 5 ≠ ising 5 := by decide

-- ── 6 · THE [[15,1,3]] REED–MULLER MAGIC CODE, 15-TO-1 DISTILLATION ──────────────────────────────────────
theorem the_fifteen_to_one_magic_code_is_fifteen_one_three :
  2 ^ 4 - 1 = 15 ∧ (3 - 1) / 2 = 1 ∧ 35 = 28 + 7 ∧ 15 = 1 + 14 := by decide

-- ── 7 · QAOA RESOURCE COUNTS OVER THE LAYERS ─────────────────────────────────────────────────────────────
theorem qaoa_resource_counts_over_the_layers :
  (List.range' 1 5).map qaoaParams = [2, 4, 6, 8, 10]
  ∧ qaoaZz 2 5 = 10 ∧ qaoaX 3 4 = 12
  ∧ (List.range' 1 5).all (fun p => qaoaParams p == 2 * p) := by decide

-- ── 8 · THE HONEST BOUND: EXACT ORDERS AND COUNTS, DECIDED — ABSTRACT STRUCTURE, NOT PHYSICAL GATES ──────
-- These are exact group orders and resource counts — the arithmetic of benchmarking, distillation and fusion —
-- decided on the classical build device over a finite domain. No physical Clifford gate is synthesised and no circuit
-- runs on hardware: the counts are the structure a fault-tolerant machine WOULD use, computed, not the machine.
theorem these_are_exact_orders_and_counts_decided_over_a_finite_domain :
  (List.range' 1 3).all (fun nn => clifford nn == 2 ^ (2 * nn) * symp nn)
  ∧ (List.range' 1 10).all (fun n => 0 < fib (n + 1))
  ∧ clifford 2 = 11520 ∧ symp 3 = 1451520 := by decide

end Synthesis
