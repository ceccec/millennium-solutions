#!/usr/bin/env node
// DEPLOY E2E — the deploy path, tested end-to-end, WITHOUT publishing.
//
// A tag that ships while `npm run deploy:pages` is still red is an invalid ship. This script runs every
// step deploy.ts runs before the gh-pages push — including `docs:build` (which runs theorem-stamp + e2e) —
// and refuses if any step fails. Wired into pre-commit and pre-push via gate-parallel; `next` must pass
// it BEFORE orchestrate/tag. Publishing stays in deploy.ts; proving the site can deploy is this file.
//
//   node scripts/deploy-path.ts
//   npm run deploy:e2e
import { execSync } from 'node:child_process'
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const run = (c: string) => execSync(c, { stdio: 'inherit' })

console.log('deploy-e2e: proving the deploy path (build + e2e + deploy gates) — no publish')

// Fast refuse: unquoted YAML titles with `:` break VitePress (the v9.9.6 deploy failure). Catch before the build.
const scanMatter = (dir: string) => {
  if (!existsSync(dir)) return [] as string[]
  const bad: string[] = []
  for (const name of readdirSync(dir)) {
    if (!name.endsWith('.md')) continue
    const p = join(dir, name)
    const text = readFileSync(p, 'utf8')
    if (!text.startsWith('---\n')) continue
    const end = text.indexOf('\n---\n', 4)
    if (end < 0) continue
    for (const line of text.slice(4, end).split('\n')) {
      if (!line.startsWith('title:')) continue
      const v = line.slice(6).trimStart()
      const quoted = (v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))
      if (!quoted && v.includes(':')) bad.push(`${p}: unquoted title contains ':' — quote it for VitePress frontmatter`)
    }
  }
  return bad
}
const matterBad = [...scanMatter('paper'), ...scanMatter('AXIOMS')]
if (matterBad.length) {
  console.log(`✗ deploy-e2e: ${matterBad.length} frontmatter title(s) would break docs:build:`)
  for (const b of matterBad.slice(0, 12)) console.log(`    ${b}`)
  process.exit(1)
}
// --matter-only: the gates-fire control exercises this refuse without a full docs:build.
if (process.argv.includes('--matter-only')) {
  console.log('✓ deploy-e2e --matter-only: frontmatter titles are deploy-safe')
  process.exit(0)
}

// Same prelude deploy.ts runs before the build.
run('node scripts/dashboard.ts')
run('node scripts/boundaries.ts')
run('node scripts/challenges.ts')
run('node scripts/heart.ts')
run('node scripts/accounting.ts')
// docs:build = vitepress build + theorem-stamp + e2e (package.json)
run('npm run docs:build')
run('node scripts/import-gate.ts')
run('node scripts/locale-fold.ts')
run('node scripts/security-gate.ts')
run('npm run sitemap')
run('node scripts/atom-feed.ts')

console.log('✓ deploy-e2e: deploy path green (build + e2e + deploy gates) — safe to tag/push/publish')
