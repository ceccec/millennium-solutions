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
