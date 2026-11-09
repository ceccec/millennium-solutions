-- A NEGATIVE CONTROL, and it is not part of the deposit's theorems.
--
-- It lives outside src/proof because scripts/lean.ts fails any file whose declarations depend on an axiom,
-- and the whole point of this one is that its second theorem DOES. Every check should be asked a question
-- whose answer is already known before its report is believed, and "no theorem here depends on an axiom"
-- is a claim that would read identically if `#print axioms` were silently broken, mis-parsed, or pointed
-- at nothing.
--
-- Run by scripts/axiom-index.ts. The expected output is exact:
--
--   'axiom_free_by_decision' does not depend on any axioms
--   'needs_all_three'        depends on axioms: [propext, Classical.choice, Quot.sound]
--
-- The first is what every declaration in src/proof reports. The second is what excluded middle costs in a
-- constructive kernel, and it is the reason the deposit's arithmetic is decided rather than argued.

def refl' (d : Nat) : Nat := 10 - d

-- Decided by exhaustion over a finite domain: computation, not inference from axioms.
theorem axiom_free_by_decision : [1, 2, 3, 4].all (fun d => refl' (refl' d) == d) := by decide

-- The same shape of fact, obtained classically. One appeal to excluded middle pulls in all three.
theorem needs_all_three : ∀ p : Prop, p ∨ ¬p := fun p => Classical.em p

-- PINNED WITH `#guard_msgs`, so the assertion is checked by the elaborator rather than by a script reading
-- this file's output. If either footprint ever changes — a tactic quietly pulling in choice, a toolchain
-- altering what `#print axioms` reports — THIS FILE STOPS COMPILING. The technique is standard practice in
-- the Lean community: axiom hygiene as an executable regression test, pinned so drift fails the build with
-- a mismatch rather than passing unnoticed.
--
-- Note the pins CONSUME the info line when they match, so a reader running this file sees silence. That is
-- the assertion holding, not the check being absent.
/-- info: 'axiom_free_by_decision' does not depend on any axioms -/
#guard_msgs in
#print axioms axiom_free_by_decision

/-- info: 'needs_all_three' depends on axioms: [propext, Classical.choice, Quot.sound] -/
#guard_msgs in
#print axioms needs_all_three
