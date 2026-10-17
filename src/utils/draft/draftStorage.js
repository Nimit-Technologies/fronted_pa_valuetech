// A half-filled form, kept so that leaving the page and coming back does not
// cost the user what they typed. Navigating away unmounts the form and takes
// its useState with it, which is why this sits outside React entirely.
//
// sessionStorage rather than the localStorage the paginated lists use: a draft
// belongs to the tab it was typed in. Two tabs on the same form keep their own,
// and closing the tab discards the customer's details instead of leaving them
// on disk — these drafts hold names, phone numbers and addresses.
const KEY_PREFIX = "draft:";

const storageKey = (key) => `${KEY_PREFIX}${key}`;

export const draftStorage = {
  // `undefined` means there is no draft. A stored `null` is a real value — an
  // unpicked bank — so the two cannot be collapsed.
  read(key) {
    try {
      const raw = window.sessionStorage.getItem(storageKey(key));
      return raw === null ? undefined : JSON.parse(raw);
    } catch {
      // Storage unavailable, or a value a previous build wrote in another
      // shape. Either way there is nothing to restore.
      return undefined;
    }
  },

  write(key, value) {
    try {
      window.sessionStorage.setItem(storageKey(key), JSON.stringify(value));
    } catch {
      /* storage unavailable or full — the draft just won't survive a reload */
    }
  },

  remove(key) {
    try {
      window.sessionStorage.removeItem(storageKey(key));
    } catch {
      /* no-op */
    }
  },
};
