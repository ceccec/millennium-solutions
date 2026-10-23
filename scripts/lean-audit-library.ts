#!/usr/bin/env node
// LEAN-AUDIT-LIBRARY — audit every theorem a Lean library declares, not only the ones a tool serves.
//
//   node scripts/lean-audit-library.ts <projectDir> <srcDir> <Prefix>
//
//   projectDir  the Lake project (the directory holding lakefile.lean and lean-toolchain)
//   srcDir      the library's source root, relative to projectDir, e.g. src/lean
//   Prefix      the module prefix the library's files import as, e.g. Qpu  (src/lean/Qpu/Mint.lean → Qpu.Mint)
//
// It builds the library, then for each module writes a check file in a temporary directory that imports the
// module and prints `#print axioms` for every theorem the module declares, including theorems inside namespaces.
// Each theorem is then classed: axiom-free, standard-axioms-only (propext, Quot.sound, or propext alone), or
// carrying any other axiom. A theorem that fails to compile, a `sorry`, or a name the check cannot find is a failure.
//
// Nothing is written into projectDir beyond Lake's own build output, and the temporary directory is removed.
import { spawnSync } from 'node:child_process'
import { readdirSync, readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const [projectArg, srcArg, prefix] = process.argv.slice(2)
if (!projectArg || !srcArg || !prefix) {
  console.error('usage: lean-audit-library.ts <projectDir> <srcDir> <Prefix>')
  process.exit(2)
}
const project = resolve(projectArg)
const libDir = join(project, srcArg, prefix)
const STANDARD = new Set(['propext', 'Quot.sound'])

type Module = { mod: string; names: string[] }

// Declared theorem names, qualified by the namespaces that enclose them.
function declared(file: string): string[] {
  const stack: string[] = []
  const names: string[] = []
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const ns = line.match(/^namespace\s+(\S+)/)
    if (ns) { stack.push(ns[1]!); continue }
    const en = line.match(/^end\s+(\S+)/)
    if (en) { const i = stack.lastIndexOf(en[1]!); if (i >= 0) stack.splice(i, 1); continue }
    const th = line.match(/^\s*theorem\s+([^\s:({[]+)/)
    if (th) names.push([...stack, th[1]!].join('.'))
  }
  return names
}

function modules(dir: string, base: string): Module[] {
  const out: Module[] = []
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) out.push(...modules(p, `${base}.${e.name}`))
    else if (e.name.endsWith('.lean')) {
      const mod = `${base}.${e.name.replace(/\.lean$/, '')}`
      const names = declared(p)
      if (names.length) out.push({ mod, names })
    }
  }
  return out
}

// 1 · build the library, so every module the checks import has its compiled output.
const build = spawnSync('lake', ['build', prefix], { cwd: project, encoding: 'utf8' })
if (build.status !== 0) {
  console.log(JSON.stringify({ status: 'BUILD_FAILED', rc: build.status, messages: String(build.stdout + build.stderr).split('\n').slice(-40) }, null, 1))
  process.exit(0)
}

// 2 · enumerate and check.
const mods = modules(libDir, prefix)
const scratch = mkdtempSync(join(tmpdir(), 'lean-audit-'))
const results: { module: string; theorem: string; verdict: string }[] = []
const failures: string[] = []
try {
  for (const { mod, names } of mods) {
    const file = join(scratch, mod.replace(/\./g, '_') + '.lean')
    writeFileSync(file, `import ${mod}\n` + names.map((n) => `#print axioms ${n}`).join('\n') + '\n')
    const run = spawnSync('lake', ['env', 'lean', file], { cwd: project, encoding: 'utf8' })
    const out = String(run.stdout) + String(run.stderr)
    if (run.status !== 0) failures.push(`${mod}: does not compile`)
    if (/declaration uses ['"]sorry['"]|sorryAx/.test(out)) failures.push(`${mod}: uses sorry`)
    for (const n of names) {
      const line = out.split('\n').find((l) => l.includes(`'${n}' `) || l.includes(`'${n}'\n`))
      let verdict: string
      if (!line) verdict = 'unknown'
      else if (/does not depend on any axioms/.test(line)) verdict = 'axiom-free'
      else {
        const m = line.match(/depends on axioms: \[([^\]]*)\]/)
        const axs = m ? m[1]!.split(',').map((s) => s.trim()) : []
        verdict = axs.length > 0 && axs.every((a) => STANDARD.has(a)) ? 'standard-axioms' : 'custom-axiom'
      }
      results.push({ module: mod, theorem: n, verdict })
    }
  }
} finally {
  rmSync(scratch, { recursive: true, force: true })
}

const count = (v: string) => results.filter((r) => r.verdict === v).length
const custom = results.filter((r) => r.verdict === 'custom-axiom' || r.verdict === 'unknown')
const status = failures.length === 0 && custom.length === 0 ? 'ALL_CLEAN' : 'NOT_CLEAN'
console.log(JSON.stringify({
  status,
  project,
  library: prefix,
  modules: mods.length,
  theorems: results.length,
  axiomFree: count('axiom-free'),
  standardAxioms: count('standard-axioms'),
  customAxiom: count('custom-axiom'),
  unknown: count('unknown'),
  failures,
  flagged: custom.slice(0, 50),
}, null, 1))
