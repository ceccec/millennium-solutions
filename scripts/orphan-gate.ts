#!/usr/bin/env node
// ORPHAN GATE — a script nothing runs is either dead or forgotten, and the difference matters.
//
// Four scripts here were reachable by nobody: not an npm script, not imported, not in a workflow, not in a
// hook. Asked to purge legacy code I nearly deleted all four — and then found that three of them do real
// work that nothing else covers. verify.ts produces the per-entry citation verdict and its root; trial-all.ts
// puts every ledger entry in the dock and writes an order-invariant verdict; lean-gen.ts proves ledger
// families at scale. Only one was actually legacy: a sixteen-line SHA-256 demo over two invented
// transactions, superseded by the real receipt chain and forensics.
//
// So the finding was not "delete four things". It was "three things that should be running are not", which is
// the opposite conclusion from the same evidence. This gate exists so the next orphan is noticed while
// somebody still remembers what it was for, instead of being found during a purge and judged in a hurry.
import { readFileSync, readdirSync, existsSync } from 'node:fs'

const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts: Record<string, string> }
const npmText = Object.values(pkg.scripts).join(' ')
const scripts = readdirSync('scripts').filter((f) => f.endsWith('.ts') && !f.startsWith('.'))

const srcText = scripts.map((f) => readFileSync('scripts/' + f, 'utf8')).join('\n')
  + readdirSync('src', { recursive: true }).map(String).filter((f) => f.endsWith('.ts'))
      .map((f) => { try { return readFileSync('src/' + f, 'utf8') } catch { return '' } }).join('\n')
const wfText = existsSync('.github/workflows')
  ? readdirSync('.github/workflows').map((f) => readFileSync('.github/workflows/' + f, 'utf8')).join('\n') : ''
const hookText = existsSync('.githooks')
  ? readdirSync('.githooks').map((f) => { try { return readFileSync('.githooks/' + f, 'utf8') } catch { return '' } }).join('\n') : ''

const orphans = scripts.filter((f) => {
  const n = f.replace('.ts', '')
  if (npmText.includes(`scripts/${f}`)) return false
  if (new RegExp(`from '\\.\\/${n}\\.ts'|from '\\.\\.\\/scripts\\/${n}\\.ts'`).test(srcText)) return false
  if (wfText.includes(`scripts/${f}`) || hookText.includes(`scripts/${f}`)) return false
  return true
})

console.log(`orphan — ${scripts.length} scripts, each reachable from an npm script, an import, a workflow or a hook:`)
if (orphans.length) {
  for (const f of orphans) console.log(`  ✗ ${f} — nothing runs it`)
  console.log(`\n✗ orphan-gate: ${orphans.length} script(s) nothing can reach. Wire it, or delete it — but decide while`)
  console.log(`  someone still knows what it was for. Three of the last four turned out to be worth keeping.`)
  process.exit(1)
}
console.log(`\n✓ orphan-gate: every script is reachable`)
