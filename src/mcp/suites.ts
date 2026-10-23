// THE SUITES: the single list. The runner runs these, and the MCP tool run_suite offers exactly these names.
export const SUITES: Record<string, string[]> = {
  'mcp-gate': ['node', 'scripts/mcp-gate.ts'],
  'hardcode-gate': ['node', 'scripts/hardcode-gate.ts'],
  'mcp-check': ['node', 'scripts/mcp-check.ts'],
  'mcp-calls': ['node', 'scripts/mcp-calls.ts'],
  'net-tools-test': ['node', 'scripts/net-tools-test.ts'],
  'clay-conditions-self-test': ['node', 'scripts/clay-conditions-test.ts', '--self-test'],
  'clay-conditions': ['node', 'scripts/clay-conditions-test.ts'],
  'environment': ['node', 'scripts/environment.ts'],
  'answer-doi': ['node', 'scripts/answer-doi-test.ts'],
  'answer-tool': ['node', 'scripts/answer-tool-test.ts'],
  'fallbacks': ['node', 'scripts/fallbacks-test.ts'],
}
