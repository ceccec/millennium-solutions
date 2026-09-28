#!/usr/bin/env node
/** ── MCP SELF-SUFFICIENCY — which tools a stranger can actually run, and whether each says so ──────────────
 *
 *  The deposit's claim is that a third party can check it "without an account, a key or a model". The MCP
 *  server is the surface that claim is made ON, so what each of its tools NEEDS is part of the claim. Three
 *  separable questions, and until this gate existed none was asked:
 *
 *    1 · WHAT DOES EACH TOOL REQUIRE — nothing but the published package, or the dev tree, a git checkout,
 *        the Lean toolchain, the ledger file, the network, a shared directory?
 *    2 · DOES THE DECLARATION MATCH THE CODE? src/mcp/index.ts declares it; this derives it from the handler
 *        source in scripts/mcp.ts. Two independent reads, so the declaration cannot drift from the handler —
 *        the same discipline as scripts/settled.ts.
 *    3 · WHEN A REQUIREMENT IS ABSENT, DOES THE TOOL SAY SO OR GUESS? A tool that silently returns a
 *        plausible value in a bare environment is worse than one that refuses: the caller cannot tell.
 *
 *  MY OWN CLASSIFIER WAS INFLATED BY THREE ON ITS FIRST RUN, always in the flattering direction — a larger
 *  self-sufficient count is the answer that clears me, and it got less scrutiny until I checked it:
 *    · `execFileSync('node', ['scripts/coils.ts'])` — the ARGV form. A regex for `execSync('node scripts/`
 *      walks straight past it, so coils and discoveries read as needing nothing.
 *    · `formulas` imports leanTheorems and leanSource, which READ src/proof/*.lean. A handler that reaches
 *      the tree through an import needs the tree exactly as much as one that shells out to it.
 *  So requirements are classified by the SYMBOLS a handler uses, against a table of what each symbol reaches,
 *  and not by the shape of a spawn call. That table is the one judgement here and it is small enough to check.
 *
 *    node scripts/mcp-gate.ts             report and FAIL on drift or a silent degradation
 *    node scripts/mcp-gate.ts --report    report only, exit 0 */
import { readFileSync } from 'node:fs'
import { TOOLS, NEEDS, type Need } from '../src/mcp/index.ts'
import { NETWORK } from '../src/api/gates.ts'

const src = readFileSync('scripts/mcp.ts', 'utf8')
// THE LAST HANDLER MUST NOT ABSORB THE REST OF THE FILE. Slicing from `export const HANDLERS` to the end gave
// the final handler — `audit` — every line that follows it, including the module-level table of reasons whose
// text contains the word "shared". So audit read as needing a shared directory it never touches: a false
// positive manufactured by the boundary, not found in the code. The object is closed at the first line that
// is exactly `}`, which is where a top-level object literal ends in this file's style.
const objStart = src.indexOf('export const HANDLERS')
const objEnd = (() => {
  const rest = src.slice(objStart)
  const m = rest.match(/^\}$/m)
  return m?.index !== undefined ? objStart + m.index + 1 : src.length
})()
const body = src.slice(objStart, objEnd)
const keys = [...body.matchAll(/^  ([a-z_0-9]+): (?:async )?\(/gm)]
const handlers = keys.map((k, i) => ({
  name: k[1], text: body.slice(k.index, i + 1 < keys.length ? keys[i + 1].index : body.length),
}))

/** WHAT EACH SYMBOL REACHES. The one judgement in this file; everything else is derived from it. */
const REACHES: [RegExp, Need][] = [
  [/execSync\(\s*['"`]git\b|execFileSync\(\s*['"`]git['"`]/, 'git'],
  [/execSync\(\s*[`'"]node scripts\/|execFileSync\(\s*['"`]node['"`]\s*,\s*\[\s*['"`]scripts\//, 'tree'],
  [/\bleanTheorems\b|\bleanFiles\b|\bleanSource\b|\bleanSealed\b/, 'tree'],
  [/scripts\/lean\.ts|lean-gen\.ts|seal-lean\.ts/, 'lean'],
  [/\bapiFetch\b|\bfetch\(|novelty\/index/, 'net'],
  [/discovered\.json|__ledger\(|\bloadLedger\b|\bisLive\b|\bisWithdrawn\b/, 'ledger'],
  [/FUSION|faceDir|peer_faces|\bfaces\b/, 'shared'],
]
/** ── A REQUIREMENT TRAVELS THROUGH A SPAWN ─────────────────────────────────────────────────────────────────
 *  A handler that runs `node scripts/api-discover.ts` needs the tree, which the table above sees. It also needs
 *  the NETWORK, and that is one level down in the script it spawned — invisible to any reading of the handler
 *  itself. The first version therefore read the tool as needing only the tree, and would have told a caller
 *  offline that it was available.
 *
 *  Resolved from a registry that already exists rather than a second list: src/api/gates.ts NETWORK names every
 *  script that reaches somebody else's server, for its own purposes. If a handler spawns one of those, the tool
 *  inherits `net`. Derived, and it stays correct when a script is added to NETWORK for unrelated reasons. */
const spawned = (t: string): string[] =>
  [...t.matchAll(/scripts\/([a-z0-9-]+)\.ts/g)].map((m) => m[1])

const derive = (t: string): Need[] => {
  const direct = REACHES.filter(([re]) => re.test(t)).map(([, need]) => need)
  const viaSpawn: Need[] = spawned(t).some((s) => NETWORK.has(s)) ? ['net'] : []
  const n = [...new Set([...direct, ...viaSpawn])].sort()
  return n.length ? n : ['core']
}

/** A DEGRADATION IS SILENT WHEN THE CALLER CANNOT TELL IT HAPPENED. A catch that returns a plausible value,
 *  or an absent file that becomes an empty result, produces an answer indistinguishable from a real one. */
const silentIn = (t: string): string[] => {
  const out: string[] = []
  if (/catch\s*\{\s*return\s*(?:\[\]|''|""|`'`|'v0'|0|null)\s*\}/.test(t)) out.push('a catch returns a plausible default instead of naming what is missing')
  if (/\?\s*__ledger\(\)\s*:\s*\[\]/.test(t)) out.push('an absent ledger becomes an empty ledger — zero is not the same as unstated')
  return out
}

const rows = handlers.map((h) => ({
  name: h.name, derived: derive(h.text), declared: (NEEDS[h.name] ?? []).slice().sort(), silent: silentIn(h.text),
}))

// the module-level degradations, which belong to no single handler but to every answer the server gives
const moduleSilent: string[] = []
const head = src.slice(0, src.indexOf('export const HANDLERS'))
if (/catch\s*\{\s*return\s*'v0'\s*\}/.test(head)) moduleSilent.push("`version` returns 'v0' outside a git checkout — the published package has no tags, so every answer would carry a version that is not a version")
if (/\?\s*__ledger\(\)\s*:\s*\[\]/.test(head)) moduleSilent.push('`loadLedger` returns an empty list when src/proof/discovered.json is absent — a caller reads zero theorems where the truth is that the ledger was not shipped')

const declaredNames = new Set(TOOLS.map((t) => t.name))
const noTool = rows.filter((r) => !declaredNames.has(r.name)).map((r) => r.name)
const noHandler = [...declaredNames].filter((d) => !rows.some((r) => r.name === d))
const undeclared = rows.filter((r) => !NEEDS[r.name])
const drift = rows.filter((r) => NEEDS[r.name] && r.derived.join('+') !== r.declared.join('+'))
const selfSufficient = rows.filter((r) => r.derived.length === 1 && r.derived[0] === 'core')
const silent = rows.filter((r) => r.silent.length)

const byNeed = new Map<Need, string[]>()
for (const r of rows) for (const n of r.derived) byNeed.set(n, [...(byNeed.get(n) ?? []), r.name])

console.log(`mcp-gate: ${rows.length} handler(s), ${TOOLS.length} declared tool(s)`)
console.log(`  SELF-SUFFICIENT — nothing but the published package: ${selfSufficient.length} of ${rows.length}`)
console.log(`    ${selfSufficient.map((r) => r.name).join(' ') || '(none)'}`)
for (const [need, names] of [...byNeed].filter(([n]) => n !== 'core').sort()) {
  console.log(`  needs ${need.padEnd(7)} ${names.length}: ${names.join(' ')}`)
}
for (const r of rows.filter((x) => x.derived.length > 1 || x.derived[0] !== 'core')) {
  console.log(`    ${r.name.padEnd(17)} ${r.derived.join('+')}`)
}

let bad = 0
if (noTool.length)    { bad++; console.log(`\n✗ ${noTool.length} handler(s) with no declared tool: ${noTool.join(' ')}`) }
if (noHandler.length) { bad++; console.log(`\n✗ ${noHandler.length} declared tool(s) with no handler: ${noHandler.join(' ')}`) }
if (undeclared.length) {
  bad++
  console.log(`\n✗ ${undeclared.length} handler(s) declare no requirement in src/mcp/index.ts NEEDS:`)
  for (const r of undeclared) console.log(`    ${r.name} — the source says it needs ${r.derived.join('+')}`)
}
if (drift.length) {
  bad++
  console.log(`\n✗ ${drift.length} tool(s) whose declaration disagrees with the handler:`)
  for (const r of drift) console.log(`    ${r.name}: declared ${r.declared.join('+') || '(nothing)'}, the source needs ${r.derived.join('+')}`)
}
if (silent.length || moduleSilent.length) {
  bad++
  console.log(`\n✗ ${silent.length + moduleSilent.length} silent degradation(s) — a caller in a bare environment gets a plausible answer:`)
  for (const r of silent) for (const s of r.silent) console.log(`    ${r.name}: ${s}`)
  for (const s of moduleSilent) console.log(`    (module): ${s}`)
}

if (!bad) {
  console.log(`\n✓ mcp-gate: every tool declares what it needs, the declaration matches the handler, and nothing`)
  console.log(`  degrades silently — an absent requirement is reported to the caller as absent.`)
} else if (!process.argv.includes('--report')) process.exit(1)
