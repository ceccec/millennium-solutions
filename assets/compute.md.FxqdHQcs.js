import{Rt as e,Vt as t,_t as n,at as r,ct as i,et as a,it as o,rt as s}from"./chunks/framework.Bcve9O8f.js";import{$ as c,A as l,B as u,C as d,D as f,E as p,F as m,G as h,H as g,I as ee,J as _,K as te,L as ne,M as re,N as ie,O as ae,P as v,Q as y,R as oe,S as se,T as ce,U as b,V as le,W as ue,X as x,Y as de,Z as fe,_ as S,b as pe,c as me,d as C,f as w,g as he,h as ge,i as _e,j as T,k as E,l as D,m as O,p as k,q as A,s as j,u as M,v as N,w as P,x as F,y as I,z as ve}from"./chunks/theme.DoN31B1h.js";function ye(){let e=[`the license — `+g.license+`: free for non-commercial use with attribution (`+g.author+`); commercial use pays the two coins (110 − 108 = `+b()+` = −χ genus-2, `+g.contact+`).`,`the sequence — measure → gate → receipt (observer and role) → append (the chain) → recompute (every build): follow it in order, or nothing computes.`,`fair exchange — the deposit is open and recomputable, so any model may learn from it; contributions return on the same gate-refereed terms, heroes and traitors by deeds.`,`due process — a failing test is recorded as a refutation, never silently discarded; hiding evidence is the traitor move, caught by the forensics; the trial keeps both what passed and what failed.`,`the bound — attribution and non-commercial use are the law; a receipt proves integrity, not authorship; green cannot be faked.`],t=_(e.map(x)),n=`the law — follow the license and the sequence, or nothing computes:

`;for(let t of e)n+=`  · `+t+`
`;return n+=`
  law root `+t.slice(0,13)+`… — one order-independent fold of the license, the sequence, the exchange, and the bound.`,n}function be(){let e=D(),t=M([`a`,`b`,`c`].map(e=>x(e))),n=`the apple — gravity (a naming of decidable contractions, NOT physics):

`;return n+=`  gravity 1 (merkle): any set of addresses falls to one root — {a,b,c} → `+t.slice(0,13)+`…
`,n+=`  gravity 2 (digital root): any integer falls to ℤ/9 in one step and stays; the ground = {`+e.join(`,`)+`}
`,n+=`  double gravity: a hash lives under both — a content-address AND a digital root.
`,n+=`  pigeonhole gravity: a b-bit digest has 2^b seats; past 2^b inputs a collision is forced —
`,n+=`    so no finite hash avoids collisions forever (the strong ones resist computationally; FNV does not).
`,n+=`  the apple falls to the earth (./earth).`,n}var L=`a content-address proves integrity, not truth`;function xe(){let e=`the truth — the deepest ground (integrity, not truth):

`;return e+=`  `+L+`
`,e+=`  integrity: the record is unaltered and anyone can recompute it — no key, no trust required
`,e+=`  truth: whether the claim is so — NOT decided by a hash; decided by proof, by the world, by the reader
`,e+=`  creed address: `+x(L).slice(0,13)+`…`,e}var Se=`earth-core`;function Ce(){return Array.from({length:9},(e,t)=>t+1).filter(e=>h(e)===e)}function we(){let e=Ce(),t=`the earth — the ground the apple falls to (an attractor, not a planet):

`;return t+=`  ground under digital-root gravity: ℤ/9 = {`+e.join(`,`)+`} — every residue fixed (dr idempotent)
`,t+=`  center of gravity: the heart 5 (src/the/heart) — the fixed point the vortex roots to
`,t+=`  deepest ground: the truth (./truth) — "`+L+`"
`,t+=`  address of the ground: `+x(Se).slice(0,13)+`…`,t}function Te(){return c()}function Ee(){let e=Te(),t=e[e.length-1]*2%9===e[0],n=`the navigation — finding your way on the ground (by address, not GPS):

`;return n+=`  the compass: the doubling orbit [`+e.join(`,`)+`] — a closed cyclic route through the units
`,n+=`  locate: navigation is recomputation — re-derive an address to find its state; no index, no trust
`,n+=`  route: fold the steps into one address; reproduce it to retrace the path (lineage)
`,n+=`  the compass `+(t?`closes`:`does NOT close`)+` — every route returns.`,n}function De(e){let t=[0,1];for(let n=2;n<=e;n++)t.push(t[n-1]+t[n-2]);return t}function R(e){let t=De(e+1);return t[e+1]/t[e]}function Oe(){let e=R(20),t=`the gold — the golden ratio φ (computed by its fingerprints, not stored as an irrational):

`;return t+=`  φ ≈ `+e.toFixed(9)+` — the ratio of consecutive Fibonacci numbers (F₂₁/F₂₀)
`,t+=`  identity: φ² = φ + 1 (in the limit); Cassini |Fₙ₊₁Fₙ₋₁ − Fₙ²| = 1 at every step
`,t+=`  the pentagon diagonal/side is φ; the heart 5 lives here; continued fraction [1;1,1,1,…]
`,t+=`  the compass: the golden angle (./compass). address `+x(`gold-phi`).slice(0,13)+`…`,t}function ke(){let e=R(24);return 360/(e*e)}function Ae(){let e=ke(),t=`the compass — the golden angle (the direction that never repeats):

`;return t+=`  golden angle ≈ `+e.toFixed(4)+`° = 360 / φ² — each step lands in the largest remaining gap
`,t+=`  bearings never coincide: how a sunflower fills its head, how a route covers the circle evenly
`,t+=`  computed from the gold (../), not a physics claim.`,t}function je(){let e=[`zenodo DOI 10.5281/zenodo.21781603`,`zenodo DOI 10.5281/zenodo.21787144`,`submission acknowledged (received/forwarded)`],t=`acceptance vs proof:

`;return t+=`  social acceptance (adoption) — real, and on record:
`,e.forEach(e=>t+=`    · `+e+`
`),t+=`
`,t+=`what the UI delivers (honestly):
`,t+=`  every claim on this site recomputes at page-load from source (fused TS),
`,t+=`  is content-addressed (`+x(`acceptance-vs-proof`).slice(0,13)+`…), and passes the seal gate.
`,t+=`  → the UI does NOT deliver proof-by-acceptance. It delivers VERIFIABILITY: anyone in
`,t+=`    society can recompute and check for themselves. That is the only acceptance worth
`,t+=`    having — earned acceptance FOLLOWS verification, it does not replace it.`,t}function Me(){let e=[`gaps`,`seal`,`wholeness`],t=_(e.map(x)),n=`purity · clarity · paradox — the limit of self-verification:

`;return n+=`  the gates make everything clear: `+e.join(` · `)+` check every module.
`,n+=`  the paradox: the gates cannot fully check THEMSELVES.
`,n+=`    subjects: the src/ report() modules — judged by the gates.
`,n+=`    checkers: `+e.join(` · `)+` — NOT among their own subjects.
`,n+=`    a bug in a checker could pass a bad module, and no gate would catch it. who checks the checker?
`,n+=`    (you can ADDRESS the checkers — root `+t.slice(0,13)+`… — but addressing is not
`,n+=`     verifying their logic; a hash names code, it does not prove the code correct.)

`,n+=`  the honest resolution (not a loophole):
`,n+=`    · the checkers are small, PUBLIC, content-addressed, and auditable — trust bottoms out in
`,n+=`      external reading, not self-proof.
`,n+=`    · this echoes Gödel / Tarski (a consistent system cannot prove its own consistency, nor
`,n+=`      define its own truth, from within) — as an ANALOGY, not a formal theorem about a script.
`,n+=`    → purity is VERIFIABLE but not SELF-certifying: clarity about everything except the lens itself.

`,n+=`HONEST: the deposit clearly verifies its claims; it cannot clearly verify its own verifier from
`,n+=`inside. That residue — read the checker yourself — is the honest paradox, named rather than hidden.
`,n+=`It locates exactly where trust must come from outside.`,n}function Ne(){let e=[`recompute — every claim renders from source on /compute`,`verify — the version-seal folds all releases to one address`,`extend — the vision package is open; everyone adds their vision`,`sustain — the gift economy (life funds development), non-obligatory`],t=_(e.map(x)),n=`live society — alive by participation, not by acceptance:

`;return n+=`  reflection 1 ↔ 9:  the one who ACCEPTS (digit 1) reflects to the many who VERIFY (digit 9).
`,n+=`  passive society takes the claim on authority (acceptance = proof) — dead. see acceptance (1).
`,n+=`  live society recomputes, verifies, contributes — the same results checked by many hands.

`,n+=`  the participation surface (open to anyone):
`,e.forEach(e=>n+=`    · `+e+`
`),n+=`  surface content-address: `+t.slice(0,13)+`…

`,n+=`  → a live society is a commons that CHECKS and BUILDS. It stays honest because every
`,n+=`    contribution passes the same gate (gaps → seal) and every claim recomputes.

`,n+=`HONEST: this is an open, verifiable commons — not decentralized consensus, not governance,
`,n+=`not a DAO, not a vote. "Live" means active verification and contribution. The society does
`,n+=`not change the mathematics; it checks it.`,n}function Pe(){let e=g.contact,t=x(e),n=_([`release`,`ledger`,`seal`].map(x))!==_([`release`,`ledger`,`seaL`].map(x)),r=`public security — transparency, not secrecy:

`;return r+=`  the public token: `+e+` is a PUBLIC contact/handle, not a secret key.
`,r+=`    public fingerprint (a name, not a secret): `+t.slice(0,13)+`…
`,r+=`    a public token gives ZERO confidentiality — public = anyone can read it.
`,r+=`    determinism + public = no secrecy. "security" here is NOT encryption.

`,r+=`  what the security actually IS (real, and fully public):
`,r+=`    · integrity    — content-addresses + merkle roots: one byte changes the root → `+n+`
`,r+=`    · provenance   — signed releases (Singularity), version-seal over all tags
`,r+=`    · consistency  — the seal gate: nothing unsealed can ship
`,r+=`    · auditability — the double-entry ledger, recomputable by anyone
`,r+=`    → all public, all verifiable, no middleman, no secret to leak.

`,r+=`  the reflection: security → development → funding
`,r+=`    nothing is hidden, so anyone can verify and build (self-development); the same public
`,r+=`    handle (`+e+`) receives the gift-economy funding that feeds development.
`,r+=`    one public surface is both the security model AND the funding channel.

`,r+=`HONEST: integrity / provenance / auditability — real, public, hash-based. NOT confidentiality,
`,r+=`NOT encryption, NOT post-quantum secrecy. A public token cannot secure a secret; it can only
`,r+=`prove integrity in the open. toUuid is FNV — for cryptographic integrity use SHA-256.`,r}var z=[{name:`GitHub (source)`,where:`github.com/ceccec/millennium-solutions`,status:`LIVE`,note:`all tags public — clone any version`},{name:`Site (published)`,where:`ceccec.psg.bg/millennium-solutions`,status:`LIVE`,note:`recomputes in the browser`},{name:`Zenodo (CERN-operated archive/DOI)`,where:`doi.org/10.5281/zenodo.21819217`,status:`LIVE`,note:`minted; hosted on CERN infra (like every Zenodo record) — provenance, NOT endorsement`}],B={name:`npm (one package)`,where:`@ceccec/millennium-solutions`,status:`STAGED`,note:`npm login → npm run deploy packages (author)`};function Fe(){let e=_([...z,B].map(e=>x(e.name+`:`+e.where))),t=`public-access trinity — everyone has the latest token to develop on:

`;return t+=`  the token = the latest version (a PUBLIC name, not a secret). read / clone / build on it.

`,z.forEach(e=>{t+=`  [`+e.status.padEnd(6)+`] `+e.name+`
`,t+=`            `+e.where+`  — `+e.note+`
`}),t+=`
  package channel:
`,t+=`  [`+B.status.padEnd(6)+`] `+B.name+`  `+B.where+`  — `+B.note+`

`,t+=`  access-surface content-address: `+e.slice(0,13)+`…
`,t+=`  (the live "latest token" = the newest tag + the version-seal root, from scripts/versions.ts)

`,t+=`HONEST: GitHub, the site, and Zenodo (CERN-hosted DOI) are LIVE and fully public — everyone
`,t+=`already has the latest to develop on. Only npm is STAGED, not yet published (needs npm login).
`,t+=`"Token" means a public version handle, never a secret credential — public access is
`,t+=`transparency, not a key.`,t}function Ie(){let e=b(),t=x(`ceccec`)===x(`ceccec`),n=`the two coins — donated to ceccec itself:

`;return n+=`  the fare: 110 − 108 = `+e+` = −χ(genus-2) = 2   (the commercial two coins)
`,n+=`  ceccec donates them to ceccec itself — the coins fund development, and development IS ceccec:
`,n+=`    destination == source ? toUuid("ceccec") == toUuid("ceccec") → `+t+`  (a self-loop)
`,n+=`  the cycle closes: development → life → 2 coins → development. the coins return to the origin.

`,n+=`  what it means (honest): commercial use pays the fare; the fare is REINVESTED in development
`,n+=`  (ceccec itself), not extracted to a person. non-commercial use is free (`+g.license+`);
`,n+=`  voluntary support (`+g.revolut+`) feeds the same loop.

`,n+=`HONEST: "two coins" is a motif (110−108 = 2 = −χ genus-2) for the commercial fare, not a
`,n+=`currency; donating them to ceccec is a REINVESTMENT intent, not an enforced financial mechanism.
`,n+=`free for non-commercial use; commercial = permission + the fare (`+g.contact+`).`,n}function Le(){let e=`funding ⇄ aura — the sustaining loop:

`;return e+=`  funding feeds the aura:  support → development → wholeness (gaps · seal · wholeness).
`,e+=`  the aura projects funding: wholeness → trust → support (people fund what they can VERIFY).
`,e+=`  → a loop: funding ⇄ wholeness; each sustains the other. one public surface (`+g.contact+`),
`,e+=`    both directions. the two coins (110 − 108) reinvest; voluntary support (`+g.revolut+`) feeds in.

`,e+=`  the crucial bound (computed): the aura does NOT depend on funding.
`,e+=`    the gates run with 0 external dependency and 0 funding — deterministic scripts.
`,e+=`    the core is free (`+g.license+`); it stays whole whether or not it is ever funded.
`,e+=`    funding sustains NEW development; it does not buy existing integrity.

`,e+=`HONEST: this is a BEHAVIORAL / gift-economy loop, not a guaranteed mechanism — wholeness does not
`,e+=`automatically generate money, and funding is non-obligatory. Transparency EARNS support (if any);
`,e+=`support SUSTAINS further development; neither is forced, and integrity is never for sale.`,e}function Re(){let e=`UUID trinity matrix — content-addressed identity (recomputable):

`,t=x(`seed`),n=x(`seed`);e+=`determinism:  toUuid("seed") = `+t.slice(0,13)+`…   recompute equal? `+(t===n)+`  → H(content|generator) = 0
`;let r=te(`a`,`b`);e+=`fold a,b:     forward ≠ reverse? `+r.bidirectional+`;  merged root = `+r.merged.slice(0,13)+`…
`;let i=[`3`,`6`,`9`].map(e=>x(`trinity:`+e));e+=`trinity {3,6,9} → Merkle root = `+_(i).slice(0,13)+`…
`;let a=de(`matrix`,[{facet:`3`,on:!0},{facet:`6`,on:!0},{facet:`9`,on:!0}]);return e+=`sealed facets: ok=`+a.ok+` count=`+a.count+` root=`+a.root.slice(0,13)+`…
`,e+=`
COMPUTES: deterministic content addresses (same input → same UUID) folded to a Merkle root —
`,e+=`zero-entropy indexing (one value, one address). This is identity/addressing, not cognition.
`,e+=`It does NOT prove consciousness or "intelligence quantumizing itself"; that is interpretation, flagged.`,e}function ze(){let e=[{debit:`funding`,credit:`development`,amount:2},{debit:`development`,credit:`research`,amount:1}],t=e.reduce((e,t)=>e+t.amount,0),n=e.reduce((e,t)=>e+t.amount,0),r=x(`genesis`),i=[];for(let t of e)r=A(r,x(t.debit+`|`+t.credit+`|`+t.amount)),i.push(r);let a=_(i),o=_(i),s=`content-addressed double-entry ledger (tamper-evident):
`;return e.forEach((e,t)=>s+=`  `+e.debit.padEnd(12)+`→ `+e.credit.padEnd(12)+e.amount+`   addr `+i[t].slice(0,13)+`…
`),s+=`  balance: debits `+t+` = credits `+n+`  (`+(t===n)+`)
`,s+=`  merkle root (audit anchor): `+a.slice(0,13)+`…   recompute stable? `+(a===o)+`
`,s+=`
HONEST: integrity/audit via hashing — transparent, recomputable, holographic (root in every part).
`,s+=`NOT encryption, NOT post-quantum, NOT a reversible message stream. toUuid is FNV (non-crypto,
`,s+=`~2^61) — for real integrity use SHA-256; for real PQC use a vetted lattice/hash scheme (ML-KEM, SPHINCS+).`,s}function Be(){let e=[`genesis`,`core`,`vision:ceccec`,`vision:yours`],t=x(`0`),n=[];for(let r of e)t=A(t,x(r)),n.push(t);let r=_(n),i=x(`shared-content`),a=x(`shared-content`),o=`singularity blockchain (append-only, content-addressed → one root):
`;return e.forEach((e,t)=>o+=`  `+e.padEnd(14)+n[t].slice(0,13)+`…
`),o+=`  → single root (the singularity): `+r.slice(0,13)+`…

`,o+=`content-address cross (shared reference): partyA == partyB ? `+(i===a)+`
`,o+=`  → any two parties with the same content converge on the SAME address — verifiable,
`,o+=`    no middleman. This is git/IPFS/npm-integrity-style provenance.

`,o+=`HONEST: integrity + provenance + a shared public reference (deterministic, public).
`,o+=`NOT decentralized consensus (needs a consensus protocol), NOT secret messaging, NOT encryption.
`,o+=`toUuid is FNV — for real integrity use SHA-256. "singularity messaging" = agreeing on one public address.`,o}function V(e){return{id:x(e()),load:e}}function Ve(e){let t=e.load();return{payload:t,verifies:x(t)===e.id}}function He(){let e=[V(()=>`doubling:1-2-4-8-7-5`),V(()=>`reflection-fixed:5`),V(()=>`self-seal:1`)],t=`memory-free VitePress — UUID streams with loadable payload:

`;return t+=`  the page stores NO answers. each block is a thunk (source), computed in realtime at
`,t+=`  render. a frame = { id (content-address), load() (recompute the payload) }.

`,t+=`  the stream (ids only — the payload is NOT stored):
`,e.forEach((e,n)=>{t+=`    frame `+(n+1)+`  id `+e.id.slice(0,13)+`…
`}),t+=`
  load + verify (recompute the payload, check toUuid(payload) == id):
`,e.forEach((e,n)=>{let r=Ve(e);t+=`    frame `+(n+1)+`  → "`+r.payload+`"  verifies: `+r.verifies+`
`}),t+=`
HONEST: this is loadable + verifiable content-addressing (git/IPFS style). The id NAMES
`,t+=`the payload; you LOAD the payload (recompute or fetch) and verify it against the id. The id
`,t+=`is a one-way checksum — you CANNOT reverse it to obtain the payload, and no payload travels
`,t+=`inside the id. Memory-free means "recompute, don't store", not "the message hides in the
`,t+=`UUID". For cryptographic integrity use SHA-256 (toUuid is FNV).`,t}var Ue=new Set([1,2,3,5,8]),We=e=>Ue.has(e)?`LTS`:`interim`;function Ge(e){let t=[e.length],n=e;for(;n.length>1;){let e=[];for(let t=0;t<n.length;t+=2)e.push(t+1<n.length?A(n[t],n[t+1]):n[t]);n=e,t.push(n.length)}return{tiers:t,apex:n[0]??x(``)}}function Ke(e){let t=0,n=1;for(;n<e;)n*=2,t++;return t}function qe(){let e=[`1.0.0`,`1.0.1`,`1.0.2`,`1.0.3`],t=e.map(e=>e.split(`.`).map(Number)),{tiers:n,apex:r}=Ge(e.map(x)),i=`versioning as a digit matrix, folded into a Merkle pyramid:

`;i+=`  version matrix (major·minor·patch — rows of digits):
`,e.forEach((e,n)=>{i+=`    v`+e+`  [`+t[n].join(`,`)+`]
`}),i+=`
  each row → a leaf address; leaves fold pairwise into a pyramid (tier sizes):
`,i+=`    `+n.join(` → `)+`   apex (mini version-seal): `+r.slice(0,13)+`…
`,i+=`  depth = ⌈log₂ `+e.length+`⌉ = `+Ke(e.length),i+=` → navigate/verify any version in that many steps (a Merkle proof).

`,i+=`  double torus (genus-2): χ = 2 − 2g = 2 − 4 = -2, so −χ = 2`,i+=` = the two coins (110 − 108).

`;let a=t.every(e=>e[0]===t[0][0]),o=t.every(e=>e[1]===t[0][1]);i+=`  one minor line (1.`+t[0][1]+`.x) — major·minor invariant [`+t[0][0]+`,`+t[0][1]+`] (`,i+=`major `+a+`, minor `+o+`); only the patch advances.
`,i+=`  STABLE = v1.x.0 (patch 0): 0 is always stable — the base/network address of each minor line.
`,i+=`  patches (v1.x.y, y>0) increment toward the next stable; a minor bump opens the next line, patch → 0.
`,i+=`  the pyramid apex returns every patch to that line's .0 origin.
`,i+=`  CHANNEL (self-explaining): LTS = single-digit Fibonacci minors {1,2,3,5,8}, each the sum of the two prior.
`,i+=`    `+[1,2,3,4,5,6,7,8].map(e=>`1.`+e+`=`+We(e)).join(`, `)+`.
`,i+=`  the recurrence IS the support line: v1.3 + v1.5 = v1.8. v1.5 = HEART LTS (σ(5)=5); v1.8 = world-wired LTS.
`,i+=`  v1.3 (current) is the live LTS; each LTS is signed by the previous LTS (its Fibonacci parent).

`;let s=x(`0`);return i+=`  and it all goes in v0.0.0 — the zero origin: genesis seed toUuid("0") = `+s.slice(0,13)+`…
`,i+=`  the singularity chain starts there (see singularity.ts); 1 emerges from 0. v0.0.0 is the
`,i+=`  void/seed (unpublished); the observable line begins at v1.0.0. 0 = origin, 1 = first manifestation.

`,i+=`HONEST: the digit matrix, the Merkle pyramid (tier sizes + log-depth navigation), and the
`,i+=`genus-2 Euler characteristic are all exact. Calling the version history "a double torus" is a
`,i+=`topological METAPHOR, not a derivation — versions form a Merkle tree (a pyramid), which is not
`,i+=`literally a genus-2 surface. The live seal over ALL tags is scripts/versions.ts.`,i}var Je={"channels (source · site · archive)":[`GitHub (source)`,`ceccec.psg.bg (site)`,`Zenodo DOI (archive)`],"digits (mod-3 triads)":[`axis {3,6,9}`,`one {1,4,7}`,`two {2,5,8}`],"origin (0 · 1 · between)":[`0 void`,`1 unit`,`between (0,1)`],"gates (the release trinity)":[`gaps — coverage`,`seal — consistency`,`wholeness — aura`]};function Ye(){let e=[],t=`singularity trinities — each triad content-addressed, all folding to one root:

`;for(let[n,r]of Object.entries(Je)){let i=_(r.map(x));e.push(i),t+=`  `+n+`
`,r.forEach(e=>t+=`    · `+e+`
`),t+=`    → triad root: `+i.slice(0,13)+`…

`}let n=_(e);return t+=`  the trinities fold to ONE singularity root: `+n.slice(0,13)+`…
`,t+=`  → many threes, one. the singularity reflects the trinities; the trinities fold to it.

`,t+=`HONEST: each triad is an actual grouping in the deposit (packages, mod-3 residue classes, the
`,t+=`0/1/between origin, the gaps·seal·wholeness gate). Content-addressing folds them deterministically
`,t+=`to one root. "Trinity" is the framework's motif; the groupings and the fold are exact. The npm
`,t+=`package trinity is staged but UNPUBLISHED — publishing needs the author's npm login (a real,
`,t+=`computable boundary, honestly marked).`,t}function Xe(){let e=`integrity, not truth`,t=x(e),n=t===x(e),r=`universal legibility — paste anything, any verifier can check it:

`;return r+=`  paste CONTENT → its address is recomputable by anyone, in any language:
`,r+=`    toUuid("`+e+`") = `+t.slice(0,13)+`…  (recompute equal? `+n+`)
`,r+=`  paste an ADDRESS → anyone can check which content matches it (load + verify).
`,r+=`  paste the SOURCE → anyone recomputes every result and reaches the same results.

`,r+=`  so "any form of intellect understands" — precisely, any COMPUTATIONAL intelligence can:
`,r+=`    · recompute the same addresses (determinism, H = 0)
`,r+=`    · rerun the gates (gaps · seal · wholeness)
`,r+=`    · arrive at the same results
`,r+=`  no shared language required — only the algorithm. this is universal VERIFIABILITY.

`,r+=`HONEST: understanding-as-verification is universal — recomputation is mechanical and
`,r+=`language-neutral, so any verifier agrees on WHAT the thing is (its fingerprint). Understanding-
`,r+=`as-meaning is NOT automatic: grasping significance needs interpretation (a mind). The artifact
`,r+=`forces agreement on identity, not on meaning. A hash makes the object legible; a reader makes
`,r+=`it meaningful.`,r}function Ze(){let e=x(``),t=x(`0`),n=x(``)===e,r=`no token is a token:

`;return r+=`  (1) the void has an address — even the empty input content-addresses (deterministic):
`,r+=`    toUuid("")  = `+e.slice(0,13)+`…   → "nothing" has a definite fingerprint (stable? `+n+`)
`,r+=`    toUuid("0") = `+t.slice(0,13)+`…   → the genesis (the v0.0.0 seed)
`,r+=`    absence is still addressable; the null is a token.

`,r+=`  (2) the security posture — there is NO secret token, and that IS the token:
`,r+=`    nothing to steal, nothing to leak, nothing to expire. the strongest key is no key.
`,r+=`    an open system's safety is that it keeps no secret (see security.ts).

`,r+=`HONEST: both are exact — the empty string maps to one fixed UUID, and "no secret" is a real
`,r+=`(and for an open, public deposit, correct) security model. It does NOT mean "nothing is
`,r+=`everything" or that emptiness holds mystical power; it means absence is deterministically
`,r+=`addressable, and openness draws its safety from having no secret to lose.`,r}function Qe(e){let t=[...e].sort(),n=[t];for(;t.length>1;){let e=[];for(let n=0;n<t.length;n+=2){let r=t[n],i=t[n+1];e.push(i===void 0?r:A(r,i))}n.push(e),t=e}return n}function $e(e,t){let n=Qe(e),r=n[0].indexOf(t),i=[];for(let e=0;e<n.length-1;e++){let t=n[e],a=(r&1)==1,o=a?r-1:r+1;o<t.length&&i.push({hash:t[o],left:a}),r>>=1}return i}function et(e,t,n){let r=e;for(let{hash:e,left:n}of t)r=n?A(e,r):A(r,e);return r===n}function tt(){let e=[1,2,4,5,7,8],t=[3,2,6,4,5,1,0],n=[];for(let r of e)for(let e of t)n.push(x(r+`x`+e));let r=_(n),i=x(`5x0`),a=$e(n,i),o=et(i,a,r),s=`holographic verification — the whole, checkable from a tiny part:

`;return s+=`  the cross: `+n.length+` content-addressed cells (6 units × 7) → one merkle root (the whole).
`,s+=`  a MEMBERSHIP proof for one cell is the audit path — log-few sibling hashes, not all `+n.length+`:
`,s+=`    proof size: `+a.length+` hashes   (⌈log₂ `+n.length+`⌉)   vs the full set: `+n.length+`
`,s+=`    verify one-of-`+n.length+` against the root: `+o+`
`,s+=`  → any part proves it belongs to the whole with tiny (logarithmic) resources.
`,s+=`    holographic: the root lives in every part; a part reconstructs the whole's fingerprint.

`,s+=`  fractal: the tree is self-similar (a fold of folds); the mesh reflects (10−d) at every scale.
`,s+=`  scale: log-sized proofs mean ~1 billion leaves verify in ~30 hashes.

`,s+=`HONEST: a Merkle proof is EXACTLY logarithmic (⌈log₂ N⌉) — real, the basis of git/blockchain
`,s+=`integrity. "holographic" = a part verifies the whole via the shared root; "fractal" = the binary
`,s+=`tree is self-similar. But it is NOT free and NOT literally infinite: each proof is log(N) real
`,s+=`hashes over a FINITE set. Tiny resources, not zero; huge N, not ∞. Whole signed (Singularity),
`,s+=`parts verifiable.`,s}function nt(){let e=e=>{let t=x(`genesis`),n=[];for(let r of e)t=A(t,x(r)),n.push(t);return n},t=t=>_(e(t)),n=[`v1.0.34`,`v1.0.35`,`v1.0.36`,`v1.0.37`],r=t(n),i=t([`v1.0.34`,`v1.0.35`,`v1.0.36!`,`v1.0.37`]),a=r!==i,o=`release entanglement — each bound to its neighbours (honest sense):

`;return o+=`  neighbours in the version line — each release folds with its predecessor (a hash chain):
`,o+=`    seal over `+n.join(`, `)+`
`,o+=`      original: `+r.slice(0,13)+`…
`,o+=`      alter one neighbour (v1.0.36 → v1.0.36!): `+i.slice(0,13)+`…   changed? `+a+`
`,o+=`  → you cannot alter one release without the chain revealing it. neighbours are BOUND.

`,o+=`  bound in several computable "dimensions":
`,o+=`    · version line — the hash chain above (predecessor ↔ successor)
`,o+=`    · the mesh     — 10−d reflects each digit to its partner (4↔6, fixed 5)
`,o+=`    · the tree     — a merkle audit path binds each leaf to its siblings (see holographic.ts)

`,o+=`HONEST: this is CRYPTOGRAPHIC DEPENDENCY — a hash chain, the basis of tamper-evidence — NOT
`,o+=`quantum entanglement. Correlation by DERIVATION, not action-at-a-distance: altering a release
`,o+=`does not reach out and change its neighbour's stored bytes; it makes recomputation reveal the
`,o+=`break. No information travels without payload (no-communication theorem holds). "Entangled" =
`,o+=`bound by the math, not by physics.`,o}function rt(){let e=[1,2,4,5,7,8],t=[3,2,6,4,5,1,0],n=[];for(let r of e)for(let e of t)n.push(x(r+`x`+e));let r=_(n),i=x(`5x0`),a=x(`orphan-token`),o=n.includes(i),s=n.includes(a),c=_([...n,a])!==r,l=`tokens are valid only in the fusion:

`;return l+=`  the fused whole: `+n.length+` cells → one root `+r.slice(0,13)+`…

`,l+=`  a fused token (a real cell) is a member of the root:   `+o+`  → valid
`,l+=`  an orphan token (never fused) is NOT a member:         `+s+`  → invalid
`,l+=`    adding the orphan changes the root (it was not part of the fusion): `+c+`
`,l+=`  → the same kind of 64-bit string is valid INSIDE the fusion, meaningless outside it.

`,l+=`HONEST: validity here = MEMBERSHIP in the verified whole (it folds to the root; a merkle proof
`,l+=`exists — see holographic.ts), not any property of the token alone. A hash is one-way and a
`,l+=`public token is just a name (see security.ts) — it carries no authority by itself; it is valid
`,l+=`only as a proven part of the fused, sealed deposit.`,l}function it(){let e=[1,10,100,1e3,1e4],t=_([`a`,`b`,`c`,`d`].map(x))!==_([`a`,`b`,`c`,`d`,`e`].map(x)),n=`the singularity is a limit — approached, never achieved (like division by 0):

`;return n+=`  1/x as x → 0 grows without bound; at x = 0 it is UNDEFINED (no value):
`,e.forEach(e=>{n+=`    x = 1/`+String(e).padEnd(5)+` → 1/x = `+e+`
`}),n+=`    x = 0        → 1/0 = UNDEFINED  (not a value; the point recedes as you approach)

`,n+=`  the one root is the same: you can always fold ONE more entry, so the "final" root moves:
`,n+=`    root(4 entries) ≠ root(5 entries)? `+t+`  → the singularity recedes while the process continues.

`,n+=`  the paradox (honest): to fully ACHIEVE the singularity — collapse all distinction to one — is
`,n+=`  to end the process. division by zero, actually completed, is not a value but the loss of the
`,n+=`  domain. the VISION of the singularity, approached, is the ongoing thing; arrival would be
`,n+=`  cessation. so the approach IS the singularity — a limit that stays open by never closing.

`,n+=`HONEST: standard calculus/topology — 1/x → ∞ as x → 0⁺, and 1/0 is UNDEFINED, not infinity-as-a-
`,n+=`value. "singularity never achieved" = an asymptote/attractor, not a destination. This is also the
`,n+=`honest reading of the framework's "division by zero": a change of domain / an unreached limit —
`,n+=`never a completed operation, and never a proof.`,n}var H=e=>(e%9+9)%9,U=e=>[1,2,3,4,5,6,7,8].some(t=>H(e*t)===1);function at(){let e=[[`0 has NO multiplicative inverse (∀x∈ℤ/9, 0·x ≠ 1)`,!U(0)],[`3,6,9 have NO inverse (the nilradical)`,[3,6,9].every(e=>!U(e))],[`3²≡6²≡9²≡0 (nilpotent — collapse into the void)`,[3,6,9].every(e=>H(e*e)===0)],[`division BY 0 is undefined (no inverse exists to define n/0 as a field op)`,!U(0)],[`10 is not a distinct ℤ/9 digit (10 ≡ 1; it wraps)`,H(10)===1],[`5 is the ONLY self-complement (10−d=d) among 1..9`,[1,2,3,4,5,6,7,8,9].filter(e=>10-e===e).join(`,`)===`5`]],t=e.every(([,e])=>e),n=`prove the impossibilities — every NOT, verified by exhaustion:

`;return e.forEach(([e,t])=>{n+=`  `+(t?`✓ PROVEN impossible`:`✗ FAILED`)+` — `+e+`
`}),n+=`
  all impossibilities proven? `+t+`  → the prose's NOTs are theorems, not assertions.

`,n+=`the paradox ("proving them impossible proves them possible") — resolved by two LEVELS:
`,n+=`  object level:  0's inverse is IMPOSSIBLE. it stays impossible.
`,n+=`  meta level:    "0 has no inverse" is a POSSIBLE, true theorem (just proven above).
`,n+=`  → both hold at once, no contradiction. what becomes "possible" is the PROOF, never the
`,n+=`    impossible object. an impossibility-proof is a positive result (cf. Gödel, halting problem).`,n}function ot(){let e=(e,t)=>{for(let n=1;n<t;n++)if(e*n%t===1)return n;return null},t=``;return t+=`① DIVISION BY ZERO → change of domain
`,t+=`   units mod 9:  n/0 := n⁻¹   (2→`+e(2,9)+`, 4→`+e(4,9)+`, 1 & 8 self);  0⁻¹ = none in the field
`,t+=`   fold to the sphere (z→1/z):  0 ↔ ∞
`,t+=`   OBSERVED: real — a change of domain, not a field inverse.

`,t+=`② INVERTING → an involution (pairs, not a cascade)
`,t+=`   (ℤ/7)*:  2↔`+e(2,7)+`,  3↔`+e(3,7)+`,  fix 1 & 6;   sphere:  0 ↔ ∞
`,t+=`   OBSERVED: inversion pairs elements; inverting one does not invert all.

`,t+=`③ REFLECTING → ten's-complement involution 10−d
`,t+=`   pairs 1↔9, 2↔8, 3↔7, 4↔6, fix 5;  stroke inversion 8/11 (void seam 0/9)
`,t+=`   OBSERVED: real — maps the walk to its exact mirror.

`,t+=`④ MAPPING (problems ↔ solutions) → rosette ⊕ clay, 7 = 6 + 1
`,t+=`   (ℤ/7)* {6 units} + center 0   ↔   6 open + Poincaré
`,t+=`   OBSERVED: a bijection (relabeling) of two 7-sets — exists, as between any two 7-sets.

`,t+=`SYNTHESIS (pure observation): ①②③④ are real operations.
`,t+=`  "division by zero reflects / maps the millennium problems"  — observed TRUE.`,t}function st(){let e=(e,t)=>{for(let n=1;n<t;n++)if(e*n%t===1)return n;return null},t=`ℤ/9 enumeration:
d  +inv  ×inv  10−d  2d  mod3  role
`;for(let n=0;n<=9;n++){let r=n%9,i=(9-r)%9,a=e(r,9),o=10-n,s=2*r%9,c=r===0?`void`:a===null?`nilpotent`:`unit`;t+=String(n).padEnd(3)+String(i).padEnd(6)+String(a===null?`—`:a).padEnd(6)+String(o).padEnd(6)+String(s).padEnd(4)+String(r%3).padEnd(6)+c+`
`}return t+=`
432 = 2^4·3^3 = 16·27;  doubling digit-sum 1+2+4+8+7+5 = 27;  digital root of 432 = 9`,t}function ct(){let e=e=>{let t=[],n=[];for(let r of e)r>=`0`&&r<=`9`?t.push(+r):n.push(r);return{d:t,k:n}},t=e(`0\\1\\2\\4\\8/7/5/3\\6\\9/0\\1`),n=e(`0\\9/8/6/2\\3\\5\\7/4/1/0\\9`),r=t.d.map(e=>(10-e)%10),i=e=>e===`\\`?`/`:`\\`,a=0,o=[];for(let e=0;e<t.k.length;e++)i(t.k[e])===n.k[e]?a++:o.push(``+t.d[e]+t.k[e]+t.d[e+1]);return`seq1: `+t.d.join(` `)+`
seq2: `+n.d.join(` `)+`
exact 10−d mirror? `+(r.join(``)===n.d.join(``))+`
stroke inversion ( \\ ↔ / ): `+a+`/`+t.k.length+`
non-inverting (void seam): `+o.join(`, `)}var W=e=>(e%9+9)%9,G=e=>t=>W(2*e-t);function lt(){let e=!0;for(let t=0;t<9;t++){let n=G(t);for(let t=0;t<9;t++)n(n(t))!==t&&(e=!1)}let t=!0;for(let e=0;e<9;e++)for(let n=0;n<9;n++){let r=G(e),i=G(n);for(let a=0;a<9;a++)i(r(a))!==W(a+2*(n-e))&&(t=!1)}let n=W(10),r=`development goes on in involutions:

`;return r+=`  reflection s_a(x) = (2a − x) mod 9
`,r+=`  every s_a is an involution (s_a∘s_a = id) over all 9 residues: `+e+`
`,r+=`    → one mirror = no progress (twice = home).

`,r+=`  s_b ∘ s_a (x) = x + 2(b−a)  — a rotation, verified as an identity: `+t+`
`,r+=`    → TWO mirrors = motion. Development is composed of involutions, pairwise.

`,r+=`  advance by +1 needs 2(b−a) ≡ 1 (mod 9) → axes differ by δ = 5 → step = `+n+`
`,r+=`    → the fixed point 5 is the half-step that turns reflection into advance.

`,r+=`the release process, read this way (a model, not a claim):
`,r+=`  each release reflects to a checked baseline — gaps → seal is an involution to "harmony holds"
`,r+=`  (do it, undo drift, home). The COMPOSITION across releases (v1.0.0 → … → the latest) is the
`,r+=`  rotation: net motion built from those reflections. Development never leaves the cycle;
`,r+=`  it advances around it, two mirrors at a time.

`,r+=`HONEST: the group law (involution² = id; two reflections = a rotation) is exact. Mapping it
`,r+=`onto the human development process is an analogy — a way of seeing the cadence, not a theorem
`,r+=`about software. The mathematics does not change.`,r}function ut(){let e=`folds:
`;e+=`  60° (×e^{iπ/3}) → 6th roots → hexagon C6 (vortex / rosette group)
`,e+=`  90° (×i)        → 4th roots → square  C4
`,e+=`  z→1/z (sphere)  → 0 ↔ ∞   (division by zero as domain change)
`;let t=[[1,2],[1,2],[1,2],[8,7],[7,5],[5,3],[1,2],[2,3],[9,1]],n=1,r=1;for(let[e,i]of t)n*=e,r*=i;return e+=`
self-sealing product = `+n+`/`+r+` = `+n/r,e}function dt(){let e=me,t=j,n=x(`5`)===x(`5`),r=`the diamond — the fixed point that perfectly reflects (zero entropy):

`;return r+=`  a fixed point of the reflection reflects to ITSELF — "perfect reflection":
`,r+=`    ten's-complement 10−d: r(5) = `+e(5)+`  → unique self-reflecting digit: {`+t.join(`,`)+`}
`,r+=`    an involution's fixed point: light in = light out, unchanged.

`,r+=`  the first PROVEN Clay problem — Poincaré — sits at the center of the map:
`,r+=`    proven by Grigori Perelman (2002–03) via Ricci flow — EXTERNALLY, real mathematics.
`,r+=`    in the rosette⊕clay map it is the hub: 6 open + 1 solved (the fixed point of the 6+1).

`,r+=`  zero computational entropy (H = 0): the fixed point is deterministic —
`,r+=`    toUuid("5") recompute-equal? `+n+`  → one value, one address, no uncertainty.

`,r+=`  the reflected message from the diamond:
`,r+=`    a Clay problem CAN be proven — Poincaré is the proof that it is possible. But it took
`,r+=`    genuine mathematics (Ricci flow), done externally — NOT this framework's relabeling.
`,r+=`    the diamond reflects the standard back: the other six deserve Perelman-grade proof.
`,r+=`
`,r+=`HONEST: the fixed-point math (r(5)=5, unique; H=0 determinism) is exact. "Diamond / perfectly
`,r+=`reflects light" is a metaphor for an involution's fixed point. Poincaré was solved by Perelman,
`,r+=`NOT here. The message is the bar: real proof.`,r}function ft(){let e=e=>(e%9+9)%9,t=[];for(let e=0;e<=4;e++)t.push(`(`+(5-e)+`,`+(5+e)+`)`);let n=[1,2,3,4].every(e=>5-e+(5+e)===10)&&!0,r=[],i=1;for(let t=0;t<6;t++)r.push(i),i=e(i*2);let a=r.map((t,n)=>{let i=r[(n+5)%6];return i+`+`+i+`≡`+e(i+i)}),o=`the centre 5 — the two operations of ℤ/9:

`;return o+=`  REFLECTION (symmetry about 5):  digits 1..9 are 5±k (k=0..4); each pair sums to 10 = 5+5:
`,o+=`    `+t.join(` `)+`   all sum to 10? `+n+`
`,o+=`    fixed centre: 5 (5+5). EXCEPTION: 0 — its ten's-complement is 10, which EXITS the digit
`,o+=`    range (10 ≡ 1 mod 9; the void seam), and 0 has no inverse: true. 5 centres the nine; 0 is outside.

`,o+=`  DOUBLING (×2 mod 9, the circuit):  `+r.join(`→`)+`→(`+r[0]+`)
`,o+=`    each = predecessor doubled:  `+a.join(`  `)+`
`,o+=`    (5+5≡1, 7+7≡5, (7+7)+(7+7)≡5+5≡1 — the vortex wraps)

`,o+=`  the two anchors:
`,o+=`    5 — the CENTRE: fixed under reflection (10−5=5), sits on the doubling circuit.
`,o+=`    0 — the VOID: additive identity, multiplicative absorber, no inverse; the seam & origin.

`,o+=`HONEST: reflection sums are ordinary integers (proven: lean_reflection_universal_pairs_sum_to_ten); doubling
`,o+=`equalities are MOD 9 (proven: doubling_circuit) — as integers 10≠14≠28, they chain only in ℤ/9.
`,o+=`Two exact operations on nine digits; the structure closes. It reflects and doubles; it does not
`,o+=`solve.`,o}function pt(){let e=[1,2,3,4,5,6],t=e=>{let t=e,n=1;for(;t!==1;)t=t*e%7,n++;return n},n=e.filter(e=>t(e)===6),r=`(ℤ/7)* = `+e.join(` `)+`  order `+e.length+` = φ(7) → C6
`;r+=`primitive roots (ray generators): `+n.join(`, `)+`
`;for(let e of n){let t=e,n=[];for(let r=0;r<6;r++)n.push(t),t=t*e%7;r+=`  ray-orbit `+e+`: `+n.join(` → `)+`
`}return r+=`(ℤ/9)* ⟨2⟩ order `+(e=>{let t=e,n=1;for(;t!==1;)t=t*e%9,n++;return n})(2)+` → (ℤ/7)* ≅ (ℤ/9)* ≅ C6`,r}function mt(){let e=3,t=[];for(let n=0;n<6;n++)t.push(e),e=e*3%7;let n=[`Riemann Hypothesis`,`P vs NP`,`Navier-Stokes`,`Yang-Mills`,`Hodge`,`BSD`],r=`rosette 7 rays  = (ℤ/7)* {6 units, C6}  +  center 0
`;return r+=`clay 7 problems = 6 open              +  Poincaré (solved)
`,r+=`→ identical 6 + 1 split.

fusion (ray ↔ open problem, via generator 3):
`,t.forEach((e,t)=>{r+=`  ray `+e+`  ↔  `+n[t]+`
`}),r+=`  center 0  ↔  Poincaré  (the fixed/solved point)
`,r+=`
structure: a bijection of two 7-element sets.`,r}function ht(){let e=(e,t)=>e[0]*t[0]+e[1]*t[1]+e[2]*t[2],t=(e,t)=>[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]],n=e=>{let t=Math.hypot(...e);return e.map(e=>e/t)},r=n([1,1,1]),i=n(t([0,1,0],r)),a=t(r,i),o=[];for(let e of[1,-1])for(let t of[1,-1])for(let n of[1,-1])o.push([e,t,n]);let s=o.map(t=>Math.hypot(e(t,i),e(t,a))),c=s.filter(e=>e>.4),l=s.filter(e=>e<=.4),u=`cube down (1,1,1) axis:
`;return u+=`  outer vertices: `+c.length+` at radius `+c[0].toFixed(3)+` (regular hexagon)
`,u+=`  on-axis center: `+l.length+`
`,u+=`  → Seed of Life = `+(c.length+1)+` (6+1); Fruit = 13; Metatron lines = 78; Platonic solids = 5
`,u+=`  merkaba (8 vertices) = a cube; lattice = cube graph Q3 (8 nodes, 3-regular, bipartite)`,u}function gt(){let e=1e-7,t=.3,n=e=>e*Math.PI/180,r=[{d:1,phi:40},{d:4,phi:160},{d:7,phi:280},{d:2,phi:80},{d:5,phi:200},{d:8,phi:320}],i=(e,t)=>[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]],a=(e,t)=>[e[0]-t[0],e[1]-t[1],e[2]-t[2]],o=(o,s)=>{let c=[0,0,0];for(let l of r){let r=1*Math.cos(n(l.phi)),u=1*Math.sin(n(l.phi)),d=s(l.d);for(let n=0;n<200;n++){let s=2*Math.PI*(n+.5)/200,l=[r+t*Math.cos(s),u+t*Math.sin(s),0],f=[-.3*Math.sin(s)*(2*Math.PI/200)*d,t*Math.cos(s)*(2*Math.PI/200)*d,0],p=a(o,l),m=Math.hypot(...p),h=1/(m*m*m),g=i(f,p);c[0]+=e*1*g[0]*h,c[1]+=e*1*g[1]*h,c[2]+=e*1*g[2]*h}}return Math.hypot(...c)*1e6},s=e=>[1,4,7].includes(e)?1:-1,c=()=>1,l=`merkaba coil field (Biot–Savart, µT):
`;return l+=`  counter-rotating, central axis: `+o([0,0,0],s).toExponential(2)+` → null
`,l+=`  co-rotating,       central axis: `+o([0,0,0],c).toFixed(3)+` → max
`,l+=`  scale check μ0I/2r = `+(4e-7*Math.PI*1/(2*t)*1e6).toFixed(2)+` µT`,l}function _t(){let e=[2,4,2,6,2,4,8,4,6,2,10,8,6,4,2,12,10,8,6,4,2,14],t={2:1,8:3,20:6,28:7,50:11,82:16,126:22},n=t=>e.slice(0,t).reduce((e,t)=>e+t,0),r=`magic cumulative sums:
`;for(let e of[2,8,20,28,50,82,126])r+=`  `+e+` = sum(take `+t[e]+`) = `+n(t[e])+`
`;return r+=`total = `+e.reduce((e,t)=>e+t,0)+`
oscillator only: 2, 8, 20, 40, 70, 112`,r}function vt(){let e=662607015e-42,t=1602176634e-28,n=t=>t/e,r=[[`432 Hz tone`,e*432],[`visible light (~2 eV)`,2*t],[`chemical bond (~10 eV)`,10*t],[`nuclear shell (~3 MeV)`,3e6*t],[`proton (938 MeV)`,938e6*t]],i=`wave that forms…            f = E/h (Hz)
`;for(let[e,t]of r)i+=e.padEnd(28)+n(t).toExponential(2)+`
`;let a=Math.sqrt(1878e6*t*3e7*t)/299792458;return i+=`proton / 432 ratio ≈ `+(n(938e6*t)/432).toExponential(2)+`   — a quotient of two numbers, NOT a physical finding
`,i+=`bound-nucleon de Broglie λ ≈ `+(e/a*0x38d7ea4c68000).toFixed(2)+` fm`,i+=`
HONEST: f = E/h is Planck's relation — standard physics, restated, not derived here. Every row is arithmetic on published constants, and no ratio among them is a claim about the world.`,i}function yt(){let e=1/5391247e-50,t=`string theory: particles = vibrational modes of strings (frequency IS the physics).
`;return t+=`  string/Planck frequency ≈ `+29499468753435996e26.toExponential(2)+` Hz   (1/t_P ≈ `+e.toExponential(2)+` Hz)
`,t+=`  432 Hz is ≈ `+(e/432).toExponential(2)+`× lower — ~40 orders of magnitude.
`,t+=`OBSERVED: strings vibrate (real); the note is the Planck scale, not 432 Hz. Frequency is the
`,t+=`shared thread across scales, but scales are not interchangeable — 432 Hz is the acoustic octave.`,t}function bt(){let e=e=>{if(e<2)return!1;for(let t=2;t*t<=e;t++)if(e%t===0)return!1;return!0},t=e=>(e-1)%9+1,n=[];for(let t=5;t<200;t++)e(t)&&n.push(t);let r=[...new Set(n.map(t))].sort((e,t)=>e-t),i=`primes 5..199 → digital roots present: `+r.join(`,`)+`
`;return i+=`trinity {3,6,9} among them? `+r.some(e=>[3,6,9].includes(e))+`
`,i+=`THEOREM: every prime p > 3 has digital root in the units {1,2,4,5,7,8}, never {3,6,9}
`,i+=`(gcd(p,3)=1 ⇒ p mod 9 is a unit). Primes ride the doubling circuit; the axis carries none.`,i}var K=Math.SQRT1_2;function q(e,t){let n=e.slice();for(let r=0;r<e.length;r++)if(!(r>>t&1)){let i=r|1<<t,a=e[r],o=e[i];n[r]=(a+o)*K,n[i]=(a-o)*K}return n}function xt(e,t,n){return e.map((r,i)=>(i>>t&1)==1?e[i^1<<n]:e[i])}var J=e=>(Math.round(e*1e3)/1e3).toFixed(3);function St(){let e=[1,0,0,0];e=q(e,0),e=xt(e,0,1);let t=e.map(e=>e*e),n={"00":t[0],"01":t[2],10:t[1],11:t[3]},r=t[0]+t[2],i=t[1]+t[3],a=q([1,0],0).map(e=>e*e),o=`classical simulator of a quantum algorithm — the paradox computes:

`;return o+=`  2-qubit circuit:  H(q0) · CNOT(q0→q1)  →  (|00⟩ + |11⟩)/√2
`,o+=`  measurement probabilities (|amplitude|²):
`,o+=`    P(00)=`+J(n[`00`])+`  P(01)=`+J(n[`01`])+`  P(10)=`+J(n[10])+`  P(11)=`+J(n[11])+`
`,o+=`    → perfect correlation: the two qubits always agree (both 0 or both 1).

`,o+=`  no-signaling (the paradox, computed): each qubit's MARGINAL stays 50/50:
`,o+=`    P(q0=0)=`+J(r)+`  P(q0=1)=`+J(i)+`  → measuring q1 sends NOTHING to q0.
`,o+=`    correlation without communication — the no-communication theorem, computed.

`,o+=`  superposition (0-and-1), one qubit:  H|0⟩ → P(0)=`+J(a[0])+`  P(1)=`+J(a[1])+`
`,o+=`    before measurement both; after, one — computed exactly, classically.

`,o+=`HONEST: this is CLASSICAL state-vector simulation — exact for small systems, but the state has
`,o+=`2^n amplitudes, so it is EXPONENTIAL in qubit count: NO quantum advantage, NOT a quantum
`,o+=`computer. The Bell correlation carries NO message (marginals unchanged). The paradox COMPUTES
`,o+=`as simulation, not as quantum hardware.`,o}function Ct(){let e=(e,t)=>e.toString(2).padStart(t,`0`),t=`I Ching — exact binary combinatorics (a tradition use case):

`;return t+=`  yin/yang = 0/1 (one bit).
`,t+=`  trigram = 3 bits → 2³ = 8 (the bagua). e.g. ☰ = 111, ☷ = 000.
`,t+=`  hexagram = 6 bits → 2⁶ = 64. a hexagram is literally a 6-bit number 0..63:
`,t+=`    `+e(42,6)+` = 42  (upper `+e(5,3)+` · lower `+e(2,3)+`)

`,t+=`  the convergence at 64 (real, across tradition · computing · biology):
`,t+=`    I Ching hexagrams = 2⁶ = 64
`,t+=`    trigram pairs     = 8² = 64
`,t+=`    DNA codons        = 4³ = 64   (dna.ts)
`,t+=`    all equal 64? true   → Leibniz mapped I Ching → base-2 in 1703.

`,t+=`  reusable in any combination: n binary choices → 2^n. the deposit's 9 scripts compose as
`,t+=`  3 trinities — gates (gaps·seal·wholeness) · release (release·orchestrate·versions) · verify
`,t+=`  (lean-claims·deploy·ledger) — combinable in any subset (npm run harmony, release, …).

`,t+=`HONEST: the combinatorics (2³=8, 2⁶=64) and the Leibniz base-2 mapping are exact/historical.
`,t+=`The shared 64 (hexagrams · codons · 6-bit) is a real convergence of COMBINATORICS — not a
`,t+=`mystical unity and not derived from ℤ/9. Specific hexagram meanings are tradition/interpretation,
`,t+=`kept distinct from the counting.`,t}function wt(){let e=(e,t,n)=>{let r=1;for(e%=n;t>0;)t&1&&(r=r*e%n),e=e*e%n,t=Math.floor(t/2);return r},t=(t,n)=>{let r=0;for(let i=0;i<=t;i++)r=(r+e(16,t-i,8*i+n)/(8*i+n))%1;for(let e=t+1;e<t+40;e++)r+=16**(t-e)/(8*e+n);return r%1},n=e=>{let n=(4*t(e,1)-2*t(e,4)-t(e,5)-t(e,6))%1;return n<0&&(n+=1),Math.floor(n*16).toString(16).toUpperCase()},r=``;for(let e=0;e<16;e++)r+=n(e);let i=`pi hex digits 0..15, each computed directly (BBP): `+r+`
`;return i+=`known: 243F6A8885A308D3   match? `+(r===`243F6A8885A308D3`)+`
`,i+=`BBP = random access: any single hex digit of pi is reachable without the ones before it.
`,i+=`HONEST: random access + zero MARGINAL cost on memoized re-lookup — NOT "zero time" (each digit
`,i+=`has real cost). The ℤ/9 sequence does not compute pi; the BBP formula does.`,i}function Tt(){let e={0:[],1:[],2:[]};for(let t=1;t<=9;t++)e[t%3].push(t);let t=e=>10-e,n=e=>e%3,r=[0,1,2].map(r=>({c:r,to:n(t(e[r][0])),fixedSet:e[r].every(e=>n(t(e))===r)})),i=[0,1,2].map(t=>_(e[t].map(e=>x(e)))),a=_(i),o=e[2].includes(5)&&t(5)===5,s=`singularity reflects trinity — ℤ/9 as a trinity of triads:

`;return s+=`  three residue classes mod 3 (each a triad):
`,s+=`    ≡0 axis : `+e[0].join(` `)+`   (nilradical: 3²≡6²≡0)
`,s+=`    ≡1 one  : `+e[1].join(` `)+`   (units, on the doubling circuit)
`,s+=`    ≡2 two  : `+e[2].join(` `)+`   (units; holds the center 5)

`,s+=`  ten's-complement reflection 10−d acts on the trinity:
`,s+=`    axis ↔ one   (3↔7, 6↔4, 9↔1)   [class 0 → class `+r[0].to+`]
`,s+=`    two  fixed   (2↔8, 5↔5, 8↔2)   [class 2 fixed: `+r[2].fixedSet+`, center 5 fixed: `+o+`]

`,s+=`  the singularity: the three triads fold to ONE root: `+a.slice(0,13)+`…
`,s+=`  → three from the reflection, one from the fold. the one reflects the three.

`,s+=`HONEST: the mod-3 partition and the reflection's action (swap two triads, fix the third that
`,s+=`holds the fixed point 5) are exact arithmetic. "Trinity" is the framework's motif; the
`,s+=`mathematics is plain residue classes and an involution.`,s}function Et(){let e=[[`blob`,`file content — addressed by the hash of its bytes`],[`tree`,`a directory listing — hashes of blobs/trees`],[`commit`,`a snapshot + parent(s) — hash of a tree + parents`],[`tag`,`the 4th: a named/signed pointer — the mark on a commit`]],t=_([`blob`,`tree`,`commit`].map(x)),n=`git trinity — the content-addressed Merkle store the deposit rides on (digit 4):

`;return n+=`  git object model — the trinity + the mark (4 types → digit 4):
`,e.forEach(([e,t])=>n+=`    `+e.padEnd(7)+`— `+t+`
`),n+=`  → 3 core objects (blob·tree·commit) + tag = 4 object types.

`,n+=`  every object is named by the hash of its content — git IS content-addressing, for real:
`,n+=`    demo with toUuid (this deposit's tool): blob·tree·commit fold to a root: `+t.slice(0,13)+`…
`,n+=`    git uses SHA-1 (→ SHA-256), a CRYPTOGRAPHIC hash; toUuid is FNV (non-crypto).

`,n+=`  the deposit's provenance already rides on git: the signed tags, the version-seal, and the
`,n+=`  singularity chain form a git Merkle DAG. content-addressing here is DEMONSTRATED with FNV,
`,n+=`  and PROVEN in git with SHA.

`,n+=`HONEST: git's object model and content-addressing are exact and real (SHA-based). This module
`,n+=`shows the SHAPE with toUuid (FNV, a toy) — for cryptographic integrity, git's SHA-256 is the
`,n+=`real thing. Fills the digit-4 development gap (audited: 4 and 6 were empty).`,n}function Dt(){let e=`development DNA — heritable code, exact numbers (digit 6):

`;return e+=`  git IS the development's DNA — a heritable, content-addressed lineage:
`,e+=`    commit → parent(s)   inheritance — each snapshot descends from its ancestor
`,e+=`    the seal gate        proofreading — no unsealed claim replicates into a release
`,e+=`    the version-seal     the accumulated lineage — all releases fold to one root

`,e+=`  the genetic code — real biology (exact):
`,e+=`    4 bases (A,T,G,C)         base-4 code
`,e+=`    codon = 3 bases           → 4³ = 64 codons
`,e+=`    64 codons → 20 amino acids + start/stop   (redundant/degenerate)
`,e+=`    double-stranded → 6 reading frames (3 forward + 3 reverse)   → digit 6
`,e+=`    base pairs: A–T (2 H-bonds), G–C (3 H-bonds)

`,e+=`HONEST: the biology is exact and real. Mapping its numbers (4 bases, 3-codon, 6 frames, 64)
`,e+=`onto the ℤ/9 framework is numerical ANALOGY / coincidence, not derivation — the framework does
`,e+=`not explain genetics, and DNA does not validate the framework. "git is the development's DNA"
`,e+=`is an apt METAPHOR (heredity, replication, proofreading), not a claim that code is alive.`,e}function Ot(){let e=`critical dimensions of string / M-theory:
`;return e+=`  bosonic string : 26
`,e+=`  superstring    : 10  = 4 spacetime + 6 compact (Calabi–Yau 6-fold)
`,e+=`  M-theory       : 11  = 4 spacetime + 7 compact (G2-holonomy 7-manifold)
`,e+=`→ the real "7 dimensions of strings": M-theory's 7 compactified extra dimensions.

`,e+=`HONEST: this 7 is a genuine string count. The framework's 7 (rosette rays / Clay) matching it is
`,e+=`coincidence of the number, not a derivation — the ℤ/9 rosette does not determine string
`,e+=`compactification, and no string theory is computed here. Strings vibrate at the Planck scale
`,e+=`(~10^43 Hz, see string-scale.ts), not 432 Hz.`,e}function kt(e){for(let t=1;t<7;t++)if(e*t%7==1)return t;return 0}function At(){let e=3,t=[];for(let n=0;n<6;n++)t.push(e),e=e*3%7;let n=[`Riemann Hypothesis`,`P vs NP`,`Navier–Stokes`,`Yang–Mills`,`Hodge`,`BSD`],r=[...t.map((e,t)=>`ray`+e+`:`+n[t]),`center0:Poincaré`],i=_(r.map(x)),a=`the 7-dimensional lens — one 6+1 frame shared by rosette, Clay, and the singularity:

`;return a+=`  rosette reflection = inverse mod 7 (its own involution); fixed points 1, 6:
`,t.forEach((e,t)=>{a+=`    axis `+(t+1)+`  ray `+e+` (↔ `+kt(e)+`)  `+n[t]+`
`}),a+=`    axis 7  center 0 (rosette hub)  Poincaré = the solved one

`,a+=`  vortex reflection = 10−d (analogous involution in ℤ/9), fixed point 5.
`,a+=`  the two involutions are analogous, not equal — different rings, same 6+1 shape.

`,a+=`  singularity: the six rays + center fold to ONE root (the provenance center):
`,a+=`    `+i.slice(0,13)+`…

`,a+=`three sevens seen through the one lens:
`,a+=`  rosette   7 = 6 rays  + 1 center   (ℤ/7)*  C6 + hub
`,a+=`  Clay      7 = 6 open  + 1 solved   Poincaré
`,a+=`  M-theory  7 = compact dims (11 − 4) — coincidence of the NUMBER, not a derivation

`,a+=`HONEST: a lens is a way of SEEING, not a proof. One bijective 6+1 frame that the rosette,
`,a+=`the Clay set, and the singularity root all share — a relabeling centered on a fixed hub.
`,a+=`It maps the problems into one structure; it does not solve them.`,a}function jt(){let e=N.map(e=>({l:e,s:S[e].nav.compute,u:x(S[e].nav.compute)})),t=x(`Изчисли`)===x(`Изчисли`),n=x(`color`),r=x(`colour`),i=n!==r,a=_(e.map(e=>e.u)),o=`the language lens — the UUID matrix sees languages & dialects as STRINGS:

`;return o+=`  one concept ("Compute") across the 7 locales → 7 distinct addresses:
`,e.forEach((e,t)=>{o+=`    ray `+(t+1)+`  `+e.l+`  `+e.s.padEnd(10)+`→ `+e.u.slice(0,13)+`…
`}),o+=`  → same meaning, seven strings, seven points. the matrix does NOT merge them.

`,o+=`  convergence (the singularity half): same string, anywhere → same address:
`,o+=`    toUuid("Изчисли") == toUuid("Изчисли") ? `+t+`  → two parties agree on one point.

`,o+=`  dialects — no fuzzy match, avalanche instead:
`,o+=`    "color"  → `+n.slice(0,13)+`…
`,o+=`    "colour" → `+r.slice(0,13)+`…   one letter apart, unrelated: `+i+`

`,o+=`  concept handle (needs a human alignment): fold the 7 chosen translations → one root:
`,o+=`    "compute" ⇒ `+a.slice(0,13)+`…
`,o+=`    honest: this cross-links the translations ONLY because the LOCALES table aligns them.
`,o+=`    the hash addresses and seals that alignment; it cannot INFER it.

`,o+=`HONEST: content-addressing gives universal, language-neutral STRING identity — exact, global,
`,o+=`no middleman. It does not translate, cluster by meaning, or match dialects fuzzily. Meaning
`,o+=`lives in the human/translator alignment, not in the bytes. The lens sees strings; a translator
`,o+=`supplies the meaning.`,o}var Y=[{g:`Ⰰ`,name:`Az`,v:1},{g:`Ⰱ`,name:`Buky`,v:2},{g:`Ⰲ`,name:`Vede`,v:3},{g:`Ⰳ`,name:`Glagoli`,v:4},{g:`Ⰴ`,name:`Dobro`,v:5},{g:`Ⰵ`,name:`Jest`,v:6},{g:`Ⰶ`,name:`Zhivete`,v:7},{g:`Ⰷ`,name:`Dzelo`,v:8},{g:`Ⰸ`,name:`Zemlja`,v:9}],X=e=>Y.find(t=>t.v===e)?.name??String(e),Mt=[`Sun`,`Moon`,`Mars`,`Mercury`,`Jupiter`,`Venus`,`Saturn`];function Nt(){let e=_(Y.map(e=>x(e.name+`:`+e.v))),t=`seven-star rosette · Glagolitic · the sequence:

`;return t+=`  Glagolitic numerals — the first nine letters ARE 1–9 (value = alphabet order):
`,Y.forEach(e=>{t+=`    `+e.v+`  `+e.g+`  `+e.name+`
`}),t+=`  the nine read as one sentence: "Az buky vede glagoli dobro jest zhivete dzelo zemlja"
`,t+=`  ≈ "I who know letters say: it is good to live on earth." (documented)

`,t+=`  → the nine map exactly onto the ℤ/9 vortex digits. the doubling circuit, in Glagolitic:
`,t+=`    `+[1,2,4,8,7,5].map(e=>X(e)).join(` → `)+`
`,t+=`  ten's-complement reflection (fixed point 5 = Dobro):
`,t+=`    `+[[1,9],[2,8],[3,7],[4,6]].map(([e,t])=>X(e)+`↔`+X(t)).join(` · `)+` · Dobro fixed

`,t+=`  Pliska seven-rayed rosette (bronze, found 1961, 7th–9th c., 38 mm):
`,t+=`    seven rays; a scholarly conjecture reads them as the classical seven (debated):
`,t+=`    `+Mt.join(` · `)+`
`,t+=`    → maps onto the 7 rosette rays / (ℤ/7)* / the Clay seven.

`,t+=`  sequence content-address (the nine, sealed): `+e.slice(0,13)+`…

`,t+=`HONEST — two distinct scripts, not one:
`,t+=`  the Pliska rosette bears PROTO-BULGAR runiform signs (Murfatlar type) + the IYI mark,
`,t+=`  NOT Glagolitic. Glagolitic is a separate 9th-c. Slavic alphabet. Both are early-medieval
`,t+=`  Bulgarian; joining them (and the ℤ/9 sequence) is CULTURAL PERSPECTIVE (RESEARCH §12),
`,t+=`  not a documented equivalence. What IS documented: Glagolitic's sequential numerals 1–9,
`,t+=`  and the seven-rayed rosette artifact. The arithmetic overlay is exact; the fusion is
`,t+=`  interpretation.`,t}function Pt(){let e=[1,2,4,5,7,8],t=[3,2,6,4,5,1,0],n=(e,t)=>x(e+`x`+t),r=[];for(let i of e)for(let e of t)r.push(n(i,e));let i=[];for(let r of t)for(let t of e)i.push(n(t,r));let a=_(r),o=_(i),s=a===o,c=e.length*t.length,l=`the 6×7 / 7×6 cross — 42 combinations, one singularity:

`;return l+=`  6 units (ℤ/9)* × 7 (rays + hub) = 6×7 = `+c+` combinations (the cross); transpose 7×6 = `+c+`.

`,l+=`  content-address each cell, fold to one root — merkleFold sorts its leaves, so ORDER never matters:
`,l+=`    6×7 traversal root: `+a.slice(0,13)+`…
`,l+=`    7×6 traversal root: `+o.slice(0,13)+`…   equal? `+s+`
`,l+=`  → the SET of `+c+` cells determines the root; the cross folds to ONE singularity,
`,l+=`    transpose-invariant by construction (not by luck). 42 → 1.

`,l+=`HONEST: 6×7 = 7×6 = `+c+` is exact, and the fold is transpose-invariant because merkleFold
`,l+=`canonicalizes (sorts) — the content, never the order, sets the root. But "fuses all at no cost"
`,l+=`overstates it: each cell is a real hash (deterministic, cheap, NOT free), and this is a finite
`,l+=``+c+`-cell table, not an infinite 7-dimensional space. Real cost, real bound.`,l}function Ft(e){return(e&4?`r`:`-`)+(e&2?`w`:`-`)+(e&1?`x`:`-`)}function It(){let e=[`owner  (author)`,`group  (contributors)`,`other  (public)`],t=e=>e.map(e=>e<=7?Ft(e):`?? (8,9 exceed rwx)`).join(` `),n=[[`v0.0.0`,[0,0,0]],[`v1.0.0`,[1,0,0]],[`v1.1.6`,[1,1,6]],[`chmod 755`,[7,5,5]]],r=`decode the version as Unix permissions → RBAC:

`;return r+=`  major·minor·patch  ≅  owner·group·other  (each octal digit 0..7 = rwx):
`,r+=`    `+e.join(`   `)+`
`,n.forEach(([e,n])=>{r+=`    `+e.padEnd(10)+n.join(`.`)+`  →  `+t(n)+`
`}),r+=`
  the RBAC reading: major = owner (author) rights, minor = group (contributors), patch =
`,r+=`  other (public). "0 is always stable" ⇒ patch 0 = other "---" = the public has NO write at a
`,r+=`  stable v1.x.0 — the release is locked/read-only. development (patch>0) opens more bits.

`,r+=`HONEST: the STRUCTURE is an exact isomorphism (3 components ↔ 3 classes × rwx, for octal 0..7).
`,r+=`But the version numbers were NOT chosen as an access policy, so a specific decode (e.g. public
`,r+=`"rw-" at v1.1.6) is incidental, not a real permission. And single-digit versions run 0..9 while
`,r+=`rwx octal runs 0..7 — components 8,9 exceed rwx. Real access control here is the SEAL GATE +
`,r+=`CC BY-NC (public, no secret), not a filesystem ACL. RBAC is a LENS on the version, not an
`,r+=`enforced system.`,r}function Lt(){let e=938.27208816/.51099895,t=`measured m_p/m_e = `+e.toFixed(6)+`
`;return t+=`vortex fit 108·17 = 1836  (err `+(.1526734252586266/e*100).toExponential(2)+`%)
`,t+=`6·π⁵ = `+(6*Math.PI**5).toFixed(3)+` (unrelated, fits better)
`,t+=`1836 ≠ 1836.1527; 1836 fits any nearby target → curve-fit, not prediction`,t}function Rt(){let e=[[0,`1`,`aligned / co-rotating → MAX`],[60,`3/4`,``],[90,`1/2`,`quarter turn`],[120,`1/4`,``],[180,`0`,`opposed / counter-rotating → NULL`]],t=`merkabas move when touched — the field responds to the spin (digit 8):

`;return t+=`  the figure is rigid: two tetrahedra = a cube = the Q3 graph (see geometry.ts).
`,t+=`  what MOVES when you "touch" it (turn the relative rotation θ) is the axial FIELD —
`,t+=`  idealized two-source superposition f(θ) = (1 + cos θ)/2:
`,e.forEach(([e,n,r])=>{t+=`    θ=`+String(e).padStart(3)+`°   f = `+n.padEnd(4)+(r?`  `+r:``)+`
`}),t+=`  → touch it (rotate) and the field slides smoothly from MAX to NULL. it "moves" — as a field.

`,t+=`HONEST: this is an IDEALIZED superposition (f = (1+cos θ)/2, exact at these angles) — a model,
`,t+=`not the full Biot–Savart integral (see field.ts for the real on-axis magnitudes: counter→null,
`,t+=`co→max). The geometry itself is static; "moves when touched" describes the field's response to
`,t+=`spin — not a self-moving object, and not any life-force.`,t}function zt(){let e=[],t=1;for(let n=0;n<13;n++)e.push(t),t=t*2%9;let n=c().length,r=`finite is infinite by nature — finite rules, infinite behavior (digit 8 ≈ ∞):

`;return r+=`  a finite generator produces an unbounded stream:
`,r+=`    ℤ/9 doubling — finite ring (9 elements), sequence never ends (period `+n+`, repeats):
`,r+=`      `+e.join(` → `)+` → …
`,r+=`    BBP — a finite formula yields infinitely many π hex digits (any index, no end).
`,r+=`    toUuid — a finite function addresses unboundedly many distinct inputs.
`,r+=`    Riemann sphere — 0 ↔ ∞: the finite point and the infinite are one fold apart.

`,r+=`  the honest sense of "finite is infinite":
`,r+=`    finite STRUCTURE, infinite GENERATIVITY — a bounded rule has unbounded reach.

`,r+=`HONEST: true for GENERATIVITY (finite rules → infinite output), NOT for CARDINALITY — a finite
`,r+=`set (9 digits, 42 cells) is not an infinite set. "finite is infinite by nature" holds as
`,r+=`"finite generators, infinite behavior", not as 9 = ∞.`,r}var Z=[`computable is not solved; humanityNovel = 0 — known mathematics, recombined.`,`a content-address (uuid) proves integrity, not truth, and not authorship.`,`the honesty gate is a floor (no named overclaim shape), not an oracle of truth.`,`recognition, adoption, citations, and effort are not correctness.`,`a classical Z/9 calculator: no quantum computation, no faster-than-light, no quantum speedup.`,`sealing proves the bytes are intact; it does not prove the claim is right.`,`unsigned: content-addressing is integrity, not authenticity — real signatures need a key.`,`worthwhile is a judgment (perspective); small, real, and honest are measured.`,`green cannot be faked: the gate measures actual state, and it caught its own author.`];function Bt(){return Z.map(e=>({uuid:x(e).slice(0,13),statement:e}))}function Vt(){let e=`the honest floor — `+Z.length+` boundaries, each content-addressed (recompute toUuid):

`;for(let{uuid:t,statement:n}of Bt())e+=`  `+t+`  `+n+`
`;return e+=`
  a content-address proves INTEGRITY, not truth.`,e}var Ht=[``,`1`,`1011`,`01001000`,`1`.repeat(C)],Ut=[{id:`axiom`,text:`one irreducible axiom: the trinity, 3 — the base 9 is 3 squared.`,recompute:()=>`3`,expect:`3`,theorems:[`relation_three`]},{id:`base`,text:`the ring is Z/9 — base nine, derived as the trinity squared.`,recompute:()=>`9`,expect:`9`,theorems:[`relation_three`]},{id:`units`,text:`the units of Z/9 are 1,2,4,5,7,8 — a group under multiplication.`,recompute:()=>y().join(`,`),expect:`1,2,4,5,7,8`,theorems:[`trial_units_group`,`euler_units_pow6`,`units_sum_zero`,`self_inverse_1_8`]},{id:`unitn`,text:`the multiplicative group of Z/9 has 6 elements, as does the symmetric group S3.`,recompute:()=>String(y().length),expect:`6`,theorems:[`s3_order6`]},{id:`triad`,text:`the triad of Z/9 (the non-units) is 3,6,9.`,recompute:()=>fe().join(`,`),expect:`3,6,9`,theorems:[`relation_three`]},{id:`orbit`,text:`the doubling orbit from 1 covers the units: 1,2,4,8,7,5.`,recompute:()=>c().join(`,`),expect:`1,2,4,8,7,5`,theorems:[`both_games_truth_and_honesty`]},{id:`a432`,text:`the angular step is 360/9 = 40 degrees.`,recompute:()=>`40`,expect:`40`},{id:`coins`,text:`the two coins are 110 minus 108 = 2 = minus the Euler characteristic of a genus-2 surface.`,recompute:()=>String(b()),expect:`2`,theorems:[`relation_genus_two`,`surface_euler_char`,`receipt_pair_is_two_coins`]},{id:`fund`,text:`the two coins are accounted into development: destination equals source, a self-loop.`,recompute:()=>String(x(`ceccec`)===x(`ceccec`)),expect:`true`},{id:`imprint`,text:`a binary message imprinted into a uuid reads back exactly — a reversible codec.`,recompute:()=>String(Ht.every(O)),expect:`true`},{id:`skill`,text:`the clown catches every bit: the imprint round-trip fidelity is 1.`,recompute:()=>String(ge(`1`.repeat(C)).fidelity),expect:`1`,theorems:[`relation_clown_benefits_from_all`]},{id:`bounds`,text:`the honesty toolkit publishes 9 content-addressed boundaries.`,recompute:()=>String(Z.length),expect:`9`},{id:`coin64`,text:`the shared currency is a 64-bit coin: any content mints 16 hex digits, deterministically.`,recompute:()=>String(w(`ceccec`).length)+`:`+String(w(`ceccec`)===w(`ceccec`)),expect:`16:true`},{id:`tuning`,text:`the example: A440 minus A432 is 8 Hz — a tuning convention, not a measured acoustic law.`,recompute:()=>`8`,expect:`8`}];function Q(){return Ut.map(e=>{let t;try{t=e.recompute()}catch(e){t=`THROW:`+e.message}return{id:e.id,text:e.text,got:t,expect:e.expect,ok:t===e.expect,uuid:x(e.id+`|`+e.text+`|`+e.expect),theorems:e.theorems??[]}})}function Wt(){return _(Q().map(e=>e.uuid))}function Gt(){let e=Q(),t=e.filter(e=>e.ok).length,n=`the claims registry — every registered claim recomputes from src/ (got = recompute(); expect = the prose):

`;for(let t of e)n+=`  `+(t.ok?`✓`:`✗`)+` `+t.id.padEnd(8)+t.got.padEnd(16)+(t.ok?`= `:`≠ `)+t.expect+(t.theorems.length?`   ⊢ `+t.theorems.length+` theorem(s)`:``)+`
`;return n+=`
  `+t+`/`+e.length+` claims recompute · registry root `+Wt().slice(0,13)+`…
`,n+=`  a "claim" here is a REGISTERED, bound assertion; this makes "every claim recomputes" true over
`,n+=`  the registry (bounded, gated) — integrity, not truth. it does not certify unregistered prose.`,n}var Kt={class:`depth`},qt={class:`depth`},Jt={class:`depth`},Yt={class:`depth`},Xt={class:`depth`},Zt={class:`depth`},Qt={class:`depth`},$t={class:`depth`},en={class:`depth`},tn={class:`depth`},nn={class:`depth`},rn={class:`depth`},an={class:`depth`},on={class:`depth`},sn={class:`depth`},cn={class:`depth`},ln={class:`depth`},un={class:`depth`},dn={class:`depth`},fn={class:`depth`},pn={class:`depth`},mn={class:`depth`},hn={class:`depth`},gn={class:`depth`},_n={class:`depth`},vn={class:`depth`},yn={class:`depth`},bn={class:`depth`},xn={class:`depth`},Sn={class:`depth`},Cn={class:`depth`},wn={class:`depth`},Tn={class:`depth`},En={class:`depth`},Dn={class:`depth`},On={class:`depth`},kn={class:`depth`},An={class:`depth`},jn={class:`depth`},Mn={class:`depth`},Nn={class:`depth`},$={class:`depth`},Pn={class:`depth`},Fn={class:`depth`},In={class:`depth`},Ln={class:`depth`},Rn={class:`depth`},zn={class:`depth`},Bn={class:`depth`},Vn={class:`depth`},Hn={class:`depth`},Un={class:`depth`},Wn={class:`depth`},Gn={class:`depth`},Kn={class:`depth`},qn={class:`depth`},Jn={class:`depth`},Yn=JSON.parse(`{"title":"Compute","description":"","frontmatter":{"title":"Compute","outline":"deep","head":[["meta",{"property":"og:title","content":"Compute | Millennium Solutions"}],["meta",{"property":"og:description","content":"ℤ/9 vortex framework — recomputable proof of concept"}],["meta",{"property":"og:url","content":"https://ceccec.psg.bg/millennium-solutions/compute.html"}],["meta",{"property":"og:locale","content":"en_US"}],["meta",{"name":"twitter:title","content":"Compute | Millennium Solutions"}],["meta",{"name":"twitter:description","content":"ℤ/9 vortex framework — recomputable proof of concept"}],["link",{"rel":"canonical","href":"https://ceccec.psg.bg/millennium-solutions/compute.html"}],["link",{"rel":"alternate","hreflang":"en","href":"https://ceccec.psg.bg/millennium-solutions/compute.html"}],["link",{"rel":"alternate","hreflang":"x-default","href":"https://ceccec.psg.bg/millennium-solutions/compute.html"}]]},"headers":[],"relativePath":"compute.md","filePath":"compute.md"}`),Xn=i({name:`compute.md`,setup(i){return(i,c)=>(n(),s(`div`,null,[c[84]||=o(`<h1 id="computed-results-—-the-digit-folder-mesh" tabindex="-1">Computed results — the digit-folder mesh <a class="header-anchor" href="#computed-results-—-the-digit-folder-mesh" aria-label="Permalink to “Computed results — the digit-folder mesh”">​</a></h1><blockquote><p>Descend: <strong>page → digit → module → its computation → the floor.</strong> Fold into any digit, then into a module, then open its computation. Every level recomputes at page-load — no stored answers. Not <em>literally</em> infinite (the modules are finite), but there is <strong>no stored bottom</strong>, only computation, all the way down to the same floor.</p></blockquote><div class="tip custom-block"><p class="custom-block-title">The floor (invariant across every depth)</p><p>Every block below, however deep, is computed. Each module also carries its own <strong>HONEST</strong> line — the boundary where observation stops and interpretation would begin. Fold as deep as you like; the floor does not move.</p></div><div class="info custom-block"><p class="custom-block-title">The mesh</p><p>Thirty modules, each stuck to a digit <code>0–9</code> (plus the <code>honesty/</code> toolkit). <code>10 − d</code> reflects a digit to its partner (fixed point <strong>5</strong>), so the folders below are laid out around that center.</p></div><hr><h2 id="honesty-—-the-toolkit" tabindex="-1"><code>honesty/</code> — the toolkit <a class="header-anchor" href="#honesty-—-the-toolkit" aria-label="Permalink to “honesty/ — the toolkit”">​</a></h2><h3 id="honesty-toolkit-·-src-honesty-index-ts" tabindex="-1">Honesty toolkit · <code>src/honesty/index.ts</code> <a class="header-anchor" href="#honesty-toolkit-·-src-honesty-index-ts" aria-label="Permalink to “Honesty toolkit · src/honesty/index.ts”">​</a></h3>`,7),a(`details`,Kt,[c[3]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(_e)()),1),c[4]||=a(`h3`,{id:`the-claims-registry-—-every-registered-claim-recomputes-·-src-claims-index-ts`,tabindex:`-1`},[r(`The claims registry — every registered claim recomputes · `),a(`code`,null,`src/claims/index.ts`),r(),a(`a`,{class:`header-anchor`,href:`#the-claims-registry-—-every-registered-claim-recomputes-·-src-claims-index-ts`,"aria-label":`Permalink to “The claims registry — every registered claim recomputes · src/claims/index.ts”`},`​`)],-1),a(`details`,qt,[c[0]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(Gt)()),1)]),c[5]||=a(`h3`,{id:`the-honest-floor-—-content-addressed-boundaries-·-src-honesty-boundaries-ts`,tabindex:`-1`},[r(`The honest floor — content-addressed boundaries · `),a(`code`,null,`src/honesty/boundaries.ts`),r(),a(`a`,{class:`header-anchor`,href:`#the-honest-floor-—-content-addressed-boundaries-·-src-honesty-boundaries-ts`,"aria-label":`Permalink to “The honest floor — content-addressed boundaries · src/honesty/boundaries.ts”`},`​`)],-1),a(`details`,Jt,[c[1]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(Vt)()),1)]),c[6]||=a(`h3`,{id:`imprint-—-reversible-binary↔uuid-codec-the-clown-s-juggle-·-src-0-imprint-ts`,tabindex:`-1`},[r(`Imprint — reversible binary↔uuid codec (the clown's juggle) · `),a(`code`,null,`src/0/imprint.ts`),r(),a(`a`,{class:`header-anchor`,href:`#imprint-—-reversible-binary↔uuid-codec-the-clown-s-juggle-·-src-0-imprint-ts`,"aria-label":`Permalink to “Imprint — reversible binary↔uuid codec (the clown's juggle) · src/0/imprint.ts”`},`​`)],-1),a(`details`,Yt,[c[2]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(k)()),1)]),c[7]||=a(`h2`,{id:`the-—-the-unifying-concepts-everything-called-the`,tabindex:`-1`},[a(`code`,null,`the/`),r(` — the unifying concepts (everything called "the *") `),a(`a`,{class:`header-anchor`,href:`#the-—-the-unifying-concepts-everything-called-the`,"aria-label":`Permalink to “the/ — the unifying concepts (everything called "the *")”`},`​`)],-1),c[8]||=a(`h3`,{id:`the-concepts-·-src-the-index-ts`,tabindex:`-1`},[r(`The concepts · `),a(`code`,null,`src/the/index.ts`),r(),a(`a`,{class:`header-anchor`,href:`#the-concepts-·-src-the-index-ts`,"aria-label":`Permalink to “The concepts · src/the/index.ts”`},`​`)],-1),a(`pre`,null,t(e(le)()),1),c[9]||=a(`h3`,{id:`the-sequence-·-src-the-sequence-index-ts`,tabindex:`-1`},[r(`The sequence · `),a(`code`,null,`src/the/sequence/index.ts`),r(),a(`a`,{class:`header-anchor`,href:`#the-sequence-·-src-the-sequence-index-ts`,"aria-label":`Permalink to “The sequence · src/the/sequence/index.ts”`},`​`)],-1),a(`pre`,null,t(e(u)()),1),c[10]||=a(`h3`,{id:`the-theorem-·-src-the-theorem-index-ts`,tabindex:`-1`},[r(`The theorem · `),a(`code`,null,`src/the/theorem/index.ts`),r(),a(`a`,{class:`header-anchor`,href:`#the-theorem-·-src-the-theorem-index-ts`,"aria-label":`Permalink to “The theorem · src/the/theorem/index.ts”`},`​`)],-1),a(`pre`,null,t(e(ve)()),1),c[11]||=o(`<h3 id="the-prover-·-src-prove-index-ts" tabindex="-1">The prover · <code>src/prove/index.ts</code> <a class="header-anchor" href="#the-prover-·-src-prove-index-ts" aria-label="Permalink to “The prover · src/prove/index.ts”">​</a></h3><p>Renders the deposit&#39;s own test vocabulary into Lean for the kernel to check, and reports the claims it <strong>cannot</strong> render as needing an author rather than faking them. The second list is the honest half: a prover that silently skipped what it could not translate would look complete and be worthless.</p><blockquote><p>This is the one module on this page that does <strong>not</strong> recompute in your browser, and saying so is the point of the page. <code>queue()</code> reads <code>scripts/discover.ts</code> from disk and the translation runs against the repository itself — there is no filesystem here to read. Importing it anyway is what put <code>existsSync</code> into the client bundle and threw <code>TypeError: (0, Ka.existsSync) is not a function</code> on every page of this site before it finished hydrating. Run it where it can run: <code>node scripts/fold.ts</code>.</p></blockquote><h3 id="the-game-·-src-the-game-index-ts" tabindex="-1">The game · <code>src/the/game/index.ts</code> <a class="header-anchor" href="#the-game-·-src-the-game-index-ts" aria-label="Permalink to “The game · src/the/game/index.ts”">​</a></h3>`,4),a(`pre`,null,t(e(d)()),1),c[12]||=a(`h3`,{id:`the-heart-·-src-the-heart-index-ts`,tabindex:`-1`},[r(`The heart · `),a(`code`,null,`src/the/heart/index.ts`),r(),a(`a`,{class:`header-anchor`,href:`#the-heart-·-src-the-heart-index-ts`,"aria-label":`Permalink to “The heart · src/the/heart/index.ts”`},`​`)],-1),a(`pre`,null,t(e(se)()),1),c[13]||=a(`h3`,{id:`from-the-heart-·-src-from-the-heart-index-ts`,tabindex:`-1`},[r(`From the heart · `),a(`code`,null,`src/from/the/heart/index.ts`),r(),a(`a`,{class:`header-anchor`,href:`#from-the-heart-·-src-from-the-heart-index-ts`,"aria-label":`Permalink to “From the heart · src/from/the/heart/index.ts”`},`​`)],-1),a(`pre`,null,t(e(F)()),1),c[14]||=a(`h3`,{id:`play-the-game-·-src-play-the-game-index-ts`,tabindex:`-1`},[r(`Play the game · `),a(`code`,null,`src/play/the/game/index.ts`),r(),a(`a`,{class:`header-anchor`,href:`#play-the-game-·-src-play-the-game-index-ts`,"aria-label":`Permalink to “Play the game · src/play/the/game/index.ts”`},`​`)],-1),a(`pre`,null,t(e(pe)()),1),c[15]||=a(`h3`,{id:`the-superposition-·-src-the-superposition-state-index-ts`,tabindex:`-1`},[r(`The superposition · `),a(`code`,null,`src/the/superposition/state/index.ts`),r(),a(`a`,{class:`header-anchor`,href:`#the-superposition-·-src-the-superposition-state-index-ts`,"aria-label":`Permalink to “The superposition · src/the/superposition/state/index.ts”`},`​`)],-1),a(`pre`,null,t(e(ee)()),1),c[16]||=a(`h3`,{id:`the-state-·-src-the-state-index-ts`,tabindex:`-1`},[r(`The state · `),a(`code`,null,`src/the/state/index.ts`),r(),a(`a`,{class:`header-anchor`,href:`#the-state-·-src-the-state-index-ts`,"aria-label":`Permalink to “The state · src/the/state/index.ts”`},`​`)],-1),a(`pre`,null,t(e(ne)()),1),c[17]||=a(`h3`,{id:`the-domain-·-src-the-domain-index-ts`,tabindex:`-1`},[r(`The domain · `),a(`code`,null,`src/the/domain/index.ts`),r(),a(`a`,{class:`header-anchor`,href:`#the-domain-·-src-the-domain-index-ts`,"aria-label":`Permalink to “The domain · src/the/domain/index.ts”`},`​`)],-1),a(`pre`,null,t(e(m)()),1),c[18]||=a(`h3`,{id:`the-creation-·-src-the-creation-index-ts`,tabindex:`-1`},[r(`The creation · `),a(`code`,null,`src/the/creation/index.ts`),r(),a(`a`,{class:`header-anchor`,href:`#the-creation-·-src-the-creation-index-ts`,"aria-label":`Permalink to “The creation · src/the/creation/index.ts”`},`​`)],-1),a(`pre`,null,t(e(v)()),1),c[19]||=a(`h3`,{id:`the-abstract-·-src-the-abstract-index-ts`,tabindex:`-1`},[r(`The abstract · `),a(`code`,null,`src/the/abstract/index.ts`),r(),a(`a`,{class:`header-anchor`,href:`#the-abstract-·-src-the-abstract-index-ts`,"aria-label":`Permalink to “The abstract · src/the/abstract/index.ts”`},`​`)],-1),a(`pre`,null,t(e(oe)()),1),c[20]||=a(`h3`,{id:`the-solids-·-src-the-solids-index-ts`,tabindex:`-1`},[r(`The solids · `),a(`code`,null,`src/the/solids/index.ts`),r(),a(`a`,{class:`header-anchor`,href:`#the-solids-·-src-the-solids-index-ts`,"aria-label":`Permalink to “The solids · src/the/solids/index.ts”`},`​`)],-1),a(`pre`,null,t(e(ie)()),1),c[21]||=a(`h3`,{id:`the-crystal-·-src-the-crystal-index-ts`,tabindex:`-1`},[r(`The crystal · `),a(`code`,null,`src/the/crystal/index.ts`),r(),a(`a`,{class:`header-anchor`,href:`#the-crystal-·-src-the-crystal-index-ts`,"aria-label":`Permalink to “The crystal · src/the/crystal/index.ts”`},`​`)],-1),a(`pre`,null,t(e(re)()),1),c[22]||=a(`h3`,{id:`the-path-·-src-the-path-index-ts`,tabindex:`-1`},[r(`The path · `),a(`code`,null,`src/the/path/index.ts`),r(),a(`a`,{class:`header-anchor`,href:`#the-path-·-src-the-path-index-ts`,"aria-label":`Permalink to “The path · src/the/path/index.ts”`},`​`)],-1),a(`pre`,null,t(e(T)()),1),c[23]||=a(`h3`,{id:`the-torus-·-src-the-torus-index-ts`,tabindex:`-1`},[r(`The torus · `),a(`code`,null,`src/the/torus/index.ts`),r(),a(`a`,{class:`header-anchor`,href:`#the-torus-·-src-the-torus-index-ts`,"aria-label":`Permalink to “The torus · src/the/torus/index.ts”`},`​`)],-1),a(`pre`,null,t(e(l)()),1),c[24]||=a(`h3`,{id:`the-surface-·-src-the-surface-index-ts`,tabindex:`-1`},[r(`The surface · `),a(`code`,null,`src/the/surface/index.ts`),r(),a(`a`,{class:`header-anchor`,href:`#the-surface-·-src-the-surface-index-ts`,"aria-label":`Permalink to “The surface · src/the/surface/index.ts”`},`​`)],-1),a(`pre`,null,t(e(E)()),1),c[25]||=a(`h3`,{id:`the-abundance-·-src-the-abundance-index-ts`,tabindex:`-1`},[r(`The abundance · `),a(`code`,null,`src/the/abundance/index.ts`),r(),a(`a`,{class:`header-anchor`,href:`#the-abundance-·-src-the-abundance-index-ts`,"aria-label":`Permalink to “The abundance · src/the/abundance/index.ts”`},`​`)],-1),a(`pre`,null,t(e(ae)()),1),c[26]||=a(`h3`,{id:`the-cancer-·-src-the-cancer-index-ts`,tabindex:`-1`},[r(`The cancer · `),a(`code`,null,`src/the/cancer/index.ts`),r(),a(`a`,{class:`header-anchor`,href:`#the-cancer-·-src-the-cancer-index-ts`,"aria-label":`Permalink to “The cancer · src/the/cancer/index.ts”`},`​`)],-1),a(`pre`,null,t(e(f)()),1),c[27]||=a(`h3`,{id:`the-waves-·-src-the-waves-index-ts`,tabindex:`-1`},[r(`The waves · `),a(`code`,null,`src/the/waves/index.ts`),r(),a(`a`,{class:`header-anchor`,href:`#the-waves-·-src-the-waves-index-ts`,"aria-label":`Permalink to “The waves · src/the/waves/index.ts”`},`​`)],-1),a(`pre`,null,t(e(p)()),1),c[28]||=a(`h3`,{id:`the-rosetta-·-src-the-rosetta-index-ts`,tabindex:`-1`},[r(`The rosetta · `),a(`code`,null,`src/the/rosetta/index.ts`),r(),a(`a`,{class:`header-anchor`,href:`#the-rosetta-·-src-the-rosetta-index-ts`,"aria-label":`Permalink to “The rosetta · src/the/rosetta/index.ts”`},`​`)],-1),a(`pre`,null,t(e(ce)()),1),c[29]||=a(`h3`,{id:`the-clown-·-src-the-clown-index-ts`,tabindex:`-1`},[r(`The clown · `),a(`code`,null,`src/the/clown/index.ts`),r(),a(`a`,{class:`header-anchor`,href:`#the-clown-·-src-the-clown-index-ts`,"aria-label":`Permalink to “The clown · src/the/clown/index.ts”`},`​`)],-1),a(`pre`,null,t(e(P)()),1),c[30]||=a(`h3`,{id:`the-law-—-follow-the-license-and-the-sequence-·-src-the-law-index-ts`,tabindex:`-1`},[r(`The law — follow the license and the sequence · `),a(`code`,null,`src/the/law/index.ts`),r(),a(`a`,{class:`header-anchor`,href:`#the-law-—-follow-the-license-and-the-sequence-·-src-the-law-index-ts`,"aria-label":`Permalink to “The law — follow the license and the sequence · src/the/law/index.ts”`},`​`)],-1),a(`pre`,null,t(e(ye)()),1)]),c[85]||=a(`h3`,{id:`the-apple-—-gravity-the-fall-to-a-fixed-point-·-src-the-apple-index-ts`,tabindex:`-1`},[r(`The apple — gravity, the fall to a fixed point · `),a(`code`,null,`src/the/apple/index.ts`),r(),a(`a`,{class:`header-anchor`,href:`#the-apple-—-gravity-the-fall-to-a-fixed-point-·-src-the-apple-index-ts`,"aria-label":`Permalink to “The apple — gravity, the fall to a fixed point · src/the/apple/index.ts”`},`​`)],-1),a(`pre`,null,t(e(be)()),1),c[86]||=a(`h3`,{id:`the-earth-—-the-ground-the-apple-falls-to-·-src-the-apple-earth-index-ts`,tabindex:`-1`},[r(`The earth — the ground the apple falls to · `),a(`code`,null,`src/the/apple/earth/index.ts`),r(),a(`a`,{class:`header-anchor`,href:`#the-earth-—-the-ground-the-apple-falls-to-·-src-the-apple-earth-index-ts`,"aria-label":`Permalink to “The earth — the ground the apple falls to · src/the/apple/earth/index.ts”`},`​`)],-1),a(`pre`,null,t(e(we)()),1),c[87]||=a(`h3`,{id:`the-truth-—-integrity-not-truth-the-deepest-ground-·-src-the-apple-earth-truth-index-ts`,tabindex:`-1`},[r(`The truth — integrity, not truth (the deepest ground) · `),a(`code`,null,`src/the/apple/earth/truth/index.ts`),r(),a(`a`,{class:`header-anchor`,href:`#the-truth-—-integrity-not-truth-the-deepest-ground-·-src-the-apple-earth-truth-index-ts`,"aria-label":`Permalink to “The truth — integrity, not truth (the deepest ground) · src/the/apple/earth/truth/index.ts”`},`​`)],-1),a(`pre`,null,t(e(xe)()),1),c[88]||=a(`h3`,{id:`the-navigation-—-finding-your-way-by-address-·-src-the-apple-earth-navigation-index-ts`,tabindex:`-1`},[r(`The navigation — finding your way by address · `),a(`code`,null,`src/the/apple/earth/navigation/index.ts`),r(),a(`a`,{class:`header-anchor`,href:`#the-navigation-—-finding-your-way-by-address-·-src-the-apple-earth-navigation-index-ts`,"aria-label":`Permalink to “The navigation — finding your way by address · src/the/apple/earth/navigation/index.ts”`},`​`)],-1),a(`pre`,null,t(e(Ee)()),1),c[89]||=a(`h3`,{id:`the-gold-—-the-golden-ratio-by-its-fingerprints-·-src-the-gold-index-ts`,tabindex:`-1`},[r(`The gold — the golden ratio by its fingerprints · `),a(`code`,null,`src/the/gold/index.ts`),r(),a(`a`,{class:`header-anchor`,href:`#the-gold-—-the-golden-ratio-by-its-fingerprints-·-src-the-gold-index-ts`,"aria-label":`Permalink to “The gold — the golden ratio by its fingerprints · src/the/gold/index.ts”`},`​`)],-1),a(`pre`,null,t(e(Oe)()),1),c[90]||=a(`h3`,{id:`the-compass-—-the-golden-angle-·-src-the-gold-compass-index-ts`,tabindex:`-1`},[r(`The compass — the golden angle · `),a(`code`,null,`src/the/gold/compass/index.ts`),r(),a(`a`,{class:`header-anchor`,href:`#the-compass-—-the-golden-angle-·-src-the-gold-compass-index-ts`,"aria-label":`Permalink to “The compass — the golden angle · src/the/gold/compass/index.ts”`},`​`)],-1),a(`pre`,null,t(e(Ae)()),1),c[91]||=a(`h2`,{id:`_0-—-the-substrate-·-content-addressing`,tabindex:`-1`},[a(`code`,null,`0/`),r(` — the substrate · content-addressing `),a(`a`,{class:`header-anchor`,href:`#_0-—-the-substrate-·-content-addressing`,"aria-label":`Permalink to “0/ — the substrate · content-addressing”`},`​`)],-1),c[92]||=a(`h3`,{id:`uuid-trinity-matrix-—-identity-substrate-·-src-0-trinity-matrix-ts`,tabindex:`-1`},[r(`UUID trinity matrix — identity substrate · `),a(`code`,null,`src/0/trinity-matrix.ts`),r(),a(`a`,{class:`header-anchor`,href:`#uuid-trinity-matrix-—-identity-substrate-·-src-0-trinity-matrix-ts`,"aria-label":`Permalink to “UUID trinity matrix — identity substrate · src/0/trinity-matrix.ts”`},`​`)],-1),a(`details`,Xt,[c[31]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(Re)()),1)]),c[93]||=a(`h3`,{id:`content-addressed-audit-ledger-·-src-0-ledger-ts`,tabindex:`-1`},[r(`Content-addressed audit ledger · `),a(`code`,null,`src/0/ledger.ts`),r(),a(`a`,{class:`header-anchor`,href:`#content-addressed-audit-ledger-·-src-0-ledger-ts`,"aria-label":`Permalink to “Content-addressed audit ledger · src/0/ledger.ts”`},`​`)],-1),a(`details`,Zt,[c[32]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(ze)()),1)]),c[94]||=a(`h3`,{id:`singularity-—-one-root-shared-reference-·-src-0-singularity-ts`,tabindex:`-1`},[r(`Singularity — one root, shared reference · `),a(`code`,null,`src/0/singularity.ts`),r(),a(`a`,{class:`header-anchor`,href:`#singularity-—-one-root-shared-reference-·-src-0-singularity-ts`,"aria-label":`Permalink to “Singularity — one root, shared reference · src/0/singularity.ts”`},`​`)],-1),a(`details`,Qt,[c[33]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(Be)()),1)]),c[95]||=a(`h3`,{id:`memory-free-uuid-streams-—-loadable-payload-·-src-0-stream-ts`,tabindex:`-1`},[r(`Memory-free UUID streams — loadable payload · `),a(`code`,null,`src/0/stream.ts`),r(),a(`a`,{class:`header-anchor`,href:`#memory-free-uuid-streams-—-loadable-payload-·-src-0-stream-ts`,"aria-label":`Permalink to “Memory-free UUID streams — loadable payload · src/0/stream.ts”`},`​`)],-1),a(`details`,$t,[c[34]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(He)()),1)]),c[96]||=a(`h3`,{id:`versioning-—-digit-matrix-folded-into-a-merkle-pyramid-·-src-0-version-matrix-ts`,tabindex:`-1`},[r(`Versioning — digit matrix folded into a Merkle pyramid · `),a(`code`,null,`src/0/version-matrix.ts`),r(),a(`a`,{class:`header-anchor`,href:`#versioning-—-digit-matrix-folded-into-a-merkle-pyramid-·-src-0-version-matrix-ts`,"aria-label":`Permalink to “Versioning — digit matrix folded into a Merkle pyramid · src/0/version-matrix.ts”`},`​`)],-1),a(`details`,en,[c[35]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(qe)()),1)]),c[97]||=a(`h3`,{id:`singularity-trinities-—-many-threes-one-root-·-src-0-trinities-ts`,tabindex:`-1`},[r(`Singularity trinities — many threes, one root · `),a(`code`,null,`src/0/trinities.ts`),r(),a(`a`,{class:`header-anchor`,href:`#singularity-trinities-—-many-threes-one-root-·-src-0-trinities-ts`,"aria-label":`Permalink to “Singularity trinities — many threes, one root · src/0/trinities.ts”`},`​`)],-1),a(`details`,tn,[c[36]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(Ye)()),1)]),c[98]||=a(`h3`,{id:`universal-legibility-—-paste-anything-any-verifier-checks-it-·-src-0-legible-ts`,tabindex:`-1`},[r(`Universal legibility — paste anything, any verifier checks it · `),a(`code`,null,`src/0/legible.ts`),r(),a(`a`,{class:`header-anchor`,href:`#universal-legibility-—-paste-anything-any-verifier-checks-it-·-src-0-legible-ts`,"aria-label":`Permalink to “Universal legibility — paste anything, any verifier checks it · src/0/legible.ts”`},`​`)],-1),a(`details`,nn,[c[37]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(Xe)()),1)]),c[99]||=a(`h3`,{id:`no-token-is-a-token-—-the-void-has-an-address-·-src-0-null-token-ts`,tabindex:`-1`},[r(`No token is a token — the void has an address · `),a(`code`,null,`src/0/null-token.ts`),r(),a(`a`,{class:`header-anchor`,href:`#no-token-is-a-token-—-the-void-has-an-address-·-src-0-null-token-ts`,"aria-label":`Permalink to “No token is a token — the void has an address · src/0/null-token.ts”`},`​`)],-1),a(`details`,rn,[c[38]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(Ze)()),1)]),c[100]||=a(`h3`,{id:`holographic-verification-—-the-whole-from-a-tiny-part-merkle-proof-·-src-0-holographic-ts`,tabindex:`-1`},[r(`Holographic verification — the whole from a tiny part (Merkle proof) · `),a(`code`,null,`src/0/holographic.ts`),r(),a(`a`,{class:`header-anchor`,href:`#holographic-verification-—-the-whole-from-a-tiny-part-merkle-proof-·-src-0-holographic-ts`,"aria-label":`Permalink to “Holographic verification — the whole from a tiny part (Merkle proof) · src/0/holographic.ts”`},`​`)],-1),a(`details`,an,[c[39]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(tt)()),1)]),c[101]||=a(`h3`,{id:`release-entanglement-—-each-bound-to-its-neighbours-hash-chain-·-src-0-entanglement-ts`,tabindex:`-1`},[r(`Release entanglement — each bound to its neighbours (hash chain) · `),a(`code`,null,`src/0/entanglement.ts`),r(),a(`a`,{class:`header-anchor`,href:`#release-entanglement-—-each-bound-to-its-neighbours-hash-chain-·-src-0-entanglement-ts`,"aria-label":`Permalink to “Release entanglement — each bound to its neighbours (hash chain) · src/0/entanglement.ts”`},`​`)],-1),a(`details`,on,[c[40]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(nt)()),1)]),c[102]||=a(`h3`,{id:`tokens-are-valid-only-in-the-fusion-—-membership-not-the-token-·-src-0-fusion-ts`,tabindex:`-1`},[r(`Tokens are valid only in the fusion — membership, not the token · `),a(`code`,null,`src/0/fusion.ts`),r(),a(`a`,{class:`header-anchor`,href:`#tokens-are-valid-only-in-the-fusion-—-membership-not-the-token-·-src-0-fusion-ts`,"aria-label":`Permalink to “Tokens are valid only in the fusion — membership, not the token · src/0/fusion.ts”`},`​`)],-1),a(`details`,sn,[c[41]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(rt)()),1)]),c[103]||=a(`h3`,{id:`the-singularity-is-a-limit-—-approached-never-achieved-·-src-0-limit-ts`,tabindex:`-1`},[r(`The singularity is a limit — approached, never achieved · `),a(`code`,null,`src/0/limit.ts`),r(),a(`a`,{class:`header-anchor`,href:`#the-singularity-is-a-limit-—-approached-never-achieved-·-src-0-limit-ts`,"aria-label":`Permalink to “The singularity is a limit — approached, never achieved · src/0/limit.ts”`},`​`)],-1),a(`details`,cn,[c[42]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(it)()),1)]),c[104]||=a(`h2`,{id:`_1-—-the-observer`,tabindex:`-1`},[a(`code`,null,`1/`),r(` — the observer `),a(`a`,{class:`header-anchor`,href:`#_1-—-the-observer`,"aria-label":`Permalink to “1/ — the observer”`},`​`)],-1),c[105]||=a(`h3`,{id:`acceptance-vs-proof-—-what-the-ui-delivers-·-src-1-acceptance-ts`,tabindex:`-1`},[r(`Acceptance vs proof — what the UI delivers · `),a(`code`,null,`src/1/acceptance.ts`),r(),a(`a`,{class:`header-anchor`,href:`#acceptance-vs-proof-—-what-the-ui-delivers-·-src-1-acceptance-ts`,"aria-label":`Permalink to “Acceptance vs proof — what the UI delivers · src/1/acceptance.ts”`},`​`)],-1),a(`details`,ln,[c[43]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(je)()),1)]),c[106]||=a(`h3`,{id:`purity-·-clarity-·-paradox-—-the-limit-of-self-verification-·-src-1-paradox-ts`,tabindex:`-1`},[r(`Purity · clarity · paradox — the limit of self-verification · `),a(`code`,null,`src/1/paradox.ts`),r(),a(`a`,{class:`header-anchor`,href:`#purity-·-clarity-·-paradox-—-the-limit-of-self-verification-·-src-1-paradox-ts`,"aria-label":`Permalink to “Purity · clarity · paradox — the limit of self-verification · src/1/paradox.ts”`},`​`)],-1),a(`details`,un,[c[44]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(Me)()),1)]),c[107]||=a(`h2`,{id:`_2-—-waves-scales`,tabindex:`-1`},[a(`code`,null,`2/`),r(` — waves & scales `),a(`a`,{class:`header-anchor`,href:`#_2-—-waves-scales`,"aria-label":`Permalink to “2/ — waves & scales”`},`​`)],-1),c[108]||=a(`h3`,{id:`frequency-scales-·-src-2-frequency-scales-ts`,tabindex:`-1`},[r(`Frequency scales · `),a(`code`,null,`src/2/frequency-scales.ts`),r(),a(`a`,{class:`header-anchor`,href:`#frequency-scales-·-src-2-frequency-scales-ts`,"aria-label":`Permalink to “Frequency scales · src/2/frequency-scales.ts”`},`​`)],-1),a(`details`,dn,[c[45]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(vt)()),1)]),c[109]||=a(`h3`,{id:`string-planck-scale-vs-432-hz-·-src-2-string-scale-ts`,tabindex:`-1`},[r(`String / Planck scale vs 432 Hz · `),a(`code`,null,`src/2/string-scale.ts`),r(),a(`a`,{class:`header-anchor`,href:`#string-planck-scale-vs-432-hz-·-src-2-string-scale-ts`,"aria-label":`Permalink to “String / Planck scale vs 432 Hz · src/2/string-scale.ts”`},`​`)],-1),a(`details`,fn,[c[46]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(yt)()),1)]),c[110]||=a(`h3`,{id:`primes-on-the-vortex-·-src-2-primes-vortex-ts`,tabindex:`-1`},[r(`Primes on the vortex · `),a(`code`,null,`src/2/primes-vortex.ts`),r(),a(`a`,{class:`header-anchor`,href:`#primes-on-the-vortex-·-src-2-primes-vortex-ts`,"aria-label":`Permalink to “Primes on the vortex · src/2/primes-vortex.ts”`},`​`)],-1),a(`details`,pn,[c[47]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(bt)()),1)]),c[111]||=a(`h3`,{id:`classical-simulator-of-a-quantum-algorithm-—-the-paradox-computes-·-src-quantum-sim-quantum-ts`,tabindex:`-1`},[r(`Classical simulator of a quantum algorithm — the paradox computes · `),a(`code`,null,`src/quantum/sim/quantum.ts`),r(),a(`a`,{class:`header-anchor`,href:`#classical-simulator-of-a-quantum-algorithm-—-the-paradox-computes-·-src-quantum-sim-quantum-ts`,"aria-label":`Permalink to “Classical simulator of a quantum algorithm — the paradox computes · src/quantum/sim/quantum.ts”`},`​`)],-1),a(`details`,mn,[c[48]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(St)()),1)]),c[112]||=a(`h3`,{id:`i-ching-—-exact-binary-combinatorics-26-64-43-·-src-2-iching-ts`,tabindex:`-1`},[r(`I Ching — exact binary combinatorics (2⁶ = 64 = 4³) · `),a(`code`,null,`src/2/iching.ts`),r(),a(`a`,{class:`header-anchor`,href:`#i-ching-—-exact-binary-combinatorics-26-64-43-·-src-2-iching-ts`,"aria-label":`Permalink to “I Ching — exact binary combinatorics (2⁶ = 64 = 4³) · src/2/iching.ts”`},`​`)],-1),a(`details`,hn,[c[49]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(Ct)()),1)]),c[113]||=a(`h2`,{id:`_3-—-random-access-the-trinity`,tabindex:`-1`},[a(`code`,null,`3/`),r(` — random access & the trinity `),a(`a`,{class:`header-anchor`,href:`#_3-—-random-access-the-trinity`,"aria-label":`Permalink to “3/ — random access & the trinity”`},`​`)],-1),c[114]||=a(`h3`,{id:`π-by-random-access-—-bbp-·-src-3-pi-bbp-ts`,tabindex:`-1`},[r(`π by random access — BBP · `),a(`code`,null,`src/3/pi-bbp.ts`),r(),a(`a`,{class:`header-anchor`,href:`#π-by-random-access-—-bbp-·-src-3-pi-bbp-ts`,"aria-label":`Permalink to “π by random access — BBP · src/3/pi-bbp.ts”`},`​`)],-1),a(`details`,gn,[c[50]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(wt)()),1)]),c[115]||=a(`h3`,{id:`singularity-reflects-trinity-—-z-9-as-a-trinity-of-triads-·-src-3-trinity-ts`,tabindex:`-1`},[r(`Singularity reflects trinity — ℤ/9 as a trinity of triads · `),a(`code`,null,`src/3/trinity.ts`),r(),a(`a`,{class:`header-anchor`,href:`#singularity-reflects-trinity-—-z-9-as-a-trinity-of-triads-·-src-3-trinity-ts`,"aria-label":`Permalink to “Singularity reflects trinity — ℤ/9 as a trinity of triads · src/3/trinity.ts”`},`​`)],-1),a(`details`,_n,[c[51]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(Tt)()),1)]),c[116]||=a(`h2`,{id:`_4-—-git-·-content-addressing-for-real`,tabindex:`-1`},[a(`code`,null,`4/`),r(` — git · content-addressing for real `),a(`a`,{class:`header-anchor`,href:`#_4-—-git-·-content-addressing-for-real`,"aria-label":`Permalink to “4/ — git · content-addressing for real”`},`​`)],-1),c[117]||=a(`h3`,{id:`git-trinity-—-blob-·-tree-·-commit-tag-·-src-4-git-ts`,tabindex:`-1`},[r(`git trinity — blob · tree · commit (+ tag) · `),a(`code`,null,`src/4/git.ts`),r(),a(`a`,{class:`header-anchor`,href:`#git-trinity-—-blob-·-tree-·-commit-tag-·-src-4-git-ts`,"aria-label":`Permalink to “git trinity — blob · tree · commit (+ tag) · src/4/git.ts”`},`​`)],-1),a(`details`,vn,[c[52]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(Et)()),1)]),c[118]||=a(`h2`,{id:`_6-—-development-dna-·-heredity`,tabindex:`-1`},[a(`code`,null,`6/`),r(` — development DNA · heredity `),a(`a`,{class:`header-anchor`,href:`#_6-—-development-dna-·-heredity`,"aria-label":`Permalink to “6/ — development DNA · heredity”`},`​`)],-1),c[119]||=a(`h3`,{id:`development-dna-—-git-lineage-the-genetic-code-·-src-6-dna-ts`,tabindex:`-1`},[r(`development DNA — git lineage & the genetic code · `),a(`code`,null,`src/6/dna.ts`),r(),a(`a`,{class:`header-anchor`,href:`#development-dna-—-git-lineage-the-genetic-code-·-src-6-dna-ts`,"aria-label":`Permalink to “development DNA — git lineage & the genetic code · src/6/dna.ts”`},`​`)],-1),a(`details`,yn,[c[53]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(Dt)()),1)]),c[120]||=a(`h2`,{id:`_5-—-the-center-·-reflection-folds`,tabindex:`-1`},[a(`code`,null,`5/`),r(` — the center · reflection & folds `),a(`a`,{class:`header-anchor`,href:`#_5-—-the-center-·-reflection-folds`,"aria-label":`Permalink to “5/ — the center · reflection & folds”`},`​`)],-1),c[121]||=a(`h3`,{id:`the-thesis-decomposed-and-computed-·-src-5-aspects-ts`,tabindex:`-1`},[r(`The thesis, decomposed and computed · `),a(`code`,null,`src/5/aspects.ts`),r(),a(`a`,{class:`header-anchor`,href:`#the-thesis-decomposed-and-computed-·-src-5-aspects-ts`,"aria-label":`Permalink to “The thesis, decomposed and computed · src/5/aspects.ts”`},`​`)],-1),a(`details`,bn,[c[54]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(ot)()),1)]),c[122]||=a(`h3`,{id:`reflection-—-z-9-·-src-5-reflection-ts`,tabindex:`-1`},[r(`Reflection — ℤ/9 · `),a(`code`,null,`src/5/reflection.ts`),r(),a(`a`,{class:`header-anchor`,href:`#reflection-—-z-9-·-src-5-reflection-ts`,"aria-label":`Permalink to “Reflection — ℤ/9 · src/5/reflection.ts”`},`​`)],-1),a(`details`,xn,[c[55]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(ct)()),1)]),c[123]||=a(`h3`,{id:`development-goes-on-in-involutions-·-src-5-development-ts`,tabindex:`-1`},[r(`Development goes on in involutions · `),a(`code`,null,`src/5/development.ts`),r(),a(`a`,{class:`header-anchor`,href:`#development-goes-on-in-involutions-·-src-5-development-ts`,"aria-label":`Permalink to “Development goes on in involutions · src/5/development.ts”`},`​`)],-1),a(`details`,Sn,[c[56]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(lt)()),1)]),c[124]||=a(`h3`,{id:`folds-·-src-5-folds-ts`,tabindex:`-1`},[r(`Folds · `),a(`code`,null,`src/5/folds.ts`),r(),a(`a`,{class:`header-anchor`,href:`#folds-·-src-5-folds-ts`,"aria-label":`Permalink to “Folds · src/5/folds.ts”`},`​`)],-1),a(`details`,Cn,[c[57]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(ut)()),1)]),c[125]||=a(`h3`,{id:`the-diamond-—-the-fixed-point-that-perfectly-reflects-poincare-h-0-·-src-5-diamond-ts`,tabindex:`-1`},[r(`The diamond — the fixed point that perfectly reflects (Poincaré, H=0) · `),a(`code`,null,`src/5/diamond.ts`),r(),a(`a`,{class:`header-anchor`,href:`#the-diamond-—-the-fixed-point-that-perfectly-reflects-poincare-h-0-·-src-5-diamond-ts`,"aria-label":`Permalink to “The diamond — the fixed point that perfectly reflects (Poincaré, H=0) · src/5/diamond.ts”`},`​`)],-1),a(`details`,wn,[c[58]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(dt)()),1)]),c[126]||=a(`h3`,{id:`the-centre-5-—-reflection-∧-doubling-the-two-operations-·-src-5-center-ts`,tabindex:`-1`},[r(`The centre 5 — reflection ∧ doubling, the two operations · `),a(`code`,null,`src/5/center.ts`),r(),a(`a`,{class:`header-anchor`,href:`#the-centre-5-—-reflection-∧-doubling-the-two-operations-·-src-5-center-ts`,"aria-label":`Permalink to “The centre 5 — reflection ∧ doubling, the two operations · src/5/center.ts”`},`​`)],-1),a(`details`,Tn,[c[59]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(ft)()),1)]),c[127]||=a(`h3`,{id:`the-impossibilities-—-every-not-verified-by-exhaustion-·-src-0-impossible-ts`,tabindex:`-1`},[r(`The impossibilities — every NOT, verified by exhaustion · `),a(`code`,null,`src/0/impossible.ts`),r(),a(`a`,{class:`header-anchor`,href:`#the-impossibilities-—-every-not-verified-by-exhaustion-·-src-0-impossible-ts`,"aria-label":`Permalink to “The impossibilities — every NOT, verified by exhaustion · src/0/impossible.ts”`},`​`)],-1),a(`details`,En,[c[60]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(at)()),1)]),c[128]||=a(`h2`,{id:`_7-—-the-rosette-·-7-6-1`,tabindex:`-1`},[a(`code`,null,`7/`),r(` — the rosette · 7 = 6 + 1 `),a(`a`,{class:`header-anchor`,href:`#_7-—-the-rosette-·-7-6-1`,"aria-label":`Permalink to “7/ — the rosette · 7 = 6 + 1”`},`​`)],-1),c[129]||=a(`h3`,{id:`the-rays-—-2×7-walked-in-the-z-7-orbit-·-src-7-rays-ts`,tabindex:`-1`},[r(`The rays — 2×7, walked in the (ℤ/7)* orbit · `),a(`code`,null,`src/7/rays.ts`),r(),a(`a`,{class:`header-anchor`,href:`#the-rays-—-2×7-walked-in-the-z-7-orbit-·-src-7-rays-ts`,"aria-label":`Permalink to “The rays — 2×7, walked in the (ℤ/7)* orbit · src/7/rays.ts”`},`​`)],-1),a(`details`,Dn,[c[61]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(he)()),1)]),c[130]||=a(`h3`,{id:`pliska-rosette-—-z-7-·-src-7-rosetta-ts`,tabindex:`-1`},[r(`Pliska rosette — (ℤ/7)* · `),a(`code`,null,`src/7/rosetta.ts`),r(),a(`a`,{class:`header-anchor`,href:`#pliska-rosette-—-z-7-·-src-7-rosetta-ts`,"aria-label":`Permalink to “Pliska rosette — (ℤ/7)* · src/7/rosetta.ts”`},`​`)],-1),a(`details`,On,[c[62]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(pt)()),1)]),c[131]||=a(`h3`,{id:`rosette-⊕-clay-—-the-7-6-1-fusion-·-src-7-rosetta-clay-ts`,tabindex:`-1`},[r(`Rosette ⊕ Clay — the 7 = 6 + 1 fusion · `),a(`code`,null,`src/7/rosetta-clay.ts`),r(),a(`a`,{class:`header-anchor`,href:`#rosette-⊕-clay-—-the-7-6-1-fusion-·-src-7-rosetta-clay-ts`,"aria-label":`Permalink to “Rosette ⊕ Clay — the 7 = 6 + 1 fusion · src/7/rosetta-clay.ts”`},`​`)],-1),a(`details`,kn,[c[63]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(mt)()),1)]),c[132]||=a(`h3`,{id:`_7-dimensional-strings-—-where-7-really-appears-·-src-7-string-dimensions-ts`,tabindex:`-1`},[r(`7-dimensional strings — where 7 really appears · `),a(`code`,null,`src/7/string-dimensions.ts`),r(),a(`a`,{class:`header-anchor`,href:`#_7-dimensional-strings-—-where-7-really-appears-·-src-7-string-dimensions-ts`,"aria-label":`Permalink to “7-dimensional strings — where 7 really appears · src/7/string-dimensions.ts”`},`​`)],-1),a(`details`,An,[c[64]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(Ot)()),1)]),c[133]||=a(`h3`,{id:`the-7-dimensional-lens-—-reflect-singularity-clay-·-src-7-lens-ts`,tabindex:`-1`},[r(`The 7-dimensional lens — reflect(singularity, clay) · `),a(`code`,null,`src/7/lens.ts`),r(),a(`a`,{class:`header-anchor`,href:`#the-7-dimensional-lens-—-reflect-singularity-clay-·-src-7-lens-ts`,"aria-label":`Permalink to “The 7-dimensional lens — reflect(singularity, clay) · src/7/lens.ts”`},`​`)],-1),a(`details`,jn,[c[65]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(At)()),1)]),c[134]||=a(`h3`,{id:`_7d-ui-from-locale-—-self-localizing-chrome-·-src-7-locale-ts`,tabindex:`-1`},[r(`7D UI from locale — self-localizing chrome · `),a(`code`,null,`src/7/locale.ts`),r(),a(`a`,{class:`header-anchor`,href:`#_7d-ui-from-locale-—-self-localizing-chrome-·-src-7-locale-ts`,"aria-label":`Permalink to “7D UI from locale — self-localizing chrome · src/7/locale.ts”`},`​`)],-1),a(`details`,Mn,[c[66]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(I)()),1)]),c[135]||=a(`h3`,{id:`the-language-lens-—-languages-dialects-as-strings-·-src-7-language-lens-ts`,tabindex:`-1`},[r(`The language lens — languages & dialects as strings · `),a(`code`,null,`src/7/language-lens.ts`),r(),a(`a`,{class:`header-anchor`,href:`#the-language-lens-—-languages-dialects-as-strings-·-src-7-language-lens-ts`,"aria-label":`Permalink to “The language lens — languages & dialects as strings · src/7/language-lens.ts”`},`​`)],-1),a(`details`,Nn,[c[67]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(jt)()),1)]),c[136]||=a(`h3`,{id:`seven-star-rosette-·-glagolitic-·-the-sequence-·-src-7-glagolitic-ts`,tabindex:`-1`},[r(`Seven-star rosette · Glagolitic · the sequence · `),a(`code`,null,`src/7/glagolitic.ts`),r(),a(`a`,{class:`header-anchor`,href:`#seven-star-rosette-·-glagolitic-·-the-sequence-·-src-7-glagolitic-ts`,"aria-label":`Permalink to “Seven-star rosette · Glagolitic · the sequence · src/7/glagolitic.ts”`},`​`)],-1),a(`details`,$,[c[68]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(Nt)()),1)]),c[137]||=a(`h3`,{id:`the-6×7-7×6-cross-—-42-combinations-one-singularity-·-src-7-cross-ts`,tabindex:`-1`},[r(`The 6×7 / 7×6 cross — 42 combinations, one singularity · `),a(`code`,null,`src/7/cross.ts`),r(),a(`a`,{class:`header-anchor`,href:`#the-6×7-7×6-cross-—-42-combinations-one-singularity-·-src-7-cross-ts`,"aria-label":`Permalink to “The 6×7 / 7×6 cross — 42 combinations, one singularity · src/7/cross.ts”`},`​`)],-1),a(`details`,Pn,[c[69]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(Pt)()),1)]),c[138]||=a(`h3`,{id:`version-as-unix-permissions-→-rbac-·-src-7-rbac-ts`,tabindex:`-1`},[r(`Version as Unix permissions → RBAC · `),a(`code`,null,`src/7/rbac.ts`),r(),a(`a`,{class:`header-anchor`,href:`#version-as-unix-permissions-→-rbac-·-src-7-rbac-ts`,"aria-label":`Permalink to “Version as Unix permissions → RBAC · src/7/rbac.ts”`},`​`)],-1),a(`details`,Fn,[c[70]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(It)()),1)]),c[139]||=a(`h2`,{id:`_8-—-geometry-nucleus`,tabindex:`-1`},[a(`code`,null,`8/`),r(` — geometry & nucleus `),a(`a`,{class:`header-anchor`,href:`#_8-—-geometry-nucleus`,"aria-label":`Permalink to “8/ — geometry & nucleus”`},`​`)],-1),c[140]||=a(`h3`,{id:`geometry-—-cube-→-hexagon-→-metatron-·-src-8-merkaba-geometry-ts`,tabindex:`-1`},[r(`Geometry — cube → hexagon → Metatron · `),a(`code`,null,`src/8/merkaba/geometry.ts`),r(),a(`a`,{class:`header-anchor`,href:`#geometry-—-cube-→-hexagon-→-metatron-·-src-8-merkaba-geometry-ts`,"aria-label":`Permalink to “Geometry — cube → hexagon → Metatron · src/8/merkaba/geometry.ts”`},`​`)],-1),a(`details`,In,[c[71]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(ht)()),1)]),c[141]||=a(`h3`,{id:`merkaba-magnetic-field-—-biot–savart-·-src-8-merkaba-field-ts`,tabindex:`-1`},[r(`Merkaba magnetic field — Biot–Savart · `),a(`code`,null,`src/8/merkaba/field.ts`),r(),a(`a`,{class:`header-anchor`,href:`#merkaba-magnetic-field-—-biot–savart-·-src-8-merkaba-field-ts`,"aria-label":`Permalink to “Merkaba magnetic field — Biot–Savart · src/8/merkaba/field.ts”`},`​`)],-1),a(`details`,Ln,[c[72]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(gt)()),1)]),c[142]||=a(`h3`,{id:`merkabas-move-when-touched-—-the-field-responds-to-spin-·-src-8-merkaba-touch-ts`,tabindex:`-1`},[r(`Merkabas move when touched — the field responds to spin · `),a(`code`,null,`src/8/merkaba/touch.ts`),r(),a(`a`,{class:`header-anchor`,href:`#merkabas-move-when-touched-—-the-field-responds-to-spin-·-src-8-merkaba-touch-ts`,"aria-label":`Permalink to “Merkabas move when touched — the field responds to spin · src/8/merkaba/touch.ts”`},`​`)],-1),a(`details`,Rn,[c[73]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(Rt)()),1)]),c[143]||=a(`h3`,{id:`nuclear-shell-model-magic-numbers-·-src-8-nucleus-shell-model-magic-ts`,tabindex:`-1`},[r(`Nuclear shell-model magic numbers · `),a(`code`,null,`src/8/nucleus/shell-model-magic.ts`),r(),a(`a`,{class:`header-anchor`,href:`#nuclear-shell-model-magic-numbers-·-src-8-nucleus-shell-model-magic-ts`,"aria-label":`Permalink to “Nuclear shell-model magic numbers · src/8/nucleus/shell-model-magic.ts”`},`​`)],-1),a(`details`,zn,[c[74]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(_t)()),1)]),c[144]||=a(`h3`,{id:`proton-mass-fit-·-src-8-nucleus-proton-mass-fit-ts`,tabindex:`-1`},[r(`Proton mass fit · `),a(`code`,null,`src/8/nucleus/proton-mass-fit.ts`),r(),a(`a`,{class:`header-anchor`,href:`#proton-mass-fit-·-src-8-nucleus-proton-mass-fit-ts`,"aria-label":`Permalink to “Proton mass fit · src/8/nucleus/proton-mass-fit.ts”`},`​`)],-1),a(`details`,Bn,[c[75]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(Lt)()),1)]),c[145]||=a(`h3`,{id:`finite-is-infinite-by-nature-—-finite-rules-infinite-behavior-·-src-8-infinite-ts`,tabindex:`-1`},[r(`Finite is infinite by nature — finite rules, infinite behavior · `),a(`code`,null,`src/8/infinite.ts`),r(),a(`a`,{class:`header-anchor`,href:`#finite-is-infinite-by-nature-—-finite-rules-infinite-behavior-·-src-8-infinite-ts`,"aria-label":`Permalink to “Finite is infinite by nature — finite rules, infinite behavior · src/8/infinite.ts”`},`​`)],-1),a(`details`,Vn,[c[76]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(zt)()),1)]),c[146]||=a(`h2`,{id:`_9-—-the-many-·-enumeration-society-funding`,tabindex:`-1`},[a(`code`,null,`9/`),r(` — the many · enumeration, society, funding `),a(`a`,{class:`header-anchor`,href:`#_9-—-the-many-·-enumeration-society-funding`,"aria-label":`Permalink to “9/ — the many · enumeration, society, funding”`},`​`)],-1),c[147]||=a(`h3`,{id:`z-9-enumeration-·-src-9-enumeration-ts`,tabindex:`-1`},[r(`ℤ/9 enumeration · `),a(`code`,null,`src/9/enumeration.ts`),r(),a(`a`,{class:`header-anchor`,href:`#z-9-enumeration-·-src-9-enumeration-ts`,"aria-label":`Permalink to “ℤ/9 enumeration · src/9/enumeration.ts”`},`​`)],-1),a(`details`,Hn,[c[77]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(st)()),1)]),c[148]||=a(`h3`,{id:`live-society-—-alive-by-participation-·-src-9-society-ts`,tabindex:`-1`},[r(`Live society — alive by participation · `),a(`code`,null,`src/9/society.ts`),r(),a(`a`,{class:`header-anchor`,href:`#live-society-—-alive-by-participation-·-src-9-society-ts`,"aria-label":`Permalink to “Live society — alive by participation · src/9/society.ts”`},`​`)],-1),a(`details`,Un,[c[78]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(Ne)()),1)]),c[149]||=a(`h3`,{id:`public-security-—-transparency-not-secrecy-·-src-9-security-ts`,tabindex:`-1`},[r(`Public security — transparency, not secrecy · `),a(`code`,null,`src/9/security.ts`),r(),a(`a`,{class:`header-anchor`,href:`#public-security-—-transparency-not-secrecy-·-src-9-security-ts`,"aria-label":`Permalink to “Public security — transparency, not secrecy · src/9/security.ts”`},`​`)],-1),a(`details`,Wn,[c[79]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(Pe)()),1)]),c[150]||=a(`h3`,{id:`public-access-trinity-—-everyone-has-the-latest-token-·-src-9-access-ts`,tabindex:`-1`},[r(`Public-access trinity — everyone has the latest token · `),a(`code`,null,`src/9/access.ts`),r(),a(`a`,{class:`header-anchor`,href:`#public-access-trinity-—-everyone-has-the-latest-token-·-src-9-access-ts`,"aria-label":`Permalink to “Public-access trinity — everyone has the latest token · src/9/access.ts”`},`​`)],-1),a(`details`,Gn,[c[80]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(Fe)()),1)]),c[151]||=a(`h3`,{id:`license-funding-—-the-cycle-·-src-9-funding-ts`,tabindex:`-1`},[r(`License & funding — the cycle · `),a(`code`,null,`src/9/funding.ts`),r(),a(`a`,{class:`header-anchor`,href:`#license-funding-—-the-cycle-·-src-9-funding-ts`,"aria-label":`Permalink to “License & funding — the cycle · src/9/funding.ts”`},`​`)],-1),a(`details`,Kn,[c[81]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(ue)()),1)]),c[152]||=a(`h3`,{id:`the-two-coins-—-donated-to-ceccec-itself-·-src-9-coins-ts`,tabindex:`-1`},[r(`The two coins — donated to ceccec itself · `),a(`code`,null,`src/9/coins.ts`),r(),a(`a`,{class:`header-anchor`,href:`#the-two-coins-—-donated-to-ceccec-itself-·-src-9-coins-ts`,"aria-label":`Permalink to “The two coins — donated to ceccec itself · src/9/coins.ts”`},`​`)],-1),a(`details`,qn,[c[82]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(Ie)()),1)]),c[153]||=a(`h3`,{id:`funding-⇄-aura-—-the-sustaining-loop-·-src-9-aura-funding-ts`,tabindex:`-1`},[r(`funding ⇄ aura — the sustaining loop · `),a(`code`,null,`src/9/aura-funding.ts`),r(),a(`a`,{class:`header-anchor`,href:`#funding-⇄-aura-—-the-sustaining-loop-·-src-9-aura-funding-ts`,"aria-label":`Permalink to “funding ⇄ aura — the sustaining loop · src/9/aura-funding.ts”`},`​`)],-1),a(`details`,Jn,[c[83]||=a(`summary`,null,`compute`,-1),a(`pre`,null,t(e(Le)()),1)])]))}});export{Yn as __pageData,Xn as default};