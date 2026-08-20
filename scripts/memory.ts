#!/usr/bin/env node
// MEMORY — derive the durable facts about this deposit from the deposit itself.
//
// Memory notes were written by hand and went stale the moment the thing they described changed: an entry
// still said the licence was CC-BY-NC-4.0 after the deposit moved to ND, and still described a lexical gate
// that has since been removed. A note that must be remembered to update is a note that will be wrong.
//
// What this emits is the MEASURED half — counts, structure, verdicts — read from the ledger, the Lean files
// and package.json at the moment it runs. Judgement (why a decision was taken, what a person prefers) is not
// derivable and is not touched here; it stays hand-written in the same file, below the generated block.
//
//   node scripts/memory.ts            print the derived block
//   node scripts/memory.ts --write    write it into the memory file, replacing only the generated block
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'

const MEMDIR = '/Users/ceci/.claude/projects/-Users-ceci-github-ceccec-millennium-solutions/memory'
const MEM = MEMDIR + '/deposit-state.md'
const INDEX = MEMDIR + '/MEMORY.md'
const BEGIN = '<!-- derived:begin -->', END = '<!-- derived:end -->'

const led = JSON.parse(readFileSync('src/proof/discovered.json', 'utf8')) as
  { key: string; revoked?: boolean; portable?: boolean }[]
const live = led.filter((e) => !e.revoked)
const leanFiles = readdirSync('src/proof').filter((f) => f.endsWith('.lean')).sort()
const src = Object.fromEntries(leanFiles.map((f) => [f, readFileSync(`src/proof/${f}`, 'utf8')]))
const theorems = leanFiles.flatMap((f) => [...src[f].matchAll(/^theorem /gm)]).length
const byDecide = leanFiles.flatMap((f) => [...src[f].matchAll(/^theorem [A-Za-z_0-9]+[\s\S]*?:=\s*by decide/gm)]).length
const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
const gate = readFileSync('scripts/honesty-gate.ts', 'utf8')
const gateLines = gate.split('\n').filter((l) => l.trim() && !l.trim().startsWith('//')).length
const mcpTools = [...readFileSync('scripts/mcp.ts', 'utf8').matchAll(/name: '([a-z_]+)', description:/g)].map((m) => m[1])
const scripts = readdirSync('scripts').filter((f) => /^(lean|lean-gen|seal-lean|trial-all|pages|verify|memory)\.ts$/.test(f)).sort()

const block = `${BEGIN}
*Derived by \`node scripts/memory.ts\` — do not hand-edit inside this block; re-run it. Hand-written judgement
belongs below the end marker, where nothing overwrites it.*

**Ledger** ${led.length} entries · **${live.length} live** · ${led.filter((e) => e.key.startsWith('lean_')).length} Lean-backed · ${led.filter((e) => e.revoked).length} revoked in place · ${led.filter((e) => e.portable).length} marked portable to Lean.
Live means backed by a Lean proof and nothing else. Dirty entries are marked with their reason and kept —
a chained ledger supersedes, never deletes, because a removal breaks the chain and a rewritten receipt is tamper.

**Lean layer** ${theorems} theorems across ${leanFiles.length} files (${leanFiles.join(', ')}), ${byDecide} closing \`by decide\`,
the rest \`rfl\`. Only \`by decide\` theorems are sealed: \`rfl\` on a declared constant proves the declaration,
which is the defect \`provenHere = 0\` was conceded to have.

**Gate** ${gateLines} lines of local logic — a re-export of the package implementation. The lexical gate
(22 word-lists, Glagolitic rosetta, negation parity) was removed by order. The rule now: a claim drains only
when it cites a theorem absent from the ledger. It does NOT drain overclaims, and it never decides truth.

**Licence** ${pkg.license} — matches the published Zenodo deposit; the repo previously disagreed with its own DOI record.

**Automation** ${scripts.map((s) => '`' + s + '`').join(', ')} · ${mcpTools.length} MCP tools (${mcpTools.slice(-6).join(', ')}).
Run \`ledger_status\` for current numbers rather than trusting any figure written down here.
${END}`

if (process.argv.includes('--write')) {
  const prior = existsSync(MEM) ? readFileSync(MEM, 'utf8') : ''
  const head = `---\nname: deposit-state\ndescription: Measured state of the millennium-solutions deposit — ledger, Lean layer, gate, automation\nmetadata:\n  type: project\n---\n\n# Deposit state\n\n`
  const tail = prior.includes(END) ? prior.slice(prior.indexOf(END) + END.length) : `\n\n## Judgement (hand-written, never generated)\n\n- Only theorems count; a TypeScript test reports one run, the kernel checks a proposition. See [[only-theorems-write-all-to-trial]].\n- Pairing prose with a test is unsound — the test can pass while the sentence says something else. Derive the sentence from the artefact instead. This failed four times in one session before it was fixed.\n- "Not generatable" needs the same scrutiny as "proved": digit reversal was dismissed as string manipulation when digits are arithmetic. See [[honest-floor-discipline]].\n- npm @uuidna/uuidna 0.2.6 passes every overclaim its predecessor drained. Never adopt a gate without probing it first.\n`
  writeFileSync(MEM, head + block + tail)

  // ── DRAIN THE INDEX. MEMORY.md is what loads into context every session, so a stale number there is read
  //    as current every time — the deposit-state line had been asserting a ledger size that was 504 theorems
  //    out of date, and a gate that no longer exists. Hand-editing is what let it drift, so the line is
  //    derived here instead. Only the deposit-state pointer is owned; every other line is left alone.
  if (existsSync(INDEX)) {
    const idx = readFileSync(INDEX, 'utf8')
    const line = `- [Deposit state](deposit-state.md) — MEASURED, self-derived (run: node scripts/memory.ts --write): ledger ${led.length} = ${led.length / 8} × 8, ${live.length} live / ${led.length - live.length} revoked · ${leanFiles.length} Lean files, ${theorems} theorems, ${byDecide} by decide · gate ${gateLines} line(s), a re-export that checks citations and does NOT drain overclaims. Trust this over any figure written elsewhere in this index; for live numbers call ledger_status.`
    const next = idx.split('\n').map((l) => l.startsWith('- [Deposit state]') ? line : l).join('\n')
    if (next !== idx) { writeFileSync(INDEX, next); console.log('✓ memory: MEMORY.md — deposit-state pointer re-derived') }
  }

  // ── REPORT STALE NUMBERS ELSEWHERE. Other memory files are hand-written judgement and are NOT rewritten:
  //    a note may legitimately record what was true when it was written. But a figure presented as CURRENT
  //    that contradicts measurement is a drain, and silence about it is how the index went stale. Named, not
  //    edited — the distinction between a dated record and a false claim is the author's to make.
  const stale: string[] = []
  for (const f of readdirSync(MEMDIR).filter((x) => x.endsWith('.md') && x !== 'deposit-state.md')) {
    const txt = readFileSync(MEMDIR + '/' + f, 'utf8')
    for (const m of txt.matchAll(/ledger (\d{3,5})\b/g)) {
      const n = Number(m[1])
      if (n !== led.length && !/histor|superseded|was |earlier|→/i.test(txt.slice(Math.max(0, m.index - 120), m.index)))
        stale.push(f + ': "ledger ' + n + '" — measured ' + led.length)
    }
  }
  if (stale.length) {
    console.log('· memory: ' + stale.length + ' figure(s) presented as current that measurement contradicts —')
    for (const t of stale) console.log('    ' + t)
    console.log('  not rewritten: a note may record what was true when written. Mark it historical or correct it.')
  }
  console.log(`✓ memory: ${MEM.split('/').pop()} — derived block written, judgement preserved`)
} else console.log(block)
