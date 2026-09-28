/** ── THE CROSS-DOMAIN VOCABULARY — one grid, as many subjects as can be put honestly on it ─────────────────
 *
 *  DATA ONLY. No fetch, no clustering, no report. scripts/coils.ts clusters it and scripts/entangle-oeis.ts
 *  checks it against an outside catalogue. The split is the one src/mcp/index.ts records the reason for.
 *
 *  THE GRID IS THE EXPERIMENT. Every expression is a function of ONE dimensionless n, so expressions from
 *  different subjects are asked the same question and their answers can be compared. Put each subject on its
 *  own grid and entanglement is unmeasurable by construction — nothing from chemistry could ever equal
 *  anything from music, because the two would never be asked anything in common. On one grid the question is
 *  decidable and can come back either way, which is the only property that makes an answer worth having.
 *
 *  WHAT EARNS A PLACE HERE. An expression must be a COUNT THAT SUBJECT ACTUALLY MAKES — a quantity somebody
 *  working in it would recognise and compute. Not an analogy, not a resemblance, not "you could think of it
 *  as". The test I applied to each: would a practitioner say "yes, that is how many there are"? Several
 *  candidates were dropped for failing it, and they are named at the bottom rather than quietly omitted,
 *  because a vocabulary that keeps only its successes is a vocabulary that has stopped being an experiment.
 *
 *  AND THE NEAR MISSES ARE DELIBERATE. n(n+1)/2 against n(n−1)/2, and the polygon's n(n−3)/2 diagonals
 *  against both: three expressions one index apart that must NOT coil. A grid on which everything coils has
 *  stopped discriminating and can confirm nothing, so the separations are as load-bearing as the identities. */

export type DomExpr = { say: string; dom: string; lean: string; at: (n: number) => bigint }

const B = (x: number | bigint) => BigInt(x)
export const fib = (n: number): bigint => { let a = 0n, b = 1n; for (let i = 0; i < n; i++) { [a, b] = [b, a + b] } return a }
export const fact = (n: number): bigint => { let r = 1n; for (let i = 2; i <= n; i++) r *= B(i); return r }
export const choose = (n: number, k: number): bigint => k < 0 || k > n ? 0n : fact(n) / (fact(k) * fact(n - k))
export const catalan = (n: number): bigint => choose(2 * n, n) / B(n + 1)
export const lucas = (n: number): bigint => { let a = 2n, b = 1n; for (let i = 0; i < n; i++) { [a, b] = [b, a + b] } return a }
/** Bell numbers by the triangle — the ways to partition a set of n labelled things. */
export const bell = (n: number): bigint => {
  let row = [1n]
  for (let i = 1; i <= n; i++) { const next = [row[row.length - 1]]; for (const v of row) next.push(next[next.length - 1] + v); row = next }
  return row[0]
}
/** Unrestricted partitions of n — the ways to write n as a sum of positive parts, order disregarded. */
export const parts = (n: number): bigint => {
  const p = new Array<bigint>(n + 1).fill(0n); p[0] = 1n
  for (let k = 1; k <= n; k++) for (let i = k; i <= n; i++) p[i] += p[i - k]
  return p[n]
}
/** Derangements — permutations leaving nothing in place. */
export const derange = (n: number): bigint => { let d = 1n; for (let i = 1; i <= n; i++) d = B(i) * d + (i % 2 === 0 ? 1n : -1n); return n === 0 ? 1n : d }
/** Motzkin numbers — the chord diagrams on n points with no crossings, arcs optional. */
export const motzkin = (n: number): bigint => {
  const m = [1n, 1n]
  for (let i = 2; i <= n; i++) { let s = m[i - 1]; for (let k = 0; k <= i - 2; k++) s += m[k] * m[i - 2 - k]; m[i] = s }
  return m[n]
}

export const DOM_EXPRS: DomExpr[] = [
  // ══ DOUBLING · 2^n ════════════════════════════════════════════════════════════════════════════════════════
  { say: 'the frequency ratio of n octaves', dom: 'music', lean: '2 ^ n', at: (n) => 2n ** B(n) },
  { say: 'the values an n-bit register addresses', dom: 'computing', lean: '2 ^ n', at: (n) => 2n ** B(n) },
  { say: 'the cells after n divisions', dom: 'biology', lean: '2 ^ n', at: (n) => 2n ** B(n) },
  { say: 'the dilution factor after n halvings', dom: 'chemistry', lean: '2 ^ n', at: (n) => 2n ** B(n) },
  { say: 'the subsets of an n-element set', dom: 'number theory', lean: '2 ^ n', at: (n) => 2n ** B(n) },
  { say: 'the keys in an n-bit keyspace', dom: 'cryptography', lean: '2 ^ n', at: (n) => 2n ** B(n) },
  { say: 'the infections after n generations at R0 = 2', dom: 'epidemiology', lean: '2 ^ n', at: (n) => 2n ** B(n) },
  { say: 'the leaves of a binary decision tree of depth n', dom: 'logistics', lean: '2 ^ n', at: (n) => 2n ** B(n) },
  { say: 'the distinct yes/no ballots on n questions', dom: 'law', lean: '2 ^ n', at: (n) => 2n ** B(n) },
  { say: 'the plain weave lift patterns on n shafts', dom: 'textiles', lean: '2 ^ n', at: (n) => 2n ** B(n) },

  // ══ DOUBLING LESS ONE · 2^n − 1 ═══════════════════════════════════════════════════════════════════════════
  { say: 'the matches to settle a knockout of 2^n entrants', dom: 'sport', lean: '2 ^ n - 1', at: (n) => 2n ** B(n) - 1n },
  { say: 'the largest value n bits can hold', dom: 'computing', lean: '2 ^ n - 1', at: (n) => 2n ** B(n) - 1n },
  { say: 'the n-th Mersenne candidate', dom: 'number theory', lean: '2 ^ n - 1', at: (n) => 2n ** B(n) - 1n },
  { say: 'the nodes of a complete binary tree of depth n-1', dom: 'taxonomy', lean: '2 ^ n - 1', at: (n) => 2n ** B(n) - 1n },
  { say: 'the moves to solve the tower of n discs', dom: 'games', lean: '2 ^ n - 1', at: (n) => 2n ** B(n) - 1n },
  { say: 'the non-empty subsets of an n-element set', dom: 'logistics', lean: '2 ^ n - 1', at: (n) => 2n ** B(n) - 1n },

  // ══ TRIPLING · 3^n ════════════════════════════════════════════════════════════════════════════════════════
  { say: 'the numerator of n stacked perfect fifths', dom: 'music', lean: '3 ^ n', at: (n) => 3n ** B(n) },
  { say: 'the ternary strings of length n', dom: 'number theory', lean: '3 ^ n', at: (n) => 3n ** B(n) },
  { say: 'the branches after n ternary splits', dom: 'botany', lean: '3 ^ n', at: (n) => 3n ** B(n) },
  { say: 'the outcomes of n three-way votes', dom: 'law', lean: '3 ^ n', at: (n) => 3n ** B(n) },

  // ══ PAIRWISE · n(n−1)/2 ═══════════════════════════════════════════════════════════════════════════════════
  { say: 'the handshakes among n people', dom: 'number theory', lean: 'n * (n - 1) / 2', at: (n) => B(n * (n - 1) / 2) },
  { say: 'the pairwise interactions among n species', dom: 'chemistry', lean: 'n * (n - 1) / 2', at: (n) => B(n * (n - 1) / 2) },
  { say: 'the edges of a complete graph on n vertices', dom: 'geometry', lean: 'n * (n - 1) / 2', at: (n) => B(n * (n - 1) / 2) },
  { say: 'the fixtures of an n-team round robin', dom: 'sport', lean: 'n * (n - 1) / 2', at: (n) => B(n * (n - 1) / 2) },
  { say: 'the direct links among n cities', dom: 'logistics', lean: 'n * (n - 1) / 2', at: (n) => B(n * (n - 1) / 2) },
  { say: 'the bilateral pairs among n trading partners', dom: 'economics', lean: 'n * (n - 1) / 2', at: (n) => B(n * (n - 1) / 2) },
  { say: 'the contact pairs in a household of n', dom: 'epidemiology', lean: 'n * (n - 1) / 2', at: (n) => B(n * (n - 1) / 2) },

  // ══ THE THREE NEAR MISSES, one index apart, which must stay apart ══════════════════════════════════════════
  { say: 'the staircase sum of the first n steps', dom: 'geometry', lean: 'n * (n + 1) / 2', at: (n) => B(n * (n + 1) / 2) },
  { say: 'the beats in a bar of n accumulating pulses', dom: 'music', lean: 'n * (n + 1) / 2', at: (n) => B(n * (n + 1) / 2) },
  { say: 'the courses in a triangular gable of n rows', dom: 'architecture', lean: 'n * (n + 1) / 2', at: (n) => B(n * (n + 1) / 2) },
  { say: 'the diagonals of a convex n-gon', dom: 'architecture', lean: 'n * (n - 3) / 2', at: (n) => B(Math.max(0, n * (n - 3) / 2)) },

  // ══ FIBONACCI ═════════════════════════════════════════════════════════════════════════════════════════════
  { say: 'the spirals in a phyllotactic whorl at rank n', dom: 'botany', lean: 'fib n', at: (n) => fib(n) },
  { say: 'the pairs in the n-th generation', dom: 'biology', lean: 'fib n', at: (n) => fib(n) },
  { say: 'the n-th Zeckendorf base element', dom: 'number theory', lean: 'fib n', at: (n) => fib(n) },
  { say: 'the rhythms of n beats in ones and twos', dom: 'music', lean: 'fib n', at: (n) => fib(n) },
  { say: 'the binary strings of length n-2 with no two adjacent ones', dom: 'computing', lean: 'fib n', at: (n) => fib(n) },

  // ══ LUCAS — the other solution of the same recursion, which must NOT coil with Fibonacci ═══════════════════
  { say: 'the n-th Lucas number, same recursion and different seed', dom: 'number theory', lean: 'lucas n', at: (n) => lucas(n) },

  // ══ CATALAN ═══════════════════════════════════════════════════════════════════════════════════════════════
  { say: 'the secondary structures of an n-pair strand with no crossings', dom: 'biology', lean: 'catalan n', at: (n) => catalan(n) },
  { say: 'the balanced bracketings of length 2n', dom: 'computing', lean: 'catalan n', at: (n) => catalan(n) },
  { say: 'the triangulations of a convex (n+2)-gon', dom: 'geometry', lean: 'catalan n', at: (n) => catalan(n) },
  { say: 'the binary parse trees over n+1 leaves', dom: 'linguistics', lean: 'catalan n', at: (n) => catalan(n) },
  { say: 'the ways to bracket n+1 factors', dom: 'games', lean: 'catalan n', at: (n) => catalan(n) },

  // ══ MOTZKIN — Catalan's neighbour, arcs optional. Must not coil with it. ═══════════════════════════════════
  { say: 'the non-crossing chord diagrams on n points, arcs optional', dom: 'biology', lean: 'motzkin n', at: (n) => motzkin(n) },

  // ══ FACTORIAL — which coiled with NOTHING until the vocabulary widened ═════════════════════════════════════
  { say: 'the orderings of n elements', dom: 'number theory', lean: 'fct n', at: (n) => fact(n) },
  { say: 'the word orders of an n-word sentence', dom: 'linguistics', lean: 'fct n', at: (n) => fact(n) },
  { say: 'the tours visiting n cities in some order', dom: 'logistics', lean: 'fct n', at: (n) => fact(n) },
  { say: 'the seatings of n dancers in a line', dom: 'dance', lean: 'fct n', at: (n) => fact(n) },

  // ══ DERANGEMENTS — factorial's near neighbour, and it must stay apart ══════════════════════════════════════
  { say: 'the reseatings of n dancers with nobody in their own place', dom: 'dance', lean: 'derange n', at: (n) => derange(n) },

  // ══ BELL — partitions of a labelled set ═══════════════════════════════════════════════════════════════════
  { say: 'the ways to group n labelled things', dom: 'number theory', lean: 'bell n', at: (n) => bell(n) },
  { say: 'the distinct senses a set of n features can carve', dom: 'linguistics', lean: 'bell n', at: (n) => bell(n) },
  { say: 'the equivalence classes on n data points', dom: 'statistics', lean: 'bell n', at: (n) => bell(n) },

  // ══ PARTITIONS — unlabelled, and therefore NOT Bell ═══════════════════════════════════════════════════════
  { say: 'the ways to write n as a sum of positive parts', dom: 'number theory', lean: 'parts n', at: (n) => parts(n) },
  { say: 'the rhythmic groupings of n beats into a bar', dom: 'music', lean: 'parts n', at: (n) => parts(n) },
  { say: 'the degeneracies of an n-quantum harmonic level', dom: 'physics', lean: 'parts n', at: (n) => parts(n) },
  { say: 'the ways to cut a length into whole parts', dom: 'textiles', lean: 'parts n', at: (n) => parts(n) },

  // ══ CENTRAL BINOMIAL · C(2n,n) — lattice paths ════════════════════════════════════════════════════════════
  { say: 'the shortest lattice routes across an n by n grid', dom: 'navigation', lean: 'chooseN (2 * n) n', at: (n) => choose(2 * n, n) },
  { say: 'the street-grid routes between opposite corners of n blocks', dom: 'logistics', lean: 'chooseN (2 * n) n', at: (n) => choose(2 * n, n) },
  { say: 'the walks returning to the origin in 2n steps, one dimension', dom: 'physics', lean: 'chooseN (2 * n) n', at: (n) => choose(2 * n, n) },

  // ══ BINOMIAL ROW · C(12,n) ════════════════════════════════════════════════════════════════════════════════
  { say: 'the states of an n-ball pattern at height 12', dom: 'juggling', lean: 'chooseN 12 n', at: (n) => choose(12, Math.min(n, 12)) },
  { say: 'the ways to choose n substituents from 12 sites', dom: 'chemistry', lean: 'chooseN 12 n', at: (n) => choose(12, Math.min(n, 12)) },
  { say: 'the n-subsets of a twelve-element set', dom: 'number theory', lean: 'chooseN 12 n', at: (n) => choose(12, Math.min(n, 12)) },
  { say: 'the n-note chords available in twelve-tone equal temperament', dom: 'music', lean: 'chooseN 12 n', at: (n) => choose(12, Math.min(n, 12)) },
  { say: 'the n-card hands from a twelve-card deck', dom: 'games', lean: 'chooseN 12 n', at: (n) => choose(12, Math.min(n, 12)) },

  // ══ SQUARES · n^2 ═════════════════════════════════════════════════════════════════════════════════════════
  { say: 'the area of a square of side n', dom: 'geometry', lean: 'n * n', at: (n) => B(n * n) },
  { say: 'the tiles in an n by n floor', dom: 'architecture', lean: 'n * n', at: (n) => B(n * n) },
  { say: 'the intensity divisor at n times the distance', dom: 'physics', lean: 'n * n', at: (n) => B(n * n) },
  { say: 'the cells of an n by n board', dom: 'games', lean: 'n * n', at: (n) => B(n * n) },

  // ══ DECADES · 10^n ════════════════════════════════════════════════════════════════════════════════════════
  { say: 'a step of n on the pH scale', dom: 'chemistry', lean: '10 ^ n', at: (n) => 10n ** B(n) },
  { say: 'n orders of magnitude', dom: 'metrology', lean: '10 ^ n', at: (n) => 10n ** B(n) },
  { say: 'the place value of the n-th decimal column', dom: 'economics', lean: '10 ^ n', at: (n) => 10n ** B(n) },

  // ══ CYCLIC · (7n) mod 12 ══════════════════════════════════════════════════════════════════════════════════
  { say: 'the pitch class after n fifths', dom: 'music', lean: '(7 * n) % 12', at: (n) => B((7 * n) % 12) },
  { say: 'the orbit of the generator 7 in Z/12', dom: 'number theory', lean: '(7 * n) % 12', at: (n) => B((7 * n) % 12) },
  { say: 'the hour struck n intervals of seven apart', dom: 'navigation', lean: '(7 * n) % 12', at: (n) => B((7 * n) % 12) },

  // ══ CASTING OUT NINES ═════════════════════════════════════════════════════════════════════════════════════
  { say: 'the digit root of n', dom: 'number theory', lean: 'if n = 0 then 0 else 1 + (n - 1) % 9', at: (n) => B(n === 0 ? 0 : 1 + (n - 1) % 9) },
  { say: 'the residue of n on the nonagon', dom: 'geometry', lean: 'if n = 0 then 0 else 1 + (n - 1) % 9', at: (n) => B(n === 0 ? 0 : 1 + (n - 1) % 9) },
  { say: 'the check digit under the nines rule', dom: 'cryptography', lean: 'if n = 0 then 0 else 1 + (n - 1) % 9', at: (n) => B(n === 0 ? 0 : 1 + (n - 1) % 9) },

  // ══ AND FOUR THAT SHOULD STILL JOIN NOTHING, kept as the discrimination control ════════════════════════════
  { say: 'the cents in n semitones', dom: 'music', lean: '100 * n', at: (n) => B(100 * n) },
  { say: 'the degrees of n nonagon steps', dom: 'geometry', lean: '40 * n', at: (n) => B(40 * n) },
  { say: 'the taxonomic ranks below kingdom at depth n', dom: 'taxonomy', lean: 'n', at: (n) => B(n) },
  { say: 'the tariff bands at n thresholds', dom: 'economics', lean: '3 * n + 1', at: (n) => B(3 * n + 1) },
]

/** ── WHAT WAS CONSIDERED AND DROPPED, because a vocabulary that keeps only its successes is not an experiment.
 *  Each of these failed the test "would a practitioner say yes, that is how many there are":
 *    · Elliott wave counts as a Fibonacci instance in finance — the counts are imposed on the data by the
 *      analyst, not counted from it, so it is a reading rather than a census.
 *    · the golden ratio in facade proportions as an architecture instance — measured ratios cluster nowhere
 *      near φ more than chance across surveyed buildings; the claim is folklore with a large literature
 *      refuting it, and putting it here would smuggle that folklore into a file that decides things.
 *    · sunflower seed counts as a direct Fibonacci instance — the SPIRAL counts are Fibonacci, the seed total
 *      is not, and conflating them is the commonest error in the popular account.
 *    · musical consonance as a small-integer-ratio instance — the ratios are real, but "consonant" is a
 *      perceptual judgement and not a count, so it has no place on a grid of counts. */
export const DROPPED = 4
export const ALL_DOMS = [...new Set(DOM_EXPRS.map((e) => e.dom))].sort()
