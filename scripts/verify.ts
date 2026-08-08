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
  const path = 'src/receipts/' + arg + '.json'
  if (!existsSync(path)) {
    console.log('verify: uuid ' + arg.slice(0, 13) + '… is not in the receipt ledger.')
    console.log('  a one-way content-address cannot be reversed to its message; only a recorded receipt decodes it.')
    process.exit(1)
  }
  const r = JSON.parse(readFileSync(path, 'utf8')) as { message: string; agent?: string; role?: string; invites?: string[] }
  const match = toUuid(r.message) === arg
  console.log('decoded (from the ledger): "' + r.message + '"')
  console.log('  observer: ' + (r.agent || '?') + ' as ' + (r.role || '?') + (r.invites ? ' · invites ' + r.invites.length + ' theorem(s)' : ''))
  console.log('  content verify: toUuid(message) === uuid → ' + match)
  console.log(gateLine(r.message))
  process.exit(match && computes(r.message).binary === 1 ? 0 : 1)
}

// prose / message
console.log('prose: "' + (arg.length > 90 ? arg.slice(0, 90) + '…' : arg) + '"')
console.log('  content-address: ' + toUuid(arg))
console.log(gateLine(arg))
console.log('  in ledger: ' + (existsSync('src/receipts/' + toUuid(arg) + '.json') ? 'yes — receipted' : 'no receipt yet'))
process.exit(computes(arg).binary === 1 ? 0 : 1)
