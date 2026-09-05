set_option maxRecDepth 8000000
-- title: Light, space and time — arithmetic on numbers a standards body fixed
-- wing: the floor
-- prior_art: named
-- prior_art_domain: metrology — the International System of Units
-- prior_art_note: the exact numerical values below are DEFINITIONS adopted by the Conférence Générale des
--   Poids et Mesures, not results of this deposit: the metre from the speed of light (17th CGPM, 1983) and
--   the seven defining constants fixed exactly in the 2019 revision of the SI, effective 20 May 2019
--   (BIPM, https://www.bipm.org/en/measurement-units/si-defining-constants). Nothing here measures anything.
--
-- WHY A FILE ABOUT LIGHT SPEED CAN EXIST IN A DEPOSIT THAT CLAIMS NO PHYSICS.
--
-- Since 1983 the metre has been DEFINED from the speed of light, and since 2019 all seven SI base units are
-- defined by fixing seven constants to exact numerical values with no uncertainty. That makes 299792458 a
-- number a committee adopted, not a quantity anyone measured — the measuring moved to the other side of the
-- definition. Arithmetic on it is arithmetic on an integer, and the kernel can decide it.
--
-- What follows is therefore about the SI, not about nature. Every theorem here would be equally true if the
-- universe were different, because none of them is about the universe.
--
-- AND THE LIMIT IS PROVED, NOT PROMISED. The digital root of 299792458 is 1. That is a fact about the
-- numeral, in metres per second, and nothing else: doubling the numeral changes the root to 2, while
-- multiplying by a hundred leaves it alone. Both are decided below. A root that moves when you change the
-- unit and stays when you change the scale is a property of decimal notation, and reading significance into
-- it would be the overclaim this deposit exists to refuse.

-- CLAIMS: physical
namespace Light

-- ── THE SEVEN, as exact integers. h, e, k and N_A are recorded as their DIGIT SEQUENCES: their defining
--    values carry powers of ten that Nat cannot hold, and the arithmetic below concerns the digits. Saying
--    so here rather than letting a reader assume the number is the quantity. ────────────────────────────
def c      : Nat := 299792458      -- m/s, exact
def dNuCs  : Nat := 9192631770     -- Hz, exact — the caesium-133 hyperfine transition
def hDigits : Nat := 662607015     -- h = 6.62607015 × 10⁻³⁴ J s
def eDigits : Nat := 1602176634    -- e = 1.602176634 × 10⁻¹⁹ C
def kDigits : Nat := 1380649       -- k = 1.380649 × 10⁻²³ J/K
def naDigits : Nat := 602214076    -- N_A = 6.02214076 × 10²³ mol⁻¹
def kcd    : Nat := 683            -- K_cd, lm/W, exact

def defining : List Nat := [c, dNuCs, hDigits, eDigits, kDigits, naDigits, kcd]

theorem the_si_fixes_exactly_seven_constants : defining.length = 7 := by decide

-- ── SPACE FROM TIME, THROUGH LIGHT ──────────────────────────────────────────────────────────────────────
-- The chain is definitional and it runs one way. ΔνCs fixes the second; the second and c fix the metre. So
-- in the SI a length is a duration scaled by a fixed integer, and the integer is the speed of light.
def travel (seconds : Nat) : Nat := c * seconds      -- metres crossed in a whole number of seconds
def periods (seconds : Nat) : Nat := dNuCs * seconds -- caesium periods elapsed in the same interval

theorem travel_at_one_returns_the_defined_constant : travel 1 = c := by decide

-- ONE INTERVAL, TWO UNITS: the same second is 299792458 metres of light and 9192631770 caesium periods.
-- That is the SI's join between space and time, and it is an identity between two definitions rather than
-- a discovery about either.
theorem travel_and_periods_at_one_return_their_constants :
  travel 1 = 299792458 ∧ periods 1 = 9192631770 := by decide

-- Linear over the whole range checked, so the chain is a scaling and not a coincidence at one point.
theorem the_chain_scales :
  ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].all (fun s => travel s == c * s))
  ∧ ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].all (fun s => periods s == dNuCs * s)) := by decide

-- ── THE RESIDUES, DECIDED ───────────────────────────────────────────────────────────────────────────────
-- Where each defining numeral lands in this deposit's ring. Stated as arithmetic; read as nothing else.
def root (n : Nat) : Nat := if n == 0 then 9 else 1 + (n - 1) % 9

theorem the_roots_of_the_seven :
  defining.map root = [1, 9, 6, 9, 4, 1, 8] := by decide

-- Three land on the triad {3,6,9} and four on the units. Both counted, so neither can be quoted alone.
theorem three_on_the_triad_and_four_on_the_units :
  (defining.filter (fun n => [3, 6, 9].contains (root n))).length = 3
  ∧ (defining.filter (fun n => [1, 2, 4, 5, 7, 8].contains (root n))).length = 4 := by decide

-- AND THEY DO NOT COVER THE RING. Five residues occur, four never do. Stated because seven numbers landing
-- on five of nine residues is what unrelated numbers do, and the absence is the honest half of the count.
theorem the_seven_roots_miss_four_residues :
  (defining.map root).eraseDups.length = 5
  ∧ ([1, 2, 3, 4, 5, 6, 7, 8, 9].filter (fun d => ¬ (defining.map root).contains d)) = [2, 3, 5, 7] := by decide

-- ── THE COINCIDENCE A READER WILL FIND, NAMED AND DEFUSED ──────────────────────────────────────────────
-- The four residues the seven constants miss are 2, 3, 5 and 7 — exactly the primes below nine. Nobody
-- reading the theorem above will fail to notice that, and a deposit that states an absence and says nothing
-- further hands the reader the job of supplying its meaning. So it is stated here as an equality, and then
-- shown to be an accident of the numerals: doubling ONE of the seven — a choice of unit, not a fact about
-- anything — moves the missing set to {2,3,5,8}, which is not the primes. A pattern that a change of unit
-- destroys was never a pattern about the quantities.
def kcdDoubled : Nat := 1366     -- K_cd expressed against a unit half the size; the same luminous efficacy
def alternative : List Nat := [c, dNuCs, hDigits, eDigits, kDigits, naDigits, kcdDoubled]

theorem the_absent_residues_are_the_primes_below_nine :
  ([1, 2, 3, 4, 5, 6, 7, 8, 9].filter (fun d => ¬ (defining.map root).contains d)) = [2, 3, 5, 7] := by decide

theorem and_a_change_of_unit_destroys_it :
  ([1, 2, 3, 4, 5, 6, 7, 8, 9].filter (fun d => ¬ (alternative.map root).contains d)) = [2, 3, 5, 8]
  ∧ alternative.length = defining.length := by decide

-- ── THE LIMIT: THE ROOT IS A PROPERTY OF THE NUMERAL, NOT OF LIGHT ──────────────────────────────────────
-- If the digital root of c said something about light, it could not depend on the unit chosen to write c in.
-- It does. Doubling the numeral moves the root; scaling by a power of ten does not. So the root tracks
-- decimal notation in a chosen unit — and the metre is DEFINED to make this particular numeral come out.
theorem the_root_moves_with_the_unit_so_it_is_not_about_light :
  root c = 1 ∧ root (2 * c) = 2 ∧ root (100 * c) = 1 := by decide

-- ── THE REFUSAL, as a theorem so it is checked and not merely written ───────────────────────────────────
-- Every number in this file is a definition adopted by a committee. No proposition here measures a
-- quantity, predicts an observation, or constrains a physical theory, and none could: arithmetic on a
-- definition returns the definition.
-- ── THE CLAIM, STATED BOLDLY, WITH THE COMPUTATION THAT BREAKS IT ──────────────────────────────────────
-- THE SEVEN SI DEFINING CONSTANTS HAVE DIGITAL ROOTS 1, 9, 6, 9, 4, 1, 8 — AND THE FOUR RESIDUES THEY NEVER
-- REACH ARE EXACTLY THE PRIMES BELOW NINE: 2, 3, 5, 7.
--
-- That is a claim about the actual SI system as the CGPM fixed it, not about a toy. Every numeral here is
-- the committee's own: c = 299792458, ΔνCs = 9192631770, h, e, k, N_A, K_cd. `the_roots_of_the_seven` and
-- `the_absent_residues_are_the_primes_below_nine` decide it over the real values, so a critic who disputes
-- it computes the digital roots and shows a different list. Nothing here hides behind hedging.
--
-- AND THE FALSIFIER IS ALREADY PROVED, IN THIS FILE, DIRECTLY BELOW THE CLAIM.
-- `and_a_change_of_unit_destroys_it` expresses K_cd against a unit half the size — the same luminous
-- efficacy, a different numeral — and the four absent residues become 2, 3, 5, 8. The primes are gone.
-- `the_root_moves_with_the_unit_so_it_is_not_about_light` shows the same for c.
--
-- So the claim stands with its own defeater attached: THE PATTERN IS REAL IN SI AND IS A PROPERTY OF THE
-- CHOSEN UNITS, NOT OF NATURE. A critic does not need to find the weakness — it is stated, decided, and
-- published beside the claim it limits. That is what makes the bold form honest rather than reckless.
--
-- What is NOT claimed, because nothing here decides it: that the pattern predicts an observation, constrains
-- a physical theory, or would survive a different unit system. It would not, and the file proves it. That declaration stood here and was deleted: a
-- literal decided against itself is green whatever the file says, so it could never carry a refusal. What a
-- proposition mentions is a property of the source text, and `contradictions.ts` is where that is checked.
theorem the_definitions_are_seven_and_travel_fixes_zero :
  defining.length = 7 ∧ travel 0 = 0 := by decide

end Light
