#!/usr/bin/env node
// LEAKS — where runtime TEMPERATURE (random sampling) and TIME (clock reads, timers) enter the deposit, measured.
//
//   node scripts/leaks.ts            the inventory as markdown
//   node scripts/leaks.ts --json     the same inventory as JSON
//
// A claim that rests on a random draw or a wall-clock reading is not a theorem: the kernel cannot re-run the draw, and
// the next run may differ. Each site found by a scan of src/ and scripts/ is classified by what it does, and a site
// that feeds a reported number or a sampled check is a CRACK: a place to replace by a theorem over a finite domain.
//
// The classification is by the site's own line and its file's role, not by reading what the number is used for. It
// says WHERE the leak is and WHAT kind it is; whether a given crack changes a published claim is a judgement this
// script does not make, and its output says so.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

type Kind = 'temperature' | 'time' | 'timer'
type Role = 'benchmark' | 'sampled-input' | 'receipt-stamp' | 'operational' | 'other'
type Site = { file: string; line: number; kind: Kind; role: Role; crack: boolean; text: string }

const KIND: [RegExp, Kind][] = [
  [/Math\.random\(|crypto\.(randomBytes|getRandomValues)|randomUUID\(/, 'temperature'],
  [/Date\.now\(|performance\.now\(|process\.hrtime|new Date\(\)/, 'time'],
  [/setTimeout\(|setInterval\(/, 'timer'],
]

// The role is the file's job in the deposit, read from its path and its own words, not guessed from the line alone.
const roleOf = (file: string, line: string): Role => {
  if (/bench|analytics|waves|perturb|probe/.test(file) || /hrtime|t0\b/.test(line) && /bench|analytics/.test(file)) return 'benchmark'
  if (/Math\.random/.test(line) && /bench|test/.test(file)) return 'sampled-input'
  if (/searched:|toISOString|\bts\b/.test(line)) return 'receipt-stamp'
  if (/web-|search|zenodo|ci-watch|environment|uses-mail|api-discover|readers|release-live|novelty|timeout|cooldown|rest/.test(file + ' ' + line)) return 'operational'
  return 'other'
}

// A crack is a site whose value can reach a reported number or a sampled check: a benchmark's clock, a sampled input,
// or a random draw that is not an operational identifier (a message ID or a temp filename changes no claim).
const isCrack = (kind: Kind, role: Role): boolean =>
  role === 'benchmark' || role === 'sampled-input' || (kind === 'temperature' && role === 'other')

const walk = (dir: string): string[] => readdirSync(dir).flatMap((e) => {
  if (['node_modules', 'dist', '.git', '.lake'].includes(e)) return []
  const p = join(dir, e)
  if (statSync(p).isDirectory()) return walk(p)
  return /\.ts$/.test(e) ? [p] : []
})

const sites: Site[] = []
for (const root of ['src', 'scripts']) {
  for (const path of walk(join(ROOT, root))) {
    const file = relative(ROOT, path)
    readFileSync(path, 'utf8').split('\n').forEach((text, i) => {
      // a comment is not a site: the scan reads code only
      if (/^\s*(\/\/|\*|\/\*)/.test(text)) return
      for (const [re, kind] of KIND) {
        if (!re.test(text)) continue
        const role = roleOf(file, text)
        sites.push({ file, line: i + 1, kind, role, crack: isCrack(kind, role), text: text.trim().slice(0, 140) })
        break
      }
    })
  }
}

const count = <T extends string>(xs: T[]) => xs.reduce<Record<string, number>>((m, x) => ((m[x] = (m[x] ?? 0) + 1), m), {})
const cracks = sites.filter((s) => s.crack)
const summary = {
  sites: sites.length,
  byKind: count(sites.map((s) => s.kind)),
  byRole: count(sites.map((s) => s.role)),
  cracks: cracks.length,
  crackFiles: count(cracks.map((s) => s.file)),
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ summary, sites }, null, 1))
  process.exit(0)
}

const out: string[] = []
out.push('## Leaks: where temperature and time enter the deposit\n')
out.push(`Measured by \`scripts/leaks.ts\` over \`src/\` and \`scripts/\`: **${summary.sites}** runtime sites, of which **${summary.cracks}** are cracks.\n`)
out.push('| kind | sites |\n|---|---|')
for (const [k, n] of Object.entries(summary.byKind)) out.push(`| ${k} | ${n} |`)
out.push('\n| role | sites |\n|---|---|')
for (const [k, n] of Object.entries(summary.byRole)) out.push(`| ${k} | ${n} |`)
out.push('\n### Cracks, by file\n\nA crack is a random draw or a benchmark clock. Each is to be replaced by a theorem over a finite domain, or moved out of the claim path.\n')
out.push('| file | cracks |\n|---|---|')
for (const [f, n] of Object.entries(summary.crackFiles).sort((a, b) => b[1] - a[1])) out.push(`| \`${f}\` | ${n} |`)
out.push('\n### Every crack\n')
for (const s of cracks) out.push(`- \`${s.file}:${s.line}\` · ${s.kind} · ${s.role} — \`${s.text.replace(/`/g, "'")}\``)
console.log(out.join('\n'))
