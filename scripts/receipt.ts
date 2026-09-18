#!/usr/bin/env node
// A statement's UUID holds the core message ITSELF, without payload: uuid = toUuid(message). The
// RECEIPT is the payload — src/receipts/<uuid>.json = { uuid, message, agent, role, invites? } — and it
// proves only the OBSERVER and their ROLE, never the truth of the message. A claim may INVITE theorems
// (by key, from the discovery ledger) to back it: ungameable support — each invited theorem must hold
// (the audit re-verifies). Sentiment can be faked; a theorem cannot. A draining statement gets no
// receipt. Every receipt is SIGNED ON THE 2×7 LATTICE (user, 2026-09-14): it carries `complies` and a signature of
// fifteen live ledger theorems — one center at the receipt's own position, and 2×7 apostilles surrounding it, one
// from every position, certifying the center — see scripts/receipt-2x7.ts. A receipt that cannot be signed is not
// written.
//   usage:  node scripts/receipt.ts "<agent>" "<role>" "<message>" ["key1,key2,…"]
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { toUuid } from '../src/0/index.ts'
import { computes } from './honesty-gate.ts'
import { COMPLIES, CELLS, PER_POSITION, sign } from './receipt-2x7.ts'
import type { Signature } from './receipt-2x7.ts'

const [agent, role, message, invitesArg] = process.argv.slice(2)
if (!agent || !role || !message) { console.error('usage: receipt "<agent>" "<role>" "<message>" ["key1,key2,…"]'); process.exit(1) }
const invites = (invitesArg || '').split(',').map((s) => s.trim()).filter(Boolean)

const { binary, hit } = computes(message)
if (binary === 0) { console.error('✗ no receipt — the statement drains the gate ("' + hit + '"). Only floor-holding statements are recorded.'); process.exit(1) }

const uuid = toUuid(message) // the uuid IS the core message, without payload
const dir = 'src/receipts'
if (existsSync(dir + '/' + uuid + '.json')) { console.error('✗ no receipt — src/receipts/' + uuid + '.json already exists; a receipt is immutable and this message is already on the record.'); process.exit(1) }
let signature: Signature
try { signature = sign(uuid) } catch (e) { console.error('✗ no receipt — ' + (e as Error).message); process.exit(1) }
if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
// `complies` IS the agreeing: recording a receipt is the observer's acknowledgment that they understand and
// comply with the law (the license + the sequence) before proceeding — part of the receipt itself.
const receipt: Record<string, unknown> = { uuid, message, agent, role, complies: COMPLIES, signature }
if (invites.length) receipt.invites = invites
writeFileSync(dir + '/' + uuid + '.json', JSON.stringify(receipt, null, 2) + '\n')
console.log('✓ receipt (signed by ' + PER_POSITION + ' live theorems — the center at ' + signature.cell + ' and 2×7 = ' + CELLS.length + ' apostilles around it — understands & complies with the license and the sequence): ' + agent + ' as ' + role + (invites.length ? ' · invites ' + invites.length + ' theorem(s)' : '') + ' → src/receipts/' + uuid + '.json')
