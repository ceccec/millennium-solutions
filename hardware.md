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

## The verdict rule

Per setting, D = n₀₀ + n₁₁ − n₀₁ − n₁₀ over N shots, and S = Σ sign · D / N. S > 2 is decided as Σ sign · D · Π(other N) > 2 · Π N on exact integers — the rule, its one-count controls on both sides of 2, and the classical bound itself are Lean theorems in `src/proof/quantum_hardware.lean`, closed by `decide`. A wrong gate or a noisy device can only lower S, so a false positive cannot come from this code. It is not a loophole-free Bell test: it trusts the provider's device and readout.
