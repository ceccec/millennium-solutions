#!/usr/bin/env node
// LEADS CLOSED — the development-level hard fail: no push while any lead is open. The leads script reports open items and
// does not fail (an open question is work not done). This gate is the one that fails, so the development standard is enforced
// at the push. An environmental restriction that stops a lead from closing (a depositor's credential, a source that cannot
// be reached) is not an exception: the lead stays open and the push waits.
import { execFileSync } from 'node:child_process'

const out = execFileSync('node', ['scripts/leads.ts'], { encoding: 'utf8', maxBuffer: 16 << 20 })
const m = out.match(/○ leads: (\d+) open area\(s\), (\d+) item\(s\)/)
if (!m) { console.log('✗ leads-closed: the leads report carries no summary line, so the open count cannot be read'); process.exit(1) }
const items = Number(m[2])
if (items > 0) {
  console.log(`✗ leads-closed: ${items} lead item(s) are still open in ${m[1]} area(s). A push waits until every lead is developed online and closed.`)
  // THE SOLUTION IS SHOWN WITH THE REFUSAL. Each open area carries its closing route (the arrow lines of the leads report): the refusal
  // names what closes it, so nobody has to go and look for it.
  const routes = out.split('\n').filter((l) => l.trim().startsWith('→'))
  for (const r of routes) console.log(`    ${r.trim()}`)
  process.exit(1)
}
console.log('✓ leads-closed: no open lead')
