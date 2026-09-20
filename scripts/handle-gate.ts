#!/usr/bin/env node
/** ── HANDLE GATE — the short form must still route, and the message must still be enough ───────────────
 *
 *  Three things are checked, and they fail for different reasons, so they are reported apart.
 *
 *  1 · THE NO-PAYLOAD INVARIANT. Every receipt in `src/receipts/` must satisfy `toUuid(message) === uuid`,
 *      and its filename must be that uuid. That is what lets a handle and a message travel alone: the
 *      address is a function of the message, so nothing else has to be sent. If one receipt fails this,
 *      the claim is false for the whole scheme and the build stops.
 *
 *  2 · THE WINDOW IS NOT DEGRADED. `toUuid` forces the version and variant bits at bytes 6 and 8, which
 *      land at hex 12 and hex 16. A handle window overlapping either carries fewer than sixteen bits.
 *      This is arithmetic on the offset, not a statistic, so it is decided exactly rather than sampled.
 *
 *  3 · WHAT THE HANDLE ACTUALLY BUYS, RECOMPUTED. Collisions at the chosen width, the collision-free
 *      minimum, and the occupancy. REPORTED, NOT ENFORCED: the ledger grows, collisions grow with it, and
 *      that is the scheme working as described rather than breaking. Failing on it would turn an honest
 *      property into an alarm, and an alarm that fires on normal growth is one nobody reads. What would be
 *      dishonest is not measuring it, so it is measured every run and printed whether or not anyone looks. */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { toUuid } from '../src/0/index.ts'
import { HANDLE_HEX, HANDLE_OFFSET, handle, resolve } from '../src/handle/index.ts'
import { ledger } from '../src/api/index.ts'

let bad = 0
const fail = (m: string) => { console.log('  ✗ ' + m); bad++ }

// ── 1 · the no-payload invariant, over every signed receipt ─────────────────────────────────────────────
const DIR = 'src/receipts'
let checked = 0
if (!existsSync(DIR)) fail(`${DIR} is absent — the scheme's only evidence is the receipts`)
else for (const f of readdirSync(DIR).filter((x) => x.endsWith('.json'))) {
  const r = JSON.parse(readFileSync(`${DIR}/${f}`, 'utf8')) as { uuid?: string; message?: string }
  const named = f.replace(/\.json$/, '')
  if (!r.uuid || !r.message) { fail(`${f} carries no uuid or no message — a handle cannot resolve to it`); continue }
  if (r.uuid !== named) fail(`${f} is named ${named} but declares ${r.uuid} — the file name is the address or it is nothing`)
  const recomputed = toUuid(r.message)
  if (recomputed !== r.uuid) fail(`${f}: toUuid(message) is ${recomputed}, not ${r.uuid} — the message does NOT determine this address, so it cannot travel without a payload`)
  else {
    const h = handle(r.message)
    const back = resolve(h, r.message)
    if (!back.carries || back.uuid !== r.uuid) fail(`${f}: handle ${h} does not resolve back to its own message`)
    checked++
  }
}

// ── 2 · the window, decided by arithmetic ───────────────────────────────────────────────────────────────
// bytes[6] → hex 12, bytes[8] → hex 16. A window [o, o+w) overlapping either nibble position is degraded.
const FORCED_HEX = [12, 16]
const lo = HANDLE_OFFSET, hi = HANDLE_OFFSET + HANDLE_HEX
const overlaps = FORCED_HEX.filter((p) => p >= lo && p < hi)
if (overlaps.length) fail(`the handle window hex ${lo}..${hi} covers forced bit(s) at hex ${overlaps.join(', ')} — it carries fewer than ${HANDLE_HEX * 4} bits and the module claims otherwise`)

// A negative control has to be able to turn this red, so the same arithmetic is run over every window and
// the degraded ones are named. If this list is empty the check is not testing anything.
const degraded = [...Array(8).keys()].map((i) => i * 4).filter((o) => FORCED_HEX.some((p) => p >= o && p < o + 4))
if (!degraded.length) fail('no window was found to be degraded — this check cannot fail and is therefore not a check')

// ── 3 · what it buys, recomputed from the live ledger ───────────────────────────────────────────────────
const ids = ledger().map((e) => String(e.receipt).replace(/-/g, '')).filter(Boolean)
const bucketsAt = (n: number) => {
  const m = new Map<string, number>()
  for (const id of ids) { const k = id.slice(0, n); m.set(k, (m.get(k) ?? 0) + 1) }
  return m
}
const at = bucketsAt(HANDLE_HEX)
const dup = [...at.values()].filter((v) => v > 1)
let freeAt = 0
for (let n = HANDLE_HEX; n <= 32 && !freeAt; n++) if ([...bucketsAt(n).values()].every((v) => v === 1)) freeAt = n
const space = 16 ** HANDLE_HEX
const expected = (ids.length * ids.length) / (2 * space)

console.log(`  handle = hex ${lo}..${hi} of the address · ${HANDLE_HEX * 4} bits · ${space.toLocaleString('en')} buckets`)
console.log(`  no-payload invariant: ${checked} receipt(s) resolve from their message alone`)
console.log(`  degraded windows (forced version/variant bits): hex ${degraded.filter((o) => FORCED_HEX.some((p) => p >= o && p < o + 4)).map((o) => `${o}..${o + 4}`).join(', ')} — the chosen window is not one of them`)
console.log(`  over ${ids.length} sealed receipts: ${dup.length} collision(s) covering ${dup.reduce((a, b) => a + b, 0)} entries · largest bucket ${Math.max(...at.values())} · birthday expectation ${expected.toFixed(1)}`)
console.log(`  collision-free minimum today: ${freeAt} hex. A handle ROUTES and REJECTS; only the full address identifies, and nothing here proves anything true.`)

console.log(bad
  ? `\n✗ handle-gate: ${bad} finding(s) — a handle does not do what the module says it does`
  : `\n✓ handle-gate: the message determines the address for all ${checked} receipt(s); the window carries its full ${HANDLE_HEX * 4} bits`)
process.exit(bad ? 1 : 0)
