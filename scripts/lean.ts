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
import { readFileSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs'
import { execSync } from 'node:child_process'

const DIR = 'src/proof'
// Files may import one another (address.lean imports Fnv). Lean resolves an import from a compiled .olean on
// LEAN_PATH, so any file that is imported is built first and the directory is put on the path. Dependency
// order is read from the imports themselves rather than hard-coded.
const ENV = { ...process.env, LEAN_PATH: DIR }
const files = process.argv[2] ? [process.argv[2].replace(/^.*\//, '')] : readdirSync(DIR).filter((f) => f.endsWith('.lean')).sort()

// build oleans for every file that something imports
const all = readdirSync(DIR).filter((f) => f.endsWith('.lean'))
const imported = new Set(all.flatMap((f) => [...readFileSync(`${DIR}/${f}`, 'utf8').matchAll(/^import\s+([A-Za-z_0-9.]+)/gm)].map((m) => m[1])))
for (const mod of imported) {
  const src = all.find((f) => f.toLowerCase() === mod.toLowerCase() + '.lean')
  if (src) try { execSync(`lean -o ${DIR}/${mod}.olean ${DIR}/${src}`, { stdio: 'pipe', env: ENV }) } catch { /* reported below */ }
}

let bad = 0, total = 0
const rows: string[] = []

for (const f of files) {
  const path = `${DIR}/${f}`
  const src = readFileSync(path, 'utf8')
  const names = [...src.matchAll(/^theorem ([A-Za-z_0-9]+)/gm)].map((m) => m[1])
  total += names.length
  const issues: string[] = []

  // HYGIENE — comments stripped, so a header saying "never sorry" is not mistaken for a sorry
  const code = src.replace(/^\s*--.*$/gm, '')
  if (/\bsorry\b/.test(code)) issues.push('uses sorry')
  if (/native_decide/.test(code)) issues.push('uses native_decide')

  // COMPILE
  try { execSync(`lean ${path}`, { stdio: 'pipe', env: ENV }) }
  catch (e) { issues.push('does not compile'); rows.push(`  ✗ ${f.padEnd(18)} ${String(names.length).padStart(3)}  ${issues.join(', ')}`); bad++; continue }

  // AXIOMS — per theorem, never per file
  const ns = src.match(/^namespace\s+([A-Za-z_0-9.]+)/m)?.[1]
  const probe = `/tmp/lean_audit_${f}`
  const audit = names.map((n) => `#print axioms ${n}`).join('\n')
  writeFileSync(probe, ns ? src.replace(new RegExp(`end ${ns}\\s*$`), `${audit}\n\nend ${ns}\n`) : src + '\n' + audit + '\n')
  const out = execSync(`lean ${probe}`, { encoding: 'utf8', env: ENV })
  unlinkSync(probe)
  const dirty = out.split('\n').filter((l) => l.includes('depends on axioms'))
  if (dirty.length) issues.push(`${dirty.length} carry axioms: ${dirty.map((d) => d.split("'")[1]?.split('.').pop()).join(' ')}`)
  const audited = out.split('\n').filter((l) => l.includes('does not depend on any axioms')).length
  if (audited + dirty.length !== names.length) issues.push(`audited ${audited + dirty.length}/${names.length}`)

  if (issues.length) { rows.push(`  ✗ ${f.padEnd(18)} ${String(names.length).padStart(3)}  ${issues.join(', ')}`); bad++ }
  else rows.push(`  ✓ ${f.padEnd(18)} ${String(names.length).padStart(3)}  compiles · ${audited} axiom-free · no sorry`)
}

console.log(rows.join('\n'))
console.log(`\n  ${files.length} files · ${total} theorems · ${bad ? bad + ' FAILING' : 'all clean'}`)
process.exit(bad ? 1 : 0)
