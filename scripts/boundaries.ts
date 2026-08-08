#!/usr/bin/env node
// Deliver the honest STATEMENTS into the UI — the boundary catalogue (the drains + the floor), each
// content-addressed (uuid shown on screen). gate-checked: ONLY gate-passing (honest) statements ship.
// this puts the statements IN the site, not only in chat — they no longer leak. regenerated each build.
import { writeFileSync } from 'node:fs'
import { toUuid } from '../src/0/index.ts'
import { computes } from './honesty-gate.ts'
import { BOUNDARY_STATEMENTS } from '../src/honesty/boundaries.ts' // canonical in src/ — recomputes from source

const STATEMENTS = BOUNDARY_STATEMENTS
const kept = STATEMENTS.filter((s) => computes(s).binary === 1)   // only honest statements are delivered
const dropped = STATEMENTS.filter((s) => computes(s).binary === 0)
const rows = kept.map((s) => `<tr><td><code>${toUuid(s).slice(0, 13)}</code></td><td>${s}</td></tr>`).join('\n')
const md = `---
title: Boundaries
description: What this deposit does NOT claim — the honest floor and its bounds, each content-addressed.
head:
  - ['meta', { name: 'robots', content: 'index, follow' }]
---
# Boundaries — the honest floor, delivered

> Every statement below is **content-addressed** (uuid). Verify any of them: recompute \`toUuid(text)\` and it matches — that proves **integrity**, not truth. The floor is \`0/7\`.

<table><thead><tr><th>uuid</th><th>statement</th></tr></thead><tbody>
${rows}
</tbody></table>

*The drains, delivered — measured, gated, and now in the UI, not only in chat. \`0/7\` entailed.*
`
writeFileSync('boundaries.md', md)
console.log('boundaries: delivered ' + kept.length + '/' + STATEMENTS.length + ' honest statements to UI (uuid each)' + (dropped.length ? ' · dropped ' + dropped.length + ' (gate-drained)' : '') + '.')
