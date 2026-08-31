// TRANSLATE — the deposit's test idiom into Lean, mechanically.
//
// The tests are not arbitrary TypeScript. They are written in a small, repeated vocabulary — digits(),
// units(), m9(), .every, .some, **, === — because they all describe the same ring. A vocabulary that small is
// a language, and a language can be translated without judgement. The previous classifier called 173 of 176
// claims "needs an author" when many were `digits().every(d => ...)`, which is `(List.range' 1 9).all` and
// nothing more. That was a limit of the reader, not of the claims, and reporting it as the latter would have
// overstated how much of this genuinely needs a person.
//
// What is still refused: anything using a construct not in the table. Refusal is by whitelist, never by
// best-effort — a translation that guesses would produce a theorem that compiles and states the wrong thing,
// which is the exact failure this deposit has been cleaning out all along.

/** The vocabulary. Order matters: longer patterns first. */
// PRE-RULES run BEFORE the refusal list. They are structural rewrites that REMOVE a construct rather than
// translate it, so the refusal list must judge what is left instead of what was written. Ordering them after
// REFUSE meant `join(` was rejected before the rewrite that eliminates it could fire — the refusal list was
// reading a form the translator no longer produces. Anything these do not consume is still refused below.
const PRE_RULES: [RegExp, string | ((...a: string[]) => string)][] = [
  // toUuid OF AN ASCII LITERAL IS toUuidBytes OF ITS CHARACTER CODES. The Lean port is pinned to the shipped
  // implementation at published values (address.lean: to_uuid_bytes_of_a, to_uuid_bytes_of_uuidna), and the
  // dashed-hex rendering is injective, so comparing two address STRINGS is comparing their byte lists. Only
  // ASCII literals are rewritten: a character above 127 encodes to more than one byte and guessing which
  // would be inventing the claim rather than reading it.
  // the class EXCLUDES the apostrophe (0x27). Including it let the match run straight past the closing quote
  // and swallow the rest of the expression, so `toUuid('a') === toUuid('a')` rendered as one enormous literal
  // that happened to type-check. A greedy literal is worse than a refusal: it produces a theorem about the
  // wrong string with no sign anything went wrong.
  [/\btoUuid\('([\x20-\x26\x28-\x7e]*)'\)/g, ((_m: string, lit: string) =>
    `Address.toUuidBytes [${[...lit].map((c) => c.charCodeAt(0)).join(', ')}]`) as unknown as string],
  // COMPARING JOINED LISTS IS COMPARING THE LISTS. `a.join(',') === b.join(',')` holds exactly when a and b
  // are equal, PROVIDED no element's rendering contains the separator — and every element here is a natural
  // number, so none does. The join is a way of comparing lists in JavaScript, not part of the claim; keeping
  // it would mean rendering string concatenation into Lean to say something about numbers.
  [/\.join\('[^']*'\)\s*===\s*([\s\S]+?)\.join\('[^']*'\)/g, ' == $1'],
  // slice(a,b) on a list is drop-then-take. Both bounds are literals wherever this fires, so the rewrite is
  // exact rather than a guess about what the ends might be.
  [/([A-Za-z_]\w*)\.slice\((\d+),\s*(\d+)\)/g, (_m: string, l: string, a: string, b: string) =>
    `(List.take ${Number(b) - Number(a)} (List.drop ${a} ${l}))` as string] as unknown as [RegExp, string],
  // THE IMPORTED CONSTANTS ARE NUMBERS, NOT CONSTRUCTS, and they fold HERE rather than in the table below so
  // that the refusal list and the exactness check below both see what the test actually computes. `360 / BASE` is a
  // division of two literals; `360 / <an identifier>` is not, and the difference decides whether the division
  // may be kept at all. Read from src/0/index.ts: TRINITY = 3, BASE = TRINITY ** 2 = 9, and
  // A432_STEP = 360 / BASE = 40 — exact in binary floating point, so the constant every test sees is the
  // integer 40. Checked at the definition rather than guessed from the name.
  // They come AFTER the toUuid rule on purpose: rewriting a literal first means a constant's name can never
  // be substituted inside the string whose bytes are being taken.
  [/\bA432_STEP\b/g, '40'],
  [/\bBASE\b/g, '9'],
  [/\bTRINITY\b/g, '3'],
]

/** JAVASCRIPT DIVISION IS NOT LEAN'S NAT DIVISION, and the gap is silent. `9 / 2` is 4.5 in the test and 4
 *  in the kernel, so `9 / 2 === 4` is FALSE where the ledger runs it and TRUE where the kernel checks it —
 *  the exact failure this file exists to prevent: a theorem that compiles, passes the agreement check on its
 *  truth value, and states something else. Measured before touching it: thirteen already-translated claims
 *  carried a `/`, and among them `3 / 2 == 1.5` and `4 / 3 > 1.333` were being emitted, which are not even
 *  well-typed over Nat. Nothing here was ever right; it was surviving on the kernel throwing it out — and a
 *  rendering that depends on the kernel disagreeing is not a whitelist, it is a coin toss with a safety net.
 *
 *  WHAT IS SAFE IS EXACTLY THIS: a division whose numerator and denominator are both CLOSED literal
 *  arithmetic and which leaves no remainder. `360 / 9` and `(8 * 7) / 2` are 40 and 28 under both readings,
 *  because truncation can only differ from real division when something is actually truncated. Anything else
 *  — a non-literal operand like `n * (360 / n)` or `f * 3 / 2`, or a literal pair with a remainder — keeps
 *  its slash and is refused by name below. Deciding whether a general JS division happens to land on an
 *  integer would mean evaluating the claim instead of reading it, which is not this translator's job.
 *
 *  VERIFIED AND KEPT, NOT FOLDED AWAY. The first version replaced `360 / 9` with `40`, and that quietly made
 *  the theorem worse: `the_regular_nonagon_exterior_angle_is_the_a432_step` became `40 == 40 && 40 == 40`,
 *  a tautology where the ledger claims an arithmetic fact about the nonagon. A rendering may not weaken the
 *  claim any more than it may strengthen it. So the division is checked and then LEFT IN, with the slash
 *  parked on a marker character while the refusal list runs — the same neutralise-and-restore trick
 *  `fixChains` uses to advance a scan. The arithmetic is only ever used to decide, never to substitute.
 */
const EXACT_DIV = '\u0001'

/** The value of closed literal arithmetic over `+` and `*`, or null if it is anything else. Deliberately
 *  excludes `-`: Nat subtraction truncates at zero, so a numerator written with a minus is not a value the
 *  two languages are guaranteed to agree on, and this function exists precisely to decide agreement. */
function litValue(s: string): number | null {
  if (!/^[\d\s+*]+$/.test(s) || !/\d/.test(s)) return null
  let total = 0
  for (const term of s.split('+')) {
    let prod = 1
    for (const f of term.split('*')) {
      const n = Number(f.trim())
      if (!Number.isSafeInteger(n)) return null
      prod *= n
    }
    total += prod
  }
  return Number.isSafeInteger(total) ? total : null
}

function markExactDivision(b: string): string {
  return b.replace(/(?:\(([\d\s+*]+)\)|(?<![\d.])(\d+))\s*\/\s*(\d+)(?![\d.])/g,
    (m: string, paren: string | undefined, bare: string | undefined, den: string) => {
      const n = litValue(paren ?? bare ?? ''), d = Number(den)
      return n === null || d === 0 || n % d !== 0 ? m : m.replace('/', EXACT_DIV)
    })
}

/** `new Set(xs).size` IS `xs.eraseDups.length`, and it belongs in the PRE phase for the same reason `join`
 *  does: the rewrite REMOVES the construct, so it has to run before the refusal list judges what is left.
 *
 *  THE RULE THAT COULD NOT FIRE. There was already an entry for this shape in the table below, and it had
 *  never once fired in the whole ledger. Two independent reasons, either of them fatal: `Set` is on the
 *  refusal list, so every body carrying it was rejected before the table was reached; and its argument
 *  pattern `[^)]+` cannot cross a nested call, so `new Set(digits().map(…)).size` — the form almost every
 *  claim actually uses — would not have matched even if it had been reached. A rule that cannot fire is not
 *  a rule, it is a comment that looks like code, and counting it as coverage is how a translator comes to
 *  believe it reads more than it does. Bracket-walking rather than a regex, because counting the brackets
 *  is the entire job.
 *
 *  WHY THE TWO ARE THE SAME NUMBER. A JavaScript Set keeps one member per SameValueZero class; Lean's
 *  `List.eraseDups` keeps the first occurrence of each `BEq` class and drops the rest. On the values that
 *  can survive this translator — naturals built from literals, `+ * %` and the deposit's own lists, with
 *  negative literals and every string-producing call already refused — SameValueZero and Nat equality are
 *  the same relation, so the two keep the same elements and `.size` and `.length` count the same thing.
 *  Only the count is read, so the one difference that does exist — a Set has no order, eraseDups keeps
 *  first-seen order — is not observable in the claim. `new Set(xs).size === xs.length` therefore states
 *  distinctness on both sides, which is what the ledger's tests use it for.
 *
 *  ONLY `new Set(E).size` IS CONSUMED, and that is what makes widening this safe. `.has(...)`, a Set bound
 *  to a name and read later, a `Set<number>` annotation, union or intersection built from spreads — none of
 *  them are touched, so the word `Set` is still in the text when the refusal list runs and they are still
 *  refused by name. The rewrite either eliminates the construct completely or leaves it to be refused;
 *  there is no third outcome where a Set survives half-translated.
 */
function setSizeToLength(b: string): string {
  let from = 0
  for (;;) {
    const i = b.indexOf('new Set(', from)
    if (i < 0) return b
    let d = 0, j = i + 'new Set'.length
    for (; j < b.length; j++) { if (b[j] === '(') d++; else if (b[j] === ')') { d--; if (d === 0) break } }
    if (j >= b.length) return b                       // unbalanced: leave it for the refusal list
    // `.size` and nothing else. `.sizeOf` or a bare `new Set(x)` keeps the word Set and stays refused.
    if (b.slice(j + 1, j + 6) !== '.size' || /[A-Za-z0-9_]/.test(b[j + 6] ?? '')) { from = i + 8; continue }
    b = b.slice(0, i) + '(' + b.slice(i + 8, j) + ').eraseDups.length' + b.slice(j + 6)
    from = i
  }
}

const RULES: [RegExp, string][] = [
  [/\bdigitalRoot\(/g, 'DR ('],                   // defined in the emitted preamble
  [/\bdigits\(\)/g, "(List.range' 1 9)"],          // the residues 1..9, as the deposit defines them
  [/\bunits\(\)/g, '[1,2,4,5,7,8]'],
  [/\btriad\(\)/g, '[3,6,9]'],
  [/\bvortexOrbit\(\)/g, '[1,2,4,8,7,5]'],
  [/\bm9\(/g, 'M9 ('],                              // wrapper defined in the emitted preamble
  // BASE, TRINITY and A432_STEP fold in the PRE phase now — see the note there
  [/\.every\(/g, '.all ('],
  [/\.some\(/g, '.any ('],
  [/\.includes\(/g, '.contains ('],
  // the distinct-count idiom used to be a rule HERE and had never once fired; see setSizeToLength above
  [/\.filter\(/g, '.filter ('],
  // `.map(` NEEDS THE SPACE, and it was the one method in the vocabulary that never got a rule. Lean has no
  // call-parenthesis syntax: `xs.map(f)` is a parse error (`unexpected token '('`), not a call. Every other
  // method here — every, some, includes, filter — had its space inserted; map only ever appeared in output
  // built by the loop rewrites, which write the space themselves, so the gap stayed invisible until a claim
  // arrived with `.map(` written by hand. It reached the kernel, failed to parse, and was quarantined, which
  // is the safety net doing its job and not a substitute for the rule.
  [/\.map\(/g, '.map ('],
  [/\.length\b/g, '.length'],
  [/\(([a-z][a-zA-Z0-9]*)\)\s*=>/g, 'fun $1 =>'],   // arrow to lambda, any single binder
  [/\bArray\.from\(\{ ?length: ?(\d+) ?\}, ?\(_, ?([a-z])\) => \2\)/g, '(List.range $1)'],
  [/\*\*/g, '^'],
  [/===/g, '=='],
  [/!==/g, '!='],
  [/&&/g, '&&'],
  [/\|\|/g, '||'],
]

/** Constructs that have no faithful mechanical rendering — presence means refuse. */
const REFUSE = [
  // merkleFold IS NOT THE SAME FUNCTION ON BOTH SIDES, and the difference is invisible in the name. The
  // TypeScript merkleFold takes RAW STRINGS, sorts them as strings and merges them directly; the Lean port
  // takes uuid BYTE-LISTS and renders each as dashed hex before merging. They agree only when every leaf is
  // already an address. Measured over this ledger: of the fold claims written with an array literal, ZERO
  // pass addresses and all thirteen pass raw strings — so translating any of them would produce a theorem
  // that compiles, passes the agreement check on its truth value, and states something else. Refused by name,
  // with the reason, which is the only version of this that helps anybody.
  /\bmerkleFold\b/,
  // `.find(...)` — REFUSED BY NAME, and the reason is the `!` rather than the Option.
  //
  // `List.find?` is the obvious counterpart and the Option is not the hard part: at depth one,
  // `xs.find(p) === v` renders exactly as `xs.find? p == some v`, since a JS `undefined` is never equal to a
  // number and `none` is never equal to `some v`. What the ledger actually writes is depth TWO —
  // `const inv = (u) => U.find((w) => m9(u * w) === 1)!; return U.every((u) => inv(inv(u)) === u)` — and
  // there the two languages part company. TypeScript's `!` is ERASED at runtime; it asserts, it does not
  // check. So when the inner find misses, JavaScript does not stop: it calls `inv(undefined)` and runs the
  // predicate again with `undefined` as an operand. Lean's `Option.bind` short-circuits to `none`.
  //
  // Those agree only when the predicate propagates the miss, which is a fact about the PREDICATE, not about
  // the shape. `(w) => m9(u * w) === 1` does propagate — `undefined * w` is NaN and every comparison with
  // NaN is false — but `(w) => w === 1` does not: JavaScript would find 1 and could return true where
  // `none.bind` is false. A rule keyed on the shape would render both the same way and be wrong about the
  // second, which is the "compiles and states something else" failure this file is built to avoid.
  //
  // Measured before deciding, over the whole queue: FIVE bodies contain `.find(`. Three are already refused
  // for something unrelated (a negative literal, a JSON round-trip, an `undefined` sentinel compared
  // directly), and the remaining two are both the depth-two involution above. So a depth-one rule would
  // fire on nothing — the same dead rule as the `new Set` entry noted above — and a depth-two rule would
  // need a side condition on the predicate's behaviour at `undefined`. Refused by name until a claim exists
  // that a shape rule can read honestly.
  /\.find\(/,
  /\bsort\(/, /\bjoin\(/, /\bJSON\b/, /\bSet\b/, /\bMap\b/, /\bString\b/, /\bNumber\b/,
  /\btoUuid\b/, /\bcomputes\b/, /\bmerkleFold\b/, /\bimprint/, /\breduce\(/, /\bflatMap\(/,
  /\bmatch\(/, /\breplace\(/, /=>\s*\{/, /\bcls\(/,
  /-\s*m9|m9\(\s*-/,                                 // unary minus: Nat subtraction truncates, so refuse
  // NEGATIVE LITERALS. Lean's Nat has none, and on Int the modulo differs — a knight-move test written with
  // [-1, 2] rendered into a statement that is not the one the ledger asserts. Caught by reading the output,
  // not by the count: it translated cleanly and was wrong. Refuse rather than pick a numeric tower.
  /(^|[\s,[(])-\d/,
  // DESTRUCTURED parameters: the arrow rule handles a single binder only, so ([a, b]) => would survive
  // untranslated and change meaning silently.
  /\(\s*\[[^\]]*\]\s*\)\s*=>/,
  /\([a-z][a-zA-Z0-9]*\s*,\s*[a-z]/,               // multi-parameter arrow: (x, i) => has no single-binder form
  // ANY SLASH LEFT AFTER THE EXACTNESS CHECK. markExactDivision has already parked the slash of every
  // literal-over-literal division that leaves no remainder on a marker character, so a surviving `/` is one
  // of exactly two things: a division whose value differs between the test (real) and the kernel (Nat,
  // truncating), or a regular-expression literal, which has no rendering here at all. Both must be refused,
  // and refusing the character is the only check that cannot be fooled by which of the two it was.
  /\//,
  // A DECIMAL LITERAL IS NOT A NAT. `1.5` and `1.333` appeared in emitted statements and were only ever kept
  // out of the sealed file by the kernel rejecting them; a rendering that relies on the kernel to catch it is
  // not a whitelist. Refused where it is written, so the reason is the literal instead of a type error.
  /\d\.\d/,
  // `^` IS XOR IN JAVASCRIPT AND POWER IN LEAN, and the collision was live. The table below rewrites `**`
  // into `^`, so by the time a statement is emitted the two are indistinguishable — and a claim written with
  // the XOR operator was being rendered as exponentiation. It shipped as
  // `(1 ^ 1) == 0 && (5 ^ 5) == 0 && ((3 ^ 5) ^ 0) == (3 ^ 5)`, which reads as 1¹ = 0, and the only thing
  // that stopped it was `decide` proving it false. A rendering caught by the kernel disagreeing is not a
  // whitelist working; it is a whitelist that missed and got lucky about the direction.
  // This check runs BEFORE the table, which is what makes it exact: at this point `**` is still `**`, so a
  // `^` in the text can only be the JavaScript XOR, and there is nothing to disambiguate.
  /\^/,
  // `toUuid(x).length` IS THE LENGTH OF A STRING, AND THE PORT RETURNS BYTES. This is the merkleFold lesson
  // again, one method call further in. The address rewrite above is sound for COMPARING addresses, because
  // the dashed-hex rendering is injective and two byte lists are equal exactly when their renderings are;
  // but `.length` does not survive that argument. The JavaScript reads 36, the character count of
  // `8-4-4-4-12` with its four dashes. `Address.toUuidBytes` (address.lean:49) returns `List Nat`, sixteen
  // bytes, so the Lean side reads 16. Two claims were being emitted with `== 36` against a list of length
  // sixteen — and one of them multiplied it out to `1000 * one == 36000`. They failed to parse before they
  // could be false, which is the sort of near miss that gets recorded here rather than quietly fixed.
  // Matched on the rewrite's own output, which is the only place the pair can be seen together: by the time
  // the refusal list runs, `toUuid('out:a')` has already become `Address.toUuidBytes [111, …]`.
  //
  // The match is the CO-OCCURRENCE of the port and any `.length`, not the two written next to each other,
  // because the first version of this rule only caught the adjacent form and a third claim slipped past it
  // by binding the address to a name first (`let a := Address.toUuidBytes […]; … a.length == 36`). Once a
  // value can be bound, "next to each other" stops being a property of the text. Coarse on purpose: it will
  // refuse a body that takes the length of some unrelated list while also comparing addresses, and refusing
  // more than necessary is the side a whitelist is supposed to err on.
  /^(?=[\s\S]*toUuidBytes)(?=[\s\S]*\.length)/,
  // THE TERNARY AND THE ZERO-ARGUMENT ARROW have no rendering here and were reaching the kernel as syntax
  // errors — `(b ? 1 : 0)` and `let t := () => 7 % 3 == 1; t() == t()`. Lean's `if … then … else` would need
  // the condition lifted to a Decidable proposition and the thunk would need a unit binder; neither is a
  // rewrite, both are decisions about what the claim means. Refused where they are written so the reason is
  // the construct rather than a parse error pointing at a column.
  /\?/,
  /\(\s*\)\s*=>/,
  /<<|>>/,                                          // bit shifts: Nat's are well-founded and pull in propext
  /\[\s*[a-z]\w*\s*[\]\[]/,                        // indexing a[i]: Lean needs get!/getD and a bound proof
]

export type Translation = { ok: true; lean: string } | { ok: false; why: string }

/** A body of `const a = X; const b = Y; return Z` is a chain of lets over one expression. Lean writes exactly
 *  that, so the shape is mechanical — the earlier version refused every such body and lost ~57 claims to a
 *  limitation of the reader rather than of the claims. Only simple `const NAME = EXPR;` bindings qualify;
 *  anything else (destructuring, functions, reassignment) still refuses. */
/** A BOUNDED FOR-PUSH LOOP IS A LIST COMPREHENSION. `const s = []; for (let k = A; k < B; k++) s.push(E)`
 *  builds exactly the list `(List.range' A (B-A)).map (fun k => E)` — same elements, same order, and the
 *  bound is a literal so the length is known. Refusing this shape as "control flow" was the same error as
 *  calling digit reversal string manipulation: the loop is not doing anything a map cannot say. Only the
 *  literal-bounded, single-push, no-branch form is rewritten; anything with a condition, an early exit, a
 *  second push or a non-literal bound is left refused, because those are genuinely not maps. */
function loopToMap(b: string): string | null {
  // One pattern, matched whole: `const s = []; for (let k = A; k < B; k++) s.push(E);` followed by the rest.
  // The push is anchored on `);` so a call inside E (digitalRoot(2 ** k)) is kept intact rather than cut at
  // its first bracket — splitting the head from the push across two matches is what made the first version
  // silently never fire.
  const m = b.match(/^const\s+([A-Za-z_]\w*)\s*=\s*\[\s*\]\s*;\s*for\s*\(\s*(?:let|var)\s+([A-Za-z_]\w*)\s*=\s*(\d+)\s*;\s*\2\s*<\s*(\d+)\s*;\s*\2\+\+\s*\)\s*\{?\s*\1\.push\(([\s\S]*?)\)\s*;\s*\}?\s*([\s\S]*)$/)
  if (!m) return null
  const [, name, v, from, to, expr, after] = m
  if (/\bfor\b|\bwhile\b|\.push\(/.test(after)) return null   // a second loop or push is not this shape
  const n = Number(to) - Number(from)
  if (!(n > 0)) return null
  const list = from === '0' ? `(List.range ${to})` : `(List.range' ${from} ${n})`
  return `const ${name} = ${list}.map (fun ${v} => ${expr.trim()}); ${after.trim()}`
}

/** A NESTED COUNTING LOOP IS A COUNT OVER A PRODUCT. `let a = 0, b = 0; for (r) for (c) COND ? a++ : b++`
 *  walks every (r,c) pair once and sorts each into one of two buckets, which is exactly
 *  `((range N).flatMap fun r => (range M).map fun c => COND)` counted by truth — same pairs, same order, and
 *  the two totals sum to the product because every pair lands in exactly one bucket. Only the literal-bounded,
 *  two-counter, single-ternary form is rewritten: a break, a third counter or a condition on the loop bounds
 *  is a different program and stays refused. */
function countingLoop(b: string): string | null {
  const m = b.match(/^let\s+([A-Za-z_]\w*)\s*=\s*0\s*,\s*([A-Za-z_]\w*)\s*=\s*0\s*;\s*for\s*\(\s*(?:let|var)\s+([A-Za-z_]\w*)\s*=\s*0\s*;\s*\3\s*<\s*(\d+)\s*;\s*\3\+\+\s*\)\s*for\s*\(\s*(?:let|var)\s+([A-Za-z_]\w*)\s*=\s*0\s*;\s*\5\s*<\s*(\d+)\s*;\s*\5\+\+\s*\)\s*(.+?)\s*\?\s*\1\+\+\s*:\s*\2\+\+\s*;\s*([\s\S]*)$/)
  if (!m) return null
  const [, a, bb, r, n, c, mm, cond, after] = m
  if (/\bfor\b|\bwhile\b|\+\+/.test(after)) return null
  const pairs = `((List.range ${n}).flatMap (fun ${r} => (List.range ${mm}).map (fun ${c} => ${cond.trim()})))`
  return `const __p = ${pairs}; const ${a} = (__p.filter (fun z => z)).length; const ${bb} = __p.length - (__p.filter (fun z => z)).length; ${after.trim()}`
}

/** BOUNDED STATE ITERATION IS A FOLD. `let s = init; for (let k = 0; k < N; k++) s = f(s)` applies f exactly
 *  N times to init, which is `(List.range N).foldl (fun s _ => f s) init` — same function, same count, same
 *  order, and the bound is a literal so the count is known. I previously reported 327 for-loop claims as
 *  needing judgement to render; measuring the shapes instead of asserting them showed the largest bucket was
 *  this one, and it needs no judgement at all. The loop variable is unused in the body of every case this
 *  fires on, which is checked — if the body reads k it is a different construct and stays refused. */
function stateIteration(b: string): string | null {
  const m = b.match(/^(?:let|const)\s+([A-Za-z_]\w*)\s*(?::\s*[^=]+)?=\s*([^;]+);\s*([\s\S]*?)for\s*\(\s*(?:let|var)\s+([A-Za-z_]\w*)\s*=\s*0\s*;\s*\4\s*<\s*(\d+)\s*;\s*\4\+\+\s*\)\s*\1\s*=\s*([^;]+);\s*([\s\S]*)$/)
  if (!m) return null
  const [, name, init, between, k, n, step, after] = m
  if (new RegExp('\\b' + k + '\\b').test(step)) return null   // the body reads the index: not a plain iteration
  if (/\bfor\b|\bwhile\b/.test(after)) return null
  return `${between}const ${name} = (List.range ${n}).foldl (fun ${name} _ => ${step.trim()}) (${init.trim()}); ${after.trim()}`
}

/** A CONDITIONAL PUSH OVER A RANGE IS A FILTER. `const t = []; for (let v = a; v <= b; v++) if (C) t.push(v)`
 *  collects exactly the values in the range satisfying C, in order — `(List.range' a (b-a+1)).filter (fun v => C)`.
 *  Only the form that pushes the loop VARIABLE itself is rewritten; pushing an expression of it is a map over
 *  the filter and is left alone rather than guessed at. */
function conditionalPush(b: string): string | null {
  const m = b.match(/^const\s+([A-Za-z_]\w*)\s*(?::\s*[^=]+)?=\s*\[\s*\]\s*;\s*for\s*\(\s*(?:let|var)\s+([A-Za-z_]\w*)\s*=\s*(\d+)\s*;\s*\2\s*(<=?)\s*(\d+)\s*;\s*\2\+\+\s*\)\s*if\s*\(([\s\S]*?)\)\s*\1\.push\(\s*\2\s*\)\s*;\s*([\s\S]*)$/)
  if (!m) return null
  const [, name, v, from, cmp, to, cond, after] = m
  if (/\bfor\b|\bwhile\b|\.push\(/.test(after)) return null
  const len = Number(to) - Number(from) + (cmp === '<=' ? 1 : 0)
  if (!(len > 0)) return null
  const list = from === '0' && cmp === '<' ? `(List.range ${to})` : `(List.range' ${from} ${len})`
  return `const ${name} = ${list}.filter (fun ${v} => ${cond.trim()}); ${after.trim()}`
}

/** AN EARLY-RETURN VALIDATION LOOP IS A UNIVERSAL QUANTIFIER. `for (let v = a; v <= b; v++) if (C) return
 *  false; return true` says exactly "no v in the range satisfies C", which is `(range).all (fun v => ¬ C)` —
 *  same range, same predicate, and the early exit is what `all` does. The two-level form nests the same way.
 *
 *  This is the shape I twice reported as needing judgement. The first time I asserted it without measuring;
 *  the second time I measured with a classifier that matched the `v++` in the loop HEADER and filed 259 of
 *  these under "counter accumulation". Both readings were wrong, and the loop needs no judgement at all. A
 *  measurement is only as good as the thing doing the measuring, which is not a lesson I expected to need
 *  twice in one file. */
function validationLoop(b: string): string | null {
  const one = /^for\s*\(\s*(?:let|var)\s+([A-Za-z_]\w*)\s*=\s*(\d+)\s*;\s*\1\s*(<=?)\s*(\d+)\s*;\s*\1\+\+\s*\)\s*if\s*\(([\s\S]*?)\)\s*return\s+false\s*;\s*return\s+true\s*;?\s*$/
  const two = /^for\s*\(\s*(?:let|var)\s+([A-Za-z_]\w*)\s*=\s*(\d+)\s*;\s*\1\s*(<=?)\s*(\d+)\s*;\s*\1\+\+\s*\)\s*for\s*\(\s*(?:let|var)\s+([A-Za-z_]\w*)\s*=\s*(\d+)\s*;\s*\5\s*(<=?)\s*(\d+)\s*;\s*\5\+\+\s*\)\s*if\s*\(([\s\S]*?)\)\s*return\s+false\s*;\s*return\s+true\s*;?\s*$/
  const span = (from: string, cmp: string, to: string) => {
    const len = Number(to) - Number(from) + (cmp === '<=' ? 1 : 0)
    if (!(len > 0)) return null
    return from === '0' && cmp === '<' ? `(List.range ${to})` : `(List.range' ${from} ${len})`
  }
  const m2 = b.match(two)
  if (m2) {
    const [, v1, a1, c1, b1, v2, a2, c2, b2, cond] = m2
    const s1 = span(a1, c1, b1), s2 = span(a2, c2, b2)
    if (!s1 || !s2) return null
    return `${s1}.all (fun ${v1} => ${s2}.all (fun ${v2} => ¬ (${cond.trim()})))`
  }
  const m1 = b.match(one)
  if (m1) {
    const [, v, from, cmp, to, cond] = m1
    const sp = span(from, cmp, to)
    if (!sp) return null
    return `${sp}.all (fun ${v} => ¬ (${cond.trim()}))`
  }
  return null
}

function unwrapBindings(b: string): { lets: [string, string][]; expr: string } | null {
  const lets: [string, string][] = []
  let rest = b
  for (;;) {
    const m = rest.match(/^(?:const|let)\s+([A-Za-z_][A-Za-z0-9_]*)\s*(?::\s*[^=]+)?=\s*([^;]+);\s*/)
    if (!m) break
    // A bound FUNCTION is not a value binding and is still refused. A `.map (fun k => …)` is a value — the
    // list — and the `=>` inside it belongs to the map, not to the binding. Distinguishing them is the
    // difference between refusing a whole shape and refusing what actually cannot be rendered.
    if (/\bfunction\b/.test(m[2])) return null
    // A SINGLE-PARAMETER ARROW WITH AN EXPRESSION BODY IS A LEAN `fun`. `const f = (x: number) => E` is
    // `let f := fun x => E` — same binder, same body, no statement sequence to lose. Only that exact form:
    // a braced body, a second parameter, a default, or a rest parameter is a different construct and stays
    // refused. Whatever the body turns out to contain is judged by the refusal list and the whitelist below
    // like any other expression, so widening the binding shape does not widen what may appear inside it.
    const arrow = m[2].match(/^\(\s*([A-Za-z_]\w*)\s*(?::\s*[A-Za-z_<>\[\]]+\s*)?\)\s*=>\s*([\s\S]+)$/)
    if (arrow && !/^\s*\{/.test(arrow[2])) { lets.push([m[1], `fun ${arrow[1]} => ${arrow[2].trim()}`]); rest = rest.slice(m[0].length); continue }
    // The guard exists to keep BOUND FUNCTIONS out, not arrows in general. A value like
    // `(xs.filter (fun z => z)).length` is a number that happens to contain an arrow inside a call, and
    // rejecting it threw away every binding produced by the loop rewrites above. Only a binding whose value
    // IS an arrow is refused, and the parenthesised form is handled just above; this catches the bare one.
    if (/^\s*[A-Za-z_]\w*\s*=>/.test(m[2])) return null
    lets.push([m[1], m[2].trim()])
    rest = rest.slice(m[0].length)
  }
  const r = rest.match(/^return\s+([\s\S]+?)\s*$/)
  const expr = r ? r[1] : rest
  if (/\b(const|let|return|if|for|while)\b/.test(expr)) return null
  return { lets, expr: expr.replace(/;$/, '').trim() }
}

export function translate(body: string): Translation {
  let b = body.replace(/\s+/g, ' ').trim().replace(/;$/, '')
  if (!b) return { ok: false, why: 'empty body' }
  // strip an outer block, then unwrap simple bindings into Lean lets
  const block = b.match(/^\{\s*([\s\S]*?)\s*\}$/)
  let prefix = ''
  if (block || /^(?:const|let)\s/.test(b)) {
    let inner = block ? block[1] : b
    const counted = countingLoop(inner)
    if (counted) inner = counted
    const validated = validationLoop(inner)
    if (validated) inner = validated
    const iterated = stateIteration(inner)
    if (iterated) inner = iterated
    const pushed = conditionalPush(inner)
    if (pushed) inner = pushed
    const looped = loopToMap(inner)
    if (looped) inner = looped
    const u = unwrapBindings(inner)
    if (!u) return { ok: false, why: 'body is not a chain of simple bindings over one expression' }
    prefix = u.lets.map(([n, v]) => `let ${n} := ${v}; `).join('')
    b = prefix + u.expr
  }
  for (const [re, to] of PRE_RULES) b = b.replace(re, to as string)
  // pre-phase: both REMOVE a construct, so both run before the refusal list judges what is left
  b = setSizeToLength(b)
  b = markExactDivision(b)
  for (const r of REFUSE) if (r.test(b)) return { ok: false, why: 'uses ' + String(r).slice(1, 24) + ' — no faithful mechanical rendering' }
  b = b.split(EXACT_DIV).join('/')                    // the divisions that were checked, put back as written
  let out = b
  for (const [re, to] of RULES) out = out.replace(re, to)
  out = fixChains(out)
  // WHITELIST, not a heuristic. Every identifier surviving translation must be one this file put there or a
  // binder it introduced. The previous check was a regex that let `nonHarmonic` and array indexing through;
  // both compiled into nonsense the kernel rejected. Anything unrecognised is refused by name, so a failure
  // is legible instead of mysterious.
  const ALLOWED = new Set(['List', 'range', 'all', 'any', 'contains', 'length', 'fun', 'M9', 'DR', 'true', 'false', 'let', 'eraseDups', 'filter', 'map', 'take', 'drop', 'Address', 'toUuidBytes', 'flatMap', '__p', 'foldl', '_'])
  const binders = new Set([
    ...[...out.matchAll(/fun ([a-z][a-zA-Z0-9]*) =>/g)].map((m) => m[1]),
    ...[...out.matchAll(/let ([A-Za-z_][A-Za-z0-9_]*) :=/g)].map((m) => m[1]),
  ])
  const idents = [...out.matchAll(/\b([A-Za-z_][A-Za-z0-9_]*)\b/g)].map((m) => m[1])
  const unknown = [...new Set(idents.filter((i) => !ALLOWED.has(i) && !binders.has(i)))]
  if (unknown.length) return { ok: false, why: 'unknown identifier: ' + unknown.slice(0, 3).join(', ') }
  return { ok: true, lean: out }
}

/** The preamble every emitted file needs: the deposit's own definitions, in Lean. */
/** JS METHOD CHAINS ARE NOT LEAN APPLICATION CHAINS. `xs.filter(f).length` needs no brackets in JavaScript,
 *  but its literal rendering `xs.filter (f).length` parses in Lean as `xs.filter ((f).length)` — the projection
 *  binds to the FUNCTION instead of to the filtered list, and the kernel reports a type error somewhere that
 *  looks nothing like the cause. This walks the brackets and wraps the call so the chain means what it meant:
 *  `(xs.filter (f)).length`. Paren-aware rather than a regex, because the predicate contains brackets of its
 *  own and counting them is the whole job. */
export function fixChains(t: string): string {
  for (const head of ['.filter (', '.map (', '.all (', '.any (']) {
    for (;;) {
      const i = t.indexOf(head)
      if (i < 0) break
      let d = 0, j = i + head.length - 1
      for (; j < t.length; j++) { if (t[j] === '(') d++; else if (t[j] === ')') { d--; if (d === 0) break } }
      if (j >= t.length) break
      const after = t.slice(j + 1)
      const proj = after.match(/^\.(length|eraseDups|reverse)\b/)
      if (!proj) { // nothing to fix here; neutralise this head so the scan advances
        t = t.slice(0, i) + head.replace('.', '\u0000') + t.slice(i + head.length)
        continue
      }
      // find the start of the receiver expression: back over a balanced bracketed term or an identifier
      let k = i - 1
      if (t[k] === ')' || t[k] === ']') {
        const open = t[k] === ')' ? '(' : '[', close = t[k]
        let e = 0
        for (; k >= 0; k--) { if (t[k] === close) e++; else if (t[k] === open) { e--; if (e === 0) break } }
      } else { while (k >= 0 && /[A-Za-z0-9_.']/.test(t[k])) k-- ; k++ }
      t = t.slice(0, k) + '(' + t.slice(k, j + 1) + ')' + t.slice(j + 1)
    }
    t = t.replace(/\u0000/g, '.')
  }
  return t
}

/** Which Lean modules the rendered statement needs. Emitted as imports so the port is USED rather than
 *  restated — a second copy of toUuid inside the generated file would be one more thing to drift. */
export const importsFor = (lean: string): string[] =>
  lean.includes('Address.') ? ['Address'] : []

export const PREAMBLE = `def M9 (n : Nat) : Nat := n % 9

-- the digital root: 0 for 0, otherwise the residue mod 9 taken in 1..9 rather than 0..8. Written without
-- recursion so the kernel evaluates it directly.
def DR (n : Nat) : Nat := if n == 0 then 0 else 1 + (n - 1) % 9`
