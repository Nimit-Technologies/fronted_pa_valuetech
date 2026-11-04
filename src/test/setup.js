import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement ResizeObserver; @uppy/dashboard needs it to mount.
if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
