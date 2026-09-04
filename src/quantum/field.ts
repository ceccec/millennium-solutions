// THE QUANTUM FIELD — the geometry of src/proof/quantum.lean, computed rather than drawn.
//
// Every coordinate below comes from a function the Lean file decides over. Nothing here is a layout
// choice dressed as a result: the ring angle is the permutation's index in Lean's OWN enumeration order,
// the height is the value the control fold returns for that ordering, and the single node every edge lands
// on is the receipt. What the picture shows is what `quantum.lean` proves — that twenty-four orderings
// separate into five levels when combined naively and into one when canonicalised first.
//
// The definitions are transcribed from the Lean, not reimplemented from its prose. `agreesWithLean()`
// below recomputes the five numbers the kernel decided and is run by a gate, so a divergence between this
// module and the proof tree is a failing build rather than a wrong picture.

/** Every way of inserting x into a list — `Quantum.insertEverywhere`. */
const insertEverywhere = (x: number, l: number[]): number[][] =>
  l.length === 0 ? [[x]] : [[x, ...l], ...insertEverywhere(x, l.slice(1)).map((r) => [l[0], ...r])]

/** All orderings — `Quantum.perms`. */
export const perms = (l: number[]): number[][] =>
  l.length === 0 ? [[]] : perms(l.slice(1)).flatMap((p) => insertEverywhere(l[0], p))

/** Insertion sort, `Quantum.ins` and `Quantum.sort`. */
const ins = (x: number, l: number[]): number[] =>
  l.length === 0 ? [x] : x <= l[0] ? [x, ...l] : [l[0], ...ins(x, l.slice(1))]
export const sort = (l: number[]): number[] => l.reduce((acc, x) => ins(x, acc), [] as number[])

/** Canonicalise, then combine — `Quantum.receipt`. */
export const receipt = (l: number[]): number => sort(l).reduce((a, b) => (a * 2 + b) % 9, 0)

/** The same combination without canonicalising — `Quantum.naive`, kept as the control. */
export const naive = (l: number[]): number => l.reduce((a, b) => (a * 2 + b) % 9, 0)

export const ORBIT = [1, 2, 4, 8] as const

export type Node = { order: number[]; index: number; naive: number; receipt: number; angle: number }

/** The twenty-four orderings, each carrying the two values that place it. */
export const field = (seed: readonly number[] = ORBIT): Node[] => {
  const all = perms([...seed])
  return all.map((order, index) => ({
    order, index, naive: naive(order), receipt: receipt(order),
    angle: (index / all.length) * Math.PI * 2,
  }))
}

/** The distinct heights the control fold produces — the five of `the_uncanonicalised_fold_gives_many_answers`. */
export const naiveLevels = (seed: readonly number[] = ORBIT): number[] =>
  [...new Set(field(seed).map((n) => n.naive))].sort((a, b) => a - b)

/** The collision structure of `the_receipt_is_not_injective`: two-element multisets over the digits, by receipt. */
export const collisions = (): { receipt: number; sets: number[][] }[] => {
  const seen = new Set<string>()
  const pairs: number[][] = []
  for (let a = 1; a <= 9; a++) for (let b = 1; b <= 9; b++) {
    const s = sort([a, b]); const k = s.join(',')
    if (!seen.has(k)) { seen.add(k); pairs.push(s) }
  }
  const by = new Map<number, number[][]>()
  for (const p of pairs) { const r = receipt(p); by.set(r, [...(by.get(r) ?? []), p]) }
  return [...by.entries()].map(([receipt, sets]) => ({ receipt, sets })).sort((x, y) => x.receipt - y.receipt)
}

/** The five figures quantum.lean decided, recomputed here. A gate compares them; see scripts/quantum-field.ts. */
export const agreesWithLean = () => {
  const f = field()
  const c = collisions()
  return {
    perms_of_four_is_factorial: f.length,                                   // 24
    superposition_collapses_to_one: new Set(f.map((n) => n.receipt)).size,  // 1
    the_uncanonicalised_fold_gives_many_answers: naiveLevels().length,      // 5
    the_receipt_is_not_injective_sets: c.reduce((n, g) => n + g.sets.length, 0), // 45
    the_receipt_is_not_injective_receipts: c.length,                        // 9
  }
}
