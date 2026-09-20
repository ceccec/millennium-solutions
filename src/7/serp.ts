// THE SEARCH-RESULT LINE, DECLARED ONCE. A page's <title> is assembled from the page's own words plus the
// site suffix, and a gate refuses it above a cap. Before this file the suffix was typed in two places and
// the cap in one, with a third file — scripts/changelog.ts — choosing its title by counting characters by
// hand against a limit it could not see. That title shipped at 61 against a cap of 60 and refused the
// release one character over, in the commit whose message said the title now fits a search result.
//
// Nothing here is a policy anyone has to remember: the suffix and the caps live here, everything that
// composes or judges a title reads them, and `fitsSerp` answers the one question all of them are asking.
export const SITE_NAME = 'Millennium Solutions'
export const SITE_SUFFIX = ` | ${SITE_NAME}`

// A page a person titled gets what a search result shows. The author chose the words, so the words fit.
export const TITLE_CAP = 60

// A theorem page is titled by its DECLARATION — the name the kernel checked. Cutting
// `the_orbit_is_one_closed_loop_of_six_distinct_points` to 60 would leave
// `the_orbit_is_one_closed_loop_of_six_d` and destroy the one thing the page is for. Its cap is the
// declaration's own, set where the heading is derived in theorem/[key].paths.ts, plus the suffix.
export const DECLARATION_CAP = 72 + SITE_SUFFIX.length

/** The rendered <title> for a page titled `t` — the same string .vitepress/config.ts emits. */
export const serpTitle = (t: string): string => (t ? t + SITE_SUFFIX : SITE_NAME)

/** Does a page's own title survive the suffix without the search result truncating it? */
export const fitsSerp = (t: string, cap: number = TITLE_CAP): boolean => serpTitle(t).length <= cap

/** The longest page title that still fits — what a generator has to write within. */
export const serpRoom = (cap: number = TITLE_CAP): number => cap - SITE_SUFFIX.length
