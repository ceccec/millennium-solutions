#!/usr/bin/env node
// LEAN-SPLIT — break one large Lean statement into smaller questions, each answered yes or no by lean-ask.
//
//   node scripts/lean-split.ts < source.lean
//
// The input is a Lean source whose last theorem has the form `theorem NAME : P := by decide` (or any tactic proof),
// where P is a conjunction `A ∧ B ∧ ...`. Definitions before the theorem are kept, because each part needs them.
// The conjunction is split at its top level (parentheses and brackets are respected), and each conjunct becomes its
// own theorem, `NAME_1`, `NAME_2`, ... The parts are answered one at a time by scripts/lean-ask.ts, so a single large
// question never hides which part failed.
//
// Each part gets a boolean answer:
//   true   the part compiles, has no sorry, and depends on no axiom beyond the kernel's own
//   false  the part does not compile (the Lean messages say why), or it uses sorry
// and the whole statement is true only when every part is true. An input with no conjunction is one part.
import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = readFileSync(0, 'utf8')

// The last theorem and its statement, up to the `:=` that starts its proof.
const match = [...source.matchAll(/^theorem\s+([^\s:({[]+)\s*:\s*/gm)].pop()
if (!match || match.index === undefined) {
  console.log(JSON.stringify({ status: 'REFUSED', why: 'no theorem found in the input' }, null, 1))
  process.exit(0)
}
const name = match[1]!
const start = match.index + match[0].length
const proofAt = source.indexOf(':=', start)
if (proofAt < 0) {
  console.log(JSON.stringify({ status: 'REFUSED', why: 'the theorem has no := proof' }, null, 1))
  process.exit(0)
}
const statement = source.slice(start, proofAt).trim()
const preamble = source.slice(0, match.index)

// Split at top-level ∧: depth counts ( [ { and their closers; ∧ counts only at depth 0.
const split = (p: string): string[] => {
  const parts: string[] = []
  let depth = 0
  let cur = ''
  for (const ch of p) {
    if (ch === '(' || ch === '[' || ch === '{') depth++
    if (ch === ')' || ch === ']' || ch === '}') depth--
    if (ch === '∧' && depth === 0) {
      parts.push(cur.trim())
      cur = ''
    } else {
      cur += ch
    }
  }
  if (cur.trim()) parts.push(cur.trim())
  return parts
}

const conjuncts = split(statement)
type Answer = { part: string; statement: string; answer: boolean; reason: string }
const answers: Answer[] = []

conjuncts.forEach((c, i) => {
  const partName = conjuncts.length === 1 ? name : `${name}_${i + 1}`
  const body = `${preamble}theorem ${partName} : ${c} := by decide\n`
  const run = spawnSync('node', ['scripts/lean-ask.ts'], { cwd: ROOT, input: body, encoding: 'utf8', timeout: 300_000 })
  let parsed: { status?: string; compiles?: boolean; sorry?: boolean; messages?: string[]; axioms?: string[] } = {}
  try { parsed = JSON.parse(String(run.stdout)) } catch { /* handled below */ }
  if (parsed.status !== 'ANSWERED') {
    answers.push({ part: partName, statement: c, answer: false, reason: `lean-ask did not answer: ${parsed.status ?? 'no output'}` })
    return
  }
  const msgs = (parsed.messages ?? []).filter((m) => /error/.test(m))
  if (!parsed.compiles || parsed.sorry) {
    answers.push({ part: partName, statement: c, answer: false, reason: (msgs[0] ?? (parsed.sorry ? 'uses sorry' : 'does not compile')).replace(/^.*?Question\.lean:\d+:\d+: /, '') })
    return
  }
  answers.push({ part: partName, statement: c, answer: true, reason: parsed.axioms?.find((a) => a.includes(partName))?.trim() ?? 'compiles' })
})

const all = answers.every((a) => a.answer)
console.log(JSON.stringify({
  status: 'ANSWERED',
  theorem: name,
  parts: answers.length,
  true: answers.filter((a) => a.answer).length,
  false: answers.filter((a) => !a.answer).length,
  holds: all,
  answers,
  note: 'each part is a separate Lean check; the whole statement holds only when every part does',
}, null, 1))
