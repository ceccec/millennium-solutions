#!/usr/bin/env node
// PREFIX-CHECK — a name that repeats the repository it lives in carries no information, and a served name with that
// prefix is a second, longer name for the same thing. This flags them.
//
//   node scripts/prefix-check.ts <repoDir> <prefix> [prefix ...]
//   node scripts/prefix-check.ts ~/github/uuidna/qpu qpu_
//
// It scans the TypeScript source (src/ and scripts/, comments removed) for identifiers and string literals that begin with
// a listed prefix, and reports each one with its file and line. A name can be a served tool, a dispatch key, or a local
// identifier: all of them are reported, because each carries the repeated prefix. Exit 1 when any is found.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

const [repoArg, ...prefixes] = process.argv.slice(2)
if (!repoArg || prefixes.length === 0) {
  console.log('usage: prefix-check.ts <repoDir> <prefix> [prefix ...]')
  process.exit(2)
}
const repo = resolve(repoArg.replace(/^~/, process.env.HOME ?? '~'))

const walk = (dir: string): string[] => readdirSync(dir).flatMap((e) => {
  if (['node_modules', 'dist', '.git', '.lake', '.claude'].includes(e)) return []
  const p = join(dir, e)
  if (statSync(p).isDirectory()) return walk(p)
  return /\.(ts|tsx)$/.test(e) && !/\.d\.ts$/.test(e) ? [p] : []
})

const stripComments = (src: string): string =>
  src.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' ')).replace(/\/\/[^\n]*/g, (m) => ' '.repeat(m.length))

const findings: { file: string; line: number; name: string; prefix: string }[] = []
const dirs = ['src', 'scripts'].map((d) => join(repo, d)).filter((d) => {
  try { return statSync(d).isDirectory() } catch { return false }
})
for (const dir of dirs) {
  for (const file of walk(dir)) {
    const text = stripComments(readFileSync(file, 'utf8'))
    text.split('\n').forEach((line, i) => {
      for (const prefix of prefixes) {
        const re = new RegExp(`(?<![A-Za-z0-9_])(${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[A-Za-z0-9_]*)`, 'g')
        for (const m of line.matchAll(re)) {
          findings.push({ file: relative(repo, file), line: i + 1, name: m[1]!, prefix })
        }
      }
    })
  }
}

for (const f of findings) console.log(`✗ ${f.file}:${f.line} — ${f.name} repeats the prefix ${f.prefix}`)
const names = new Set(findings.map((f) => f.name))
console.log(`\n${findings.length === 0 ? '✓' : '✗'} prefix-check: ${findings.length} occurrence(s), ${names.size} distinct name(s), prefixes ${prefixes.join(', ')}`)
process.exit(findings.length === 0 ? 0 : 1)
