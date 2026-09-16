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
