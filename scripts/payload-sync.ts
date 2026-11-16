#!/usr/bin/env node
// PAYLOAD SYNC — pull sealed ISO-gap evidence from qpu into evidence/payload/ for offline iso-audit.
//
// Source of truth is qpu's existing `pages` collection + plugin-iso-gaps hooks (req.context.isoGap).
// Those hooks write iso-evidence/ on the qpu host when a gap page is published. This script never invents
// passes: offline / missing evidence → status NOT_MEASURED.
//
//   node scripts/payload-sync.ts            read QPU_DIR/iso-evidence (or API), write evidence/payload/
//   QPU_DIR=~/github/uuidna/qpu            sibling checkout (default)
//   QPU_MCP_API_KEY=…                       optional: rebuild bundle from /api/pages when filesystem empty
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const QPU = process.env.QPU_DIR ?? join(homedir(), 'github', 'uuidna', 'qpu')
const SRC = join(QPU, 'iso-evidence')
const OUT = 'evidence/payload'
const ORIGIN = (process.env.QPU_URL || 'https://qpu.uuidna.com').replace(/\/$/, '')
const KEY = process.env.QPU_MCP_API_KEY?.trim()

const KINDS = [
  'alt-meaning',
  'keyboard',
  'contrast-off-theme',
  'isms-control',
  'quality-eval',
  'paper-section',
  'axiom-group',
] as const
type Kind = (typeof KINDS)[number]

type Doc = {
  id: string
  slug: string
  title: string
  kind: Kind
  standard: string
  clause: string
  subject: string
  verdict: string
  measuredAt: string
  body: string
  meta?: Record<string, unknown>
}

type Bundle = {
  status: 'INGESTED' | 'NOT_MEASURED'
  measured: string | null
  address: string | null
  source: string
  counts?: Record<string, number>
  docs: Doc[]
  needs?: string
  note?: string
}

const PREFIX: Record<Kind, string> = {
  'alt-meaning': 'iso-judgment-alt-meaning-',
  keyboard: 'iso-judgment-keyboard-',
  'contrast-off-theme': 'iso-judgment-contrast-off-theme-',
  'isms-control': 'isms-control-',
  'quality-eval': 'quality-eval-',
  'paper-section': 'paper-section-',
  'axiom-group': 'axiom-group-',
}

const kindOfSlug = (slug: string): Kind | null => {
  const s = slug.toLowerCase()
  const hit = (Object.entries(PREFIX) as [Kind, string][])
    .sort((a, b) => b[1].length - a[1].length)
    .find(([, p]) => s.startsWith(p))
  return hit?.[0] ?? null
}

const parseGapDescription = (description: string) => {
  const m = description.match(/\[iso-gap\s+([^\]]+)\]/)
  if (!m) return {} as Record<string, string>
  const out: Record<string, string> = {}
  for (const part of m[1].matchAll(/(\w+)=([^\s]+)/g)) out[part[1]] = part[2]
  out.subject = description.replace(/\[iso-gap\s+[^\]]+\]\s*/, '').trim()
  return out
}

const addressOf = (docs: Doc[]) =>
  createHash('sha256')
    .update(JSON.stringify(docs.map((d) => [d.slug, d.verdict, d.measuredAt, d.body])))
    .digest('hex')

const writeBundle = (bundle: Bundle) => {
  mkdirSync(OUT, { recursive: true })
  writeFileSync(join(OUT, 'latest.json'), JSON.stringify(bundle, null, 2) + '\n')
  if (bundle.status === 'INGESTED') {
    for (const kind of KINDS) {
      const docs = bundle.docs.filter((d) => d.kind === kind)
      writeFileSync(
        join(OUT, `${kind}.json`),
        JSON.stringify(
          {
            status: 'INGESTED',
            measured: bundle.measured,
            address: createHash('sha256').update(JSON.stringify(docs)).digest('hex'),
            docs,
          },
          null,
          2,
        ) + '\n',
      )
    }
  }
}

const fromFilesystem = (): Bundle | null => {
  const file = join(SRC, 'latest.json')
  if (!existsSync(file)) return null
  try {
    const raw = JSON.parse(readFileSync(file, 'utf8')) as Bundle
    if (raw.status !== 'INGESTED' || !Array.isArray(raw.docs)) return null
    return { ...raw, source: raw.source || 'plugin-iso-gaps' }
  } catch {
    return null
  }
}

const fromApi = async (): Promise<Bundle | null> => {
  if (!KEY) return null
  const docs: Doc[] = []
  for (const kind of KINDS) {
    const prefix = PREFIX[kind]
    let page = 1
    for (;;) {
      const url = new URL(`${ORIGIN}/api/pages`)
      url.searchParams.set('limit', '100')
      url.searchParams.set('page', String(page))
      url.searchParams.set('depth', '0')
      url.searchParams.set('where[slug][contains]', prefix.replace(/-$/, ''))
      const res = await fetch(url, {
        headers: { Authorization: `users API-Key ${KEY}`, Accept: 'application/json' },
      })
      if (!res.ok) return null
      const json = (await res.json()) as {
        docs?: Record<string, unknown>[]
        hasNextPage?: boolean
        totalPages?: number
      }
      for (const p of json.docs ?? []) {
        const slug = String(p.slug ?? '')
        const k = kindOfSlug(slug) ?? kind
        const meta = (p.meta && typeof p.meta === 'object' ? p.meta : {}) as Record<string, unknown>
        const parsed = parseGapDescription(String(meta.description ?? ''))
        docs.push({
          id: String(p.id ?? slug),
          slug,
          title: String(p.title ?? slug),
          kind: k,
          standard: parsed.standard || (k.startsWith('isms') ? 'ISO/IEC 27001' : k.includes('quality') || k.includes('paper') || k.includes('axiom') ? 'ISO/IEC 25010' : 'ISO/IEC 40500 (WCAG 2.0)'),
          clause: parsed.clause || 'judgment',
          subject: parsed.subject || String(p.title ?? slug),
          verdict: parsed.verdict || 'recorded',
          measuredAt: String(p.publishedOn ?? p.updatedAt ?? new Date().toISOString()),
          body: String(meta.description ?? ''),
          meta: { ...meta, ...parsed },
        })
      }
      if (!json.hasNextPage && page >= (json.totalPages ?? page)) break
      page++
      if (page > 50) break
    }
  }
  if (!docs.length) return null
  const counts = Object.fromEntries(KINDS.map((k) => [k, docs.filter((d) => d.kind === k).length]))
  return {
    status: 'INGESTED',
    measured: new Date().toISOString().slice(0, 10),
    address: addressOf(docs),
    source: 'payload-api',
    counts,
    docs: docs.sort((a, b) => a.slug.localeCompare(b.slug)),
  }
}

const offline = (): Bundle => ({
  status: 'NOT_MEASURED',
  measured: null,
  address: null,
  source: 'payload-sync',
  docs: [],
  needs: SRC,
  note: "qpu plugin-iso-gaps seals iso-evidence/ on page publish; set QPU_DIR to the uuidna/qpu clone, or QPU_MCP_API_KEY to rebuild from /api/pages. Never invents passes.",
})

const main = async () => {
  const bundle = fromFilesystem() ?? (await fromApi()) ?? offline()
  writeBundle(bundle)
  if (bundle.status === 'NOT_MEASURED') {
    console.log(JSON.stringify({ status: 'NOT_MEASURED', needs: bundle.needs, note: bundle.note }))
    process.exit(0)
  }
  console.log(
    `✓ payload-sync: ${bundle.docs.length} doc(s) from ${bundle.source} · address ${bundle.address?.slice(0, 13)}… → ${OUT}/latest.json`,
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
