#!/usr/bin/env node
// LEAN — the whole Lean layer, verified by one command.
//
// This exists because the ritual it replaces was performed by hand six times in a row: write a file, run
// `lean` on it, then hand-roll a throwaway script that appends `#print axioms` for every theorem and run it
// again, reading the output by eye. Every repetition was a chance to skip the audit, and skipping it is
// exactly how two theorems once shipped carrying `propext` while the file header claimed axiom-freedom.
//
// Four checks per file, all of them mechanical:
//   COMPILE  — lean accepts it
//   AXIOMS   — `#print axioms` per theorem; anything that depends on an axiom is a failure, not a footnote
//   HYGIENE  — no `sorry`, no `native_decide` outside comments
//   COUNT    — theorems found, so a file that silently stops proving things is visible
//
//   node scripts/lean.ts            verify every file
//   node scripts/lean.ts <file>     verify one
import { readFileSync, writeFileSync, readdirSync, unlinkSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'

// THE CACHE — a file whose bytes have not changed cannot have stopped being axiom-free. Verification was
// re-elaborating all 18 files on every run, and `decide` over ten thousand cases is not cheap: the step alone
// ran past three minutes and was the entire build. The verdict is keyed on the SHA-256 of the source plus the
// verdict format, so editing a file, or changing what counts as a pass, re-verifies it and nothing else does.
// This is a cache of work, never of trust: the recorded verdict is the one the kernel gave for those exact
// bytes, and `--full` ignores it entirely.
const CACHE = 'src/proof/.lean-cache.json'
const CACHE_FORMAT = 2
const FULL = process.argv.includes('--full')
type Cached = { hash: string; format: number; ok: boolean; line: string; theorems: number }
const cache: Record<string, Cached> = !FULL && existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) : {}
const sha = (t: string) => createHash('sha256').update(t).digest('hex')
import { execSync, execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { availableParallelism } from 'node:os'
const run = promisify(execFile)

const DIR = 'src/proof'
// Files may import one another (address.lean imports Fnv). Lean resolves an import from a compiled .olean on
// LEAN_PATH, so any file that is imported is built first and the directory is put on the path. Dependency
// order is read from the imports themselves rather than hard-coded.
const ENV = { ...process.env, LEAN_PATH: DIR }
// the optional file argument is the first NON-FLAG word: `--full` was being read as a filename, which only
// showed up once a flag existed to be misread.
const arg = process.argv.slice(2).find((a) => !a.startsWith('-'))
const files = arg ? [arg.replace(/^.*\//, '')] : readdirSync(DIR).filter((f) => f.endsWith('.lean')).sort()

// build oleans for every file that something imports
const all = readdirSync(DIR).filter((f) => f.endsWith('.lean'))
const imported = new Set(all.flatMap((f) => [...readFileSync(`${DIR}/${f}`, 'utf8').matchAll(/^import\s+([A-Za-z_0-9.]+)/gm)].map((m) => m[1])))
// AND THE OLEANS ARE CACHED TOO. Rebuilding one is a full elaboration of that file, so doing it
// unconditionally on every run cost more than the verification it exists to support — the warm run was slower
// than the cold one until this was keyed on the same content hash. Keyed on the SOURCE bytes: if the file has
// not changed and its .olean is on disk, the compiled artefact is exactly what a rebuild would produce.
for (const mod of imported) {
  const src = all.find((f) => f.toLowerCase() === mod.toLowerCase() + '.lean')
  if (!src) continue
  const olean = `${DIR}/${mod}.olean`
  const key = 'olean:' + mod
  const h = sha(readFileSync(`${DIR}/${src}`, 'utf8'))
  if (!FULL && existsSync(olean) && cache[key]?.hash === h) continue
  try { execSync(`lean -o ${olean} ${DIR}/${src}`, { stdio: 'pipe', env: ENV })
        cache[key] = { hash: h, format: CACHE_FORMAT, ok: true, line: '', theorems: 0 } } catch { /* reported below */ }
}

let bad = 0, total = 0
const rows: string[] = []

// VERIFIED IN PARALLEL, REPORTED IN ORDER. The files do not depend on one another at this stage — their
// imports are already compiled to .olean above — so elaborating them one at a time left every core but one
// idle for the better part of a minute. Results are collected by index and printed in the original order, so
// the output is identical to the sequential run and a diff of two builds still means something.
const LANES = Math.max(1, Math.min(Number(process.env.LEAN_LANES) || (availableParallelism?.() ?? 4), files.length))
const ordered: string[] = new Array(files.length)
let next = 0

const verify = async (f: string, at: number) => {
  const path = `${DIR}/${f}`
  const src = readFileSync(path, 'utf8')
  const names = [...src.matchAll(/^theorem ([A-Za-z_0-9]+)/gm)].map((m) => m[1])
  total += names.length
  const issues: string[] = []

  const hash = sha(src)
  const hit = cache[f]
  if (hit && hit.hash === hash && hit.format === CACHE_FORMAT) {
    ordered[at] = hit.line
    if (!hit.ok) bad++
    return
  }

  // HYGIENE — comments stripped, so a header saying "never sorry" is not mistaken for a sorry
  const code = src.replace(/^\s*--.*$/gm, '')
  if (/\bsorry\b/.test(code)) issues.push('uses sorry')
  if (/native_decide/.test(code)) issues.push('uses native_decide')

  // COMPILE AND AXIOMS IN ONE ELABORATION. The probe below IS the file plus `#print axioms` per theorem, so
  // running it compiles everything the plain compile did — doing both was elaborating every file twice, and
  // for a file that decides ten thousand cases that is the whole cost paid over again for nothing. A failure
  // here is a compile failure, reported exactly as before.
  const ns = src.match(/^namespace\s+([A-Za-z_0-9.]+)/m)?.[1]
  const probe = `/tmp/lean_audit_${f}`
  const audit = names.map((n) => `#print axioms ${n}`).join('\n')
  writeFileSync(probe, ns ? src.replace(new RegExp(`end ${ns}\\s*$`), `${audit}\n\nend ${ns}\n`) : src + '\n' + audit + '\n')
  let out = ''
  try { out = (await run('lean', [probe], { env: ENV, maxBuffer: 64 * 1024 * 1024 })).stdout }
  catch (e) {
    unlinkSync(probe)
    issues.push('does not compile')
    const line = `  ✗ ${f.padEnd(18)} ${String(names.length).padStart(3)}  ${issues.join(', ')}`
    ordered[at] = line; cache[f] = { hash, format: CACHE_FORMAT, ok: false, line, theorems: names.length }; bad++; return
  }
  unlinkSync(probe)
  const dirty = out.split('\n').filter((l) => l.includes('depends on axioms'))
  if (dirty.length) issues.push(`${dirty.length} carry axioms: ${dirty.map((d) => d.split("'")[1]?.split('.').pop()).join(' ')}`)
  const audited = out.split('\n').filter((l) => l.includes('does not depend on any axioms')).length
  if (audited + dirty.length !== names.length) issues.push(`audited ${audited + dirty.length}/${names.length}`)

  const line = issues.length
    ? `  ✗ ${f.padEnd(18)} ${String(names.length).padStart(3)}  ${issues.join(', ')}`
    : `  ✓ ${f.padEnd(18)} ${String(names.length).padStart(3)}  compiles · ${audited} axiom-free · no sorry`
  ordered[at] = line
  cache[f] = { hash, format: CACHE_FORMAT, ok: issues.length === 0, line, theorems: names.length }
  if (issues.length) bad++
}

await Promise.all(Array.from({ length: LANES }, async () => {
  for (;;) { const i = next++; if (i >= files.length) return; await verify(files[i], i) }
}))
rows.push(...ordered.filter(Boolean))

writeFileSync(CACHE, JSON.stringify(cache, null, 2) + '\n')
console.log(rows.join('\n'))
console.log(`\n  ${files.length} files · ${total} theorems · ${bad ? bad + ' FAILING' : 'all clean'}`)
process.exit(bad ? 1 : 0)
