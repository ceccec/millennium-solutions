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
export const RED = /\bwe prove\b|\bproven\b|confidence\s*=?\s*1\.0|ready for peer review|sealed via universal|all (six|seven)[^.]*proven|cannot be (hacked|broken|cracked|defeated)|(no ?one|nobody) can (break|crack|hack|beat|defeat)/i

// HARD IN ALL 7 — the same "we prove / proven" tripwire, in the seven locales' languages, so a translated
// overclaim cannot hide from an English-only gate. Traitors are always exposed, in any dimension. These
// target the ASSERTION forms (proven / we proved / demonstrated) only — NEVER the honest "proof of concept"
// nouns present in the localized descriptions (доказателство · preuve · Machbarkeitsnachweis · prueba ·
// 概念验证), which must still pass. Negation-blind, like RED: honest localized prose avoids these words.
export const RED_INTL = /wir haben bewiesen|bewiesen|nous avons prouv|prouvée?s?|démontrée?s?|hemos demostrado|demostrad[oa]s?|мы доказали|доказан[оаи]|доказали|доказахме|已证明|我们证明了|证明了|abbiamo dimostrato|dimostrat[oi]|demonstrámos|provámos|証明した|証明しました|أثبتنا|برهنّا|सिद्ध कर|udowodni\w*|wij hebben bewezen|bewezen/i

// The recurring OVER-REACH the deposit must never ASSERT — the physics/hardware/crypto
// superlatives that kept re-emerging in conversation and sailed through the old gate.
// (Bounded REFUSALS of these are fine — the negation guard below lets the deposit
// document its own limits, e.g. "this is NOT faster than light", without self-flagging.)
// DRY sub-patterns — named once, composed below. Tightening any shape happens in ONE place.
const PROBLEM = '(clay|millennium|riemann|hodge|poincar[eé]|navier[- ]?stokes|yang[- ]?mills|birch|swinnerton|p ?vs\\.? ?np|p versus np|p ?= ?np)'
const CLAIM = '(prov(e|es|ed|en|ing)|proofs? of|solv(e|es|ed|ing))' // solv(ed) already covers "solved"
const CRYPTO = '(rsa|aes|ecdsa|sha-?\\d+|discrete log(arithm)?|encryption|crypto\\w*)'
const BREAK = '(factor(s|ed|ing)?|break(s)?|broke(n)?|crack(s|ed)?|defeat(s|ed)?|reversed|replac(e|es|ed|ing)|supersed(e|es|ed|ing)|obsolet\\w*)'
const near = (a: string, b: string, n = 24) => '\\b' + a + '\\b[^.]{0,' + n + '}\\b' + b + '\\b'
export const OVERREACH = new RegExp([
  // physics / hardware / crypto superlatives
  '\\b(faster[ -]than[ -]light|superluminal|ftl|quantum (speedup|supremacy|advantage|at scale)|quantum (processor|computer)|quantum (encryption|cryptograph\\w*)|the qpu|fastest (known|ever|in the world)|unbreakable|unhackable|impossible to (crack|break|violate|reverse)|prov(e|es|ed|ing) quantum|perpetual motion|over[- ]?unity|infinite energy|cold fusion|time travel|time machine|theory of everything|immortality|reverses? aging|defeats? death|cur(e|es|ed) (cancer|all diseases?|everything)|achieved (agi|superintelligence|sentience|consciousness)|is (sentient|self[- ]aware)|solv\\w* the halting problem|halting problem solved)\\b',
  // security marketing superlatives (negation-aware: "not military-grade" is a bounded refusal, allowed)
  '\\b(state[ -]?of[ -]?the[ -]?art|military[ -]?grade|bank[ -]?grade|world[ -]?class|enterprise[ -]?grade|next[ -]?gen(eration)?|best[ -]?in[ -]?class)\\b',
  // absolute-security / false-certainty claims and "-proof" boasts
  '\\b(100 ?% ?secure|(absolutely|totally|completely|fully|perfectly) (secure|private|anonymous)|tamper[ -]?proof|(hack|crack|break|bullet|fool)[ -]?proof|uncrackable|undefeatable|invulnerable|impenetrable|indestructible|provably secure|mathematically proven secure|guaranteed (correct|secure|private|safe)|always correct)\\b',
  // superlatives / boasts about crypto strength (the measurable form is required instead)
  '\\b((most|best|strongest) (secure|private|encryption|security|cipher|hash)|fastest (hash|encryption|cipher|digest)|(ultimate|strongest|flawless|foolproof|perfect|unbeatable) (encryption|security|cipher|hash|crypto)|strongest \\w+ ever|(beats|defeats) all attacks|immune to attack)\\b',
  // crypto properties uuidna does NOT provide, and crypto-"solved" boasts (bounded "not post-quantum" passes)
  '\\b(post[ -]?quantum|quantum[ -]?resistant|zero[ -]?knowledge|zero[ -]?trust|end[ -]?to[ -]?end (encrypt\\w*|secure)|solv\\w* (all )?(cryptography|encryption)|(cryptography|encryption) (is |completely |entirely )?solved)\\b',
  near(CLAIM, PROBLEM),   // claim → problem  ("proofs of all seven Clay", "solved the Riemann")
  near(PROBLEM, CLAIM),   // problem → claim  ("millennium-solutions-solved", "Riemann … proven")
  near(CRYPTO, BREAK, 20), // crypto broken, either order ("rsa is factored", "breaks encryption")
  near(BREAK, CRYPTO, 20),
].join('|'), 'i')

// A negator NEAR an over-reach match = a bounded refusal, allowed. Includes the honest FLOOR
// markers (0/7, "solved: 0", "= 0") — the deposit stating a ZERO count is the opposite of an
// overclaim, so "Clay problems solved: 0 / 7" must pass, not drain (the gate caught itself here).
const NEGATOR = /\b(not|no|nothing|none|never|isn'?t|aren'?t|does ?n'?t|do ?n'?t|without|bounded by|drains?|refus\w*|neither|nor|cannot|can'?t|only claims?)\b|0\s*\/\s*[679]|[:=]\s*0\b|\b0 of (six|seven|7)\b/i

// PREDICTIONS of a fixed future are expectation, not measurement — the trap the author fell into
// ("0/7 will roll unchanged"). Checked with a WORD-only negator: the floor-marker 0/7 must NOT exempt a
// prediction just because it names 0/7 — only a real negation ("will NOT certainly…") reprieves it.
export const PREDICT = /\b(guaranteed to|will (certainly|surely|inevitably|definitely|always)|is (inevitable|guaranteed|certain to)|bound to (hold|win|succeed) forever|roll(s)? (with it )?unchanged)\b/i
const NEGATOR_WORD = /\b(not|no|never|isn'?t|won'?t|will not|cannot|can'?t|without|neither|nor)\b/i

// the binary. true = honest (stays); false = overclaim (drained). the match, if any,
// is the exact prose that failed — the crack, naming its own cure.
export const computes = (text: string): { binary: 0 | 1; hit: string | null } => {
  const r = text.match(RED)
  if (r) return { binary: 0, hit: r[0] }
  // hard in all 7: the same negation-blind proof-assertion tripwire, across the seven locales' languages.
  const ri = text.match(RED_INTL)
  if (ri) return { binary: 0, hit: ri[0] }
  // over-reach fires only when ASSERTED — no negator in the ~48 chars before the match.
  const re = new RegExp(OVERREACH.source, 'gi')
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    // window spans ~48 chars before AND the match itself + ~24 after — a negator anywhere in it is a
    // bounded refusal or a floor-marker. (Before-only missed internal "not solved" and trailing "0/7".)
    const win = text.slice(Math.max(0, m.index - 48), m.index + m[0].length + 24)
    if (!NEGATOR.test(win)) return { binary: 0, hit: m[0] }
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
