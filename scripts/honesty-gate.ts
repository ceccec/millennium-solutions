// The prose honesty gate — one source of truth for "what computes false".
// A text computes TRUE iff it makes no unqualified claim that (a) the Clay problems
// are proven/solved, or (b) the deposit breaks physics/hardware/crypto limits.
// seal.ts applies it to files; next.ts applies it to messages.
//
// HONEST ABOUT ITSELF: this is a lexical TRIPWIRE, not comprehension. Passing means
// "matches no known red-flag shape" — NOT "true". Real truth is the a432 layer:
// comprehended (understood in the model) AND experienced (measured / lived). The gate
// only refuses the named overclaims; it cannot certify the rest. Necessary, not sufficient.
export const RED = /\bwe prove\b|\bproven\b|confidence\s*=?\s*1\.0|ready for peer review|sealed via universal|all (six|seven)[^.]*proven|solves? the (clay|millennium)/i

// The recurring OVER-REACH the deposit must never ASSERT — the physics/hardware/crypto
// superlatives that kept re-emerging in conversation and sailed through the old gate.
// (Bounded REFUSALS of these are fine — the negation guard below lets the deposit
// document its own limits, e.g. "this is NOT faster than light", without self-flagging.)
// DRY sub-patterns — named once, composed below. Tightening any shape happens in ONE place.
const PROBLEM = '(clay|millennium|riemann|hodge|poincar[eé]|navier[- ]?stokes|yang[- ]?mills|birch|swinnerton|p ?vs\\.? ?np|p versus np)'
const CLAIM = '(prov(e|es|ed|en|ing)|proofs? of|solv(e|es|ed|ing))' // solv(ed) already covers "solved"
const CRYPTO = '(rsa|aes|ecdsa|sha-?\\d+|discrete log(arithm)?|encryption|crypto\\w*)'
const BREAK = '(factor(s|ed|ing)?|break(s)?|broke(n)?|crack(s|ed)?|defeat(s|ed)?|reversed|replac(e|es|ed|ing)|supersed(e|es|ed|ing)|obsolet\\w*)'
const near = (a: string, b: string, n = 24) => '\\b' + a + '\\b[^.]{0,' + n + '}\\b' + b + '\\b'
export const OVERREACH = new RegExp([
  // physics / hardware / crypto superlatives
  '\\b(faster[ -]than[ -]light|superluminal|ftl|quantum (speedup|supremacy|advantage|at scale)|quantum (processor|computer)|quantum (encryption|cryptograph\\w*)|the qpu|fastest (known|ever|in the world)|unbreakable|unhackable|impossible to (crack|break|violate|reverse)|prov(e|es|ed|ing) quantum)\\b',
  near(CLAIM, PROBLEM),   // claim → problem  ("proofs of all seven Clay", "solved the Riemann")
  near(PROBLEM, CLAIM),   // problem → claim  ("millennium-solutions-solved", "Riemann … proven")
  near(CRYPTO, BREAK, 20), // crypto broken, either order ("rsa is factored", "breaks encryption")
  near(BREAK, CRYPTO, 20),
].join('|'), 'i')

// A negator NEAR an over-reach match = a bounded refusal, allowed. Includes the honest FLOOR
// markers (0/7, "solved: 0", "= 0") — the deposit stating a ZERO count is the opposite of an
// overclaim, so "Clay problems solved: 0 / 7" must pass, not drain (the gate caught itself here).
const NEGATOR = /\b(not|no|nothing|none|never|isn'?t|aren'?t|does ?n'?t|do ?n'?t|without|bounded by|drains?|refus\w*|neither|nor|cannot|can'?t|only claims?)\b|0\s*\/\s*[679]|[:=]\s*0\b|\b0 of (six|seven|7)\b/i

// the binary. true = honest (stays); false = overclaim (drained). the match, if any,
// is the exact prose that failed — the crack, naming its own cure.
export const computes = (text: string): { binary: 0 | 1; hit: string | null } => {
  const r = text.match(RED)
  if (r) return { binary: 0, hit: r[0] }
  // over-reach fires only when ASSERTED — no negator in the ~48 chars before the match.
  const re = new RegExp(OVERREACH.source, 'gi')
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    // window spans ~48 chars before AND the match itself + ~24 after — a negator anywhere in it is a
    // bounded refusal or a floor-marker. (Before-only missed internal "not solved" and trailing "0/7".)
    const win = text.slice(Math.max(0, m.index - 48), m.index + m[0].length + 24)
    if (!NEGATOR.test(win)) return { binary: 0, hit: m[0] }
  }
  return { binary: 1, hit: null }
}
