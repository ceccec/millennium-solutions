#!/usr/bin/env node
// Self-deploying development: the project ships itself — no runner, no strings attached.
//   npm run deploy pages     → build + publish the site to the gh-pages branch (GitHub auth)
//   npm run deploy packages  → publish the npm trinity (needs YOUR npm login; seal gate runs first)
import { execSync } from 'node:child_process'
import { apiAction } from './api.ts'
const run = (c) => execSync(c, { stdio: 'inherit' })
const cap = (c) => execSync(c, { encoding: 'utf8' }).trim()
const REPO = 'ceccec/millennium-solutions'
const target = (process.argv[2] || 'pages').toLowerCase()

if (target === 'pages') {
  console.log('deploy: pages → gh-pages → https://ceccec.github.io/millennium-solutions/')
  run('npm run docs:build')
  run('node scripts/import-gate.ts')  // block any third-party resource-import (deterministic, at the gate)
  run('node scripts/locale-fold.ts')  // language-fallback stubs → no dead switcher links
  run('npm run sitemap')   // emit the content-addressed sitemap mesh (100% coverage gate)
  run('node scripts/atom-feed.ts')    // emit the Atom feed (RFC 4287) of the monographs
  const remote = cap('git config --get remote.origin.url')
  // Publish dist via a throwaway repo: no hosted runner, no history pollution.
  run('cd .vitepress/dist'
    + ' && : > .nojekyll && git init -q && git checkout -q -b gh-pages && git add -A'
    + ' && git -c user.name="Tsvetan Rouschev" -c user.email="ceccec@psg.bg" commit -qm "deploy site"'
    + ' && git push -f ' + remote + ' gh-pages && rm -rf .git')
  // Ensure Pages serves the branch, then build it — each gh api ACTION uuid-stamped (apiAction records + seals it).
  const actions = [
    apiAction('pages-config', `gh api -X PUT repos/${REPO}/pages -f build_type=legacy -f 'source[branch]=gh-pages' -f 'source[path]=/'`),
    apiAction('pages-build', `gh api -X POST repos/${REPO}/pages/builds`),
  ]
  for (const a of actions) console.log(`  api ${a.kind} ${a.verdict.padEnd(7)} ${a.uuid.slice(0, 13)}  ${a.target}`)
  console.log('deploy: pages published — live in ~1 min at https://ceccec.psg.bg/millennium-solutions/')
} else if (target === 'packages') {
  console.log('deploy: packages → npm (prepublishOnly runs the 0/7 seal gate; needs npm login)')
  run('npm publish --access public') // one package: @ceccec/millennium-solutions
  console.log('deploy: packages published.')
} else {
  console.error('usage: npm run deploy [pages|packages]')
  process.exit(1)
}
