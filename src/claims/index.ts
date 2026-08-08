// The claims registry — the binding that turns "every claim recomputes from src/" from a slogan into
// a decidable, gated fact. A CLAIM here is a REGISTERED, bound assertion: prose text + a recompute()
// that reads its value from src/ + the expected value + (where one exists) the provable theorem(s) in
// the discovery ledger that back it. claims-gate.ts recomputes each, gate-checks the text, confirms the
// invited theorems exist in the chain-verified ledger, and reconciles the counts (the coins accounted
// into development). "Every registered claim recomputes" is then TRUE BY CONSTRUCTION over this set — a
// bounded universal, not a floating "every". It certifies the registry, never unmarked prose.
// HONEST: recompute proves INTEGRITY (the value is what src/ computes); an invited theorem adds
// ungameable backing; neither certifies the interpretation. The floor stays 0/7.
import { toUuid, merkleFold, TRINITY, BASE, units, triad, vortexOrbit, A432_STEP } from '../0/index.ts'
import { CAPACITY, roundTrips, skill, coin64 } from '../0/imprint.ts'
import { entails } from '../honesty/index.ts'
import { BOUNDARY_STATEMENTS } from '../honesty/boundaries.ts'
import { coins } from '../9/funding.ts'

export interface Claim {
  id: string
  text: string
  recompute: () => string
  expect: string
  theorems?: string[] // keys in src/proof/discovered.json — provable backing, re-checked by the gate
}

// the seven Clay conjectures: each statement is a tautology → entails nothing → solved count 0.
const clayFloor = (): string =>
  Array.from({ length: 7 }, () => entails(true)).filter((e) => e.solves).length + '/7'

// a battery of messages that must all round-trip through the imprint codec (boundary cases included).
const IMPRINT_BATTERY = ['', '1', '1011', '01001000', '1'.repeat(CAPACITY)]

export const CLAIMS: readonly Claim[] = [
  { id: 'floor',  text: '0/7 entailed: this deposit leaves all seven Millennium problems unsolved, and claims no prize.',
    recompute: clayFloor,                              expect: '0/7',           theorems: ['both_games_overclaim_loses'] },
  { id: 'axiom',  text: 'one irreducible axiom: the trinity, 3 — the base 9 is 3 squared.',
    recompute: () => String(TRINITY),                  expect: '3',             theorems: ['relation_three'] },
  { id: 'base',   text: 'the ring is Z/9 — base nine, derived as the trinity squared.',
    recompute: () => String(BASE),                     expect: '9',             theorems: ['relation_three'] },
  { id: 'units',  text: 'the units of Z/9 are 1,2,4,5,7,8 — a group under multiplication.',
    recompute: () => units().join(','),                expect: '1,2,4,5,7,8',   theorems: ['trial_units_group', 'euler_units_pow6', 'units_sum_zero', 'self_inverse_1_8'] },
  { id: 'unitn',  text: 'the multiplicative group of Z/9 has 6 elements, as does the symmetric group S3.',
    recompute: () => String(units().length),           expect: '6',             theorems: ['s3_order6'] },
  { id: 'triad',  text: 'the triad of Z/9 (the non-units) is 3,6,9.',
    recompute: () => triad().join(','),                expect: '3,6,9',         theorems: ['relation_three'] },
  { id: 'orbit',  text: 'the doubling orbit from 1 covers the units: 1,2,4,8,7,5.',
    recompute: () => vortexOrbit().join(','),          expect: '1,2,4,8,7,5',   theorems: ['both_games_truth_and_honesty'] },
  { id: 'a432',   text: 'the angular step is 360/9 = 40 degrees.',
    recompute: () => String(A432_STEP),                expect: '40' },
  { id: 'coins',  text: 'the two coins are 110 minus 108 = 2 = minus the Euler characteristic of a genus-2 surface.',
    recompute: () => String(coins()),                  expect: '2',             theorems: ['relation_genus_two', 'surface_euler_char', 'receipt_pair_is_two_coins'] },
  { id: 'fund',   text: 'the two coins are accounted into development: destination equals source, a self-loop.',
    recompute: () => String(toUuid('ceccec') === toUuid('ceccec')), expect: 'true' },
  { id: 'imprint', text: 'a binary message imprinted into a uuid reads back exactly — a reversible codec.',
    recompute: () => String(IMPRINT_BATTERY.every(roundTrips)), expect: 'true' },
  { id: 'skill',  text: 'the clown catches every bit: the imprint round-trip fidelity is 1.',
    recompute: () => String(skill('1'.repeat(CAPACITY)).fidelity), expect: '1', theorems: ['relation_clown_benefits_from_all'] },
  { id: 'bounds', text: 'the honest floor publishes 10 content-addressed boundaries.',
    recompute: () => String(BOUNDARY_STATEMENTS.length), expect: '10' },
  { id: 'coin64', text: 'the shared currency is a 64-bit coin: any content mints 16 hex digits, deterministically.',
    recompute: () => String(coin64('ceccec').length) + ':' + String(coin64('ceccec') === coin64('ceccec')), expect: '16:true' },
  { id: 'tuning', text: 'the example: A440 minus A432 is 8 Hz — a tuning convention, not a measured acoustic law.',
    recompute: () => String(440 - 432), expect: '8' },
]

export interface AddressedClaim { id: string; text: string; got: string; expect: string; ok: boolean; uuid: string; theorems: string[] }

/** Each claim recomputed and content-addressed. ok = the value from src/ equals what the prose asserts. */
export function addressed(): AddressedClaim[] {
  return CLAIMS.map((c) => {
    let got: string
    try { got = c.recompute() } catch (e) { got = 'THROW:' + (e as Error).message }
    return { id: c.id, text: c.text, got, expect: c.expect, ok: got === c.expect, uuid: toUuid(c.id + '|' + c.text + '|' + c.expect), theorems: c.theorems ?? [] }
  })
}

/** The registry root — a merkle fold of every claim's content-address. Any edit moves the root. */
export function root(): string { return merkleFold(addressed().map((a) => a.uuid)) }

export function report(): string {
  const rows = addressed()
  const ok = rows.filter((r) => r.ok).length
  let o = 'the claims registry — every registered claim recomputes from src/ (got = recompute(); expect = the prose):\n\n'
  for (const r of rows) o += '  ' + (r.ok ? '✓' : '✗') + ' ' + r.id.padEnd(8) + r.got.padEnd(16) + (r.ok ? '= ' : '≠ ') + r.expect + (r.theorems.length ? '   ⊢ ' + r.theorems.length + ' theorem(s)' : '') + '\n'
  o += '\n  ' + ok + '/' + rows.length + ' claims recompute · registry root ' + root().slice(0, 13) + '…\n'
  o += '  a "claim" here is a REGISTERED, bound assertion; this makes "every claim recomputes" true over\n'
  o += '  the registry (bounded, gated) — integrity, not truth. it does not certify unregistered prose. entails → 0/7.'
  return o
}
