---
title: QPU theorems
description: The QPU unit's novel Lean theorems, read from its checkout and typeset here — attributed to qpu, dated by its commit, not folded into the sealed tree.
---

<script setup>
import { data } from './.vitepress/theme/qpu.data.ts'
</script>

# QPU theorems

The novelty of the **QPU unit** ([github.com/uuidna/qpu](https://github.com/uuidna/qpu)) is its Lean — a theorem per quantum idea, each one its kernel at qpu accepts. The connector that would forward them live is **down** (`src/mcp/connectors.ts`): its served endpoint answers 503 and its source MCP entry moved. So the unit's novelty is preserved by **reading** instead: `npm run qpu:lean` reads each `Qpu/*.lean` from the sibling checkout at its HEAD commit, keeps every theorem's statement and docstring, and typesets the statement with this deposit's own `src/latex` — the same tree the LaTeX comes from, so the rendered maths and the copyable LaTeX cannot disagree.

<div v-if="data.present">

> {{ data.attribution }}

Read from qpu commit `{{ data.qpuCommit.slice(0, 9) }}` on {{ data.measured }}: **{{ data.theorems }} theorems** across **{{ data.files }} files**, **{{ data.typeset }}** ({{ Math.round(data.typeset / data.theorems * 100) }}%) typeset to LaTeX here. The rest are kept as the raw Lean qpu wrote — nothing is dropped for being beyond this deposit's grammar. None of this is folded into this deposit's sealed proof tree or ledger; it is qpu's content **as of that commit**, re-checkable, and its drift from a later qpu is visible the next time the ingest runs.

<section v-for="g in data.lean" :key="g.file">

## {{ g.file.replace(/\.lean$/, '') }}

<div v-for="t in g.theorems" :key="t.name" class="qpu-thm">
<p><code>{{ t.name }}</code><span v-if="t.doc" class="qpu-doc"> — {{ t.doc }}</span></p>
<div v-if="t.mathml" v-html="t.mathml" class="qpu-ml"></div>
<details><summary>Lean{{ t.latex ? ' · LaTeX' : '' }}</summary>
<pre class="qpu-lean">{{ t.type }}</pre>
<pre v-if="t.latex" class="qpu-latex">{{ t.latex }}</pre>
</details>
</div>

</section>

</div>
<div v-else>

**Not measured.** These theorems are read from qpu's checkout; run `npm run qpu:lean` where the sibling (`QPU_DIR`, default `~/github/uuidna/qpu`) is present. On a clone without it the ingest says NOT MEASURED, never zero.

</div>

<style scoped>
.qpu-thm { margin: 1rem 0; padding-bottom: .75rem; border-bottom: 1px solid var(--vp-c-divider); }
.qpu-doc { color: var(--vp-c-text-2); }
.qpu-ml { overflow-x: auto; margin: .25rem 0 .5rem; }
.qpu-ml math { font-size: 1.15em; }
.qpu-lean, .qpu-latex { white-space: pre-wrap; word-break: break-word; }
</style>
