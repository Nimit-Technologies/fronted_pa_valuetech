import { describe, it, expect, afterEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import OfflineBanner from "@/components/shared/offlineBanner";

// navigator.onLine is a getter on the prototype in jsdom, so it is patched
// there and restored afterwards rather than assigned to.
const setOnLine = (value) =>
  Object.defineProperty(window.navigator, "onLine", {
    value,
    configurable: true,
  });

const fire = (type) => act(() => window.dispatchEvent(new Event(type)));

describe("OfflineBanner", () => {
  afterEach(() => {
    setOnLine(true);
  });

  it("stays out of the way while the connection is up", () => {
    setOnLine(true);
    render(<OfflineBanner />);

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("explains the lost connection, and that work is not lost with it", () => {
    setOnLine(false);
    render(<OfflineBanner />);

    const banner = screen.getByRole("status");
    expect(banner).toHaveTextContent(/no internet connection/i);
    expect(banner).toHaveTextContent(/keep working/i);
    // Announced, because losing the connection changes what the next tap does.
    expect(banner).toHaveAttribute("aria-live", "assertive");
  });

  it("appears and clears with the browser's own events", () => {
    setOnLine(true);
    render(<OfflineBanner />);

    setOnLine(false);
    fire("offline");
    expect(screen.getByRole("status")).toBeInTheDocument();

    setOnLine(true);
    fire("online");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
