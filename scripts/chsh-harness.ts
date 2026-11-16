// scripts/chsh-harness.ts — THE CHSH-RUN HARNESS, via the pipeline. The ISO/IEC 4879:2024 3.4.10 device leaf
// closes on ONE measured input: the counts of a CHSH Bell-pair run on real quantum hardware. The JUDGE already
// exists and is sealed (src/iso/iec-4879-quantum/quantum_hardware.lean + hardware/hardware.ts `chshVerdict`,
// S>2 on exact integers, false-positive impossible by construction). This harness is the pipeline step that
// (1) emits the runnable circuits (OpenQASM) for the four settings and lists the accepted hardware, and
// (2) if the depositor drops a counts file, applies the sealed verdict and decides it.
//
// Honest: with no counts file the state is NOT_RUN (the judge ready, the run pending the depositor's hardware
// credentials) — never a claim that it ran. Drop hardware/chsh-counts.json and the next build decides it.
// Generated — do not edit. Registered in the reconcile chain and predocs.
import { writeFileSync, existsSync, readFileSync } from 'node:fs'
import { chshVerdict, chshGates, toQasm, SETTINGS, ACCEPTED_HARDWARE } from '../src/iso/iec-4879-quantum/hardware/hardware.ts'
import type { MeasurementCounts } from '../src/iso/iec-4879-quantum/hardware/hardware.ts'

const COUNTS_PATH = 'hardware/chsh-counts.json'   // the depositor drops a real run's four-setting counts here

// the four runnable circuits (qubits 0,1), as OpenQASM — what to run on the hardware.
const circuits = SETTINGS.map((s, i) => ({ setting: i, sign: s.sign, qasm: toQasm(chshGates(s), 0, 1) }))

// the verdict, if a run has been dropped in.
let ran: { S: number; exceedsClassical: boolean; shots: number[] } | null = null
let countsSeen: MeasurementCounts[] | null = null
let parseError = ''
if (existsSync(COUNTS_PATH)) {
  try {
    countsSeen = JSON.parse(readFileSync(COUNTS_PATH, 'utf8')) as MeasurementCounts[]
    ran = chshVerdict(countsSeen)
  } catch (e) { parseError = e instanceof Error ? e.message : String(e) }
}

const state = ran ? (ran.exceedsClassical ? 'QUANTUM (S > 2)' : 'CLASSICAL (S ≤ 2)') : parseError ? 'INVALID COUNTS' : 'NOT_RUN'

let md = `---
title: CHSH run
description: The pipeline harness for ISO/IEC 4879 3.4.10 — the sealed CHSH verdict, the circuits to run on real hardware, and the decision on any counts dropped in.
head:
  - ['meta', { name: 'robots', content: 'index, follow' }]
---

# CHSH run — the device measurement, via the pipeline

> **The judge is built; this is the input slot.** ISO/IEC 4879:2024 3.4.10 ("quantum computer") closes on a *measured* result, not a proof. The verdict is sealed — \`quantum_hardware.lean\` decides S > 2 on exact integers, and *no error in it can manufacture S > 2 from classical counts* (a false positive is impossible; only a false negative). This page emits the circuits to run and decides whatever counts are dropped into \`${COUNTS_PATH}\`.

**State: ${state}.**

`

if (ran) {
  md += `## Decision (from \`${COUNTS_PATH}\`)\n\n`
  md += `- **S = ${ran.S.toFixed(6)}** over ${SETTINGS.length} settings; shots per setting: ${ran.shots.join(', ')}\n`
  md += `- **exceeds the classical bound (S > 2): ${ran.exceedsClassical ? 'YES — quantum' : 'no — classical/noisy'}**\n`
  md += `- decided by the sealed exact-integer verdict; a float never stands between the counts and the answer.\n`
} else if (parseError) {
  md += `## Counts present but invalid\n\n\`${COUNTS_PATH}\`: ${parseError}. Expected a JSON array of four \`{ n00, n01, n10, n11 }\` objects, one per setting.\n`
} else {
  md += `## Not run yet — the pending input\n\n`
  md += `No \`${COUNTS_PATH}\`. Run the four circuits below on real quantum hardware (the depositor's credentials), then drop the four-setting counts as JSON (\`[{ n00, n01, n10, n11 }, …]\`) at \`${COUNTS_PATH}\`. The next build decides it — no code change, no claim until the counts are in.\n`
}

md += `
## The runnable circuits (OpenQASM, qubits 0 & 1)

The four CHSH settings — Alice along 0 or π/2, Bob along ±π/4, sign −1 on the last:

`
for (const c of circuits) {
  md += `**Setting ${c.setting} (sign ${c.sign > 0 ? '+1' : '−1'}):**\n\n\`\`\`qasm\n${c.qasm}\n\`\`\`\n\n`
}

md += `## Accepted hardware

Any device whose counts the verdict accepts — the run is judged by the kernel's rule, not the vendor's claim:

`
for (const hw of ACCEPTED_HARDWARE as readonly { name?: string; vendor?: string }[]) {
  md += `- ${hw.name ?? hw.vendor ?? JSON.stringify(hw)}\n`
}

md += `
## Honest floor

Until \`${COUNTS_PATH}\` holds a real run, the 3.4.10 device leaf is **open** — the judge is ready, the measurement pending. When it holds one, the sealed verdict decides it, and \`/iso-conformance\` flips that row by the same logic — nothing fabricated, a false positive impossible by construction.
`

writeFileSync('chsh-run.md', md)
console.log(`chsh-harness: generated chsh-run.md — state ${state}; ${circuits.length} circuits emitted; counts ${existsSync(COUNTS_PATH) ? 'present' : 'absent (NOT_RUN)'}`)
