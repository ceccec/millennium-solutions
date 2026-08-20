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
  // COMPARING JOINED LISTS IS COMPARING THE LISTS. `a.join(',') === b.join(',')` holds exactly when a and b
  // are equal, PROVIDED no element's rendering contains the separator — and every element here is a natural
  // number, so none does. The join is a way of comparing lists in JavaScript, not part of the claim; keeping
  // it would mean rendering string concatenation into Lean to say something about numbers.
  [/\.join\('[^']*'\)\s*===\s*([\s\S]+?)\.join\('[^']*'\)/g, ' == $1'],
  // slice(a,b) on a list is drop-then-take. Both bounds are literals wherever this fires, so the rewrite is
  // exact rather than a guess about what the ends might be.
  [/([A-Za-z_]\w*)\.slice\((\d+),\s*(\d+)\)/g, (_m: string, l: string, a: string, b: string) =>
    `(List.take ${Number(b) - Number(a)} (List.drop ${a} ${l}))` as string] as unknown as [RegExp, string],
]

const RULES: [RegExp, string][] = [
  [/\bdigitalRoot\(/g, 'DR ('],                   // defined in the emitted preamble
  [/\bdigits\(\)/g, "(List.range' 1 9)"],          // the residues 1..9, as the deposit defines them
  [/\bunits\(\)/g, '[1,2,4,5,7,8]'],
  [/\btriad\(\)/g, '[3,6,9]'],
  [/\bvortexOrbit\(\)/g, '[1,2,4,8,7,5]'],
  [/\bm9\(/g, 'M9 ('],                              // wrapper defined in the emitted preamble
  [/\bBASE\b/g, '9'],
  [/\bTRINITY\b/g, '3'],
  [/\.every\(/g, '.all ('],
  [/\.some\(/g, '.any ('],
  [/\.includes\(/g, '.contains ('],
  [/new Set\(([^)]+)\)\.size/g, '($1).eraseDups.length'],   // the deposit's distinct-count idiom
  [/\.filter\(/g, '.filter ('],
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
    if (/=>/.test(m[2]) && !/\.map \(fun /.test(m[2])) return null
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
    const looped = loopToMap(inner)
    if (looped) inner = looped
    const u = unwrapBindings(inner)
    if (!u) return { ok: false, why: 'body is not a chain of simple bindings over one expression' }
    prefix = u.lets.map(([n, v]) => `let ${n} := ${v}; `).join('')
    b = prefix + u.expr
  }
  for (const [re, to] of PRE_RULES) b = b.replace(re, to as string)
  for (const r of REFUSE) if (r.test(b)) return { ok: false, why: 'uses ' + String(r).slice(1, 24) + ' — no faithful mechanical rendering' }
  let out = b
  for (const [re, to] of RULES) out = out.replace(re, to)
  // WHITELIST, not a heuristic. Every identifier surviving translation must be one this file put there or a
  // binder it introduced. The previous check was a regex that let `nonHarmonic` and array indexing through;
  // both compiled into nonsense the kernel rejected. Anything unrecognised is refused by name, so a failure
  // is legible instead of mysterious.
  const ALLOWED = new Set(['List', 'range', 'all', 'any', 'contains', 'length', 'fun', 'M9', 'DR', 'true', 'false', 'let', 'eraseDups', 'filter', 'map', 'take', 'drop'])
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
export const PREAMBLE = `def M9 (n : Nat) : Nat := n % 9

-- the digital root: 0 for 0, otherwise the residue mod 9 taken in 1..9 rather than 0..8. Written without
-- recursion so the kernel evaluates it directly.
def DR (n : Nat) : Nat := if n == 0 then 0 else 1 + (n - 1) % 9`
