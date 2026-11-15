#!/usr/bin/env node
// SEO-SOURCE — the description check that needs no build, so it runs at commit, not at ship.
//
// scripts/seo.ts is the full SEO self-audit, but it reads the RENDERED pages in .vitepress/dist — so it can
// only run after `docs:build`, which means an over-long meta description is caught at SHIP time (inside
// orchestrate), where it halts the release after an 18-minute build. The description of a hand-authored page
// IS its frontmatter `description:`; VitePress emits it into the meta tag unchanged (a page whose frontmatter
// description was 242 chars rendered a 242-char meta description). So the one class of SEO failure a person
// introduces by hand — a page description past the search-result line — is decidable from the source alone,
// with no build.
//
// This reads every .md page's frontmatter description and refuses one longer than DESC_CAP, the SAME cap
// scripts/seo.ts judges the rendered page against (src/7/serp.ts owns it — one rule, two readers). It runs in
// the pre-commit hook, so the description is caught when the page is written, and the ship never trips on it.
// Titles are NOT checked here: they are composed with the site suffix and a theorem page is capped by its
// declaration, so the rendered gate judges them per class; descriptions have one cap and are authored directly.
//
//   node scripts/seo-source.ts
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { DESC_CAP } from '../src/7/serp.ts'

const SKIP = new Set(['node_modules', '.vitepress', 'dist', '.git', 'evidence'])
const walk = (dir: string, out: string[] = []): string[] => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || SKIP.has(e.name)) continue
    const p = join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else if (p.endsWith('.md')) out.push(p)
  }
  return out
}

type Over = { file: string; len: number; desc: string }
const over: Over[] = []
let checked = 0
for (const f of walk('.')) {
  const fm = readFileSync(f, 'utf8').match(/^---\n([\s\S]*?)\n---/)
  if (!fm) continue
  const m = fm[1].match(/^description:\s*(.*)$/m)
  if (!m) continue
  checked++
  const desc = m[1].replace(/^["']|["']$/g, '')
  if (desc.length > DESC_CAP) over.push({ file: f.replace(/^\.\//, ''), len: desc.length, desc })
}

if (over.length) {
  console.log(`✗ seo-source: ${over.length} page description(s) over ${DESC_CAP} chars — a search result truncates them, and scripts/seo.ts refuses the ship on it. Shorten the frontmatter \`description:\`:`)
  for (const o of over) console.log(`    · ${o.file} — ${o.len} > ${DESC_CAP}: ${o.desc.slice(0, 80)}…`)
  process.exit(1)
}
console.log(`✓ seo-source: ${checked} page description(s), all within ${DESC_CAP} — no page will trip the SEO gate on description length`)
