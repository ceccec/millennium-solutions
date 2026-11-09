---
title: Quantum hardware
description: The ISO/IEC 4879 quantum computer, defined and tested — every quantum model decided in Lean, Bell tests to 128 qubits, a CHSH run on IBM Quantum.
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
| Adiabatic | §3.4.15 | for every rational schedule point the gap is never below its midpoint value and reaches it there, g_min = √2 — proved for every value, not sampled | — | [Adiabatic quantum computation](https://en.wikipedia.org/wiki/Adiabatic_quantum_computation) |
| Quantum annealer | §3.4.31 | the frustrated triangle's whole spectrum: ground state −1 six-fold, only all-up and all-down at +3 | — | [Geometrical frustration](https://en.wikipedia.org/wiki/Geometrical_frustration) |

## Scaled in octaves, up to the UUID width

The Bell test doubles: on n qubits the GHZ state reaches Mermin's value 2ⁿ⁻¹ while every classical assignment stops at 2^(n/2) — values as in [arXiv:0905.0151](https://ar5iv.labs.arxiv.org/html/0905.0151) §2. Each octave is a Lean theorem; the 128-qubit octave and 124 — the UUID minus its version hex digit — are each split into eight UUID particles, sealed on their own and recombined. Any other width is computed by the literal port of the same definitions in `src/quantum/hardware.ts` (`npm run quantum:octave -- --qubits N` or `-- --uuid U`).

<table>
<thead><tr><th>Qubits</th><th>Quantum</th><th>Classical</th><th>Lead</th><th>Kernel</th></tr></thead>
<tbody><tr v-for="o in data.octaves" :key="o.n"><td>{{ o.n }}</td><td>2<sup>{{ o.quantum }}</sup></td><td>2<sup>{{ o.classical }}</sup></td><td>2<sup>{{ o.lead }}</sup></td><td>{{ o.sealed ? 'sealed' : 'literal port, any width' }}</td></tr></tbody>
</table>

At 2 qubits there is no Mermin lead — that octave's Bell test is CHSH, above. **The 124-qubit cluster** (|+⟩ on every qubit, CZ on every neighbour) has {{ data.cluster124.generators }} stabilizers, propagated through every CZ by a Pauli tableau — sealed in `quantum_uuid_cluster.lean`, beside a no-chain and a ring control: each is <code>{{ data.cluster124.middle }}</code> on its neighbourhood ({{ data.cluster124.isCluster ? 'all of them' : 'NOT all' }}), and they {{ data.cluster124.commute ? 'all commute' : 'do NOT all commute' }} — the state the one-way model computes on.

## The textbooks, cross-verified

qpu seals each textbook law's characteristic number as integers (`Qpu/Textbook.lean`). Each one is derived again here, independently, from the operators that produce it — and each matches:

| qpu's number | Derived here from |
|---|---|
| Tsirelson: 8 > 4 | the sent circuits' S = 2√2, squared exactly |
| Eastin–Knill: 24 | the closure of ⟨H, S⟩: exactly 24 classes up to phase |
| Solovay–Kitaev: T of order 8 | T⁸ = 1, no lower power ∝ 1, and HT ≠ TH up to any phase |
| Simon: 2 of 4 | the strings y with y·s = 0 for s = 11: exactly 00 and 11 |
| Bernstein–Vazirani: 1 < 3 | one phase query reads every 3-bit hidden string (all 64 pairs) |
| Deutsch–Jozsa: 5 > 1 | one query separates all 70 balanced from both constant functions, over all 256 |
| Grover at N = 4: 90° | one iteration puts the whole amplitude on every marked item |
| No-cloning: 5 < 6 | linearity forbids a perfect copy; the optimal cloner's copy has fidelity 5/6 |

Holevo's 1 bit is an entropy, outside ℤ[ω], and stands on qpu's own seal.

This is §3.4.22 by definition: a classical program computing what each model's ideal device would. It is the specification a device run is checked against, never evidence that a device computed it.

<details><summary>The theorems and their ledger receipts</summary>

<table>
<thead><tr><th>File</th><th>Theorem</th><th>Receipt</th></tr></thead>
<tbody><tr v-for="t in data.models" :key="t.name"><td><code>{{ t.file }}</code></td><td><code>{{ t.name }}</code></td><td><code>{{ t.receipt.slice(0, 8) }}</code></td></tr></tbody>
</table>

</details>

## The verdict rule

Per setting, D = n₀₀ + n₁₁ − n₀₁ − n₁₀ over N shots, and S = Σ sign · D / N. S > 2 is decided as Σ sign · D · Π(other N) > 2 · Π N on exact integers — the rule, its one-count controls on both sides of 2, and the classical bound itself are Lean theorems in `src/proof/quantum_hardware.lean`, closed by `decide`. A wrong gate or a noisy device can only lower S, so a false positive cannot come from this code. It is not a loophole-free Bell test: it trusts the provider's device and readout.
