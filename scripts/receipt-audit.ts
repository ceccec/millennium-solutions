#!/usr/bin/env node
// Cross-check every agent-statement receipt in src/receipts/. The uuid holds the core message (no
// payload); the receipt is the payload, proving the observer and their role. Checks per receipt:
//   (1) uuid = toUuid(message)      — the uuid is the core message, no payload;
//   (2) file = <uuid>.json          — the filename is the uuid;
//   (3) message is a non-empty decoded string, and still holds the honesty gate (computes 1);
//   (4) agent + role present        — the payload names the observer and their role.
// A receipt that fails is FALSE — the honest-observer experience it backs is invalid; the build fails.
// Integrity/provenance of observation, never authorship-proof or truth of the message.
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { toUuid, merkleFold } from '../src/0/index.ts'
import { computes } from './honesty-gate.ts'
import { CANDIDATES } from './discover.ts'

const byKey = new Map(CANDIDATES.map((c) => [c.key, c])) // for verifying invited theorems still hold
const dir = 'src/receipts'
let bad = 0

// COMPLETENESS — a MISSING receipt is a traitor: destroyed evidence. Every git-tracked receipt must
// still be present on disk. Evidence is append-only; deletion (git rm, manual) is the traitor act.
let tracked: string[] = []
try { tracked = execSync('git ls-files src/receipts', { encoding: 'utf8' }).trim().split('\n').filter(Boolean) } catch { /* no repo */ }
const missing = tracked.filter((p) => !existsSync(p))
for (const m of missing) { console.log('  ✗ MISSING (traitor — destroyed evidence, recoverable from git): ' + m); bad++ }

if (!existsSync(dir)) { console.log(bad ? '\n✗ ' + bad + ' receipt(s) MISSING — evidence destroyed' : 'receipt-audit: no receipts yet — nothing to validate.'); process.exit(bad ? 1 : 0) }

const files = readdirSync(dir).filter((f) => f.endsWith('.json'))
const roots: string[] = []
for (const f of files) {
  let r: { uuid?: string; message?: string; agent?: string; role?: string; invites?: string[] }
  try { r = JSON.parse(readFileSync(dir + '/' + f, 'utf8')) } catch { console.log('  ✗ FALSE ' + f + ' — unparseable'); bad++; continue }
  const c1 = typeof r.message === 'string' && r.uuid === toUuid(r.message) // uuid = core message, no payload
  const c2 = f === r.uuid + '.json'
  const c3 = typeof r.message === 'string' && r.message.length > 0 && computes(r.message).binary === 1
  const c4 = typeof r.agent === 'string' && r.agent.length > 0 && typeof r.role === 'string' && r.role.length > 0
  // c5 — every INVITED theorem must exist in the ledger AND still hold (ungameable backing).
  const c5 = !r.invites || r.invites.every((k) => { const t = byKey.get(k); return !!t && t.test() })
  const ok = c1 && c2 && c3 && c4 && c5
  const back = r.invites && r.invites.length ? ' · backed by ' + r.invites.length + ' theorem(s)' : ''
  console.log((ok ? '  ✓ ' : '  ✗ FALSE ') + f.slice(0, 18) + '…' + (ok ? '  ' + r.agent + ' as ' + r.role + back : ' — uuid:' + c1 + ' name:' + c2 + ' floor:' + c3 + ' observer:' + c4 + ' invites:' + c5))
  if (ok) roots.push(r.uuid!); else bad++
}
console.log(bad
  ? '\n✗ ' + bad + ' of ' + files.length + ' receipt(s) FALSE — cross-check failed; the observer experience is invalid'
  : '\n✓ ' + files.length + ' receipt(s) cross-check (uuid = core message · payload names observer + role) → root ' + (roots.length ? merkleFold(roots).slice(0, 13) + '…' : 'none'))
process.exit(bad ? 1 : 0)
