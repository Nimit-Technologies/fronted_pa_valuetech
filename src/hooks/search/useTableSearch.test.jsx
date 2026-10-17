import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { useTableSearch } from "@/hooks/search/useTableSearch";

// A probe rather than renderHook: this hook's contract is what a table ends up
// rendering, and the rows it returns are easiest to read off the DOM.
const Probe = ({ data, serverSearch, onReady }) => {
  const search = useTableSearch({
    data,
    keys: ["customer_name", "file_number"],
    serverSearch,
  });

  onReady?.(search);

  return (
    <div>
      <ul data-testid="rows">
        {search.filteredData.map((row) => (
          <li key={row.id}>{row.customer_name}</li>
        ))}
      </ul>
      <span data-testid="searching">{String(search.isSearching)}</span>
      <span data-testid="filtered">{String(search.isFiltered)}</span>
    </div>
  );
};

const PAGE = [
  { id: "c1", customer_name: "Rahul Sharma", file_number: "ABC/1" },
  { id: "c2", customer_name: "Vikram Singh", file_number: "ABC/2" },
];

const rows = () =>
  Array.from(document.querySelectorAll('[data-testid="rows"] li')).map(
    (li) => li.textContent,
  );

let api;
const renderProbe = (props = {}) => {
  render(<Probe data={PAGE} serverSearch={props.serverSearch} {...props} />);
};

// The hook debounces by 300ms, so every assertion has to step time forward.
const typeAndSettle = async (value, advanceBy = 300) => {
  act(() => api.onSearchChange(value));
  await act(async () => {
    vi.advanceTimersByTime(advanceBy);
  });
};

describe("useTableSearch", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    api = null;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const capture = (search) => {
    api = search;
  };

  it("returns the whole page until the term is long enough to narrow it", async () => {
    renderProbe({ onReady: capture });

    await typeAndSettle("R");

    expect(rows()).toEqual(["Rahul Sharma", "Vikram Singh"]);
    expect(screen.getByTestId("filtered")).toHaveTextContent("false");
  });

  it("matches the rows already loaded without calling the server", async () => {
    const serverSearch = vi.fn();
    renderProbe({ serverSearch, onReady: capture });

    await typeAndSettle("vikram");

    expect(rows()).toEqual(["Vikram Singh"]);
    expect(serverSearch).not.toHaveBeenCalled();
  });

  it("ignores case and surrounding whitespace", async () => {
    const serverSearch = vi.fn();
    renderProbe({ serverSearch, onReady: capture });

    await typeAndSettle("   VIKRAM   ");

    expect(rows()).toEqual(["Vikram Singh"]);
    expect(serverSearch).not.toHaveBeenCalled();
  });

  it("falls back to the server only when the loaded page has no match", async () => {
    const serverSearch = vi
      .fn()
      .mockResolvedValue([
        { id: "c9", customer_name: "Meera Iyer", file_number: "ABC/9" },
      ]);
    renderProbe({ serverSearch, onReady: capture });

    await typeAndSettle("meera");

    expect(serverSearch).toHaveBeenCalledWith("meera");
    expect(rows()).toEqual(["Meera Iyer"]);
  });

  it("answers a repeated search from cache instead of calling the API again", async () => {
    const serverSearch = vi
      .fn()
      .mockResolvedValue([
        { id: "c9", customer_name: "Meera Iyer", file_number: "ABC/9" },
      ]);
    renderProbe({ serverSearch, onReady: capture });

    await typeAndSettle("meera");
    expect(serverSearch).toHaveBeenCalledTimes(1);

    await typeAndSettle("");
    await typeAndSettle("meera");

    expect(serverSearch).toHaveBeenCalledTimes(1);
    expect(rows()).toEqual(["Meera Iyer"]);
  });

  it("fires one request for a term typed in quick succession", async () => {
    const serverSearch = vi.fn().mockResolvedValue([]);
    renderProbe({ serverSearch, onReady: capture });

    act(() => {
      api.onSearchChange("me");
      api.onSearchChange("mee");
      api.onSearchChange("meera");
    });
    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(serverSearch).toHaveBeenCalledTimes(1);
    expect(serverSearch).toHaveBeenCalledWith("meera");
  });

  it("keeps the newest results when an older response lands after them", async () => {
    let settleFirst;
    const serverSearch = vi
      .fn()
      // "meera" — slow, and asked for first
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            settleFirst = resolve;
          }),
      )
      // "kavya" — answers immediately
      .mockResolvedValueOnce([
        { id: "c8", customer_name: "Kavya Rao", file_number: "ABC/8" },
      ]);

    renderProbe({ serverSearch, onReady: capture });

    await typeAndSettle("meera");
    await typeAndSettle("kavya");

    expect(rows()).toEqual(["Kavya Rao"]);

    // The first request finally answers. It must not overwrite the newer
    // match — before the request-id guard this left filteredData falling back
    // to the whole page, so the user's results disappeared.
    await act(async () => {
      settleFirst([
        { id: "c9", customer_name: "Meera Iyer", file_number: "ABC/9" },
      ]);
    });

    expect(rows()).toEqual(["Kavya Rao"]);
  });

  it("restores the full page when the search is cleared", async () => {
    const serverSearch = vi.fn().mockResolvedValue([]);
    renderProbe({ serverSearch, onReady: capture });

    await typeAndSettle("vikram");
    expect(rows()).toEqual(["Vikram Singh"]);

    await typeAndSettle("");

    expect(rows()).toEqual(["Rahul Sharma", "Vikram Singh"]);
    expect(screen.getByTestId("filtered")).toHaveTextContent("false");
  });

  it("reports no match when neither the page nor the server has one", async () => {
    const serverSearch = vi.fn().mockResolvedValue([]);
    renderProbe({ serverSearch, onReady: capture });

    await typeAndSettle("nobody");

    expect(rows()).toEqual([]);
    expect(screen.getByTestId("searching")).toHaveTextContent("false");
  });

  it("clears the searching flag when the server request fails", async () => {
    const serverSearch = vi.fn().mockRejectedValue(new Error("Network Error"));
    renderProbe({ serverSearch, onReady: capture });

    await typeAndSettle("meera");

    expect(screen.getByTestId("searching")).toHaveTextContent("false");
    expect(rows()).toEqual([]);
  });

  it("does not cache a failed search, so a retry still reaches the server", async () => {
    const serverSearch = vi
      .fn()
      .mockRejectedValueOnce(new Error("Network Error"))
      .mockResolvedValueOnce([
        { id: "c9", customer_name: "Meera Iyer", file_number: "ABC/9" },
      ]);
    renderProbe({ serverSearch, onReady: capture });

    await typeAndSettle("meera");
    await typeAndSettle("");
    await typeAndSettle("meera");

    expect(serverSearch).toHaveBeenCalledTimes(2);
    expect(rows()).toEqual(["Meera Iyer"]);
  });
});
