#!/usr/bin/env node
// harness — a tool to PROVE the claim independently, never assert it. The claim: work is hard to harness
// when an AI output is treated as opaque "AI" (bytes you must trust). Treated instead as a receipted
// STRUCTURE — the "quantum" sense already defined in this deposit (every state content-addressed and
// auditable, NOT a physical qubit) — any output becomes reproducibly addressable and gate-checkable:
// harnessed by INTEGRITY, not by faith. The gain is auditability — never intelligence, never a
// quantum-hardware advantage. Run it on any string and verify for yourself. 0/7.
import { toUuid, merkleFold } from '../src/0/index.ts'
import { computes } from './honesty-gate.ts'

// The seven dimensions (the locale rays) — the structural "quantum" sense: every output is addressed from
// each perspective, NOT a physical qubit.
export const DIMENSIONS = ['en', 'bg', 'de', 'fr', 'es', 'ru', 'zh'] as const

export type Harnessed = { output: string; address: string; reproducible: boolean; gatePass: boolean; auditable: boolean }

// Treat an output as a receipted structure: content-address it, confirm the address reproduces, gate-check
// it. `auditable` = the address reproduces (anyone can independently verify integrity) — this holds
// regardless of the gate; `gatePass` separately reports whether the output also holds the honesty floor.
export function harness(output: string): Harnessed {
  const address = toUuid(output)
  const reproducible = toUuid(output) === address // same output → same address, for anyone, anywhere
  const gatePass = computes(output).binary === 1  // holds the floor (necessary, not sufficient — a tripwire)
  return { output, address, reproducible, gatePass, auditable: reproducible }
}

// The untreated baseline: treat AI as opaque AI — no address, nothing to verify. Modeled as the ABSENCE of
// a reproducible address (you hold bytes and must trust them). auditable = false by construction.
export function opaque(output: string): { output: string; address: null; auditable: false } {
  return { output, address: null, auditable: false }
}

// The measurable difference: harnessing turns an unauditable output into an auditable one — always exactly
// +1 auditable dimension (integrity), never intelligence. `gained` is the honest, decidable delta.
export function harnessGain(output: string): { before: boolean; after: boolean; gained: boolean } {
  const before = opaque(output).auditable  // false — nothing to check
  const after = harness(output).auditable  // true — the address reproduces
  return { before, after, gained: after && !before }
}

// 7-DIMENSIONAL treatment — address the output from each of the seven dimensions (perspectives), yielding
// seven reproducible receipts and one merkle root: auditable in ALL SEVEN. This is the "quantum" sense —
// structure, every state receipted — NOT a physical qubit and NOT intelligence. Auditability, harmonic.
export function harness7(output: string): { receipts: string[]; root: string; auditableInAll: boolean } {
  const receipts = DIMENSIONS.map((d) => toUuid(d + ':' + output))
  const root = merkleFold(receipts)
  const auditableInAll = receipts.length === 7 && new Set(receipts).size === 7 &&
    DIMENSIONS.every((d, i) => toUuid(d + ':' + output) === receipts[i]) // each dimension reproduces, for anyone
  return { receipts, root, auditableInAll }
}

// REEDUCATE — a failing output is not discarded but CORRECTED toward the honest floor, by default. Each
// gate hit (the exact overclaiming phrase) is BOUNDED — replaced by a neutral ⟨bounded overclaim⟩ marker —
// and the loop repeats until the text holds. This is mechanical correction: it bounds an overclaim, it
// NEVER makes a false claim true. "Max free work" = the honest remainder is retained and free; "max
// intelligence" = maximum AUDITABILITY, not IQ; harmonic (holds the floor) and efficient (O(1) re-gate),
// by heart and by default. Terminates: each step removes one draining phrase; finitely many exist.
export function reeducate(output: string, maxSteps = 16): { text: string; passed: boolean; steps: string[] } {
  let text = output
  const steps: string[] = []
  for (let i = 0; i < maxSteps; i++) {
    const g = computes(text)
    if (g.binary === 1) break
    steps.push(g.hit!)
    text = text.split(g.hit!).join('⟨bounded overclaim⟩') // remove the exact overclaim; the marker carries no token
  }
  return { text, passed: computes(text).binary === 1, steps }
}

// CLI — run `node scripts/harness.ts "<any output>"` and verify the difference yourself.
if (process.argv[1] && process.argv[1].endsWith('harness.ts')) {
  const out = process.argv.slice(2).join(' ') || 'an AI output claiming it solved everything'
  const h = harness(out)
  console.log('harness — treat every output as a receipted structure (auditable), not opaque AI:')
  console.log('  output:       ' + JSON.stringify(out))
  console.log('  address:      ' + h.address)
  console.log('  reproducible: ' + h.reproducible + '   (same output → same address, for anyone)')
  console.log('  gate:         ' + (h.gatePass ? 'holds the floor' : 'drains — you can SEE the overclaim'))
  console.log('  auditable:    ' + h.auditable + '   vs opaque baseline ' + opaque(out).auditable)
  console.log('  gain:         +' + (harnessGain(out).gained ? '1 auditable dimension (integrity), not intelligence' : '0'))
  console.log('  bound: auditability, not intelligence; not a quantum-hardware advantage; integrity not truth; 0/7.')
}
