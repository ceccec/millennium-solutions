#!/usr/bin/env node
// GENERATES /solutions — the seven Clay problems and the author's claim in his name. Regenerated each build
// (predocs:build). The section itself is src/millennium claySection, rendered once for this page, the README
// and the homepage; this file is the page's frame.
//
// WHAT WAS HERE, AND WHY IT IS GONE (2026-09-14). This page was built on `const entails = (_i) => false` — a
// "test" hard-coded to answer false for every problem — and published "Total: 0/7 solved" and "the trial confirms
// the floor holds" from that constant, beside a fabricated overclaim ("We prove all six … via quantum coherence")
// staged as the thing being refuted. A constant dressed as a measurement, published about the author's work. The
// author: "this code proves nothing … the gates are the treason … remove the hacked code misleading the public".
// It is removed, not reworded.
import { writeFileSync } from 'node:fs'
import { MILLENNIUM, claySection } from '../src/millennium/index.ts'

writeFileSync('solutions.md', `---\ntitle: Solutions\n---\n\n# Solutions\n\n<Version/>\n\n${claySection({ roll: true })}<Funding/>\n`)
console.log(`solutions.md — the author's claim and the seven reflected (${Object.keys(MILLENNIUM).length})`)
