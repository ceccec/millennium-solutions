#!/usr/bin/env node
// ANSWER-VERIFY-ARXIV — a cited arXiv preprint is SOURCED only when its abstract page resolves to the stated title.
// It fetches the page through the repository's web_fetch (robots-respecting, keyless), and never asserts the citation.
//
//   node scripts/answer-verify-arxiv.ts math/0211159 "The entropy formula for the Ricci flow"
import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const [id, titleHead] = process.argv.slice(2)
if (!id || !titleHead) { console.log(JSON.stringify({ value: 'UNKNOWN', reason: 'no arXiv identifier or title given' })); process.exit(0) }
const url = `https://arxiv.org/abs/${id}`
const run = spawnSync('node', ['scripts/mcp-call.ts', 'web_fetch', JSON.stringify({ url, pattern: '\\[' + id.replace('/', '\\/') + '\\][^<]{0,240}', window: 0 })], { cwd: ROOT, encoding: 'utf8', timeout: 180_000, maxBuffer: 8 << 20 })
let fetched: { status?: string; passages?: string[] } = {}
try { fetched = JSON.parse(String(run.stdout)) } catch { /* UNPARSED below */ }
const resolvedTitle = (fetched.passages ?? []).find((p) => p.includes(titleHead)) ?? null
if (fetched.status !== 'FETCHED' || !resolvedTitle) {
  console.log(JSON.stringify({ value: 'UNKNOWN', reason: `arXiv:${id} did not resolve to a record with the stated title (status ${fetched.status ?? 'UNPARSED'})` }))
  process.exit(0)
}
console.log(JSON.stringify({ value: 'SOURCED', reason: 'cited source resolves to the stated title; evidence, not a proof of the statement', certificate: { type: 'C3', arxiv: id, record: resolvedTitle.slice(0, 240) } }))
