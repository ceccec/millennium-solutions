#!/usr/bin/env node
// A statement's UUID holds the core message ITSELF, without payload: uuid = toUuid(message). The
// RECEIPT is the payload — src/receipts/<uuid>.json = { uuid, message, agent, role, invites? } — and it
// proves only the OBSERVER and their ROLE, never the truth of the message. A claim may INVITE theorems
// (by key, from the discovery ledger) to back it: ungameable support — each invited theorem must hold
// (the audit re-verifies). Sentiment can be faked; a theorem cannot. A draining statement gets no
// receipt. Every receipt is SIGNED 2×7 (user, 2026-09-14): it carries `complies` and fourteen signatures, one per
// cell of the bidirectional seven-dimensional structure, each by a live ledger theorem — see scripts/receipt-2x7.ts.
// A receipt that cannot be signed in every cell is not written.
//   usage:  node scripts/receipt.ts "<agent>" "<role>" "<message>" ["key1,key2,…"]
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { toUuid } from '../src/0/index.ts'
import { computes } from './honesty-gate.ts'
import { COMPLIES, CELLS, sign } from './receipt-2x7.ts'

const [agent, role, message, invitesArg] = process.argv.slice(2)
if (!agent || !role || !message) { console.error('usage: receipt "<agent>" "<role>" "<message>" ["key1,key2,…"]'); process.exit(1) }
const invites = (invitesArg || '').split(',').map((s) => s.trim()).filter(Boolean)

const { binary, hit } = computes(message)
if (binary === 0) { console.error('✗ no receipt — the statement drains the gate ("' + hit + '"). Only floor-holding statements are recorded.'); process.exit(1) }

// Signing IS agreeing: recording a receipt is the observer's acknowledgment that they understand and
// comply with the law (the license + the sequence) before proceeding — part of the receipt itself.
const complies = COMPLIES

const uuid = toUuid(message) // the uuid IS the core message, without payload
const dir = 'src/receipts'
if (existsSync(dir + '/' + uuid + '.json')) { console.error('✗ no receipt — src/receipts/' + uuid + '.json already exists; a receipt is immutable and this message is already on the record.'); process.exit(1) }
let signatures
try { signatures = sign(uuid) } catch (e) { console.error('✗ no receipt — ' + (e as Error).message); process.exit(1) }
if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
const receipt: Record<string, unknown> = { uuid, message, agent, role, complies, signatures }
if (invites.length) receipt.invites = invites
writeFileSync(dir + '/' + uuid + '.json', JSON.stringify(receipt, null, 2) + '\n')
console.log('✓ receipt (signed 2×7 by ' + CELLS.length + ' live theorems — understands & complies with the license and the sequence): ' + agent + ' as ' + role + (invites.length ? ' · invites ' + invites.length + ' theorem(s)' : '') + ' → src/receipts/' + uuid + '.json')
