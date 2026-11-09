#!/usr/bin/env node
// QUANTUM HARDWARE RUN — CHSH on a real device from src/quantum/hardware.ts ACCEPTED_HARDWARE, and the receipt the
// VitePress page /hardware shows.
//
// The depositor's act, not a gate's: it spends their QPU minutes on somebody else's system, so no chain runs it.
// Credentials come from the environment and are never printed or written. Without them it REFUSES by name and exits 2.
//
//   IBM_QUANTUM_TOKEN=… IBM_QUANTUM_CRN=… node scripts/quantum-hardware.ts            submit and wait
//   IBM_QUANTUM_TOKEN=… IBM_QUANTUM_CRN=… node scripts/quantum-hardware.ts --job ID   resume a submitted job
//
// Endpoints, headers and the sampler body are IBM's documented REST API (quantum.cloud.ibm.com/docs, read
// 2026-11-09). Two things the docs did not settle are checked against the live answer rather than assumed: the
// backend configuration fields, and the result encoding. An answer this file cannot decode is written as UNDECODED
// with its raw shape — never guessed into counts.
import { mkdirSync, writeFileSync } from 'node:fs'
import { ACCEPTED_HARDWARE, SETTINGS, chshGates, toQasm, chshVerdict, countsOf, type Counts } from '../src/quantum/hardware.ts'

const HW = ACCEPTED_HARDWARE.find((h) => h.name === 'ibm-quantum')!
const OUT = 'evidence/quantum-hardware'
const SHOTS = 4000
const missing = HW.env.filter((k) => !process.env[k])
if (missing.length) {
  console.log(JSON.stringify({ status: 'REFUSED', hardware: HW.name, missing, note: `set ${missing.join(' and ')} (the depositor's own IBM Quantum credentials); nothing was sent` }))
  process.exit(2)
}

const api = async (path: string, init: RequestInit = {}, bearer?: string): Promise<any> => {
  const r = await fetch(path.startsWith('http') ? path : `${HW.base}${path}`, {
    ...init,
    headers: { Accept: 'application/json', 'IBM-API-Version': '2026-04-15', 'Service-CRN': process.env.IBM_QUANTUM_CRN!, ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}), ...(init.headers ?? {}) },
  })
  if (r.status === 204) return null
  const text = await r.text()
  if (!r.ok) throw new Error(`${init.method ?? 'GET'} ${path} → ${r.status} ${text.slice(0, 300)}`)
  return text ? JSON.parse(text) : null
}

const iam = await fetch('https://iam.cloud.ibm.com/identity/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
  body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${encodeURIComponent(process.env.IBM_QUANTUM_TOKEN!)}`,
})
if (!iam.ok) { console.log(JSON.stringify({ status: 'REFUSED', hardware: HW.name, note: `IBM Cloud IAM refused the key: ${iam.status}` })); process.exit(2) }
const bearer = ((await iam.json()) as { access_token: string }).access_token

const resume = process.argv.indexOf('--job')
let jobId = resume > 0 ? process.argv[resume + 1] : ''
let backend = '', pair: [number, number] = [0, 0]

if (!jobId) {
  const { devices } = (await api('/backends', {}, bearer)) as { devices: { name: string; status: { name: string }; queue_length: number }[] }
  const online = devices.filter((d) => d.status?.name === 'online').sort((a, b) => a.queue_length - b.queue_length)
  for (const d of online) {
    const cfg = await api(`/backends/${d.name}/configuration`, {}, bearer).catch(() => null)
    const basis: string[] = cfg?.basis_gates ?? []
    const edge: [number, number] | undefined = (cfg?.coupling_map ?? [])[0]
    if (['rz', 'sx', HW.entangler].every((g) => basis.includes(g)) && edge) { backend = d.name; pair = edge; break }
  }
  if (!backend) {
    console.log(JSON.stringify({ status: 'REFUSED', hardware: HW.name, note: `no online backend reported rz, sx and ${HW.entangler} with a coupled pair`, online: online.map((d) => d.name) }))
    process.exit(2)
  }
  const pubs = SETTINGS.map((s) => [toQasm(chshGates(s), pair[0], pair[1])])
  const job = await api('/jobs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ program_id: 'sampler', backend, params: { pubs, shots: SHOTS, version: 2 } }) }, bearer)
  jobId = job.id
  console.log(JSON.stringify({ status: 'SUBMITTED', job: jobId, backend, qubits: pair, resume: `node scripts/quantum-hardware.ts --job ${jobId}` }))
}

const TERMINAL = new Set(['Completed', 'Failed', 'Cancelled', 'Cancelled - Ran too long'])
let job: any
for (;;) {
  job = await api(`/jobs/${jobId}?exclude_params=true`, {}, bearer)
  const st = job.state?.status ?? job.status
  if (TERMINAL.has(st)) break
  await new Promise((r) => setTimeout(r, 15_000))
}
backend ||= job.backend
const state = job.state?.status ?? job.status
mkdirSync(OUT, { recursive: true })
const base = { hardware: HW.name, attribution: HW.attribution, job: jobId, backend, created: job.created, state, iso: 'ISO/IEC 4879:2024 §3.4.8 / §3.4.10 test: CHSH S > 2 from the device\'s own counts', notFor: HW.notFor }
if (state !== 'Completed') {
  writeFileSync(`${OUT}/latest.json`, JSON.stringify({ ...base, status: 'NOT_COMPLETED', reason: job.state?.reason ?? null }, null, 1) + '\n')
  console.log(JSON.stringify({ status: 'NOT_COMPLETED', job: jobId, state }))
  process.exit(1)
}

const results = await api(`/jobs/${jobId}/results`, {}, bearer)
/** Per-shot register values from one PUB result, or null when the encoding is not one this file can read for certain. */
const shotsOf = (pub: any): number[] | null => {
  const reg = pub?.data?.c ?? pub?.results?.c
  if (Array.isArray(reg?.samples)) return reg.samples.map((h: string) => parseInt(h, 16))
  return null
}
const perSetting = (results?.results ?? results?.data ?? []).map(shotsOf)
if (perSetting.length !== SETTINGS.length || perSetting.some((v: number[] | null) => !v)) {
  const shape = JSON.stringify(results, (_k, v) => (typeof v === 'string' && v.length > 80 ? `<${v.length} chars>` : v)).slice(0, 2000)
  writeFileSync(`${OUT}/latest.json`, JSON.stringify({ ...base, status: 'UNDECODED', note: 'the result encoding is not one this file reads for certain; no counts were guessed', shape }, null, 1) + '\n')
  console.log(JSON.stringify({ status: 'UNDECODED', job: jobId, note: `raw shape written to ${OUT}/latest.json` }))
  process.exit(1)
}
const counts: Counts[] = perSetting.map((v: number[]) => countsOf(v))
const verdict = chshVerdict(counts)
const receipt = { ...base, status: verdict.exceedsClassical ? 'QUANTUM_HARDWARE' : 'NOT_ABOVE_CLASSICAL', S: verdict.S, exceedsClassical: verdict.exceedsClassical, counts, shots: verdict.shots, qubits: pair }
writeFileSync(`${OUT}/${jobId}.json`, JSON.stringify(receipt, null, 1) + '\n')
writeFileSync(`${OUT}/latest.json`, JSON.stringify(receipt, null, 1) + '\n')
console.log(JSON.stringify({ status: receipt.status, job: jobId, backend, S: verdict.S }))
