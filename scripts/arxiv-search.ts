#!/usr/bin/env node
// ARXIV-SEARCH — the arXiv export query for prior-art search, capable but refused without written permission.
//
//   npm run priorart:arxiv -- "<terms>"
//
// arXiv's robots.txt disallows every path of its export API for automated clients. This command does not query arXiv
// on that basis. It queries only when a written permission from arXiv is on file at evidence/arxiv-permission.json,
// naming who granted it, when, and the scope. With no such file it refuses, names the reason, and exits 2. The
// permission file is written by the person who obtained it from arXiv, never by this tool.
import { existsSync, readFileSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const PERMISSION = join(ROOT, 'evidence', 'arxiv-permission.json')
const terms = process.argv.slice(2).join(' ').trim()
if (!terms) {
  console.log(JSON.stringify({ status: 'NO TERMS', why: 'give the search terms after --' }, null, 1))
  process.exit(1)
}
if (!existsSync(PERMISSION)) {
  console.log(JSON.stringify({ status: 'REFUSED', why: 'no written permission from arXiv is on file at evidence/arxiv-permission.json; arXiv\'s robots.txt disallows its export API for automated clients, so nothing is queried' }, null, 1))
  process.exit(2)
}
const grant = JSON.parse(readFileSync(PERMISSION, 'utf8')) as { grantedBy?: string; grantedOn?: string; scope?: string }
if (!grant.grantedBy || !grant.grantedOn || !grant.scope) {
  console.log(JSON.stringify({ status: 'REFUSED', why: 'the permission file must name grantedBy, grantedOn, and scope' }, null, 1))
  process.exit(2)
}
// the permitted query, the same request the export API documents
const url = `https://export.arxiv.org/api/query?search_query=${encodeURIComponent(terms.split(/\s+/).map((t) => `all:${t}`).join(' AND '))}&max_results=5`
const res = await fetch(url, { headers: { 'user-agent': 'millennium-solutions-arxiv-search/1.0 (+https://ceccec.psg.bg)' } })
const text = await res.text()
const titles = [...text.matchAll(/<entry>[\s\S]*?<title>([\s\S]*?)<\/title>/g)].map((m) => m[1]!.replace(/\s+/g, ' ').trim())
console.log(JSON.stringify({ status: res.ok ? 'ANSWERED' : `HTTP ${res.status}`, permission: { grantedBy: grant.grantedBy, grantedOn: grant.grantedOn, scope: grant.scope }, hits: titles }, null, 1))
