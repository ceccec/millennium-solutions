// Single source of the Content-Security-Policy — imported by .vitepress/config.ts (head) AND
// scripts/locale-fold.ts (stubs), so the policy is declared ONCE, never hardcoded twice (no drift).
// Self-contained: no external scripts/styles/fonts/img/connect. 'unsafe-inline' is required (VitePress
// injects inline check-dark-mode/check-mac-os scripts + inline style attributes; meta-CSP can't use
// nonces) — so this hardens RESOURCE ORIGIN, not full anti-XSS. The deterministic guarantee is the
// external-import gate (scripts/import-gate.ts) + the security gate (scripts/security-gate.ts).
export const CSP =
  "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; " +
  "img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; " +
  "base-uri 'self'; form-action 'self'; frame-ancestors 'none'"
