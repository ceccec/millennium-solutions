#!/usr/bin/env node
// ANTI-FAKE — flag Lean code that claims a proof it does not have.
//
//   node scripts/anti-fake.ts --staged     check the Lean files staged for this commit (pre-commit)
//   node scripts/anti-fake.ts --all        check every Lean file in the repository (pre-push)
//   node scripts/anti-fake.ts <file>...    check the named files
//
// Each finding is a line the Lean kernel would not accept as a proof on its own:
//   sorry                 a placeholder that proves nothing
//   admit                 the same, under another name
//   axiom                 an assumption the kernel takes without proof
//   native_decide         trusts the compiler's evaluation, outside the kernel
//   implemented_by        swaps the code the kernel checks for other code
//   vacuous statement     a theorem whose statement is `True`, which proves nothing about the subject
//   trivial decide        `decide := true`, which skips the check it names
//
// Comments are removed before matching, so a warning written in a comment is not a finding.
// This is a pattern check. It catches the common ways of faking a proof; it cannot prove a proof is correct, and a
// clean run is not a verification. The Lean kernel remains the check that decides.
import { execFileSync } from 'node:child_process'
import { readFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)

const listFiles = (): string[] => {
  if (args.includes('--staged')) {
    return execFileSync('git', ['diff', '--cached', '--name-only', '--diff-filter=ACM'], { cwd: ROOT, encoding: 'utf8' })
      .split('\n').filter((f) => f.endsWith('.lean') && existsSync(resolve(ROOT, f)))
  }
  if (args.includes('--all')) {
    return execFileSync('git', ['ls-files', '*.lean'], { cwd: ROOT, encoding: 'utf8' })
      .split('\n').filter((f) => f.endsWith('.lean') && existsSync(resolve(ROOT, f)))
  }
  return args.filter((f) => f.endsWith('.lean'))
}

// Remove Lean comments (block /- … -/ and line --) while keeping line numbers.
const stripComments = (src: string): string => {
  let out = ''
  let i = 0
  let depth = 0
  while (i < src.length) {
    if (src.startsWith('/-', i)) { depth++; out += '  '; i += 2; continue }
    if (depth > 0 && src.startsWith('-/', i)) { depth--; out += '  '; i += 2; continue }
    if (depth > 0) { out += src[i] === '\n' ? '\n' : ' '; i++; continue }
    if (src.startsWith('--', i)) {
      while (i < src.length && src[i] !== '\n') { out += ' '; i++ }
      continue
    }
    out += src[i]
    i++
  }
  return out
}

const RULES: { name: string; re: RegExp; why: string }[] = [
  { name: 'sorry', re: /\bsorry\b/, why: 'a placeholder that proves nothing' },
  { name: 'admit', re: /\badmit\b/, why: 'a placeholder that proves nothing' },
  { name: 'axiom', re: /^\s*axiom\b/, why: 'an assumption the kernel takes without proof' },
  { name: 'native_decide', re: /\bnative_decide\b/, why: 'trusts the compiler evaluation, outside the kernel' },
  { name: 'implemented_by', re: /@\[\s*implemented_by\b|\bunsafe\s+def\b/, why: 'swaps the code the kernel checks for other code' },
  { name: 'vacuous statement', re: /\btheorem\s+\S+[^:]*:\s*True\s*:=/, why: 'a theorem whose statement is True proves nothing about its subject' },
  { name: 'trivial decide', re: /\bdecide\s*:=\s*true\b/, why: 'skips the check it names' },
]

type Finding = { file: string; line: number; rule: string; text: string; why: string }
const findings: Finding[] = []
const files = listFiles()

for (const f of files) {
  const src = stripComments(readFileSync(resolve(ROOT, f), 'utf8'))
  src.split('\n').forEach((text, i) => {
    for (const r of RULES) {
      if (r.re.test(text)) findings.push({ file: f, line: i + 1, rule: r.name, text: text.trim().slice(0, 160), why: r.why })
    }
  })
}

for (const x of findings) console.log(`✗ ${x.file}:${x.line} — ${x.rule}: ${x.why}\n    ${x.text}`)
console.log(`\n${findings.length === 0 ? '✓' : '✗'} anti-fake: ${files.length} Lean file(s) checked, ${findings.length} finding(s)`)
process.exit(findings.length === 0 ? 0 : 1)
