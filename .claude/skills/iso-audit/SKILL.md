---
name: iso-audit
description: Audit the built millennium-solutions site against every machine-checkable ISO requirement (ISO 639/3166, ISO/IEC 40500 = WCAG 2.0, ISO 8601, ISO 4217, ISO 26324 DOI, ISO/IEC 27002 technical controls, ISO/IEC 25010 link correctness and page weight), and decode qpu's textbooks into human particles. Use when asked to audit the site, measure ISO compliance, check accessibility or contrast, or decode textbooks.
---

# ISO audit

The tools are committed; this is how to run them and how not to fool yourself with them.

## Run

The audit reads the **built** site after the whole post-build chain, because later steps create pages and files the
links point to:

```bash
npx vitepress build && node scripts/locale-fold.ts && node scripts/sitemap-mesh.ts && npm run iso-audit
```

It sits in `npm run release` right after `sitemap-mesh.ts`, and in the MCP as `run_suite {"suite":"iso-audit"}`.
Textbooks: `npm run textbooks` (needs qpu's checkout, `QPU_DIR`), MCP suite `textbooks`; page `/textbooks`.

## The method — every rule here was learned from a false result in one session

1. **Every check has a control that must fail it.** The synthetic `BAD` page in `scripts/iso-audit.ts` breaks every
   requirement; if any check passes it, the audit refuses to run. Add a breaking case to `BAD` with every new check.
   The control caught the audit's own weak 3.1.1 (it accepted the invalid tag `zz-QQ`).
2. **A check that ran zero times is not a pass.** It is printed as `nothing on the site to check (0 instances)`.
3. **What a machine cannot check is NOT MEASURED, with the reason** — never folded into a pass.
4. **Check the instrument before believing a failure.** Five of the first findings were the checker:
   - an input wrapped in `<label>` is labelled (HTML's implicit label), not only `aria-label` / `for=`;
   - a valueless `title` on a button is an unresolved Vue binding filled on hydration — measured apart as "named by script";
   - locale-fold's redirect stubs hold no content — 2.4.1 is not applicable to them, measured apart;
   - links to `/bg/…` and `/sitemap.json` exist only after `locale-fold` / `sitemap-mesh` — audit after them;
   - in the textbook decoder: nested binders `(hσ0 : (4) ≤ σ)` need a bracket scanner, sentences spell numbers in words,
     and a decimal must match its joined digits.
5. **Name what a rule actually is.** "Headings never skip a level" is WCAG technique G141, not normative text; a
   sentence stating none of its statement's numbers is "states none", not a contradiction.
6. **No typed code lists.** Languages, regions and currencies come from the runtime's ISO data (`Intl`).
7. **Contrast is computed from the theme tokens** (`:root` / `.dark` custom properties, resolved through `var()`), for
   every text-on-background pair, by WCAG's relative-luminance formula; a fix picks the nearest compliant colour, computed.

## What it does not establish

ISO/IEC 27001 (a certified management process) and most of ISO/IEC 25010 are not measurable from a website. A pass is
"every machine-checkable requirement holds", never "ISO compliant".
