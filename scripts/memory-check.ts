#!/usr/bin/env node
// MEMORY CHECK — the memory directory's index, files and links must agree, checked from the files themselves.
//
//   node scripts/memory-check.ts
//
// For every memory file: its frontmatter carries name, description and metadata.type (user, feedback, project or
// reference); the index MEMORY.md has one line that links to it; and every [[name]] in any file resolves to a memory.
// For every index line: the file it links exists. REFUSES, naming each defect; it never writes.
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

export const MEMDIR = '/Users/ceci/.claude/projects/-Users-ceci-github-ceccec-millennium-solutions/memory'
const TYPES = new Set(['user', 'feedback', 'project', 'reference'])

/** Frontmatter fields of one memory file, or null when it has none. */
export const frontmatter = (text: string): Record<string, string> | null => {
  const m = text.match(/^---\n([\s\S]*?)\n---/)
  if (!m) return null
  const out: Record<string, string> = {}
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^\s*([a-zA-Z_]+):\s*(.*)$/)
    if (kv) out[kv[1]] = kv[2].trim()
  }
  return out
}

export const check = (dir: string = MEMDIR): string[] => {
  const failures: string[] = []
  const files = readdirSync(dir).filter((f) => f.endsWith('.md') && f !== 'MEMORY.md')
  const index = readFileSync(join(dir, 'MEMORY.md'), 'utf8')
  const linked = new Set([...index.matchAll(/^- \[[^\]]+\]\(([^)]+\.md)\)/gm)].map((m) => m[1]))
  const names = new Map<string, string>()
  for (const f of files) {
    const fm = frontmatter(readFileSync(join(dir, f), 'utf8'))
    if (!fm) { failures.push(`${f}: no frontmatter`); continue }
    for (const k of ['name', 'description']) if (!fm[k]) failures.push(`${f}: frontmatter has no ${k}`)
    const type = fm.type ?? ''
    if (!TYPES.has(type) && !/type:\s*(user|feedback|project|reference)/.test(readFileSync(join(dir, f), 'utf8')))
      failures.push(`${f}: metadata.type is not user, feedback, project or reference`)
    if (fm.name) names.set(fm.name, f)
    if (!linked.has(f)) failures.push(`${f}: no line in MEMORY.md links to it`)
  }
  for (const l of linked) if (!existsSync(join(dir, l))) failures.push(`MEMORY.md links to ${l}, which does not exist`)
  for (const f of [...files, 'MEMORY.md']) {
    for (const m of readFileSync(join(dir, f), 'utf8').matchAll(/\[\[([^\]]+)\]\]/g))
      if (!names.has(m[1])) failures.push(`${f}: [[${m[1]}]] resolves to no memory`)
  }
  return failures
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const failures = check()
  if (failures.length) { for (const f of failures) console.log(`✗ ${f}`); console.log(`✗ memory-check: ${failures.length} defect(s)`); process.exit(1) }
  console.log('✓ memory-check: every index line links a file, every file has its frontmatter, every link resolves')
}
