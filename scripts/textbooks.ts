#!/usr/bin/env node
// TEXTBOOKS — every theorem in qpu's Qpu/Textbook.lean decoded into a human particle, read from the sibling checkout.
//
// qpu seals each textbook example as an integer theorem with one docstring — the human sentence — generated from its
// src/quantum/textbook-theorems.ts. That file is in qpu's local tree only: not on github.com/uuidna/qpu's public main,
// not in the installed @uuidna/qpu. So this reads the sibling checkout (QPU_DIR, default ~/github/uuidna/qpu), records
// the exact commit and whether it is pushed, and says NOT MEASURED — exit 2 — when the checkout is absent.
//
// A PARTICLE per theorem: its key, its base and variant kind, the human sentence, the qpu examples it names, the
// statement, its coin (toUuid of "<key> : <statement>"), the numerals the sentence and the statement share, whether it
// is physics, the derivation its sentence names, and whether this deposit derives it independently
// (src/proof/quantum_textbooks.lean). Nothing is judged by hand: every field is read off the two texts.
//
// THE CONTROL: a synthetic sentence and statement with no numeral in common must decode as "the sentence states none of the statement's numbers", or the run fails
// — a decoder that cannot say "these disagree" decodes nothing.
//
//   node scripts/textbooks.ts                  decode and write evidence/textbooks/
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { toUuid } from '../src/0/index.ts'

const QPU = process.env.QPU_DIR ?? join(homedir(), 'github', 'uuidna', 'qpu')
const FILE = 'src/quantum/processing/unit/lean/Qpu/Textbook.lean'
const OUT = 'evidence/textbooks'
if (!existsSync(join(QPU, FILE))) {
  console.log(JSON.stringify({ status: 'NOT MEASURED', needs: join(QPU, FILE), note: 'qpu\'s textbooks are read from its checkout; set QPU_DIR' }))
  process.exit(2)
}
const git = (...a: string[]) => { try { return execFileSync('git', ['-C', QPU, ...a], { encoding: 'utf8' }).trim() } catch { return '' } }
const commit = git('log', '-1', '--format=%H', '--', FILE)
const remoteMain = git('ls-remote', 'origin', 'refs/heads/main').split('\t')[0]
const pushed = remoteMain ? git('merge-base', '--is-ancestor', commit, remoteMain) === '' && (() => { try { execFileSync('git', ['-C', QPU, 'merge-base', '--is-ancestor', commit, remoteMain]); return true } catch { return false } })() : false

// ── decode ─────────────────────────────────────────────────────────────────────────────────────────────────────────
const VARIANTS = ['converse_refuted', 'contrapositive', 'converse', 'reflected'] as const
const PHYSICS = /\b(quantum|qubit|qudit|gate|circuit|hadamard|shor|grover|qft|teleport|entangl|superposition|bell|chsh|tsirelson|clifford|stabili[sz]er|steane|surface code|error.correct|cloning|holevo|solovay|eastin|gottesman|simon|bernstein|deutsch|vqe|hamiltonian|willow|sycamore|processor|anneal|boson|amplitude|phase|measurement|decoher|fidelity|unitary|pauli|cnot|toffoli|echo)/i
const SUPER: Record<string, string> = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' }
// THE SENTENCES SPELL THEIR NUMBERS: "fourteen faces, eight triangles and six squares". A reader of digits alone decoded
// 102 of 391 as mismatched, nearly all of them this; number words, compounds ("thirty-two", "seven hundred") included.
const WORD: Record<string, number> = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
  twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90, hundred: 100, thousand: 1000,
  half: 2, twice: 2, double: 2, once: 1, single: 1, pair: 2, both: 2, none: 0, nothing: 0 }
const numerals = (s: string): Set<string> => {
  const out = new Set([...(s.match(/\d+\.\d+/g) ?? []).map((d) => String(Number(d.replace(".", "")))), ...(s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (m) => '^' + [...m].map((c) => SUPER[c]).join('')).match(/\d+/g) ?? []).map((d) => String(Number(d)))])
  const words = [...s.toLowerCase().matchAll(/[a-z]+/g)].map((m) => m[0]).filter((w) => w in WORD)
  for (let i = 0; i < words.length; i++) {
    let v = WORD[words[i]]
    if (v >= 20 && v < 100 && WORD[words[i + 1]] < 10) v += WORD[words[++i]]          // thirty-two
    if (WORD[words[i + 1]] >= 100) { out.add(String(v)); v *= WORD[words[++i]] }       // seven hundred
    out.add(String(v))
  }
  return out
}
/** quantum_textbooks.lean re-derives these qpu numbers from the operators */
const DERIVED_HERE: Record<string, string> = {
  textbook_tsirelson: 'tsirelsons_eight_is_the_square_of_the_circuits_s',
  textbook_eastin_knill: 'the_group_generated_by_h_and_s_has_exactly_twenty_four_classes',
  textbook_solovay_kitaev: 't_has_order_exactly_eight_and_does_not_commute_with_h',
  textbook_simon: 'simons_measured_strings_for_period_eleven_are_exactly_two_of_four',
  textbook_bernstein_vazirani: 'one_query_recovers_every_three_bit_hidden_string',
  textbook_deutsch_jozsa: 'one_query_separates_every_balanced_from_every_constant_function',
  textbook_grover_one_iteration: 'one_grover_iteration_finds_every_marked_item_of_four_with_certainty',
  textbook_no_cloning: 'linearity_forbids_perfect_cloning_and_the_optimal_copy_has_fidelity_five_sixths',
}

/** EACH COIN HOLDS ITS SKILLS AND TOOLS: its skills are the families of the qpu doors that exercise it — the door
 *  `algorithm-shor-15` is the skill `algorithm` — and its tools are those doors, this decoder, and the Lean theorem that
 *  re-derives it here when one does. Read off the sentence's own (examples: …), not assigned. */
export type Particle = {
  key: string; base: string; variant: 'base' | (typeof VARIANTS)[number]; sentence: string; examples: string[]
  statement: string; coin: string; shared: string[]; statesNumbers: boolean; physics: boolean; derivedBy: string | null; derivedHere: string | null
  skills: string[]; tools: string[]
}

const decode = (key: string, doc: string, statement: string): Particle => {
  const variant = VARIANTS.find((v) => key.endsWith('_' + v)) ?? 'base'
  const base = variant === 'base' ? key : key.slice(0, -(variant.length + 1))
  const examples = [...doc.matchAll(/\(examples:\s*([^)]*)\)/g)].flatMap((m) => m[1].split(',').map((x) => x.trim()).filter((x) => x && x !== 'none yet'))
  const sentence = doc.replace(/\s*\(examples:[^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim()
  const a = numerals(sentence), b = numerals(statement)
  const shared = [...b].filter((n) => a.has(n))
  return {
    key, base, variant, sentence, examples, statement, coin: toUuid(`${key} : ${statement}`), shared,
    // a variant restates its base by shape; agreement is the base's question, so a variant inherits it below
    statesNumbers: b.size === 0 || shared.length > 0,
    physics: PHYSICS.test(sentence + ' ' + base.replace(/_/g, ' ')),
    derivedBy: sentence.match(/proven by (\w+)/)?.[1] ?? null,
    derivedHere: DERIVED_HERE[base] ?? null,
    skills: [...new Set(examples.map((e) => e.split('-')[0]))],
    tools: [...examples.map((e) => `qpu example · ${e}`), 'npm run textbooks', ...(DERIVED_HERE[base] ? ['npm run lean · quantum_textbooks.lean'] : [])],
  }
}

// the control first: a sentence sharing no numeral with its statement must decode as stating none of its numbers
const control = decode('textbook_control_mismatch', 'the sentence says seven is 7 (examples: control)', '2 + 2 = 4')
if (control.statesNumbers) { console.error('✗ textbooks: the control decoded as stating its numbers — the decoder cannot tell a sentence from its statement'); process.exit(1) }

/** `theorem <key> <binders> : <statement> := …` — binders are balanced (…) {…} […] groups, nested brackets and all,
 *  so `(hσ0 : (4) ≤ σ)` and `{α β : Type}` are skipped whole; the statement runs to the first := outside brackets. */
const parseTheorem = (thm: string): { key: string; statement: string } | null => {
  const head = thm.match(/^theorem\s+(textbook_[A-Za-z0-9_]+)/)
  if (!head) return null
  let i = head[0].length
  const close: Record<string, string> = { '(': ')', '{': '}', '[': ']', '⦃': '⦄' }
  for (;;) {
    while (thm[i] === ' ') i++
    if (!close[thm[i]]) break
    let depth = 0
    for (; i < thm.length; i++) { if (close[thm[i]]) depth++; else if (Object.values(close).includes(thm[i])) depth--; if (depth === 0) { i++; break } }
  }
  if (thm[i] !== ':') return null
  let depth = 0, j = i + 1
  for (; j < thm.length; j++) {
    const c = thm[j]
    if (close[c]) depth++
    else if (Object.values(close).includes(c)) depth--
    else if (depth === 0 && c === ':' && thm[j + 1] === '=') break
  }
  return { key: head[1], statement: thm.slice(i + 1, j).trim() }
}

const lines = readFileSync(join(QPU, FILE), 'utf8').split('\n')
const particles: Particle[] = []
for (let i = 0; i < lines.length; i++) {
  if (!lines[i].startsWith('/--')) continue
  let doc = lines[i]
  while (!doc.includes('-/') && i + 1 < lines.length) doc += ' ' + lines[++i]
  let thm = ''
  while (i + 1 < lines.length && !lines[i + 1].startsWith('/--') && !(thm && lines[i + 1].trim() === '')) thm += (thm ? ' ' : '') + lines[++i].trim()
  const m = parseTheorem(thm)
  if (m) particles.push(decode(m.key, doc.replace(/^\/--\s*|\s*-\/$/g, ''), m.statement))
}
const bases = new Map(particles.filter((p) => p.variant === 'base').map((p) => [p.key, p]))
for (const p of particles) if (p.variant !== 'base') p.statesNumbers = bases.get(p.base)?.statesNumbers ?? p.statesNumbers

// EVERY TOOL A COIN NAMES MUST RESOLVE: each qpu example door against qpu's own examples table, read from the same commit
// qpu's examples live in processing/examples.ts AND in every toolbox file — each { id, tool } names its door
const PROCESSING = join(QPU, 'src/quantum/processing')
const tsFiles = (d: string): string[] => readdirSync(d).flatMap((e) => { const f = join(d, e); return statSync(f).isDirectory() ? tsFiles(f) : f.endsWith('.ts') && !f.endsWith('.test.ts') ? [f] : [] })
const toolOfDoor = new Map<string, string>()
for (const f of tsFiles(PROCESSING)) for (const m of readFileSync(f, 'utf8').matchAll(/\{\s*id:\s*'([^']+)',\s*tool:\s*'([^']+)'/g)) toolOfDoor.set(m[1], m[2])
const doors = new Set(toolOfDoor.keys())
const unresolvedDoors = [...new Set(particles.flatMap((p) => p.examples.filter((e) => !doors.has(e))))]
// a coin's skills are the doors' own tools, read from qpu's examples — the id prefix only when a door is unknown
for (const p of particles) p.skills = [...new Set(p.examples.map((e) => toolOfDoor.get(e) ?? e.split('-')[0]))]

const base = particles.filter((p) => p.variant === 'base')
const summary = {
  qpu: { repo: 'uuidna/qpu', file: FILE, commit, pushed, remoteMain: remoteMain || null },
  theorems: particles.length, base: base.length,
  variants: Object.fromEntries(VARIANTS.map((v) => [v, particles.filter((p) => p.variant === v).length])),
  physics: base.filter((p) => p.physics).length, notPhysics: base.filter((p) => !p.physics).length,
  namesDerivation: base.filter((p) => p.derivedBy).length, derivedHere: base.filter((p) => p.derivedHere).length,
  sentenceStatesNone: base.filter((p) => !p.statesNumbers).map((p) => p.key),
  skills: [...new Set(base.flatMap((p) => p.skills))].length,
  doorsKnown: doors.size, unresolvedDoors,
  control: "a sentence sharing no numeral with its statement decoded as stating none of the statement's numbers",
}
mkdirSync(OUT, { recursive: true })
writeFileSync(`${OUT}/latest.json`, JSON.stringify({ ...summary, particles }, null, 1) + '\n')
console.log(JSON.stringify(summary, null, 1))
