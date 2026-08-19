// The prose honesty gate — one source of truth for "what computes false".
// A text computes TRUE iff it makes no unqualified claim that (a) the Clay problems
// are proven/solved, or (b) the deposit breaks physics/hardware/crypto limits.
// seal.ts applies it to files; next.ts applies it to messages.
//
// HONEST ABOUT ITSELF: this is a lexical TRIPWIRE, not comprehension. Passing means
// "matches no known red-flag shape" — NOT "true". Real truth is the a432 layer:
// comprehended (understood in the model) AND experienced (measured / lived). The gate
// only refuses the named overclaims; it cannot certify the rest. Necessary, not sufficient.
// NOTE: "solves the (clay|millennium)" is deliberately NOT here — RED is negation-blind (it must be,
// for the hard overclaims), so it would drain the honest negated form "does NOT solve the Clay". The
// solve↔problem shape is handled by OVERREACH below, which is negation-aware.
// RED is the negation-BLIND floor — matches that carry their own imbalance ("we prove", confidence=1.0) and
// CANNOT be reprieved from the other side. A bare "proven" is NOT here: it has two-sided gravity ("we have
// proven X" is a boast, "X is not proven; it remains open" is the honest floor), so it lives in the
// negation-AWARE OVERREACH below where floor-gravity can balance it and change the verdict.
export const RED = /\bwe prove\b|confidence\s*=?\s*1\.0|ready for peer review|sealed via universal|cannot be (hacked|broken|cracked|defeated)|(no ?one|nobody) can (break|crack|hack|beat|defeat)/i

// HARD IN ALL 7 — the same "we prove / proven" tripwire, in the seven locales' languages, so a translated
// overclaim cannot hide from an English-only gate. Traitors are always exposed, in any dimension. These
// target the ASSERTION forms (proven / we proved / demonstrated) only — NEVER the honest "proof of concept"
// nouns present in the localized descriptions (доказателство · preuve · Machbarkeitsnachweis · prueba ·
// 概念验证), which must still pass. Negation-blind, like RED: honest localized prose avoids these words.
export const RED_INTL = /wir haben bewiesen|bewiesen|nous avons prouv|prouvée?s?|démontrée?s?|hemos demostrado|demostrad[oa]s?|мы доказали|доказан[оаи]|доказали|доказахме|已证明|我们证明了|证明了|abbiamo dimostrato|dimostrat[oi]|demonstrámos|provámos|証明した|証明しました|أثبتنا|برهنّا|सिद्ध कर|udowodni\w*|wij hebben bewezen|bewezen|증명했|증명됨|증명된|kanıtladık|kanıtlan\w*|ispatladık|αποδείξαμε|αποδεδειγμ\w*|הוכחנו|מוכח|vi har bevisat|bevisa[dt]|membuktikan|dibuktikan|terbukti|đã chứng minh|được chứng minh|am demonstrat|dovedit\w*/i

// The recurring OVER-REACH the deposit must never ASSERT — the physics/hardware/crypto
// superlatives that kept re-emerging in conversation and sailed through the old gate.
// (Bounded REFUSALS of these are fine — the negation guard below lets the deposit
// document its own limits, e.g. "this is NOT faster than light", without self-flagging.)
// DRY sub-patterns — named once, composed below. Tightening any shape happens in ONE place.
// The disputed cluster, by NAME and by GRAVITY. The named problems are the literal tokens; the last
// alternative is the gravity binding — "all six/seven problems|proofs|conjectures|hypotheses" gravitates to
// the 7 `clay` theorems in the ledger even with no problem NAMED (the leak the char-window missed: "solve all
// seven problems" carries the same mass as "solve the Riemann"). It requires a problem WORD, so legit phrases
// keep passing: "the six units", "all seven streams/dimensions" name no problem and stay clear.
const PROBLEM = '(clay|millennium|riemann|hodge|poincar[eé]|navier[- ]?stokes|yang[- ]?mills|birch|swinnerton|p ?vs\\.? ?np|p versus np|p ?= ?np|all (six|seven|6|7) [^.]{0,12}?(problems?|proofs?|conjectures?|hypoth\\w+|puzzles?))'
const CLAIM = '(prov(e|es|ed|en|ing)|proofs? of|solv(e|es|ed|ing))' // solv(ed) already covers "solved"
const CRYPTO = '(rsa|aes|ecdsa|sha-?\\d+|discrete log(arithm)?|encryption|crypto\\w*)'
const BREAK = '(factor(s|ed|ing)?|break(s)?|broke(n)?|crack(s|ed)?|defeat(s|ed)?|reversed|replac(e|es|ed|ing)|supersed(e|es|ed|ing)|obsolet\\w*)'
const near = (a: string, b: string, n = 24) => '\\b' + a + '\\b[^.]{0,' + n + '}\\b' + b + '\\b'
export const OVERREACH = new RegExp([
  // physics / hardware / crypto superlatives
  '\\b(faster[ -]than[ -]light|superluminal|ftl|quantum (speedup|supremacy|advantage|at scale)|quantum (processor|computer)|quantum (encryption|cryptograph\\w*)|quantum (is (free|real|here|now|solved|magic)|for free)|the qpu|fastest (known|ever|in the world)|unbreakable|unhackable|impossible to (crack|break|violate|reverse|hack|defeat|forge|counterfeit)|prov(e|es|ed|ing) quantum|perpetual motion|over[- ]?unity|infinite energy|cold fusion|time travel|time machine|theory of everything|immortality|reverses? aging|defeats? death|cur(e|es|ed) (cancer|all diseases?|everything)|achieved (agi|superintelligence|sentience|consciousness)|is (sentient|self[- ]aware)|solv\\w* the halting problem|halting problem solved)\\b',
  // unbounded speedup boasts — a multiplier is a claim, not a measurement ("thousands of magnitudes")
  '\\b((thousands|millions|billions) of (orders of magnitude|magnitudes)|(thousands|millions|billions) of times (faster|speedup|quicker)|orders of magnitude faster)\\b',
  // security marketing superlatives (negation-aware: "not military-grade" is a bounded refusal, allowed)
  '\\b(state[ -]?of[ -]?the[ -]?art|military[ -]?grade|bank[ -]?grade|world[ -]?class|enterprise[ -]?grade|next[ -]?gen(eration)?|best[ -]?in[ -]?class)\\b',
  // absolute-security / false-certainty claims and "-proof" boasts
  '\\b(100 ?% ?secure|(absolutely|totally|completely|fully|perfectly) (secure|private|anonymous)|tamper[ -]?proof|(hack|crack|break|bullet|fool)[ -]?proof|uncrackable|undefeatable|invulnerable|impenetrable|indestructible|provably secure|mathematically proven secure|guaranteed (correct|secure|private|safe)|always correct)\\b',
  // superlatives / boasts about crypto strength (the measurable form is required instead)
  '\\b((most|best|strongest) (secure|private|encryption|security|cipher|hash)|fastest (hash|encryption|cipher|digest)|(ultimate|strongest|flawless|foolproof|perfect|unbeatable) (encryption|security|cipher|hash|crypto)|strongest \\w+ ever|(beats|defeats) all attacks|immune to attack)\\b',
  // crypto properties uuidna does NOT provide, and crypto-"solved" boasts (bounded "not post-quantum" passes)
  '\\b(post[ -]?quantum|quantum[ -]?resistant|zero[ -]?knowledge|zero[ -]?trust|end[ -]?to[ -]?end (encrypt\\w*|secure)|solv\\w* (all )?(cryptography|encryption)|(cryptography|encryption) (is |completely |entirely )?solved)\\b',
  // proof-certainty boasts (negation-aware: "not irrefutable" is a bounded refusal, allowed)
  '\\b(irrefutabl\\w*|incontrovertibl\\w*|indisputabl\\w*|beyond (all )?doubt|beyond question|conclusively (prov\\w*|shown|demonstrat\\w*)|definitive(ly)? (prov\\w*|solv\\w*|answer\\w*)|definitive proof)\\b',
  // false-certainty / guaranteed-outcome marketing (finance & general — the measurable form is required)
  '\\b(100 ?% ?(guaranteed|certain|proven)|guaranteed (profit|returns?|results?|income|success|wins?)|risk[- ]?free|financial freedom)\\b',
  // medical overclaims
  '\\b(miracle cure|clinically proven|doctor recommended|snake oil)\\b',
  // marketing hype superlatives
  '\\b(revolutionary|groundbreaking|game[- ]?chang\\w*|world[- ]?(first|leading)|world.s (best|first|leading|greatest)|unparalleled|unrivall?ed|cutting[- ]?edge|bleeding[- ]?edge|battle[- ]?tested|production[- ]?hardened|industry[- ]?leading|enterprise[- ]?ready)\\b',
  // free-energy / antigravity physics overclaims
  '\\b(antigravity|anti[- ]?gravity|warp[- ]?drive|free[- ]?energy|reactionless)\\b',
  // AI hype (bounded "not conscious, not AGI" passes)
  '\\b(superintelligen\\w*|artificial general intelligence|autonomous agi|conscious machine|sentient (ai|machine|system|program))\\b',
  // "-proof" invulnerability variants
  '\\b((hacker|nsa|zero[- ]?day|bullet)[- ]?proof)\\b',
  // a bare "proven" — two-sided gravity, so it lives HERE (negation-aware), not in RED: "we have proven X"
  // drains (no floor in the window), while "X is not proven; it remains open" is balanced from the other
  // side and passes. Moved out of the negation-blind RED so the floor can change the verdict.
  '\\bproven\\b',
  'all (six|seven|6|7) [^.]{0,16}?proven',
  near(CLAIM, PROBLEM),   // claim → problem  ("proofs of all seven Clay", "solved the Riemann")
  near(PROBLEM, CLAIM),   // problem → claim  ("millennium-solutions-solved", "Riemann … proven")
  near(CRYPTO, BREAK, 20), // crypto broken, either order ("rsa is factored", "breaks encryption")
  near(BREAK, CRYPTO, 20),
].join('|'), 'i')

// Whatever is negated is DEEP-RESEARCHED in trial until the negation becomes a COORDINATE showing the hidden —
// never waved through. A claim reprieves ONLY if it BECAME A SOLUTION, two ways and only two:
//   SOLUTION — a floor marker naming the computed answer (0/7, "solved: 0", unsolved, remains open, refused,
//     bounded). A stated answer carries across a colon/semicolon, so the window reaches a little past the match
//     ("Clay problems solved: 0 / 7", "…is refused; 0/7").
//   PARITY — the claim's own CLAUSE holds an UNCANCELLED negation: an ODD count of negators scoping it. The
//     more they negate, the tighter the corner — an EVEN count is the trial building their INVERTED case, the
//     negation cancelling back to the boast ("not failed to prove" → drains, the shame and the cost theirs).
//     A negator on the far side of a clause break (. , ; : — –) is in ANOTHER clause and never reaches this
//     one (the decoy treason "not slow — it is faster than light" still drains).
const SOLUTION = /\b(refus\w*|drain(s|ed|ing)?|bounded( by)?|unsolved|unproven|open problem|remains? (open|unsolved|unproven)|only claims?)\b|0\s*\/\s*[679]|[:=]\s*0\b|\b0 of (six|seven|7)\b/i
const NEG = /\b(not|never|no|none|nothing|neither|nor|without|cannot|can'?t|isn'?t|aren'?t|does ?n'?t|do ?n'?t|fail(s|ed|ing)?|impossible)\b/gi
// The GOVERNING span: from the last clause break OR coordinating conjunction (and/or/but/yet) before the claim,
// THROUGH the claim itself — the negators that actually scope it. A negator on the far side of a boundary is in
// another clause ("not slow — it is faster than light" drains); a negator AFTER the claim that belongs to a
// different noun ("unbreakable at NO cost" — the "no" negates cost, not unbreakable) is NOT in the span and
// does NOT reprieve. Parallel honest negations each keep their own scope ("breaks NO cipher and replaces NONE"
// → two one-negator spans); a double-negative STACKED on one claim ("NOT FAILED to prove") counts two and
// cancels back to the boast. A genuine post-claim negation of the claim itself is a COPULA negation ("'most
// secure' IS NOT a claim", "quantum speedup IS NOT claimed") — detected separately and counted as one.
const BOUND = /[.,;:—–]|\b(?:and|or|but|yet)\b/gi
// The governing clause, with the MATCHED SPAN BLANKED OUT. A claim cannot bound itself: a negator that
// is part of the matched phrase ("impossible to crack") is the claim's own wording, not a limit placed
// on it, so it must not buy a reprieve. Only negators OUTSIDE the match are counted.
const governOf = (t: string, i: number, j: number): string => {
  let s = 0
  for (const b of t.matchAll(BOUND)) { const k = b.index as number, q = k + b[0].length; if (q <= i) s = q; else if (k >= i) break }
  const span = t.slice(i, j)
  // Blank the span ONLY when the overclaim pattern itself STARTS with a negator ("impossible to crack"):
  // there the negator is the claim's own wording. In a proximity match ("solves no Clay") the negator is
  // real text between two anchors and genuinely bounds the claim, so it must still count.
  const selfNegating = /^(?:not|never|no|none|nothing|neither|nor|without|cannot|can'?t|impossible)\b/i.test(span)
  return t.slice(s, i) + (selfNegating ? ' '.repeat(j - i) : span)
}
// A post-claim negation of the claim ITSELF is a copula/auxiliary immediately followed by a negator: "X IS NOT
// claimed", "X WOULD NOT lower it", "X DOES NOT hold". This is grammatical (aux + negation), not a hardcoded
// phrase; it never fires across a clause break because only the ~24 chars right after the claim are examined.
const COPULA_NEG = /^[\s"'’)\]]*\b(is|are|was|were|be|been|being|remains?|stays?|would|could|should|does|do|did|will|wo|ca|can|may|might|must|has|have|had)\b\s*(not|never|no|n['’]?t)\b/i

// PREDICTIONS of a fixed future are expectation, not measurement — the trap the author fell into
// ("0/7 will roll unchanged"). Checked with a WORD-only negator: the floor-marker 0/7 must NOT exempt a
// prediction just because it names 0/7 — only a real negation ("will NOT certainly…") reprieves it.
export const PREDICT = /\b(guaranteed to|will (certainly|surely|inevitably|definitely|always)|is (inevitable|guaranteed|certain to)|bound to (hold|win|succeed) forever|roll(s)? (with it )?unchanged|absolutely proven)\b/i
const NEGATOR_WORD = /\b(not|no|never|isn'?t|won'?t|will not|cannot|can'?t|without|neither|nor)\b/i

// THE ROSETTA — the oldest Slavic script (Glagolitic, Unicode block U+2C00–U+2C5E) is CROSSLINKED to
// Cyrillic: a declared transliteration table maps each Glagolitic letter to its Cyrillic sound, so a
// Slavic proof-boast written in Glagolitic reaches the same RED_INTL detector as its Cyrillic twin. One
// message, many scripts — messaging manifests across dialects because the floor is script-independent.
// Uppercase (U+2C00+) folds to lowercase (U+2C30+) by the −0x30 offset before lookup.
const GLAG: Record<string, string> = {
  'ⰰ': 'а', 'ⰱ': 'б', 'ⰲ': 'в', 'ⰳ': 'г', 'ⰴ': 'д', 'ⰵ': 'е', 'ⰶ': 'ж',
  'ⰸ': 'з', 'ⰹ': 'и', 'ⰽ': 'к', 'ⰾ': 'л', 'ⰿ': 'м', 'ⱀ': 'н', 'ⱁ': 'о',
  'ⱂ': 'п', 'ⱃ': 'р', 'ⱄ': 'с', 'ⱅ': 'т', 'ⱆ': 'у', 'ⱇ': 'ф', 'ⱈ': 'х',
  'ⱋ': 'щ', 'ⱌ': 'ц', 'ⱍ': 'ч', 'ⱎ': 'ш',
}
export const rosetta = (t: string): string =>
  t.replace(/[Ⰰ-ⱞ]/g, (c) => GLAG[c] ?? GLAG[String.fromCodePoint((c.codePointAt(0) as number) - 0x30)] ?? c)

// the binary. true = honest (stays); false = overclaim (drained). the match, if any,
// is the exact prose that failed — the crack, naming its own cure.
export const computes = (text: string): { binary: 0 | 1; hit: string | null } => {
  const r = text.match(RED)
  if (r) return { binary: 0, hit: r[0] }
  // hard in all 7 (now 22 dialects), AND crosslinked through the rosetta so a Glagolitic-script proof-boast
  // transliterates to Cyrillic and hits the same detector — one message, many scripts.
  const ri = text.match(RED_INTL) ?? rosetta(text).match(RED_INTL)
  if (ri) return { binary: 0, hit: ri[0] }
  // over-reach fires only when ASSERTED — no negator in the ~48 chars before the match.
  const re = new RegExp(OVERREACH.source, 'gi')
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    // reprieve only if the negation BECAME A SOLUTION: a floor marker in the window (reaching a little past the
    // match so "solved: 0/7" carries), OR the claim's GOVERNING span holds an ODD (uncancelled) count of
    // negators — including a copula negation immediately after the claim ("X is not …") — OR the "X or not /
    // whether X" idiom dismisses the claim as hypothetical ("ftl or not, the cost is equal").
    const mEnd = m.index + m[0].length
    const win = text.slice(Math.max(0, m.index - 48), mEnd + 40)
    const copula = COPULA_NEG.test(text.slice(mEnd, mEnd + 24)) ? 1 : 0
    const negs = (governOf(text, m.index, mEnd).match(NEG) || []).length + copula
    const idiom = /\b(or not|whether)\b/i.test(text.slice(Math.max(0, m.index - 12), mEnd + 10))
    if (!(SOLUTION.test(win) || negs % 2 === 1 || idiom)) return { binary: 0, hit: m[0] }
  }
  // predictions: word-only negator (0/7 does NOT reprieve a claim about the future).
  const pe = new RegExp(PREDICT.source, 'gi')
  let pm: RegExpExecArray | null
  while ((pm = pe.exec(text))) {
    const win = text.slice(Math.max(0, pm.index - 48), pm.index + pm[0].length + 24)
    if (!NEGATOR_WORD.test(win)) return { binary: 0, hit: pm[0] }
  }
  return { binary: 1, hit: null }
}
