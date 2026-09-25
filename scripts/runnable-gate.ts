#!/usr/bin/env node
/** ── EVERY NPM SCRIPT MUST BE ABLE TO RUN ─────────────────────────────────────────────────────────────────
 *
 *  Twenty-one scripts in this repository began with `tsx`. `tsx` is in no dependency list, is not in
 *  node_modules/.bin, and is not on this machine's PATH, so every one of them answered
 *  `sh: tsx: command not found` — including citations-gate, covered-gate, constants-gate, vacuity, blind and
 *  control-probe, which REFUSE, and including leads.ts, which is the tree's own report of gates nothing
 *  runs. The reporter of unrun gates was itself unrunnable. Every one of them ran correctly under plain
 *  `node`, which is what the other eighty scripts already use: the prefix protected nothing and cost the
 *  tree six refusers.
 *
 *  WHY THE EXISTING CHECK DID NOT SEE IT. src/api/gates.ts asks whether a CHAIN runs a gate, and records a
 *  decision in UNRUN_BY_DESIGN when none does. That is a question about wiring and it is the right question
 *  — but it assumes the gate would work if wired, and none of these would have. A gate that no chain runs
 *  is unprotected; a gate that CANNOT run is unprotected in a way no amount of wiring fixes, and the two
 *  were indistinguishable in the report. The domain of the check was narrower than the defect.
 *
 *  WHAT THIS REFUSES ON: any npm script whose leading executable is not resolvable — not `node`, not a
 *  shell builtin, not in node_modules/.bin, not on PATH. Static and instant: it resolves interpreters, it
 *  does not run the scripts, so a network tool or a twenty-minute benchmark costs nothing here. */
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { execSync } from 'node:child_process'

const scripts: Record<string, string> = JSON.parse(readFileSync('package.json', 'utf8')).scripts ?? {}
const total0 = Object.keys(scripts).length
const BUILTIN = new Set(['npm', 'npx', 'node', 'cd', 'echo', 'true', 'false', 'rm', 'cp', 'mv', 'mkdir', 'test', 'sh', 'bash', 'exit', 'set', 'for', 'if', 'git'])
const bin = new Set(existsSync('node_modules/.bin') ? readdirSync('node_modules/.bin') : [])

/** The leading word of each command in the script, across `&&`, `||`, `;` and `|`. A script that runs four
 *  tools is four chances to name something absent, and checking only the first would have missed three. */
const heads = (cmd: string): string[] =>
  cmd.split(/&&|\|\||;|\|/).map((part) => part.trim().split(/\s+/)[0] ?? '')
    .filter((w) => w.length > 0 && !w.startsWith('-') && !/^[A-Z_]+=/.test(w))

const onPath = (w: string): boolean => {
  try { execSync(`command -v ${JSON.stringify(w)}`, { stdio: 'pipe' }); return true } catch { return false }
}

const missing: { script: string; exe: string }[] = []
const seen = new Map<string, boolean>()
/** COUNTED SEPARATELY FROM `seen`, WHICH ONLY EVER HELD THE HARD CASES. This printed "0 distinct tool(s)
 *  checked" on a healthy tree, because everything resolved as a builtin or out of node_modules/.bin and
 *  `seen` is populated only by the PATH lookup. A green line reporting that nothing was examined is
 *  indistinguishable from a gate whose extractor has stopped returning anything. */
const examined = new Set<string>()
for (const [name, cmd] of Object.entries(scripts)) {
  for (const exe of heads(cmd)) {
    examined.add(exe)
    if (BUILTIN.has(exe) || bin.has(exe)) continue
    if (!seen.has(exe)) seen.set(exe, onPath(exe))
    if (!seen.get(exe)) missing.push({ script: name, exe })
  }
}
if (!examined.size) {
  console.log(`✗ runnable: ${total0} script(s) and not one executable name extracted — the extractor is broken,`)
  console.log(`  which this gate would otherwise report as every script being fine.`)
  process.exit(1)
}

const total = Object.keys(scripts).length

if (missing.length) {
  console.log(`✗ runnable: ${missing.length} of ${total} npm script(s) name an executable that does not resolve.`)
  for (const m of missing) console.log(`    ${m.script.padEnd(20)} → ${m.exe}: not a builtin, not in node_modules/.bin, not on PATH`)
  console.log(`\n  A script that cannot start is not a slow gate or an unwired one — it is an absent one, and it`)
  console.log(`  reads in every listing exactly like a gate that works. Either declare the tool as a dependency`)
  console.log(`  or invoke it with one that is already here.`)
  process.exit(1)
}
/** THE CONTROL IS IN gates-fire: planting `definitelynotarealbinary` as a script head must be refused here.
 *  Without it this prints a green line for a tree where `heads` has silently stopped returning anything. */
console.log(`✓ runnable: all ${total} npm script(s) name an executable that resolves — ${examined.size} distinct tool name(s) examined, ${seen.size} of them resolved against PATH.`)
