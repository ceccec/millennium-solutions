#!/usr/bin/env node
// QUANTUM HARDWARE RECEIPT — VERIFIED AGAINST THE KERNEL RULE, ITS PROSE READ FROM THE LEAN FILE.
//
// The CHSH test, its ISO/IEC 4879:2024 references, and what it decides are the inline docs of
// src/iso/iec-4879-quantum/quantum_hardware.lean — read here as the ISO test prompt rather than retyped, so the
// naming is the kernel's, not this file's. The rule is the kernel's too: `chshVerdict` is the integer form of
// S > 2 that quantum_hardware.lean seals, with its one-count controls on both sides of the bound. This applies
// it to the device receipt scripts/quantum-hardware.ts writes: a completed receipt must REPRODUCE —
// chshVerdict(counts) re-derives its S and exceedsClassical from the device's own counts, or the record is a
// fabrication and this refuses. No receipt, or one still in flight, is reported in the Lean file's own terms —
// the kernel decides the rule, a device decides a run, and the run is the provider's job record. Nothing here
// caps the capacity or manufactures a verdict; it reads the receipt and the rule, each from where it is decided.
//
//   node scripts/quantum-hardware-gate.ts                   check evidence/quantum-hardware/latest.json
//   HW_RECEIPT=path node scripts/quantum-hardware-gate.ts   verify another receipt (gates-fire feeds the control)
import { existsSync, readFileSync } from 'node:fs'
import { read } from './leandoc.ts'
import { chshVerdict, ACCEPTED_HARDWARE, type MeasurementCounts } from '../src/iso/iec-4879-quantum/hardware/hardware.ts'

const doc = read('quantum_hardware.lean')
const PROMPT = (doc.frontmatter.prior_art_domain ?? doc.title).replace(/\s+/g, ' ').trim()
const RUN = process.env.HW_RECEIPT || 'evidence/quantum-hardware/latest.json'
const accepted = new Set(ACCEPTED_HARDWARE.map((h) => h.name))

if (!existsSync(RUN)) {
  console.log(`○ quantum-hardware-gate: no device receipt. ${doc.title}. Test prompt (quantum_hardware.lean): ${PROMPT}. `
    + `The kernel decides the rule; a run on a device is the provider's job record — the depositor's `
    + `\`IBM_QUANTUM_TOKEN=… IBM_QUANTUM_CRN=… npm run quantum:hardware\`. Not a failure, and not a cap on the capacity.`)
  process.exit(0)
}

type Receipt = { status: string; hardware?: string; backend?: string; job?: string; S?: number; exceedsClassical?: boolean; counts?: MeasurementCounts[] }
let bad = 0
const fail = (m: string) => { console.log('  ✗ ' + m); bad++ }
let r: Receipt
try { r = JSON.parse(readFileSync(RUN, 'utf8')) as Receipt }
catch (e) { console.log(`  ✗ quantum-hardware-gate: ${RUN} is not readable JSON — ${(e as Error).message}`); process.exit(1) }

if (r.status === 'QUANTUM_HARDWARE' || r.status === 'NOT_ABOVE_CLASSICAL') {
  if (!Array.isArray(r.counts) || !r.counts.length) {
    fail(`${RUN} claims ${r.status} but carries no counts — a verdict no reader can recompute`)
  } else {
    let v: ReturnType<typeof chshVerdict> | null = null
    try { v = chshVerdict(r.counts) } catch (e) { fail(`${RUN}: its counts do not form a CHSH verdict — ${(e as Error).message}`) }
    if (v) {
      // RE-DERIVED, NOT TRUSTED: the receipt's own counts must give its S and its side of the classical bound.
      if (typeof r.S !== 'number' || Math.abs(v.S - r.S) > 1e-9) fail(`${RUN}: S is ${r.S}, but its counts decide ${v.S} — the claimed value is not the one the counts give`)
      if (v.exceedsClassical !== r.exceedsClassical) fail(`${RUN}: exceedsClassical is ${r.exceedsClassical}, its counts give ${v.exceedsClassical}`)
      const want = v.exceedsClassical ? 'QUANTUM_HARDWARE' : 'NOT_ABOVE_CLASSICAL'
      if (r.status !== want) fail(`${RUN}: status ${r.status} is not the side of the bound its counts fall on (${want})`)
    }
    if (!r.backend) fail(`${RUN}: a device verdict names no backend`)
    if (r.hardware && !accepted.has(r.hardware)) fail(`${RUN}: hardware ${r.hardware} is not an ACCEPTED_HARDWARE system`)
    if (!r.job) fail(`${RUN}: no job id — a device run that cannot be looked up`)
  }
  if (!bad) console.log(`✓ quantum-hardware-gate: ${r.backend} job ${r.job} reproduces — chshVerdict re-derives S = ${r.S} (${r.status}) `
    + `from the device's own counts, by the rule quantum_hardware.lean seals; the verdict is the device's, not this file's`)
} else {
  // SUBMITTED / NOT_COMPLETED / UNDECODED / REFUSED — honest intermediate states; no verdict is claimed.
  console.log(`○ quantum-hardware-gate: receipt status ${r.status} — no verdict claimed, nothing to verify (not a failure)`)
}
process.exit(bad ? 1 : 0)
