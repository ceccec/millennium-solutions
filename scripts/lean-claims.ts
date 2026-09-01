#!/usr/bin/env node
// Independently verify the ARITHMETIC each Lean theorem (Vortex.lean) asserts — recomputed here,
// no Lean toolchain needed. Fills a real gap: CI can't run `lake build`, but it can confirm the
// facts are true. Feeds trust in the formal layer; fails loudly if any claim stops being true.
import { toUuid, units, triad, vortexOrbit, merkleFold, digitalRoot, digits } from '../src/0/index.ts'
import { readFileSync, existsSync } from 'node:fs'
import { CANDIDATES } from './discover.ts'
import { ledger as __ledger, orbit } from '../src/api/index.ts'

// REVOKED ENTRIES ARE NOT LIVE CLAIMS. The ledger is append-only and its receipts are immutable, so an entry
// that no longer holds is marked in place rather than deleted — deleting would break the chain, and rewriting
// a receipt is TAMPER. A marked entry stays in the record with the reason it went, and is skipped here.
const isLive = (e: { revoked?: boolean }) => !e.revoked
const m9 = (n) => ((n % 9n) + 9n) % 9n, m7 = (n) => ((n % 7n) + 7n) % 7n
let fail = 0
const receipts = []
// each theorem proves itself (recomputed here) and leaves a receipt; the suite folds to one root.
const ck = (name, cond) => { console.log((cond ? '  ✓ ' : '  ✗ FALSE ') + name); if (!cond) fail++; receipts.push(toUuid(name + ':' + cond)) }

ck('three_sq_zero: 3²≡0 mod9', m9(9n) === 0n)
ck('six_sq_zero: 6²≡0 mod9', m9(36n) === 0n)
ck('three_no_inverse mod9', !digits().some(x => m9(3n * BigInt(x)) === 1n))
ck('two_mul_five: 2·5≡1 mod9', m9(10n) === 1n)
ck('four_mul_seven: 4·7≡1 mod9', m9(28n) === 1n)
ck('eight_self_inv: 8·8≡1 mod9', m9(64n) === 1n)
{ let s = [], x = 1n; for (let k = 0; k < 6; k++) { s.push((x % 9n).toString()); x = (x * 2n) % 9n } ck('doubling_circuit orbit()', s.join(',') === '1,2,4,8,7,5') }
ck('two_order_six: 2⁶≡1 mod9', m9(64n) === 1n)
ck('tens_complement involutive (d≤10)', [...Array(11).keys()].every(d => 10 - (10 - d) === d))
ck('rosette_pow_six: 3⁶≡1 mod7', m7(729n) === 1n)
{ let s = []; for (let k = 1; k <= 6; k++) s.push((m7(3n ** BigInt(k))).toString()); ck('rosette_orbit [3,2,6,4,5,1]', s.join(',') === '3,2,6,4,5,1') }
ck('k432: 432 = 2⁴·3³ = 16·27', 432 === 2 ** 4 * 3 ** 3 && 432 === 16 * 27)
ck('doubling_digit_sum: 1+2+4+8+7+5=27', 1 + 2 + 4 + 8 + 7 + 5 === 27)
{ const caps = [2,4,2,6,2,4,8,4,6,2,10,8,6,4,2,12,10,8,6,4,2,14], t = (n) => caps.slice(0, n).reduce((a, b) => a + b, 0)
  ck('magic 2/8/20/28/50/82/126', t(1)===2 && t(3)===8 && t(6)===20 && t(7)===28 && t(11)===50 && t(16)===82 && t(22)===126) }
ck('proton_fit: 108·17=1836', 108 * 17 === 1836)
ck('fit_not_ratio: 1836 ≠ 1836.1527 (formal layer refuses the overclaim)', 1836 !== 18361527 / 10000)
ck('self_seal product = 1', (1/2)*(1/2)*(1/2)*(8/7)*(7/5)*(5/3)*(1/2)*(2/3)*9 === 1)

// Theorem A — the doubling orbit is a permutation of the units of ℤ/9, covers each once, and closes.
ck('vortex_covers_units (bijection onto units)', JSON.stringify([...vortexOrbit()].sort((a, b) => a - b)) === JSON.stringify(units()))
ck('vortex_closes (last·2 mod9 = first)', (vortexOrbit()[vortexOrbit().length - 1] * 2) % 9 === vortexOrbit()[0])
ck('triad_off_circuit {3,6,9}', triad().every(d => !vortexOrbit().includes(d)))
// Theorem B — merkleFold is order-independent: every permutation of a set folds to one root (exhaustive, 5! = 120).
{ const perm = (a) => a.length <= 1 ? [a] : a.flatMap((x, i) => perm([...a.slice(0, i), ...a.slice(i + 1)]).map(p => [x, ...p]))
  ck('merkle_order_independent (120 perms → 1 root)', new Set(perm(['a', 'b', 'c', 'd', 'e']).map(p => merkleFold(p))).size === 1) }
// Theorem — every prime p > 3 has its digital root in the units, never the triad (p coprime to 3 ⇒ p mod 9 ∈ units).
{ const primes = [5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]
  ck('primes_gt3_ride_units', primes.every(p => units().includes(digitalRoot(p)))) }
// discovered by scripts/discover.ts, promoted here to prove themselves in code:
ck('euler_units_pow6: every unit u⁶≡1 mod9 (φ(9)=6)', units().every(u => m9(BigInt(u) ** 6n) === 1n))
ck('units_sum_zero: 1+2+4+5+7+8 ≡ 0 mod9', m9(BigInt(units().reduce((a, b) => a + b, 0))) === 0n)
ck('self_inverse_only_1_and_8: d²≡1 ⇔ d∈{1,8}', digits().filter(d => m9(BigInt(d) * BigInt(d)) === 1n).join(',') === '1,8')
// "each discovers the next" — a linked derivation chain from the ℤ/9 axiom: each receipt is seeded by
// the previous, so the chain is tamper-evident (falsify any link ⇒ every downstream receipt changes).
{ const link = (prev, name, d) => toUuid((prev || 'axiom') + '→' + name + ':' + JSON.stringify(d))
  const r1 = link(null, 'axiom', 'n→2n'), r2 = link(r1, 'orbit', vortexOrbit()), r3 = link(r2, 'coverage', units())
  const tampered = link(r1, 'orbit', [9, 9, 9]) // a falsified step 2
  ck('discovery_chain tamper-evident (falsified link ⇒ downstream differs)', tampered !== r2 && link(tampered, 'coverage', units()) !== r3) }

// HARDEN — re-verify EVERY recorded discovery on each build: each ledgered key must still be a live
// candidate AND still hold. A discovery that silently regresses (or an author's error, like the earlier
// Cassini sign) fails here, not in production. This makes the ledger continuously proven, not just appended.
{
  const LEDGER = 'src/proof/discovered.json'
  const all: { key: string; revoked?: boolean }[] = existsSync(LEDGER) ? __ledger() : []
  const ledger = all.filter(isLive)
  const byKey = new Map(CANDIDATES.map((c) => [c.key, c]))
  // A Lean-sealed entry has no TypeScript candidate: its proof is the Lean file, checked by scripts/lean.ts.
  // Absence of a candidate is therefore not a regression for those; it is for anything else.
  const bad = ledger.filter((e) => { const c = byKey.get(e.key); return e.key.startsWith('lean_') ? false : (!c || !c.test()) })
  ck('ledger re-verifies: all ' + ledger.length + ' live discoveries still hold (' + (all.length - ledger.length) + ' revoked in place, skipped)', bad.length === 0)
  if (bad.length) console.log('    regressed: ' + bad.slice(0, 5).map((b) => b.key).join(', '))
}

const root = merkleFold(receipts)
console.log(fail
  ? '\n✗ ' + fail + ' of ' + receipts.length + ' theorem(s) FALSE — the suite does not self-prove'
  : '\n✓ all ' + receipts.length + ' theorems prove themselves (independently recomputed) → receipt ' + root)
process.exit(fail ? 1 : 0)
