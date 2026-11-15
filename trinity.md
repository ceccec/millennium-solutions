---
title: The trinity and its observer
description: Feeling, thought and emotion as a turning — ρ³=id, valence flip into C₆, observer the fixed point, no complete self-model. Algebra proved; mind a model.
---

<script setup>
import { data } from './.vitepress/theme/trinity.data.ts'
</script>

# The trinity and its observer

Feeling, thought and emotion as a **turning**, not a line. Feeling is the body's signal; thought is the reading (appraisal); emotion is the whole episode, signal and reading fused. They run in a loop — feeling feeds thought, thought shapes emotion, emotion changes the body, which is new feeling — and three turns return to the start: **ρ³ = id**. That is a different symmetry from the Clay maps, which are involutions (σ² = id): an involution flips and returns in two steps; the trinity rotates and returns in three, and a rotation has no fixed corner.

<div class="trinity-figure" role="img" aria-label="An equilateral triangle with corners Feeling, Thought and Emotion, turned by the rotation ρ, with the observer at the fixed centre.">
<svg viewBox="0 0 320 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="tri-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="currentColor"/>
    </marker>
  </defs>
  <g fill="none" stroke="currentColor" stroke-width="2">
    <polygon points="160,40 280,250 40,250" opacity="0.5"/>
    <path d="M 205,70 A 120 120 0 0 1 250,205" marker-end="url(#tri-arrow)" opacity="0.8"/>
    <path d="M 215,235 A 120 120 0 0 1 70,215" marker-end="url(#tri-arrow)" opacity="0.8"/>
    <path d="M 95,190 A 120 120 0 0 1 135,75" marker-end="url(#tri-arrow)" opacity="0.8"/>
  </g>
  <g class="trinity-spin"><circle cx="160" cy="180" r="6" fill="currentColor"/></g>
  <circle cx="160" cy="180" r="3.5" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <text x="160" y="30" text-anchor="middle" class="trinity-label">Feeling</text>
  <text x="292" y="262" text-anchor="end" class="trinity-label">Thought</text>
  <text x="28" y="262" text-anchor="start" class="trinity-label">Emotion</text>
  <text x="160" y="200" text-anchor="middle" class="trinity-axis">observer</text>
</svg>
</div>

The pleasant ↔ unpleasant **valence flip** acts on every corner at once and commutes with the turn, so the two symmetries combine into one six-element group, **C₃ × C₂ ≅ C₆**: three turns and three flipped turns, with exactly **one** involution — not the dihedral S₃, where three reflections would each be their own inverse.

## What is proved, and what is a model

Kept to what the algebra supports — the same claim-and-gap discipline the seven Clay statements use:

| | Status |
|---|---|
| The trinity's algebra — ρ³ = id, the valence flip commuting into C₆ with its single involution | **proved in Lean**, below, no axioms |
| **Observer = the fixed point.** The turn moves every corner; a turn must leave one point still, the centre. The observer is forced by the symmetry. | **proved for the model.** It does *not* say the fixed point is aware. |
| **No complete self-model.** A self-model's own diagonal predicate is on none of its rows (Cantor / Lawvere). | **proved for the model.** It does *not* say the leftover is experience. |
| A mind can contain a model of itself (Kleene's recursion theorem; a quine is the witness) | named prior art — self-reference is possible, not the same as awareness |
| Awareness as **broadcast** (global workspace) and as **integrated wholeness** (Φ > 0 needs a loop) | **models**, two candidate definitions — neither is proved to be what it is like |
| **The hard problem:** whether identical structure, function and self-model fixes *what it is like* | **open** — no structural theorem reaches it |

Whether experience divides into exactly three, or whether mixed states (bittersweet, anxious excitement) break the clean loop, is an open empirical question. The trinity is a good lens, not a proven law of mind.

## The theorems, from the kernel

<div v-if="data.present">

{{ data.count }} theorems in `src/iso/80000-2-mathematics/trinity.lean`, each decided by exhaustion over a finite carrier — no axioms, no Mathlib, no `sorry`. The two negative theorems (the turn is **not** an involution; negation has **no** fixed point) are the controls: a check that cannot fail is not a check.

<section v-for="g in data.groups" :key="g.section">

### {{ g.section }}

<div v-for="t in g.theorems" :key="t.name" class="trinity-thm" :class="{ control: t.control }">
<p><code>{{ t.name }}</code><span v-if="t.control" class="trinity-ctl"> · control</span></p>
<p v-if="t.gloss" class="trinity-gloss">{{ t.gloss }}</p>
<div v-if="t.mathml" v-html="t.mathml" class="trinity-ml"></div>
<pre v-else class="trinity-lean">{{ t.statement }}</pre>
</div>

</section>

</div>
<div v-else>

**Not measured.** The theorems are read from `trinity.lean`; the file is absent from this build.

</div>

## The turning, in one line

A thought can start a feeling and a deliberate emotion can change a thought — the loop runs both ways (ρ and ρ⁻¹). The rotation has no fixed corner; what stays fixed is the axis it turns about. The observer is not a fourth corner but the centre the three turn around — forced, by the one theorem above that the turning leaves exactly one point still.

<style scoped>
.trinity-figure { display: flex; justify-content: center; margin: 1.5rem 0; color: var(--vp-c-brand-1); }
.trinity-figure svg { width: 100%; max-width: 320px; height: auto; }
.trinity-label { fill: var(--vp-c-text-1); font-size: 14px; font-weight: 600; }
.trinity-axis { fill: var(--vp-c-text-2); font-size: 11px; font-style: italic; }
.trinity-spin { transform-origin: 160px 180px; animation: trinity-turn 6s steps(3) infinite; }
@keyframes trinity-turn { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .trinity-spin { animation: none; } }
.trinity-thm { margin: 1rem 0; padding: .6rem .8rem; border-left: 3px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); border-radius: 0 6px 6px 0; }
.trinity-thm.control { border-left-color: var(--vp-c-brand-1); }
.trinity-ctl { color: var(--vp-c-brand-1); font-size: .85em; }
.trinity-gloss { color: var(--vp-c-text-2); margin: .2rem 0 .4rem; }
.trinity-ml { overflow-x: auto; margin: .25rem 0; }
.trinity-ml math { font-size: 1.1em; }
.trinity-lean { white-space: pre-wrap; word-break: break-word; margin: .25rem 0; }
</style>
