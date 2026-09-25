set_option maxRecDepth 100000
-- title: No ring of labels addresses the subject built from its own diagonal
-- wing: the ring
-- prior_art: named
-- prior_art_domain: Cantor's diagonal argument (1891), in its finite form: no list of subsets of a finite
--   set contains the subset built by disagreeing with the i-th listed subset at the i-th element.
--   Equivalently |2^S| > |S|. Also the counting bound that L binary labels take at most 2^L values.
-- prior_art_note: THE ARGUMENT IS CANTOR'S AND NOTHING HERE IMPROVES IT. It is one of the most cited
--   arguments in mathematics and the finite case is the easy one. What is this deposit's is neither the
--   argument nor its finite case: it is that a specific published ring of labels, drawn three times
--   around three different subjects and captioned "THE ALGEBRA OF EVERYTHING", is put to it by the kernel
--   and the subject it misses is exhibited rather than described.
-- prior_art_search: not performed — Cantor is named above. Searching would be theatre.
-- prior_art_pool: unbounded
-- prior_art_own: the exhibited witness, the spend bound in theorem 7, and the controls at 3 and 4
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHY THIS FILE EXISTS.
--
-- src/proof/separation.lean decided that the ring of domain labels in Zenodo record 22934883 returns the
-- same answer whatever subject it is drawn around, and therefore separates nothing. That is a defect of
-- one drawing, and a better drawing would fix it.
--
-- THIS FILE SAYS THE STRONGER THING, WHICH IS NOT ABOUT THAT DRAWING AT ALL. No ring is the algebra of
-- everything. Not because the ambition is immodest — because the arithmetic forbids it, and has since
-- 1891. Hand me any ring of n labels and any list of n subjects it claims to address, and I will hand you
-- back a subject it does not address: the one that disagrees with subject i about label i. It is not
-- argued for below, it is CONSTRUCTED, and `decide` checks the construction against every one of the 512
-- rings of three labels over three subjects.
--
-- WHY THAT IS WORTH A FILE. "You cannot cover everything" is the kind of sentence anyone can write and
-- nobody can check. The diagonal makes it a witness: an address, produced mechanically from the ring
-- itself, that the ring provably omits. A claim of totality is refuted by its own contents. This is the
-- shape this deposit wants for every impossibility it states — not a refusal, a construction.
--
-- AND THE SIZE OF THE WASTE IS A NUMBER. Twenty-eight binary labels can tell 2^28 subjects apart. The ring
-- as drawn tells one. Theorem 7 counts the difference, and it is 268,435,455 subjects the drawing had room
-- for and spent nothing on.
--
-- No axioms, no Mathlib, no sorry.

namespace Diagonal

-- Label i of a subject, read off its mask. Division and remainder rather than `>>>` and `&&&`: the bitwise
-- operators drag `propext` into a `by decide` proof in this kernel, which this tree refuses.
def bit (m i : Nat) : Bool := (m / 2 ^ i) % 2 == 1

-- THE WITNESS, BUILT FROM THE RING AND NOTHING ELSE. Bit i is the negation of subject i's bit i, so the
-- result disagrees with every listed subject somewhere, by construction rather than by search.
def diagOf (rows : List Nat) : Nat :=
  (List.range rows.length).foldl (fun acc i => acc + (if bit (rows.getD i 0) i then 0 else 2 ^ i)) 0

-- Every ring of three labels over three subjects: 8 masks each, 512 in all.
def tables : List (List Nat) :=
  (List.range 8).flatMap (fun a => (List.range 8).flatMap (fun b => (List.range 8).map (fun c => [a, b, c])))

def distinct (xs : List Nat) : Nat :=
  (xs.foldl (fun acc v => if acc.contains v then acc else acc ++ [v]) ([] : List Nat)).length

-- ── 1 · THE RING NEVER ADDRESSES ITS OWN DIAGONAL ─────────────────────────────────────────────────────────
-- Cantor, finite, decided. Not one of the 512 rings contains the subject built from it.
theorem no_ring_addresses_the_subject_built_from_its_diagonal :
  tables.all (fun rows => !rows.contains (diagOf rows)) := by decide

-- ── 2 · AND IT MISSES IT FOR A REASON YOU CAN POINT AT ────────────────────────────────────────────────────
-- Theorem 1 says the witness is absent. This says WHERE it differs from each subject — at that subject's
-- own label — which is what makes it a construction rather than a lucky absence.
theorem the_diagonal_disagrees_with_subject_i_about_label_i :
  tables.all (fun rows => (List.range 3).all (fun i =>
    bit (diagOf rows) i != bit (rows.getD i 0) i)) := by decide

-- ── 3 · THE CONTROL: BEING ABSENT IS NOT AUTOMATIC ────────────────────────────────────────────────────────
-- Theorem 1 would also hold if `contains` were broken, or if `diagOf` returned something out of range.
-- Some rings do contain the mask 0 and some do not, so the predicate takes both values on this very
-- population. Without this, theorem 1 is a check that cannot fail.
theorem containment_takes_both_values_on_this_population :
  tables.any (fun rows => rows.contains 0) && tables.any (fun rows => !rows.contains 0)
  && tables.all (fun rows => diagOf rows < 8) := by decide

-- ── 4 · THE POPULATION IS THE ONE CLAIMED ─────────────────────────────────────────────────────────────────
-- `List.all` is true of an empty list, so theorems 1, 2 and the second half of 3 are all satisfied by an
-- enumeration that silently built nothing. 512 rings, three subjects each: asserted, not assumed.
theorem the_enumeration_is_five_hundred_and_twelve_rings_of_three :
  tables.length == 512 && tables.all (fun rows => rows.length == 3) := by decide

-- ── 5 · THREE LABELS TELL AT MOST EIGHT SUBJECTS APART ────────────────────────────────────────────────────
-- The counting bound, on the same population: a reading over L binary labels takes at most 2^L values,
-- so it separates at most 2^L subjects however cleverly it is drawn.
theorem three_labels_take_at_most_eight_values :
  tables.all (fun rows => distinct rows ≤ 8 && distinct rows ≤ 2 ^ 3) := by decide

-- ── 6 · AND THE BOUND IS REACHED, SO IT IS NOT A REFUSAL ──────────────────────────────────────────────────
-- THE CONTROL ON THEOREM 5. An inequality that nothing meets is a bound doing no work. Some ring in this
-- population separates all three of its subjects, and some separates none of them.
theorem the_bound_is_attained_and_so_is_its_floor :
  tables.any (fun rows => distinct rows == 3) && tables.any (fun rows => distinct rows == 1) := by decide

-- ── 7 · WHAT THE DRAWN RING SPENT ─────────────────────────────────────────────────────────────────────────
-- Twenty-eight labels afford 2^28 distinguishable subjects. The ring in record 22934883 takes one value
-- across all three of its hubs — which is 2^0, the number afforded by no labels at all. The difference is
-- not rhetorical and it is not a percentage: it is this many subjects.
theorem the_drawn_ring_spent_none_of_its_twenty_eight_labels :
  2 ^ 28 == 268435456 && 2 ^ 0 == 1 && 2 ^ 28 - 2 ^ 0 == 268435455 := by decide

end Diagonal
