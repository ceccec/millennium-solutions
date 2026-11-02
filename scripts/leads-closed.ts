#!/usr/bin/env node
// LEADS CLOSED — the development-level hard fail: no push while any lead is open. The leads script reports open items and
// does not fail (an open question is work not done). This gate is the one that fails, so the development standard is enforced
// at the push. An environmental restriction that stops a lead from closing (a source that cannot be reached) is not an
// exception: the lead stays open and the push waits. A lead whose cause is AUTHORITY — an act only the depositor can
// perform, a token or a signature — is different in kind: no commit from anyone else closes it, and holding every push on
// it held 49 commits for ten days (2026-10-23 → 11-02) behind the depositor's Zenodo token. leads.ts prints the two counts
// apart; this gate refuses on the first and names the second as waiting on the depositor. By the captain's order to ship.
import { execFileSync } from 'node:child_process'

const out = execFileSync('node', ['scripts/leads.ts'], { encoding: 'utf8', maxBuffer: 16 << 20 })
const m = out.match(/closable here: (\d+) area\(s\), (\d+) item\(s\) · waiting on the depositor: (\d+) area\(s\), (\d+) item\(s\)/)
if (!m) { console.log('✗ leads-closed: the leads report carries no closable/depositor summary line, so the open count cannot be read'); process.exit(1) }
const items = Number(m[2])
if (Number(m[4]) > 0) console.log(`· leads-closed: ${m[4]} item(s) in ${m[3]} area(s) wait on the depositor — an act no push performs; named, not held against this push`)
if (items > 0) {
  console.log(`✗ leads-closed: ${items} lead item(s) closable here are still open in ${m[1]} area(s). A push waits until every lead that can close here is closed.`)
  // THE SOLUTION IS SHOWN WITH THE REFUSAL. Each open area carries its closing route (the arrow lines of the leads report): the refusal
  // names what closes it, so nobody has to go and look for it.
  const routes = out.split('\n').filter((l) => l.trim().startsWith('→'))
  for (const r of routes) console.log(`    ${r.trim()}`)
  process.exit(1)
}
console.log('✓ leads-closed: no open lead that this tree can close')
