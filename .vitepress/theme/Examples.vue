<script setup lang="ts">
// Live worked examples, organised by theorem. Every output below is computed here, from the real src/
// functions — recompute the page and they recompute. Integrity, not truth. 0/7.
import { ref, computed } from 'vue'
import { withBase } from 'vitepress'
import { toUuid, strictUuidna } from '../../src/0/index.ts'
import { imprint, readImprint, imprintTextChain, readImprintTextChain, CAPACITY } from '../../src/0/imprint.ts'
import { merkleRoot, merkleProof, verifyProof } from '../../src/0/merkle-proof.ts'
import { billUuidna } from '../../src/9/funding.ts'

const trunc = (s: string) => s.slice(0, 13) + '…'
const domainChallenge = (d: string) => toUuid('uuidna:domain-control:' + d.toLowerCase())

// 1 — content address (interactive)
const seed = ref('integrity, not truth')
const addr = computed(() => toUuid(seed.value))

// 2 — message codec (a bounded message rides inside one uuid)
const msg = '10110100101'
const carrier = imprint(msg)
const decoded = readImprint(carrier)

// 3 — text chain (any-length text across N uuids)
const text = 'uuidna carries this whole sentence across a chain, and reads it back exactly.'
const chain = imprintTextChain(text)
const textBack = readImprintTextChain(chain)

// 4 — holographic proof (one leaf verifies the whole root)
const leaves = Array.from({ length: 64 }, (_, i) => toUuid('leaf' + i))
const root = merkleRoot(leaves)
const proof = merkleProof(leaves, 37)
const proofOk = verifyProof(leaves[37], proof, root)
const forgeOk = verifyProof(toUuid('not-a-leaf'), proof, root)

// 5 — strict minting (same value, same address)
const mintNum = strictUuidna(3)
const mintStr = strictUuidna('3')

// 6 — independent domain control
const orgToken = domainChallenge('uuidna.org')

// 7 — measured billing (bits saved, conserved coins)
const bill = billUuidna({ commercial: true, recomputeOps: 100000, verifyOps: 1 })
const billFree = billUuidna({ commercial: false, recomputeOps: 100000, verifyOps: 1 })
</script>

<template>
  <div class="examples">
    <p class="lead">Every value below is <strong>computed live</strong> from the <code>src/</code> functions — recompute
      the page and it recomputes. A content-address proves <strong>integrity, not truth</strong>. <code>0/7</code>.</p>

    <section>
      <h3>1 · Content address <a :href="withBase('/theorem/a_content_address_is_a_pointer_not_the_payload')">theorem ↗</a></h3>
      <p>Type anything — its content-address recomputes deterministically. A pointer, not the payload.</p>
      <p><input v-model="seed" class="in" /> → <code>{{ addr }}</code></p>
    </section>

    <section>
      <h3>2 · Message codec <a :href="withBase('/theorem/yes_a_uuid_imprints_a_bounded_cryptographic_receipt_efficiency_is_the_skill_the_rule_decides')">theorem ↗</a></h3>
      <p>A bounded message (≤ {{ CAPACITY }} bits) rides <em>inside</em> one uuid and reads back exactly.</p>
      <p>imprint(<code>{{ msg }}</code>) = <code>{{ carrier }}</code> → readImprint = <code>{{ decoded }}</code> · <strong>{{ decoded === msg ? '✓ exact' : '✗' }}</strong></p>
    </section>

    <section>
      <h3>3 · Text chain <a :href="withBase('/theorem/uuidna_carries_arbitrary_text_of_any_length_across_a_uuid_chain_round_tripping')">theorem ↗</a></h3>
      <p>Arbitrary text spans a chain of uuids, round-tripping exactly.</p>
      <p>“{{ text }}” → <strong>{{ chain.length }}</strong> uuid carriers → <strong>{{ textBack === text ? '✓ recovered exactly' : '✗' }}</strong></p>
    </section>

    <section>
      <h3>4 · Holographic proof <a :href="withBase('/theorem/uuidna_hologram_fractals_a_merkle_proof_verifies_the_whole_from_a_tiny_part_logarithmically')">theorem ↗</a></h3>
      <p>One leaf verifies against the whole root from a logarithmic audit path; a forged leaf fails.</p>
      <p>64 leaves, root <code>{{ trunc(root) }}</code> · proof for leaf 37 = <strong>{{ proof.length }}</strong> hashes · verifies <strong>{{ proofOk ? '✓' : '✗' }}</strong> · forgery <strong>{{ forgeOk ? '✗ (bad)' : '✓ rejected' }}</strong></p>
    </section>

    <section>
      <h3>5 · Strict minting <a :href="withBase('/theorem/strict_uuidna_minting_is_canonical_closing_the_minting_flaws_that_cause_real_damage')">theorem ↗</a></h3>
      <p>Canonical: the same logical value always mints the same address.</p>
      <p>strictUuidna(<code>3</code>) = <code>{{ trunc(mintNum) }}</code> · strictUuidna(<code>'3'</code>) = <code>{{ trunc(mintStr) }}</code> · <strong>{{ mintNum === mintStr ? '✓ same' : '✗' }}</strong></p>
    </section>

    <section>
      <h3>6 · Independent domain control <a :href="withBase('/theorem/uuidna_domain_control_is_verified_independently_by_a_published_challenge_not_by_anyones_word')">theorem ↗</a></h3>
      <p>Publish this token at <code>uuidna.org</code>; anyone recomputes and checks — control by publication, not by anyone's word.</p>
      <p>challenge(<code>uuidna.org</code>) = <code>{{ orgToken }}</code></p>
    </section>

    <section>
      <h3>7 · Measured billing <a :href="withBase('/theorem/the_correct_uuidna_billing_is_the_measured_bit_difference_not_a_flat_per_formula_rate')">theorem ↗</a></h3>
      <p>The value is the <em>measured</em> bit-difference (O(N) recompute − O(1) verify); the two coins are the conserved invariant.</p>
      <p>commercial, 100000 recompute vs 1 verify → <strong>{{ bill.bitsSaved }}</strong> bits, <strong>{{ bill.coins }}</strong> coins · non-commercial → <strong>{{ billFree.free ? 'free' : '' }}</strong></p>
    </section>
  </div>
</template>

<style scoped>
.examples { margin: 1rem 0; }
.examples .lead { color: var(--vp-c-text-2); }
.examples section { border: 1px solid var(--vp-c-divider); border-radius: 10px; padding: .5rem 1rem; margin: .8rem 0; }
.examples h3 { margin: .3rem 0 .4rem; font-size: 1.02rem; }
.examples h3 a { font-size: .78rem; font-weight: 500; }
.examples code { font-size: .82em; word-break: break-all; }
.examples p { margin: .35rem 0; font-size: .92rem; }
.examples .in { width: 16rem; max-width: 100%; padding: .25rem .5rem; border: 1px solid var(--vp-c-divider); border-radius: 6px; background: var(--vp-c-bg); color: var(--vp-c-text-1); }
</style>
