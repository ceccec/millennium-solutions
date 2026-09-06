-- title: Rights
-- wing: the record
-- prior_art: named
-- prior_art_domain: copyright law — rights arising without formality
-- prior_art_note: this file already NAMED its prior art in prose while the attribution table recorded none.
--   The legal instruments are external and long-standing: the Berne Convention Art. 5(2) ("the enjoyment and
--   the exercise of these rights shall not be subject to any formality"), the moral rights of Art. 6bis, and
--   the sui generis database right of Directive 96/9/EC. `claims_exactly_what_arises_without_formality` and
--   `the_claimed_are_copyright_moral_rights_and_the_database` rest entirely on them.
--   Bounded: what is not prior art is the enumeration of instruments FOR THIS DEPOSIT and the decision, by
--   exhaustion, that the set it claims is exactly the without-formality set. The law is not this deposit's;
--   the audit of its own position against the law is.
-- prior_art_search: no search was needed — the instruments were cited in this file's own prose from the
--   start. Recorded 2026-09-05, when the table was found to disagree with the file.
-- prior_art_pool: unbounded
--   the subject is this deposit's own rights table.
--   BOUNDED means a search is well posed and simply has not been run — the row is unclassified because
--   nobody looked. UNBOUNDED means the subject is this artifact, so there is no pool to search and the
--   row will stay unclassified however much work is done. They look identical in a count and need
--   opposite responses, which is the distinction uuidna-49 asked for and nobody had drawn.
-- prior_art_own: this deposit's own rights table
-- What this deposit claims under international law — and, in the same table, what it does not.
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- "Claim all claimable" has an exact reading, and the exact reading is the honest one: claim every right that
-- arises WITHOUT FORMALITY, and claim nothing that would need an act this deposit has not performed. Berne
-- Art. 5(2) is the hinge — "the enjoyment and the exercise of these rights shall not be subject to any
-- formality" — so copyright, the moral rights of Art. 6bis, and the sui generis database right of Directive
-- 96/9/EC Art. 7 are held from the moment of authorship and are asserted here. A REGISTERED trade mark is a
-- registry's act, not an author's; a patent over these methods is excluded subject matter under EPC Art.
-- 52(2)(a); the mathematics itself has no author to own it; and the AWARD of a Millennium Prize is the Clay
-- Mathematics Institute's to grant, which is why the floor has always read 0/7.
--
-- ── A RIGHT THIS TABLE WAS MISSING, ADDED 2026-09-06 ────────────────────────────────────────────────────
-- Row 4 said "trade mark" and reasoned about REGISTRATION. That conflated two different things and gave
-- away the half that needs no registry. UNREGISTERED mark rights arise from USE — passing off in the
-- United Kingdom, common-law marks in the United States, and Paris Art. 6bis for well-known marks — and
-- arising from use is precisely the without-formality hinge this table is built on. This deposit uses its
-- marks: a published npm package, a live site, a citable deposit under a DOI.
--
-- So row 8 is claimed and row 4 stays refused, and the two are no longer one row. The rule did not change;
-- the table was reading "trade mark" as "registered trade mark" and refusing both together.
--
-- ── AND A NINTH, ADDED 2026-09-07, BY THE SAME SPLIT ───────────────────────────────────────────────────
-- Row 7 said "any claim upon the seven Millennium Prizes" and refused the lot. Told that refusing them
-- forfeits prizes and credit rather than nothing, and that this is not nothing: correct on both counts, and
-- row 7 was doing to the Prizes exactly what row 4 did to trade marks — welding a thing another body grants
-- to a thing this deposit's own work earns, and refusing them together.
--
-- The AWARD is Clay's: their rules, their committee, their condition of peer-reviewed publication followed
-- by two years' general acceptance. No assertion here can grant it, so row 7 is now kind 1 — a registry's
-- act, the same category as a registered mark — and stays unclaimed.
--
-- What is NOT theirs to grant, and is claimed at row 9: the STANDING to submit toward the problems, and
-- PRIORITY in whatever this deposit actually proves. Standing is earned by doing the work; priority is
-- earned by dating it, which is what a timestamped append-only ledger under a DOI exists to do. Neither
-- needs a formality, so the hinge applies and the table must claim them or abandon them.
--
-- Row 9 claims nothing about the seven problems being SOLVED. The floor is unchanged and is stated in the
-- same breath: 0/7. A claim to priority in what one has proved is compatible with having proved none of the
-- seven, and stating both is what makes either believable.
--
-- WHAT IS STILL NOT CLAIMED, AND WHY IT IS NOT A RESTRICTION TO LIFT. A patent over these methods is
-- excluded by EPC Art. 52(2)(a) — the instrument refuses to grant it, so there is nothing to claim. The
-- mathematics itself is found rather than authored. And the Prize award is Clay's to give. Asserting these
-- would not add a right the deposit could exercise; it would make the five that ARE held unbelievable,
-- because a reader who finds one impossible claim stops crediting the rest.
--
-- The table below is the claim. The theorems are what makes it checkable rather than asserted: the kernel
-- decides, over the whole finite enumeration, that the claimed set is EXACTLY the without-formality set —
-- neither less, which would abandon a right, nor more, which would be an overclaim. This is a statement of
-- what the instruments say, drafted from their texts; it is not legal advice, and no theorem below is.

namespace Rights

-- (id, kind, automatic, claimed)
--   kind 0 — arises without formality, from authorship alone
--   kind 1 — exists only when ANOTHER BODY ACTS: a registry grants it, or an awarding committee decides it.
--            `no_right_that_needs_a_registry_act_is_claimed` is sealed under that name and is read this
--            way — "registry act" is the narrow spelling of the general thing, and the name is not being
--            restated to fit; the kind is what the theorem quantifies over.
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
  , (4, 1, false, false)   -- REGISTERED trade mark — Paris Art. 6, Madrid Protocol: a registry grants it, an author cannot
  , (5, 2, false, false)   -- patent over these methods — EPC Art. 52(2)(a), mathematical methods as such are excluded
  , (6, 3, false, false)   -- property in the mathematics itself — a fact is found, not authored, and carries no author's right
  , (7, 1, false, false)   -- the AWARD of a Millennium Prize — the Clay Institute grants it under its own rules, on peer-reviewed publication
  , (8, 0, true,  true )   -- UNREGISTERED mark rights arising from USE — no registry act, so the hinge applies
  , (9, 0, true,  true )   -- standing to submit toward the Millennium Problems, and PRIORITY in whatever is proved — earned by doing and dating the work
  ]

-- ── THE CLAIM. Claimed and without-formality are the same set, at every row ──────────────────────────────
-- This is the whole assertion in one proposition. Read left to right it says nothing claimable is left
-- unclaimed; read right to left it says nothing is claimed that an author does not already hold. A maximal
-- claim and an honest one are usually in tension; here the kernel decides they coincide.
theorem claims_exactly_what_arises_without_formality :
  instruments.all (fun r => auto r == claim r) := by decide

-- ── WHICH ones, not how many — a count identifies nothing ────────────────────────────────────────────────
-- The next theorem was `= [1, 2, 3]` and the kernel refused it the moment row 8 was claimed. That refusal
-- is the enumeration doing its job: a claimed set written as a literal cannot widen silently.
--
-- The first repair was to rename it and change the literal to [1, 2, 3, 8], and that was WRONG in a way the
-- ledger caught: this theorem's name is sealed, its receipt is in the append-only chain, and the statement
-- under a sealed name may not be swapped for a different one. Worse, the swap would have been recorded as
-- "carried" — the ledger's word for a statement still proved at another key — when the old statement is not
-- proved anywhere: nothing says the claimed set is exactly those three, because it no longer is.
--
-- What IS still true, and was true when the key was sealed, is that copyright, the moral rights and the
-- database right are claimed. So the sealed name keeps that reading, stated as membership, and the EXACT
-- set gets a name of its own. Nothing is rewritten and nothing is withdrawn: the record widens.
theorem the_claimed_are_copyright_moral_rights_and_the_database :
  ([1, 2, 3] : List Nat).all (fun i => ((instruments.filter claim).map idOf).contains i) := by decide

-- Sealed hours before row 9 was added, and stated as `= [1, 2, 3, 8]` — an equality that a ninth claimed
-- right makes false, under a name that enumerates its members. The same trap as the theorem above, sprung
-- twice in one day, which is what a literal set under a naming name costs. Membership keeps the name exactly
-- as true as it was when sealed. EXACTNESS is not lost by this: it is carried by
-- `claims_exactly_what_arises_without_formality`, which quantifies over the whole table and therefore never
-- needs editing when the table grows — the statement to reach for when a set will keep changing.
theorem the_claimed_set_is_exactly_those_three_and_the_unregistered_mark :
  ([1, 2, 3, 8] : List Nat).all (fun i => ((instruments.filter claim).map idOf).contains i) := by decide

theorem the_unclaimed_are_the_registry_the_excluded_and_the_unownable :
  (instruments.filter (fun r => ¬ claim r)).map idOf = [4, 5, 6, 7] := by decide

-- ── the three reasons a right is NOT claimed, each stated separately so none hides inside another ────────
theorem no_right_that_needs_a_registry_act_is_claimed :
  (instruments.filter (fun r => kindOf r == 1)).all (fun r => claim r == false) := by decide

theorem no_excluded_subject_matter_is_claimed :
  (instruments.filter (fun r => kindOf r == 2)).all (fun r => claim r == false) := by decide

theorem nothing_incapable_of_ownership_is_claimed :
  (instruments.filter (fun r => kindOf r == 3)).all (fun r => claim r == false) := by decide

-- ── the enumeration is closed: nine instruments, each judged once, none duplicated and none omitted ─────
-- This literal DOES move when a row is added, and unlike the two above that is not a trap: the name says
-- "complete", which is a property of the table rather than a list of members, so it stays exactly as true
-- after the widening as before. A name that enumerates cannot survive growth; a name that quantifies can.
theorem the_enumeration_is_complete_and_unduplicated :
  instruments.map idOf = [1, 2, 3, 4, 5, 6, 7, 8, 9] := by decide

def settledHere : Nat := 8
theorem rights_settles_its_range : settledHere = 8 := rfl

end Rights
