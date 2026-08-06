#!/usr/bin/env node
// Self-deploying development: the project ships itself.
//   npm run deploy pages     → build + publish the VitePress site to GitHub Pages (GitHub auth)
//   npm run deploy packages  → publish the npm trinity (needs YOUR npm login; seal gate runs first)
import { execSync } from 'node:child_process'
const run = (c) => execSync(c, { stdio: 'inherit' })
const REPO = 'ceccec/millennium-solutions'
const target = (process.argv[2] || 'pages').toLowerCase()

if (target === 'pages') {
  console.log('deploy: pages → GitHub Pages (https://ceccec.github.io/millennium-solutions/)')
  // Enable Pages (Actions build) — idempotent: create, else update build_type.
  try { run(`gh api -X POST repos/${REPO}/pages -f build_type=workflow`) }
  catch { try { run(`gh api -X PUT repos/${REPO}/pages -f build_type=workflow`) } catch {} }
  // The workflow lives on main; push then run it (push alone also triggers it).
  run('git push origin main --tags')
  try { run('gh workflow run deploy.yml') } catch { console.log('(dispatch skipped — the push already triggered the workflow)') }
  console.log('deploy: dispatched — watch: gh run list --workflow=deploy.yml')
} else if (target === 'packages') {
  console.log('deploy: packages → npm (prepublishOnly runs the 0/7 seal gate; needs npm login)')
  run('npm publish --workspaces --access public')
  run('npm publish --access public')
  console.log('deploy: packages published.')
} else {
  console.error('usage: npm run deploy [pages|packages]')
  process.exit(1)
}
