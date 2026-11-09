---
title: Textbooks
description: Every textbook theorem in qpu decoded into a human particle — its sentence, statement, variants and coin — with eight re-derived here from the operators.
---

<script setup>
import { data } from './.vitepress/theme/textbooks.data.ts'
</script>

# Textbooks

qpu seals each textbook example as an integer theorem whose docstring is its human sentence (`Qpu/Textbook.lean`). Each one is decoded here into a **particle**: the sentence, the statement the kernel checks, the variants that reflect it, and its coin — the content address of the key and statement. Every field is read off the two texts by `npm run textbooks`; nothing is judged by hand.

<div v-if="data.present">

Read from qpu commit `{{ data.qpu.commit.slice(0, 8) }}`{{ data.qpu.pushed ? '' : ' — local to qpu’s tree, not yet on github.com/uuidna/qpu' }}: **{{ data.theorems }} theorems**, {{ data.base }} base and the rest their variants (reflected {{ data.variants.reflected }}, contrapositive {{ data.variants.contrapositive }}, converse {{ data.variants.converse }}, refuted converse {{ data.variants.converse_refuted }}). **{{ data.physics.length }}** are physics, **{{ data.derivedHere }}** of them re-derived independently from the operators in `src/proof/quantum_textbooks.lean`.

**{{ data.statesNone.length }}** sentences state none of their statement's numbers — not a contradiction, a sentence that says the rule in words where the statement says it in numbers: <code v-for="k in data.statesNone" :key="k" style="margin-right:.4em">{{ k.replace(/^textbook_/, '') }}</code>

The decoder's own control: a sentence sharing no numeral with its statement must decode as stating none of them, or the run fails.

## Physics

<table>
<thead><tr><th>Theorem</th><th>Sentence</th><th>Statement</th><th>Variants</th><th>Coin</th></tr></thead>
<tbody><tr v-for="r in data.physics" :key="r.key"><td><code>{{ r.key }}</code><br><sub v-if="r.derivedHere">derived here: <code>{{ r.derivedHere }}</code></sub></td><td>{{ r.sentence }}</td><td><code>{{ r.statement }}</code></td><td>{{ r.variants }}</td><td><code>{{ r.coin.slice(0, 8) }}</code></td></tr></tbody>
</table>

## The rest of the textbook

<table>
<thead><tr><th>Theorem</th><th>Sentence</th><th>Statement</th><th>Variants</th><th>Coin</th></tr></thead>
<tbody><tr v-for="r in data.other" :key="r.key"><td><code>{{ r.key }}</code></td><td>{{ r.sentence }}</td><td><code>{{ r.statement }}</code></td><td>{{ r.variants }}</td><td><code>{{ r.coin.slice(0, 8) }}</code></td></tr></tbody>
</table>

</div>
<div v-else>

**Not measured.** The particles are decoded from qpu's checkout; run `npm run textbooks` where it is present.

</div>
