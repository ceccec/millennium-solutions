---
title: Nature, proved
description: Where the deposit's proved laws meet nature and daily life — each one labelled as a fact of nature, a practice you can use, or a metaphor, and linked to the theorem the kernel checked.
head:
  - ['meta', { name: 'robots', content: 'index, follow' }]
---

<script setup>
// Computed from the ledger: an entry is shown only while its theorem is live. Nothing here is typed as a count.
import { withBase } from 'vitepress'
import ledger from './src/proof/discovered.json'
const live = new Map(ledger.filter((e) => !e.revoked).map((e) => [e.key, e]))
const ENTRIES = [
  { kind: 'fact', where: 'Sunflowers, pinecones, pineapples', what: 'The spiral counts on a seed head are usually two consecutive Fibonacci numbers — 34 and 55, 55 and 89. Consecutive Fibonacci numbers share no common divisor but 1, at every size, so the two families of spirals never fall into a common sub-rhythm.', keys: ['lean_z9plus_consecutive_fibonacci_are_coprime_for_every_n', 'lean_families_cassinis_identity_for_every_m'] },
  { kind: 'fact', where: 'Leaves around a stem', what: 'Ratios of neighbouring Fibonacci numbers close in on the golden ratio — each convergent off by exactly one unit in the determinant — the spacing (about 137.5° between leaves) that many plants use to keep leaves from shading each other.', keys: ['lean_families_the_golden_convergents_are_fibonacci_ratios_with_unit_determinant', 'lean_elementary_the_lucas_numbers_are_the_sum_of_the_neighbouring_fibonaccis_for_every_n'] },
  { kind: 'fact', where: 'Honeycomb', what: 'Six turns of 60° close the circle, so hexagons tile a flat surface; among all tilings into equal cells, the hexagonal one uses the least wall for the area enclosed (the honeycomb theorem, Thomas Hales, 1999 — prior art, not proved here).', keys: ['lean_mechanical_the_regular_hexagon_exterior_angle_is_the_gold_string'] },
  { kind: 'fact', where: 'Islands, cups, cells — every surface', what: 'χ = 2 − 2g for a surface with g holes: a sphere 2, a doughnut 0, a pretzel of two holes −2. Counting holes tells shapes apart that no stretching can turn into one another.', keys: ['lean_demand3_the_euler_characteristic_of_a_genus_g_surface_for_every_g'] },
  { kind: 'fact', where: 'Water and energy', what: 'Mass is conserved at every scale, so no closed loop makes water from nothing: every atom that comes out went in. A device that promises more out than in is refuted before it is built.', keys: ['lean_energy_mass_is_conserved_at_every_scale_so_the_loop_cannot_make_water'] },
  { kind: 'fact', where: 'Your family tree', what: 'Going back, ancestors double each generation: 1 + 2 + 4 + … + 2ⁿ = 2ⁿ⁺¹ − 1. Within a few dozen generations that exceeds everyone who has ever lived, so the branches must meet — we are all related.', keys: ['lean_families_the_powers_of_two_sum_to_one_less_than_the_next_for_every_n'] },
  { kind: 'fact', where: 'An honest second', what: 'The second reads back exactly from the metre and from the caesium period, for every whole number of seconds — the same measure for everyone, everywhere.', keys: ['lean_light_the_second_returns_from_the_metre_and_the_period_at_every_duration'] },
  { kind: 'practice', where: 'A right angle with a rope', what: 'Knot a loop of rope into 12 equal parts and peg it as 3, 4 and 5: the corner is square. It works at any size (every multiple of 3-4-5), for fields, garden beds and walls, with no instrument.', keys: ['lean_mechanical_every_multiple_of_three_four_five_is_pythagorean'] },
  { kind: 'practice', where: 'Planting in rows', what: 'Rows of 1, 2, 3, … n plants need n(n + 1)/2 seedlings in all; a square bed grows by one L-shaped border of the next odd number of plants.', keys: ['lean_families_the_numbers_sum_to_their_closed_form_for_every_n', 'lean_families_the_first_n_odd_numbers_sum_to_n_squared_for_every_n'] },
  { kind: 'practice', where: 'Stacking fruit', what: 'A pile of oranges in triangular layers holds a tetrahedral number: the sum of the triangular numbers, n(n + 1)(n + 2)/6.', keys: ['lean_families_the_sums_of_triangular_numbers_are_the_tetrahedral_numbers_for_every_n'] },
  { kind: 'practice', where: 'Checking a bill by hand', what: 'Casting out nines: the digit root of a product is the digit root of the product of the roots, for every pair of numbers — a check at the market with no calculator. Its frontier is honest too: a number and its reversal keep the same remainder by nine, so swapped digits slip through; that is why bank and book numbers use weighted checks (mod 97, mod 11).', keys: ['lean_mechanical_casting_out_nines_is_multiplicative_for_every_a_b', 'lean_reversal_reversal_keeps_the_residue_mod_nine_for_every_n'] },
  { kind: 'practice', where: 'Taking turns fairly', what: 'A B B A B A A B … — the Thue–Morse order — shares first-mover advantage more fairly than A B A B, when children pick teams or neighbours share a well.', keys: ['lean_sequences_thue_morse_doubling_recurrence', 'lean_sequences_thue_morse_doubling_recurrence_for_every_n'] },
  { kind: 'practice', where: 'A fair price', what: 'The deposit’s fare is two coins, fixed by a theorem rather than by whoever holds power: 110 − 108 = 2 = −χ at genus 2.', keys: ['lean_demand3_the_two_coin_fare_is_minus_the_euler_characteristic_at_genus_two'] },
  { kind: 'metaphor', where: 'Repair', what: 'Every step of XOR is undone by repeating it: (a ⊕ b) ⊕ b = a, for every a and b. A picture of repair — a metaphor, not a law of people.', keys: ['lean_nim_xor_is_its_own_inverse_for_every_a_b'] },
  { kind: 'metaphor', where: 'Rhythm', what: 'The Fibonacci numbers repeat their remainders by nine every 24 steps, forever. An arithmetic rhythm — not a claim about days or bodies.', keys: ['lean_z9plus_pisano_period_mod_nine_is_twenty_four_for_every_k'] },
  { kind: 'metaphor', where: 'Colour', what: 'Nine digits at 40° each close the colour wheel with nine distinct hues. A design mapping, honestly labelled.', keys: ['lean_mechanical_arts_nine_hues_distinct'] },
]
const KIND = { fact: 'Facts of nature', practice: 'Practices you can use', metaphor: 'Metaphors, labelled as such' }
const shown = ENTRIES.map((e) => ({ ...e, proofs: e.keys.filter((k) => live.has(k)).map((k) => ({ key: k, name: live.get(k).name.split('—')[0].trim() })) })).filter((e) => e.proofs.length)
const groups = Object.entries(KIND).map(([k, title]) => ({ k, title, items: shown.filter((e) => e.kind === k) })).filter((g) => g.items.length)
</script>

# Nature, proved

> Mathematics does not make a life blissful. What it can do is show the order in what we already see, let anyone
> check a claim for themselves, and remove the fear of being cheated — so attention is free for the garden, the
> people, the light. Each entry below links to the theorem the Lean kernel checked, for every value.

<p><strong>{{ shown.length }}</strong> places where a proved law meets nature or daily life, drawn live from the ledger — an entry disappears if its theorem is ever withdrawn.</p>

<template v-for="g in groups" :key="g.k">
<h2>{{ g.title }}</h2>
<div v-for="e in g.items" :key="e.where" style="border:1px solid var(--vp-c-divider);border-radius:10px;padding:.6rem 1rem;margin:.8rem 0">
<strong>{{ e.where }}</strong>
<p style="margin:.3rem 0">{{ e.what }}</p>
<small>Proved: <template v-for="(p, i) in e.proofs" :key="p.key"><a :href="withBase('/theorem/' + p.key)">{{ p.name }}</a><span v-if="i < e.proofs.length - 1"> · </span></template></small>
</div>
</template>

## The frontier, and where it leads

The laws here are classical — Fibonacci, Pythagoras, Euler, Thue and Morse long before this deposit. What is new is
only that each is checked by the kernel for every value, where before it was checked up to a bound. That frontier
leads outward: a law anyone can recompute on a phone is a law no one can use to cheat them — in a market, a land
record, a water promise. The bliss is not in the proof; the proof clears the way to it.
