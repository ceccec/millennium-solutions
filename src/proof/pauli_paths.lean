set_option maxRecDepth 100000
-- title: Pauli paths — the conjugation rules that let any Clifford+T circuit be computed exactly at any width, decided against the matrices in ℤ[ω], with the T-count as the only cost
-- wing: the floor
-- prior_art: named
-- prior_art_domain: the Heisenberg picture and Pauli propagation; the Gottesman–Knill theorem and the stabilizer tableau's
--   conjugation rules, including the CNOT phase rule (Gottesman 1998; Aaronson, Gottesman 2004, "Improved simulation of
--   stabilizer circuits"); the T gate's action T†XT = (X − Y)/√2 and the cost of non-Clifford gates in Pauli-path and
--   stabilizer-rank methods (Bravyi, Gosset 2016).
-- prior_art_note: none of these rules is new. What is decided HERE is each rule src/quantum/paulipath.ts applies, checked
--   against the actual 2×2 and 4×4 matrices over ℤ[ω] — every single-qubit Pauli through H, S, T and T†, every one of the
--   sixteen two-qubit Paulis through CNOT and CZ against the tableau's own bit-and-sign formula — and the cost law: a
--   Clifford gate maps one Pauli to one, T to at most two. The width never appears, because every rule is local to the
--   qubits a gate touches; that is why the engine has no width bound and its bound is the T-count instead.
-- prior_art_search: not performed — every rule is named above and none is claimed as new.
-- prior_art_pool: named
-- prior_art_own: the rules decided against their matrices, exhaustively, with the sign-flipped T rule refuted beside them.
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- ℤ[ω], ω = e^{iπ/4}, as four integer coordinates on 1, ω, ω², ω³ with ω⁴ = −1. A 2×2 matrix is four entries a b c d
-- (rows a b / c d); a 4×4 matrix is a function of row and column, the first tensor factor the high index bit. The Hadamard
-- is unnormalised (H·H = 2·I) and √2 = ω − ω³ multiplies the T rules, so every equality is exact and integral.
--
-- No axioms, no Mathlib, no sorry.

namespace PauliPaths

abbrev Zw := Int × Int × Int × Int
def zadd (x y : Zw) : Zw := (x.1 + y.1, x.2.1 + y.2.1, x.2.2.1 + y.2.2.1, x.2.2.2 + y.2.2.2)
def zneg (x : Zw) : Zw := (-x.1, -x.2.1, -x.2.2.1, -x.2.2.2)
def zmul (x y : Zw) : Zw :=
  let (a, b, c, d) := x; let (e, f, g, h) := y
  (a * e - b * h - c * g - d * f, a * f + b * e - c * h - d * g, a * g + b * f + c * e - d * h, a * h + b * g + c * f + d * e)
def zconj (x : Zw) : Zw := (x.1, -x.2.2.2, -x.2.2.1, -x.2.1)
def z0 : Zw := (0, 0, 0, 0)
def z1 : Zw := (1, 0, 0, 0)
def zi : Zw := (0, 0, 1, 0)        -- i = ω²
def w1 : Zw := (0, 1, 0, 0)        -- ω
def root2 : Zw := (0, 1, 0, -1)    -- √2 = ω − ω³

abbrev M2 := Zw × Zw × Zw × Zw
def mul2 (p q : M2) : M2 :=
  let (a, b, c, d) := p; let (e, f, g, h) := q
  (zadd (zmul a e) (zmul b g), zadd (zmul a f) (zmul b h), zadd (zmul c e) (zmul d g), zadd (zmul c f) (zmul d h))
def add2 (p q : M2) : M2 := (zadd p.1 q.1, zadd p.2.1 q.2.1, zadd p.2.2.1 q.2.2.1, zadd p.2.2.2 q.2.2.2)
def scale2 (s : Zw) (p : M2) : M2 := (zmul s p.1, zmul s p.2.1, zmul s p.2.2.1, zmul s p.2.2.2)
def neg2 (p : M2) : M2 := scale2 (zneg z1) p
def dag2 (p : M2) : M2 := (zconj p.1, zconj p.2.2.1, zconj p.2.1, zconj p.2.2.2)

def I2 : M2 := (z1, z0, z0, z1)
def X2 : M2 := (z0, z1, z1, z0)
def Y2 : M2 := (z0, zneg zi, zi, z0)
def Z2 : M2 := (z1, z0, z0, zneg z1)
def H2 : M2 := (z1, z1, z1, zneg z1)            -- unnormalised: H2·H2 = 2·I
def S2 : M2 := (z1, z0, z0, zi)
def T2 : M2 := (z1, z0, z0, w1)
/-- the Pauli a tableau row names: (x, z) = (0,0) I, (1,0) X, (0,1) Z, (1,1) Y -/
def pauli (x z : Nat) : M2 := if x == 0 && z == 0 then I2 else if x == 1 && z == 0 then X2 else if x == 0 then Z2 else Y2
/-- G† P G -/
def conj2 (g p : M2) : M2 := mul2 (dag2 g) (mul2 p g)

-- ── 1 · HADAMARD: X ↔ Z, Y → −Y ─────────────────────────────────────────────────────────────────────────────────
theorem hadamard_swaps_x_and_z_and_negates_y :
  (conj2 H2 X2 == scale2 (2, 0, 0, 0) Z2 && conj2 H2 Z2 == scale2 (2, 0, 0, 0) X2 && conj2 H2 Y2 == scale2 (-2, 0, 0, 0) Y2
  && mul2 H2 H2 == scale2 (2, 0, 0, 0) I2) = true := by decide

-- ── 2 · PHASE: S† X S = −Y, S† Y S = X, Z fixed ────────────────────────────────────────────────────────────────
theorem the_phase_gate_turns_x_into_minus_y_and_y_into_x :
  (conj2 S2 X2 == neg2 Y2 && conj2 S2 Y2 == X2 && conj2 S2 Z2 == Z2) = true := by decide

-- ── 3 · T: √2·T†XT = X − Y, √2·T†YT = X + Y, Z fixed — the only rule that splits one Pauli into two ─────────────
theorem the_t_gate_splits_x_and_y_into_two_paulis_over_root_two :
  (scale2 root2 (conj2 T2 X2) == add2 X2 (neg2 Y2) && scale2 root2 (conj2 T2 Y2) == add2 X2 Y2 && conj2 T2 Z2 == Z2) = true := by decide

-- ── 4 · T†: √2·T X T† = X + Y, √2·T Y T† = −X + Y ──────────────────────────────────────────────────────────────
theorem the_inverse_t_gate_splits_them_the_other_way :
  (scale2 root2 (mul2 T2 (mul2 X2 (dag2 T2))) == add2 X2 Y2
  && scale2 root2 (mul2 T2 (mul2 Y2 (dag2 T2))) == add2 (neg2 X2) Y2
  && mul2 T2 (dag2 T2) == I2) = true := by decide

-- ── the two-qubit layer: 4×4 matrices as functions of row and column, control the high bit ─────────────────────
def ent (p : M2) (r c : Nat) : Zw := if r == 0 then (if c == 0 then p.1 else p.2.1) else (if c == 0 then p.2.2.1 else p.2.2.2)
def kron (a b : M2) (r c : Nat) : Zw := zmul (ent a (r / 2) (c / 2)) (ent b (r % 2) (c % 2))
def mul4 (a b : Nat → Nat → Zw) (r c : Nat) : Zw := (List.range 4).foldl (fun s k => zadd s (zmul (a r k) (b k c))) z0
def eq4 (a b : Nat → Nat → Zw) : Bool := (List.range 4).all (fun r => (List.range 4).all (fun c => a r c == b r c))
def neg4 (a : Nat → Nat → Zw) (r c : Nat) : Zw := zneg (a r c)
def CX4 (r c : Nat) : Zw := if (if c / 2 == 1 then 2 + (1 - c % 2) else c) == r then z1 else z0   -- |a b⟩ ↦ |a, b ⊕ a⟩
def CZ4 (r c : Nat) : Zw := if r == c then (if r == 3 then zneg z1 else z1) else z0

/-- the tableau's CNOT rule (Aaronson–Gottesman): sign flips iff x_c z_t (x_t ⊕ z_c ⊕ 1); x_t ^= x_c; z_c ^= z_t -/
def cxRule (xc zc xt zt : Nat) (r c : Nat) : Zw :=
  let flip := xc == 1 && zt == 1 && xt == zc
  let m := kron (pauli xc ((zc + zt) % 2)) (pauli ((xt + xc) % 2) zt) r c
  if flip then zneg m else m
/-- CZ by the same bits: z_c ^= x_t, z_t ^= x_c, sign flips iff x_c x_t (z_c ⊕ z_t) -/
def czRule (xc zc xt zt : Nat) (r c : Nat) : Zw :=
  let flip := xc == 1 && xt == 1 && zc != zt
  let m := kron (pauli xc ((zc + xt) % 2)) (pauli xt ((zt + xc) % 2)) r c
  if flip then zneg m else m
def bits4 : List (Nat × Nat × Nat × Nat) := (List.range 16).map (fun i => (i % 2, i / 2 % 2, i / 4 % 2, i / 8 % 2))

-- ── 5 · CNOT: the tableau's bit-and-sign formula is the matrix conjugation, on all sixteen two-qubit Paulis ──────
theorem the_cnot_tableau_rule_is_the_matrix_conjugation_on_all_sixteen_paulis :
  bits4.all (fun b => eq4 (mul4 CX4 (mul4 (kron (pauli b.1 b.2.1) (pauli b.2.2.1 b.2.2.2)) CX4)) (cxRule b.1 b.2.1 b.2.2.1 b.2.2.2)) := by decide

-- ── 6 · CZ: likewise, all sixteen ───────────────────────────────────────────────────────────────────────────────
theorem the_cz_rule_is_the_matrix_conjugation_on_all_sixteen_paulis :
  bits4.all (fun b => eq4 (mul4 CZ4 (mul4 (kron (pauli b.1 b.2.1) (pauli b.2.2.1 b.2.2.2)) CZ4)) (czRule b.1 b.2.1 b.2.2.1 b.2.2.2)) := by decide

-- ── 7 · THE COST LAW: a Clifford gate maps one Pauli to one, T to at most two — so the width is free ─────────────
-- On the single-qubit Paulis: under H and S the image is ± one Pauli (one term); under T, the image scaled by √2 is a sum
-- of two Paulis when the Pauli anticommutes with Z (X and Y), and one when it does not (Z). A term is a Pauli p whose
-- trace against the image, tr(p·m), is nonzero.
def terms (m : M2) : Nat := ([I2, X2, Y2, Z2].filter (fun p => let t := mul2 p m; zadd t.1 t.2.2.2 != z0)).length
theorem a_clifford_gate_keeps_one_term_and_t_makes_at_most_two :
  [X2, Y2, Z2].all (fun p => terms (conj2 H2 p) == 1 && terms (conj2 S2 p) == 1)
  ∧ [X2, Y2].all (fun p => terms (scale2 root2 (conj2 T2 p)) == 2)
  ∧ terms (conj2 T2 Z2) = 1 := by decide

-- ── 8 · AND THE SIGN-FLIPPED T RULE IS NOT A CONJUGATION AT ALL (control) ───────────────────────────────────────
-- The mutation the engine's own checker caught — X ↦ (X + Y)/√2, Y ↦ (X − Y)/√2 under T — fails to preserve the product
-- XY = iZ that every conjugation preserves: its (√2-scaled) images multiply to −2iZ instead of 2iZ. The true rule keeps it.
def wrongTX : M2 := add2 X2 Y2
def wrongTY : M2 := add2 X2 (neg2 Y2)
theorem the_sign_flipped_t_rule_breaks_the_pauli_product_and_the_true_rule_keeps_it :
  (mul2 (scale2 root2 (conj2 T2 X2)) (scale2 root2 (conj2 T2 Y2)) == scale2 (zmul (2, 0, 0, 0) zi) Z2
  && mul2 wrongTX wrongTY == scale2 (zmul (-2, 0, 0, 0) zi) Z2
  && mul2 X2 Y2 == scale2 zi Z2) = true := by decide

end PauliPaths
