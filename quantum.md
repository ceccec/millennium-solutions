---
title: The quantum field — one receipt
head:
  - ['meta', { name: 'robots', content: 'index, follow' }]
---

# The quantum field

This page renders [`src/proof/quantum.lean`](https://github.com/ceccec/millennium-solutions/blob/main/src/proof/quantum.lean)
in three dimensions. Nothing in the scene is decoration: every coordinate is a value the Lean file decides
over, and a gate recomputes all five figures on each build, reading what they *should* be out of the theorem
statements themselves rather than from a number typed into the check.

<QuantumField />

## What you are looking at

Each sphere is one **ordering** of the doubling orbit `[1, 2, 4, 8]` — one observer's sequence.
`perms_of_four_is_factorial` decides there are exactly 4! = 24 of them, and 24 is what the scene draws.

Its **height** is the value the *control* fold returns for that ordering — the same combination performed
without canonicalising first. Those heights land on five distinct levels, which is
`the_uncanonicalised_fold_gives_many_answers`. That number is the size of the problem, measured: a fold that
reads its input in the order it arrives gives five different answers to the same question.

Every sphere is joined to **one node**. `superposition_collapses_to_one` decides that all 24 orderings
produce a single receipt. Many perspectives, held at once, resolving to one address.

## What it is not

The mechanism is named in the file as a theorem, so the picture cannot be read as a claim about physics:
`the_invariance_is_canonicalisation_not_physics` decides that every ordering *sorts to the same list*, and
the receipt reads only that. There is no hardware here, no speedup and no qubit. The word "quantum" names a
structural property — a set of perspectives held at once, collapsing to one value — and the file proves that
property is a **sort**.

The limit is proved too, in the same file and shown in the caption. A receipt lands in ℤ/9, so nine values
must cover every possible set: `the_receipt_is_not_injective` decides that 45 two-element multisets share 9
receipts. Order-invariant does not mean collision-free, and a receipt that cannot tell 45 things apart must
never be read as naming one of them.

`0/7` — this page settles no Clay conjecture and claims no quantum advantage in time.
