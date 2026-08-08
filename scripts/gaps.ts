#!/usr/bin/env node
// Harmony check: (1) every report() module fused into /compute; (2) every site page linked in nav/sidebar.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
const SKIP = new Set(['node_modules', '.git', 'dist', 'cache'])
const walk = (d, a = []) => { for (const n of readdirSync(d)) { const p = join(d, n); if (statSync(p).isDirectory()) { if (!SKIP.has(n)) walk(p, a) } else a.push(p) } return a }
let gaps = 0
// (1) fused compute modules
const compute = readFileSync('compute.md', 'utf8')
const mods = walk('src').filter(f => f.endsWith('.ts') && /export function report/.test(readFileSync(f, 'utf8')))
const om = mods.filter(m => !compute.includes(m.replace(/\.ts$/, '')))
console.log('report() modules:', mods.length, om.length ? '— GAP: ' + om.join(', ') : '✓ all fused')
gaps += om.length
// (2) site page coverage
const cfg = readFileSync('.vitepress/config.ts', 'utf8')
const EXCL = new Set(['README.md', 'DEPLOY.md'])
const rootMd = readdirSync('.').filter(f => f.endsWith('.md') && !EXCL.has(f))
const op = rootMd.filter(f => { const s = '/' + f.replace(/\.md$/, ''); const a = f === 'index.md' ? '/' : s; return !cfg.includes("'" + s + "'") && !cfg.includes("'" + a + "'") })
console.log('site pages:', rootMd.length, op.length ? '— GAP (unlinked): ' + op.join(', ') : '✓ all navigable')
gaps += op.length
// (3) per-digit coverage: every digit folder 0..9 carries at least one fused report() module
const covered = new Set(mods.map(m => (m.match(/^src\/(\d)\//) || [])[1]).filter(Boolean))
const missingDigits = ['0','1','2','3','4','5','6','7','8','9'].filter(d => !covered.has(d))
console.log('digit coverage:', (10 - missingDigits.length) + '/10', missingDigits.length ? '— GAP: digit(s) ' + missingDigits.join(',') + ' empty' : '✓ all digits developed')
gaps += missingDigits.length
// (4) sidebar coverage — every navigable page must ALSO be in the persistent sidebar (every reference linked,
// not just reachable from the nav dropdowns). This is the "ui is missing links" gap, now gated.
const sidebarBlock = (cfg.split(/\bsidebar\s*:/)[1] || '').split(/\bfooter\s*:/)[0]
const notInSidebar = rootMd.filter(f => { const s = '/' + f.replace(/\.md$/, ''); const a = f === 'index.md' ? '/' : s; return !sidebarBlock.includes("'" + s + "'") && !sidebarBlock.includes("'" + a + "'") })
console.log('sidebar coverage:', (rootMd.length - notInSidebar.length) + '/' + rootMd.length, notInSidebar.length ? '— GAP (not in sidebar): ' + notInSidebar.join(', ') : '✓ every reference linked in the sidebar')
gaps += notInSidebar.length
console.log(gaps === 0 ? '\n✓ no gaps — harmony holds' : '\n✗ ' + gaps + ' gap(s)')
process.exit(gaps === 0 ? 0 : 1)
