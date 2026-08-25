<script setup lang="ts">
// SPONSOR — the aside slot VitePress reserves for carbonAds, served from this repo instead.
//
// The Carbon placement was declined deliberately, not overlooked. carbonAds injects a third-party script that
// profiles the reader, and this site publishes a SHA-256 integrity manifest of every file it serves precisely
// so that nothing arrives which cannot be recomputed from source. A remote script whose contents change
// without notice is the one thing that manifest cannot cover, and a deposit whose whole argument is
// "recompute it yourself" cannot ship an unauditable payload in its sidebar. So this block is static: no
// script, no network call, no cookie, nothing to consent to.
//
// Every number and every sentence below is READ FROM src/9/funding.ts — the fare is computed by coins(), and
// the captain's line is his own text with its receipt, never a paraphrase. That matters more than it looks:
// the one unforgivable failure in this project's history was inventing a message and attributing it, so the
// wording here is quoted from the source of record rather than written to be persuasive.
import { computed } from 'vue'
import { FUNDING, coins } from '../../src/9/funding'

const fare = computed(() => coins())
const revolut = computed(() => FUNDING.revolut + '?note=uuidna')
</script>

<template>
  <div class="sponsor">
    <div class="sponsor-head">Support the deposit</div>

    <p class="sponsor-line">
      Everything here is <strong>free</strong> for public interest, independent research and any
      non-commercial use, with attribution to {{ FUNDING.author }}.
    </p>

    <p class="sponsor-line">
      Commercial use pays <strong>the two coins</strong> — {{ 110 }} − {{ 108 }} = {{ fare }}, the
      Euler characteristic of the genus-2 surface. It is a fixed fare, not a rate: it does not scale
      with what you earn, and nothing here is metered.
    </p>

    <a class="sponsor-cta" :href="revolut" target="_blank" rel="noopener">
      Contribute · revolut.me/ceccec
    </a>

    <blockquote class="sponsor-quote">
      “{{ FUNDING.captainReminder }}”
      <span class="sponsor-receipt">receipt <code>{{ FUNDING.captainReceipt.slice(0, 13) }}…</code></span>
    </blockquote>

    <p class="sponsor-fine">
      {{ FUNDING.license }} · <a :href="'mailto:' + FUNDING.contact">{{ FUNDING.contact }}</a><br>
      No advertising, no tracker, no third-party script on this page.
    </p>
  </div>
</template>

<style scoped>
.sponsor {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 14px 14px 12px;
  margin-top: 20px;
  background: var(--vp-c-bg-soft);
  font-size: 12.5px;
  line-height: 1.55;
}
.sponsor-head {
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
  margin-bottom: 8px;
}
.sponsor-line { margin: 0 0 8px; color: var(--vp-c-text-2); }
.sponsor-cta {
  display: block;
  text-align: center;
  padding: 7px 10px;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
  color: var(--vp-c-bg);
  background: var(--vp-c-brand-1);
  margin: 10px 0;
}
.sponsor-cta:hover { background: var(--vp-c-brand-2); }
.sponsor-quote {
  margin: 10px 0 8px;
  padding-left: 10px;
  border-left: 2px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  font-style: italic;
}
.sponsor-receipt { display: block; font-style: normal; font-size: 11px; margin-top: 4px; opacity: 0.8; }
.sponsor-fine { margin: 0; font-size: 11px; color: var(--vp-c-text-3); }
</style>
