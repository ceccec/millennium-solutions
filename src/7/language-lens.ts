// The language lens — the UUID matrix sees languages & dialects as STRINGS, not meanings.
// Through the trinity matrix (content-addressing), a word in any language/dialect is a byte
// sequence → a deterministic address. Two facts follow, and they are opposite in a useful way:
//   · SAME string anywhere → SAME address (the singularity: global agreement, no middleman)
//   · DIFFERENT strings (translations, dialects) → unrelated addresses (bytes, not meaning)
import { toUuid, merkleFold } from '../0/index.ts'
import { LOCALES, LOCALE_ORDER } from './locale.ts'

export function report(): string {
  // 1) One concept across the seven locales → seven distinct points.
  const across = LOCALE_ORDER.map(l => ({ l, s: LOCALES[l].nav.compute, u: toUuid(LOCALES[l].nav.compute) }))

  // 2) Convergence: the same string maps to the same address (verified).
  const converge = toUuid('Изчисли') === toUuid('Изчисли')

  // 3) Dialects: hashing has no notion of "close" — one letter apart → unrelated address.
  const color = toUuid('color'), colour = toUuid('colour')
  const dialectDiffer = color !== colour

  // 4) A concept handle exists ONLY because a human aligned the translations (the LOCALES table).
  const conceptRoot = merkleFold(across.map(a => a.u))

  let o = 'the language lens — the UUID matrix sees languages & dialects as STRINGS:\n\n'
  o += '  one concept ("Compute") across the 7 locales → 7 distinct addresses:\n'
  across.forEach((a, i) => { o += '    ray ' + (i + 1) + '  ' + a.l + '  ' + a.s.padEnd(10) + '→ ' + a.u.slice(0, 13) + '…\n' })
  o += '  → same meaning, seven strings, seven points. the matrix does NOT merge them.\n\n'
  o += '  convergence (the singularity half): same string, anywhere → same address:\n'
  o += '    toUuid("Изчисли") == toUuid("Изчисли") ? ' + converge + '  → two parties agree on one point.\n\n'
  o += '  dialects — no fuzzy match, avalanche instead:\n'
  o += '    "color"  → ' + color.slice(0, 13) + '…\n'
  o += '    "colour" → ' + colour.slice(0, 13) + '…   one letter apart, unrelated: ' + dialectDiffer + '\n\n'
  o += '  concept handle (needs a human alignment): fold the 7 chosen translations → one root:\n'
  o += '    "compute" ⇒ ' + conceptRoot.slice(0, 13) + '…\n'
  o += '    honest: this cross-links the translations ONLY because the LOCALES table aligns them.\n'
  o += '    the hash addresses and seals that alignment; it cannot INFER it.\n\n'
  o += 'HONEST: content-addressing gives universal, language-neutral STRING identity — exact, global,\n'
  o += 'no middleman. It does not translate, cluster by meaning, or match dialects fuzzily. Meaning\n'
  o += 'lives in the human/translator alignment, not in the bytes. The lens sees strings; a translator\n'
  o += 'supplies the meaning. entails → 0/7.'
  return o
}
