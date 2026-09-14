#!/usr/bin/env node
// Cross-check every agent-statement receipt in src/receipts/. The uuid holds the core message (no
// payload); the receipt is the payload, proving the observer and their role. Checks per receipt:
//   (1) uuid = toUuid(message)      — the uuid is the core message, no payload;
//   (2) file = <uuid>.json          — the filename is the uuid;
//   (3) message is a non-empty decoded string, and still holds the honesty gate (computes 1);
//   (4) agent + role present        — the payload names the observer and their role;
//   (5) every invited theorem still holds;
//   (6) `complies` names the current licence and the sequence;
//   (7) the 2×7 signature: one center at the receipt's own position and 2×7 apostilles around it, one from every
//       position — fifteen ledger theorems whose addresses fall where they stand, all distinct, every tag
//       recomputing: the center's from the receipt, an apostille's from the center (scripts/receipt-2x7.ts).
// A receipt that fails (1)–(5), or carries a signature that does not verify, is FALSE — a forgery or a regression.
// A receipt without (6)–(7) is INVALID: honest when written, but unsigned under the 2×7 rule (user, 2026-09-14:
// "the old receipts are invalid without the attributes"), and fatal by the user's choice. It cannot be re-signed —
// the same message is the same uuid is the same file — so it stays on disk as evidence. Either way the build fails.
// Integrity/provenance of observation, never authorship-proof or truth of the message.
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { toUuid, merkleFold } from '../src/0/index.ts'
import { computes } from './honesty-gate.ts'
import { CANDIDATES } from './discover.ts'
import { ledger as __ledger } from '../src/api/index.ts'
import { PER_POSITION, checkSignatures, type Signature } from './receipt-2x7.ts'

const byKey = new Map(CANDIDATES.map((c) => [c.key, c])) // for verifying invited theorems still hold
// A receipt is IMMUTABLE — rewriting one is tamper — so when a theorem it invited is later withdrawn, the
// receipt cannot be corrected and must not be called FALSE. FALSE means forgery: the uuid does not match its
// message, the filename lies, the observer is missing. That is a different accusation from "a claim this
// receipt referenced was withdrawn afterwards", and collapsing the two would either brand honest evidence as
// forged or teach the build to shrug at forgery. They are separated:
//   invited key live  + test true  → backing holds
//   invited key live  + test FALSE → FALSE (a standing theorem stopped holding — a real regression)
//   invited key absent             → FALSE (it invited something that never existed)
//   invited key REVOKED            → WITHDRAWN BACKING — reported and counted, never fatal, no remedy exists
const ledgerState = new Map(
  (__ledger() as { key: string; revoked?: boolean }[])
    .map((e) => [e.key, e.revoked === true]))
const dir = 'src/receipts'
let bad = 0
let stale = 0
let invalid = 0

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
  let r: { uuid?: string; message?: string; agent?: string; role?: string; invites?: string[]; complies?: string; signature?: Signature }
  try { r = JSON.parse(readFileSync(dir + '/' + f, 'utf8')) } catch { console.log('  ✗ FALSE ' + f + ' — unparseable'); bad++; continue }
  const c1 = typeof r.message === 'string' && r.uuid === toUuid(r.message) // uuid = core message, no payload
  const c2 = f === r.uuid + '.json'
  const c3 = typeof r.message === 'string' && r.message.length > 0 && computes(r.message).binary === 1
  const c4 = typeof r.agent === 'string' && r.agent.length > 0 && typeof r.role === 'string' && r.role.length > 0
  // c5 — every INVITED theorem must exist in the ledger AND still hold (ungameable backing).
  const withdrawn: string[] = []
  const broken: string[] = []
  for (const k of r.invites ?? []) {
    const t = byKey.get(k)
    let held = false
    try { held = !!t && t.test() === true } catch { held = false }
    if (held) continue
    if (ledgerState.get(k) === true) withdrawn.push(k)   // documented revocation — not the receipt's fault
    else broken.push(k)                                  // live-but-failing, or never existed
  }
  const c5 = broken.length === 0
  const ok = c1 && c2 && c3 && c4 && c5
  // c6, c7 — the 2×7 signature. A signature that does not verify is a forgery (FALSE); a receipt without the
  // attributes is INVALID. A signing theorem withdrawn after the receipt was written is WITHDRAWN BACKING, as above.
  const sig = checkSignatures(r)
  const back = r.invites && r.invites.length ? ' · backed by ' + r.invites.length + ' theorem(s)' : ''
  if (!ok || sig.forged.length) {
    console.log('  ✗ FALSE ' + f.slice(0, 18) + '… — uuid:' + c1 + ' name:' + c2 + ' floor:' + c3 + ' observer:' + c4 + (broken.length ? ' · invited but not standing: ' + broken.join(', ') : '') + (sig.forged.length ? ' · signature does not verify: ' + sig.forged.join('; ') : ''))
    bad++
  } else if (sig.unsigned.length) {
    console.log('  ✗ INVALID ' + f.slice(0, 18) + '…  ' + r.agent + ' as ' + r.role + ' — unsigned under the 2×7 rule: ' + sig.unsigned.join('; '))
    bad++
    invalid++
  } else if (withdrawn.length || sig.withdrawn.length) {
    const gone = [...withdrawn, ...sig.withdrawn]
    console.log('  · WITHDRAWN BACKING ' + f.slice(0, 18) + '…  ' + r.agent + ' as ' + r.role + ' — the receipt is authentic; ' + gone.length + ' theorem(s) it leaned on were withdrawn after it was written: ' + gone.join(', '))
    stale++
    roots.push(r.uuid!)
  } else {
    console.log('  ✓ ' + f.slice(0, 18) + '…  ' + r.agent + ' as ' + r.role + ' · signed by ' + PER_POSITION + ' live theorems (the center at ' + r.signature!.cell + ' and the 2×7 around it)' + back)
    roots.push(r.uuid!)
  }
}
const staleNote = stale ? '\n  · ' + stale + ' receipt(s) carry WITHDRAWN BACKING — authentic evidence whose invited theorems were later withdrawn. A receipt is immutable, so there is no remedy and none is pretended: the record says what it says, and what it leaned on is gone.' : ''
const falseN = bad - invalid - missing.length
console.log(bad
  ? '\n✗ ' + bad + ' receipt(s) fail of ' + files.length + ' — ' + falseN + ' FALSE (a forgery, a regression or a signature that does not verify) · ' + invalid + ' INVALID (unsigned under the 2×7 rule: no `complies` naming the current licence, or no center with the 2×7 around it)' + (missing.length ? ' · ' + missing.length + ' MISSING' : '') + staleNote
  : '\n✓ ' + files.length + ' receipt(s) cross-check and are signed 2×7 (uuid = core message · payload names observer + role · ' + PER_POSITION + ' live theorems each — a center and the 2×7 around it) → root ' + (roots.length ? merkleFold(roots).slice(0, 13) + '…' : 'none') + staleNote)
process.exit(bad ? 1 : 0)
