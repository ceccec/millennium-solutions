#!/usr/bin/env node
/** ── DERIVED GATE — a committed derived file whose generator no chain step reaches ─────────────────────────
 *
 *  THE DEFECT, RECORDED TWICE BEFORE THIS GATE EXISTED. `llms.txt` shipped live at 924 while the tree said
 *  932; `metrics.json` shipped at 619. Neither generator was broken and neither file was wrong when written.
 *  Both were WRITTEN ONCE, COMMITTED, and then never regenerated, because no step of any chain ran the
 *  generator again — so the tree moved and the derived file stayed, and every gate read green because every
 *  gate checked the tree against itself.
 *
 *  WHAT THIS ADDS, AND WHAT IT DELIBERATELY DOES NOT REBUILD. src/api/gates.ts already answers "which
 *  scripts does a routine chain run" — `runByChain()` — and already keeps the record of why a refusing gate
 *  is deliberately outside every chain, in `UNRUN_BY_DESIGN`. This gate asks a question those do not: which
 *  COMMITTED DERIVED FILES have a generator that nothing runs. The chain answer is imported, not recomputed.
 *
 *  I WROTE THE SECOND PARSER FIRST AND IT WAS WRONG THREE TIMES, each time in the direction of reading a
 *  mention as an invocation. Recording them because the shapes recur and the third is not obvious:
 *
 *    1 · A COMMENT IS NOT A STEP. A `#` line in release.yml lists "cite-audit, vacuity, lean-agree, carry,
 *        coils, formulas and the rest" as things that never ran before a tag. Read as steps it made carry a
 *        root it is not.
 *    2 · A QUOTED COMMAND IN A MESSAGE IS NOT A STEP. scripts/zenodo-sync.ts fails with "run
 *        `npm run citations`" — remediation advice. Following it made citations.ts read as a chain step
 *        because another script tells a human how to run it. The tell was that deleting citations.ts from
 *        package.json entirely changed NOTHING in the verdict: a control that moves the subject and not the
 *        answer is measuring something else.
 *    3 · AND THE OPPOSITE ERROR. Restricting to exec calls then MISSED scripts/all.ts, which runs
 *        `spawn('npm', ['run', '-s', name])` over an array of eighteen names — an invocation that is not in
 *        the source as text. That reported carry.ts as an orphan while `npm run carry` runs in every `all`
 *        pass. src/api/gates.ts had already solved this and says so in its own comment: "a path-only
 *        extractor reported 42 scripts as unrun including `contradictions` ... the third extractor in one
 *        session that was narrower than the thing it read." Mine was the fourth. Using the existing one is
 *        not only less code, it is the only version that has been wrong and corrected already.
 *
 *  THE GENERATORS ARE DERIVED: every scripts/*.ts with a literal writeFileSync target that git TRACKS. An
 *  untracked output cannot ship stale because it does not ship; a tracked one is a promise.
 *
 *  A SCRIPT THAT WRITES A TRACKED FILE WITHOUT OWNING IT says so on its own line, because that is a fact
 *  about the script and belongs beside the code:
 *
 *      // derived-gate: not-a-generator — <the reason>
 *
 *  A GENERATOR NO CHAIN MAY RUN is recorded where this tree already records that judgement — UNRUN_BY_DESIGN
 *  in src/api/gates.ts — and not in a second registry here. Two registries of the same decision is how one
 *  of them goes stale.
 *
 *    node scripts/derived-gate.ts           report and FAIL on an unreachable generator
 *    node scripts/derived-gate.ts --report  report only, exit 0 */
import { readFileSync, readdirSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { runByChain, UNRUN_BY_DESIGN } from '../src/api/gates.ts'

// ── every file git tracks, so "committed" is asked of git and not guessed from a path shape ───────────────
const tracked = new Set(execSync('git ls-files', { encoding: 'utf8', maxBuffer: 64e6 }).split('\n').filter(Boolean))
const inChain = runByChain()

// ── THE GENERATORS: a script with a literal writeFileSync target that git tracks ──────────────────────────
type Gen = { script: string; outputs: string[]; exempt: string | null; kind: string | null }
const gens: Gen[] = []
for (const f of readdirSync('scripts').filter((x) => x.endsWith('.ts')).sort()) {
  const src = readFileSync(`scripts/${f}`, 'utf8')
  const outputs = [...new Set([...src.matchAll(/writeFileSync\(\s*['"`]([^'"`$]+)['"`]/g)].map((m) => m[1]))]
    .filter((p) => tracked.has(p))
  if (!outputs.length) continue
  const ex = src.match(/derived-gate:\s*(not-a-generator|manual)\s*—\s*([^\n]+)/)
  gens.push({ script: `scripts/${f}`, outputs, exempt: ex ? ex[2].trim() : null, kind: ex ? ex[1] : null })
}

const base = (p: string) => p.replace(/^scripts\//, '').replace(/\.ts$/, '')
const decided = gens.filter((g) => !g.exempt && !inChain.has(base(g.script)) && UNRUN_BY_DESIGN[base(g.script)])
const orphans = gens.filter((g) => !g.exempt && !inChain.has(base(g.script)) && !UNRUN_BY_DESIGN[base(g.script)])
const exempted = gens.filter((g) => g.exempt)

console.log(`derived-gate: ${inChain.size} script(s) a routine chain runs, per src/api/gates.ts`)
console.log(`  ${gens.length} script(s) write a file git tracks; ${gens.length - orphans.length - exempted.length - decided.length} of them are in the chain`)
for (const g of decided) {
  console.log(`  ○ ${g.script} → ${g.outputs.join(', ')}`)
  console.log(`      no chain runs it, BY RECORDED DECISION: ${UNRUN_BY_DESIGN[base(g.script)].slice(0, 150)}`)
  console.log(`      so this output holds whatever it last held — which is the cost of that decision, stated`)
}
for (const g of exempted) {
  console.log(`  ○ ${g.script} → ${g.outputs.join(', ')}`)
  console.log(`      not a generator of its output: ${g.exempt}`)
}
if (orphans.length) {
  console.log(`\n✗ derived-gate: ${orphans.length} generator(s) write a COMMITTED file and no chain step runs them.`)
  console.log(`  Each output ships whatever it held when it was last written by hand:`)
  for (const g of orphans) console.log(`    · ${g.script}  →  ${g.outputs.join(', ')}`)
  console.log(`  Put the generator in a chain step (\`gates\`, \`predocs:build\`, \`all\` or a workflow); or record`)
  console.log(`  WHY no chain may run it in UNRUN_BY_DESIGN in src/api/gates.ts; or, if it does not own that`)
  console.log(`  file, say so in the script with \`// derived-gate: not-a-generator — <reason>\`.`)
  if (!process.argv.includes('--report')) process.exit(1)
} else {
  console.log(`\n✓ derived-gate: every committed derived file has a generator the chain runs`)
}
