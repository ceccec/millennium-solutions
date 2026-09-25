set_option maxRecDepth 100000
-- title: A reading that does not vary with what it reads separates nothing
-- wing: the ring
-- prior_art: named
-- prior_art_domain: the separation of points by a family of functions — the notion behind a separating
--   family, a faithful functor, and the Stone–Weierstrass hypothesis. Also elementary cancellation in ℕ.
-- prior_art_note: NEITHER IDEA IS THIS DEPOSIT'S. "A family of maps is worth having when it tells two
--   points apart" is as old as the definition of a separating family, and `x = x + y → y = 0` is
--   cancellation, which predates notation. What is this deposit's is neither: it is that the test is run
--   by the kernel, on a specific ring of labels published on a specific day, with a control that fires.
-- prior_art_search: not performed — both notions are named above rather than searched for.
-- prior_art_pool: unbounded
-- prior_art_own: the two decisions below, and the control that proves they are not vacuous
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHY THIS FILE EXISTS.
--
-- Zenodo record 22934883 (10.5281/zenodo.22934883, deposited 2026-09-24) carries four posters. Three of
-- them are the same picture: one identical ring of some twenty-eight domain labels — astrophysics, quark
-- flavour algebra, timbre, supply-chain optimisation, psychology — drawn around a hub that changes.
-- The hub reads FUSION POWER PLANT in one, DRY CLEANING in the second, PERMACULTURE ECOSYSTEM in the
-- third. The caption underneath changes with it: "THE ALGEBRA OF FUSION", then "THE ALGEBRA OF
-- EVERYTHING".
--
-- That construction is a claim, made by the drawing rather than by its text, and it is the only claim in
-- the record that can be decided: THE RING DOES NOT DEPEND ON THE HUB. It is worth deciding because the
-- claim is flattering to this deposit — "one structure, many readings" is what src/proof/index.lean says
-- about seven windows — and a result that agrees with you is the one that gets checked least.
--
-- It does not survive. A family of readings earns the word FRAME by separating what it reads; a family
-- that returns the same labels whatever you hand it is a decoration, and the posters demonstrate their own
-- ring is the second kind by printing it three times unchanged. The difference between that ring and the
-- seven windows is not rhetoric, it is theorem 3 below: the windows take three values on three subjects
-- and the ring takes one.
--
-- THE CONTROL IS THE POINT. Theorems 1, 2 and 5 are satisfied by anything that never varies, including a
-- broken test. Theorems 3, 4 and 6 run the identical question against a reading that DOES vary and require
-- the opposite answer, so a test that could only ever say "separates nothing" fails here before it can
-- flatter anyone.
--
-- THE SECOND LEAD is the record's fourth poster, "SOLVENT DISTILLATION & RECOVERY ALGEBRA", whose first
-- printed line is m_solv = m_solv + m_soil. Read as algebra that is not a mass balance: it holds exactly
-- when the soil mass is zero, which is the one quantity a dry cleaner may not assume away. Theorems 7 and
-- 8 decide it and, more usefully, decide what was meant — an UPDATE rather than an equation — and show the
-- update is injective in the very quantity the equals sign annihilates. The information lost is exactly
-- the soil.
--
-- No axioms, no Mathlib, no sorry.

namespace Separation

-- The three subjects the record hands the same ring: 0 fusion, 1 dry cleaning, 2 permaculture.
def hubs : List Nat := [0, 1, 2]

-- Twenty-eight labels, as counted off the poster ring.
def labels : List Nat := List.range 28

-- THE RING AS DRAWN. The hub is an argument and is not used — which is not a simplification of the
-- posters, it is what the posters show by being three copies of one picture.
def ring (_hub : Nat) : List Nat := labels

-- A READING THAT DOES VARY — the control, and the shape src/proof/index.lean claims for its windows.
-- Every label belongs to exactly one subject.
def window (hub : Nat) : List Nat := labels.filter (fun d => d % 3 == hub)

-- The pairs of distinct subjects a reading is asked to tell apart.
def pairs : List (Nat × Nat) := hubs.flatMap (fun a => (hubs.filter (fun b => b != a)).map (fun b => (a, b)))

-- How many distinct answers a reading gives across the subjects.
def valuesTaken (f : Nat → List Nat) : Nat :=
  (hubs.map f).foldl (fun acc v => if acc.contains v then acc else acc ++ [v]) ([] : List (List Nat)) |>.length

-- ── 1 · THE RING IS THE SAME AROUND EVERY HUB ─────────────────────────────────────────────────────────────
-- The drawing's own claim, decided rather than granted.
theorem the_ring_is_the_same_around_every_hub :
  pairs.all (fun p => ring p.1 == ring p.2) := by decide

-- ── 2 · SO IT TELLS NO TWO SUBJECTS APART ─────────────────────────────────────────────────────────────────
-- Separation is the property of disagreeing somewhere. There is nowhere.
theorem the_ring_separates_no_two_subjects :
  pairs.all (fun p => !(ring p.1 != ring p.2)) := by decide

-- ── 3 · THE CONTROL TELLS EVERY PAIR APART, AND THERE ARE PAIRS TO TELL ───────────────────────────────────
-- THE THEOREM THAT STOPS 1 AND 2 FROM BEING FREE. The same question, the same pairs, a reading that varies
-- — and the answer must be the other one. Without this, theorems 1 and 2 are satisfied by a decision
-- procedure that has broken in the direction of agreeing.
--
-- THE COUNTS ARE PART OF THE STATEMENT AND NOT DECORATION. `pairs.all` is TRUE of an empty list, so a
-- miscomputed `pairs` would satisfy theorems 1, 2 AND this one — the control included, which is the exact
-- shape of a check that cannot fail. Six ordered pairs over three subjects, twenty-eight labels as counted
-- off the ring: asserted here, so the thing that guards the others is itself guarded.
theorem the_varying_reading_separates_every_pair :
  pairs.length == 6 && labels.length == 28 && hubs.length == 3
  && pairs.all (fun p => window p.1 != window p.2) := by decide

-- ── 4 · ONE VALUE AGAINST THREE ───────────────────────────────────────────────────────────────────────────
-- The count is the whole difference between a frame and a decoration, and it is a number, not a word.
theorem the_ring_takes_one_value_and_the_control_takes_three :
  valuesTaken ring == 1 && valuesTaken window == 3 := by decide

-- ── 5 · NO LABEL IN THE RING IS EVIDENCE ABOUT THE SUBJECT ────────────────────────────────────────────────
-- Stronger than 2, and the form that matters to a reader: being told "this involves timbre algebra" narrows
-- the subject to every subject. Each label is carried by all three hubs or by none.
theorem no_label_of_the_ring_narrows_the_subject :
  labels.all (fun d => (hubs.filter (fun h => (ring h).contains d)).length == hubs.length
                    || (hubs.filter (fun h => (ring h).contains d)).length == 0) := by decide

-- ── 6 · EVERY LABEL OF THE CONTROL NAMES ITS SUBJECT ──────────────────────────────────────────────────────
-- The control again, against 5: here a label identifies the hub uniquely, which is what a label is for.
theorem every_label_of_the_varying_reading_names_one_subject :
  labels.all (fun d => (hubs.filter (fun h => (window h).contains d)).length == 1) := by decide

-- ── 7 · THE PRINTED BALANCE HOLDS ONLY WHEN NOTHING IS CARRIED ────────────────────────────────────────────
-- m_solv = m_solv + m_soil, exactly as printed, over every pair in range: true precisely when the soil is
-- zero. The poster's line above it, V_tank = V_tank + T_tank, is the same statement about the tank.
theorem the_printed_balance_holds_only_when_the_soil_is_zero :
  (List.range 24).all (fun m => (List.range 24).all (fun s => (m == m + s) == (s == 0))) := by decide

-- ── 8 · WHAT WAS MEANT IS INJECTIVE IN EXACTLY WHAT THE EQUALS SIGN ANNIHILATED ────────────────────────────
-- An update, not an equation: the new solvent mass is the old plus the soil. Distinct soils give distinct
-- states, so the quantity theorem 7 forces to zero is the quantity the corrected form carries. The defect
-- is not that the line is false — it is that the only reading under which it is true erases its subject.
theorem the_intended_update_is_injective_in_the_soil :
  (List.range 24).all (fun m => (List.range 24).all (fun s => (List.range 24).all (fun t =>
    ((m + s) == (m + t)) == (s == t)))) := by decide

end Separation
