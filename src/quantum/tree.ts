// EVERY THEOREM AS A SHAPE — the parse tree of its statement, laid out in three dimensions.
//
// The problem with rendering 525 different kernel-accepted declarations is that a generic 3D scene is
// decoration: it looks the same whatever it is given, so it carries no information and the picture is a lie
// by implication. What makes this honest is that the geometry is the PARSE, already verified: latex-gate
// checks that every statement round-trips — the tree read back symbol for symbol against its source — so a
// tree drawn from it provably represents the proposition the kernel accepted and not an approximation of it.
//
// Nothing is chosen per theorem. Depth is the node's depth in the parse. Horizontal position is its in-order
// rank among the leaves, which is where the symbol actually sits when you read the statement left to right.
// Depth in Z is the size of the subtree under it, so a heavy conjunction stands behind a bare numeral. Two
// theorems with the same structure get the same shape, which is the property that makes the picture worth
// looking at: shape differences are statement differences.
import { parse, roundTrips } from '../latex/index.ts'

export type TreeNode = {
  id: number; parent: number | null
  label: string; kind: string
  depth: number; order: number; weight: number
}

type Ast = Record<string, unknown>

const kindOf = (n: Ast): string => String(n.t ?? 'node')
const labelOf = (n: Ast): string => {
  const t = kindOf(n)
  if (t === 'bin' || t === 'un') return String(n.op ?? '?')
  if (t === 'id' || t === 'num') return String(n.v ?? '?')
  if (t === 'app') return 'apply'
  if (t === 'list') return '[…]'
  return t
}
const kidsOf = (n: Ast): Ast[] => {
  const out: Ast[] = []
  for (const k of ['l', 'r', 'f', 'a', 'e', 'body']) {
    const v = n[k]
    if (v && typeof v === 'object') out.push(v as Ast)
  }
  for (const k of ['items', 'args', 'params']) {
    const v = n[k]
    if (Array.isArray(v)) for (const x of v) if (x && typeof x === 'object') out.push(x as Ast)
  }
  return out
}

const size = (n: Ast): number => 1 + kidsOf(n).reduce((s, k) => s + size(k), 0)

/** The tree of a statement, or null when it does not parse — a page shows nothing rather than a guess. */
export const treeOf = (statement: string): TreeNode[] | null => {
  let ast: Ast
  try { ast = parse(statement) as unknown as Ast } catch { return null }
  const nodes: TreeNode[] = []
  let next = 0, leaf = 0
  const walk = (n: Ast, parent: number | null, depth: number): number => {
    const id = next++
    const kids = kidsOf(n)
    const placeholder: TreeNode = { id, parent, label: labelOf(n), kind: kindOf(n), depth, order: 0, weight: size(n) }
    nodes.push(placeholder)
    if (!kids.length) { placeholder.order = leaf++; return id }
    const childOrders = kids.map((k) => walk(k, id, depth + 1))
    // An internal node sits at the mean of its children — the position the symbol occupies when read.
    const kidNodes = childOrders.map((c) => nodes.find((x) => x.id === c)!)
    placeholder.order = kidNodes.reduce((s, k) => s + k.order, 0) / kidNodes.length
    return id
  }
  walk(ast, null, 0)
  return nodes
}

/** Whether this statement's rendering is backed by a verified round-trip, stated per theorem. */
export const verified = (statement: string): boolean => {
  try { return roundTrips(statement) } catch { return false }
}

export const stats = (t: TreeNode[]) => ({
  nodes: t.length,
  depth: Math.max(...t.map((n) => n.depth)) + 1,
  leaves: t.filter((n) => !t.some((m) => m.parent === n.id)).length,
})
