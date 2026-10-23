-- title: The router's priority, as kernel-checked rules
-- wing: the floor
-- prior_art: not applicable (the priority of the answer system's router, docs/ANSWER-SYSTEM.md)
-- prior_art_search: none performed; the claims are finite rules over the features of a question, decided exhaustively.
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHAT THIS DECIDES AND WHAT IT DOES NOT. src/answer/route.ts reads a question's text and sets four features: an integer,
-- a Lean theorem, a DOI, a Clay problem name. The priority that picks one kind from those features is decided here, over
-- every combination of the four (2^4 = 16). The reading of the text stays in route.ts and is not a finite domain, so no
-- theorem here says which question has which feature.

namespace AnswerRoute

inductive Kind
  | integer
  | lean
  | publication
  | clay
  | text
  deriving DecidableEq

/-- The four features of a question, as route.ts sets them from its text. -/
structure Features where
  integer : Bool
  lean : Bool
  publication : Bool
  clay : Bool

/-- The priority, first match wins: integer, then Lean, then publication, then Clay, then text. -/
def route (f : Features) : Kind :=
  if f.integer then Kind.integer
  else if f.lean then Kind.lean
  else if f.publication then Kind.publication
  else if f.clay then Kind.clay
  else Kind.text

def allBools : List Bool := [false, true]

/-- Every combination of the four features: 2^4 = 16. -/
def allFeatures : List Features :=
  allBools.flatMap fun i => allBools.flatMap fun l => allBools.flatMap fun p => allBools.flatMap fun c =>
    [⟨i, l, p, c⟩]

-- ── THE PRIORITY, PER RULE ───────────────────────────────────────────────────────────────────────────────
-- An integer is routed to the arithmetic kind whatever else the question holds.
theorem integer_wins : allFeatures.all (fun f => !f.integer || route f == Kind.integer) = true := by decide

-- A Lean theorem is routed to Lean whenever it is not an integer.
theorem lean_wins_over_the_rest : allFeatures.all (fun f => !(!f.integer && f.lean) || route f == Kind.lean) = true := by
  decide

-- A DOI is routed to publication when it is neither an integer nor a Lean theorem.
theorem publication_wins_over_clay_and_text :
  allFeatures.all (fun f => !(!f.integer && !f.lean && f.publication) || route f == Kind.publication) = true := by decide

-- A Clay problem name is routed to Clay when nothing above it applies.
theorem clay_wins_over_text :
  allFeatures.all (fun f => !(!f.integer && !f.lean && !f.publication && f.clay) || route f == Kind.clay) = true := by
  decide

-- Text is the remainder, and only the remainder.
theorem text_only_when_nothing_else_holds :
  allFeatures.all (fun f => (route f == Kind.text) == (!f.integer && !f.lean && !f.publication && !f.clay)) = true := by
  decide

-- ── THE COUNT: how many of the 16 feature combinations reach each kind ─────────────────────────────────
-- integer 8 · lean 4 · publication 2 · clay 1 · text 1, total 16.
theorem the_kinds_cover_the_sixteen :
  (allFeatures.filter (fun f => route f == Kind.integer)).length = 8
  ∧ (allFeatures.filter (fun f => route f == Kind.lean)).length = 4
  ∧ (allFeatures.filter (fun f => route f == Kind.publication)).length = 2
  ∧ (allFeatures.filter (fun f => route f == Kind.clay)).length = 1
  ∧ (allFeatures.filter (fun f => route f == Kind.text)).length = 1 := by decide

end AnswerRoute
