import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

process.env.TZ = "UTC";

afterEach(() => {
  cleanup();
});

// Radix UI's dropdown-menu components (FocusScope, DismissableLayer, Presence,
// Menu, PopperContent) tear themselves down via requestAnimationFrame after a
// selection closes the menu. That teardown resolves on its own tick, outside
// any act() scope our tests control, and jsdom has no real animation timing
// to make it resolve earlier. It's cosmetic noise, not a test bug — silence it
// without hiding act() warnings from our own components.
const RADIX_ACT_WARNING_SOURCES = [
  "FocusScope",
  "DismissableLayer",
  "Presence",
  "PopperContent",
  "Menu",
];

const originalConsoleError = console.error;
console.error = (...args) => {
  const [firstArg] = args;
  if (typeof firstArg === "string") {
    // React logs this with a %s placeholder — the component name (e.g.
    // "FocusScope") is a separate arg, not part of this string, so it must
    // be matched against the full args list, not just firstArg.
    const isActWarning = firstArg.includes("was not wrapped in act(...)");
    const isSuspenseWarning = firstArg.includes(
      "A component suspended inside an `act` scope",
    );
    if (isSuspenseWarning) {
      return;
    }
    if (isActWarning) {
      const mentionsRadixComponent = args.some(
        (arg) =>
          typeof arg === "string" &&
          RADIX_ACT_WARNING_SOURCES.some((name) => arg.includes(name)),
      );
      if (mentionsRadixComponent) {
        return;
      }
    }
  }
  originalConsoleError(...args);
};

if (!window.matchMedia) {
  window.matchMedia = () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

if (!window.ResizeObserver) {
  window.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false;
}
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = () => {};
}
if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = () => {};
}
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
