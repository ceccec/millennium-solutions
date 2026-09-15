import Fnv
set_option maxRecDepth 2000000
set_option maxHeartbeats 2000000
-- title: Nim
-- wing: the machine
-- prior_art: named
-- prior_art_domain: combinatorial game theory
-- prior_art_note: Nim — Charles L. Bouton, 1901; the Sprague–Grundy theorem — Roland Sprague, 1935 and Patrick M. Grundy, 1939
-- Nim — Bouton's theorem and Sprague–Grundy, decided.
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- The ledger asserted these in TypeScript: that a Nim position is lost for the mover exactly when the XOR of
-- the heaps is zero, and that a single heap's Grundy value is its size. Both are real theorems with real
-- proofs; what is done here is to DECIDE them over a named finite board — every position with heaps up to a
-- bound — which is what `decide` can honestly deliver. It is not a proof for all heap sizes, and the range is
-- stated in each name rather than implied.
--
-- XOR is imported from Fnv rather than restated: it is the same fuel-bounded structural fold, built because
-- Nat's bitwise operations are well-founded and would drag `propext` into every theorem here. Its laws are
-- proved below for every a, b, c, on the standard axioms; the decided rows above stay as their instances.

namespace Nim

open Fnv (xorF)

-- the fuel is a + b + 1, which always exceeds what the fold needs (each step halves both arguments and the fold
-- stops at the first zero); the earlier fuel of 33 read XOR correctly only below 2³³ — a cap, now gone
def xorN (a b : Nat) : Nat := xorF (a + b + 1) a b
-- The board is SMALL and stated, because the game tree is exponential: deciding `lost` explores every play
-- from every position, and at 8x8 the kernel exceeds its heartbeat budget. Six is what `decide` settles here
-- in reasonable time. A larger board is not a harder theorem, it is a longer computation — and claiming the
-- general case would need an induction, not a bigger range.
def N : Nat := 6

/-- the moves from a two-heap position: take any positive amount from either heap -/
def moves (a b : Nat) : List (Nat × Nat) :=
  ((List.range a).map (fun x => (x, b))) ++ ((List.range b).map (fun y => (a, y)))

/-- a position is LOST for the mover when every move leads to a position that is won for the opponent.
    Fuel-bounded: the total of the heaps strictly decreases with each move. -/
def lost : Nat → Nat → Nat → Bool
  | 0, _, _ => true
  | Nat.succ f, a, b => (moves a b).all (fun p => ! lost f p.1 p.2)

def isLost (a b : Nat) : Bool := lost (a + b + 1) a b

-- ── BOUTON: a two-heap position is lost for the mover exactly when the heaps are equal — which is exactly
--    when their XOR is zero. Decided over every position on the N×N board, N = 6. ──
theorem bouton_two_heaps_lost_iff_xor_zero :
  (List.range N).all (fun a => (List.range N).all (fun b =>
    isLost a b == (xorN a b == 0))) := by decide

-- ── the same statement in its familiar form: lost exactly when the heaps are equal ──
theorem bouton_lost_iff_heaps_equal :
  (List.range N).all (fun a => (List.range N).all (fun b => isLost a b == (a == b))) := by decide

-- ── NON-VACUITY: the losing positions are exactly the diagonal, so there are N of them among N² — neither
--    everything nor nothing. (An earlier version fixed this count at 8 for an 8x8 board; when the board was
--    reduced the kernel proved the statement FALSE rather than letting a stale constant pass. Tied to N now.) ──
theorem lost_positions_are_exactly_the_diagonal :
  (((List.range N).flatMap (fun a => (List.range N).map (fun b => (a, b)))).filter
    (fun p => isLost p.1 p.2)).length = N := by decide

-- ── SPRAGUE–GRUNDY for one heap: the Grundy value of a heap of size n is n ──
def mex (s : List Nat) : Nat := ((List.range (s.length + 1)).filter (fun m => ! s.contains m)).headD 0
def grundy1 : Nat → Nat → Nat
  | 0, _ => 0
  | Nat.succ f, n => mex ((List.range n).map (fun k => grundy1 f k))

theorem grundy_of_a_single_heap_is_its_size :
  (List.range N).all (fun n => grundy1 (n + 1) n == n) := by decide

-- ── and the two-heap Grundy value is the XOR of the parts ──
theorem grundy_of_two_heaps_is_the_xor :
  (List.range N).all (fun a => (List.range N).all (fun b =>
    (xorN (grundy1 (a + 1) a) (grundy1 (b + 1) b)) == xorN a b)) := by decide

-- ── XOR's algebra, which is why the theorem takes the form it does ──
theorem xor_is_its_own_inverse :
  (List.range 16).all (fun a => (List.range 16).all (fun b => xorN (xorN a b) b == a)) := by decide
theorem xor_is_commutative :
  (List.range 16).all (fun a => (List.range 16).all (fun b => xorN a b == xorN b a)) := by decide
theorem xor_zero_is_identity : (List.range 32).all (fun a => xorN a 0 == a) := by decide

-- ── THE NIM-SUM AS GF(2) VECTOR ADDITION, IN ONE PROPOSITION ─────────────────────────────────────────────
--    `nim_sum_is_xor_gf2` claims the nim-sum IS GF(2) vector addition: commutative, associative and
--    self-inverse. Associativity was the one property missing here — and the other three, though each
--    decided above, are decided SEPARATELY. A claim is carried by a theorem that decides all of it or by
--    none, and the ledger's supersededBy names exactly one key, so three quarters of a claim spread over
--    three theorems carries nothing. The conjunction is the claim; the conjuncts standing alone are its
--    parts, which is why both forms are here rather than one. Range 16 because the cube of it is walked.
theorem the_nim_sum_is_a_gf2_vector_addition :
  (List.range 16).all (fun a => (List.range 16).all (fun b => xorN a b == xorN b a)) ∧
  (List.range 16).all (fun a => (List.range 16).all (fun b => (List.range 16).all (fun c =>
    xorN (xorN a b) c == xorN a (xorN b c)))) ∧
  (List.range 16).all (fun a => (List.range 16).all (fun b => xorN (xorN a b) b == a)) ∧
  (List.range 16).all (fun a => xorN a 0 == a) := by decide

-- ── BOUTON WITH SEVEN HEAP SIZES, because "heaps ≤ 6" means seven of them and N = 6 gives six ─────────────
--    The ledger's row says "all heaps ≤ 6, exhaustive". `bouton_two_heaps_lost_iff_xor_zero` ranges over
--    List.range N with N = 6, which is 0…5 — one short. Carrying the row on it would have claimed a
--    position nobody decided, over an off-by-one nobody would ever see. The board is widened here instead,
--    in a theorem of its own, because N is baked into the statements already sealed above.
set_option maxRecDepth 4000000 in
theorem bouton_holds_at_every_heap_size_to_six :
  (List.range 7).all (fun a => (List.range 7).all (fun b => isLost a b == (xorN a b == 0))) := by decide


-- ── XOR's algebra for every a, b, c — no bound ───────────────────────────────────────────────────────────────
-- xor_is_its_own_inverse and xor_is_commutative (a, b < 16), xor_zero_is_identity (a < 32) and
-- the_nim_sum_is_a_gf2_vector_addition (a, b, c < 16) were decided over a range; these prove them for every value.
-- The fold's fuel is a + b + 1, which always suffices: once it exceeds either argument, more fuel changes nothing,
-- so xorN reads the same at any sufficient fuel. Everything follows from one step — the low bit of a XOR is the sum
-- of the low bits mod 2, and the rest is twice the XOR of the halves — by induction. Bouton's theorem itself is
-- still decided over the N×N board above; a proof of it for every heap is a game-tree induction not done here.
theorem the_xor_of_two_bits_is_their_sum_mod_two :
    ∀ x y : Nat, (if x % 2 == y % 2 then 0 else 1) = (x + y) % 2 := by
  intro x y
  split
  · rename_i h
    have := beq_iff_eq.mp h
    omega
  · rename_i h
    have : x % 2 ≠ y % 2 := fun e => h (beq_iff_eq.mpr e)
    omega

theorem xor_commutes_at_every_fuel : ∀ f a b : Nat, xorF f a b = xorF f b a := by
  intro f
  induction f with
  | zero => intro a b; cases a <;> cases b <;> rfl
  | succ f ih =>
    intro a b
    cases a with
    | zero => cases b <;> rfl
    | succ a =>
      cases b with
      | zero => rfl
      | succ b =>
        show (if (a + 1) % 2 == (b + 1) % 2 then 0 else 1) + 2 * xorF f ((a + 1) / 2) ((b + 1) / 2) =
          (if (b + 1) % 2 == (a + 1) % 2 then 0 else 1) + 2 * xorF f ((b + 1) / 2) ((a + 1) / 2)
        rw [ih ((a + 1) / 2), the_xor_of_two_bits_is_their_sum_mod_two, the_xor_of_two_bits_is_their_sum_mod_two]
        omega

theorem one_more_step_of_fuel_changes_nothing_once_it_exceeds_an_argument :
    ∀ f a b : Nat, (a < f ∨ b < f) → xorF (f + 1) a b = xorF f a b := by
  intro f
  induction f with
  | zero => intro a b h; rcases h with h | h <;> exact absurd h (Nat.not_lt_zero _)
  | succ f ih =>
    intro a b h
    cases a with
    | zero => cases b <;> rfl
    | succ a =>
      cases b with
      | zero => rfl
      | succ b =>
        show (if (a + 1) % 2 == (b + 1) % 2 then 0 else 1) + 2 * xorF (f + 1) ((a + 1) / 2) ((b + 1) / 2) =
          (if (a + 1) % 2 == (b + 1) % 2 then 0 else 1) + 2 * xorF f ((a + 1) / 2) ((b + 1) / 2)
        have h' : (a + 1) / 2 < f ∨ (b + 1) / 2 < f := by
          rcases h with h | h
          · exact Or.inl (by omega)
          · exact Or.inr (by omega)
        rw [ih _ _ h']

theorem more_fuel_changes_nothing_once_it_exceeds_an_argument :
    ∀ k f a b : Nat, (a < f ∨ b < f) → xorF (f + k) a b = xorF f a b := by
  intro k
  induction k with
  | zero => intro f a b _; rfl
  | succ k ih =>
    intro f a b h
    have h' : a < f + k ∨ b < f + k := by
      rcases h with h | h
      · exact Or.inl (by omega)
      · exact Or.inr (by omega)
    rw [← Nat.add_assoc, one_more_step_of_fuel_changes_nothing_once_it_exceeds_an_argument _ _ _ h', ih f a b h]

theorem xor_reads_the_same_at_every_sufficient_fuel :
    ∀ g a b : Nat, (a < g ∨ b < g) → xorN a b = xorF g a b := by
  intro g a b h
  unfold xorN
  have h1 : a < a + b + 1 ∨ b < a + b + 1 := Or.inl (by omega)
  rw [← more_fuel_changes_nothing_once_it_exceeds_an_argument g (a + b + 1) a b h1,
    ← more_fuel_changes_nothing_once_it_exceeds_an_argument (a + b + 1) g a b h, Nat.add_comm g]

theorem a_number_xored_with_itself_is_zero_at_every_fuel : ∀ f b : Nat, xorF f b b = 0 := by
  intro f
  induction f with
  | zero => intro b; cases b <;> rfl
  | succ f ih =>
    intro b
    cases b with
    | zero => rfl
    | succ b =>
      show (if (b + 1) % 2 == (b + 1) % 2 then 0 else 1) + 2 * xorF f ((b + 1) / 2) ((b + 1) / 2) = 0
      rw [ih, the_xor_of_two_bits_is_their_sum_mod_two]
      omega

theorem xor_splits_off_its_lowest_bit :
    ∀ g x c : Nat, 1 ≤ g → xorF (g + 1) x c = (x + c) % 2 + 2 * xorF g (x / 2) (c / 2) := by
  intro g x c hg
  obtain ⟨g', rfl⟩ : ∃ g', g = g' + 1 := ⟨g - 1, by omega⟩
  cases x with
  | zero =>
    rw [show xorF (g' + 1 + 1) 0 c = c by cases c <;> rfl, Nat.zero_div,
      show xorF (g' + 1) 0 (c / 2) = c / 2 by cases (c / 2) <;> rfl]
    omega
  | succ x =>
    cases c with
    | zero =>
      rw [show xorF (g' + 1 + 1) (x + 1) 0 = x + 1 from rfl, Nat.zero_div,
        show xorF (g' + 1) ((x + 1) / 2) 0 = (x + 1) / 2 by cases ((x + 1) / 2) <;> rfl]
      omega
    | succ c =>
      show (if (x + 1) % 2 == (c + 1) % 2 then 0 else 1) + 2 * xorF (g' + 1) ((x + 1) / 2) ((c + 1) / 2) = _
      rw [the_xor_of_two_bits_is_their_sum_mod_two]

theorem xor_undoes_itself_when_the_fuel_suffices :
    ∀ f a b g : Nat, (a < f ∨ b < f) → b < g → xorF g (xorF f a b) b = a := by
  intro f
  induction f with
  | zero => intro a b g h; rcases h with h | h <;> exact absurd h (Nat.not_lt_zero _)
  | succ f ih =>
    intro a b g h hg
    cases a with
    | zero =>
      rw [show xorF (f + 1) 0 b = b by cases b <;> rfl]
      exact a_number_xored_with_itself_is_zero_at_every_fuel g b
    | succ a =>
      cases b with
      | zero =>
        obtain ⟨g', rfl⟩ : ∃ g', g = g' + 1 := ⟨g - 1, by omega⟩
        rfl
      | succ b =>
        obtain ⟨g', rfl⟩ : ∃ g', g = g' + 1 := ⟨g - 1, by omega⟩
        have hf : (a + 1) / 2 < f ∨ (b + 1) / 2 < f := by
          rcases h with h | h
          · exact Or.inl (by omega)
          · exact Or.inr (by omega)
        have ih' := ih ((a + 1) / 2) ((b + 1) / 2) g' hf (by omega)
        rw [xor_splits_off_its_lowest_bit g' _ _ (by omega)]
        rw [show xorF (f + 1) (a + 1) (b + 1) = (if (a + 1) % 2 == (b + 1) % 2 then 0 else 1) +
          2 * xorF f ((a + 1) / 2) ((b + 1) / 2) from rfl, the_xor_of_two_bits_is_their_sum_mod_two]
        generalize xorF f ((a + 1) / 2) ((b + 1) / 2) = y at ih' ⊢
        have e : ((a + 1 + (b + 1)) % 2 + 2 * y) / 2 = y := by omega
        rw [e, ih']
        omega

theorem xor_is_commutative_for_every_a_b : ∀ a b : Nat, xorN a b = xorN b a := by
  intro a b
  unfold xorN
  rw [Nat.add_comm a b, xor_commutes_at_every_fuel]

theorem xor_zero_is_identity_for_every_a : ∀ a : Nat, xorN a 0 = a := by
  intro a
  unfold xorN
  cases a <;> rfl

theorem xor_is_its_own_inverse_for_every_a_b : ∀ a b : Nat, xorN (xorN a b) b = a := by
  intro a b
  rw [xor_reads_the_same_at_every_sufficient_fuel (b + 1) (xorN a b) b (Or.inr (by omega))]
  unfold xorN
  exact xor_undoes_itself_when_the_fuel_suffices (a + b + 1) a b (b + 1) (Or.inl (by omega)) (by omega)
theorem xor_is_the_sum_of_the_bits_plus_twice_the_xor_of_the_halves :
    ∀ a b : Nat, xorN a b = (a + b) % 2 + 2 * xorN (a / 2) (b / 2) := by
  intro a b
  rw [xor_reads_the_same_at_every_sufficient_fuel (a + b + 1 + 1) a b (Or.inl (by omega)),
    xor_splits_off_its_lowest_bit (a + b + 1) a b (by omega),
    ← xor_reads_the_same_at_every_sufficient_fuel (a + b + 1) (a / 2) (b / 2) (Or.inl (by omega))]

theorem xor_is_associative_below_every_bound :
    ∀ n a b c : Nat, a + b + c ≤ n → xorN (xorN a b) c = xorN a (xorN b c) := by
  intro n
  induction n with
  | zero =>
    intro a b c h
    have ha : a = 0 := by omega
    have hb : b = 0 := by omega
    have hc : c = 0 := by omega
    subst ha hb hc
    rfl
  | succ n ih =>
    intro a b c h
    if hz : a + b + c = 0 then
      have ha : a = 0 := by omega
      have hb : b = 0 := by omega
      have hc : c = 0 := by omega
      subst ha hb hc
      rfl
    else
      have ihh := ih (a / 2) (b / 2) (c / 2) (by omega)
      have hab := xor_is_the_sum_of_the_bits_plus_twice_the_xor_of_the_halves a b
      have hbc := xor_is_the_sum_of_the_bits_plus_twice_the_xor_of_the_halves b c
      have hx2 : xorN a b / 2 = xorN (a / 2) (b / 2) := by omega
      have hy2 : xorN b c / 2 = xorN (b / 2) (c / 2) := by omega
      rw [xor_is_the_sum_of_the_bits_plus_twice_the_xor_of_the_halves (xorN a b) c,
        xor_is_the_sum_of_the_bits_plus_twice_the_xor_of_the_halves a (xorN b c), hx2, hy2, ihh]
      omega

theorem xor_is_associative_for_every_a_b_c : ∀ a b c : Nat, xorN (xorN a b) c = xorN a (xorN b c) := by
  intro a b c
  exact xor_is_associative_below_every_bound (a + b + c) a b c (Nat.le_refl _)

theorem the_nim_sum_is_a_gf2_vector_addition_for_every_a_b_c :
    ∀ a b c : Nat, xorN a b = xorN b a ∧ xorN (xorN a b) c = xorN a (xorN b c) ∧
      xorN (xorN a b) b = a ∧ xorN a 0 = a := by
  intro a b c
  exact ⟨xor_is_commutative_for_every_a_b a b, xor_is_associative_for_every_a_b_c a b c,
    xor_is_its_own_inverse_for_every_a_b a b, xor_zero_is_identity_for_every_a a⟩


-- ── reflections, from the xor batch: each law beside its inverse (the 2×7 ↔ 1+6 wave) ──
-- REFLECTIONS
theorem a_number_xored_with_itself_is_zero_for_every_a : ∀ a : Nat, xorN a a = 0 := by
  intro a; unfold xorN; exact a_number_xored_with_itself_is_zero_at_every_fuel _ a

theorem xor_is_zero_only_on_equal_arguments_for_every_a_b : ∀ a b : Nat, xorN a b = 0 ↔ a = b := by
  intro a b
  constructor
  · intro h
    have := xor_is_its_own_inverse_for_every_a_b a b
    rw [h, xor_is_commutative_for_every_a_b, xor_zero_is_identity_for_every_a] at this
    exact this.symm
  · intro h; subst h; exact a_number_xored_with_itself_is_zero_for_every_a a

theorem the_halves_and_the_low_bit_read_back_from_the_xor_for_every_a_b :
    ∀ a b : Nat, xorN a b / 2 = xorN (a / 2) (b / 2) ∧ xorN a b % 2 = (a + b) % 2 := by
  intro a b
  have h := xor_is_the_sum_of_the_bits_plus_twice_the_xor_of_the_halves a b
  constructor <;> omega

end Nim
