---
title: Compare — standards vs the local
head:
  - ['meta', { name: 'robots', content: 'index, follow' }]
---

# Compare — the cryptographic standards and the local content-address

> The honest question is not "which is best" — it is "what is each **for**." This table puts the deposit's content-address next to the identity, hashing, authentication, and messaging standards, one factual property per column. Read the deposit's row against the others.

<StandardsCompare />

## What the table is saying

- The deposit's `toUuid` is a **content-address**, built on FNV-1a — a **non-cryptographic** hash by design. It is deterministic and public: anyone can recompute it with no key. That is its strength for *identity and integrity*, and exactly why it offers **no** secrecy.
- It is **not** a messaging system and **not** encryption. For confidentiality use AES; for authentication use HMAC; for private messaging use a protocol like Signal. The deposit does not compete there — it is a different tool.
- A single address **cannot store** an unbounded state — 128 bits is a fixed-width fingerprint, so by the pigeonhole principle it *references* a state, it does not *contain* it. You still need the data to recover it. ([proof](/theorem/a_content_address_is_a_pointer_not_the_payload))
- Standards **break** — MD5 fell to collisions, SHA-1 fell (SHAttered). That is why "most secure" is not a claim anyone can make: security is provisional, always subject to the next cryptanalysis. And every finite digest — strong or weak — must eventually collide by pigeonhole. ([proof](/theorem/gravity_is_the_fall_to_a_fixed_point_and_pigeonhole_breaks_every_finite_hash))

The deposit claims **fitness for content-addressing**, not supremacy. A content-address proves **integrity, not truth**. `entails → 0/7`.
