#!/usr/bin/env node
// Atom feed (RFC 4287) -- expose the monographs as a standard syndication feed (machine + human readable).
// Deterministic: uses the git tag commit date (recorded time), NOT Date.now() (build-time) -- consistent
// with "versions create time" (the record, not the clock). Honest entries: real pages, real titles/descriptions.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { join } from 'node:path'
import { toUuid } from '../src/0/index.ts'

const DIST = '.vitepress/dist'
const BASE = 'https://ceccec.psg.bg/millennium-solutions/'
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const titleOf = (h: string) => esc((h.match(/<title>([^<]*)<\/title>/i)?.[1] || '').replace(/\s*\|.*$/, '').trim())
const descOf = (h: string) => esc(h.match(/name="description" content="([^"]*)"/i)?.[1] || '')

const tag = execSync('git tag --sort=version:refname', { encoding: 'utf8' }).trim().split('\n').filter(Boolean).pop() || 'v1.0.0'
const updated = execSync('git log -1 --format=%cI ' + tag, { encoding: 'utf8' }).trim() // RFC-3339 from git, not Date.now

const pages = readdirSync(DIST).filter((f) => f.endsWith('.html') && f !== '404.html')
const entries = pages.map((p) => {
  const html = readFileSync(join(DIST, p), 'utf8')
  const url = BASE + p.replace(/index\.html$/, '').replace(/\.html$/, '')
  return `  <entry>\n    <title>${titleOf(html)}</title>\n    <id>urn:uuid:${toUuid(url)}</id>\n    <link href="${url}"/>\n    <updated>${updated}</updated>\n    <summary>${descOf(html)}</summary>\n  </entry>`
})
const feed = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Millennium Solutions — the ℤ/9 Vortex Framework</title>
  <id>urn:uuid:${toUuid(BASE)}</id>
  <link href="${BASE}"/>
  <link rel="self" href="${BASE}feed.xml"/>
  <updated>${updated}</updated>
  <author><name>Tsvetan Rouschev</name></author>
${entries.join('\n')}
</feed>
`
writeFileSync(join(DIST, 'feed.xml'), feed)
console.log('atom feed: ' + entries.length + ' monographs -> feed.xml (updated ' + updated + ' -- git-dated, not Date.now).')
