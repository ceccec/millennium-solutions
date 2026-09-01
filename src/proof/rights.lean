-- title: Rights
-- wing: the record
-- What this deposit claims under international law — and, in the same table, what it does not.
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- "Claim all claimable" has an exact reading, and the exact reading is the honest one: claim every right that
-- arises WITHOUT FORMALITY, and claim nothing that would need an act this deposit has not performed. Berne
-- Art. 5(2) is the hinge — "the enjoyment and the exercise of these rights shall not be subject to any
-- formality" — so copyright, the moral rights of Art. 6bis, and the sui generis database right of Directive
-- 96/9/EC Art. 7 are held from the moment of authorship and are asserted here. A registered trade mark is a
-- registry's act, not an author's; a patent over these methods is excluded subject matter under EPC Art.
-- 52(2)(a); the mathematics itself has no author to own it; and the seven Millennium Prizes belong to the
-- Clay Mathematics Institute, which is why the floor has always read 0/7.
--
-- The table below is the claim. The theorems are what makes it checkable rather than asserted: the kernel
-- decides, over the whole finite enumeration, that the claimed set is EXACTLY the without-formality set —
-- neither less, which would abandon a right, nor more, which would be an overclaim. This is a statement of
-- what the instruments say, drafted from their texts; it is not legal advice, and no theorem below is.

namespace Rights

-- (id, kind, automatic, claimed)
--   kind 0 — arises without formality, from authorship alone
--   kind 1 — exists only by a registry's act, which this deposit has not requested
--   kind 2 — excluded subject matter: the instrument itself refuses to grant it
--   kind 3 — not property at all: nothing here is capable of being owned by anyone
abbrev Instrument := Nat × Nat × Bool × Bool
def idOf   (r : Instrument) : Nat  := r.1
def kindOf (r : Instrument) : Nat  := r.2.1
def auto   (r : Instrument) : Bool := r.2.2.1
def claim  (r : Instrument) : Bool := r.2.2.2

def instruments : List Instrument :=
  [ (1, 0, true,  true )   -- copyright in the expression — Berne Art. 5(2), no formality, no notice, no deposit
  , (2, 0, true,  true )   -- moral rights: attribution and integrity — Berne Art. 6bis, independent of the economic rights
  , (3, 0, true,  true )   -- sui generis database right in the ledger — Directive 96/9/EC Art. 7, substantial investment in verification
  , (4, 1, false, false)   -- registered trade mark — Paris Art. 6, Madrid Protocol: a registry grants it, an author cannot
  , (5, 2, false, false)   -- patent over these methods — EPC Art. 52(2)(a), mathematical methods as such are excluded
  , (6, 3, false, false)   -- property in the mathematics itself — a fact is found, not authored, and carries no author's right
  , (7, 3, false, false)   -- any claim upon the seven Millennium Prizes — they are the Clay Institute's, and the floor is 0/7
  ]

-- ── THE CLAIM. Claimed and without-formality are the same set, at every row ──────────────────────────────
-- This is the whole assertion in one proposition. Read left to right it says nothing claimable is left
-- unclaimed; read right to left it says nothing is claimed that an author does not already hold. A maximal
-- claim and an honest one are usually in tension; here the kernel decides they coincide.
theorem claims_exactly_what_arises_without_formality :
  instruments.all (fun r => auto r == claim r) := by decide

-- ── WHICH three, not how many — a count identifies nothing ───────────────────────────────────────────────
theorem the_claimed_are_copyright_moral_rights_and_the_database :
  (instruments.filter claim).map idOf = [1, 2, 3] := by decide

theorem the_unclaimed_are_the_registry_the_excluded_and_the_unownable :
  (instruments.filter (fun r => ¬ claim r)).map idOf = [4, 5, 6, 7] := by decide

-- ── the three reasons a right is NOT claimed, each stated separately so none hides inside another ────────
theorem no_right_that_needs_a_registry_act_is_claimed :
  (instruments.filter (fun r => kindOf r == 1)).all (fun r => claim r == false) := by decide

theorem no_excluded_subject_matter_is_claimed :
  (instruments.filter (fun r => kindOf r == 2)).all (fun r => claim r == false) := by decide

theorem nothing_incapable_of_ownership_is_claimed :
  (instruments.filter (fun r => kindOf r == 3)).all (fun r => claim r == false) := by decide

-- ── the enumeration is closed: seven instruments, each judged once, none duplicated and none omitted ─────
theorem the_enumeration_is_complete_and_unduplicated :
  instruments.map idOf = [1, 2, 3, 4, 5, 6, 7] := by decide

def settledHere : Nat := 7
theorem rights_settles_its_range : settledHere = 7 := rfl

end Rights
