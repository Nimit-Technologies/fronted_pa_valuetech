/**
 * Per-feature persistence for a table's current page number, so paging state
 * can survive a remount instead of snapping back to page 1. Every access is
 * guarded — a disabled or unavailable localStorage must never take the table
 * down with it.
 *
 * Note: only useful for lists whose rows are also cached (redux, react-query,
 * …). A list that always refetches its first page on mount has nothing to
 * resume onto, so it should leave `restorePage` off in usePaginationController.
 */
const KEY_PREFIX = "pagination:page:";

const storageKey = (featureKey) => `${KEY_PREFIX}${featureKey}`;

export const paginationStorage = {
  getPage(featureKey) {
    try {
      const page = Number(window.localStorage.getItem(storageKey(featureKey)));
      return Number.isInteger(page) && page > 0 ? page : null;
    } catch {
      return null;
    }
  },

  savePage(featureKey, page) {
    try {
      window.localStorage.setItem(storageKey(featureKey), String(page));
    } catch {
      /* storage unavailable — paging just won't persist */
    }
  },

  clearPage(featureKey) {
    try {
      window.localStorage.removeItem(storageKey(featureKey));
    } catch {
      /* no-op */
    }
  },
};
