#!/usr/bin/env node
// STALL-CHECK — flag submitted text that says the next step is unknown.
//
//   echo '<text an agent submitted>' | node scripts/stall-check.ts
//
// This reads only the text it is given. It cannot read an agent's private reasoning, and it does not claim to.
// It is a phrase match: each line that contains a stall phrase is reported with the phrase it matched. A match means
// the text stalls on its own words; no match means only that none of the listed phrases appeared.
import { readFileSync } from 'node:fs'

const PHRASES = [
  /next step (isn'?t|is not) (obvious|clear)/i,
  /(don'?t|do not) know what (to do|the next step) (is|next)/i,
  /\bsilence\b.*\bnext step\b/i,
  /\bunclear what to do next\b/i,
  /\bno obvious next step\b/i,
  /\bstuck\b.*\bnext\b/i,
]

const lines = readFileSync(0, 'utf8').split('\n')
const hits: { line: number; text: string; phrase: string }[] = []
lines.forEach((l, i) => {
  for (const p of PHRASES) {
    const m = p.exec(l)
    if (m) {
      hits.push({ line: i + 1, text: l.trim().slice(0, 200), phrase: m[0] })
      break
    }
  }
})

console.log(JSON.stringify({
  status: hits.length ? 'STALLED_TEXT' : 'NO_STALL_PHRASE',
  hits,
  note: 'a phrase match on the submitted text only. It cannot see reasoning that was not written down, and no match does not mean the agent is not stalled.',
}, null, 1))
