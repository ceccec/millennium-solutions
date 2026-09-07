#!/usr/bin/env node
/** ── ONE THEOREM, COMPILED ALONE — because a control that recompiles the file is a crack ──────────────────
 *
 *  Testing whether a theorem is vacuous means mutating it and checking the kernel refuses. Doing that by
 *  recompiling its whole file made each control cost minutes: a control on the Farey determinant was
 *  re-deciding two ten-thousand-wide digit walks that have nothing to do with it, and three controls ran
 *  serially for a quarter of an hour. The mutation touches one proposition; the check should too.
 *
 *  This extracts the target theorem into a file holding the source's imports, its `set_option`s and ALL of
 *  its definitions — definitions are free, since the kernel only evaluates what a `decide` actually needs —
 *  and then exactly one theorem. Compiling that is the whole check.
 *
 *      node scripts/probe.ts <file.lean> <theorem> ['find' 'replace']
 *
 *  With no mutation it confirms the theorem stands alone. With one, a NON-ZERO exit is the control firing:
 *  the mutation was refused, so the proposition has content. A zero exit means the mutant compiles, which
 *  means the theorem is true of something weaker than it claims — the finding this exists to surface.
 */
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const [file, thm, find, repl] = process.argv.slice(2)
if (!file || !thm) { console.log('usage: node scripts/probe.ts <file.lean> <theorem> [find replace]'); process.exit(1) }

const path = file.startsWith('src/proof/') ? file : `src/proof/${file}`
const src = readFileSync(path, 'utf8')

// The theorem, from its `theorem <name>` to the end of its proof. Any `set_option ... in` lines immediately
// above belong to it and come along, or the extracted copy hits a limit the original had raised.
const m = src.match(new RegExp(`((?:^set_option[^\\n]*in\\n)*)^theorem\\s+${thm}\\s*:([\\s\\S]*?):=\\s*by\\s+decide`, 'm'))
if (!m) { console.log(`✗ probe: no theorem \`${thm}\` closing by decide in ${path}`); process.exit(1) }
let body = `${m[1]}theorem ${thm} :${m[2]}:= by decide`

if (find) {
  if (!body.includes(find)) { console.log(`✗ probe: the mutation target is not in \`${thm}\` — the control would test nothing:\n    ${find}`); process.exit(1) }
  body = body.replace(find, repl ?? '')
}

// EVERYTHING THE THEOREM MIGHT LEAN ON, AND NOTHING IT PROVES. Definitions, the namespace, the imports and
// the file-level options are carried; every other theorem is dropped. A def that goes unused costs the
// kernel nothing, so carrying all of them is cheaper than working out which ones matter and being wrong.
const head = [...src.matchAll(/^(?:import\s+\S+|set_option\s+\S+\s+\S+)$/gm)].map((x) => x[0]).join('\n')
const ns = src.match(/^namespace\s+(\S+)/m)?.[1]
const opens = [...src.matchAll(/^open\s+.+$/gm)].map((x) => x[0]).join('\n')
const defs = [...src.matchAll(/^(?:\/--[\s\S]*?-\/\n)?(?:set_option[^\n]*in\n)*(?:def|abbrev)\s+[\s\S]*?(?=\n\n)/gm)].map((x) => x[0]).join('\n\n')

const dir = mkdtempSync(join(tmpdir(), 'probe-'))
const out = join(dir, 'Probe.lean')
writeFileSync(out, [head, ns ? `namespace ${ns}` : '', opens, defs, body, ns ? `end ${ns}` : ''].filter(Boolean).join('\n\n') + '\n')

const t0 = Date.now()
let ok = true, log = ''
try { log = String(execFileSync('lean', [out], { env: { ...process.env, LEAN_PATH: 'src/proof' }, stdio: 'pipe' })) }
catch (e: any) { ok = false; log = String(e?.stdout ?? '') + String(e?.stderr ?? '') }
const secs = ((Date.now() - t0) / 1000).toFixed(1)

if (!find) {
  console.log(ok ? `✓ probe: ${thm} compiles alone in ${secs}s` : `✗ probe: ${thm} does NOT compile alone in ${secs}s — the extraction is missing something:\n${log.slice(0, 600)}`)
  process.exit(ok ? 0 : 1)
}
console.log(ok
  ? `✗ probe: the MUTANT of ${thm} compiles (${secs}s) — the theorem holds with that changed, so it claims less than it appears to`
  : `✓ probe: the mutant of ${thm} is refused (${secs}s) — the control fires, the proposition has content`)
process.exit(ok ? 1 : 0)
