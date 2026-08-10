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

// Strip a DIRECTORY index.html only (preceded by '/' or the whole name), never the trailing "index" of a
// slug like "..._fibonacci_index.html" — the bug that mangled the route to "..._fibonacci_" and reported a
// phantom broken link. Anchor the strip to a slash (or start), then drop the ".html" extension.
const routeOf = (file: string) =>
  BASE + relative(DIST, file).split(sep).join('/').replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, '')
const titleOf = (html: string) => (html.match(/<title>([^<]*)<\/title>/i)?.[1] || '').replace(/\s*\|.*$/, '').trim()
const norm = (p: string) => p.replace(/\/$/, '') || BASE.replace(/\/$/, '')
const linksOf = (html: string) => {
  const out = new Set<string>()
  for (const m of html.matchAll(/href="([^"#?]+)/g)) {
    const h = m[1]
    if (/^https?:|^mailto:|\.(css|js|png|svg|ico|xml|json|webmanifest|txt|woff2?|ttf|eot|gif|jpe?g|webp|avif)$/i.test(h)) continue
    if (h.startsWith(BASE)) out.add(h.replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, ''))
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
// A broken link is a research lead, not just a failure: say WHY. Does a file exist on disk for the target
// (a route-derivation bug, like the index-strip)? Is there a known route differing only by case or a suffix
// (a rename/typo)? Naming the cause turns debugging into development.
const onDisk = (route: string) => {
  const rel = route.slice(BASE.length)
  for (const f of [join(DIST, rel + '.html'), join(DIST, rel, 'index.html'), join(DIST, rel.replace(/\/$/, '') + '.html')]) {
    try { if (statSync(f).isFile()) return f } catch { /* not here */ }
  }
  return null
}
const diagnose = (l: string) => {
  const t = norm(l)
  const disk = onDisk(t)
  if (disk) return 'target FILE exists on disk but no node has this route — a route-derivation bug (check routeOf/linksOf): ' + relative(DIST, disk)
  const ci = [...known].find((k) => k.toLowerCase() === t.toLowerCase())
  if (ci) return 'case mismatch — a node exists differing only in case: ' + ci
  const near = [...known].find((k) => k.startsWith(t) || t.startsWith(k))
  if (near) return 'nearest known route (a suffix/rename drift): ' + near
  return 'no file on disk and no near route — a genuinely missing page or a stale link'
}
for (const n of nodes) for (const l of n.links) { edges++; if (known.has(norm(l))) resolved++; else broken.push(n.path + ' → ' + l + '\n      why: ' + diagnose(l)) }
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
