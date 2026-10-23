-- title: The open leads, named
-- wing: the floor
-- prior_art: not applicable (a register of this repository's own open items)
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- Each open lead is named here as the `leads` MCP tool reports it on the date below. Nothing in this file removes,
-- purges, or replaces an item: it only names them. An item is closed by the work its lead asks for, and this file
-- is then updated to say so. The report truncates some lists; the names below are the ones it prints in full.

/-!
# Open leads, as reported by the `leads` tool

## deposit — 25 items, authority only the depositor can perform
Deposition is staged and not minted (0 minted). Two paths, both the depositor's:
- enable the Zenodo ↔ GitHub integration for this repository, which mints one DOI per release for the whole deposit;
- a token with deposit:write and deposit:actions, which mints the per-theorem records individually.

## mcp-reach — 21 items, tools an npm install cannot reach
Tools whose only need is the tree or the ledger. Named in the report: coils, discoveries, discover, recompute,
task_route, stall_check, session_report, metrics_face, entanglements, leaks, hexbit_route, prose_check,
theorem_only, constants_check. Each either moves onto data or logic the package carries, or is named in
src/mcp/serve.ts CANNOT_SHIP with a reason that is true today. The report truncates the rest of the list.

## laws — 8 items, theorems that only read back a hand-set value
Named in the report: address.lean `the_second_seed_is_the_first_hex_word_of_the_golden_ratio`;
cern.lean `records_are_numeric_plus_slug`, `listed_urls_are_records_plus_duplicates`,
`urls_are_listed_records_plus_non_records`, `fixed_and_swapped_partition_the_records`, `oai_harvest_is_complete`.
The report truncates the remaining items. Each is restated as a law with its inverse over the domain its constant describes.

## prior art — 3 items, no prior-art search recorded
`answer.lean`, `arith.lean`, `diamond.lean`. A search is recorded in the file frontmatter and the frontmatter is regenerated.

## controls — 1 item, refuses but never shown to fail
`qpu-gate`. Its refusal path is unreachable while the installed @uuidna/qpu cannot load; it needs a control in
scripts/gates-fire.ts, or a named reason for being uncontrolled.

## realisations — named this session, none closed
Each item is a finding or an open decision. Nothing here is removed, purged or replaced; an item closes only when the work it names is done.

- ledger — 38 entries appended by an accidental seal, kept (purge nothing). The octave remainder stays 6 until the next seal.
- api registry — zbmath:search answers 200, but the stated fact is not in the reply. Unresolved; the expected fact is not yet verified.
- APIs.guru live — 155 catalogued APIs have a served spec whose server does not answer (SPEC-ONLY); 237 were not measured; 2006 need a key and were not called.
- APIs.guru gaps — 11 GitHub v3 catalogue entries list github.com as their server, while the adapter uses api.github.com. Which is right is not yet checked against the spec.
- NIST — five services are covered. The Standard Reference Data and the Fundamental Constants pages are not.
- payload CRUD — the integration suite cannot reach its database under vitest: the D1 binding hangs at schema pull. The existing api spec hangs the same way.
- qpu connector — its ask source reads a phrase as text and returns a recognition record, not an answer. The understand tool now reports such a request as not understood.
- qpu build — a stopped build left dist/ possibly incomplete. Not rebuilt.
- qpu refactor — branch claude/hungry-cerf-2cd7f0 has 16 residual sites that need a decision. Not merged.
- Clay — the tools check the three eligibility conditions. They do not solve the problems, and the conditions are not met.
- factoring — integers of any length are accepted; a thousand-bit integer with no small factor returns PARTIAL, not a factorisation.
- CERN and NIST — the two share no physical quantity in this tree. A real pairing needs a CERN measurement compared with a NIST value under a stated uncertainty.
- theorem counts — the pages report 25995 theorems and lean_verify reports 26008. The counting methods differ, and the difference is not yet explained.
-/
