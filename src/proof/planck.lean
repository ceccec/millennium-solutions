set_option maxRecDepth 100000
-- title: The Planck length, and what a lattice may say about it
-- wing: the floor
-- prior_art: named
-- prior_art_domain: the CODATA recommended values, and the SI's 2019 definition of the seven base constants
-- prior_art_note: NONE OF THE PHYSICS IS THIS DEPOSIT'S AND NONE OF IT IS CLAIMED. The Planck units are
--   Max Planck, 1899. The numerical values below are digit sequences published by CODATA and served by NIST
--   at physics.nist.gov/cgi-bin/cuu — the Planck length 1.616255(18)e-35 m, the Planck time
--   5.391247(60)e-44 s, the Planck mass 2.176434(24)e-8 kg, and the Newtonian constant of gravitation
--   6.67430(15)e-11 m^3 kg^-1 s^-2, each read from that service on 2026-09-20. No measurement is performed
--   here and none is asserted. What is decided below is arithmetic on those digit sequences: a quotient, a
--   list length, a residue, and an exhaustion over 2,197 products.
-- prior_art_search: not performed — the source is named above rather than searched for. Nothing here claims
--   a search of the literature returned nothing.
-- prior_art_pool: bounded
-- prior_art_own: nothing about nature; the one thing this file contributes is the REFUSAL below, decided
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHY THIS FILE EXISTS, AND WHAT IT REFUSES.
--
-- Asked what relations hold between this deposit's lattice and the Planck length, the tempting answer is a
-- coincidence: some product of 432 and 1836 and a power of nine that lands near 1.616255, published as a
-- discovery. This file is the other answer, and it is the one the arithmetic supports.
--
-- Four things are decided, and they are decided in the order that matters. The fourth was handed to
-- this file after the first three were sealed, and it subsumes the second: the dimensional skeleton.
--
-- FIRST, the Planck length is not an exact quantity and cannot be matched exactly. The SI fixes seven
-- constants by definition with no uncertainty — src/proof/light.lean decides arithmetic over those, and it
-- is honest arithmetic precisely because c is a defined integer. The Planck length is not among them. It is
-- built from G, which is MEASURED, and is the least well known of the fundamental constants. So there is no
-- number to hit: there is an interval, and its width is published.
--
-- SECOND, the structure of that uncertainty is itself exact, and it is the one real relation here. G enters
-- the Planck units under a square root, and a square root halves a relative uncertainty. CODATA publishes
-- G at 2.2 parts in 10^5 and all three Planck units at 1.1 — and 11 is derived below from the digit
-- sequences rather than typed, so the halving is decided and not read off a table.
--
-- THIRD, the lattice does not reach it — and the reason is stronger and less flattering than the one this
-- file first gave. 2,197 products of this deposit's own constants are put to the kernel; nine land in the
-- decade around the Planck length, so the instrument is live; none land in the window the world pins.
--
-- The first version of this header read that as a search too weak for a hit to have meant anything. That
-- was wrong in the direction that flatters a search. The lattice's seeds have prime support exactly
-- {2, 3, 5, 7, 17}, and not one of the 37 integers the measurement admits is a product of those primes —
-- the smallest cofactor left over anywhere in the window is 431. The Planck length's own mantissa is
-- 5 x 323251 with 323251 prime. The hit probability was not small. It was ZERO, by arithmetic, before any
-- product was computed. Theorems 17 and 18 decide that; theorems 6 to 8 are kept as the weaker empirical
-- statement they always were, and are not withdrawn, because they are true and the record shows the order
-- the two were learned in.
--
-- FIFTH, and this one is about this file rather than about physics: three of its first sixteen theorems
-- were read as establishing more than they decide. `gPpm` had 11 typed into it, so five of its six
-- conjuncts compared a literal with itself; the "exact halving" is exact only after Nat division discards
-- a two-per-cent disagreement; and a digital root is invariant under powers of ten, so no metric prefix
-- could ever have falsified it. Theorems 19 to 23 state each of those properly. An adversarial reading
-- found all three, which is the argument for having one.
--
-- No axioms, no Mathlib, no sorry.

namespace Planck

-- ── THE PUBLISHED DIGIT SEQUENCES, as integers. Nothing here is a measurement; these are the digits a
-- registry serves, and arithmetic on them is arithmetic on naturals.
def ellP : Nat := 1616255       -- 1.616255(18) e-35 m
def ellPUnc : Nat := 18
def tP : Nat := 5391247         -- 5.391247(60) e-44 s
def tPUnc : Nat := 60
def mP : Nat := 2176434         -- 2.176434(24) e-8 kg
def mPUnc : Nat := 24
def bigG : Nat := 667430        -- 6.67430(15) e-11 m^3 kg^-1 s^-2
def bigGUnc : Nat := 15

-- Relative uncertainty in parts per million, DERIVED from the two digit sequences rather than copied from
-- the registry's own "relative standard uncertainty" row. Deriving it is the point: a typed 11 beside a
-- typed 22 would decide nothing, because the ratio would be a property of what was typed.
def ppm (digits unc : Nat) : Nat := unc * 1000000 / digits

-- ── 1 · THE THREE PLANCK UNITS CARRY ONE RELATIVE UNCERTAINTY ─────────────────────────────────────────────
-- Length, time and mass are three different quantities in three different units, and the width of what is
-- known about them is the same number, because they are built from the same measured constant.
theorem the_three_planck_units_share_one_relative_uncertainty :
  ppm ellP ellPUnc = 11 ∧ ppm tP tPUnc = 11 ∧ ppm mP mPUnc = 11 := by decide

-- ── 2 · AND IT IS EXACTLY HALF THE CONSTANT THEY ARE BUILT FROM ───────────────────────────────────────────
-- G is known to 22 parts per million; every Planck unit to 11. The factor is the square root, which halves
-- a relative error, and it comes out exact on the published digits. This is the one relation in this file
-- that is a relation and not a coincidence — and it is a fact about how uncertainty propagates, not about
-- nature.
theorem the_square_root_halves_what_is_known_about_the_measured_constant :
  2 * ppm ellP ellPUnc = ppm bigG bigGUnc
  ∧ 2 * ppm tP tPUnc = ppm bigG bigGUnc
  ∧ 2 * ppm mP mPUnc = ppm bigG bigGUnc := by decide

-- ── 3 · THE WORLD PINS AN INTERVAL, NOT A POINT ───────────────────────────────────────────────────────────
-- Every integer within the published uncertainty is equally consistent with measurement. There are 37 of
-- them. A lattice expression "hitting the Planck length" means landing anywhere in a target 37 wide, and
-- any claim of a hit that does not say so has hidden its own tolerance.
def window : List Nat := (List.range (2 * ellPUnc + 1)).map (fun i => ellP - ellPUnc + i)
theorem the_measurement_admits_thirty_seven_values_and_not_one :
  window.length = 37
  ∧ window.head? = some (ellP - ellPUnc)
  ∧ window.getLast? = some (ellP + ellPUnc) := by decide

-- ── 4 · A DIGITAL ROOT READS THE UNIT, NOT THE SCALE ──────────────────────────────────────────────────────
-- The digital root of 1616255 is 8, which lies on this deposit's doubling orbit, and that is the shape a
-- numerological reading would take. It is refused here by exhibiting the same physical scale in two other
-- units: the Planck time reads 4 and the Planck mass reads 9. One scale, three roots. The root is a fact
-- about base ten and about which SI unit was chosen, both of which are human conventions, and it changes
-- when the convention changes.
def dr (n : Nat) : Nat := if n = 0 then 0 else 1 + (n - 1) % 9
theorem the_digital_root_tracks_the_unit_and_not_the_scale :
  dr ellP = 8 ∧ dr tP = 4 ∧ dr mP = 9 ∧ dr ellP ≠ dr tP ∧ dr tP ≠ dr mP := by decide

-- ── 5 · AND LANDING ON THE ORBIT IS WHAT MOST RESIDUES DO ─────────────────────────────────────────────────
-- Even taking the metre reading at face value, "it lands on the doubling orbit" is a weak statement: the
-- orbit holds six of the nine residues and the axis three. Two of the three readings above land on the
-- orbit, which is what two-thirds of arbitrary numbers do.
def orbit : List Nat := [1, 2, 4, 8, 7, 5]
def axis : List Nat := [3, 6, 9]
theorem the_orbit_holds_two_thirds_of_the_ring_so_landing_on_it_says_little :
  orbit.length = 6 ∧ axis.length = 3 ∧ orbit.length + axis.length = 9
  ∧ orbit.contains (dr ellP) ∧ orbit.contains (dr tP) ∧ axis.contains (dr mP) := by decide

-- ── 6 · THE LATTICE DOES NOT REACH IT ─────────────────────────────────────────────────────────────────────
-- This deposit's own vocabulary — the orbit, the axis, the A432 family, 108, 1836, 5040 and the powers of
-- three deep: the six of the doubling orbit, the three of the axis, and the four constants this deposit
-- names for itself. 2,197 products, exhausted by the kernel. Not one lands in the window the world admits.
def seeds : List Nat := [1, 2, 3, 4, 5, 6, 7, 8, 9, 108, 432, 1836, 5040]
def products : List Nat :=
  seeds.flatMap (fun a => seeds.flatMap (fun b => seeds.map (fun c => a * b * c)))
theorem no_product_of_three_lattice_constants_lands_where_the_planck_length_is :
  products.length = 2197
  ∧ products.all (fun v => v < ellP - ellPUnc || v > ellP + ellPUnc) := by decide

-- ── 7 · AND THE SEARCH WAS LIVE, NOT VACUOUS ──────────────────────────────────────────────────────────────
-- A search that produces nothing anywhere near the target proves nothing about the target. Nine of the same
-- products land in the decade around the Planck length, so the silence in theorem 6 is a silence about the
-- window and not about the magnitude. This is the control, decided rather than asserted.
theorem the_same_search_does_reach_the_magnitude :
  (products.filter (fun v => 1600000 ≤ v && v ≤ 1700000)).length = 9 := by decide

-- ── 8 · SO THE ZERO IS NOT EVIDENCE, AND NEITHER WOULD A ONE HAVE BEEN (SUPERSEDED BY 17) ───────────────
-- Kept as written and not withdrawn. It is true, and it is the weaker of the two reasons the search found
-- nothing: theorem 17 gives the real one. A record that edits out the first answer hides how it was got.
-- The honest reading of theorem 6, and the reason this file claims nothing from it. Spread those nine
-- products uniformly over the 100,001 integers of that decade and the expected number landing in a window
-- 37 wide is 9 * 37 / 100001, which is zero in the naturals — far under one. A search whose expected yield
-- is below one finds nothing whether or not there is anything to find. The absence is reported; it is not
-- promoted to a result, and a hit would not have been promoted either.
theorem a_search_expecting_less_than_one_hit_settles_nothing_either_way :
  9 * (2 * ellPUnc + 1) / 100001 = 0
  ∧ 9 * (2 * ellPUnc + 1) < 100001 := by decide

-- ── 9 · THE DIMENSIONAL SKELETON, IN HALVES ───────────────────────────────────────────────────────────────
-- Every Planck unit is hbar^a G^b c^d with a, b, d half-integers, because every one is a square root. The
-- exponents are recorded DOUBLED, which is what keeps this arithmetic in the integers the kernel decides:
--   ell_P = sqrt(hbar G / c^3)  ->  (1, 1, -3)
--   t_P   = sqrt(hbar G / c^5)  ->  (1, 1, -5)
--   m_P   = sqrt(hbar c / G)    ->  (1, -1, 1)
-- An odd first entry is the signature of a genuine square root: no Planck unit is a plain product of the
-- three constants, which is why none of them could be exact even if all three inputs were.
abbrev Dim := Int × Int × Int
def dimEllP : Dim := (1, 1, -3)
def dimTP   : Dim := (1, 1, -5)
def dimMP   : Dim := (1, -1, 1)
def dmul (x y : Dim) : Dim := (x.1 + y.1, x.2.1 + y.2.1, x.2.2 + y.2.2)
def ddiv (x y : Dim) : Dim := (x.1 - y.1, x.2.1 - y.2.1, x.2.2 - y.2.2)
theorem every_planck_unit_is_a_square_root_and_not_a_plain_product :
  dimEllP.1 % 2 ≠ 0 ∧ dimTP.1 % 2 ≠ 0 ∧ dimMP.1 % 2 ≠ 0 := by decide

-- ── 10 · LENGTH OVER TIME CANCELS BOTH ────────────────────────────────────────────────────────────────────
-- Dividing the Planck length by the Planck time subtracts the exponents: the quantum vanishes, gravity
-- vanishes, and what is left is c to the first power — a constant the SI fixes exactly. There is no
-- measurement anywhere in this combination.
theorem length_over_time_cancels_both_and_leaves_the_defined_constant :
  ddiv dimEllP dimTP = (0, 0, 2) := by decide

-- ── 11 · LENGTH TIMES MASS CANCELS GRAVITY ────────────────────────────────────────────────────────────────
-- Multiplying adds the exponents, and G's cancel against each other: hbar to the first, c to the minus
-- first. Pure quantum — and since the SI fixes h exactly, this combination is exact too.
theorem length_times_mass_cancels_gravity_and_leaves_the_quantum :
  dmul dimEllP dimMP = (2, 0, -2) := by decide

-- ── 12 · LENGTH OVER MASS CANCELS THE QUANTUM ─────────────────────────────────────────────────────────────
-- The other way round, hbar cancels and G survives at full strength — not halved, doubled back up, because
-- the square root in the numerator meets the inverse square root in the denominator. Pure gravity, and the
-- only one of the three that touches anything measured.
theorem length_over_mass_cancels_the_quantum_and_leaves_gravity :
  ddiv dimEllP dimMP = (0, 2, -4) := by decide

-- ── 13 · AND THE GRAVITATIONAL EXPONENT PREDICTS EVERY PUBLISHED UNCERTAINTY ──────────────────────────────
-- This is the relation this file was asked for, and it is exact. G is the only measured input; a relative
-- uncertainty scales with the exponent it is raised to. So HALF of G's 22 parts per million for anything
-- carrying G^(1/2), zero for anything where G cancels, and the full 22 where it survives whole. Every
-- number below is the one CODATA publishes, and `ppm bigG bigGUnc` is derived from the digit sequences in
-- theorem 2 rather than typed — so the prediction is checked against the registry, not against itself.
def gPpm (d : Dim) : Nat := d.2.1.natAbs * 11
theorem the_gravitational_exponent_predicts_every_published_uncertainty :
  gPpm dimEllP = 11 ∧ gPpm dimTP = 11 ∧ gPpm dimMP = 11
  ∧ gPpm (ddiv dimEllP dimTP) = 0
  ∧ gPpm (dmul dimEllP dimMP) = 0
  ∧ gPpm (ddiv dimEllP dimMP) = ppm bigG bigGUnc := by decide

-- ── 14 · SO TWO OF THE THREE CONTAIN NO MEASUREMENT AT ALL ────────────────────────────────────────────────
-- Which means the three published uncertainties are not three independent numbers. They are ONE number —
-- G's — appearing in each unit under a square root. Theorem 1 read them as a shared 11; that reading was
-- right about the arithmetic and thin about the cause, and this is the cause.
theorem the_three_uncertainties_are_one_uncertainty_wearing_three_faces :
  (ddiv dimEllP dimTP).2.1 = 0 ∧ (dmul dimEllP dimMP).2.1 = 0
  ∧ (ddiv dimEllP dimMP).2.1 ≠ 0 := by decide

-- ── 15 · AND YET THE PUBLISHED DIGITS MISS THE IDENTITY THEY CANNOT MISS ──────────────────────────────────
-- ell_P / t_P is c exactly. Divide the two published digit sequences and the answer is 299792422, and c is
-- 299792458. The registry's own numbers fail an identity that has no measurement in it.
def cDefined : Nat := 299792458
def ratioFromDigits : Nat := ellP * 1000000000 / tP
theorem the_published_digits_miss_an_identity_that_has_no_measurement_in_it :
  ratioFromDigits = 299792422
  ∧ ratioFromDigits ≠ cDefined
  ∧ cDefined - ratioFromDigits = 36 := by decide

-- ── 16 · AND THE MISS IS ROUNDING, WHICH IS WHY IT IS INVISIBLE ───────────────────────────────────────────
-- 36 m/s in 299792458 is 0.12 parts per million. The measurement uncertainty on these units is 11 — ninety
-- one times larger. Each value is rounded to seven significant figures before publication, and a ratio of
-- two independently rounded numbers cannot reproduce an exact constant. Nothing is wrong with the physics
-- or with CODATA: the deviation is a fact about DECIMAL PRESENTATION, it sits two orders below the
-- uncertainty, and it is invisible in every use of these constants except this one — asking an exact
-- identity to hold on the printed digits.
theorem the_miss_is_rounding_and_sits_far_below_the_uncertainty :
  (cDefined - ratioFromDigits) * 1000000 < 11 * cDefined
  ∧ 11 * cDefined / ((cDefined - ratioFromDigits) * 1000000) = 91 := by decide

-- ── 17 · THE WINDOW WAS NEVER REACHABLE ───────────────────────────────────────────────────────────────────
-- The real reason theorem 6 found nothing, and it is arithmetic rather than statistics. Every seed in the
-- lattice factors over {2, 3, 5, 7, 17}, so every product of seeds does too. Strip those five primes out of
-- each of the 37 integers the measurement admits and NOT ONE comes down to 1. The search could not have
-- succeeded, and reporting its silence as an empirical absence claimed more than the silence carried.
def strip (p : Nat) : Nat → Nat → Nat
  | 0, n => n
  | f + 1, n => if n % p == 0 && n > 0 then strip p f (n / p) else n
def latticePrimes : List Nat := [2, 3, 5, 7, 17]
def smoothPart (n : Nat) : Nat := latticePrimes.foldl (fun m p => strip p 40 m) n
def reachable (n : Nat) : Bool := smoothPart n == 1
theorem not_one_value_the_world_admits_is_reachable_from_this_lattice :
  window.all (fun v => ! reachable v) := by decide

-- ── 18 · AND THE SEEDS CARRY EXACTLY THOSE PRIMES ─────────────────────────────────────────────────────────
-- The other half of theorem 17, without which it is an assertion about a list rather than about the
-- lattice: every seed really does strip to 1 over those five primes, so the closure is complete and the
-- unreachability follows for products of any depth, not only for the three-deep search actually run.
theorem every_seed_factors_over_those_primes_so_every_product_does :
  seeds.all (fun s => reachable s) := by decide

-- ── 19 · THE UNCERTAINTY PREDICTION, WITH NOTHING TYPED ON EITHER SIDE ────────────────────────────────────
-- Theorem 13 is true and decides less than its name claims: `gPpm` has 11 written into it, so five of its
-- six conjuncts compare a literal with itself. Here both sides are derived — the left from the dimensional
-- exponents, the right from the CODATA digit sequences — so the prediction is tested against the registry.
theorem the_exponent_predicts_the_registry_with_a_literal_on_neither_side :
  gPpm dimEllP = ppm ellP ellPUnc
  ∧ gPpm dimTP = ppm tP tPUnc
  ∧ gPpm dimMP = ppm mP mPUnc := by decide

-- ── 20 · AND THE HALVING IS NOT EXACT ON THE DIGITS ───────────────────────────────────────────────────────
-- Theorem 2 reads 2 x 11 = 22 and calls the square root exact. It is exact in the physics and NOT exact in
-- the published digits: carried to four more places the relative uncertainties are 11.1368, 11.1291,
-- 11.0272 and 22.4742 parts per million, and twice the first is 22.2736, not 22.4742. The agreement in
-- theorem 2 is produced by Nat division discarding a two-per-cent disagreement — by the very truncation
-- that made the figures look derived rather than typed.
def ppm4 (digits unc : Nat) : Nat := unc * 10000000000 / digits
theorem the_exact_halving_survives_only_because_the_division_truncated :
  ppm4 ellP ellPUnc = 111368 ∧ ppm4 bigG bigGUnc = 224742
  ∧ 2 * ppm4 ellP ellPUnc ≠ ppm4 bigG bigGUnc := by decide

-- ── 21 · A DIGITAL ROOT CANNOT BE MOVED BY A METRIC PREFIX ────────────────────────────────────────────────
-- Theorem 4's prose offered the other SI units as the falsifier for reading dr(1616255) = 8 as meaningful.
-- They are not one scale in three units — a length, a time and a mass are three quantities — and worse, a
-- root is invariant under multiplication by ten, so metre, centimetre, femtometre and angstrom all give 8.
-- The prefix argument could never have falsified anything, and is refused here rather than left standing.
theorem no_power_of_ten_moves_the_root :
  (List.range 8).all (fun k => dr (ellP * 10 ^ k) = dr ellP) := by decide

-- ── 22 · BUT A UNIT THAT IS NOT A POWER OF TEN DOES ───────────────────────────────────────────────────────
-- The real falsifier, and it is exact arithmetic because the inch is EXACTLY 0.0254 metres by definition
-- (international agreement, 1959) — no measurement enters. The Planck length in inches reads 63632086614,
-- whose root is 9 and not 8. One quantity, two units, two roots. The root is a fact about the unit.
def ellPInches : Nat := ellP * 10000000 / 254
theorem an_exactly_defined_non_decimal_unit_moves_the_root :
  ellPInches = 63632086614 ∧ dr ellPInches = 9 ∧ dr ellPInches ≠ dr ellP := by decide

-- ── 23 · AND THE MISS IS MEASURED AGAINST THE RIGHT YARDSTICK ─────────────────────────────────────────────
-- Theorem 16 compares the 36 m/s miss to 11 parts per million — the MEASUREMENT uncertainty, which
-- theorems 12 and 14 have just proved does not apply to this quotient at all, since G cancels out of it.
-- The yardstick that does apply is the display: each value is printed to seven figures, so each carries a
-- half-unit in its last place, and the two together admit up to 120 m/s. The observed 36 sits inside that.
-- Same verdict as theorem 16, reached against a number that is actually about this quotient.
def halfUlpPpm4 (digits : Nat) : Nat := 5000000000 / digits
def displayBudget : Nat := (halfUlpPpm4 ellP + halfUlpPpm4 tP) * cDefined / 10000000000
theorem the_miss_fits_inside_the_printed_precision_and_not_inside_the_measurement :
  displayBudget = 120
  ∧ cDefined - ratioFromDigits ≤ displayBudget
  ∧ displayBudget * 10000 < 11 * cDefined := by decide

-- ── 24 · THE MANTISSA ITSELF IS OUT OF REACH ──────────────────────────────────────────────────────────────
-- The narrowest statement of theorem 17, at the single value a coincidence would have to hit: the Planck
-- length's published mantissa is 5 x 323251, and 323251 is prime — it is not 2, 3, 5, 7 or 17, and nothing
-- built from those can produce it. Decided by exhibiting the factorisation and refusing every divisor up
-- to the square root, so the primality is checked here and not asserted.
theorem the_planck_mantissa_factors_outside_the_lattice :
  ellP = 5 * 323251
  ∧ (List.range' 2 568).all (fun d => 323251 % d ≠ 0)
  ∧ ! reachable ellP := by decide

end Planck
