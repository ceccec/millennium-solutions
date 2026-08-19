#!/usr/bin/env node
// C8 — the browser leg of the matrix. Serves the package over http and drives a real headless Chrome
// page that imports the BUNDLE (dist/uuidna.esm.js) and runs the same test/conformance.mjs checks every
// other runtime runs. One suite, one set of vectors, five runtimes.
//
// The page POSTs its results back to this server and we kill the browser as soon as they arrive. We do
// NOT wait for Chrome to exit on its own: headless Chrome keeps helper processes alive, so waiting on
// process exit (or on --dump-dom) hangs. Reporting the result is the completion signal.
//
// Chrome is located from CHROME_PATH, then the usual CI/macOS locations. If no browser is present the
// driver says so and exits 0 — a missing browser is not a conformance failure, and CI installs one.
import { createServer } from 'node:http'
import { readFile, mkdtemp, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join, extname } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const MIME = { '.html': 'text/html', '.mjs': 'text/javascript', '.js': 'text/javascript', '.json': 'application/json' }
const TIMEOUT_MS = Number(process.env.UUIDNA_BROWSER_TIMEOUT_MS ?? 120000)

const PAGE = `<!doctype html><meta charset="utf-8"><title>uuidna conformance</title>
<body><pre id="out">running…</pre><script type="module">
import { runConformance, runtimeName } from './test/conformance.mjs'
const report = (body) => fetch('/__result', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
try {
  const U = await import('./dist/uuidna.esm.js')
  const r = runConformance(U)
  document.getElementById('out').textContent = r.results.map((x) => (x.ok ? '✓ ' : '✗ ') + x.name).join('\\n')
  await report({ runtime: runtimeName(), passed: r.passed, failed: r.failed, results: r.results })
} catch (e) {
  await report({ runtime: 'browser', passed: 0, failed: 1, results: [{ name: 'page/module load', ok: false, detail: String(e && e.stack || e) }] })
}
</script></body>`

function findChrome() {
  return [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  ].filter(Boolean).find((p) => existsSync(p))
}

const chrome = findChrome()
if (!chrome) {
  console.log('· no Chrome/Chromium found (set CHROME_PATH) — skipping the browser leg, not a failure')
  process.exit(0)
}

let resolveResult
const resultArrived = new Promise((r) => { resolveResult = r })

const server = createServer(async (req, res) => {
  const path = req.url.split('?')[0]
  if (req.method === 'POST' && path === '/__result') {
    const chunks = []
    for await (const c of req) chunks.push(c)
    res.writeHead(204).end()
    resolveResult(JSON.parse(Buffer.concat(chunks).toString()))
    return
  }
  if (path === '/' || path === '/index.html') { res.writeHead(200, { 'content-type': 'text/html' }).end(PAGE); return }
  try {
    const body = await readFile(join(ROOT, path.replace(/^\//, '')))
    res.writeHead(200, { 'content-type': MIME[extname(path)] ?? 'application/octet-stream' }).end(body)
  } catch {
    res.writeHead(404).end('not found')
  }
})

await new Promise((r) => server.listen(0, '127.0.0.1', r))
const port = server.address().port
const profile = await mkdtemp(join(tmpdir(), 'uuidna-chrome-'))

const child = spawn(chrome, [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run', '--disable-extensions',
  `--user-data-dir=${profile}`, `http://127.0.0.1:${port}/`,
], { stdio: 'ignore' })

let timer
const timeout = new Promise((_, reject) => {
  timer = setTimeout(() => reject(new Error(`the page did not report within ${TIMEOUT_MS}ms`)), TIMEOUT_MS)
})

let report
try {
  report = await Promise.race([resultArrived, timeout])
} finally {
  clearTimeout(timer)
  child.kill('SIGKILL')
  server.close()
  // Best-effort cleanup ONLY. Chrome's helper processes can still be writing into the profile after the
  // parent is killed, so an immediate rmdir races them and throws ENOTEMPTY. The temp profile is disposable
  // and the OS reclaims it — never let tidying up decide the conformance verdict. Retry briefly, then shrug.
  for (let attempt = 0; attempt < 5; attempt++) {
    try { await rm(profile, { recursive: true, force: true }); break }
    catch { await new Promise((r) => setTimeout(r, 200)) }
  }
}

// Detail is printed on success too: the anchors (addresses, roots) are how a cross-runtime byte
// difference becomes visible when comparing this output with the other runtimes'.
for (const r of report.results) console.log(`${r.ok ? '✓' : '✗'} ${r.name}${r.detail ? '  ' + r.detail : ''}`)
console.log(`\n${report.runtime} — ${report.passed} passed, ${report.failed} failed`)
process.exit(report.failed ? 1 : 0)
