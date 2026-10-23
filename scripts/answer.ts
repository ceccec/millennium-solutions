#!/usr/bin/env node
// ANSWER — the `answer` tool: route one question (T2), then answer it with the verifier for its kind (T3, T4, T5).
// Nothing is answered TRUE, FALSE, or SOURCED without that verifier's certificate. Anything else is UNKNOWN, with its reason.
//
//   echo '91' | node scripts/answer.ts
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { route } from '../src/answer/route.ts'
import { problemOf, fuse, blockingStepOf, type ClayFusion } from '../src/answer/clay.ts'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const question = readFileSync(0, 'utf8').trim()
const kind = route(question)

const viaScript = (script: string, args: string[], input?: string): { value?: string; reason?: string; certificate?: unknown } => {
  const run = spawnSync('node', [script, ...args], { cwd: ROOT, input: input ?? '', encoding: 'utf8', timeout: 900_000 })
  try { return JSON.parse(String(run.stdout)) } catch { return { value: 'UNKNOWN', reason: `${script} gave no answer` } }
}

let answer: { value?: string; reason?: string; certificate?: unknown; problem?: ClayFusion }
if (kind === 'integer') {
  answer = viaScript('scripts/answer-verify-arith.ts', [], question)
} else if (kind === 'lean') {
  const name = [...question.matchAll(/^\s*theorem\s+([^\s:({[]+)/gm)].pop()?.[1] ?? ''
  answer = name ? viaScript('scripts/answer-verify-lean.ts', [name], question) : { value: 'UNKNOWN', reason: 'no theorem name found' }
} else if (kind === 'publication') {
  const doi = /10\.\d{4,}\/\S+/.exec(question)?.[0]?.replace(/[).,;]+$/, '') ?? ''
  answer = doi ? viaScript('scripts/answer-verify-doi.ts', [doi]) : { value: 'UNKNOWN', reason: 'no DOI found' }
} else if (kind === 'clay') {
  // THE FUSION: the question is joined to its formal statement, its adjacent theorem and that theorem's ledger key, and its
  // bound. The blocking step is stated from that record, so it names what is missing for this problem.
  const p = problemOf(question)
  if (p) {
    const fused = fuse(p)
    const ext = p.external
    if (ext?.arxiv && ext.titleHead) {
      const via = viaScript('scripts/answer-verify-arxiv.ts', [ext.arxiv, ext.titleHead])
      answer = via.value === 'SOURCED' ? { value: 'SOURCED', reason: via.reason, certificate: via.certificate, problem: fused } : { value: 'UNKNOWN', reason: blockingStepOf(fused), problem: fused }
    } else {
      answer = { value: 'UNKNOWN', reason: blockingStepOf(fused), problem: fused }
    }
  } else {
    answer = { value: 'UNKNOWN', reason: 'a Clay problem name was routed but no record matched it' }
  }
} else {
  answer = { value: 'UNKNOWN', reason: 'not a formalised question: it has no integer, Lean statement, DOI, or Clay problem to check' }
}

const checkedBy = { integer: 'answer-verify-arith', lean: 'answer-verify-lean', publication: 'answer-verify-doi', clay: 'clay-statements', text: 'route' }[kind]
const value = answer.value ?? 'UNKNOWN'
// The output shape of docs/ANSWER-SYSTEM.md: an UNKNOWN carries its blockingStep and no certificate; any other value carries its certificate.
const shape = value === 'UNKNOWN'
  ? { value, question, kind, blockingStep: answer.reason ?? 'no reason given', checkedBy, ...(answer.problem ? { problem: answer.problem } : {}) }
  : { value, question, kind, reason: answer.reason ?? '', certificate: answer.certificate ?? null, checkedBy }
console.log(JSON.stringify(shape, null, 1))
