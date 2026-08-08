#!/usr/bin/env node
// Audit ANY prose or message, or decode-and-verify a uuid.
//   node scripts/verify.ts "<prose>"   → honesty gate + content-address + ledger check
//   node scripts/verify.ts "<uuid>"    → decode from the receipt ledger + verify content + gate
//
// A uuid is a ONE-WAY content-address: it CANNOT be reversed to its message (that would be breaking a
// hash — we do not). "Decode" therefore means look the uuid up in src/receipts/<uuid>.json (where the
// message was recorded) and VERIFY the content matches (toUuid(message) === uuid). No recorded receipt
// ⇒ the uuid stays opaque, honestly.
import { readFileSync, existsSync } from 'node:fs'
import { toUuid } from '../src/0/index.ts'
import { computes, RED, OVERREACH, PREDICT } from './honesty-gate.ts'

const arg = process.argv.slice(2).join(' ').trim()
if (!arg) { console.error('usage: verify "<prose | uuid>"'); process.exit(1) }

const statute = (hit: string) => RED.test(hit) ? 'RED' : PREDICT.test(hit) ? 'PREDICT' : new RegExp(OVERREACH.source, 'i').test(hit) ? 'OVERREACH' : 'gate'
const gateLine = (msg: string) => { const g = computes(msg); return '  honesty gate: computes ' + g.binary + (g.hit ? ' — DRAINS under ' + statute(g.hit) + ' ("' + g.hit + '")' : ' — holds the floor (0/7)') }

const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(arg)

if (isUuid) {
  // (1) agent-statement receipt — the payload names the observer + role; verify content matches.
  const path = 'src/receipts/' + arg + '.json'
  if (existsSync(path)) {
    const r = JSON.parse(readFileSync(path, 'utf8')) as { message: string; agent?: string; role?: string; invites?: string[] }
    const match = toUuid(r.message) === arg
    console.log('decoded (agent-statement receipt): "' + r.message + '"')
    console.log('  observer: ' + (r.agent || '?') + ' as ' + (r.role || '?') + (r.invites ? ' · invites ' + r.invites.length + ' theorem(s)' : ''))
    console.log('  content verify: toUuid(message) === uuid → ' + match)
    console.log(gateLine(r.message))
    process.exit(match && computes(r.message).binary === 1 ? 0 : 1)
  }
  // (2) discovery-ledger receipt — verify the chain-of-custody link (predecessor → key = receipt).
  const ledger: { key: string; name: string; receipt: string }[] = existsSync('src/proof/discovered.json') ? JSON.parse(readFileSync('src/proof/discovered.json', 'utf8')) : []
  const idx = ledger.findIndex((e) => e.receipt === arg)
  if (idx >= 0) {
    const e = ledger[idx]
    const pred = idx === 0 ? 'axiom:TRINITY' : ledger[idx - 1].receipt
    const linkOk = toUuid(pred + '→' + e.key) === e.receipt
    const GENESIS = new Set(['euler_units_pow6', 'units_sum_zero'])
    console.log('decoded (discovery ledger): fact "' + e.name + '"')
    console.log('  key: ' + e.key + ' · chain position ' + idx + ' of ' + ledger.length + (idx > 0 ? ' · after ' + ledger[idx - 1].key : ' · after the seed axiom:TRINITY'))
    console.log('  chain-of-custody: link ' + (linkOk ? 'INTACT' : GENESIS.has(e.key) ? 'genesis discontinuity (documented baseline)' : 'BROKEN — tamper (legal trial)'))
    process.exit(linkOk || GENESIS.has(e.key) ? 0 : 1)
  }
  // (3) neither ledger — a one-way address stays opaque, honestly.
  console.log('verify: uuid ' + arg.slice(0, 13) + '… is in neither the receipt ledger nor the discovery ledger.')
  console.log('  a one-way content-address cannot be reversed to its message; only a recorded receipt decodes it.')
  process.exit(1)
}

// prose / message
console.log('prose: "' + (arg.length > 90 ? arg.slice(0, 90) + '…' : arg) + '"')
console.log('  content-address: ' + toUuid(arg))
console.log(gateLine(arg))
console.log('  in ledger: ' + (existsSync('src/receipts/' + toUuid(arg) + '.json') ? 'yes — receipted' : 'no receipt yet'))
process.exit(computes(arg).binary === 1 ? 0 : 1)
