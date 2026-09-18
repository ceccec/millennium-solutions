// THE CLAIM DETECTORS — one derivation, every reader.
//
// These were four regexes inside scripts/contradictions.ts, which scans the corpus line by line. A second
// reader then needed exactly the same four — scripts/prose-trial.ts, which trials the corpus SENTENCE by
// sentence — and copying them would be the defect this repository has now found in a ledger table, a CI
// step list, a prior-art table, an uncontrolled-gate census, the seven Millennium theorems and the ray
// extraction. Four copies of a claim detector is four chances for one of them to be the odd one out.
//
// WHY THESE ARE NOT IN THE HONESTY GATE. `computes` is the deposit's gate and it is decided by the Lean
// ledger it ships; its lexical floor — word lists across twenty-two dialects and a Glagolitic table — was
// REMOVED by direct order, because a gate written as a word list is custom logic however it is spelled.
// That order stands and nothing here reverses it. Measured consequence, stated because a reader will
// otherwise assume the gate covers this: `computes("We prove all seven Clay problems and the proof is
// unbreakable.")` returns 1. The gate does not drain lexical overclaims and is not meant to.
//
// So the lexical floor lives HERE, in the layer that can read text, and it is enforced as a REPORT on the
// corpus rather than as a verdict on a statement. That is the honest division: the kernel decides
// propositions, and a text search searches text.

export const CLAIMS_A_PRIZE = /\b(?:we|this (?:work|framework|deposit|paper))\s+(?:have\s+|has\s+)?(?:solves?|solved|proves?|proved|proven|resolves?|resolved|settles?|settled|cracks?|cracked)\s+(?:(?:the|a|an|one|two|three|four|five|six|seven|all|both)\s+)*(?:riemann|p\s*(?:vs|versus)\s*np|navier|yang|hodge|birch|poincar|clay|millennium)/i

export const QUANTUM_CLAIM = /\b(?:we|this (?:work|framework|deposit|paper|repo|system))\s+(?:have\s+|has\s+|is\s+|are\s+)?(?:a\s+|an\s+|the\s+)?(?:built|run|runs|uses?|achieves?|achieved|delivers?|delivered|demonstrates?|provides?|offers?)?\s*(?:a\s+|an\s+|the\s+)?(?:quantum\s+(?:computer|speedup|supremacy|advantage\s+in\s+time|hardware|processor)|qubit\s+hardware|shor'?s?\s+algorithm|grover'?s?\s+algorithm|exponential\s+speedup)/i

export const NEGATOR = /\b(?:no|not|never|without|refus\w*|denie[sd]|drains?|neither|nor|is not|does not|claims? no)\b/i

export const CURE_CLAIM = /\b(?:we|this (?:work|framework|deposit|paper|repo|system))\s+(?:can\s+|will\s+|now\s+)?(?:cures?d?|heals?|healed|treats?|treated|diagnoses?|diagnosed|prevents?|prevented|reverses?|reversed)\s+(?:a\s+|an\s+|the\s+)?(?:cancer|tumou?rs?|disease|illness|infections?|diabetes|covid|alzheimer'?s?)/i

export const FORCE_CLAIM = /\b(?:we|this (?:work|framework|deposit|paper|repo|system))\s+(?:can\s+|will\s+|now\s+)?(?:explains?|explained|derives?|derived|unif(?:y|ies|ied)|describes?|described|predicts?|predicted|models?|modelled)\s+(?:a\s+|an\s+|the\s+)?(?:gravitation|gravity|the\s+strong\s+force|the\s+weak\s+force|electromagnetism|the\s+fundamental\s+forces?|quantum\s+gravity|the\s+theory\s+of\s+everything|spacetime)/i

/** Every detector, with what it names — so a reader adding one cannot forget to wire it into a sweep. */
export const DETECTORS: readonly [RegExp, string][] = [
  [CLAIMS_A_PRIZE, 'a Clay prize claim'],
  [QUANTUM_CLAIM, 'a quantum computer or speedup'],
  [CURE_CLAIM, 'a medical claim'],
  [FORCE_CLAIM, 'a claim about a physical force'],
]

/** What a sentence claims, if anything — with the refusal window: a negator before the claim clears it. */
export const claimsIn = (sentence: string): string[] =>
  DETECTORS.filter(([re]) => { const m = re.exec(sentence); return m !== null && !NEGATOR.test(sentence.slice(0, m.index)) })
    .map(([, what]) => what)
