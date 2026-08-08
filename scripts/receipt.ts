#!/usr/bin/env node
// A statement's UUID holds the core message ITSELF, without payload: uuid = toUuid(message). The
// RECEIPT is the payload — src/receipts/<uuid>.json = { uuid, message, agent, role } — and it proves
// only the (superposition) OBSERVER and their ROLE, never the truth of the message. Provenance of
// observation, not authorship-proof (no key). A statement that DRAINS the gate gets no receipt.
//   usage:  node scripts/receipt.ts "<agent>" "<role>" "<message>"
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { toUuid } from '../src/0/index.ts'
import { computes } from './honesty-gate.ts'

const [agent, role, ...rest] = process.argv.slice(2)
const message = rest.join(' ').trim()
if (!agent || !role || !message) { console.error('usage: receipt "<agent>" "<role>" "<message>"'); process.exit(1) }

const { binary, hit } = computes(message)
if (binary === 0) { console.error('✗ no receipt — the statement drains the gate ("' + hit + '"). Only floor-holding statements are recorded.'); process.exit(1) }

const uuid = toUuid(message) // the uuid IS the core message, without payload
const dir = 'src/receipts'
if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
writeFileSync(dir + '/' + uuid + '.json', JSON.stringify({ uuid, message, agent, role }, null, 2) + '\n')
console.log('✓ receipt (payload): ' + agent + ' as ' + role + ' → src/receipts/' + uuid + '.json')
