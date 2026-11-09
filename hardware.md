---
title: Quantum hardware
---

<script setup>
import { data } from './.vitepress/theme/hardware.data.ts'
</script>

# Quantum hardware

The systems this deposit accepts as real quantum computers, and the one test that lets a run on them count as hardware.

## The definition

A **real quantum computer** is all three at once, by ISO:

| It must be | Standard | Test |
|---|---|---|
| **Hardware** | ISO/IEC 2382:2015 — physical components of an information system | the result names a physical device and a job id its provider issued |
| **A quantum processor** | ISO/IEC 4879:2024 §3.4.8 (over §3.4.1, §3.3.5) — a tangible device processing information held in physical qubits through superposition and entanglement | CHSH **S > 2** from that device's own counts |
| **A computer** | ISO/IEC 4879:2024 §3.4.10 — fully programmable, any unitary on its Hilbert space | the provider's backend reports a universal native gate set |

A classical program that prints the same number is §3.4.22, a quantum simulator. What separates the two is where the counts come from.

## Device verdict

<div v-if="data.run">

| | |
|---|---|
| Status | **{{ data.run.status }}** |
| System | {{ data.run.hardware }} — {{ data.run.backend }} |
| Job | `{{ data.run.job }}` ({{ data.run.created }}) |
| S | {{ data.run.S ?? '—' }} |
| Above classical (S > 2, exact integers) | {{ data.run.exceedsClassical ?? '—' }} |
| Does not establish | {{ data.run.notFor }} |

</div>
<div v-else>

**No device run yet.** Nothing on this page is hardware evidence until `scripts/quantum-hardware.ts` runs on an accepted system with the depositor's own credentials and writes its receipt.

</div>

## Accepted systems

<div v-for="h in data.accepted" :key="h.name">

**{{ h.name }}** — {{ h.attribution }}

- Endpoint: `{{ h.base }}`
- Credentials (set by the depositor, never stored): {{ h.env.join(', ') }}
- Access: {{ h.plan }}
- Does not establish: {{ h.notFor }}

</div>

## The circuits sent

A Bell pair, then each side rotated to its CHSH setting, in the device's native gates (`rz`, `sx`, `cz`). The ideal column is this module's own simulation of the same gates — §3.4.22, shown to prove the circuits are right, never as evidence.

<table>
<thead><tr><th>Alice</th><th>Bob</th><th>Sign</th><th>Ideal E (simulated)</th></tr></thead>
<tbody><tr v-for="s in data.settings" :key="s.a + s.b"><td>{{ s.a }}</td><td>{{ s.b }}</td><td>{{ s.sign }}</td><td>{{ s.idealE.toFixed(4) }}</td></tr></tbody>
</table>

Ideal S (simulated): **{{ data.idealS.toFixed(4) }}** — the quantum bound 2√2. Classical bound: 2.

<details><summary>OpenQASM 3, as sent (qubits shown as $0, $1; the run uses a coupled pair the backend reports)</summary>

<pre v-for="s in data.settings" :key="s.qasm">{{ s.qasm }}</pre>

</details>

## Every model, computed here

ISO/IEC 4879 names the quantum computing models. Each is decided here at its known optimum — in the cyclotomic integers ℤ[ω], ω = e^{iπ/4}, so no float stands anywhere — beside a control that must come out the other way, and each decided value matches an independent public source (read 2026-11-09):

| Model | Clause | What is decided | Control | Cross-checked against |
|---|---|---|---|---|
| Circuit-based | §3.4.13 | the sent CHSH gates make a Bell pair and reach S = 2√2 exactly — Tsirelson's maximum | Bob at angle 0 gives E = 1; no CZ gives E = 0 | [CHSH inequality](https://en.wikipedia.org/wiki/CHSH_inequality), [Tsirelson's bound](https://en.wikipedia.org/wiki/Tsirelson%27s_bound) |
| One-way (measurement-based) | §3.4.14 | measuring a cluster qubit applies J(θ) = H·diag(1, e^{iθ}) to its neighbour with an X^m byproduct — all 8 angles, both outcomes | without the cluster bond the gate does not arrive | [One-way quantum computer](https://en.wikipedia.org/wiki/One-way_quantum_computer) |
| Topological (Ising anyons) | §3.4.16 | the braids satisfy the braid relation and generate exactly 24 classes up to phase, closed — the whole single-qubit Clifford group, so not universal | the equal-up-to-phase test refuses σ₁ ∝ 1 | [Clifford group](https://en.wikipedia.org/wiki/Clifford_group), [Topological quantum computer](https://en.wikipedia.org/wiki/Topological_quantum_computer) |
| Boson sampling | §3.5.8 | every balanced beam splitter (all 64 phase pairs) is unitary with permanent 0 — a full-depth Hong–Ou–Mandel dip | distinguishable photons coincide half the time | [Hong–Ou–Mandel effect](https://en.wikipedia.org/wiki/Hong%E2%80%93Ou%E2%80%93Mandel_effect), [Boson sampling](https://en.wikipedia.org/wiki/Boson_sampling) |
| Adiabatic | §3.4.15 | at every grid resolution up to 100 the schedule's gap is smallest exactly at the midpoint, g_min = √2 — the continuum is the limit, not decided | — | [Adiabatic quantum computation](https://en.wikipedia.org/wiki/Adiabatic_quantum_computation) |
| Quantum annealer | §3.4.31 | the frustrated triangle's whole spectrum: ground state −1 six-fold, only all-up and all-down at +3 | — | [Geometrical frustration](https://en.wikipedia.org/wiki/Geometrical_frustration) |

This is §3.4.22 by definition: a classical program computing what each model's ideal device would. It is the specification a device run is checked against, never evidence that a device computed it.

<details><summary>The theorems and their ledger receipts</summary>

<table>
<thead><tr><th>File</th><th>Theorem</th><th>Receipt</th></tr></thead>
<tbody><tr v-for="t in data.models" :key="t.name"><td><code>{{ t.file }}</code></td><td><code>{{ t.name }}</code></td><td><code>{{ t.receipt.slice(0, 8) }}</code></td></tr></tbody>
</table>

</details>

## The verdict rule

Per setting, D = n₀₀ + n₁₁ − n₀₁ − n₁₀ over N shots, and S = Σ sign · D / N. S > 2 is decided as Σ sign · D · Π(other N) > 2 · Π N on exact integers — the rule, its one-count controls on both sides of 2, and the classical bound itself are Lean theorems in `src/proof/quantum_hardware.lean`, closed by `decide`. A wrong gate or a noisy device can only lower S, so a false positive cannot come from this code. It is not a loophole-free Bell test: it trusts the provider's device and readout.
