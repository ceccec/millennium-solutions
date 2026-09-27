#!/usr/bin/env node
/** ── THE PUBLISHED MCP ENTRY POINT ─────────────────────────────────────────────────────────────────────────
 *
 *  Runs the self-sufficient tool subset over stdio, from the package alone: no clone, no account, no key, no
 *  model, no network. `src/mcp/serve.ts` decides which tools and records why it is six of twenty-five.
 *
 *  THE TRANSPORT IS HERE AND THE COMPUTATION IS THERE, and the split is not stylistic. tsconfig.dist.json
 *  compiles the published surface with no node type definitions, because nothing in the core reaches a node
 *  builtin — so the moment the stdio loop sat inside src/mcp/serve.ts the build refused it. This file is the
 *  only one in the published surface that knows it is a process, which keeps the boundary checkable: if a
 *  module under src/ ever needs `process`, the dist build says so instead of a reviewer having to notice. */
import { createInterface } from 'node:readline'
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { run, served, withLedger, type Row } from './src/mcp/serve.ts'

// ── THE LEDGER IS LOADED HERE, BECAUSE ONLY HERE MAY READ A FILE ─────────────────────────────────────────
// The four evidence tools measure the discovery ledger and the package did not ship it, which put the
// deposit's own evidence in the one place a stranger could not examine. It ships now, beside this file, and
// the reading happens here: src/mcp/serve.ts is compiled without node type definitions, which is the standing
// check that nothing in the published core reaches a node builtin. Resolved against THIS FILE's directory and
// not the working directory — a server started from somewhere else is the normal case for MCP, and a relative
// path would have found the ledger only when the caller happened to be standing in the right folder.
const here = dirname(fileURLToPath(import.meta.url))
for (const p of [join(here, 'data', 'discovered.json'), join(here, '..', 'src', 'proof', 'discovered.json')]) {
  if (!existsSync(p)) continue
  try { withLedger(JSON.parse(readFileSync(p, 'utf8')) as Row[]); break }
  catch { /* a ledger that does not parse is an absent ledger, and the tools say absent rather than zero */ }
}

const send = (m: unknown) => process.stdout.write(JSON.stringify(m) + '\n')
const rl = createInterface({ input: process.stdin })

rl.on('line', (line: string) => {
  if (!line.trim()) return
  let id: unknown = null
  try {
    const req = JSON.parse(line) as { id?: unknown; method?: string; params?: { name?: unknown; arguments?: unknown } }
    id = req.id ?? null
    const ok = (result: unknown) => send({ jsonrpc: '2.0', id, result })
    if (req.method === 'initialize') {
      return ok({ protocolVersion: '2024-11-05', capabilities: { tools: {} },
        serverInfo: { name: 'millennium-solutions (self-sufficient entry)', version: 'from the published package' } })
    }
    if (req.method === 'tools/list') {
      return ok({ tools: [
        { name: 'list_tools', description: 'What this entry serves, and what each tool it does not serve needs instead.', inputSchema: { type: 'object', properties: { name: { type: 'string' } } } },
        { name: 'call_tool', description: 'Call one of the served tools.', inputSchema: { type: 'object', properties: { name: { type: 'string', enum: served() }, arguments: { type: 'object' } }, required: ['name'] } },
      ] })
    }
    if (req.method === 'tools/call') {
      return ok({ content: [{ type: 'text', text: run(String(req.params?.name ?? ''), req.params?.arguments ?? {}) }] })
    }
    if (req.method?.startsWith('notifications/')) return
    send({ jsonrpc: '2.0', id, error: { code: -32601, message: `method not found: ${String(req.method)}` } })
  } catch (e) {
    send({ jsonrpc: '2.0', id, error: { code: -32603, message: e instanceof Error ? e.message : String(e) } })
  }
})
