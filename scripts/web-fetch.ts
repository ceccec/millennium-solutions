#!/usr/bin/env node
// WEB-FETCH — read one public page and return only the passages that match a pattern, with the page's content
// address. It backs the MCP tool `web_fetch`, so an online answer comes through the MCP and not through a
// separate browsing tool.
//
//   node scripts/web-fetch.ts <url> <pattern> [window] [raw]
//
//   raw   match against the HTML itself, not the stripped text, so links (href attributes) can be found
//
// A refusal is an answer, reported as REFUSED with exit 0, so the MCP returns it as the answer.
// The page is fetched as text, tags and scripts are removed, and every match of the case-insensitive pattern is
// returned with `window` characters of context on each side. The address is computed over the fetched body, so a
// later reader can tell whether the page changed. Nothing is written to the tree.
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const [url, pattern, windowArg, rawArg] = process.argv.slice(2)
const raw = rawArg === 'raw' || rawArg === 'true'
if (!url || !pattern) {
  console.log(JSON.stringify({ status: 'REFUSED', why: 'usage: web-fetch.ts <url> <pattern> [window]' }))
  process.exit(0)
}
const windowSize = Math.min(Math.max(Number(windowArg ?? 160), 20), 600)

let parsed: URL
try {
  parsed = new URL(url)
} catch {
  console.log(JSON.stringify({ status: 'REFUSED', why: 'not a URL', url }))
  process.exit(0)
}
if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
  console.log(JSON.stringify({ status: 'REFUSED', why: 'only http and https are fetched', url }))
  process.exit(0)
}

const main = async () => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 30_000)
  // A rate limit or a server error is the service asking for patience: back off and ask again, three times.
  let res: Response | null = null
  let lastWhy = ''
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      res = await fetch(parsed, { signal: controller.signal, headers: { 'user-agent': 'millennium-solutions-mcp/1 (web_fetch)' } })
      if ((res.status === 429 || res.status >= 500) && attempt < 3) {
        lastWhy = `HTTP ${res.status}`
        await new Promise((r) => setTimeout(r, 3000 * attempt))
        res = null
        continue
      }
      break
    } catch (e) {
      lastWhy = String(e).slice(0, 200)
      if (attempt < 3) await new Promise((r) => setTimeout(r, 3000 * attempt))
    }
  }
  clearTimeout(timer)
  if (!res) {
    console.log(JSON.stringify({ status: 'INCONCLUSIVE', url, why: lastWhy }))
    return
  }
  const bytes0 = Buffer.from(await res.arrayBuffer())
  const isPdf = /application\/pdf/i.test(res.headers.get('content-type') ?? '') || parsed.pathname.toLowerCase().endsWith('.pdf') || bytes0.subarray(0, 5).toString('latin1') === '%PDF-'
  let body: string
  if (isPdf) {
    // A PDF's text is compressed inside the file, so the bytes cannot be matched. Extract the text with pdftotext;
    // if it is not installed, say so rather than match nothing and call it no match.
    const bytes = bytes0
    const dir = mkdtempSync(join(tmpdir(), 'web-fetch-pdf-'))
    const file = join(dir, 'doc.pdf')
    writeFileSync(file, bytes)
    const run = spawnSync('pdftotext', ['-layout', file, '-'], { encoding: 'utf8', timeout: 60_000 })
    rmSync(dir, { recursive: true, force: true })
    if (run.error || run.status !== 0) {
      console.log(JSON.stringify({ status: 'INCONCLUSIVE', url, why: 'pdftotext is not available or failed on this PDF: ' + String(run.error ?? run.stderr).slice(0, 160) }))
      return
    }
    body = run.stdout
  } else {
    body = bytes0.toString('utf8')
  }
  // Match the stripped text first; if the pattern is not in it, match the raw HTML (link targets live there).
  // A PDF's extracted text is matched as it is. The output says which view produced the passages.
  const stripped = body
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
  const collect = (text: string): string[] => {
    const found: string[] = []
    for (const m of text.matchAll(new RegExp(pattern, 'gi'))) {
      const at = m.index ?? 0
      found.push(text.slice(Math.max(0, at - windowSize), Math.min(text.length, at + m[0].length + windowSize)).trim())
      if (found.length >= 20) break
    }
    return found
  }
  let view: 'text' | 'raw' = 'text'
  let passages = collect(isPdf || raw ? body : stripped)
  if (!isPdf && !raw && passages.length === 0) {
    const rawPassages = collect(body)
    if (rawPassages.length > 0) { passages = rawPassages; view = 'raw' }
  }
  console.log(JSON.stringify({
    status: res.ok ? 'FETCHED' : 'HTTP_' + res.status,
    url,
    bytes: Buffer.byteLength(body),
    address: createHash('sha256').update(body).digest('hex').slice(0, 32),
    matches: passages.length,
    view,
    passages,
    note: 'passages are the page text around each match, as fetched now; nothing here is checked against any other source',
  }, null, 1))
}

main()
