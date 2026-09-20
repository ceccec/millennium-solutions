// HTML escaping, once.
//
// Three byte-identical copies of this lived in scripts/atom-feed.ts, scripts/paper.ts and src/latex — and a
// fourth, in scripts/rights.ts, escaped `&` and `<` but not `>`. Four copies of a one-line function is four
// chances for one of them to be the odd one out, which is exactly what had already happened.
//
// This is a LEAF: it imports nothing, so src/latex — a pure module with no filesystem dependency — can use
// it without acquiring one.
export const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// STRIPPING TAGS IS THE OTHER HALF OF THE SAME JOB, and it had grown four copies of its own — in
// scripts/novelty.ts, scripts/prose-trial.ts, scripts/uses.ts and scripts/zenodo-gate.ts, each reading
// fetched HTML down to text before looking for words in it. They were byte-identical, which is luck: the
// escaping above was consolidated once for precisely this reason and then regrew four more copies, three
// of them wrong in three different ways. A leaf helper does not stay consolidated because someone tidied
// it; scripts/canon-gate.ts is what keeps it that way.
//
// It is deliberately blunt — no entity decoding, no nesting — because every caller wants the same thing:
// enough text to search for a phrase. A caller needing real parsing should say so rather than sharpen this.
export const TAG = /<[^>]+>/g
export const stripTags = (s: string): string => s.replace(TAG, ' ')

// THE PATTERN IS EXPORTED BESIDE THE FUNCTION because one caller needs it mid-chain: scripts/prose-trial.ts
// strips tags as one step of a long `.replace(…).replace(…)` reduction to bare prose, and a function cannot
// sit in the middle of that chain. Exporting the regex rather than letting that one caller keep its own copy
// is the whole point — the odd one out is always the caller that had a reason.

// ESCAPING ONLY THE ANGLE BRACKETS, for prose that is still going to be parsed as MARKDOWN. scripts/paper.ts
// emits each Lean file's header comment into a markdown document: a `<d>` in a path template has to become
// literal text, but the prose's own markdown — emphasis, code spans, a `>` that begins a blockquote — must
// keep working, and `&` in a markdown document is already handled by the renderer.
//
// It is a DIFFERENT JOB from escapeHtml, not a weaker version of it, and it is here rather than in paper.ts
// because that is exactly how the nine copies this module now owns each got started: a caller with a real
// reason to differ, keeping its reason to itself. The reason belongs next to the others.
export const escapeAngles = (s: string): string => s.replace(/</g, '&lt;').replace(/>(?!\s)/g, '&gt;')
