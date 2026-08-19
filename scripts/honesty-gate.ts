// The prose honesty gate — ONE implementation, re-exported.
//
// A text computes TRUE iff it makes no unqualified claim that (a) the Clay problems are settled, or
// (b) the deposit breaks a physics, hardware or cryptographic limit. seal.ts applies it to files;
// next.ts applies it to messages; discover.ts tests every theorem name against it.
//
// HONEST ABOUT ITSELF: this is a lexical TRIPWIRE, not comprehension. Passing means "matches no known
// red-flag shape" — NOT "true". Necessary, not sufficient.
//
// THE DEDUPE. This file used to carry a second, hand-maintained copy of the detector, and the two had
// already drifted apart: the copies' PREDICT lists differed, and the package did not export `rosetta`
// at all. A detector that exists twice is a detector that will disagree with itself, and the fix for a
// leak then has to be applied in two places — as the self-reprieve leak was. The implementation now
// lives once, in @uuidna/uuidna (packages/uuidna/src/gate.ts), and this module re-exports it so every
// existing import keeps working unchanged.
//
// Before the copies were collapsed, both were checked to agree: RED, RED_INTL, OVERREACH, PREDICT and
// rosetta are byte-identical, and `computes` returned the same verdict on all 1864 sealed theorem names
// plus adversarial probes — 1874 inputs, zero disagreements. The one rule the parent had and the package
// lacked ("absolutely proven") was ported into the package first, so nothing was dropped to make the
// merge easy. Integrity, not truth. 0/7.
export { computes, RED, RED_INTL, OVERREACH, PREDICT, rosetta } from '@uuidna/uuidna'
