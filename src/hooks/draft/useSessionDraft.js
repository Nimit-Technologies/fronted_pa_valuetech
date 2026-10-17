import { useCallback, useEffect, useState } from "react";
import { draftStorage } from "@/utils/draft/draftStorage";

// useState that survives the component being unmounted: the value is mirrored
// into the tab's sessionStorage on every change and read back when the
// component mounts again. Clicking through to another route and pressing Back
// is a remount, so this is what keeps a form's input from being lost on the way.
//
// `revive` validates what came out of storage. It is given the parsed value and
// returns the state to use, or `undefined` to start fresh — a draft written by
// an earlier build can be any shape, and restoring it unchecked moves the
// failure into the code that reads the fields.
//
// Passing a null `key` turns persistence off, which is what the callers that
// only sometimes want a draft use.
const useSessionDraft = (key, initialValue, revive) => {
  // Captured once, as state rather than as a ref: its identity doubles as
  // "nothing has been typed yet", which the write below reads while rendering
  // — something a ref is not allowed to be used for.
  const [pristine] = useState(initialValue);

  const [value, setValue] = useState(() => {
    if (!key) return pristine;

    const stored = draftStorage.read(key);
    if (stored === undefined) return pristine;

    const revived = revive ? revive(stored) : stored;
    return revived === undefined ? pristine : revived;
  });

  useEffect(() => {
    // Compared by identity, not by value: on a first mount with no draft to
    // restore — and again right after clear() — `value` is still the very
    // object the caller passed in. Writing that would leave an empty draft in
    // storage to be restored later, which is the opposite of clearing it.
    if (!key || value === pristine) return;
    draftStorage.write(key, value);
  }, [key, value, pristine]);

  const clear = useCallback(() => {
    if (key) draftStorage.remove(key);
    setValue(pristine);
  }, [key, pristine]);

  return [value, setValue, clear];
};

export default useSessionDraft;
