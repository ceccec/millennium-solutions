<script setup lang="ts">
// Clay is the main lead: the seven Millennium problems as the deposit records them. The author's claim is
// rendered verbatim, in his name, with his Zenodo deposits; each problem carries the one theorem that stands
// beside it, the statement the kernel decided and over how many cases, the BOUND (what it establishes and, in
// the same sentence, what it does not), and the ledger receipt. Nothing is typed in this component — it all
// comes from the build-time loader, which reads the sealed sources.
import { data } from './clay.data.ts'
const claim = data.author.text.replace(/\n/g, ' ')
</script>

<template>
  <section class="clay">
    <blockquote class="claim">
      <p><strong>{{ data.author.who }}</strong> {{ claim }}.</p>
      <p class="deposits">
        Deposited as
        <template v-for="(d, i) in data.author.deposits" :key="d.href">
          <a :href="d.href" target="_blank" rel="noopener">{{ d.label }}</a><span v-if="i < data.author.deposits.length - 1"> and </span>
        </template>.
      </p>
      <p class="note">{{ data.author.note }}</p>
    </blockquote>

    <p class="reads">Each line below is read out of the tree on every build: the statement from
      <code>src/proof/index.lean</code>, the case count from the statement, the receipt from the ledger. The
      <strong>bound</strong> states what the theorem establishes and, in the same sentence, what it does not.</p>

    <article v-for="p in data.seven" :key="p.theorem" class="lead">
      <header>
        <h3>{{ p.problem }}</h3>
        <span class="cases">{{ p.tactic }} · {{ p.cases.toLocaleString('en-US') }} cases</span>
      </header>
      <p class="name">{{ p.name }}</p>
      <pre class="stmt"><code>{{ p.statement }}</code></pre>
      <p class="bound"><span class="tag">bound</span> {{ p.bound }}</p>
      <p class="links">
        <a :href="`/theorem/${p.key}`"><code>{{ p.key }}</code></a>
        <span class="receipt">receipt {{ p.receipt }}</span>
        <a :href="p.outlet" target="_blank" rel="noopener" class="clay-link">{{ p.outletName }}</a>
      </p>
    </article>
  </section>
</template>

<style scoped>
.clay{display:flex;flex-direction:column;gap:18px;margin:20px 0}
.claim{margin:0;padding:16px 18px;border-left:4px solid var(--vp-c-brand-1);
  background:var(--vp-c-bg-soft);border-radius:0 10px 10px 0}
.claim p{margin:0 0 6px;line-height:1.55}
.claim p:last-child{margin-bottom:0}
.claim .deposits{font-size:.9rem;color:var(--vp-c-text-2)}
.claim .note{font-size:.84rem;color:var(--vp-c-text-3);font-style:italic}
.reads{font-size:.9rem;color:var(--vp-c-text-2);margin:0}
.lead{border:1px solid var(--vp-c-border);border-radius:10px;padding:14px 16px;background:var(--vp-c-bg)}
.lead header{display:flex;flex-wrap:wrap;gap:6px 12px;align-items:baseline;justify-content:space-between}
.lead h3{margin:0;font-size:1.02rem;line-height:1.3;border:none;padding:0}
.cases{font-family:var(--vp-font-family-mono);font-size:.74rem;color:var(--vp-c-text-3);white-space:nowrap}
.name{margin:4px 0 10px;color:var(--vp-c-text-2);font-size:.92rem}
.stmt{overflow-x:auto;margin:0 0 10px;padding:10px 12px;background:var(--vp-c-bg-alt);
  border-radius:8px;border:1px solid var(--vp-c-divider)}
.stmt code{font-family:var(--vp-font-family-mono);font-size:.8rem;white-space:pre;color:var(--vp-c-text-1)}
.bound{margin:0 0 10px;font-size:.9rem;color:var(--vp-c-text-1);line-height:1.5}
.tag{display:inline-block;font-family:var(--vp-font-family-mono);font-size:.68rem;font-weight:600;
  letter-spacing:.05em;text-transform:uppercase;color:var(--vp-c-brand-1);
  border:1px solid var(--vp-c-brand-soft);border-radius:5px;padding:1px 6px;margin-right:6px;vertical-align:1px}
.links{display:flex;flex-wrap:wrap;gap:6px 14px;align-items:baseline;margin:0;font-size:.82rem}
.links .receipt{font-family:var(--vp-font-family-mono);color:var(--vp-c-text-3)}
.links .clay-link{margin-left:auto}
@media (max-width:520px){.links .clay-link{margin-left:0}}
</style>
