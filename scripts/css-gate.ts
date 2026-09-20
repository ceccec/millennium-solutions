#!/usr/bin/env node
// CSS — a custom property used and never defined renders as nothing, and an animation with no keyframes
// simply does not play. Neither raises an error anywhere: the page loads, the build passes, and the surface
// is quietly wrong. There is no stack trace for a colour that resolved to empty.
//
// THE FIRST VERSION OF THIS CHECK REPORTED 19 GAPS AND EVERY ONE WAS ITS OWN MISTAKE:
//
//   12 · `--vp-*` — VitePress's theme variables, defined by the theme this site is built on and correctly
//        absent from the repository. External by nature, not missing.
//    1 · `--a432-hue` — registered with `@property --a432-hue { syntax: '<number>'; initial-value: 200 }`
//        at .vitepress/theme/custom.css:51. A registration IS a definition, and the reader only understood
//        `--x:` declarations.
//    6 · `--bg`, `--fg`, `--acc`, `--soft`, `--mut`, `--line` — defined inside the very HTML files that use
//        them, in packages/uuidna/site. The reader had poured every file into one corpus and lost the scope.
//
// So it resolves per FILE, understands @property, and carries the external prefixes as a declared list. It
// reports zero today, which is the honest result — and a checker that has been wrong three ways and then
// says zero is worth more than one that said 19 the first time and was believed.
import { readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'

// Defined elsewhere by the framework, on purpose. A prefix is a CHOICE and is listed as one: adding to it is
// how a real gap gets hidden, so it stays short and each entry says whose it is.
const EXTERNAL = [
  { prefix: '--vp-', whose: 'VitePress default theme' },
]

const files = execSync('git ls-files "*.css" "*.vue" "*.html"', { encoding: 'utf8' }).split('\n').filter(Boolean)
// A stylesheet loaded by every page defines for every page; a variable in one component does not.
const GLOBAL = files.filter((f) => f.startsWith('.vitepress/theme/'))
const globalText = GLOBAL.map((f) => readFileSync(f, 'utf8')).join('\n')

const declaredIn = (text: string): Set<string> => new Set([
  ...[...text.matchAll(/(--[A-Za-z0-9-]+)\s*:/g)].map((m) => m[1]),
  ...[...text.matchAll(/@property\s+(--[A-Za-z0-9-]+)/g)].map((m) => m[1]),
])
const globalVars = declaredIn(globalText)

const KEYWORDS = /^(none|infinite|linear|ease|ease-in|ease-out|ease-in-out|alternate|alternate-reverse|forwards|backwards|both|normal|reverse|running|paused|step-start|step-end|inherit|initial|unset|revert|steps|cubic-bezier|var|calc)$/

let bad = 0
const missingVars: string[] = []
const missingKeyframes: string[] = []
for (const f of files) {
  const text = readFileSync(f, 'utf8')
  const own = declaredIn(text)
  for (const m of text.matchAll(/var\(\s*(--[A-Za-z0-9-]+)/g)) {
    const v = m[1]
    if (own.has(v) || globalVars.has(v)) continue
    if (EXTERNAL.some((e) => v.startsWith(e.prefix))) continue
    missingVars.push(`${f}  ${v}`)
  }
  const kf = new Set([...text.matchAll(/@keyframes\s+([A-Za-z0-9_-]+)/g)].map((m) => m[1]))
  const globalKf = new Set([...globalText.matchAll(/@keyframes\s+([A-Za-z0-9_-]+)/g)].map((m) => m[1]))
  for (const m of text.matchAll(/animation(?:-name)?\s*:\s*([^;{}]+)[;}]/g)) {
    for (const tok of m[1].split(/[,\s]+/).map((t) => t.trim()).filter(Boolean)) {
      if (!/^[A-Za-z][A-Za-z0-9_-]*$/.test(tok) || KEYWORDS.test(tok)) continue
      if (kf.has(tok) || globalKf.has(tok)) continue
      missingKeyframes.push(`${f}  ${tok}`)
    }
  }
}
for (const v of missingVars) { console.log(`  ✗ ${v} — used and never defined; it renders as nothing`); bad++ }
for (const k of missingKeyframes) { console.log(`  ✗ ${k} — animated with no @keyframes; it simply does not play`); bad++ }

if (bad) {
  console.log(`\n✗ css: ${bad} gap(s). Neither raises an error anywhere — the page loads and is quietly wrong.`)
  process.exit(1)
}
console.log(`✓ css: ${files.length} stylesheet(s) and component(s) — every custom property resolves in its own`)
console.log(`  file or in the global theme, every animation names keyframes that exist`
  + `, and ${EXTERNAL.length} prefix(es) are declared external (${EXTERNAL.map((e) => e.prefix + ' — ' + e.whose).join('; ')})`)
