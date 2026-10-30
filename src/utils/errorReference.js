/**
 * One short reference per page load, shown to the user when something breaks
 * and attached to every request and every error report.
 *
 * The point is a single string a user can read down the phone to support,
 * which support can then find on both sides of the wire:
 *
 *   - the frontend sends it as `X-Client-Reference` on every API call
 *     (see axiosInstance), so it reaches the backend's request logs;
 *   - errorReporter includes it in the payload it POSTs, so the same string
 *     identifies the crash itself.
 *
 * Per page load rather than per request on purpose: a user reporting "it broke"
 * cannot tell you which request failed, but they can read the one reference
 * their tab is showing, and that narrows the backend logs to a single session's
 * worth of calls.
 */

// Crockford-ish: no vowels, so a reference can never read as a word, and no
// characters that are ambiguous when read aloud or written down (0/O, 1/I/L).
const ALPHABET = "23456789CFGHJKMPQRTVWXY";
const LENGTH = 8;

const randomValues = (count) => {
  const values = new Uint8Array(count);

  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(values);
    return values;
  }

  // Older or non-browser environments (jsdom without webcrypto, mostly). The
  // reference only has to be unlikely to collide between two users on the
  // phone to support on the same day, so Math.random is sufficient here.
  for (let i = 0; i < count; i += 1) {
    values[i] = Math.floor(Math.random() * 256);
  }
  return values;
};

const generate = () => {
  const values = randomValues(LENGTH);
  let reference = "";

  for (let i = 0; i < LENGTH; i += 1) {
    reference += ALPHABET[values[i] % ALPHABET.length];
  }

  return `PA-${reference}`;
};

let reference = null;

/**
 * The reference for this page load, generated on first use.
 *
 * @returns {string} e.g. "PA-7FK3Q9WC"
 */
export const getErrorReference = () => {
  if (!reference) reference = generate();
  return reference;
};

/** Test seam: forget the current reference so the next read generates one. */
export const resetErrorReference = () => {
  reference = null;
};

export default getErrorReference;
