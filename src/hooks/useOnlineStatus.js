import { useSyncExternalStore } from "react";

/**
 * Whether the browser currently has a network connection.
 *
 * `navigator.onLine` is only as good as the operating system's guess — it is
 * true on a captive-portal wifi that routes nowhere — so this is for telling a
 * user why their last action failed, never for deciding whether to attempt a
 * request. The request is attempted regardless; axios reports the truth.
 *
 * Offline support proper is out of scope for the MVP (the SOW lists it as
 * future scope), so this exists to keep an engineer in the field from losing a
 * half-filled report to a silent failure: nothing unmounts, the form keeps its
 * state, and the banner says what is wrong.
 *
 * useSyncExternalStore rather than useState plus an effect: `navigator.onLine`
 * is an external value that can change between render and subscription — on a
 * slow first paint over a dropping connection — and this reads the value at
 * render time instead of catching up with a setState afterwards.
 */

// Module scope keeps the identity stable across renders, so React subscribes
// once rather than tearing the listeners down on every commit.
const subscribe = (onChange) => {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);

  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
};

// `!== false` rather than a plain read: a non-browser environment without a
// navigator must come out online, not offline, or every test renders the
// banner.
const getSnapshot = () =>
  typeof navigator === "undefined" ? true : navigator.onLine !== false;

export const useOnlineStatus = () =>
  useSyncExternalStore(subscribe, getSnapshot, () => true);

export default useOnlineStatus;
