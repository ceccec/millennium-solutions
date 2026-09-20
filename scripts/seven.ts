#!/usr/bin/env node
// SEVEN — every direction checked as a SERVED PAGE, concurrently.
//
// forensics.ts sweeps the seven locales already and says so: "all 7 locales carry the English nav shape with
// no empty labels — structural parity, which is what this checks; it does NOT certify what the translations
// say". True, and it understates the gap: it reads the CONFIG. Nothing had ever opened the seven pages and
// asked whether each direction serves something a reader can use.
//
// The seven are independent — no direction's page depends on another's — so they are read at once rather
// than in turn. That is not a speed trick, it is the shape of the thing: a sweep that serialises independent
// checks invites the habit of stopping at the first failure, and the interesting answer here is WHICH
// directions differ, not that one did.
//
// Against the built tree by default, so it is deterministic and needs no network; `--live` asks the deployed
// site the same questions, which is where the CSP and the runtime answers actually matter.
import { readFileSync, existsSync } from 'node:fs'
import { LOCALE_ORDER } from '../src/7/locale.ts'
import { flag } from '../src/cli/index.ts'
import { stripTags } from '../src/html/index.ts'

const DIST = '.vitepress/dist'
const SITE = 'https://ceccec.psg.bg/millennium-solutions'
const LIVE = flag('--live')
if (!LIVE && !existsSync(DIST)) { console.log('seven: no dist/ — run `npm run docs:build` first.'); process.exit(1) }

// A meta tag cannot deliver these; a policy that names one reads as protection and is discarded.
const META_IGNORED = ['frame-ancestors', 'sandbox', 'report-uri']

type Verdict = { dir: string; ok: boolean; notes: string[] }

async function read(dir: string): Promise<string> {
  const path = dir === 'en' ? 'index.html' : `${dir}/index.html`
  if (!LIVE) return readFileSync(`${DIST}/${path}`, 'utf8')
  const url = dir === 'en' ? `${SITE}/` : `${SITE}/${dir}/`
  const r = await fetch(url, { signal: AbortSignal.timeout(20_000) })
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  return r.text()
}

async function check(dir: string): Promise<Verdict> {
  const notes: string[] = []
  let html: string
  try { html = await read(dir) } catch (e) { return { dir, ok: false, notes: [`does not serve — ${(e as Error).message}`] } }

  const meta = /http-equiv="Content-Security-Policy"[^>]*content="([^"]*)"/i.exec(html)?.[1] ?? ''
  if (!meta) notes.push('no Content-Security-Policy')
  for (const d of META_IGNORED) if (new RegExp('(^|;)\\s*' + d + '\\b').test(meta)) notes.push(`CSP names ${d}, which a meta tag cannot deliver`)

  const lang = /<html[^>]*\blang="([^"]+)"/i.exec(html)?.[1] ?? ''
  if (!lang) notes.push('no lang on <html> — a screen reader cannot pick a voice')
  else if (!lang.toLowerCase().startsWith(dir === 'en' ? 'en' : dir)) notes.push(`lang="${lang}" does not name this direction`)

  const h1s = (html.match(/<h1[\s>]/gi) ?? []).length
  if (h1s !== 1) notes.push(`${h1s} <h1> (need exactly 1)`)

  const title = (/<title>([^<]*)<\/title>/.exec(html)?.[1] ?? '').trim()
  const desc = /name="description" content="([^"]*)"/.exec(html)?.[1] ?? ''
  if (!title) notes.push('no <title>')
  if (!desc) notes.push('no meta description')

  // A DIRECTION EITHER SERVES CONTENT OR SAYS IT DOES NOT. The locale fallback stubs are deliberate and
  // correct — noindex, canonical to English — but a page that is INDEXABLE must carry something to index.
  const noindex = /<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html)
  const text = stripTags(/<main[\s\S]*?<\/main>/.exec(html)?.[0] ?? '').replace(/\s+/g, ' ').trim()
  // WEIGHTED BY SCRIPT, for the same reason the title rule is. The Chinese homepage carries 168 characters
  // where its French sibling carries 394 — the same page, and 63 of those 168 are ideographs. Counting
  // characters measures the writing system, not whether a reader is given anything. This sweep reported zh
  // as thin on its first run, which was the sweep being wrong about Chinese rather than the page being
  // empty, and is the second time today a length check has had to learn that.
  const cjk = (text.match(/[\u3400-\u9fff\u3040-\u30ff\uac00-\ud7af]/g) ?? []).length
  const weighted = text.length + cjk * 2
  if (!noindex && weighted < 200) notes.push(`indexable with ${text.length} characters (${weighted} weighted) — thin`)
  if (noindex) notes.push('fallback stub (noindex, canonical to English) — deliberate, not translated yet')

  const hard = notes.filter((n) => !n.startsWith('fallback stub'))
  return { dir, ok: hard.length === 0, notes }
}

const verdicts = await Promise.all([...LOCALE_ORDER].map(check))   // the seven at once, not one after another
let bad = 0
for (const v of verdicts) {
  const mark = v.ok ? '✓' : '✗'
  console.log(`  ${mark} ${v.dir.padEnd(3)} ${v.notes.length ? v.notes.join(' · ') : 'serves, declares its language, one heading, titled and described'}`)
  if (!v.ok) bad++
}
const stubs = verdicts.filter((v) => v.notes.some((n) => n.startsWith('fallback stub'))).length
if (bad) { console.log(`\n✗ seven: ${bad} of ${verdicts.length} direction(s) do not serve what a reader needs`); process.exit(1) }
console.log(`\n✓ seven: all ${verdicts.length} directions serve${LIVE ? ' live' : ''} — ${verdicts.length - stubs} translated, ${stubs} honest fallback(s), each declaring its language and carrying one heading`)
