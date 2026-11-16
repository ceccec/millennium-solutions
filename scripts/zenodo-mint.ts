#!/usr/bin/env node
// MINT — create and publish one Zenodo record per theorem deposition.
//
// IRREVERSIBLE. A published Zenodo record cannot be deleted by its depositor; withdrawal is a request to
// their staff. This script therefore defaults to DRY RUN, will not touch production without an explicit
// flag, and mints in a bounded batch so the first real record can be looked at before the rest follow.
//
// THE TOKEN IS NEVER READ INTO THIS PROGRAM'S OUTPUT. It is loaded from ~/.zenodo/token at call time, sent
// in an Authorization header, and never logged, echoed, or written to a file. Nothing here prints it, and
// a failure prints the HTTP status and Zenodo's message, not the request.
//
// Each record carries the deposition metadata built by scripts/zenodo-theorems.ts plus two files: the Lean
// source that declares the theorem, and the deposition JSON itself. A record whose files do not contain
// the proof would be a citation with nothing behind it.
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { leanTheorems } from '../src/api/index.ts'
import { theoremTex } from '../src/publication/index.ts'
import { homedir } from 'node:os'
import { join } from 'node:path'

const args = process.argv.slice(2)
const has = (f: string) => args.includes(f)
const SANDBOX = has('--sandbox')
const LIVE = has('--production')
const LIMIT = Number((args.find((a) => a.startsWith('--limit=')) ?? '--limit=1').split('=')[1])
const HOST = SANDBOX ? 'https://sandbox.zenodo.org' : 'https://zenodo.org'
const OUT = '.zenodo/theorems'
const MAP = '.zenodo/minted.json'

if (!SANDBOX && !LIVE) {
  console.log('  ○ dry run. Nothing is sent.')
  console.log('    --sandbox            mint against sandbox.zenodo.org (needs a SANDBOX token; they are separate)')
  console.log('    --production         mint real, permanent, public DOIs')
  console.log('    --limit=N            how many to mint this run (default 1)')
}

// WHO IS ASKING — derived from the package and the repository, never typed. A client that will not name
// itself is what Zenodo's edge refuses.
const PKG = JSON.parse(readFileSync('package.json', 'utf8')) as { name: string; version: string }
const PKG_NAME = PKG.name
const PKG_VERSION = PKG.version
const REPO = 'https://github.com/ceccec/millennium-solutions'

const tokenPath = join(homedir(), '.zenodo', SANDBOX ? 'sandbox-token' : 'token')
const token = existsSync(tokenPath) ? readFileSync(tokenPath, 'utf8').trim() : ''

const minted: Record<string, string> = existsSync(MAP) ? JSON.parse(readFileSync(MAP, 'utf8')) : {}
const pending = readdirSync(OUT).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, ''))
  .filter((k) => !minted[k]).sort()

console.log(`  ${pending.length} deposition(s) not yet minted, ${Object.keys(minted).length} already carrying a DOI`)
if (!SANDBOX && !LIVE) { console.log(`  would mint ${Math.min(LIMIT, pending.length)} against ${HOST}`); process.exit(0) }
if (!token) { console.error(`  ✗ no token at ${tokenPath} — create it there; this script never asks for one and never prints it`); process.exit(1) }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// Transient failures — rate limits (429), Zenodo 5xx, and network drops/timeouts — are not refusals: retry them
// with exponential backoff (honouring Retry-After on a 429) so one flaky moment does not abort a deposition
// mid-flight. A 4xx other than 429 IS a real refusal (bad token, missing scope, bad request): never retried,
// surfaced at once. The token never enters a log line, here or on a retry.
const retriableFetch = async (url: string, init: RequestInit, label: string): Promise<Response> => {
  const MAX = 5
  for (let attempt = 1; ; attempt++) {
    let r: Response
    try {
      r = await fetch(url, { ...init, signal: AbortSignal.timeout(60_000) })
    } catch (e) {
      if (attempt >= MAX) throw new Error(`${label}: network/timeout after ${MAX} tries — ${(e as Error).message}`)
      await sleep(2000 * 2 ** (attempt - 1)); continue
    }
    if (r.ok || (r.status >= 400 && r.status < 500 && r.status !== 429)) return r  // success, or a permanent refusal
    if (attempt >= MAX) return r  // transient exhausted — let the caller read the status/body and fail readably
    const ra = Number(r.headers.get('retry-after'))
    console.error(`    … ${label}: ${r.status}, retry ${attempt}/${MAX - 1}`)
    await sleep(Number.isFinite(ra) && ra > 0 ? ra * 1000 : 2000 * 2 ** (attempt - 1))
  }
}

const api = async (path: string, init: RequestInit = {}) => {
  // A REQUEST WITH NO USER-AGENT IS REFUSED BEFORE ZENODO EVER SEES IT: Node's fetch sends none and Zenodo's
  // edge answers an unreadable HTML "403 — unusual traffic" page instead of `{"status":403,...}`. Identifying
  // the client turns an unreadable block into a refusal that names the real problem (token scope vs down).
  const r = await retriableFetch(`${HOST}/api${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': `${PKG_NAME}/${PKG_VERSION} (+${REPO})`,
      ...(init.headers ?? {}),
    },
  }, `api ${path}`)
  const body = await r.text()
  if (!r.ok) throw new Error(`${r.status} ${r.statusText} — ${body.slice(0, 300)}`)
  return body ? JSON.parse(body) : {}
}

// After publish, a record is not instantly harvestable — Zenodo indexes it. Poll the record page until it
// answers, so a reported "minted" means "visible", not merely "accepted". Honest on timeout: returns false
// (not yet visible), never fakes it — the caller says so and points at zenodo-verify.
const confirmVisible = async (recordHtml: string | undefined, doi: string): Promise<boolean> => {
  const url = recordHtml || `https://doi.org/${doi}`
  for (let attempt = 1; attempt <= 6; attempt++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(20_000), headers: { 'User-Agent': `${PKG_NAME}/${PKG_VERSION} (+${REPO})` } })
      if (r.ok) return true
    } catch { /* indexing lag — keep polling */ }
    await sleep(5000 * attempt)
  }
  return false
}

let done = 0
for (const key of pending.slice(0, LIMIT)) {
  const meta = JSON.parse(readFileSync(`${OUT}/${key}.json`, 'utf8'))
  // Every file the proof needs, not just the one that declares it: a record whose Lean does not compile
  // for the person who downloaded it is a citation with nothing behind it.
  const files: string[] = Array.isArray(meta.files) ? meta.files : []
  let dep: { id?: number; links?: { bucket?: string } } = {}
  try {
    dep = await api('/deposit/depositions', { method: 'POST', body: '{}' })
    const bucket: string = dep.links!.bucket!
    // The typeset statement travels with the proof: a deposited record should be readable as mathematics,
    // not only compilable as Lean. Synthesised here from the same translator latex-gate round-trips.
    const thm = leanTheorems().find((x) => 'lean_' + x.name === key || key.endsWith('_' + x.name))
    // THE README AND THE CHANGELOG TRAVEL WITH EVERY RELEASE. The captain's instruction, signed as a receipt
    // (`agent: "captain"`, role "the captain's release instruction"): "update zenodo on each release
    // programatically to include readme and changelog". A deposition is what a reader who never opens the
    // repository actually holds, and without these it hands them a theorem with no account of the work it
    // came from and no history of how it got there.
    //
    // Both are DERIVED files: README.md is written by scripts/pages.ts from claims that each carry a
    // decidable test, and CHANGELOG.md by scripts/changelog.ts from the annotated provenance tags, each row
    // carrying the content-address its tag records. Attaching them ships the account and the history, not a
    // description of them — and neither can say anything the tree does not already verify.
    const RELEASE_DOCS = ['README.md', 'CHANGELOG.md']
    const payload: [string, string][] = [
      ...(thm ? [[`${key}.tex`, theoremTex(thm, { key: (meta.notes.match(/key (\S+)/) ?? [])[1] ?? null })] as [string, string]] : []),
      ...RELEASE_DOCS.filter((f) => existsSync(f)).map((f) => [f, readFileSync(f, 'utf8')] as [string, string]),
      ...files.filter((f) => existsSync(f)).map((f) => [f.split('/').pop()!, readFileSync(f, 'utf8')] as [string, string]),
      [`${key}.deposition.json`, JSON.stringify(meta, null, 2)],
    ]
    for (const [name, content] of payload) {
      if (!content) continue
      const r = await retriableFetch(`${bucket}/${name}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}`, 'User-Agent': `${PKG_NAME}/${PKG_VERSION} (+${REPO})` }, body: content }, `file ${name}`)
      if (!r.ok) throw new Error(`file ${name}: ${r.status} ${await r.text()}`)
    }
    // STRIP LOCAL BOOKKEEPING. `files` records which sources the proof needs so this script knows what to
    // upload; it is not a Zenodo metadata attribute and sending it would put an unknown key in a permanent
    // record. Everything else in the file is a documented field, checked by scripts/zenodo-gate.ts.
    const { files: _local, ...metadata } = meta as Record<string, unknown>
    await api(`/deposit/depositions/${dep.id}`, { method: 'PUT', body: JSON.stringify({ metadata }) })
    const pub = await api(`/deposit/depositions/${dep.id}/actions/publish`, { method: 'POST' })
    minted[key] = pub.doi
    writeFileSync(MAP, JSON.stringify(minted, null, 2) + '\n')   // persist the DOI BEFORE the visibility wait: once published it is permanent, and a crash mid-wait must never re-publish it
    const visible = await confirmVisible(pub.links?.record_html, pub.doi)
    console.log(`  ✓ ${key} → ${pub.doi} (${payload.length} files) — ${visible ? 'visible' : 'published, not yet visible (Zenodo indexing lag; re-run zenodo-verify to confirm)'}  ${pub.links?.record_html ?? ''}`)
    done++
  } catch (e) {
    console.error(`  ✗ ${key}: ${(e as Error).message}`)
    // Discard an UNPUBLISHED draft so a retry does not orphan it. A published record is never deleted, and
    // minted[key] is set only after publish — so this removes a half-built draft, never a real record.
    if (dep.id && !minted[key]) {
      try { await api(`/deposit/depositions/${dep.id}`, { method: 'DELETE' }); console.error(`    (discarded unpublished draft ${dep.id})`) }
      catch (d) { console.error(`    (could not discard draft ${dep.id}: ${(d as Error).message} — remove it in the Zenodo UI)`) }
    }
    break
  }
  await new Promise((r) => setTimeout(r, 1200)) // Zenodo asks for courtesy; this is not a race
}
console.log(`\n${done ? '✓' : '✗'} zenodo-mint: ${done} record(s) published to ${HOST} · map → ${MAP}`)
