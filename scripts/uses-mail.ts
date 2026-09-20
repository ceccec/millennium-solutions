#!/usr/bin/env node
// USES-MAIL — each rights finding mailed to legal@psg.bg as a factual evidence dossier.
//
// The author, 2026-09-14: "each rights finding mailed as a factual evidence dossier", "send as uuidna using smtp
// provided … psg domains send from psg.bg, uuidna from uuidna.com, but all use mail.psg.bg mx". So a dossier is
// sent FROM rights@uuidna.com THROUGH mail.psg.bg by authenticated SMTP submission — the server uuidna.com's own
// SPF (`v=spf1 mx -all`) authorises, with the envelope sender on uuidna.com too, so its strict DMARC aligns.
// curl carries SMTP itself, so this adds no dependency.
//
//   node scripts/uses-mail.ts uses-markers.json uses-news.json
//   node scripts/uses-mail.ts uses-news.json --dry-run out/   render every dossier to out/ and send NOTHING
//
// LOCKED: the recipient is legal@psg.bg in code, and nothing else is accepted. CREDENTIALS are the author's:
// SMTP_USER and SMTP_PASS come from the environment (GitHub secrets in CI) and are never written anywhere. Without
// them it says "NOT CONFIGURED — nothing mailed" and exits 0, loudly. A dossier is facts — where, by which source,
// which markers matched verbatim, when, by whom, whether the page cites the author and how that was measured,
// that paying is NOT MEASURED, and which sources were not measured that run — and it closes by saying what it is
// not: a lead for the author to judge, not a legal conclusion.
import { readFileSync, existsSync, writeFileSync, unlinkSync, mkdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { arg, flag } from '../src/cli/index.ts'

const TO = 'legal@psg.bg'
const FROM = process.env.MAIL_FROM || 'rights@uuidna.com'
const SMTP_URL = process.env.SMTP_URL || 'smtp://mail.psg.bg:587'
const MAX_DOSSIERS = 40
if (!/@(uuidna\.com|psg\.bg)$/i.test(FROM)) { console.log(`✗ uses-mail: sender ${FROM} is not on uuidna.com or psg.bg — refused`); process.exit(1) }

type Lead = { source: string; url: string; markers: string[]; cites?: string; by?: string; when?: string; text?: string; signals?: string[]; priority?: string; licence?: string; kind?: string }
type Report = { mode: string; when: string; sources: Record<string, { measured: number; notMeasured: string[] }>; leads: Lead[]; news?: Record<string, number | string[]>; run?: string }

const cff = readFileSync('CITATION.cff', 'utf8')
const WORK = `${(cff.match(/^title:\s*"?([^"\n]+)"?/m)?.[1] ?? 'millennium-solutions').slice(0, 80)} · DOI ${cff.match(/^doi:\s*"?([^"\s]+)"?/m)?.[1]} · ${cff.match(/^license:\s*(\S+)/m)?.[1]} · ORCID ${cff.match(/orcid\.org\/([0-9X-]+)/)?.[1]}`

function dossier(l: Lead, r: Report, n: number, of: number): { subject: string; body: string } {
  const host = (() => { try { return new URL(l.url).hostname } catch { return l.url } })()
  const notMeasured = Object.entries(r.sources).filter(([, s]) => s.notMeasured.length).map(([k, s]) => `${k} (${s.notMeasured.length})`)
  const body = [
    `FACTUAL EVIDENCE DOSSIER — rights finding ${n} of ${of}`,
    ``,
    `Recorded      ${r.when}${r.run ? `  ·  run ${r.run}` : ''}`,
    `Work          ${WORK}`,
    `Definition    the author's: a violation is exactly NOT CITING and NOT PAYING. Nothing else is assessed.`,
    ``,
    `FINDING`,
    `  Where        ${l.url}`,
    `  Found by     ${l.source}${l.markers.length ? `  ·  markers matched verbatim: ${l.markers.join(', ')}` : ''}`,
    ...(l.signals?.length ? [`  Construct    ${l.signals.join(' · ')}  (${l.kind === 'topic' ? 'the same field — not his expression' : 'his expression, two signals or more'})`] : []),
    ...(l.priority ? [`  Priority     ${l.priority}`] : []),
    ...(l.licence ? [`  Licence      ${l.licence}`] : []),
    `  Dated        ${l.when ?? 'not stated by the source'}`,
    `  Published by ${l.by ?? 'not stated by the source'}`,
    `  Title/text   ${(l.text ?? '').replace(/\s+/g, ' ').slice(0, 300) || '—'}`,
    ``,
    `THE TWO BITS`,
    `  Cites the author   ${l.cites ?? 'NOT MEASURED'}`,
    `      measured by fetching the page (or the raw file, for code) and searching it for the author's name,`,
    `      ORCID, his DOIs, his site or his repositories. UNREADABLE means the page could not be fetched.`,
    `  Pays (commercial)  NOT MEASURED — no payment record exists yet to check against.`,
    ``,
    `CONTEXT OF THE RUN`,
    `  Mode        ${r.mode}${r.news ? `  ·  topic news per day after publications ${r.news.perDayAfter} vs before ${r.news.perDayBefore}` : ''}`,
    `  Not measured in this run: ${notMeasured.length ? notMeasured.join(', ') : 'none — every source answered'}`,
    ``,
    `WHAT THIS IS NOT`,
    `  A lead for the author to judge, recorded from public sources. It is not a legal conclusion, not an`,
    `  accusation, and not evidence that anyone copied anything: a page that does not cite may be unrelated,`,
    `  and timing alone proves nothing. Nobody was contacted.`,
  ].join('\n')
  return { subject: `[rights finding ${n}/${of}] ${host} — cites: ${l.cites ?? 'NOT MEASURED'} · pays: NOT MEASURED`, body }
}

const encode = (s: string) => `=?UTF-8?B?${Buffer.from(s, 'utf8').toString('base64')}?=`
function send(subject: string, body: string) {
  const mime = [
    `From: Rights audit <${FROM}>`, `To: ${TO}`, `Subject: ${encode(subject)}`,
    `Message-ID: <${randomUUID()}@${FROM.split('@')[1]}>`, `Date: ${new Date().toUTCString()}`,
    'MIME-Version: 1.0', 'Content-Type: text/plain; charset=utf-8', 'Content-Transfer-Encoding: 8bit', '', body, '',
  ].join('\r\n')
  const file = join(tmpdir(), `dossier-${randomUUID()}.eml`)
  writeFileSync(file, mime)
  try {
    // --mail-from on uuidna.com keeps the ENVELOPE sender aligned with From, which strict DMARC (aspf=s) requires.
    execFileSync('curl', ['-sS', '--ssl-reqd', '--url', SMTP_URL, '--user', `${process.env.SMTP_USER}:${process.env.SMTP_PASS}`,
      '--mail-from', FROM, '--mail-rcpt', TO, '--upload-file', file], { stdio: ['ignore', 'pipe', 'pipe'] })
  } finally { unlinkSync(file) }
}

const files = process.argv.slice(2).filter((f) => f.endsWith('.json'))

// ── --dry-run <dir>: RENDER WHAT WOULD BE SENT, SEND NOTHING ─────────────────────────────────────────────
// A dossier to a legal address naming a real party is not a step anyone should take unseen, and until now
// the only way to read one was to have already sent it. The dossiers are the same bytes either way — the
// same `dossier()` renders both — so what lands in the directory is the mail, not a description of it.
// It is also the honest answer for anyone without the author's SMTP credentials, which is everyone but him
// and the weekly workflow: they can prepare the dossiers and he can read them before any of it leaves.
const DRY = flag('--dry-run') ? (arg('--dry-run') ?? 'dossiers') : null
if (DRY) {
  mkdirSync(DRY, { recursive: true })
  let n = 0
  for (const f of files) {
    if (!existsSync(f)) { console.log(`${f} missing — that step produced no report`); continue }
    const r = JSON.parse(readFileSync(f, 'utf8')) as Report
    const stem = f.replace(/^.*\//, '').replace(/\.json$/, '')
    const leads = r.leads.slice(0, MAX_DOSSIERS)
    for (let i = 0; i < leads.length; i++) {
      const d = dossier(leads[i], r, i + 1, r.leads.length)
      writeFileSync(join(DRY, `${stem}-${String(i + 1).padStart(3, '0')}.txt`), `To: ${TO}\nFrom: ${FROM}\nSubject: ${d.subject}\n\n${d.body}\n`)
      n++
    }
    const rest = r.leads.slice(MAX_DOSSIERS)
    if (rest.length) {
      writeFileSync(join(DRY, `${stem}-digest.txt`), `To: ${TO}\nFrom: ${FROM}\nSubject: [rights findings] ${rest.length} more leads in this run — listed, not dropped\n\n`
        + [`${rest.length} further leads from the run recorded ${r.when}, beyond the ${MAX_DOSSIERS} mailed as dossiers:`, '', ...rest.map((l) => `  ${l.url}  —  cites: ${l.cites ?? 'NOT MEASURED'} · pays: NOT MEASURED  —  ${l.source}`)].join('\n') + '\n')
      n++
    }
    console.log(`${f}: ${leads.length} dossier(s)${rest.length ? ` + 1 digest of ${rest.length}` : ''} for ${r.leads.length} lead(s)`)
  }
  console.log(`uses-mail --dry-run: ${n} message(s) written to ${DRY}/ and NOTHING sent. Read them, then send with SMTP_USER/SMTP_PASS set, or by dispatching .github/workflows/uses.yml.`)
  process.exit(0)
}

if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.log(`uses-mail NOT CONFIGURED — SMTP_USER / SMTP_PASS are unset, so nothing was mailed (sender ${FROM} via ${SMTP_URL} → ${TO})`)
  console.log(`  to read what WOULD be sent without sending it: node scripts/uses-mail.ts <report.json…> --dry-run <dir>`)
  process.exit(0)
}
let mailed = 0, failed = 0
for (const f of files) {
  if (!existsSync(f)) { console.log(`${f} missing — that step produced no report`); continue }
  const r = JSON.parse(readFileSync(f, 'utf8')) as Report
  if (process.env.RUN_URL) r.run = process.env.RUN_URL
  const leads = r.leads.slice(0, MAX_DOSSIERS)
  for (let i = 0; i < leads.length; i++) {
    const d = dossier(leads[i], r, i + 1, r.leads.length)
    try { send(d.subject, d.body); mailed++ } catch (e) { failed++; console.log(`✗ ${leads[i].url}: ${String((e as { stderr?: Buffer }).stderr ?? e).trim().slice(0, 160)}`) }
  }
  const rest = r.leads.slice(MAX_DOSSIERS)
  if (rest.length) {
    try { send(`[rights findings] ${rest.length} more leads in this run — listed, not dropped`, [`${rest.length} further leads from the run recorded ${r.when}, beyond the ${MAX_DOSSIERS} mailed as dossiers:`, '', ...rest.map((l) => `  ${l.url}  —  cites: ${l.cites ?? 'NOT MEASURED'} · pays: NOT MEASURED  —  ${l.source}`)].join('\n')); mailed++ }
    catch { failed++ }
  }
  console.log(`${f}: ${leads.length} dossier(s)${rest.length ? ` + 1 digest of ${rest.length}` : ''} for ${r.leads.length} lead(s)`)
}
console.log(`uses-mail: ${mailed} mailed to ${TO} from ${FROM} via ${SMTP_URL}${failed ? ` · ${failed} FAILED` : ''}`)
if (failed) process.exit(1)
