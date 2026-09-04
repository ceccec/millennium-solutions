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

const tokenPath = join(homedir(), '.zenodo', SANDBOX ? 'sandbox-token' : 'token')
const token = existsSync(tokenPath) ? readFileSync(tokenPath, 'utf8').trim() : ''

const minted: Record<string, string> = existsSync(MAP) ? JSON.parse(readFileSync(MAP, 'utf8')) : {}
const pending = readdirSync(OUT).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, ''))
  .filter((k) => !minted[k]).sort()

console.log(`  ${pending.length} deposition(s) not yet minted, ${Object.keys(minted).length} already carrying a DOI`)
if (!SANDBOX && !LIVE) { console.log(`  would mint ${Math.min(LIMIT, pending.length)} against ${HOST}`); process.exit(0) }
if (!token) { console.error(`  ✗ no token at ${tokenPath} — create it there; this script never asks for one and never prints it`); process.exit(1) }

const api = async (path: string, init: RequestInit = {}) => {
  const r = await fetch(`${HOST}/api${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(init.headers ?? {}) },
  })
  const body = await r.text()
  if (!r.ok) throw new Error(`${r.status} ${r.statusText} — ${body.slice(0, 300)}`)
  return body ? JSON.parse(body) : {}
}

let done = 0
for (const key of pending.slice(0, LIMIT)) {
  const meta = JSON.parse(readFileSync(`${OUT}/${key}.json`, 'utf8'))
  // Every file the proof needs, not just the one that declares it: a record whose Lean does not compile
  // for the person who downloaded it is a citation with nothing behind it.
  const files: string[] = Array.isArray(meta.files) ? meta.files : []
  try {
    const dep = await api('/deposit/depositions', { method: 'POST', body: '{}' })
    const bucket: string = dep.links.bucket
    const payload: [string, string][] = [
      ...files.filter((f) => existsSync(f)).map((f) => [f.split('/').pop()!, readFileSync(f, 'utf8')] as [string, string]),
      [`${key}.deposition.json`, JSON.stringify(meta, null, 2)],
    ]
    for (const [name, content] of payload) {
      if (!content) continue
      const r = await fetch(`${bucket}/${name}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: content })
      if (!r.ok) throw new Error(`file ${name}: ${r.status} ${await r.text()}`)
    }
    // STRIP LOCAL BOOKKEEPING. `files` records which sources the proof needs so this script knows what to
    // upload; it is not a Zenodo metadata attribute and sending it would put an unknown key in a permanent
    // record. Everything else in the file is a documented field, checked by scripts/zenodo-gate.ts.
    const { files: _local, ...metadata } = meta as Record<string, unknown>
    await api(`/deposit/depositions/${dep.id}`, { method: 'PUT', body: JSON.stringify({ metadata }) })
    const pub = await api(`/deposit/depositions/${dep.id}/actions/publish`, { method: 'POST' })
    minted[key] = pub.doi
    writeFileSync(MAP, JSON.stringify(minted, null, 2) + '\n')
    console.log(`  ✓ ${key} → ${pub.doi} (${payload.length} files)  ${pub.links?.record_html ?? ''}`)
    done++
  } catch (e) {
    console.error(`  ✗ ${key}: ${(e as Error).message}`)
    break
  }
  await new Promise((r) => setTimeout(r, 1200)) // Zenodo asks for courtesy; this is not a race
}
console.log(`\n${done ? '✓' : '✗'} zenodo-mint: ${done} record(s) published to ${HOST} · map → ${MAP}`)
