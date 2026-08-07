#!/usr/bin/env node
// Translation-coverage audit. The FIXED UI (the LOCALES table) can be — and must be — 100% covered
// across every locale; this verifies it. Deep prose is authored in English and stays so until a
// translator or language model provides it (honest boundary — deterministic tools don't translate
// meaning; see src/7/language-lens.ts). Reports both, honestly. 100% here = the fixed UI.
import { LOCALES, LOCALE_ORDER } from '../src/7/locale.ts'

const KEYS = ['label', 'title', 'description', 'support']
const NAV = ['paper', 'research', 'poc', 'realisations', 'compute', 'decode']
const missing: string[] = []
for (const loc of LOCALE_ORDER) {
  const L: any = LOCALES[loc]
  for (const k of KEYS) if (!L?.[k]) missing.push(loc + '.' + k)
  for (const n of NAV) if (!L?.nav?.[n]) missing.push(loc + '.nav.' + n)
}
const total = LOCALE_ORDER.length * (KEYS.length + NAV.length)
const covered = total - missing.length
const pct = (covered / total * 100).toFixed(0)

console.log('translation coverage — the fixed UI (LOCALES table):')
console.log('  locales (' + LOCALE_ORDER.length + '): ' + LOCALE_ORDER.join(', '))
console.log('  UI strings covered: ' + covered + '/' + total + ' = ' + pct + '%')
if (missing.length) console.log('  missing: ' + missing.join(', '))
console.log('  deep content pages: English-authored; per-locale prose needs a translator/model (honest boundary).')
console.log(missing.length === 0
  ? '✓ translation coverage 100% — every locale carries every fixed UI string'
  : '✗ UI translation incomplete (' + missing.length + ' strings)')
process.exit(missing.length === 0 ? 0 : 1)
