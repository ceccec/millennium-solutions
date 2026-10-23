-- prior_art: named
-- prior_art_domain: elementary algebra — involutions on a finite set
-- prior_art_note: r(d) = 10 − d is a reflection of the digits 1..9 about 5, and every reflection x ↦ c − x is an involution (Wikipedia, "Involution (mathematics)"). The claim here is the kernel's decision of it over that finite list; the involution itself is not new.
-- prior_art_search: MCP web_search, source wikipedia, query "Involution (mathematics) reflection x maps to c minus x", on 2026-10-23. No hit for the digit complement 10 − d specifically; the concept is credited above.
-- lean/diamond.lean — the diamond involution r(d) = 10 − d on the digits 1..9, as a theorem the kernel checks.
-- The audit in scripts/mcp.ts reads its verdict from here (lean_ask), not from a JavaScript loop over a literal range.
-- Decided over a finite list, so it depends on no axiom beyond the kernel.

def diamond (d : Nat) : Nat := 10 - d

theorem diamond_involution : (List.range' 1 9).all (fun d => diamond (diamond d) == d) = true := by decide
