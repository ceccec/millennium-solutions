// LEAN → LATEX (and MathML), for the subset this deposit's statements actually use.
//
// The paper printed every statement as verbatim Lean. That is honest and it is hard to read: a reader who
// wants the mathematics has to parse `(List.range' 1 9).all (fun d => (List.range' 1 9).any (fun e =>
// M9 (d + e) == 0))` in their head. This translates that to ∀ d ∈ {1,…,9}, ∃ e ∈ {1,…,9} : M9(d+e) = 0.
//
// A TRANSLATION CAN LIE, so this one is built to refuse rather than approximate:
//
//   · It is a real parser, not a chain of regex substitutions. A substitution pass silently produces
//     plausible-looking output for input it did not understand, which is the worst possible failure here —
//     a formula that reads as mathematics and is not the theorem.
//   · Parsing is TOTAL or it FAILS. Every token must be consumed and every construct must be one this
//     grammar knows; anything else throws, and the caller prints the verbatim Lean instead. There is no
//     partial rendering.
//   · The verbatim Lean stays on the page next to the typeset form. The kernel checked the Lean, not this.
//     The rendering is a reading aid and is labelled as one.
//
// The vocabulary was derived by counting what the 460 statements contain, not guessed: `.all` (280),
// `.contains` (124), `.length` (120), `List.range` (113), `.map` (96), `List.range'` (82), `.eraseDups`
// (74), `.filter` (36), `.any` (33), `.foldl` (27), and the arithmetic and logical operators.

import { escapeHtml } from '../html/index.ts'

// ── tokens ───────────────────────────────────────────────────────────────────────────────────────────────
type Tok = { k: 'num' | 'id' | 'op'; v: string }

const OPS3 = ['>>>', '<<<']
const OPS2 = ['==', '!=', '<=', '>=', '=>', '++', '&&', '||', ':=']
const OPS1 = '+-*/%^<>=()[],.¬∧∨→↔≠≤≥·!:;'

export function lex(src: string): Tok[] {
  const out: Tok[] = []
  let i = 0
  while (i < src.length) {
    const c = src[i]
    if (/\s/.test(c)) { i++; continue }
    if (/[0-9]/.test(c)) {
      let j = i; while (j < src.length && /[0-9]/.test(src[j])) j++
      out.push({ k: 'num', v: src.slice(i, j) }); i = j; continue
    }
    if (/[A-Za-z_]/.test(c)) {
      // A DOT JOINS THE NAME ONLY FOR A QUALIFIED CONSTANT — one whose namespace is capitalised, as
      // Lean writes them: List.range, Families.gcd'. Treating any dot as part of the name swallowed
      // `axis.contains d` into one identifier and rendered it `axis.contains(d)` instead of `d ∈ axis`:
      // a silently plausible formula that was not the theorem, which is the one failure this module
      // exists to prevent. A lowercase receiver ends the identifier, so the dot becomes a method call.
      const qualified = /[A-Z]/.test(c)
      let j = i
      while (j < src.length && (/[A-Za-z0-9_']/.test(src[j]) || src[j] === '!' || src[j] === '?' || (qualified && src[j] === '.' && /[A-Za-z_]/.test(src[j + 1] ?? '')))) j++
      out.push({ k: 'id', v: src.slice(i, j) }); i = j; continue
    }
    const three = src.slice(i, i + 3), two = src.slice(i, i + 2)
    if (OPS3.includes(three)) { out.push({ k: 'op', v: three }); i += 3; continue }
    if (OPS2.includes(two)) { out.push({ k: 'op', v: two }); i += 2; continue }
    if (OPS1.includes(c)) { out.push({ k: 'op', v: c }); i++; continue }
    throw new Error('lex: unexpected character ' + JSON.stringify(c))
  }
  return out
}

// ── AST ──────────────────────────────────────────────────────────────────────────────────────────────────
export type Node =
  | { t: 'num'; v: string }
  | { t: 'id'; v: string }
  | { t: 'bin'; op: string; l: Node; r: Node }
  | { t: 'un'; op: string; e: Node }
  | { t: 'app'; f: Node; a: Node }
  | { t: 'dot'; o: Node; name: string }
  | { t: 'lam'; ps: string[]; b: Node }
  | { t: 'list'; xs: Node[] }
  | { t: 'ite'; c: Node; a: Node; b: Node }
  | { t: 'hole'; op: string }   // (· + ·) — the operator section
  | { t: 'asc'; e: Node; ty: Node }        // (1 : Int) — a type ascription; the value is unchanged
  | { t: 'tuple'; xs: Node[] }             // (a, b)
  | { t: 'proj'; o: Node; i: string }      // p.1, p.2 — tuple projection
  | { t: 'let'; name: string; e: Node; b: Node }   // let x := e; body

const KEYWORD = new Set(['then', 'else', 'fun', 'if', 'let'])

class P {
  i = 0
  ts: Tok[]
  // An explicit field, not a parameter property: this repo runs .ts through node directly, and node's
  // strip-only TypeScript mode rejects `constructor(private ts: Tok[])`.
  constructor(ts: Tok[]) { this.ts = ts }
  peek(o = 0) { return this.ts[this.i + o] }
  is(v: string, o = 0) { const t = this.peek(o); return !!t && t.v === v }
  eat(v: string) { if (!this.is(v)) throw new Error('expected ' + v + ' got ' + (this.peek()?.v ?? 'EOF')); this.i++ }
  done() { return this.i >= this.ts.length }

  // Precedence, loosest first. Lean's real table is larger; this covers exactly what the statements use.
  expr(): Node {
    // `let x := e; body` — a local binding. Ten statements use it, and it is written as mathematics the way
    // mathematics writes it: the body, then "where x = e". The binding is NOT substituted into the body;
    // substituting would show the reader an expression the source does not contain.
    if (this.is('let')) {
      this.i++
      const n = this.peek(); if (!n || n.k !== 'id') throw new Error('expected a name after let')
      this.i++; this.eat(':='); const e = this.expr(); this.eat(';')
      return { t: 'let', name: n.v, e, b: this.expr() }
    }
    return this.iff()
  }
  iff(): Node { let l = this.implies(); while (this.is('↔')) { this.i++; l = { t: 'bin', op: '↔', l, r: this.implies() } } return l }
  implies(): Node { let l = this.or(); if (this.is('→')) { this.i++; return { t: 'bin', op: '→', l, r: this.implies() } } return l }
  or(): Node { let l = this.and(); while (this.is('∨') || this.is('||')) { this.i++; l = { t: 'bin', op: '∨', l, r: this.and() } } return l }
  and(): Node { let l = this.cmp(); while (this.is('∧') || this.is('&&')) { this.i++; l = { t: 'bin', op: '∧', l, r: this.cmp() } } return l }
  cmp(): Node {
    let l = this.shift()
    while (['==', '=', '!=', '≠', '<=', '≤', '>=', '≥', '<', '>'].some((o) => this.is(o))) {
      const op = this.peek()!.v; this.i++; l = { t: 'bin', op, l, r: this.shift() }
    }
    return l
  }
  shift(): Node { let l = this.add(); while (this.is('>>>') || this.is('<<<')) { const op = this.peek()!.v; this.i++; l = { t: 'bin', op, l, r: this.add() } } return l }
  add(): Node { let l = this.mul(); while (this.is('+') || this.is('-') || this.is('++')) { const op = this.peek()!.v; this.i++; l = { t: 'bin', op, l, r: this.mul() } } return l }
  mul(): Node { let l = this.pow(); while (this.is('*') || this.is('/') || this.is('%')) { const op = this.peek()!.v; this.i++; l = { t: 'bin', op, l, r: this.pow() } } return l }
  pow(): Node { const l = this.unary(); if (this.is('^')) { this.i++; return { t: 'bin', op: '^', l, r: this.pow() } } return l }
  unary(): Node { if (this.is('¬') || this.is('!')) { this.i++; return { t: 'un', op: '¬', e: this.unary() } } if (this.is('-')) { this.i++; return { t: 'un', op: '-', e: this.unary() } } return this.appl() }

  /** Application is juxtaposition: `M9 (d + e)`, `List.range 9`, `refl (refl d)`. */
  appl(): Node {
    let f = this.post()
    while (!this.done() && this.startsAtom()) f = { t: 'app', f, a: this.post() }
    return f
  }
  startsAtom(): boolean {
    const t = this.peek()!
    // `then` and `else` lex as identifiers, so juxtaposition happily consumed them as arguments and the
    // whole `if _ then _ else _` failed to parse. They terminate an application instead.
    if (t.k === 'id') return !KEYWORD.has(t.v)
    if (t.k === 'num') return true
    return t.v === '(' || t.v === '['
  }
  post(): Node {
    let e = this.atom()
    while (this.is('.')) {
      this.i++
      const n = this.peek()
      if (!n) throw new Error('expected method name')
      // `p.1` is a projection, not a method — the dot is followed by a numeral.
      if (n.k === 'num') { this.i++; e = { t: 'proj', o: e, i: n.v }; continue }
      if (n.k !== 'id') throw new Error('expected method name')
      this.i++; e = { t: 'dot', o: e, name: n.v }
    }
    return e
  }
  atom(): Node {
    const t = this.peek()
    if (!t) throw new Error('unexpected end of statement')
    if (t.k === 'num') { this.i++; return { t: 'num', v: t.v } }
    if (t.v === 'fun') {
      // SEVERAL PARAMETERS. `fun acc i => …` binds two; reading only the first left the second where the
      // arrow was expected, which is the "expected => got i" this grammar used to fail on. Curried into
      // nested lambdas, which is what Lean means by it.
      this.i++
      const ps: string[] = []
      while (this.peek() && this.peek()!.k === 'id' && !this.is('=>')) { ps.push(this.peek()!.v); this.i++ }
      if (!ps.length) throw new Error('expected lambda parameter')
      this.eat('=>')
      // The parameter LIST is kept, not curried into nested lambdas. Currying is what Lean means, but
      // unparse then writes back an extra `fun` and `=>` per parameter and the round-trip reports a loss
      // that never happened. The tree records what was written.
      return { t: 'lam', ps, b: this.expr() }
    }
    if (t.v === 'if') {
      this.i++; const c = this.expr(); this.eat('then'); const a = this.expr(); this.eat('else'); const b = this.expr()
      return { t: 'ite', c, a, b }
    }
    if (t.k === 'id') { this.i++; return { t: 'id', v: t.v } }
    if (t.v === '(') {
      this.i++
      // the operator section (· + ·) — a lambda written in Lean's dot notation
      if (this.is('·')) {
        this.i++; const op = this.peek(); if (!op || op.k !== 'op') throw new Error('expected operator in section')
        this.i++; this.eat('·'); this.eat(')')
        return { t: 'hole', op: op.v }
      }
      const e = this.expr()
      // `(1 : Int)` — an ascription names the type and leaves the value alone. The type is KEPT in the tree
      // so unparse can put it back; only the rendering drops it, because a reader of the mathematics wants
      // the value and the round-trip wants every token.
      if (this.is(':')) { this.i++; const ty = this.expr(); this.eat(')'); return { t: 'asc', e, ty } }
      if (this.is(',')) {
        const xs = [e]
        while (this.is(',')) { this.i++; xs.push(this.expr()) }
        this.eat(')'); return { t: 'tuple', xs }
      }
      this.eat(')'); return e
    }
    if (t.v === '[') {
      this.i++
      const xs: Node[] = []
      if (!this.is(']')) { xs.push(this.expr()); while (this.is(',')) { this.i++; xs.push(this.expr()) } }
      this.eat(']')
      return { t: 'list', xs }
    }
    throw new Error('unexpected token ' + JSON.stringify(t.v))
  }
}

/** Parse a statement, or throw. Throwing is the point: the caller prints the Lean source instead. */
export function parse(src: string): Node {
  const p = new P(lex(src))
  const e = p.expr()
  if (!p.done()) throw new Error('trailing tokens from ' + JSON.stringify(p.peek()!.v))
  return e
}


/** `.filter f` and `.all f` pass a FUNCTION, not a lambda — `instruments.filter claim`. The set-builder
 *  needs a bound variable the source never wrote, so one is supplied. `x` is chosen because these
 *  statements bind d, e, k, n, p, u and t, never x; a collision would shadow a real binder. */
const BOUND = 'x'
const applied = (f: Node, texOf: (n: Node) => string) => `${texOf(f)}\\mathopen{}\\left(${BOUND}\\right)`

// ── LaTeX ────────────────────────────────────────────────────────────────────────────────────────────────
const NAME: Record<string, string> = { '==': '=', '=': '=', '!=': '\\neq', '≠': '\\neq', '<=': '\\le', '≤': '\\le', '>=': '\\ge', '≥': '\\ge', '<': '<', '>': '>', '+': '+', '-': '-', '*': '\\cdot', '/': '/', '%': '\\bmod', '∧': '\\land', '∨': '\\lor', '→': '\\to', '↔': '\\leftrightarrow', '++': '\\mathbin{+\\!\\!+}' }

const idTex = (v: string) => (/^[a-zA-Z]$/.test(v) ? v : '\\mathrm{' + v.replace(/_/g, '\\_') + '}')

/** The domain a range denotes, as a set. List.range n = [0,…,n-1]; List.range' a n = [a,…,a+n-1]. */
const num = (n: Node): number | null => (n.t === 'num' ? Number(n.v) : null)
const rangeTex = (f: Node, args: Node[]): string | null => {
  if (f.t !== 'id') return null
  // With literal bounds the set is written out — {1,…,9}, not {1,…,1+9-1}, which is the same set
  // spelled as the arithmetic that produced it.
  if (f.v === 'List.range' && args.length === 1) {
    const n = num(args[0])
    return n !== null ? `\\{0,\\dots,${n - 1}\\}` : `\\{0,\\dots,${tex(args[0])}-1\\}`
  }
  if (f.v === "List.range'" && args.length === 2) {
    const a = num(args[0]), k = num(args[1])
    return a !== null && k !== null ? `\\{${a},\\dots,${a + k - 1}\\}` : `\\{${tex(args[0])},\\dots,${tex(args[0])}+${tex(args[1])}-1\\}`
  }
  return null
}

/** Flatten an application spine into head + arguments. */
const spine = (n: Node): { head: Node; args: Node[] } => {
  const args: Node[] = []
  let h = n
  while (h.t === 'app') { args.unshift(h.a); h = h.f }
  return { head: h, args }
}

export function tex(n: Node): string {
  switch (n.t) {
    case 'num': return n.v
    case 'id': return idTex(n.v)
    case 'hole': return `(\\cdot\\,${NAME[n.op] ?? n.op}\\,\\cdot)`
    case 'un': return n.op === '¬' ? `\\lnot ${tex(n.e)}` : `-${tex(n.e)}`
    case 'lam': return `${n.ps.map(idTex).join(',\\,')} \\mapsto ${tex(n.b)}`
    case 'list': return `[${n.xs.map(tex).join(',\\,')}]`
    case 'asc': return tex(n.e)
    case 'tuple': return `\\left(${n.xs.map(tex).join(',\\,')}\\right)`
    case 'proj': return `${tex(n.o)}_{${n.i}}`
    case 'let': return `${tex(n.b)} \\quad \\text{where } ${idTex(n.name)} = ${tex(n.e)}`
    case 'ite': return `\\begin{cases}${tex(n.a)} & \\text{if } ${tex(n.c)}\\\\ ${tex(n.b)} & \\text{otherwise}\\end{cases}`
    case 'bin': {
      const l = tex(n.l), r = tex(n.r)
      if (n.op === '^') return `${l}^{${r}}`
      if (n.op === '/') return `\\frac{${l}}{${r}}`
      if (n.op === '%') return `${l} \\bmod ${r}`
      if (n.op === '>>>') return `${l} \\gg ${r}`
      if (n.op === '<<<') return `${l} \\ll ${r}`
      return `${l} ${NAME[n.op] ?? n.op} ${r}`
    }
    case 'dot': return dotTex(n, [])
    case 'app': {
      const { head, args } = spine(n)
      const r = rangeTex(head, args)
      if (r) return r
      if (head.t === 'dot') return dotTex(head, args)
      return `${tex(head)}\\mathopen{}\\left(${args.map(tex).join(',\\,')}\\right)`
    }
  }
}

/** A method call, rendered as the mathematics it means. Unknown methods throw — see the header. */
function dotTex(d: Extract<Node, { t: 'dot' }>, args: Node[]): string {
  const o = tex(d.o)
  const lam = (a: Node | undefined) => (a && a.t === 'lam' && a.ps.length === 1 ? a : null)
  switch (d.name) {
    case 'all': { const f = lam(args[0])
      if (f) return `\\forall ${idTex(f.ps[0])} \\in ${o},\\; ${tex(f.b)}`
      if (args.length === 1) return `\\forall ${BOUND} \\in ${o},\\; ${applied(args[0], tex)}`
      break }
    case 'any': { const f = lam(args[0])
      if (f) return `\\exists ${idTex(f.ps[0])} \\in ${o} : ${tex(f.b)}`
      if (args.length === 1) return `\\exists ${BOUND} \\in ${o} : ${applied(args[0], tex)}`
      break }
    case 'filter': { const f = lam(args[0])
      if (f) return `\\{\\, ${idTex(f.ps[0])} \\in ${o} \\mid ${tex(f.b)} \\,\\}`
      if (args.length === 1) return `\\{\\, ${BOUND} \\in ${o} \\mid ${applied(args[0], tex)} \\,\\}`
      break }
    case 'map': { const f = lam(args[0]); if (f) return `\\{\\, ${tex(f.b)} \\mid ${idTex(f.ps[0])} \\in ${o} \\,\\}`; if (args.length === 1) return `${tex(args[0])}[${o}]` ; break }
    case 'length': if (!args.length) return `\\left|${o}\\right|`; break
    case 'contains': if (args.length === 1) return `${tex(args[0])} \\in ${o}`; break
    case 'eraseDups': if (!args.length) return `\\operatorname{dedup}\\left(${o}\\right)`; break
    case 'flatMap': { const f = lam(args[0]); if (!f) break
      return `\\bigcup_{${idTex(f.ps[0])} \\in ${o}} ${tex(f.b)}` }
    case 'foldr':
    case 'foldl': {
      // foldl (· + ·) 0 is a sum and nothing else here is; anything other than that exact shape falls
      // through to the throw, rather than being rendered as a sum it is not.
      if (args.length === 2 && args[0].t === 'hole' && args[0].op === '+' && args[1].t === 'num' && args[1].v === '0')
        return `\\sum ${o}`
      // Any other fold is named rather than given a symbol it does not have: an operator and a seed,
      // applied along the list. Inventing ∑-like notation for an arbitrary combiner would say more than
      // the statement does.
      if (args.length === 2) return `\\operatorname{fold}_{${tex(args[0])}}\\left(${o},\\, ${tex(args[1])}\\right)`
      break
    }
    case 'get!': if (args.length === 1) return `${o}_{${tex(args[0])}}`; break
    case 'head?': if (!args.length) return `\\operatorname{head}\\left(${o}\\right)`; break
    case 'getLast?': if (!args.length) return `\\operatorname{last}\\left(${o}\\right)`; break
    case 'reverse': if (!args.length) return `\\operatorname{reverse}\\left(${o}\\right)`; break
    case 'sum': if (!args.length) return `\\sum ${o}`; break
  }
  throw new Error('no notation for method .' + d.name + ' with ' + args.length + ' argument(s)')
}

/** Lean source → LaTeX, or null when this grammar does not cover it. Never a partial rendering. */
export function toLatex(statement: string): string | null {
  try { return tex(parse(statement)) } catch { return null }
}

// ── MathML ───────────────────────────────────────────────────────────────────────────────────────────────
// Emitted from the SAME tree as the LaTeX, so the typeset page and the copyable LaTeX cannot disagree.
// MathML is rendered natively by browsers, which keeps the page free of a maths library and a CDN.
const X = escapeHtml
const mo = (s: string) => `<mo>${X(s)}</mo>`
const mi = (s: string) => `<mi>${X(s)}</mi>`
const MOP: Record<string, string> = { '==': '=', '=': '=', '!=': '≠', '≠': '≠', '<=': '≤', '≤': '≤', '>=': '≥', '≥': '≥', '∧': '∧', '∨': '∨', '→': '→', '↔': '↔', '*': '⋅', '%': 'mod', '++': '⧺' }

function ml(n: Node): string {
  switch (n.t) {
    case 'num': return `<mn>${X(n.v)}</mn>`
    case 'id': return mi(n.v)
    case 'hole': return `<mrow>${mo('(')}${mo('·')}${mo(MOP[n.op] ?? n.op)}${mo('·')}${mo(')')}</mrow>`
    case 'un': return `<mrow>${mo(n.op === '¬' ? '¬' : '−')}${ml(n.e)}</mrow>`
    case 'lam': return `<mrow>${n.ps.map(mi).join(mo(','))}${mo('↦')}${ml(n.b)}</mrow>`
    case 'list': return `<mrow>${mo('[')}${n.xs.map(ml).join(mo(','))}${mo(']')}</mrow>`
    case 'asc': return ml(n.e)
    case 'tuple': return `<mrow>${mo('(')}${n.xs.map(ml).join(mo(','))}${mo(')')}</mrow>`
    case 'proj': return `<msub>${ml(n.o)}<mn>${X(n.i)}</mn></msub>`
    case 'let': return `<mrow>${ml(n.b)}${mo('where')}${mi(n.name)}${mo('=')}${ml(n.e)}</mrow>`
    // Bracketed: unbracketed, `… = 1 if isUnit(d) ; otherwise 0 ∧ provenHere = 0` reads as though the
    // conjunct were part of the else-branch.
    case 'ite': return `<mrow>${mo('(')}${ml(n.a)}${mo('if')}${ml(n.c)}${mo(';')}${mo('otherwise')}${ml(n.b)}${mo(')')}</mrow>`
    case 'bin': {
      if (n.op === '^') return `<msup>${ml(n.l)}${ml(n.r)}</msup>`
      if (n.op === '/') return `<mfrac>${ml(n.l)}${ml(n.r)}</mfrac>`
      if (n.op === '>>>') return `<mrow>${ml(n.l)}${mo('≫')}${ml(n.r)}</mrow>`
      if (n.op === '<<<') return `<mrow>${ml(n.l)}${mo('≪')}${ml(n.r)}</mrow>`
      return `<mrow>${ml(n.l)}${mo(MOP[n.op] ?? n.op)}${ml(n.r)}</mrow>`
    }
    case 'dot': return dotMl(n, [])
    case 'app': {
      const { head, args } = spine(n)
      if (head.t === 'id' && (head.v === 'List.range' || head.v === "List.range'")) {
        // The SAME literal-bound simplification the LaTeX emitter applies. It was written only there, so
        // one tree produced {0,…,8} in LaTeX and {0,…,9−1} in MathML — two renderings of one theorem
        // disagreeing, in the module whose header claims they cannot.
        const a = head.v === 'List.range' ? 0 : num(args[0])
        const k = head.v === 'List.range' ? num(args[0]) : num(args[1])
        const lo = head.v === 'List.range' ? '<mn>0</mn>' : ml(args[0])
        if (a !== null && k !== null)
          return `<mrow>${mo('{')}<mn>${a}</mn>${mo(',')}${mo('…')}${mo(',')}<mn>${a + k - 1}</mn>${mo('}')}</mrow>`
        const hi = head.v === 'List.range'
          ? `<mrow>${ml(args[0])}${mo('−')}<mn>1</mn></mrow>`
          : `<mrow>${ml(args[0])}${mo('+')}${ml(args[1])}${mo('−')}<mn>1</mn></mrow>`
        return `<mrow>${mo('{')}${lo}${mo(',')}${mo('…')}${mo(',')}${hi}${mo('}')}</mrow>`
      }
      if (head.t === 'dot') return dotMl(head, args)
      return `<mrow>${ml(head)}${mo('(')}${args.map(ml).join(mo(','))}${mo(')')}</mrow>`
    }
  }
}

function dotMl(d: Extract<Node, { t: 'dot' }>, args: Node[]): string {
  const o = ml(d.o)
  const lam = (a: Node | undefined) => (a && a.t === 'lam' && a.ps.length === 1 ? a : null)
  switch (d.name) {
    case 'all': { const f = lam(args[0])
      if (f) return `<mrow>${mo('∀')}${mi(f.ps[0])}${mo('∈')}${o}${mo(',')}${ml(f.b)}</mrow>`
      if (args.length === 1) return `<mrow>${mo('∀')}${mi(BOUND)}${mo('∈')}${o}${mo(',')}${ml(args[0])}${mo('(')}${mi(BOUND)}${mo(')')}</mrow>`
      break }
    case 'any': { const f = lam(args[0])
      if (f) return `<mrow>${mo('∃')}${mi(f.ps[0])}${mo('∈')}${o}${mo(':')}${ml(f.b)}</mrow>`
      if (args.length === 1) return `<mrow>${mo('∃')}${mi(BOUND)}${mo('∈')}${o}${mo(':')}${ml(args[0])}${mo('(')}${mi(BOUND)}${mo(')')}</mrow>`
      break }
    case 'filter': { const f = lam(args[0])
      if (f) return `<mrow>${mo('{')}${mi(f.ps[0])}${mo('∈')}${o}${mo('∣')}${ml(f.b)}${mo('}')}</mrow>`
      if (args.length === 1) return `<mrow>${mo('{')}${mi(BOUND)}${mo('∈')}${o}${mo('∣')}${ml(args[0])}${mo('(')}${mi(BOUND)}${mo(')')}${mo('}')}</mrow>`
      break }
    case 'map': { const f = lam(args[0]); if (f) return `<mrow>${mo('{')}${ml(f.b)}${mo('∣')}${mi(f.ps[0])}${mo('∈')}${o}${mo('}')}</mrow>`; if (args.length === 1) return `<mrow>${ml(args[0])}${mo('[')}${o}${mo(']')}</mrow>`; break }
    case 'length': if (!args.length) return `<mrow>${mo('|')}${o}${mo('|')}</mrow>`; break
    case 'contains': if (args.length === 1) return `<mrow>${ml(args[0])}${mo('∈')}${o}</mrow>`; break
    case 'eraseDups': if (!args.length) return `<mrow>${mi('dedup')}${mo('(')}${o}${mo(')')}</mrow>`; break
    case 'flatMap': { const f = lam(args[0]); if (!f) break
      return `<mrow>${mo('⋃')}${mi(f.ps[0])}${mo('∈')}${o}${mo(',')}${ml(f.b)}</mrow>` }
    case 'foldr':
    case 'foldl':
      if (args.length === 2 && args[0].t === 'hole' && args[0].op === '+' && args[1].t === 'num' && args[1].v === '0')
        return `<mrow>${mo('∑')}${o}</mrow>`
      if (args.length === 2) return `<mrow>${mi('fold')}${mo('(')}${ml(args[0])}${mo(',')}${o}${mo(',')}${ml(args[1])}${mo(')')}</mrow>`
      break
    case 'get!': if (args.length === 1) return `<msub>${o}${ml(args[0])}</msub>`; break
    case 'head?': if (!args.length) return `<mrow>${mi('head')}${mo('(')}${o}${mo(')')}</mrow>`; break
    case 'getLast?': if (!args.length) return `<mrow>${mi('last')}${mo('(')}${o}${mo(')')}</mrow>`; break
    case 'reverse': if (!args.length) return `<mrow>${mi('reverse')}${mo('(')}${o}${mo(')')}</mrow>`; break
    case 'sum': if (!args.length) return `<mrow>${mo('∑')}${o}</mrow>`; break
  }
  throw new Error('no notation for method .' + d.name)
}

/** Lean source → MathML, or null when this grammar does not cover it. */
export function toMathML(statement: string): string | null {
  try { return `<math display="block" xmlns="http://www.w3.org/1998/Math/MathML">${ml(parse(statement))}</math>` } catch { return null }
}

// ── round-trip, so a wrong parse cannot pass quietly ─────────────────────────────────────────────────────
// Throwing catches input the grammar does not know. It does NOT catch input the grammar mis-reads: the
// lexer once folded `axis.contains d` into a single identifier and rendered `axis.contains(d)` — no error,
// wrong formula. So the tree is written back out as Lean and the token sequence compared with the source.
// A parse that dropped, duplicated or reordered anything fails here.
//
// ITS LIMIT, STATED: parentheses are excluded from the comparison (the tree does not record where the
// source put redundant ones), so this verifies that the same symbols were read in the same order — it does
// NOT prove the operators were grouped with the right precedence. Precedence is covered separately by the
// assertions in scripts/latex-gate.ts, against Lean's own table.
export function unparse(n: Node): string {
  switch (n.t) {
    case 'num': return n.v
    case 'id': return n.v
    case 'hole': return `(· ${n.op} ·)`
    case 'un': return `(${n.op} ${unparse(n.e)})`
    case 'lam': return `(fun ${n.ps.join(' ')} => ${unparse(n.b)})`
    case 'list': return `[${n.xs.map(unparse).join(', ')}]`
    case 'asc': return `(${unparse(n.e)} : ${unparse(n.ty)})`
    case 'tuple': return `(${n.xs.map(unparse).join(', ')})`
    case 'proj': return `(${unparse(n.o)}).${n.i}`
    case 'let': return `let ${n.name} := ${unparse(n.e)}; ${unparse(n.b)}`
    case 'ite': return `(if ${unparse(n.c)} then ${unparse(n.a)} else ${unparse(n.b)})`
    case 'bin': return `(${unparse(n.l)} ${n.op} ${unparse(n.r)})`
    case 'dot': return `(${unparse(n.o)}).${n.name}`
    case 'app': return `(${unparse(n.f)} ${unparse(n.a)})`
  }
}

// Lean spells several operators two ways and the parser keeps one of them, so the comparison canonicalises
// both sides. Without this the check reported 72 failures that were only `||` against `∨` — a check that
// cries wolf gets switched off, which is its own way of proving nothing.
const CANON: Record<string, string> = { '||': '∨', '&&': '∧', '==': '=', '!=': '≠', '<=': '≤', '>=': '≥', '!': '¬' }

/** The token sequence with grouping removed and spellings canonicalised — what the round-trip compares. */
export const shape = (src: string): string =>
  lex(src).filter((t) => !'()'.includes(t.v)).map((t) => CANON[t.v] ?? t.v).join(' ')

/** True when the parse read exactly the symbols the source contains, in order. */
export function roundTrips(statement: string): boolean {
  try { return shape(unparse(parse(statement))) === shape(statement) } catch { return false }
}
