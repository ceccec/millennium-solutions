// THE CI-ONLY TESTS: the checks that observe live services. They run in continuous integration, where the network is
// required and an absent network is a failure, never a skip. They are not part of the local hooks. Each entry is a script
// name under scripts/. The checker reports this list in full every time it runs: nothing here is hidden.
export const CI_ONLY_SCRIPTS = [
  'net-tools-test',
  'answer-doi-test',
  'answer-tool-test',
  'fallbacks-test',
  'doi-precedence-test',
  'clay-conditions-test',
] as const
