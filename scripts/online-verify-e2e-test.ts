#!/usr/bin/env node
// ONLINE VERIFY E2E — the online checks, called through the MCP client, must return the verdicts they are meant to.
// Each case calls one tool in a client session (scripts/mcp-call.ts) and asserts its answer. It reaches live services,
// so it is a network suite: it checks what the services say today, not a stored answer.
//
//   node scripts/online-verify-e2e-test.ts
import { spawnSync } from 'node:child_process'

const call = (tool: string, args: object) => {
  const r = spawnSync('node', ['scripts/mcp-call.ts', tool, JSON.stringify(args)], { encoding: 'utf8', timeout: 300_000 })
  return { code: r.status, out: r.stdout ?? '' }
}

const cases: { name: string; tool: string; args: object; check: (out: string) => boolean }[] = [
  { name: 'arXiv record verifies as SOURCED, with its title',
    tool: 'answer_verify_arxiv', args: { id: '2108.04902', title: 'Counting Rocks! An Introduction to Combinatorics' },
    check: (o) => /"value":"SOURCED"/.test(o) },
  { name: 'web search returns hits for a known title',
    tool: 'web_search', args: { source: 'arxiv', query: 'Counting Rocks combinatorics', limit: 2 },
    check: (o) => /"title"/.test(o) },
  { name: 'OpenAlex names the arXiv DOI for the same work',
    tool: 'web_search', args: { source: 'openalex', query: 'Counting Rocks An Introduction to Combinatorics Adams', limit: 3 },
    check: (o) => o.includes('10.48550/arxiv.2108.04902') },
]

// The DOI tools, each through the MCP client: the verifier on the canonical DOI and on a non-canonical one, the two DOI
// suites, and the OpenAlex search that returns DOIs.
const CANONICAL_DOI = '10.5281/zenodo.21819217'
cases.push(
  { name: 'DOI verifier: the canonical DOI is SOURCED, from its registry record',
    tool: 'answer_verify_doi', args: { doi: CANONICAL_DOI },
    check: (o) => /"value": "SOURCED"/.test(o) },
  { name: 'DOI verifier: a DOI for another work is UNKNOWN, and names the record it found',
    tool: 'answer_verify_doi', args: { doi: '10.1038/nature14539' },
    check: (o) => /"value": "UNKNOWN"/.test(o) && o.includes('Deep learning') },
  { name: 'DOI suite answer-doi passes',
    tool: 'run_suite', args: { suite: 'answer-doi' },
    check: (o) => /"status":\s*"PASS"/.test(o) },
  { name: 'DOI suite doi-precedence passes',
    tool: 'run_suite', args: { suite: 'doi-precedence' },
    check: (o) => /"status":\s*"PASS"/.test(o) },
)

let bad = 0
for (const c of cases) {
  const { code, out } = call(c.tool, c.args)
  const ok = code === 0 && c.check(out)
  if (!ok) bad++
  console.log(`${ok ? '✓' : '✗'} ${c.name}${ok ? '' : `  (exit ${code}: ${out.slice(0, 160).replace(/\s+/g, ' ')})`}`)
}
console.log(bad ? `✗ online-verify-e2e: ${bad} of ${cases.length} failed` : `✓ online-verify-e2e: ${cases.length} of ${cases.length} online checks returned the expected answer`)
process.exit(bad ? 1 : 0)
