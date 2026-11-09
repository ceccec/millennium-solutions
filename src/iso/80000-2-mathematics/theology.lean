-- title: The readings, and the arithmetic under them
-- wing: the floor
-- prior_art: named
-- prior_art_domain: elementary number theory — the unit group of ℤ/9, the doubling map, and the ten's complement
-- prior_art_note: the structure is the same standard one index.lean credits: U(9) = {1,2,4,5,7,8}, the
--   non-units {0,3,6}, and the doubling orbit 1 → 2 → 4 → 8 → 7 → 5 → 1 of order six because 2 has
--   multiplicative order six mod 9. Textbook abstract algebra, not this deposit's. The permutation count
--   7! = 5040 is likewise classical. What is NOT prior art is which facts were chosen and why — and that
--   choosing is not a mathematical act, which is the whole subject of this file.
-- prior_art_search: literature search performed 2026-09-05, terms "doubling sequence modulo 9 orbit
--   1 2 4 8 7 5 cyclic group generator digital root"; prior art found and credited.
-- prior_art_pool: bounded
--   digit arithmetic of the doubling sequence; searchable independently of this deposit.
-- prior_art_own: the pairing, and the refusal to let it carry weight
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHAT THIS FILE SEALS, AND WHAT IT CANNOT. The instruction was to seal a theology as theorems. Seven
-- readings of the seven Clay problems were written in prose beside the seven arithmetic facts of
-- index.lean — the mediator, revelation, theodicy, the ontological gap, the test of the spirits, kenosis,
-- the undivided. A reading is not a proposition with a truth value over a finite domain, so no kernel can
-- decide one, and any file claiming otherwise is lying about what a proof is.
--
-- What CAN be sealed is the arithmetic each reading was drawn from, and this file seals eight facts that
-- index.lean does not already decide — sharper ones, chosen because each is the exact place a reading
-- either has a foothold or does not. The readings appear only as comments. Not one theorem below mentions
-- one, and not one depends on one.
--
-- THAT LAST SENTENCE WAS AN ASSERTION FOR TWO DAYS, so it is now a measurement. On 2026-09-20 every comment
-- in this file was stripped — 8401 characters, 148 lines down to 46 — and the remainder was handed to the
-- kernel on its own: the same eight theorems, still compiling, still axiom-free. The prose carries no weight
-- here and that has been checked rather than promised. It is a cheap check and it is the only kind of
-- evidence a claim of inertness can have, because a reader cannot see an absence by reading.
--
-- THAT ARRANGEMENT IS THE POINT, AND IT WAS LEARNED THE HARD WAY THIS SESSION. Until an hour ago the seven
-- theorems in index.lean were named `riemann_…`, `hodge_…`, `poincare_…`, and a README claim asserted that
-- all seven Clay problems carried a Lean theorem — a claim whose test searched for those WORDS. Renaming
-- one turned it red. The kernel had verified ℤ/9 arithmetic; the names had been carrying the rest. The
-- seven were renamed to what they decide, the claim was deleted, and src/api/index.ts turned out to have
-- been serving the doubling orbit on the authority of a theorem about the REFLECTION, reachable only
-- because that theorem's name said `riemann` and the orbit felt like family.
--
-- So a file of theology here has exactly one honest shape: the gloss is inert and is marked inert, and the
-- one thing in it that is a CHOICE rather than a fact is typed out as a choice and counted against the
-- number of choices that were available. That is the eighth theorem.
--
-- No anchors, no axioms (pure `by decide`, never `native_decide` or `sorry`), no Mathlib.

namespace Theology

-- ── the ring, derived exactly as index.lean derives it ────────────────────────────────────────────────────
def isUnit (d : Nat) : Bool := (List.range 9).any (fun e => (d * e) % 9 == 1)
def refl (d : Nat) : Nat := 10 - d
def dbl (d : Nat) : Nat := (2 * d) % 9
def iter : Nat → Nat → Nat
  | 0, s => s
  | Nat.succ n, s => iter n (dbl s)
def orbit (k : Nat) : Nat := iter k 1
def span : List Nat := (List.range 6).map orbit
def spanOf (g : Nat) : List Nat := ((List.range 6).map (fun k => iter k g)).eraseDups
def sameSet (a b : List Nat) : Bool := a.all (fun x => b.contains x) && b.all (fun x => a.contains x)

-- ── 1 · the mirror is not a step of the machine ───────────────────────────────────────────────────────────
-- READING (a gloss, decided by nothing below): the Riemann reflection s ↔ 1−s was read as a mediator — a
-- symmetry the process is measured against rather than one more turn of it. The arithmetic either supports
-- that distinction or it does not, and it does, totally: the ten's complement and the doubling commute at
-- NO residue whatsoever. Not "rarely" and not "except at fixed points" — the agreement set is empty over
-- the whole ring. Had they commuted anywhere, the mirror would have been a special case of the flow there.
theorem the_mirror_and_the_doubling_agree_at_no_residue :
  (List.range 9).all (fun d => refl (dbl d) % 9 != (2 * refl d) % 9)
  ∧ ((List.range 9).filter (fun d => refl (dbl d) % 9 == (2 * refl d) % 9)).length = 0 := by decide

-- ── 2 · confirming is uniform, finding is not ─────────────────────────────────────────────────────────────
-- READING: P versus NP was read as the gap between recognising and producing. The decidable shadow is the
-- cost asymmetry, and it is stated WITHOUT typing either cost: every unit's inverse is confirmed by a
-- single multiplication, while the number of candidates a scan must reject first is not one number at all
-- — it takes several distinct values across the units, and some units cost strictly more than the cheapest.
-- If verification and search had the same profile there would be no asymmetry here to read anything into.
def invOf (d : Nat) : Nat := ((List.range 9).filter (fun e => (d * e) % 9 == 1)).foldr (fun a _ => a) 0
def searchCost (d : Nat) : Nat := ((List.range 9).takeWhile (fun e => (d * e) % 9 != 1)).length
theorem confirming_a_witness_is_uniform_while_finding_one_is_not :
  ((List.range 9).filter isUnit).all (fun d => (d * invOf d) % 9 == 1)
  ∧ (((List.range 9).filter isUnit).map searchCost).eraseDups.length > 1
  ∧ ((List.range 9).filter isUnit).any (fun d => searchCost d > searchCost 1) := by decide

-- ── 3 · the flow never crosses the partition ──────────────────────────────────────────────────────────────
-- READING: Navier–Stokes was read as theodicy — whether the law, left alone, carries a smooth start into
-- catastrophe. index.lean already decides that the orbit from ONE stays bounded. This decides the stronger
-- and more interesting thing: from EVERY start in the ring, forty-eight steps of doubling never move a
-- residue across the line between the units and the non-units. Whichever side a thing begins on, the law
-- keeps it there. That is a much harder claim than boundedness and it is the one the reading needs.
theorem no_start_ever_crosses_between_the_units_and_the_non_units :
  (List.range 9).all (fun s => (List.range 48).all (fun k => isUnit (iter k s) == isUnit s)) := by decide

-- ── 4 · the origin is reached by nothing but itself ───────────────────────────────────────────────────────
-- READING: the Yang–Mills mass gap was read as the difference between being and non-being — no half-existing
-- thing, nothing continuous between nothing and the first quantum. The shadow is an iff in both directions
-- at once: over forty-eight steps a state is zero exactly when it started at zero. Nothing comes from
-- nothing, and nothing that is something is ever annihilated by the flow.
theorem the_origin_is_reached_at_every_step_exactly_by_the_origin :
  (List.range 9).all (fun s => (List.range 48).all (fun k => (iter k s == 0) == (s == 0))) := by decide

-- ── 5 · what a residue generates identifies it exactly ────────────────────────────────────────────────────
-- READING: the Hodge conjecture was read as the test of the spirits — whether having the FORM of something
-- means being generated by the real thing. Here that is decidable and true in the strongest sense: two
-- residues generate the same set if and only if they agree on being a unit and on being the origin. So a
-- residue's span is a complete identification of its class; nothing that generates like a unit fails to be
-- one, and nothing that is one generates like anything else. No simulacra anywhere in the ring.
theorem generating_the_same_set_is_exactly_being_of_the_same_kind :
  (List.range 9).all (fun g => (List.range 9).all (fun h =>
    sameSet (spanOf g) (spanOf h) == ((isUnit g == isUnit h) && ((g == 0) == (h == 0))))) := by decide

-- ── 6 · the vanishing is pairwise, not merely total ───────────────────────────────────────────────────────
-- READING: Birch–Swinnerton-Dyer was read as kenosis — fullness read off at the point where something
-- vanishes. index.lean decides that the orbit SUMS to zero mod nine, which a coincidence of six numbers
-- could produce. This locates it: the orbit is antipodal. Position i and position i + 3, half a period
-- apart, sum to nine for every i, so the total vanishing is forced by the structure of the cycle rather
-- than arriving by luck. A reading resting on the total alone would have been resting on an accident.
theorem the_orbit_is_antipodal_and_each_opposite_pair_sums_to_nine :
  (List.range 3).all (fun i => orbit i + orbit (i + 3) == 9)
  ∧ (span.foldr (· + ·) 0) % 9 == 0 := by decide

-- ── 7 · the loop has no proper part that survives on its own ──────────────────────────────────────────────
-- READING: Poincaré was read as the undivided — simplicity is not something added but what is left when
-- nothing is missing. index.lean decides that the orbit closes after six distinct points. This decides that
-- it cannot be cut: of all sixty-four subsets of the orbit, the only ones closed under doubling are the
-- empty one and the whole one. There is no smaller cycle hiding inside it and no part that is a loop by
-- itself. The single closed loop is single because nothing else in it is a loop.
def subsetOf (m : Nat) : List Nat := ((List.range 6).filter (fun i => (m >>> i) % 2 == 1)).map orbit
theorem the_orbit_has_no_doubling_closed_part_but_nothing_and_itself :
  (List.range 64).all (fun m =>
    let s := subsetOf m
    (! s.all (fun v => s.contains (dbl v))) || s.length == 0 || s.length == span.length)
  ∧ span.all (fun v => span.contains (dbl v)) := by decide

-- ── 8 · THE ONE TYPED LIST IN THE FILE, AND WHY IT IS TYPED ───────────────────────────────────────────────
-- Every definition above is derived. This one is not, and that is deliberate: it is the author's pairing of
-- the seven readings onto the seven problems, in the order index.lean lists them, and a choice is exactly
-- the thing that must not be dressed as a computation. What the kernel can say about it is the honest
-- bound. It is a pairing — seven distinct slots, each of the seven covered, so nothing is doubled up and
-- nothing is left out. And it is ONE of 5040, because seven things can be paired to seven in 7! ways and
-- no fact in this file, in index.lean, or anywhere in this ring prefers this one over the other 5039.
-- A reader is owed that number. It is the size of what the pairing is NOT evidence for.
def pairing : List Nat := [0, 1, 2, 3, 4, 5, 6]
def fact : Nat → Nat
  | 0 => 1
  | Nat.succ n => (n + 1) * fact n
theorem the_pairing_is_one_ordering_of_seven_out_of_all_of_them :
  pairing.eraseDups.length = 7
  ∧ (List.range 7).all (fun i => pairing.contains i)
  ∧ pairing.length = (List.range 7).length
  ∧ fact pairing.length = 5040 := by decide

end Theology
