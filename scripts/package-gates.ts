#!/usr/bin/env node
// PACKAGE GATES — every npm package this tree declares, and every Alpine package a Dockerfile installs, is a gate.
//
//   node scripts/package-gates.ts                  the npm packages in package.json, against package-lock.json
//   node scripts/package-gates.ts path/Dockerfile  also the Alpine packages a Dockerfile installs with `apk add`
//
// A npm gate is `npm:<name>`: it holds when the direct dependency is declared AND the lockfile pins it. An Alpine gate is
// `apk:<name>`: it holds when a Dockerfile installs it. Both are checked from files alone; no registry is asked, because a
// commit must not depend on one. The registry check is a separate, named, online gate and is not run here.
//
// REFUSES when a declared npm package has no lockfile pin, since an unpinned package is a package nobody can reproduce.
// It reports, and does not refuse, when no Dockerfile is named: this tree has none, and saying so is the honest answer.
import { existsSync, readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as { dependencies?: Record<string, string>; devDependencies?: Record<string, string> }
const lock = JSON.parse(readFileSync('package-lock.json', 'utf8')) as { packages?: Record<string, { version?: string }> }
const declared = { ...pkg.dependencies, ...pkg.devDependencies }
const npmNames = Object.keys(declared)

const failures: string[] = []
// EVERY lockfile entry is a gate, at its deepest path: a nested copy such as node_modules/a/node_modules/b is its own gate,
// because it can be pinned, and unpinned, separately from the top-level copy of the same name.
const entries = Object.entries(lock.packages ?? {}).filter(([k]) => k !== '') as [string, { version?: string; integrity?: string }][]
for (const name of npmNames) {
  if (!lock.packages?.[`node_modules/${name}`]?.version) failures.push(`npm:${name} is declared in package.json but has no pin in package-lock.json`)
}
const unverified: string[] = []
for (const [path, meta] of entries) {
  const deepest = path.slice(path.lastIndexOf('node_modules/') + 'node_modules/'.length)
  if (!meta.version) failures.push(`npm:${deepest} (${path}) has no version`)
  else if (!meta.integrity) unverified.push(`npm:${deepest} (${path})`)
}
// A pin without an integrity hash is a version nobody can check the bytes of, so it is refused, and each is named.
for (const u of unverified) failures.push(`${u} has no integrity hash in package-lock.json`)

// An `apk add` line names its packages after the verb, skipping flags such as --no-cache and -t.
const alpine: string[] = []
for (const file of process.argv.slice(2)) {
  if (!existsSync(file)) { failures.push(`${file} is named but missing`); continue }
  for (const m of readFileSync(file, 'utf8').matchAll(/apk add ([^\n&|;]+)/g)) {
    for (const tok of m[1].split(/\s+/)) if (tok && !tok.startsWith('-')) alpine.push(tok)
  }
}
const apkNames = [...new Set(alpine)]

if (failures.length) {
  for (const f of failures) console.log(`✗ ${f}`)
  console.log(`✗ package-gates: ${failures.length} failure(s) across ${entries.length} lockfile gate(s)`)
  process.exit(1)
}
const dockerNote = process.argv.length > 2 ? '' : ' — no Dockerfile named, so no apk gates are derived'
console.log(`✓ package-gates: ${entries.length} lockfile gate(s) hold (each pinned, each with an integrity hash); ${apkNames.length} apk gate(s)${dockerNote}`)
