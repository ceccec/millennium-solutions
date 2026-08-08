---
title: Abstract — the framework
---

# Abstract — the framework, for everything

This is not a theory of everything. It is a **method** that applies to anything:
a discipline for turning a claim — in any domain — into something computed, measured,
gated, and sealed, so that what survives is only what holds. What generalizes is the
discipline, never the result. The floor is the same everywhere: **Clay problems solved: 0 / 7.**

## The method (one pipeline, every domain)

1. **Compute — exactly.** ℤ/9 vortex arithmetic, deterministic and reproducible. Logical
   time is the version, not the wall clock, so the same input yields the same address on
   any machine at any hour. A calculator, not an oracle.
2. **Measure — don't assert.** A verdict comes from a measurement, never a declaration.
   "It computes" is a reading, not a boast.
3. **Gate — at the floor.** The honesty gate drains the named overclaims — a Clay conjecture
   declared settled, a physical or cryptographic limit declared beaten, an unqualified
   superlative — none of which this deposit asserts. Passing means *no overclaim shape was
   found* — a floor, **not** a certificate of truth.
4. **Seal — integrity, not proof.** A content-address (merkle fold of the tracked tree)
   fixes *what* was computed. It is provenance, not encryption, not authorship, not proof.
5. **Ship — self-contained.** Static, serverless, no external imports; the artifact carries
   its own audit.

## The generating trinity: a432 · π · primes

The moving geometry needs only three parameters, and they are enough to draw all of it:

- **a432 — the angular quantum.** The circle of nine residues is cut into equal steps of
  360° / 9 = **40°**. Each digit `d` sits at angle `−90° + 40°·d` and takes hue `40°·d`; the
  colour *is* the angle. One harmonic quantum sets every position and every colour below.
- **π — closure.** The ring is 2π. The doubling map `n ↦ 2n (mod 9)` sends
  1 → 2 → 4 → 8 → 7 → 5 → 1 and **returns to its start** after six steps: the trajectory
  closes. Period, not drift.
- **primes — who is on the circuit.** The residues coprime to 9 — the units
  {1, 2, 4, 5, 7, 8} — are exactly the six the doubling map permutes into one orbit. The
  residues sharing the factor 3 — {3, 6, 9} — cannot join it and form the off-circuit triad.
  Coprimality (a fact about primes) decides membership.

That is the whole generator. Everything drawn here is a pure function of these three; nothing
external is imported. **Sufficient to generate the geometry** — which is a precise, bounded
claim, not a claim about everything.

<div style="display:flex;flex-wrap:wrap;gap:1.5rem;align-items:flex-start;justify-content:center;margin:1.5rem 0">

<figure style="margin:0;text-align:center">

<svg viewBox="0 0 220 220" role="img" aria-label="The Z/9 vortex: the doubling map traces the circuit 1-2-4-8-7-5 through every unit residue, closing on itself; the triad 3-6-9 stays off-circuit." xmlns="http://www.w3.org/2000/svg" style="max-width:340px;width:100%;height:auto">
  <style>
    .z9-spin{transform-origin:110px 110px;animation:z9spin 36s linear infinite}
    .z9-draw{stroke-dasharray:900;stroke-dashoffset:900;animation:z9draw 6s ease-in-out infinite alternate}
    .z9-cover{stroke-dasharray:552.92;stroke-dashoffset:552.92;animation:z9cover 6s ease-in-out infinite alternate}
    @keyframes z9spin{to{transform:rotate(360deg)}}
    @keyframes z9draw{from{stroke-dashoffset:900}to{stroke-dashoffset:0}}
    @keyframes z9cover{from{stroke-dashoffset:552.92}to{stroke-dashoffset:0}}
    @media(prefers-reduced-motion:reduce){.z9-spin,.z9-draw,.z9-cover{animation:none;stroke-dashoffset:0}}
  </style>
  <defs>
    <radialGradient id="z9glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="hsl(200 80% 60%)" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="hsl(200 80% 60%)" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="110" cy="110" r="104" fill="url(#z9glow)"/>
  <circle cx="110" cy="110" r="88" fill="none" stroke="var(--vp-c-divider,#8884)" stroke-width="1"/>
  <circle class="z9-cover" cx="110" cy="110" r="88" fill="none" stroke="hsl(150 70% 50%)" stroke-width="3" stroke-linecap="round" transform="rotate(-90 110 110)"/>
  <g class="z9-spin">
    <path d="M186.21,154 L33.79,154 L110,22 Z" fill="none" stroke="var(--vp-c-text-2,#8886)" stroke-width="1.2" stroke-dasharray="4 4"/>
    <path class="z9-draw" d="M166.57,42.59 L196.66,94.72 L140.1,192.69 L53.43,42.59 L23.34,94.72 L79.9,192.69 Z" fill="none" stroke="hsl(280 75% 62%)" stroke-width="2.4" stroke-linejoin="round"/>
    <circle r="5.5" fill="#fff">
      <animateMotion dur="6s" repeatCount="indefinite" path="M166.57,42.59 L196.66,94.72 L140.1,192.69 L53.43,42.59 L23.34,94.72 L79.9,192.69 Z" keyPoints="0;1" keyTimes="0;1" calcMode="linear"/>
    </circle>
    <circle cx="166.57" cy="42.59" r="7" fill="hsl(40 72% 55%)"/><text x="166.57" y="45.99" text-anchor="middle" font-size="8.5" font-weight="700" fill="#fff">1</text><circle cx="196.66" cy="94.72" r="7" fill="hsl(80 72% 55%)"/><text x="196.66" y="98.12" text-anchor="middle" font-size="8.5" font-weight="700" fill="#fff">2</text><circle cx="186.21" cy="154" r="7" fill="hsl(120 72% 55%)"/><text x="186.21" y="157.4" text-anchor="middle" font-size="8.5" font-weight="700" fill="#fff">3</text><circle cx="140.1" cy="192.69" r="7" fill="hsl(160 72% 55%)"/><text x="140.1" y="196.09" text-anchor="middle" font-size="8.5" font-weight="700" fill="#fff">4</text><circle cx="79.9" cy="192.69" r="7" fill="hsl(200 72% 55%)"/><text x="79.9" y="196.09" text-anchor="middle" font-size="8.5" font-weight="700" fill="#fff">5</text><circle cx="33.79" cy="154" r="7" fill="hsl(240 72% 55%)"/><text x="33.79" y="157.4" text-anchor="middle" font-size="8.5" font-weight="700" fill="#fff">6</text><circle cx="23.34" cy="94.72" r="7" fill="hsl(280 72% 55%)"/><text x="23.34" y="98.12" text-anchor="middle" font-size="8.5" font-weight="700" fill="#fff">7</text><circle cx="53.43" cy="42.59" r="7" fill="hsl(320 72% 55%)"/><text x="53.43" y="45.99" text-anchor="middle" font-size="8.5" font-weight="700" fill="#fff">8</text><circle cx="110" cy="22" r="7" fill="hsl(0 72% 55%)"/><text x="110" y="25.4" text-anchor="middle" font-size="8.5" font-weight="700" fill="#fff">9</text>
  </g>
</svg>

<figcaption style="font-size:.85em;opacity:.75;max-width:340px">The ℤ/9 vortex. The doubling circuit (violet) draws itself and the green ring fills — the orbit reaches every unit residue and closes. The dashed 3‑6‑9 triad stays off‑circuit.</figcaption>
</figure>

<figure style="margin:0;text-align:center">

<svg viewBox="0 0 220 220" role="img" aria-label="Harmonic coverage: chords entering from every side of the disk accumulate until the whole surface is reached, then the cycle repeats." xmlns="http://www.w3.org/2000/svg" style="max-width:340px;width:100%;height:auto">
  <style>
    .hc-spin{transform-origin:110px 110px;animation:hcspin 48s linear infinite}
    @keyframes hcfade{0%{opacity:0}35%{opacity:0.9}70%{opacity:0.9}100%{opacity:0}}
    @keyframes hcspin{to{transform:rotate(-360deg)}}
    @media(prefers-reduced-motion:reduce){.hc-spin *{opacity:0.7!important;animation:none!important}.hc-spin{animation:none}}
  </style>
  <circle cx="110" cy="110" r="88" fill="none" stroke="var(--vp-c-divider,#8884)" stroke-width="1"/>
  <g class="hc-spin">
    <line x1="110" y1="22" x2="166.57" y2="177.41" stroke="hsl(0 70% 58%)" stroke-width="1.3" opacity="0" style="animation:hcfade 5s ease-in-out 0s infinite"/>
    <line x1="132.78" y1="25" x2="147.19" y2="189.76" stroke="hsl(15 70% 58%)" stroke-width="1.3" opacity="0" style="animation:hcfade 5s ease-in-out 0.208s infinite"/>
    <line x1="154" y1="33.79" x2="125.28" y2="196.66" stroke="hsl(30 70% 58%)" stroke-width="1.3" opacity="0" style="animation:hcfade 5s ease-in-out 0.417s infinite"/>
    <line x1="172.23" y1="47.77" x2="102.33" y2="197.67" stroke="hsl(45 70% 58%)" stroke-width="1.3" opacity="0" style="animation:hcfade 5s ease-in-out 0.625s infinite"/>
    <line x1="186.21" y1="66" x2="79.9" y2="192.69" stroke="hsl(60 70% 58%)" stroke-width="1.3" opacity="0" style="animation:hcfade 5s ease-in-out 0.833s infinite"/>
    <line x1="195" y1="87.22" x2="59.53" y2="182.09" stroke="hsl(75 70% 58%)" stroke-width="1.3" opacity="0" style="animation:hcfade 5s ease-in-out 1.042s infinite"/>
    <line x1="198" y1="110" x2="42.59" y2="166.57" stroke="hsl(90 70% 58%)" stroke-width="1.3" opacity="0" style="animation:hcfade 5s ease-in-out 1.25s infinite"/>
    <line x1="195" y1="132.78" x2="30.24" y2="147.19" stroke="hsl(105 70% 58%)" stroke-width="1.3" opacity="0" style="animation:hcfade 5s ease-in-out 1.458s infinite"/>
    <line x1="186.21" y1="154" x2="23.34" y2="125.28" stroke="hsl(120 70% 58%)" stroke-width="1.3" opacity="0" style="animation:hcfade 5s ease-in-out 1.667s infinite"/>
    <line x1="172.23" y1="172.23" x2="22.33" y2="102.33" stroke="hsl(135 70% 58%)" stroke-width="1.3" opacity="0" style="animation:hcfade 5s ease-in-out 1.875s infinite"/>
    <line x1="154" y1="186.21" x2="27.31" y2="79.9" stroke="hsl(150 70% 58%)" stroke-width="1.3" opacity="0" style="animation:hcfade 5s ease-in-out 2.083s infinite"/>
    <line x1="132.78" y1="195" x2="37.91" y2="59.53" stroke="hsl(165 70% 58%)" stroke-width="1.3" opacity="0" style="animation:hcfade 5s ease-in-out 2.292s infinite"/>
    <line x1="110" y1="198" x2="53.43" y2="42.59" stroke="hsl(180 70% 58%)" stroke-width="1.3" opacity="0" style="animation:hcfade 5s ease-in-out 2.5s infinite"/>
    <line x1="87.22" y1="195" x2="72.81" y2="30.24" stroke="hsl(195 70% 58%)" stroke-width="1.3" opacity="0" style="animation:hcfade 5s ease-in-out 2.708s infinite"/>
    <line x1="66" y1="186.21" x2="94.72" y2="23.34" stroke="hsl(210 70% 58%)" stroke-width="1.3" opacity="0" style="animation:hcfade 5s ease-in-out 2.917s infinite"/>
    <line x1="47.77" y1="172.23" x2="117.67" y2="22.33" stroke="hsl(225 70% 58%)" stroke-width="1.3" opacity="0" style="animation:hcfade 5s ease-in-out 3.125s infinite"/>
    <line x1="33.79" y1="154" x2="140.1" y2="27.31" stroke="hsl(240 70% 58%)" stroke-width="1.3" opacity="0" style="animation:hcfade 5s ease-in-out 3.333s infinite"/>
    <line x1="25" y1="132.78" x2="160.47" y2="37.91" stroke="hsl(255 70% 58%)" stroke-width="1.3" opacity="0" style="animation:hcfade 5s ease-in-out 3.542s infinite"/>
    <line x1="22" y1="110" x2="177.41" y2="53.43" stroke="hsl(270 70% 58%)" stroke-width="1.3" opacity="0" style="animation:hcfade 5s ease-in-out 3.75s infinite"/>
    <line x1="25" y1="87.22" x2="189.76" y2="72.81" stroke="hsl(285 70% 58%)" stroke-width="1.3" opacity="0" style="animation:hcfade 5s ease-in-out 3.958s infinite"/>
    <line x1="33.79" y1="66" x2="196.66" y2="94.72" stroke="hsl(300 70% 58%)" stroke-width="1.3" opacity="0" style="animation:hcfade 5s ease-in-out 4.167s infinite"/>
    <line x1="47.77" y1="47.77" x2="197.67" y2="117.67" stroke="hsl(315 70% 58%)" stroke-width="1.3" opacity="0" style="animation:hcfade 5s ease-in-out 4.375s infinite"/>
    <line x1="66" y1="33.79" x2="192.69" y2="140.1" stroke="hsl(330 70% 58%)" stroke-width="1.3" opacity="0" style="animation:hcfade 5s ease-in-out 4.583s infinite"/>
    <line x1="87.22" y1="25" x2="182.09" y2="160.47" stroke="hsl(345 70% 58%)" stroke-width="1.3" opacity="0" style="animation:hcfade 5s ease-in-out 4.792s infinite"/>
  </g>
</svg>

<figcaption style="font-size:.85em;opacity:.75;max-width:340px">Harmonic coverage. Chords enter from every side and accumulate until the whole surface is reached — then the cycle repeats. Coverage is a measurement, and it is complete over this disk.</figcaption>
</figure>

</div>

## Moving geometry covers every superposition — bounded, and measured

A permutation has one defining property: it lands on every element of its domain, exactly
once, and returns. The doubling map on the units of ℤ/9 is such a permutation, so its
trajectory **covers every residue it can reach** — no point left out, from every side, and it
closes. That is the honest content of "covers every superposition": a moving geometry whose
orbit is a permutation attains **complete coverage of its domain**, and completeness is a
property you can *measure*, not merely assert. This repository already drives its own
coverage — pages, imports, gates — to 100% and refuses regressions.

But coverage is bounded by its domain. Complete coverage of the ℤ/9 ring is **not** a proof of
any Clay problem: reaching every point of a surface is not regularity for Navier–Stokes, not a
mass gap for Yang–Mills, not a zero-line for Riemann. The step from *covered* to *solved* is
exactly the step the gate refuses. Complete, yes; solved, no.

## The cryptographic boundary

The cross-uuid mechanism is **integrity**, not confidentiality. A content-address (uuid) fixes
*what* a thing is and *who co-signed* it; that is provenance and tamper-evidence. It is **not**
encryption, it is **not** quantum, and it **breaks no cryptosystem and replaces none**. Hashing
is not encryption; integrity is not confidentiality. "Cross-uuid signed approval" means two
parties' addresses must agree before a change stands — a mutual-integrity rule — and nothing in
it defeats, factors, or supersedes any cipher. Any stronger reading drains at the gate above.

## The one state, two questions

The framework computes toward wholeness — every gate green, coverage complete — and in that
sense reads 7 / 7 **as a method that ran to completion**. It simultaneously entails 0 / 7 on
the Clay problems, because completeness of the method is not solution of the conjectures. These
are two different questions held in one honest state; collapsing them is the overclaim, and the
gate drains it.

**On burden.** The floor is stated in exact, reproducible algebra and confirmed by measurement.
The contrary readings — a settled Clay conjecture, a beaten physical limit, a discarded cipher —
are **not made here**, and to state one would carry that identical burden of exact, reproducible
algebra, so far unmet. Until it is met, the floor stands, for Clay and for everything: measured,
not asserted.
