#!/usr/bin/env node
// THEOREM-ONLY-CHECK — every runtime test is a violation. A property the repository claims must be a Lean theorem the
// kernel checks; a test runs the code once on sampled inputs and says nothing about the rest.
//
//   node scripts/theorem-only-check.ts [repo ...]     defaults to millennium-solutions and qpu
//
// A runtime test is a file that imports a test framework (node:test, vitest, jest), or whose name ends in .test.* or
// .spec.*, or that calls describe/it/test/expect/assert at the top level. There is no exceptions list: a violation is a
// violation. Each one is reported with the replacement this check requires: state the property as a Lean theorem over its
// finite domain, closed by `decide`, and delete the runtime test. The check exits 1 when any violation is found.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, relative } from 'node:path'
import { passedBefore, recordPasses } from './verified-cache.ts'
import { CI_ONLY_SCRIPTS } from '../src/ci-only.ts'
import { leanTheorems } from '../src/api/index.ts'

const DEFAULT = [join(homedir(), 'github', 'ceccec', 'millennium-solutions'), join(homedir(), 'github', 'uuidna', 'qpu')]
const repos = process.argv.length > 2 ? process.argv.slice(2).map((r) => r.replace(/^~/, homedir())) : DEFAULT

// Generated output is not source: build bundles are skipped by name, and nothing else is.
const SKIP = new Set(['node_modules', 'dist', '.git', '.lake', '.claude', '.vitepress', '.next', '.open-next', '.wrangler', '.vercel', 'build', 'coverage'])
const walk = (dir: string): string[] => readdirSync(dir).flatMap((e) => {
  if (SKIP.has(e)) return []
  const p = join(dir, e)
  if (statSync(p).isDirectory()) return walk(p)
  return /\.(ts|tsx|js|mjs|cjs)$/.test(e) ? [p] : []
})

const IMPORT_FRAMEWORK = /(?:from\s+|require\(\s*|import\(\s*)['"](?:node:test|vitest|jest)['"]/
const TOP_CALL = /^(?:describe|it|test|expect|assert)\s*\(|^\s*(?:assert|expect)\.[a-zA-Z]+\s*\(/m

type Violation = { repo: string; file: string; reason: string; replacement: string }
const violations: Violation[] = []
const ciOnly: string[] = []

for (const repo of repos) {
  let files: string[]
  try { files = walk(repo) } catch { continue }
  const passes: { path: string; text: string }[] = []
  for (const file of files) {
    const text = readFileSync(file, 'utf8')
    // A file that passed before, unchanged, is not checked again. A failure is never cached, so it is always checked.
    if (passedBefore('theorem-only@1', relative(repo, file), text)) continue
    const name = file.split('/').pop() ?? ''
    // named as a test: x.test.ts, x.spec.ts, x-test.ts, or an end-to-end file (x-e2e.ts, x.e2e.spec.ts)
    const scriptName = name.replace(/\.(ts|mjs|js)$/, '')
    if (CI_ONLY_SCRIPTS.includes(scriptName as never) && file.includes('/scripts/')) { ciOnly.push(relative(repo, file)); continue }
    const byName = /(\.|-)(test|spec|e2e)(\.|-|$)|\.(test|spec|e2e)\.[a-z]+$/.test(name)
    const byImport = IMPORT_FRAMEWORK.test(text)
    const byCall = TOP_CALL.test(text)
    if (!byName && !byImport && !byCall) { passes.push({ path: relative(repo, file), text }); continue }
    const reason = [byName && 'named as a test', byImport && 'imports a test framework', byCall && 'calls test functions'].filter(Boolean).join('; ')
    violations.push({
      repo: repo.split('/').pop() ?? repo,
      file: relative(repo, file),
      reason,
      replacement: 'state the property as a Lean theorem over its finite domain, closed by decide; delete this runtime test',
    })
  }
  recordPasses('theorem-only@1', passes)
}

if (ciOnly.length) console.log(`· CI-only, run in CI and not gated here (${ciOnly.length}): ${ciOnly.join(', ')}`)
// CANDIDATES, NOT VERDICTS. A flagged test is named after its subject (answer-route-test, mcp-e2e), so the Lean
// theorems whose name or file shares a word of that subject are listed as the first places to look for a proof that
// already exists. A candidate is a lead for a human to read; the court does not decide that it replaces the test.
const SUBJECT = (file: string): string[] => file.replace(/\.(ts|mjs|js)$/, '').split(/[-._]/).filter((w) => w.length >= 5 && !['test', 'tests', 'spec', 'e2e', 'check', 'scripts'].includes(w))
const theorems = (() => { try { return leanTheorems() as { name: string; file: string }[] } catch { return [] } })()
const candidates = (file: string): string[] => {
  const words = SUBJECT(file.split('/').pop() ?? file)
  if (!words.length) return []
  return theorems.filter((t) => words.some((w) => t.name.includes(w) || t.file.includes(w))).slice(0, 5).map((t) => t.file + ':' + t.name)
}
for (const v of violations) {
  console.log(`✗ ${v.repo}/${v.file} — ${v.reason}\n    fix: ${v.replacement}`)
  const found = candidates(v.file)
  console.log(found.length ? `    candidate proofs already in the tree (lead, not verdict):\n      ${found.join('\n      ')}` : "    candidate proofs already in the tree: none share this subject's words")
}
const byRepo = repos.map((r) => `${r.split('/').pop()} ${violations.filter((v) => v.repo === (r.split('/').pop() ?? '')).length}`).join(', ')
console.log(`\n${violations.length === 0 ? '✓' : '✗'} theorem-only-check: ${violations.length} runtime test(s) — ${byRepo}`)
process.exit(violations.length === 0 ? 0 : 1)
