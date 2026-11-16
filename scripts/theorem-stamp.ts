#!/usr/bin/env node
/** ── THEOREM-STAMP — every /theorem/<key> page from ONE template ───────────────────────────────────────────
 *
 *  VitePress rendered and bundled a page per theorem: 4,041 pages and 8,082 JS chunks, the slowest step of the
 *  ship (chain-timer, 2026-11-16: the vitepress build alone was 62% of the gate path). Now VitePress builds ONE
 *  page, theorem/_template.md, and this stamps the rest from it: each record from src/publication/record.ts is
 *  rendered by the same Vue component the page always used (.vitepress/theme/TheoremPage.vue, server-side, in
 *  milliseconds) and filled into the template by src/publication/fill.ts — the slot fill a tenant host performs
 *  at the edge, so a page reads the same wherever it is rendered.
 *
 *  THE TEMPLATE IS PREPARED ONCE AND PUBLISHED: VitePress's app scripts and page preloads are removed, because a
 *  stamped page has no client chunk of its own — the router would load a page that does not exist and replace
 *  the content with its 404. The page keeps the site's CSS, fonts and the inline appearance script; it is
 *  static HTML, and its links are ordinary links. The template keeps its noindex; a stamped page is indexable.
 *
 *  Runs inside docs:build, after `vitepress build` and before e2e, so every gate reads stamped pages as files.
 *      node scripts/theorem-stamp.ts
 */
process.env.NODE_ENV = 'production' // plugin-vue derives scoped-style ids from path+source only in production — as the site build did
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { createServer } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { theoremRoutes, theoremHead, BASE } from '../src/publication/record.ts'
import { fill } from '../src/publication/fill.ts'

const DIST = '.vitepress/dist'
const TEMPLATE = `${DIST}/theorem/_template.html`
if (!existsSync(TEMPLATE)) {
  console.log(`✗ theorem-stamp: ${TEMPLATE} is not built — run vitepress build first (theorem/_template.md is the one theorem page it renders)`)
  process.exit(1)
}

// ── prepare the template once (idempotent: a prepared template prepares to itself) ──
const raw = readFileSync(TEMPLATE, 'utf8')
const template = raw
  .replace(/<script type="module" src="[^"]*"><\/script>/g, '')
  .replace(/<link rel="modulepreload" href="[^"]*">/g, '')
  .replace(/<meta name="robots" content="index, follow">/g, '')
// checked before anything is written: a template without its slot would stamp every page empty of its theorem
if (!/data-slot="page"><\/div>/.test(template)) { console.log(`✗ theorem-stamp: ${TEMPLATE} carries no empty data-slot="page" — nothing stamped`); process.exit(1) }
writeFileSync(TEMPLATE, template)

const vite = await createServer({
  root: process.cwd(), configFile: false, logLevel: 'error', appType: 'custom', mode: 'production',
  // comments off, as the production site build compiles them: a page must not carry the component's source notes
  server: { middlewareMode: true, hmr: false, watch: null }, plugins: [vue({ template: { compilerOptions: { comments: false } } })],
  optimizeDeps: { noDiscovery: true, include: [] },
})
const t0 = Date.now()
const { default: TheoremPage } = await vite.ssrLoadModule('/.vitepress/theme/TheoremPage.vue')
const routes = theoremRoutes()
const t1 = Date.now()
const base = BASE
let bytes = 0
for (const p of routes) {
  const page = await renderToString(createSSRApp({ render: () => h(TheoremPage, { params: p, base }) }))
  const hd = theoremHead(p)
  const html = fill(template, {
    title: hd.title,
    head: { ...Object.fromEntries(hd.meta.map(([, k, v]) => [k, v])), robots: 'index, follow',
      ...Object.fromEntries(hd.links.map(([rel, lang, href]) => [lang ? `link:${rel}:${lang}` : `link:${rel}`, href])) },
    jsonld: hd.jsonld || '{}',
    html: { page },
  })
  writeFileSync(`${DIST}/theorem/${p.key}.html`, html)
  bytes += html.length
}
await vite.close()
console.log(`✓ theorem-stamp: ${routes.length} theorem pages from one template — records ${((t1 - t0) / 1000).toFixed(1)} s, `
  + `render+fill ${((Date.now() - t1) / 1000).toFixed(1)} s, ${(bytes / 1048576).toFixed(0)} MiB`)
