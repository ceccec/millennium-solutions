// The prose honesty gate — one source of truth for "what computes false".
// A text computes TRUE iff it makes no unqualified claim that the Clay problems
// are proven/solved. seal.ts applies it to files; next.ts applies it to messages.
// This is the binary the whole deposit rests on: prose asserts, the gate adjudicates.
export const RED = /\bwe prove\b|\bproven\b|confidence\s*=?\s*1\.0|ready for peer review|sealed via universal|all (six|seven)[^.]*proven|solves? the (clay|millennium)/i

// the binary. true = honest (stays); false = overclaim (drained). the match, if any,
// is the exact prose that failed — the crack, naming its own cure.
export const computes = (text: string): { binary: 0 | 1; hit: string | null } => {
  const m = text.match(RED)
  return { binary: m ? 0 : 1, hit: m ? m[0] : null }
}
