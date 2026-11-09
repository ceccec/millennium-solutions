#!/usr/bin/env node
// QUANTUM OCTAVE — Mermin's GHZ lead and the cluster state's stabilizers at ANY width, from src/quantum/hardware.ts.
//
// The kernel seals the octaves 2 … 128 (src/proof/quantum_octaves.lean, quantum_octave_128.lean); this answers any n by
// the same method, with no cap. The width is a number, or read from a UUID's own fields: 128 bits minus the version hex
// digit (124), minus the variant bits too (122).
//
//   node scripts/quantum-octave.ts --qubits 124
//   node scripts/quantum-octave.ts --uuid 3f2a9c1e-7b4d-4e8a-9c21-5d6f7a8b9c0d
import { mermin, cluster, qubitsOf } from '../src/quantum/hardware.ts'

const arg = (name: string) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : undefined }
const uuid = arg('--uuid')
const fromUuid = uuid ? qubitsOf(uuid) : undefined
const n = Number(arg('--qubits') ?? fromUuid?.minusVersionHex ?? 124)
const m = mermin(n), c = cluster(n)
console.log(JSON.stringify({
  ...(fromUuid ? { uuid, ...fromUuid } : {}),
  qubits: n,
  mermin: { quantum: `2^${m.quantum.toString(2).length - 1}`, classical: `2^${m.classical.toString(2).length - 1}`, lead: `2^${m.lead.toString(2).length - 1}`, reach: m.reach },
  cluster: { generators: c.stabilizers.length, isCluster: c.isCluster, commute: c.commute, first: c.stabilizers[0], middle: c.stabilizers[n >> 1], last: c.stabilizers[n - 1] },
  note: 'exact classical computation of the ideal state (ISO/IEC 4879 §3.4.22); the octaves are sealed in Lean, any other width uses the same method',
}, null, 1))
