#!/usr/bin/env node
// Minimal MCP (Model Context Protocol) stdio server — exposes the deposit's honest tools to LLM clients.
// DEPENDENCY-FREE by design: implements JSON-RPC 2.0 over stdio with node built-ins only (no
// @modelcontextprotocol/sdk), preserving the zero-dep-core. Tools inherit the discipline: the honesty
// gate returns a FLOOR (not a truth oracle), content-address = integrity (not encryption/proof).
import { createInterface } from 'node:readline'
import { execSync } from 'node:child_process'
import { toUuid, merkleFold } from '../src/0/index.ts'
import { computes } from './honesty-gate.ts'

const version = (() => { try { return execSync('git tag --sort=version:refname', { encoding: 'utf8' }).trim().split('\n').pop() || 'v0' } catch { return 'v0' } })()
const send = (m: unknown) => process.stdout.write(JSON.stringify(m) + '\n')
const reply = (id: unknown, result: unknown) => send({ jsonrpc: '2.0', id, result })
const fail = (id: unknown, code: number, message: string) => send({ jsonrpc: '2.0', id, error: { code, message } })

const TOOLS = [
  { name: 'content_address', description: 'Content-address (uuid) any text — INTEGRITY/provenance, NOT encryption or proof.',
    inputSchema: { type: 'object', properties: { text: { type: 'string' } }, required: ['text'] } },
  { name: 'honesty_gate', description: 'Run the honesty gate: binary 1 (no named overclaim) or 0 (drains) + the hit. A lexical FLOOR, not a truth oracle; passing != true.',
    inputSchema: { type: 'object', properties: { text: { type: 'string' } }, required: ['text'] } },
  { name: 'merkle_fold', description: 'Order-independent merkle fold of a list of strings into one address.',
    inputSchema: { type: 'object', properties: { items: { type: 'array', items: { type: 'string' } } }, required: ['items'] } },
]

const run = (name: string, a: any): string => {
  if (name === 'content_address') return toUuid(String(a.text))
  if (name === 'honesty_gate') { const r = computes(String(a.text)); return JSON.stringify({ binary: r.binary, hit: r.hit, note: r.binary ? 'no overclaim shape (floor, not truth)' : 'drains: ' + r.hit }) }
  if (name === 'merkle_fold') return merkleFold((a.items || []).map(String))
  throw new Error('unknown tool: ' + name)
}

createInterface({ input: process.stdin }).on('line', (line) => {
  let msg: any; try { msg = JSON.parse(line) } catch { return }
  const { id, method, params } = msg
  if (method === 'initialize') return reply(id, { protocolVersion: '2024-11-05', capabilities: { tools: {} }, serverInfo: { name: 'millennium-solutions', version } })
  if (method === 'notifications/initialized' || method === 'notifications/cancelled') return
  if (method === 'tools/list') return reply(id, { tools: TOOLS })
  if (method === 'tools/call') {
    try { return reply(id, { content: [{ type: 'text', text: run(params?.name, params?.arguments || {}) }] }) }
    catch (e: any) { return fail(id, -32603, e?.message || 'error') }
  }
  if (id !== undefined) fail(id, -32601, 'method not found: ' + method)
})
