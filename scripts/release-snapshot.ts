#!/usr/bin/env node
// WHAT WAS ALREADY DIRTY BEFORE THE CHAIN RAN — recorded so the release commit can tell the developer's
// work from its own.
//
// release.ts ended with `git add -A`, which stages EVERYTHING and commits it under a generated message.
// Two costs, both paid this session: an authored commit is absorbed (I wrote a considered message, the
// chain had already swept the files into "release uuidna 0.1.1 — signed from gravity…"), and unrelated
// work in progress is committed by a command nobody thought of as a commit.
//
// The chain's own output SHOULD be committed — the tag claims a content-address and HEAD must carry it.
// The developer's parallel work should not be. Telling them apart needs one fact: what was dirty before
// the generators ran. That is recorded here, at the head of the chain, and read at the tail.
import { writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'

const before = execSync('git status --porcelain', { encoding: 'utf8' })
  .split('\n').filter(Boolean).map((l) => l.slice(3).trim().replace(/^"|"$/g, ''))
writeFileSync('.release-snapshot.json', JSON.stringify({ before }, null, 2) + '\n')
console.log(`release-snapshot: ${before.length} path(s) already dirty before the chain — these stay the developer's`)
