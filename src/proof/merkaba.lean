import Z9
set_option maxRecDepth 8000000
-- title: The merkaba
-- wing: the ring
-- prior_art: unclassified
-- prior_art_pool: bounded
--   polyhedral and modular arithmetic; one theorem already credits Euler.
--   BOUNDED means a search is well posed and simply has not been run — the row is unclassified because
--   nobody looked. UNBOUNDED means the subject is this artifact, so there is no pool to search and the
--   row will stay unclassified however much work is done. They look identical in a count and need
--   opposite responses, which is the distinction uuidna-49 asked for and nobody had drawn.
-- prior_art_own: the merkaba as THIS deposit constructs it
-- prior_art_theorem: the_cube_and_the_tetrahedron_count_out — Euler's polyhedron formula V − E + F = 2
--   (Leonhard Euler, 1758). The file as a whole is this deposit's own construction, and this ONE
--   declaration restates a named classical result: its third conjunct 4 + 4 - 6 = 2 IS the Euler
--   characteristic of the tetrahedron. The comment above that theorem already named Euler; the register
--   did not, because prior art was routed on the FILE and a file-level row cannot say "own work except
--   theorem 7". No priority over Euler is claimed. What is this deposit's own here is the pairing of the
--   two tetrahedra with the cube Q₃ and the vertex and edge counts around it, not the characteristic.
-- The merkaba, as THIS deposit constructs it — ported to Lean so it stands on the kernel instead of on a
-- TypeScript test. Six entries under this name were revoked as dirty; every one of them that states finite
-- algebra is re-proved here, and the two that do not (a cosine field, a bond angle in degrees) are absent on
-- purpose — they are real trigonometry, not decidable arithmetic over ℤ/9, and padding them in would be the
-- exact dishonesty the revocation was for.
--
-- The construction: the mod-3 classes partition ℤ/9 into three triples — the AXIS {3,6,0} (the spindle) and
-- the two TETRAHEDRA {1,4,7} and {2,5,8}. Note 9 ≡ 0 here: `m9` is reduction mod 9, so the axis is written
-- with 0 where the prose writes 9. That is the same class, named by its residue.
--
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0 · No axioms, no Mathlib, no sorry.

namespace Merkaba

open Z9

def axis  : List Nat := [3, 6, 0]   -- {3,6,9} — the spindle
def tetA  : List Nat := [1, 4, 7]
def tetB  : List Nat := [2, 5, 8]
def dbl (l : List Nat) : List Nat := l.map (fun d => m9 (2 * d))

-- ── 1 · the three classes partition ℤ/9 into 3+3+3 — disjoint, and together the whole ring ──
theorem the_three_classes_partition_z9 :
  axis.length = 3 ∧ tetA.length = 3 ∧ tetB.length = 3 ∧
  (axis ++ tetA ++ tetB).eraseDups.length = 9 ∧
  ((List.range 9).all (fun d => (axis ++ tetA ++ tetB).contains d)) := by decide

-- ── 2 · the axis is CLOSED under doubling — the spindle turns into itself, which is what makes it an axis ──
theorem the_axis_is_closed_under_doubling :
  (dbl axis).all (fun d => axis.contains d) := by decide

-- ── 3 · and the two tetrahedra do NOT close: doubling carries each ONTO THE OTHER. That exchange is the
--        counter-rotation the name refers to — stated as two set equalities, in both directions, so it is a
--        swap and not merely an inclusion that might collapse. ──
theorem doubling_counter_rotates_the_two_tetrahedra :
  (dbl tetA).eraseDups.length = 3 ∧ (dbl tetA).all (fun d => tetB.contains d) ∧
  (dbl tetB).eraseDups.length = 3 ∧ (dbl tetB).all (fun d => tetA.contains d) := by decide

-- ── 4 · doubling twice returns each tetrahedron to itself — the rotation has period two, so the pair really
--        does turn against each other rather than drift ──
theorem the_counter_rotation_has_period_two :
  (dbl (dbl tetA)).all (fun d => tetA.contains d) ∧
  (dbl (dbl tetB)).all (fun d => tetB.contains d) := by decide

-- ── 5 · the two tetrahedra's residue sums cancel: 1+4+7 ≡ 3, 2+5+8 ≡ 6, and 3+6 ≡ 0 ──
theorem the_tetrahedra_residue_sums_cancel :
  m9 (tetA.foldl (· + ·) 0) = 3 ∧ m9 (tetB.foldl (· + ·) 0) = 6 ∧
  m9 (tetA.foldl (· + ·) 0 + tetB.foldl (· + ·) 0) = 0 := by decide

-- ── 6 · ONE tetrahedron is not enough. It meets exactly three of the six units — half — so a claim resting
--        on a single tetrahedron covers half the group and leaves the other half untouched. The revoked
--        entry said "3 remain uncovered"; here that is both halves, counted. ──
theorem one_tetrahedron_covers_half_the_units :
  (units.filter (fun d => tetA.contains d)).length = 3 ∧
  (units.filter (fun d => tetB.contains d)).length = 3 ∧
  units.length = 6 := by decide

-- ── 7 · the two tetrahedra as the cube Q₃ — 2³ = 8 vertices, 3·2² = 12 edges — and the tetrahedron's own
--        Euler characteristic V − E + F = 2, the self-dual solid on the sphere.
--        Written V + F − E, not V − E + F: ℕ subtraction TRUNCATES, so 4 − 6 evaluates to 0 and the honest
--        formula would have "proved" 4 = 2. The kernel caught exactly that here. Same lesson as the seal-bits
--        theorem earlier — a comparison is only worth what its operands are.
theorem the_cube_and_the_tetrahedron_count_out :
  2 ^ 3 = 8 ∧ 3 * 2 ^ 2 = 12 ∧ 4 + 4 - 6 = 2 := by decide

-- ── 8 · stacking triangular layers builds a tetrahedron: the sum of the first n triangular numbers is
--        n(n+1)(n+2)/6. Decided for every n up to 40 — not sampled at one flattering value. ──
def tri (n : Nat) : Nat := n * (n + 1) / 2
def sumTri (n : Nat) : Nat := ((List.range' 1 n).map tri).foldl (· + ·) 0

theorem stacked_triangles_are_tetrahedral :
  (List.range' 1 40).all (fun n => sumTri n == n * (n + 1) * (n + 2) / 6) := by decide

end Merkaba
