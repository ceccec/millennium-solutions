#!/usr/bin/env node
// QUANTUM OCTAVE — Mermin's GHZ lead and the cluster state's stabilizers at ANY width, from src/quantum/hardware/hardware.ts.
//
// The kernel seals the octaves 2 … 128 (src/proof/quantum_octaves.lean, quantum_octave_128.lean); this answers any n by
// the same method, with no cap. The width is a number, or read from a UUID's own fields: 128 bits minus the version hex
// digit (124), minus the variant bits too (122).
//
//   node scripts/quantum-octave.ts --qubits 124
//   node scripts/quantum-octave.ts --uuid 3f2a9c1e-7b4d-4e8a-9c21-5d6f7a8b9c0d
//
// ANY CIRCUIT, AT THAT WIDTH: Clifford+T, the universal set, by Pauli paths (src/quantum/pauli/paulipath.ts). The width costs
// nothing; each T the observable passes through can double the terms, so the T-count is the bound — and it is reported.
//
//   node scripts/quantum-octave.ts --qubits 128 --circuit "h0 cx0,1 cx1,2 t2" --observable "X0 X1 X2"
//   node scripts/quantum-octave.ts --uuid <uuid> --circuit "h0 s0 t0" --observable "X0"
//
// UUID PARTICLES INTERACTING. With a stream of UUIDs, every free bit of every UUID is a qubit — the particle (uuid, bit) —
// and a two-qubit gate between particles of different UUIDs is how they interact. `u<i>.<j>` names free bit j (0 … 121)
// of the i-th UUID in the stream. --stream N derives N UUIDs deterministically (toUuid of "stream <i>"); --uuids takes
// them as a comma list. --ghz entangles every particle of every UUID in one GHZ chain, each link a CNOT between
// neighbouring particles, crossing every UUID boundary, then --t K places K T gates spread across the UUIDs; the result
// is checked against the closed form ⟨X…X⟩ = cos(Kπ/4).
//
//   node scripts/quantum-octave.ts --stream 100 --ghz --t 6
//   node scripts/quantum-octave.ts --stream 2 --circuit "h u0.0 cx u0.0,u1.121 t u1.121" --observable "X u0.0 X u1.121"
import { mermin, cluster, qubitsOf } from '../src/quantum/hardware/hardware.ts'
import { expectation, q2str, tCount, particle, particles, ofParticle, FREE_BITS, type Gate, type Pauli } from '../src/quantum/pauli/paulipath.ts'
import { toUuid } from '../src/0/index.ts'

const arg = (name: string) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : undefined }
const has = (name: string) => process.argv.includes(name)
const uuid = arg('--uuid')
const fromUuid = uuid ? qubitsOf(uuid) : undefined
const n = Number(arg('--qubits') ?? fromUuid?.minusVersionHex ?? 124)
const stream: string[] = arg('--uuids')?.split(',').map((u) => u.trim()).filter(Boolean)
  ?? (arg('--stream') ? Array.from({ length: Number(arg('--stream')) }, (_, i) => toUuid(`stream ${i}`)) : [])

/** a qubit token: a plain index below the width, or u<i>.<j> — free bit j of the i-th UUID in the stream */
const qubit = (tok: string): bigint => {
  const u = tok.match(/^u(\d+)\.(\d+)$/)
  if (u) {
    const i = Number(u[1]), j = Number(u[2])
    if (i >= stream.length) throw new Error(`${tok}: the stream has ${stream.length} UUID(s)`)
    if (j >= FREE_BITS.length) throw new Error(`${tok}: a UUID has ${FREE_BITS.length} free bits (particles 0 … ${FREE_BITS.length - 1})`)
    return particle(stream[i], FREE_BITS[j])
  }
  if (!/^\d+$/.test(tok)) throw new Error(`not a qubit: ${tok} — expected an index or u<i>.<j>`)
  if (stream.length === 0 && Number(tok) >= n) throw new Error(`${tok} names a qubit outside the width ${n}`)
  return BigInt(tok)
}
const report = (circuit: Gate[], obs: Pauli, label: string, extra: Record<string, unknown> = {}, sign: 1 | -1 = 1) => {
  const t0 = performance.now()
  const { value, peakTerms } = expectation(circuit, obs, { sign })
  const touched = new Set(circuit.flatMap((g) => ('t' in g ? [BigInt(g.q), BigInt(g.t)] : [BigInt(g.q)])))
  const crossing = circuit.filter((g) => 't' in g && (BigInt(g.q) >> 7n) !== (BigInt(g.t) >> 7n)).length
  console.log(JSON.stringify({
    ...(fromUuid ? { uuid, ...fromUuid } : {}),
    ...(stream.length ? { uuids: stream.length, particleCapacity: stream.length * FREE_BITS.length, addressSpace: '2^122 UUIDs × 122 particles' } : { qubits: n }),
    particlesTouched: touched.size, gates: circuit.length, interactionsAcrossUuids: crossing, tCount: tCount(circuit), observable: label,
    expectation: q2str(value), exact: { a: String(value.a), b: String(value.b), denominatorPowerOfTwo: value.m },
    ...extra, peakTerms, ms: Math.round(performance.now() - t0),
    note: 'exact expectation of the ideal circuit by Pauli paths over UUID particles: no width or address bound, cost about 2^(T-count) at worst and linear in the particles touched; computed classically, not on a physical quantum processor (ISO/IEC 4879 §3.4.8)',
  }, null, 1))
}

if (has('--ghz')) {
  if (!stream.length) throw new Error('--ghz needs a stream: --stream N or --uuids a,b,…')
  const all = stream.flatMap(particles)
  const k = Number(arg('--t') ?? 0)
  const circuit: Gate[] = [{ g: 'h', q: all[0] }, ...all.slice(1).map((q, i): Gate => ({ g: 'cx', q: all[i], t: q }))]
  for (let j = 0; j < k; j++) circuit.push({ g: 't', q: all[Math.floor(((j + 0.5) * all.length) / k)] })   // spread across the UUIDs
  const closed = ['1', '(1√2)/2', '0', '(-1√2)/2', '-1', '(-1√2)/2', '0', '(1√2)/2'][k % 8]
  report(circuit, new Map(all.map((q) => [q, 1])), `X on all ${all.length} particles`, { closedForm: `cos(${k}π/4) = ${closed}`, chain: { from: ofParticle(all[0]), to: ofParticle(all[all.length - 1]) } })
  process.exit(0)
}

const circuitText = arg('--circuit')
if (circuitText !== undefined) {
  // gates as "h 0", "t u0.5", "cx u0.0,u1.3" or the compact "h0 cx0,1" — the letters, then the qubit(s)
  const toks = circuitText.trim().replace(/\b(h|sdg|s|tdg|t|x|y|z|cx|cz)(?=[\du])/g, '$1 ').split(/\s+/).filter(Boolean)
  const circuit: Gate[] = []
  for (let i = 0; i < toks.length; i += 2) {
    const g = toks[i], args = (toks[i + 1] ?? '').split(',')
    if (!/^(h|sdg|s|tdg|t|x|y|z|cx|cz)$/.test(g) || !toks[i + 1]) throw new Error(`not a gate: ${g} ${toks[i + 1] ?? ''} — expected e.g. h0, t u1.5, cx u0.0,u1.3`)
    circuit.push(g === 'cx' || g === 'cz' ? { g, q: qubit(args[0]), t: qubit(args[1] ?? '') } : { g: g as Exclude<Gate['g'], 'cx' | 'cz'>, q: qubit(args[0]) })
  }
  // the observable as "X0 Z5" or "X u0.0 Z u1.3" (unnamed particles are I), optionally prefixed with "-"
  const obsText = arg('--observable') ?? 'Z0'
  const otoks = obsText.replace(/^-/, '').trim().replace(/\b([XYZ])(?=[\du])/g, '$1 ').split(/\s+/).filter(Boolean)
  const obs: Pauli = new Map()
  for (let i = 0; i < otoks.length; i += 2) {
    if (!/^[XYZ]$/.test(otoks[i]) || !otoks[i + 1]) throw new Error(`not a Pauli factor: ${otoks[i]} ${otoks[i + 1] ?? ''} — expected e.g. X0, Z u1.3`)
    obs.set(qubit(otoks[i + 1]), otoks[i] === 'X' ? 1 : otoks[i] === 'Z' ? 2 : 3)
  }
  report(circuit, obs, obsText, {}, obsText.startsWith('-') ? -1 : 1)
  process.exit(0)
}

const m = mermin(n), c = cluster(n)
console.log(JSON.stringify({
  ...(fromUuid ? { uuid, ...fromUuid } : {}),
  qubits: n,
  mermin: { quantum: `2^${m.quantum.toString(2).length - 1}`, classical: `2^${m.classical.toString(2).length - 1}`, lead: `2^${m.lead.toString(2).length - 1}`, reach: m.reach },
  cluster: { generators: c.stabilizers.length, isCluster: c.isCluster, commute: c.commute, first: c.stabilizers[0], middle: c.stabilizers[n >> 1], last: c.stabilizers[n - 1] },
  note: 'exact classical computation of the ideal state (ISO/IEC 4879 §3.4.22); the octaves are sealed in Lean, any other width uses the same method',
}, null, 1))
