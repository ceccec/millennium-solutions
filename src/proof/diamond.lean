-- lean/diamond.lean — the diamond involution r(d) = 10 − d on the digits 1..9, as a theorem the kernel checks.
-- The audit in scripts/mcp.ts reads its verdict from here (lean_ask), not from a JavaScript loop over a literal range.
-- Decided over a finite list, so it depends on no axiom beyond the kernel.

def diamond (d : Nat) : Nat := 10 - d

theorem diamond_involution : (List.range' 1 9).all (fun d => diamond (diamond d) == d) = true := by decide
