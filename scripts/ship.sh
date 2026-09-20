#!/bin/bash
# SHIP — seal, gate, commit, push. One command, one verdict, no narration in between.
# Written because verifying a change interactively costs a round trip per step, and the steps never vary:
# seal what compiles, run the chain, and push only if it is green. A red chain leaves the tree alone.
set -o pipefail
cd "$(dirname "$0")/.." || exit 1
MSG="${1:?usage: ship.sh <commit-message-file>}"
echo "── seal ──"
node scripts/seal-lean.ts --seal 2>&1 | tail -2 || exit 1
LED=$(node -e 'console.log(require("./src/proof/discovered.json").length)')
if [ $((LED % 8)) -ne 0 ]; then echo "✗ ledger $LED is not an octave — stopping"; exit 1; fi
echo "  ledger $LED = $((LED / 8)) x 8 exact"
echo "── chain ──"
if ! npm run release > /tmp/ship.log 2>&1; then
  echo "✗ chain red — nothing committed, nothing pushed:"
  grep -E "^✗|FAILS ON A CLEAN TREE|ACCEPTS |NO-OP" /tmp/ship.log | head -5
  exit 1
fi
echo "  ✓ chain green ($(grep -cE '^  ✓' /tmp/ship.log) checks passed, 0 failures)"
echo "── commit ──"
# TRACKED FILES ONLY, PLUS WHAT IS NAMED. `git add -A` swept an untracked scripts/affected.ts into a
# commit on the first run of this script — a file a PEER SESSION is writing in this same checkout, to the
# same instruction, and not finished. Committing another session's work-in-progress under this session's
# message is the same defect as committing a control's mutation mid-chain, which cost a generator earlier
# today. New files this session means to ship are passed by name as arguments after the message.
# EXPLICIT PATHS ONLY — not even `git add -u`. The first run of this script swept up an untracked
# scripts/affected.ts, and `-u` would have taken the tracked half of the same peer session's work
# (src/source/index.ts, which affected.ts imports `dependsOn` from) while leaving the untracked half
# behind: half a feature, committed under someone else's message, broken on arrival. A peer session works
# in this same checkout. Every path this session ships is named on the command line.
for f in "${@:2}"; do git add "$f"; done
git commit -F "$MSG" -q 2>&1 | grep -E "^✗|error" | head -3
git log -1 --format='  %h %s'
echo "── push ──"
git push origin main 2>&1 | tail -2
TAGS=$(git push --dry-run --tags origin 2>&1 | grep -c "new tag")
if [ "$TAGS" -gt 0 ]; then git push --tags origin 2>&1 | grep "new tag" | head -5; fi
echo "✓ shipped"
