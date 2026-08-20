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
const RULES: [RegExp, string][] = [
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
function unwrapBindings(b: string): { lets: [string, string][]; expr: string } | null {
  const lets: [string, string][] = []
  let rest = b
  for (;;) {
    const m = rest.match(/^(?:const|let)\s+([A-Za-z_][A-Za-z0-9_]*)\s*(?::\s*[^=]+)?=\s*([^;]+);\s*/)
    if (!m) break
    if (/=>|\bfunction\b/.test(m[2])) return null      // a bound function is not a value binding
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
    const inner = block ? block[1] : b
    const u = unwrapBindings(inner)
    if (!u) return { ok: false, why: 'body is not a chain of simple bindings over one expression' }
    prefix = u.lets.map(([n, v]) => `let ${n} := ${v}; `).join('')
    b = prefix + u.expr
  }
  for (const r of REFUSE) if (r.test(b)) return { ok: false, why: 'uses ' + String(r).slice(1, 24) + ' — no faithful mechanical rendering' }
  let out = b
  for (const [re, to] of RULES) out = out.replace(re, to)
  // WHITELIST, not a heuristic. Every identifier surviving translation must be one this file put there or a
  // binder it introduced. The previous check was a regex that let `nonHarmonic` and array indexing through;
  // both compiled into nonsense the kernel rejected. Anything unrecognised is refused by name, so a failure
  // is legible instead of mysterious.
  const ALLOWED = new Set(['List', 'range', 'all', 'any', 'contains', 'length', 'fun', 'M9', 'true', 'false', 'let', 'eraseDups', 'filter'])
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
export const PREAMBLE = `def M9 (n : Nat) : Nat := n % 9`
