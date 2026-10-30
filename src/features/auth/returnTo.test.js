import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  clearReturnTo,
  rememberCurrentPath,
  rememberReturnTo,
  takeReturnTo,
} from "@/features/auth/returnTo";

describe("returnTo", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("hands back the path it was given, once", () => {
    rememberReturnTo("/cordinator/case/view/42");

    expect(takeReturnTo()).toBe("/cordinator/case/view/42");
    // Read once: a path must not be replayed on the next person's login.
    expect(takeReturnTo()).toBeNull();
  });

  it("keeps the query string and hash, which carry filters and anchors", () => {
    rememberReturnTo("/branch-admin/case?status=visit_schedule#row-3");

    expect(takeReturnTo()).toBe(
      "/branch-admin/case?status=visit_schedule#row-3",
    );
  });

  it("ignores the login screen, which would be a redirect loop", () => {
    rememberReturnTo("/");
    expect(takeReturnTo()).toBeNull();

    rememberReturnTo("/login");
    expect(takeReturnTo()).toBeNull();
  });

  // A protocol-relative URL is the open-redirect shape: the browser reads
  // "//evil.test/x" as another host, so a crafted link could bounce a
  // freshly-authenticated user straight off this site.
  it("refuses anything that is not an in-app path", () => {
    for (const hostile of [
      "//evil.test/phish",
      "/\\evil.test/phish",
      "https://evil.test/phish",
      "javascript:alert(1)",
      "engineer/case",
      "",
      null,
      undefined,
      42,
    ]) {
      rememberReturnTo(hostile);
      expect(takeReturnTo()).toBeNull();
    }
  });

  it("rejects a hostile value that was written into storage by hand", () => {
    window.sessionStorage.setItem("pa:returnTo", "//evil.test/phish");

    expect(takeReturnTo()).toBeNull();
  });

  it("remembers where the browser currently is", () => {
    rememberCurrentPath();

    // jsdom starts at "/", which is the login screen and so not worth
    // returning to.
    expect(takeReturnTo()).toBeNull();

    window.history.pushState({}, "", "/engineer/report/create/7?step=2");
    rememberCurrentPath();

    expect(takeReturnTo()).toBe("/engineer/report/create/7?step=2");
  });

  it("forgets the path on request", () => {
    rememberReturnTo("/super-admin/user");
    clearReturnTo();

    expect(takeReturnTo()).toBeNull();
  });

  // Private browsing and blocked site data make these throw rather than
  // return null. Losing the return path is fine; taking the login screen down
  // with it is not.
  it("survives sessionStorage being unavailable", () => {
    vi.stubGlobal("sessionStorage", {
      getItem: () => {
        throw new Error("SecurityError");
      },
      setItem: () => {
        throw new Error("SecurityError");
      },
      removeItem: () => {
        throw new Error("SecurityError");
      },
    });

    expect(() => rememberReturnTo("/engineer/case")).not.toThrow();
    expect(() => clearReturnTo()).not.toThrow();
    expect(takeReturnTo()).toBeNull();
  });
});
