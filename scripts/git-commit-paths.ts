#!/usr/bin/env node
// GIT-COMMIT-PATHS — commit only the named files, through the repository's own hooks. It is the MCP tool
// `git_commit_paths`, so a commit is a server call and not a hand-run sequence.
//
//   echo '{"repo":"qpu","message":"...","paths":["src/x.ts"]}' | node scripts/git-commit-paths.ts
//
// What it does, and only this:
//   1. refuses unless the repo is one of the allowlisted repositories, the message has a subject, and every path is a
//      relative path inside that repository that exists or was tracked
//   2. stages exactly those paths, then commits with `git commit -- <paths>`, which takes only those paths into the
//      commit, so anything else staged in the index stays out
//   3. runs the repository's hooks, as git does. It never passes --no-verify. A hook that refuses refuses the commit.
//   4. on refusal, unstages exactly those paths again, so the index is left as it was and the working tree is untouched
// It never pushes, never amends, never rewrites history, and never touches a path it was not given.
import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { join, isAbsolute } from 'node:path'

const REPOS: Record<string, string> = {
  millennium: join(homedir(), 'github', 'ceccec', 'millennium-solutions'),
  qpu: join(homedir(), 'github', 'uuidna', 'qpu'),
}

type Request = { repo?: string; message?: string; paths?: string[] }
const refuse = (why: string, extra: object = {}) => {
  console.log(JSON.stringify({ status: 'REFUSED', why, ...extra }, null, 1))
  process.exit(0)
}

let req: Request
try {
  req = JSON.parse(readFileSync(0, 'utf8')) as Request
} catch {
  refuse('the request is not JSON')
}
const repoDir = REPOS[String(req!.repo)]
if (!repoDir) refuse(`repo "${req!.repo}" is not allowlisted: use one of ${Object.keys(REPOS).join(', ')}`)
if (!existsSync(repoDir)) refuse(`the repository is not present: ${repoDir}`)
const message = String(req!.message ?? '').trim()
if (message.length < 10) refuse('the commit message needs a subject of at least ten characters')
const paths = Array.isArray(req!.paths) ? req!.paths.map(String) : []
if (paths.length === 0) refuse('no paths given: a commit here names the files it takes')
for (const p of paths) {
  if (isAbsolute(p) || p.split(/[\\/]/).includes('..')) refuse(`path "${p}" must be relative and inside the repository`)
  const onDisk = existsSync(join(repoDir, p))
  const tracked = spawnSync('git', ['ls-files', '--error-unmatch', '--', p], { cwd: repoDir, encoding: 'utf8' }).status === 0
  if (!onDisk && !tracked) refuse(`path "${p}" does not exist and was never tracked`)
}

const git = (args: string[]) => spawnSync('git', args, { cwd: repoDir, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })

// 1. stage exactly these paths (a deleted tracked file is staged as a removal)
const add = git(['add', '-A', '--', ...paths])
if (add.status !== 0) refuse('git add failed', { detail: String(add.stderr).slice(0, 400) })

// 2. commit only these paths, with the repository's hooks running
const dir = mkdtempSync(join(tmpdir(), 'commit-msg-'))
const msgFile = join(dir, 'MSG')
writeFileSync(msgFile, message + '\n')
const commit = git(['commit', '-F', msgFile, '--', ...paths])
rmSync(dir, { recursive: true, force: true })

if (commit.status !== 0) {
  // 4. the hooks refused: leave the index as it was for these paths
  git(['reset', '-q', '--', ...paths])
  refuse('the repository\'s hooks refused the commit; these paths are unstaged again and the working tree is untouched', {
    hookOutput: String(commit.stdout + commit.stderr).trim().split('\n').slice(-25),
  })
}

const head = git(['rev-parse', '--short', 'HEAD']).stdout.trim()
const subject = git(['log', '-1', '--format=%s']).stdout.trim()
console.log(JSON.stringify({ status: 'COMMITTED', repo: req!.repo, commit: head, subject, paths, hooks: 'ran, not bypassed' }, null, 1))
