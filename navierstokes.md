---
title: Navier–Stokes, stated
description: The Navier–Stokes Millennium Problem as it is posed, what the Lean kernel has checked here, and the known frontier between them.
head:
  - ['meta', { name: 'robots', content: 'index, follow' }]
---

<script setup>
// Every theorem on this page is linked from the live ledger: an entry shows only while its key is live, so a
// withdrawal removes it without an edit. Nothing here is typed as a count.
import { withBase } from 'vitepress'
import ledger from './src/proof/discovered.json'
const live = ledger.filter((e) => !e.revoked)
const find = (name) => live.find((e) => e.key.endsWith('_' + name) || e.key.endsWith('.' + name))
const ROWS = [
  { name: 'navier_stokes_flow_is_bounded', says: 'the doubling flow on ℤ/9 stays below 9 and inside its six-cycle — decided over its first 48 steps' },
  { name: 'navier_stokes_flow_is_bounded_for_every_step', says: 'the same bound at every step k — proved, not decided' },
  { name: 'a_cyclic_sum_is_unchanged_by_one_step_of_rotation', says: 'rotating a ring of N sites does not change a sum over it' },
  { name: 'the_skew_symmetric_burgers_term_does_no_work_on_every_ring', says: 'the nonlinear term, in its skew-symmetric form, does no work: Σ uᵢ·Nᵢ = 0 on every ring, for every field' },
  { name: 'the_discrete_laplacian_dissipates_exactly_the_squared_differences', says: 'viscosity only removes energy: Σ uᵢ(Δu)ᵢ = −Σ (uᵢ₊₁ − uᵢ)²' },
  { name: 'the_discrete_energy_never_increases_on_every_ring', says: 'so along du/dt = −N(u)/3 + νΔu the energy never increases, for every ν ≥ 0' },
]
const rows = ROWS.map((r) => ({ ...r, e: find(r.name) })).filter((r) => r.e)
</script>

# Navier–Stokes, stated

> This page states the problem as it is posed, what this deposit's Lean kernel has checked, and what lies between.
> It decides nothing about the problem itself.

## The problem

The incompressible Navier–Stokes equations describe a fluid's velocity *u* and pressure *p* in three dimensions:

∂u/∂t + (u·∇)u = νΔu − ∇p + f,  ∇·u = 0,  u(x, 0) = u₀(x).

The Millennium Problem, as formulated by Charles Fefferman for the Clay Mathematics Institute, asks for a proof of
one of two things, in all of space or on a periodic box:

- **either** for every smooth, divergence-free initial velocity (decaying suitably, with no force), a solution
  exists for all time, stays smooth, and keeps its energy bounded;
- **or** some smooth initial velocity leads to a solution that stops being smooth in finite time.

The Clay Mathematics Institute lists the problem as open.

## What the kernel has checked here

<p v-if="rows.length">Each line links its theorem page; each is checked by the Lean kernel on every build.</p>
<ul>
<li v-for="r in rows" :key="r.name"><a :href="withBase('/theorem/' + r.e.key)"><code>{{ r.name }}</code></a> — {{ r.says }}</li>
</ul>

The first two are about a finite toy system: the doubling flow on the residues mod 9, which is bounded forever
because it repeats every six steps. The file that states them says so itself — bounded evolution of that flow is
not global existence and smoothness of fluids.

The last four are the discrete shadow of the one identity every known estimate rests on. For smooth solutions,
the nonlinear term moves energy between scales but never creates it, so ½ d/dt ∫|u|² = −ν ∫|∇u|² ≤ 0. On a
periodic lattice of any size, with the standard skew-symmetric discretisation, the same holds exactly, and here it is
proved for every lattice size and every integer field — not checked on a sample.

## The frontier, and where it leads

- **Energy gives existence, not smoothness.** From the energy identity, Jean Leray (1934) built global *weak*
  solutions for every finite-energy initial velocity. Whether they stay smooth is the open part.
- **Singularities, if any, are rare.** Caffarelli, Kohn and Nirenberg (1982) showed the possible singular set has
  one-dimensional parabolic Hausdorff measure zero.
- **A bound on one critical quantity would be enough.** Escauriaza, Seregin and Šverák (2003) showed a solution
  that stays bounded in L³ cannot break down; conditions of this kind are the known regularity criteria.
- **Energy alone cannot decide it.** Terence Tao (2016) built an averaged version of the equations that keeps the
  energy identity and still blows up in finite time. Any proof must use structure beyond energy — the nonlinear
  term's precise form, not only the fact that it does no work.
- **Two dimensions are settled.** In the plane, global smooth solutions are known; the difficulty is the third
  dimension, where vortex lines can stretch.

That last point is where a new idea would have to act. The author of this deposit, Tsvetan Rouschev, holds that the
Millennium Problems are resolved through involution; that argument is his, and this page records only what the
kernel has checked.
