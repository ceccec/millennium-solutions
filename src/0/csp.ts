// Single source of the Content-Security-Policy — imported by .vitepress/config.ts (head) AND
// scripts/locale-fold.ts (stubs), so the policy is declared ONCE, never hardcoded twice (no drift).
// Self-contained: no external scripts/styles/fonts/img/connect. 'unsafe-inline' is required (VitePress
// injects inline check-dark-mode/check-mac-os scripts + inline style attributes; meta-CSP can't use
// nonces) — so this hardens RESOURCE ORIGIN, not full anti-XSS. The deterministic guarantee is the
// external-import gate (scripts/import-gate.ts) + the security gate (scripts/security-gate.ts).
// THREE DIRECTIVES ARE IGNORED IN A <meta> CSP, AND ONE OF THEM WAS THE CLICKJACKING DEFENCE.
// `frame-ancestors 'none'` sat in this string and the browser discarded it on every page load, saying so in
// the console: "The Content Security Policy directive 'frame-ancestors' is ignored when delivered via a
// <meta> element." It is header-only by specification, along with `sandbox` and `report-uri`. The site read
// as protected against framing and was not — a rule that can never apply, which is the same defect as a CSS
// selector nothing sets, one layer up and with a security consequence.
//
// It is not deleted, because the protection is real wherever a header CAN be set. It is separated: META is
// what a page carries, HEADER_ONLY is what a host must send, and the two are joined for any host that can.
// GitHub Pages cannot, so this deployment states the gap instead of appearing to cover it — and
// scripts/security-gate.ts refuses a meta CSP that contains a directive the browser will throw away.
export const CSP_HEADER_ONLY = "frame-ancestors 'none'"

export const CSP =
  "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; " +
  "img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; " +
  "base-uri 'self'; form-action 'self'"

/** The whole policy, for a host that can set an HTTP header — everything the meta carries, plus the
 *  directives a meta tag cannot. Nothing serves this today; it exists so the protection is one edit away
 *  rather than one rediscovery away. */
export const CSP_FULL = CSP + '; ' + CSP_HEADER_ONLY
