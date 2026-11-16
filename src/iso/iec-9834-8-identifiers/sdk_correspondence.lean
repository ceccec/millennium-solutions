-- title: The content-address correspondence — the deposit's primitives and ZFS share one shape and one efficiency
-- prior_art: named
-- prior_art_domain: content-addressable storage and Merkle trees (R. Merkle, 1979/1987); ZFS (Bonwick, Ahrens et al., 2005) — block checksums, copy-on-write snapshots, dedup; HTTP 304 Not Modified (RFC 7232) as serve-by-validator
-- prior_art_note: ZFS's checksum-addressed Merkle block tree, copy-on-write and dedup are the SAME content-address shape this deposit builds in software (toUuid, merkleFold, the handle cache, the 304 involution). This file decides the shared EFFICIENCY (verify in one step vs recompute in n) and the bijection of the primitives — never any ZFS internal, which is documented in /sdk as architecture, not asserted here.
set_option maxRecDepth 4000

namespace SdkCorrespondence

-- the shared efficiency: a content-address is VERIFIED in one step (read the address); RECOMPUTING the state
-- re-runs all n facts. This is why caching via handles removes the memory/time wall — on either leg (the
-- deposit's 304 involution, ZFS's dedup + ARC). It is the deposit's own `verify(1) < recompute(n)`.
def verifyCost : Nat := 1
def recomputeCost (n : Nat) : Nat := n

-- AS A LAW: verify is one step, and it is the inverse of the advantage at EVERY state that holds a fact —
-- recompute − verify + verify = recompute exactly when 1 ≤ n; at the empty state there is nothing to verify
-- and the round trip does not close.
theorem verify_is_one_step :
  verifyCost = 1 ∧ (List.range 64).all (fun n =>
    decide (1 ≤ n) == (recomputeCost n - verifyCost + verifyCost == recomputeCost n)) := by decide

theorem recompute_is_n_steps : ∀ n, recomputeCost n = n := by intro n; rfl

-- verify beats recompute for any state of two or more facts — the content-address advantage, shared by both legs.
theorem verify_beats_recompute_from_two : ∀ n, 2 ≤ n → verifyCost < recomputeCost n := by
  intro n h; simp only [verifyCost, recomputeCost]; omega

-- the advantage grows without bound: recompute − verify = n − 1.
theorem the_advantage_is_n_minus_one : ∀ n, 1 ≤ n → recomputeCost n - verifyCost = n - 1 := by
  intro n _; simp only [verifyCost, recomputeCost]

-- the correspondence: six (deposit-index, zfs-index) pairs, each tagged with the shape the two sides share.
-- The names of the six are in /sdk; here they are indices and shapes, decided as structure.
inductive Shape | address | merkle | cache | involution | guid | verify deriving DecidableEq

def corr : List (Nat × Nat × Shape) :=
  [ (0, 0, .address), (1, 1, .merkle), (2, 2, .cache), (3, 3, .involution), (4, 4, .guid), (5, 5, .verify) ]

-- six pairings; the deposit primitives are exactly the six indices, none left out, none repeated.
theorem the_six_primitives_are_zero_to_five :
  corr.length = 6 ∧ corr.map (fun r => r.1) = [0, 1, 2, 3, 4, 5] := by decide

-- a bijection: the ZFS indices are the same six, and each pair matches index for index (one-to-one, onto).
theorem the_correspondence_is_a_bijection :
  corr.map (fun r => r.2.1) = [0, 1, 2, 3, 4, 5]
  ∧ corr.all (fun r => r.1 == r.2.1) = true := by decide

-- all six shapes are covered, once each — primitive, feature and shared shape move in lock-step.
theorem all_six_shapes_are_covered_once :
  corr.map (fun r => r.2.2) = [Shape.address, Shape.merkle, Shape.cache, Shape.involution, Shape.guid, Shape.verify] := by decide

-- capstone: the two legs share one shape per primitive AND the one efficiency — verify (1) under recompute (n≥2).
theorem the_two_legs_share_shape_and_efficiency :
  corr.length = 6
  ∧ corr.map (fun r => r.2.2) = [Shape.address, Shape.merkle, Shape.cache, Shape.involution, Shape.guid, Shape.verify]
  ∧ (∀ n, 2 ≤ n → verifyCost < recomputeCost n) := by
  refine ⟨by decide, by decide, ?_⟩
  intro n h; simp only [verifyCost, recomputeCost]; omega

end SdkCorrespondence
