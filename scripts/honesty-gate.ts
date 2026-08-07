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
export const OVERREACH = /\b(faster[ -]than[ -]light|superluminal|quantum (speedup|supremacy|advantage|at scale)|quantum (processor|computer)|the qpu|fastest (known|ever|in the world)|unbreakable|unhackable|impossible to (crack|break|violate|reverse)|proves quantum)\b/i

// A negator within this many chars BEFORE an over-reach match = a bounded refusal, allowed.
const NEGATOR = /\b(not|no|never|isn'?t|aren'?t|does ?n'?t|do ?n'?t|without|bounded by|drains?|refus\w*|neither|nor|cannot|can'?t|only claims?)\b/i

// the binary. true = honest (stays); false = overclaim (drained). the match, if any,
// is the exact prose that failed — the crack, naming its own cure.
export const computes = (text: string): { binary: 0 | 1; hit: string | null } => {
  const r = text.match(RED)
  if (r) return { binary: 0, hit: r[0] }
  // over-reach fires only when ASSERTED — no negator in the ~48 chars before the match.
  const re = new RegExp(OVERREACH.source, 'gi')
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    const pre = text.slice(Math.max(0, m.index - 48), m.index)
    if (!NEGATOR.test(pre)) return { binary: 0, hit: m[0] }
  }
  return { binary: 1, hit: null }
}
