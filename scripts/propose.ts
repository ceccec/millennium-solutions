#!/usr/bin/env node
// PROPOSE — offer changed files to main as a SIGNED commit on a branch, and open a pull request.
//
// Both autonomous workflows need this and the first version of each did it with `git commit` + `git push`.
// That is rejected, and rightly: this repository requires verified signatures on every branch, not only on
// main, and a bot has no key. The novelty run spent twenty minutes searching and then could not offer the
// result — the work was done and undeliverable.
//
// A commit created through the GitHub API is signed by GitHub, so it satisfies the rule without anyone
// handing a key to a robot. That is the whole trick, and it is the reason this is a script rather than four
// more lines of YAML in each workflow: two copies of a signing path is how one of them ends up being the
// one that quietly pushes unsigned.
//
// It proposes. It never merges, never touches main, and exits 0 when there is nothing to offer — a run that
// found nothing is not a failure, it is a measurement.
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { arg } from '../src/cli/index.ts'

const branch = arg('--branch') ?? `proposal/${new Date().toISOString().slice(0, 10)}`
const title = arg('--title') ?? 'automated proposal'
const body = arg('--body') ?? 'Opened by scripts/propose.ts.'
const repo = process.env.GITHUB_REPOSITORY ?? execSync('gh repo view --json nameWithOwner -q .nameWithOwner', { encoding: 'utf8' }).trim()

const changed = execSync('git status --porcelain', { encoding: 'utf8' }).split('\n').filter(Boolean)
  .map((l) => ({ status: l.slice(0, 2).trim(), path: l.slice(3).trim().replace(/^"|"$/g, '') }))
  .filter((c) => c.status !== '??' || true)
if (!changed.length) { console.log('propose: nothing changed — there is nothing to offer, which is a result and not a failure'); process.exit(0) }

const head = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim()
const base = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim()
const sh = (cmd: string, input?: string): string =>
  execSync(cmd, { encoding: 'utf8', input, maxBuffer: 64 * 1024 * 1024 })

// the branch must exist before a commit can be placed on it
try { sh(`gh api -X POST /repos/${repo}/git/refs -f ref=refs/heads/${branch} -f sha=${head}`) }
catch { console.log(`propose: ${branch} already exists — the commit will be added to it`) }

// createCommitOnBranch signs the commit with GitHub's own key, which is what the ruleset asks for
const additions = changed.filter((c) => c.status !== 'D').map((c) => ({
  path: c.path, contents: readFileSync(c.path).toString('base64'),
}))
const deletions = changed.filter((c) => c.status === 'D').map((c) => ({ path: c.path }))
const expectedHeadOid = sh(`gh api /repos/${repo}/git/refs/heads/${branch} -q .object.sha`).trim()
const input = {
  branch: { repositoryNameWithOwner: repo, branchName: branch },
  message: { headline: title },
  expectedHeadOid,
  fileChanges: { additions, deletions },
}
const q = 'mutation($input: CreateCommitOnBranchInput!) { createCommitOnBranch(input: $input) { commit { oid url } } }'
const out = sh(`gh api graphql -f query=${JSON.stringify(q)} --input -`, JSON.stringify({ query: q, variables: { input } }))
const oid = (/"oid":"([0-9a-f]+)"/.exec(out) ?? [])[1] ?? '(unknown)'
console.log(`propose: signed commit ${oid.slice(0, 9)} on ${branch} — ${additions.length} file(s) added or changed, ${deletions.length} removed`)

try {
  const url = sh(`gh pr create --base ${base} --head ${branch} --title ${JSON.stringify(title)} --body ${JSON.stringify(body)}`).trim()
  console.log(`propose: ${url}`)
} catch {
  console.log(`propose: a pull request for ${branch} is already open — the commit was added to it`)
}
