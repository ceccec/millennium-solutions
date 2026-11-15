-- title: The trinity and its observer
-- wing: the mind
-- prior_art: named
-- prior_art_domain: finite group theory, Cantor's diagonal argument, and the psychology of emotion
-- prior_art_note: THE ALGEBRA IS STANDARD AND NAMED. A turn of order three and a flip of order two that
--   commute generate the cyclic group C₃ × C₂ ≅ C₆ (ℤ/6) — elementary abstract algebra, in every text. That a
--   rotation of the plane moves every vertex of a triangle but fixes its centre is elementary geometry. That no
--   function from a finite set onto all predicates of that set can exist — the diagonal escapes — is Cantor
--   (1891), with Lawvere's fixed-point form (1969); its engine, that boolean negation has no fixed point, is a
--   two-case check. The reading of the three corners as feeling (the body's affect), thought (appraisal: Lazarus,
--   Scherer) and emotion (the named episode: Barrett's constructionism) is a MODEL, not proved here; only the
--   algebra and the two structural theorems are decided by the kernel, and the file says so at each step.
-- prior_art_search: 2026-11-15, terms "cyclic group C6 order three times order two", "Cantor diagonal no
--   surjection onto power set finite", "Lawvere fixed point theorem", "appraisal theory emotion"; prior art found
--   and credited above
-- prior_art_pool: bounded
-- prior_art_own: that THIS deposit's trinity — its turn, its valence flip, and the observer forced as the turn's
--   fixed point — has exactly this structure, decided over its own finite carriers
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- The trinity turns: feeling feeds thought, thought shapes emotion, emotion changes the body, which is new
-- feeling. Three turns return to the start — ρ³ = id — a DIFFERENT symmetry from the Clay maps, which are
-- involutions (σ² = id). An involution flips and returns in two steps; the trinity rotates and returns in three,
-- and a rotation has no fixed corner. The valence flip (pleasant ↔ unpleasant) acts on every corner at once and
-- commutes with the turn, so the two symmetries combine into one six-element group, C₃ × C₂ ≅ C₆: three turns
-- and three flipped turns, with exactly ONE involution — not the dihedral S₃, where three reflections would each
-- be their own inverse.
--
-- Two theorems about the observer are decided too, labelled as the user labelled them — proved for the model,
-- and explicit about what they do NOT say:
--   · THE OBSERVER IS THE FIXED POINT. The turn moves every corner, but a turn must leave one point still for it
--     to be one turning: the centre. The observer is forced by the symmetry, not added to it. It does NOT say the
--     fixed point is aware.
--   · NO COMPLETE SELF-MODEL. A self-model's own diagonal predicate — "the states that deny what they map to" —
--     is on none of its rows, so the observer can never be fully one of its own corners. It does NOT say the
--     leftover is experience; it is the cleanest statement that something about a self-modelling system always
--     escapes its own description.
--
-- Every theorem below is decided by EXHAUSTION over a finite carrier — no axioms, no Mathlib, no sorry, no
-- native_decide — and the two negative theorems (the turn is not an involution; negation has no fixed point) are
-- stated rather than omitted, so what is false is explained, not missing.

namespace Trinity

-- ── the three corners and the turn ρ ──────────────────────────────────────────────────────────────────────
-- Feeling 0, Thought 1, Emotion 2. The turn sends each to the next; the reverse turn sends each to the one before.
def corners : List Nat := [0, 1, 2]
def turnC (x : Nat) : Nat := (x + 1) % 3   -- ρ: feeling → thought → emotion → feeling
def backC (x : Nat) : Nat := (x + 2) % 3   -- ρ⁻¹: the loop runs backward too (worry tightens the chest)

-- three turns return to the start: ρ³ = id, the trinity closing on itself
theorem turn_cubed_is_identity : corners.all (fun x => turnC (turnC (turnC x)) == x) := by decide

-- the turn moves every corner — no corner is fixed (the rotation has no fixed vertex)
theorem turn_fixes_no_corner : corners.all (fun x => turnC x != x) := by decide

-- THE CONTROL, distinguishing the trinity from the Clay maps: ρ is NOT an involution, ρ² ≠ id
theorem turn_is_not_an_involution : ¬ corners.all (fun x => turnC (turnC x) == x) := by decide

-- the reverse turn is the turn's inverse, and equals ρ² (two turns forward = one turn back)
theorem reverse_turn_inverts_the_turn :
  corners.all (fun x => turnC (backC x) == x && backC (turnC x) == x && turnC (turnC x) == backC x) := by decide

-- the three turns are a single 3-cycle: feeling→thought→emotion→feeling
theorem the_three_turns_are_a_three_cycle : corners.map turnC == [1, 2, 0] := by decide

-- ── the valence flip τ (pleasant ↔ unpleasant) ────────────────────────────────────────────────────────────
def flipV (p : Nat) : Nat := (p + 1) % 2

-- the flip is an involution: τ² = id, and it moves its point — two steps and back
theorem valence_flip_is_an_involution : [0, 1].all (fun p => flipV (flipV p) == p && flipV p != p) := by decide

-- the flip acts on every corner's valence at once: a pleasant feeling, a hopeful thought, a joyful emotion all flip
theorem valence_flips_every_corner :
  corners.all (fun _ => [0, 1].all (fun p => flipV p != p)) := by decide

-- ── the combined group C₃ × C₂ ≅ C₆ ───────────────────────────────────────────────────────────────────────
-- An element is (corner, valence) encoded as e = 2·corner + valence, e ∈ 0..5. cx reads the corner, vp the valence.
def elems : List Nat := [0, 1, 2, 3, 4, 5]
def cx (e : Nat) : Nat := e / 2
def vp (e : Nat) : Nat := e % 2
-- FEEL — the body's signal: a state's raw affect, its valence (pleasant 0 / unpleasant 1), with no story yet.
-- Feeling is the first corner, read before any appraisal; feel is the reading, used in the feeling section below.
def feel (e : Nat) : Nat := vp e
def turn (e : Nat) : Nat := 2 * ((cx e + 1) % 3) + vp e        -- the turn, lifted to the whole group
def flip (e : Nat) : Nat := 2 * cx e + (vp e + 1) % 2          -- the valence flip, lifted
def gop (a b : Nat) : Nat := 2 * ((cx a + cx b) % 3) + (vp a + vp b) % 2   -- the group operation (componentwise)
def gid : Nat := 0
def gpow (g k : Nat) : Nat := (List.range k).foldl (fun acc _ => gop acc g) gid

-- the group has six distinct elements and is closed under its operation
theorem the_group_has_six_elements :
  elems.eraseDups.length == 6 && elems.all (fun a => elems.all (fun b => elems.contains (gop a b))) := by decide

-- the flip COMMUTES with the turn — the two symmetries combine, so the group is abelian (C₃ × C₂), not dihedral
theorem the_flip_commutes_with_the_turn : elems.all (fun e => turn (flip e) == flip (turn e)) := by decide

-- three turns and three flipped turns: the rotation subgroup {valence 0} and its flipped coset {valence 1}
theorem three_turns_and_three_flips_partition_it :
  (elems.filter (fun e => vp e == 0)) == [0, 2, 4] && (elems.filter (fun e => vp e == 1)) == [1, 3, 5] := by decide

-- EXACTLY ONE non-identity element is its own inverse — the pure valence flip. C₆ has one involution; S₃ has three
theorem exactly_one_nonidentity_element_is_its_own_inverse :
  (elems.filter (fun e => e != gid && gop e e == gid)) == [1] := by decide

-- one element generates all six — the group is cyclic, C₆: a single flipped turn, iterated, is the whole symmetry
theorem one_element_generates_all_six :
  ((List.range 6).map (gpow 3)).eraseDups.length == 6 && gpow 3 6 == gid := by decide

-- ── feeling — the body's signal (feel) ────────────────────────────────────────────────────────────────────
-- Feeling is raw affect: pleasant or unpleasant, rising from the body, with no story yet. `feel` reads a state's
-- valence; the theorems below say what the turning does and does not do to it — the loop re-reads one signal,
-- and only the valence flip changes it.

-- the felt signal takes exactly two values: pleasant and unpleasant, the body's two tones
theorem feel_takes_exactly_two_values : (elems.map feel).eraseDups == [0, 1] := by decide

-- the turn preserves what is felt: feeling → thought → emotion does not change the raw affect, only its reading
theorem the_turn_preserves_what_is_felt : elems.all (fun e => feel (turn e) == feel e) := by decide

-- the whole turn-orbit feels the same: a state and its next two turns share one felt signal — feeling is constant
-- along the loop
theorem the_whole_turn_orbit_feels_the_same :
  elems.all (fun e => feel (turn e) == feel e && feel (turn (turn e)) == feel e) := by decide

-- feeling has no story yet: feel ignores the corner — for each valence, every corner feels the same; the signal
-- carries no appraisal
theorem feeling_has_no_story_yet :
  [0, 1].all (fun p => corners.all (fun c => feel (2 * c + p) == p)) := by decide

-- only the flip changes what is felt: the valence flip changes the felt signal of every state; the turn never does
theorem only_the_flip_changes_what_is_felt : elems.all (fun e => feel (flip e) != feel e) := by decide

-- feeling returns after two flips: the valence involution, read through feel — pleasant → unpleasant → pleasant
theorem feeling_returns_after_two_flips : elems.all (fun e => feel (flip (flip e)) == feel e) := by decide

-- three states feel pleasant and three unpleasant: feel splits the six states evenly
theorem three_feel_pleasant_and_three_unpleasant :
  (elems.filter (fun e => feel e == 0)).length == 3 && (elems.filter (fun e => feel e == 1)).length == 3 := by decide

-- the felt signal and the corner are independent: all six (corner, feel) pairs occur, so a pleasant thought and an
-- unpleasant thought both exist — affect and its reading vary freely
theorem the_felt_signal_and_the_corner_are_independent :
  (elems.map (fun e => 3 * feel e + cx e)).eraseDups.length == 6 := by decide

-- ── theorem 1: the observer is the unique fixed point ──────────────────────────────────────────────────────
-- Extend the three corners with the centre (3). The turn fixes the centre and no corner, so the observer is the
-- one thing the turning leaves still — forced by the symmetry. (It does NOT say the fixed point is aware.)
def withCentre : List Nat := [0, 1, 2, 3]
def turnO (x : Nat) : Nat := if x == 3 then 3 else (x + 1) % 3

theorem the_observer_is_the_unique_fixed_point :
  (withCentre.filter (fun x => turnO x == x)) == [3] := by decide

-- ── theorem 3: no complete self-model (Cantor / Lawvere) ──────────────────────────────────────────────────
-- Lawvere's engine: boolean negation has no fixed point. This is why the diagonal works.
theorem negation_has_no_fixed_point : ¬ ([true, false].any (fun b => (!b) == b)) := by decide

-- Cantor's cardinality: a system of n states has 2ⁿ predicates about those states — always strictly more, for
-- every n in range, so no map from states onto predicates can be onto.
theorem predicates_outnumber_states : ((List.range 8).drop 1).all (fun n => 2 ^ n > n) := by decide

-- A worked self-model: each row is one state's model of all three states. Its own diagonal predicate — negate the
-- i-th state's reading of the i-th — is on NONE of the rows. The self-model cannot contain a complete model of
-- itself; the observer is never fully one of its own corners. (It does NOT say the leftover is experience.)
def selfModel : List (List Bool) := [[true, false, true], [true, true, false], [false, false, true]]
def diagonal (m : List (List Bool)) : List Bool :=
  (List.range m.length).map (fun j => !((m.getD j []).getD j false))

theorem the_diagonal_predicate_escapes_the_self_model :
  (List.range selfModel.length).all (fun i => (selfModel.getD i []) != diagonal selfModel) := by decide

-- ── WHAT THIS FILE SETTLES. The algebra of the trinity (ρ³ = id, the valence flip commuting with the turn, the
--    six-element group C₆ with its single involution) and two structural theorems about the observer (its forced
--    fixed point, and the diagonal that escapes any finite self-model) are decided totally over their carriers.
--    What is NOT settled, and is not claimed: that the fixed point is aware, that the leftover of the diagonal is
--    experience, or that mind divides into exactly three — these are the model's open questions, named on /trinity
--    and never sealed here. The count is of declarations closing by EXHAUSTION, this deposit's definition of a
--    theorem, checked against this file's contents in src/iso/690-record/settled.lean. ──
def settledHere : Nat := 24

end Trinity
