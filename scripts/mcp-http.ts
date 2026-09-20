#!/usr/bin/env node
/** ── MCP OVER HTTP — the same tools, reachable from a browser ──────────────────────────────────────────
 *
 *  Captain's instruction: "let all be usable in browser mcp full featured". `scripts/mcp.ts` speaks
 *  JSON-RPC over stdio, which no browser can reach. This serves the SAME surface over HTTP: it imports
 *  TOOLS, LISTED and run from that module and restates nothing. Two transports over two copies of a tool
 *  table is two descriptions of one tool, and the copy nobody runs is the one that drifts.
 *
 *  WHY THIS IS NOT OPEN BY DEFAULT, said plainly rather than buried. These tools compile Lean, run git,
 *  fetch URLs and — four of them — WRITE to the ledger and the published pages. A browser-reachable
 *  endpoint on localhost is reachable by every page the user has open, because a website can POST to
 *  127.0.0.1. So three things hold at once, and removing any one of them makes this an open door:
 *
 *    · it binds to 127.0.0.1 and refuses to bind anywhere else without --host, which prints a warning;
 *    · every request must carry a bearer token minted fresh at startup and printed once to the console —
 *      a page that has not been told the token cannot call a tool, whatever origin it comes from;
 *    · the four WRITING tools are refused entirely unless --allow-write is passed, so the default surface
 *      changes nothing on disk no matter who reaches it.
 *
 *  Presenting this as "full featured" without those would be handing a stranger the deposit's own pen.
 *
 *  FLAGS ARE SPACE-SEPARATED, because `src/cli` reads the argv element AFTER the flag. This file first
 *  documented `--port=8791`, which that parser cannot see: it fell back to the default port, collided with
 *  a server already on it, and died with EADDRINUSE — a usage line that disagreed with the only parser in
 *  the tree. One convention, and it is the parser's.
 *
 *  usage:  node scripts/mcp-http.ts [--port 8787] [--allow-write] [--origin https://…] [--host …]
 *          GET  /mcp/tools   the tool list, for discovery (token required)
 *          POST /mcp         JSON-RPC 2.0: initialize · tools/list · tools/call */
import { createServer } from 'node:http'
import { randomBytes } from 'node:crypto'
import { TOOLS, LISTED, run, version } from './mcp.ts'
import { arg, flag, num } from '../src/cli/index.ts'

const PORT = num('--port', 8787)
const HOST = arg('--host') ?? '127.0.0.1'
const ALLOW_WRITE = flag('--allow-write')
const TOKEN = process.env.MCP_TOKEN || randomBytes(24).toString('hex')

// THE WRITERS, NAMED RATHER THAN GUESSED. A prefix rule ("anything called seal_*") would have let the next
// writing tool through by being named differently. These are the tools whose handlers change the tree.
const WRITES = new Set(['lean_seal', 'lean_generate', 'pages', 'ledger_trial'])

// An origin allowlist, not a wildcard. `*` plus a bearer token is survivable, but a page cannot read a
// response it is not allowed to read, and that is one more thing between a stray tab and the ledger.
const ORIGINS = new Set([`http://localhost:${PORT}`, `http://127.0.0.1:${PORT}`, ...(arg('--origin') ? [String(arg('--origin'))] : [])])

const json = (res: import('node:http').ServerResponse, code: number, body: unknown, origin?: string) => {
  res.writeHead(code, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
    ...(origin && ORIGINS.has(origin) ? { 'Access-Control-Allow-Origin': origin, 'Vary': 'Origin' } : {}),
  })
  res.end(JSON.stringify(body))
}

const authorised = (req: import('node:http').IncomingMessage) =>
  String(req.headers.authorization ?? '') === `Bearer ${TOKEN}`

const server = createServer((req, res) => {
  const origin = req.headers.origin ? String(req.headers.origin) : undefined
  if (req.method === 'OPTIONS') {
    res.writeHead(204, origin && ORIGINS.has(origin)
      ? { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Headers': 'authorization,content-type', 'Access-Control-Allow-Methods': 'POST,GET,OPTIONS', 'Vary': 'Origin' }
      : {})
    return res.end()
  }
  if (!authorised(req)) return json(res, 401, { error: 'a bearer token minted at startup is required — it is printed once to the console that started this server' }, origin)

  if (req.method === 'GET' && req.url?.startsWith('/mcp/tools')) {
    return json(res, 200, {
      server: 'millennium-solutions', version, writesAllowed: ALLOW_WRITE,
      tools: LISTED.map((t: { name: string; description: string }) => ({
        name: t.name, description: t.description, writes: WRITES.has(t.name),
        available: ALLOW_WRITE || !WRITES.has(t.name),
      })),
    }, origin)
  }
  if (req.method !== 'POST' || !req.url?.startsWith('/mcp')) return json(res, 404, { error: 'POST /mcp for JSON-RPC, GET /mcp/tools to discover' }, origin)

  let body = ''
  req.on('data', (c) => { body += c; if (body.length > 1_000_000) req.destroy() })
  req.on('end', async () => {
    let msg: { id?: unknown; method?: string; params?: { name?: string; arguments?: unknown } }
    try { msg = JSON.parse(body) } catch { return json(res, 400, { jsonrpc: '2.0', id: null, error: { code: -32700, message: 'parse error' } }, origin) }
    const { id, method, params } = msg
    const ok = (result: unknown) => json(res, 200, { jsonrpc: '2.0', id, result }, origin)
    const no = (code: number, message: string) => json(res, 200, { jsonrpc: '2.0', id, error: { code, message } }, origin)
    if (method === 'initialize') return ok({ protocolVersion: '2024-11-05', capabilities: { tools: {} }, serverInfo: { name: 'millennium-solutions', version } })
    if (method === 'notifications/initialized' || method === 'notifications/cancelled') return res.end()
    if (method === 'tools/list') return ok({ tools: LISTED.filter((t: { name: string }) => ALLOW_WRITE || !WRITES.has(t.name)) })
    if (method === 'tools/call') {
      const name = String(params?.name ?? '')
      // REFUSED, NOT SILENTLY SKIPPED. A writing tool that returns an empty result reads as "it did nothing
      // wrong"; a reader has to be told the server declined and why.
      if (WRITES.has(name) && !ALLOW_WRITE) return no(-32000, `${name} writes to this tree and this server was started read-only. Restart with --allow-write if that is what you intend.`)
      try { return ok({ content: [{ type: 'text', text: await run(name, params?.arguments ?? {}) }] }) }
      catch (e) { return no(-32603, (e as Error)?.message ?? 'error') }
    }
    if (id !== undefined) return no(-32601, 'method not found: ' + String(method))
    res.end()
  })
})

server.listen(PORT, HOST, () => {
  const writable = TOOLS.filter((t: { name: string }) => WRITES.has(t.name)).length
  console.log(`mcp-http ${version} — http://${HOST}:${PORT}/mcp`)
  console.log(`  ${LISTED.length} tool(s) declared · ${writable} of them write · writes ${ALLOW_WRITE ? 'ALLOWED (--allow-write)' : 'REFUSED (default)'}`)
  console.log(`  token: ${TOKEN}`)
  console.log(`  probe: curl -s -H "Authorization: Bearer ${TOKEN}" http://${HOST}:${PORT}/mcp/tools`)
  if (HOST !== '127.0.0.1' && HOST !== 'localhost') console.log(`  ⚠ bound to ${HOST}, not loopback — this is reachable from the network. The token is the only thing between it and anyone who can route to this machine.`)
})
