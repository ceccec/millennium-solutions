#!/usr/bin/env node
// MCP-CALL — call one tool of the development MCP server and print its answer. This replaces the hand-written
// JSON-RPC pipelines that were copied, edited, and re-typed for every check in a session.
//
//   node scripts/mcp-call.ts <tool> ['<json arguments>']
//   node scripts/mcp-call.ts connect '{"connector":"qpu","tool":"data","arguments":{"source":"ask","about":"Planck constant"}}'
//
// It runs one session: initialize, then one tools/call of `call_tool` with { name, arguments }, then prints the text
// of the result. The arguments are parsed as JSON before anything is sent, so a malformed call fails here with a
// message, not as a silent empty answer from the server.
import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const [tool, rawArgs = '{}'] = process.argv.slice(2)
if (!tool) {
  console.error('usage: mcp-call.ts <tool> [json arguments]')
  process.exit(2)
}

let args: unknown
try {
  args = JSON.parse(rawArgs)
} catch (e) {
  console.error(`arguments are not JSON: ${String(e)}`)
  process.exit(2)
}

const messages = [
  { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'mcp-call', version: '1' } } },
  { jsonrpc: '2.0', method: 'notifications/initialized' },
  { jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'call_tool', arguments: { name: tool, arguments: args } } },
]
const out = spawnSync('node', ['scripts/mcp.ts'], { cwd: ROOT, input: messages.map((m) => JSON.stringify(m)).join('\n') + '\n', encoding: 'utf8', timeout: 900_000, maxBuffer: 8 << 20 /* 8 MB: kept to the Pravets 8M client budget */ })

let answered = false
for (const line of String(out.stdout).split('\n').filter(Boolean)) {
  const j = JSON.parse(line) as { id?: number; result?: { content?: { text: string }[]; isError?: boolean }; error?: unknown }
  if (j.id !== 2) continue
  if (j.error || !j.result?.content?.[0]) {
    console.error(`no answer: ${JSON.stringify(j.error ?? j.result)}`)
    process.exit(1)
  }
  // EXIT ONLY AFTER THE WRITE IS FLUSHED. On a pipe, process.exit() right after console.log drops everything past the
  // 64 KB pipe buffer: a 4.8 MB reply arrived as 65,240 characters. The exit code waits for the write to finish.
  process.stdout.write(j.result.content[0].text + '\n', () => process.exit(j.result.isError ? 1 : 0))
  answered = true
  break
}
if (!answered) {
  console.error(`no response from the server (exit ${out.status}): ${String(out.stderr).slice(0, 300)}`)
  process.exit(1)
}
