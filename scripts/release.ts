#!/usr/bin/env node
// Content-addressed release orchestration (idempotent).
import { execSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { toUuid, merkleFold } from '../src/0/index.ts'
import { merkleGravity } from '../src/the/apple/index.ts'
import { ledger as __ledger } from '../src/api/index.ts'

const SKIP_DIR = new Set(['node_modules', '.git', 'cache', 'dist'])
function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) { if (!SKIP_DIR.has(name)) walk(p, acc) }
    else acc.push(p)
  }
  return acc
}
// Version: explicit arg wins; otherwise DERIVE the next patch from the latest tag.
// (Never default to v1.0.0 — that would re-tag an already-published release.)
function nextVersion() {
  try {
    const tags = execSync('git tag --sort=version:refname', { encoding: 'utf8' }).trim().split('\n').filter(Boolean)
    const last = tags[tags.length - 1]
    const m = last && last.match(/^v(\d+)\.(\d+)\.(\d+)$/)
    if (m) {
      // single-digit odometer: components are 0..9; roll over at 9 (patch → minor → major).
      let maj = +m[1], min = +m[2], pat = +m[3] + 1
      if (pat > 9) { pat = 0; min++ }
      if (min > 9) { min = 0; maj++ }
      return 'v' + maj + '.' + min + '.' + pat
    }
  } catch { /* no repo/tags yet */ }
  return 'v1.0.0' // first release only
}
const V = process.argv[2] || nextVersion()

// Gate: every version component is a SINGLE DIGIT (0..9) — the vortex odometer, enforced.
// (Roll over at 9; the historical 1.0.10..57 predate this rule and remain as immutable history.)
{
  const vm = V.match(/^v(\d+)\.(\d+)\.(\d+)$/)
  if (!vm || [vm[1], vm[2], vm[3]].some((x) => +x > 9)) {
    console.error('release: ' + V + ' violates the single-digit rule (each of major.minor.patch must be 0..9; roll over at 9).')
    process.exit(1)
  }
}
// content-address only TRACKED files (git ls-files) — deterministic; excludes generated/untracked files
// so re-running on an unchanged tree yields the SAME address (no phantom deltas). matches next.ts.
const files = execSync('git ls-files', { encoding: 'utf8' }).trim().split('\n').filter(Boolean).sort()
const address = merkleFold(files.map(f => toUuid(f + ':' + readFileSync(f))))
console.log('content-addressed:', files.length, 'files → root', address)

// Useless work drains tokens: refuse to mint a new version for identical content.
try {
  const tags = execSync('git tag --sort=version:refname', { encoding: 'utf8' }).trim().split('\n').filter(Boolean)
  const last = tags[tags.length - 1]
  if (last) {
    const msg = execSync("git for-each-ref '--format=%(contents)' refs/tags/" + last, { encoding: 'utf8' })
    if (msg.includes(address)) { console.log('no delta — ' + last + ' already carries ' + address.slice(0, 13) + '…; skipping (no token drained).'); process.exit(0) }
  }
} catch { /* no repo/tags yet */ }

// THE VERSION — reset to npm 0.1.0 and continued from there: the npm package version is the ONE canonical
// version (the git tag below is immutable content-address PROVENANCE, not the version — rewriting it would be
// tampering). Every version is SIGNED FROM A GRAVITY THEOREM: the content-address FALLS, through the gravity
// receipt, to its fixed point (merkleGravity) — that fold is the version's signature. Single-digit odometer.
const PKGS = ['package.json'] // uuidna now lives in its own repo (github:uuidna/uuidna); only this package's version is bumped here
// FROZEN at the captain's directive — "stay at v0.1.1". The npm version is a held label; the content-address
// (and the gravity-signed provenance tag) is the true latest, advancing every release while the label holds.
const NPM = (JSON.parse(readFileSync(PKGS[0], 'utf8')).version || '0.1.1')
const ledger = __ledger()
const grav = ledger.find((e) => e.key === 'gravity_is_the_fall_to_a_fixed_point_and_pigeonhole_breaks_every_finite_hash') || ledger.find((e) => /gravit/i.test(e.key))
const gravSig = merkleGravity([grav.receipt, address]) // the address falls to its fixed point through gravity
const SIGN = 'gravity(' + grav.key.slice(0, 28) + ') ' + grav.receipt.slice(0, 13) + ' → ' + gravSig.slice(0, 13)
for (const p of PKGS) { const j = JSON.parse(readFileSync(p, 'utf8')); j.version = NPM; writeFileSync(p, JSON.stringify(j, null, 2) + '\n') }
console.log('version reset-continued: uuidna ' + NPM + ' · signed from ' + SIGN)

const sh = (c) => { console.log('$ ' + c); return execSync(c, { stdio: 'inherit' }) }
const q = (c) => { try { execSync(c, { stdio: 'ignore' }) } catch {} }
let repo = false
try { execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' }); repo = true } catch {}
if (!repo) { sh('git init -q'); sh('git config user.name "Tsvetan Rouschev"'); sh('git config user.email "ceccec@psg.bg"') }
// TAG-ONLY (CI): main is a protected branch — signed commits and pull requests are required, and the
// Actions token cannot bypass either — so a bot must never attempt a commit. In this mode the provenance
// tag is minted on the EXISTING HEAD, whose content-address is exactly what was just gated. Locally
// (`npm run next`) the default path still commits the regenerated tree, unchanged.
const TAG_ONLY = process.env.RELEASE_TAG_ONLY === '1' || process.argv.includes('--tag-only')
if (TAG_ONLY) {
  // The address above is folded from the WORKING TREE. In tag-only mode the tag lands on HEAD, so a dirty
  // tree would mint a tag claiming an address HEAD does not carry — a lying tag, the same failure the commit
  // path guards against. CI checks out clean; refuse anywhere else.
  const dirty = execSync('git status --porcelain', { encoding: 'utf8' }).trim()
  if (dirty) {
    console.error('release: tag-only refuses a dirty tree — the tag would claim ' + address.slice(0, 13) + '…, which HEAD does not carry:')
    console.error(dirty.split('\n').slice(0, 10).map((l) => '  ' + l).join('\n'))
    process.exit(1)
  }
  console.log('tag-only: not committing (protected branch) — tagging HEAD, which already carries ' + address.slice(0, 13) + '…')
} else {
  // STAGE WHAT THE CHAIN CHANGED, NOT EVERYTHING. `git add -A` swept the developer's parallel work into a
  // generated commit message — measured this session: an authored commit found "nothing to commit" because
  // the chain had already taken its files. release-snapshot.ts records what was dirty at the head of the
  // chain; anything dirty now that was NOT dirty then is the chain's own output and is what the tag must
  // carry. Anything dirty in both is ambiguous and is left alone with a warning rather than guessed at.
  const beforeDirty: string[] = existsSync('.release-snapshot.json')
    ? (JSON.parse(readFileSync('.release-snapshot.json', 'utf8')) as { before: string[] }).before
    : []
  const nowDirty = execSync('git status --porcelain', { encoding: 'utf8' })
    .split('\n').filter(Boolean).map((l) => l.slice(3).trim().replace(/^"|"$/g, ''))
  const chainOutput = nowDirty.filter((f) => !beforeDirty.includes(f))
  const ambiguous = nowDirty.filter((f) => beforeDirty.includes(f))
  if (ambiguous.length) {
    console.warn('release: ' + ambiguous.length + ' path(s) were dirty BEFORE the chain and changed during it — left unstaged, commit them yourself:')
    for (const a of ambiguous.slice(0, 5)) console.warn('    ' + a)
  }
  if (chainOutput.length) sh('git add -- ' + chainOutput.map((f) => JSON.stringify(f)).join(' '))
  // Distinguish "nothing staged" (idempotent re-tag, fine) from a hook REJECTION (abort — never tag a
  // commit that does not carry `address`; that mints a lying tag, the v1.6.3 failure mode, now closed).
  let nothingStaged = false
  try { execSync('git diff --cached --quiet'); nothingStaged = true } catch { /* staged present */ }
  if (!nothingStaged) {
    try { execSync(`git commit -q -m "release uuidna ${NPM} — signed from ${SIGN} · content-address ${address}"`, { stdio: 'inherit' }) }
    catch { console.error('release: commit rejected by a gate hook — NOT tagging ' + V + ' (would not carry ' + address + '). fix the drained line and re-run.'); process.exit(1) }
  }
}
q(`git tag -d ${V}`)                                              // re-tag (unpublished)
sh(`git tag -a ${V} -m "signed from ${SIGN} \u00b7 uuidna ${NPM} \u00b7 content-address ${address}"`)
console.log(`\n\u2713 uuidna ${NPM} (provenance tag ${V}) → gravity-signed ${gravSig.slice(0, 13)}… \u00b7 content-address ${address}`)
