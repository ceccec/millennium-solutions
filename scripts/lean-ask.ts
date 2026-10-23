#!/usr/bin/env node
// LEAN-ASK — answer one Lean question from its source: does it compile, does it use `sorry`, and which axioms
// does each theorem depend on. It reads the source on stdin and writes JSON to stdout, so the MCP tool `lean_ask`
// can shell to it with the question as input and no file in the tree.
//
// The source is compiled in a fresh temporary directory, never in the tree. `#print axioms` is appended for every
// theorem the source declares, so the answer covers each theorem the question states, not only the last one.
// `lean` runs from the repository root, so elan picks the toolchain pinned in lean-toolchain.
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = readFileSync(0, 'utf8')
// A theorem inside `namespace A.B` is named A.B.name to the kernel, so `#print axioms` must use the qualified name.
// Namespaces are tracked by their `namespace` and `end` lines; a bare name inside a namespace is an unknown constant.
const scope: string[] = []
const theorems: string[] = []
for (const line of source.split('\n')) {
  const ns = /^\s*namespace\s+(\S+)/.exec(line)
  if (ns) { scope.push(ns[1]!); continue }
  const end = /^\s*end\s+(\S+)/.exec(line)
  if (end && scope.length && scope[scope.length - 1] === end[1]) { scope.pop(); continue }
  const th = /^\s*theorem\s+([^\s:({[]+)/.exec(line)
  if (th) theorems.push([...scope, th[1]!].join('.'))
}

const dir = mkdtempSync(join(tmpdir(), 'lean-ask-'))
const file = join(dir, 'Question.lean')
writeFileSync(file, source + '\n' + theorems.map((t) => `#print axioms ${t}`).join('\n') + '\n')

type Answer = {
  status: 'ANSWERED' | 'ABSENT'
  compiles: boolean
  sorry: boolean
  theorems: string[]
  axioms: string[]
  messages: string[]
  note?: string
}

const answer = (a: Answer) => process.stdout.write(JSON.stringify(a, null, 1) + '\n')

try {
  let out = ''
  let compiles = true
  try {
    out = execFileSync('lean', [file], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
  } catch (e) {
    compiles = false
    const err = e as { code?: string; stdout?: Buffer | string; stderr?: Buffer | string }
    if (err.code === 'ENOENT') {
      answer({ status: 'ABSENT', compiles: false, sorry: false, theorems, axioms: [], messages: [], note: 'the Lean toolchain is not on PATH, so the question cannot be answered here' })
      process.exit(0)
    }
    out = String(err.stdout ?? '') + String(err.stderr ?? '')
  }
  const lines = out.split('\n').filter((l) => l.trim() !== '')
  answer({
    status: 'ANSWERED',
    compiles,
    sorry: lines.some((l) => /sorryAx|declaration uses ['"]sorry['"]/.test(l)),
    theorems,
    axioms: lines.filter((l) => /depends on axioms|does not depend on any axioms/.test(l)),
    messages: lines.slice(0, 200),
  })
} finally {
  rmSync(dir, { recursive: true, force: true })
}
