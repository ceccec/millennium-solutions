#!/usr/bin/env node
// CONNECTOR-JOB — one connector call run in the background, so the session is never blocked waiting for a remote answer.
//
//   node scripts/connector-job.ts <job id> '<connect arguments as JSON>'
//
// It runs the same call the synchronous connect makes (scripts/mcp-call.ts connect), and writes the job's state to
// .vitepress/cache/jobs/<id>.json: RUNNING first, then DONE with the connector's reply, or FAILED with the reason.
// The state is written atomically (a temporary file, then a rename), so a reader never sees half a reply.
import { spawnSync } from 'node:child_process'
import { mkdirSync, renameSync, writeFileSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const JOBS = join(ROOT, '.vitepress', 'cache', 'jobs')
const [id, rawArgs] = process.argv.slice(2)
if (!id || !rawArgs) {
  console.error('usage: connector-job.ts <job id> <connect arguments as JSON>')
  process.exit(2)
}
mkdirSync(JOBS, { recursive: true })
const file = join(JOBS, `${id}.json`)
const write = (state: object) => {
  const tmp = `${file}.${process.pid}.tmp`
  writeFileSync(tmp, JSON.stringify(state, null, 1) + '\n')
  renameSync(tmp, file)
}
const startedAt = new Date().toISOString()
write({ id, status: 'RUNNING', startedAt })

let args: { timeout?: number }
try { args = JSON.parse(rawArgs) } catch { write({ id, status: 'FAILED', startedAt, endedAt: new Date().toISOString(), why: 'the connect arguments are not JSON' }); process.exit(1) }
const run = spawnSync('node', ['scripts/mcp-call.ts', 'connect', JSON.stringify(args)], { cwd: ROOT, encoding: 'utf8', timeout: (Math.min(600, Math.max(5, Number(args.timeout ?? 600))) + 30) * 1000, maxBuffer: 8 << 20 })
const endedAt = new Date().toISOString()
if (run.status !== 0 || !run.stdout) {
  write({ id, status: 'FAILED', startedAt, endedAt, why: (run.stderr || run.error?.message || 'the connector call produced no reply').slice(0, 400) })
  process.exit(1)
}
let reply: unknown
try { reply = JSON.parse(run.stdout) } catch { reply = { unparsed: true, text: run.stdout.slice(0, 40_000) } }
write({ id, status: 'DONE', startedAt, endedAt, reply })
