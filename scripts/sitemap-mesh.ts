#!/usr/bin/env node
// The sitemap MESH — each built path becomes a node carrying its own content-address
// plus its neighbor links (holographic: each node sees itself and its edges); all nodes
// fold to one mesh root. 100% coverage is COMPUTED and TESTABLE: every built page is a
// node (by construction), and every internal link must resolve to a known node.
import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { toUuid, merkleFold } from '../src/0/index.ts'

const DIST = '.vitepress/dist'
const BASE = '/millennium-solutions/'

const htmls: string[] = []
;(function walk(d: string) { for (const n of readdirSync(d)) { const p = join(d, n); if (statSync(p).isDirectory()) walk(p); else if (n.endsWith('.html')) htmls.push(p) } })(DIST)

const routeOf = (file: string) =>
  BASE + relative(DIST, file).split(sep).join('/').replace(/index\.html$/, '').replace(/\.html$/, '')
const titleOf = (html: string) => (html.match(/<title>([^<]*)<\/title>/i)?.[1] || '').replace(/\s*\|.*$/, '').trim()
const norm = (p: string) => p.replace(/\/$/, '') || BASE.replace(/\/$/, '')
const linksOf = (html: string) => {
  const out = new Set<string>()
  for (const m of html.matchAll(/href="([^"#?]+)/g)) {
    const h = m[1]
    if (/^https?:|^mailto:|\.(css|js|png|svg|ico|xml|json|webmanifest|txt|woff2?|ttf|eot|gif|jpe?g|webp|avif)$/i.test(h)) continue
    if (h.startsWith(BASE)) out.add(h.replace(/index\.html$/, '').replace(/\.html$/, ''))
  }
  return [...out]
}

const nodes = htmls.sort().map((f) => {
  const html = readFileSync(f, 'utf8')
  const path = routeOf(f)
  return { path, title: titleOf(html), address: toUuid(path + ':' + html), links: linksOf(html) }
})
const known = new Set(nodes.map((n) => norm(n.path)))

let edges = 0, resolved = 0
const broken: string[] = []
for (const n of nodes) for (const l of n.links) { edges++; if (known.has(norm(l))) resolved++; else broken.push(n.path + ' → ' + l) }
const linkPct = edges ? (resolved / edges) * 100 : 100
const root = merkleFold(nodes.map((n) => n.address))

// Recursive view: each path returns its own subtree (a sitemap of its branch); the whole
// nests into one tree — "sitemap recursively". The flat `nodes` above stay the coverage gate.
type TreeNode = { path: string; title?: string; address?: string; children: Record<string, TreeNode> }
const tree: TreeNode = { path: BASE, children: {} }
for (const n of nodes) {
  const rel = n.path.slice(BASE.length).replace(/\/$/, '') // '', 'bg', 'bg/DEVELOP', 'compute'
  let cur = tree, acc = BASE
  for (const seg of rel ? rel.split('/') : []) {
    acc += seg + '/'
    cur.children[seg] ??= { path: acc.replace(/\/$/, ''), children: {} }
    cur = cur.children[seg]
  }
  cur.title = n.title; cur.address = n.address // attach this node's data at its own depth
}

const mesh = {
  scope: 'the sitemap mesh — each path a node (self-address + neighbor links); all fold to one root',
  base: BASE, count: nodes.length, root,
  coverage: { pages: '100% (every built page is a node)', links: linkPct.toFixed(1) + '%', edges, resolved },
  nodes,
  tree, // recursive: each path → its subtree; the whole folds into one
}
writeFileSync(join(DIST, 'sitemap.json'), JSON.stringify(mesh, null, 2))
console.log(`sitemap mesh: ${nodes.length} nodes · ${edges} edges · ${resolved} resolved (${linkPct.toFixed(1)}%) · root ${root.slice(0, 13)}…`)
if (broken.length) { console.error('✗ ' + broken.length + ' broken internal link(s):\n  ' + broken.slice(0, 20).join('\n  ')); process.exit(1) }
console.log('✓ 100% path + link coverage — the mesh is whole, computable, testable.')
