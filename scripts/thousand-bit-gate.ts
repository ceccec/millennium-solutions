#!/usr/bin/env node
// THOUSAND-BIT GATE — the factor route on a 1,000-bit integer, checked by its own arithmetic. Hard fail unless green.
//
//   npm run gate:thousand
//
// GREEN means a full factorisation, and three things hold, each checkable without trusting the route's own status word:
//   1 · the integer is 1,000 bits long (it is a real thousand-bit input, not a shorter one)
//   2 · the factors found, multiplied by the cofactor, give the integer exactly (the decomposition is an identity)
//   3 · the cofactor the route reports as composite is composite by a witness this script recomputes
// A PARTIAL answer is RED: it is an honest account, and the gate does not accept an account in place of a factorisation.
import { factor, millerRabin } from '../src/crypto/factor/index.ts'
import { randomBytes } from 'node:crypto'
import { execFileSync } from 'node:child_process'

// ── VERIFY DECODING THE THOUSAND BIT, WITH EACH PUSH (ordered 2026-11-02) ────────────────────────────────────
// qpu.uuidna.com mints an impossible integer — a semiprime N = p·q of a thousand bits with its σ-reflection
// witness, the centre (p + q)/2 — and decodes it by the witness in one reflection. Its claim is not taken: N and
// the witness go back through the door WITHOUT p and q, and what comes back is checked here — the factors
// multiplied, each tested prime by this tree's millerRabin, the bit width read. Three states, never two:
//   ✓ VERIFIED (0)      the unit's decoding reproduces N from primes at the width it claims
//   ✗ FALSE CLAIM (1)   a factor that does not multiply back, or is not prime — a violation, and it fails the chain
//   ○ NOT MEASURED (2)  the unit did not answer, or does not serve the door yet (the served unit lags local main
//                       1.4.0, whose algorithm door answers `factor`; the served one lists qft … shor) — never read
//                       as green, never as a defect in this tree
// `npm run cycle:ship` runs this after its push and its CI watch. `--from <path>` exercises a local unit's handler
// by argument instead of the served door — an instrument check, not a chain step.
if (process.argv.includes('--decode')) {
  const want = 1000
  const fromIdx = process.argv.indexOf('--from')
  const VIA = new Set<string>()
  type Answer = Record<string, unknown> & { integer?: string; witness?: string; bits?: number; factors?: string[]; decoded?: boolean; receipt?: string; address?: string }
  const ask = async (args: Record<string, unknown>): Promise<{ ok: true; a: Answer } | { ok: false; why: string }> => {
    if (fromIdx > 0) {
      const { handle } = await import(process.argv[fromIdx + 1] + '/src/quantum/processing/mcp.ts') as { handle: (m: unknown) => { result?: { content?: { text?: string }[] }; error?: unknown } }
      const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'algorithm', arguments: args } })
      const t = r?.result?.content?.[0]?.text
      if (!t) return { ok: false, why: 'the local unit returned no text: ' + JSON.stringify(r?.error ?? r).slice(0, 160) }
      return { ok: true, a: JSON.parse(t) as Answer }
    }
    let out = ''
    try { out = execFileSync('node', ['scripts/mcp-call.ts', 'connect', JSON.stringify({ connector: 'qpu', tool: 'algorithm', arguments: args })], { encoding: 'utf8', timeout: 240_000, maxBuffer: 16 << 20 }) }
    catch (e) { return { ok: false, why: 'the connector did not answer: ' + String((e as { message?: string }).message ?? e).slice(0, 160) } }
    let j: { status?: string; why?: string; via?: string; served?: { status?: string; why?: string }; answer?: { result?: { content?: { text?: string }[] } } }
    try { j = JSON.parse(out) } catch { return { ok: false, why: 'the connector answered something that is not JSON: ' + out.slice(0, 160) } }
    if (j.status !== 'ANSWERED') return { ok: false, why: /not one of/.test(j.why ?? '') ? `the served unit's algorithm door does not serve \`factor\` yet (${(j.why ?? '').slice(0, 120)}) — local main 1.4.0 does; the deploy is pending` : `${j.status ?? 'no status'}: ${(j.why ?? '').slice(0, 160)}` }
    const t = j.answer?.result?.content?.[0]?.text
    if (!t) return { ok: false, why: 'the door answered without a text body' }
    // where the answer came from is part of the reading: the served door, or the source at its sha with the served verdict beside it
    VIA.add(j.via ? `${j.via} (served: ${j.served?.status ?? 'NOT ASKED'} — ${(j.served?.why ?? '').slice(0, 60)})` : 'the served door')
    try { return { ok: true, a: JSON.parse(t) as Answer } } catch { return { ok: false, why: 'the door\'s text is not JSON: ' + t.slice(0, 160) } }
  }
  // the door mints from the caller's entropy (it is pure and cached by call address, so it draws none): 256 bits drawn
  // here as a decimal string — never a constant, never the same mint twice
  const seed = BigInt('0x' + randomBytes(32).toString('hex')).toString()
  const made = await ask({ name: 'factor', create: { bits: want, seed } })
  if (!made.ok) { console.log(`○ thousand-bit decode: NOT MEASURED — ${made.why}`); process.exit(2) }
  if (!made.a.integer || !made.a.witness) { console.log('○ thousand-bit decode: NOT MEASURED — the unit minted no integer/witness pair: ' + JSON.stringify(made.a).slice(0, 160)); process.exit(2) }
  const dec = await ask({ name: 'factor', integer: made.a.integer, witness: made.a.witness })
  if (!dec.ok) { console.log(`○ thousand-bit decode: NOT MEASURED — minted, but the decode did not answer: ${dec.why}`); process.exit(2) }
  const N = BigInt(made.a.integer), fs = (dec.a.factors ?? []).map((f) => BigInt(f)), bits = N.toString(2).length
  const prod = fs.reduce((x, y) => x * y, 1n)
  const primality = fs.map((f) => millerRabin(f))
  const faults: string[] = []
  if (fs.length < 2) faults.push(`${fs.length} factor(s) returned — a decoding is at least two`)
  if (prod !== N) faults.push('the factors do not multiply back to N')
  if (primality.some((p) => p !== 'PRIME')) faults.push('a returned factor is not prime by this tree\'s test: ' + primality.join(','))
  if (bits < want) faults.push(`N is ${bits} bits, below the ${want} asked for`)
  if (dec.a.decoded === false) faults.push('the unit itself says decoded: false')
  if (faults.length) { console.log(`✗ thousand-bit decode: FALSE CLAIM — ${faults.join('; ')} (receipt ${String(dec.a.receipt ?? '').slice(0, 13)}…)`); process.exit(1) }
  console.log(`✓ thousand-bit decode: VERIFIED via ${[...VIA].join(' · ') || 'the local unit'} — a ${bits}-bit N decoded by its witness into ${fs.length} primes that multiply back; checked here, not taken (address ${String(dec.a.address ?? '').slice(0, 13)}…, receipt ${String(dec.a.receipt ?? '').slice(0, 13)}…)`)
  process.exit(0)
}

const N = '7778374705630928901426385188295261064472293439767584450564762904780095317247810822721038446598127186814085438745846911396600071001374809981225413367649417301928427872874705586838153932355802114527488924178998304307438276447053410282371888984822745504021147881223973035161036008037727897669611699130903'


// CONTROL, SO THE GATE IS SHOWN TO FAIL AND TO PASS. The same decomposition logic runs on 91 (which must be FACTORED and
// green) and on 2^1000 − 1 (which must be PARTIAL and red). If the logic were broken in either direction, the control fails.
if (process.argv.includes('--control')) {
  const judge = (x: bigint) => {
    const res = factor(x.toString())
    if (res.status !== 'FACTORED') return 'RED'
    const prod = res.factors.reduce((acc, f) => acc * BigInt(f), 1n)
    return prod === x ? 'GREEN' : 'RED'
  }
  const greenOn91 = judge(91n) === 'GREEN'
  const redOnPower = judge(2n ** 1000n - 1n) === 'RED'
  if (greenOn91 && redOnPower) { console.log('✓ thousand-bit gate control: passes on 91 (GREEN) and fails on 2^1000−1 (RED), as it must'); process.exit(0) }
  console.log(`✗ thousand-bit gate control: 91 green=${greenOn91}, 2^1000−1 red=${redOnPower}`); process.exit(1)
}

const n = BigInt(N)
const bits = n.toString(2).length
const r = factor(N)
const failures: string[] = []

if (bits !== 1000) failures.push(`the test integer is ${bits} bits, not 1000`)
// THE GATE REQUIRES A FULL FACTORISATION. A PARTIAL answer, however honest, is not green: the test is red until every factor
// of this integer is known and checked. A green result here would need factors this tree has not computed.
if (r.status !== 'FACTORED') failures.push(`the route returns ${r.status}, not FACTORED: no full factorisation of this 1000-bit integer exists in this tree`)
if (r.status === 'REFUSED') failures.push(`the route refused a valid integer: ${r.why}`)
else if (r.status === 'FACTORED') {
  const prod = r.factors.reduce((acc, f) => acc * BigInt(f), 1n)
  if (prod !== n) failures.push('the factors do not multiply to the integer')
} else {
  const prod = r.factors.reduce((acc, f) => acc * BigInt(f), 1n) * BigInt(r.cofactor)
  if (prod !== n) failures.push('the factors times the cofactor do not give the integer')
  if (r.cofactorPrimality === 'composite (a witness was found)' && millerRabin(BigInt(r.cofactor)) !== 'COMPOSITE') {
    failures.push('the route calls the cofactor composite, and the recomputed test does not')
  }
}

// DISCOVERY, WHEN RED. The gate does not stop at "red": it names every tool in the catalogue that touches factorisation,
// what each one can contribute, and what would turn the gate green. Nothing here computes a factor that the gate would accept.
import { existsSync } from 'node:fs'
import { TOOLS } from '../src/mcp/index.ts'
const discovered = TOOLS.filter((t) => /factor|prime|shor|verify/i.test(t.name)).map((t) => t.name)
const suppliedFile = 'evidence/thousand-bit/factors.json'
if (failures.length) {
  console.log('✗ thousand-bit gate: RED')
  for (const f of failures) console.log(`    · ${f}`)
  console.log('  discovered tools that touch factorisation:')
  for (const name of discovered) {
    const role = name === 'factor' ? 'computes factors; returns PARTIAL for this integer'
      : name === 'factor_verify' ? 'checks a supplied factorisation; VERIFIED would turn the gate green'
      : name.includes('shor') ? 'the QPU Shor tool; not run here: its state vector is about 2^1000 entries'
      : 'factorisation-related; not a source of a full factorisation for this integer'
    console.log(`    · ${name}: ${role}`)
  }
  console.log('  checked sources: FactorDB has no factors for this integer (recorded earlier, 2026)')
  console.log(existsSync(suppliedFile)
    ? `  supplied factorisation found at ${suppliedFile}: check it with factor_verify`
    : `  missing: a full factorisation at ${suppliedFile}, which factor_verify must report VERIFIED`)
  process.exit(1)
}
console.log(`✓ thousand-bit gate: GREEN — ${bits} bits; status ${r.status}; the decomposition is an identity; the composite claim is recomputed.`)
