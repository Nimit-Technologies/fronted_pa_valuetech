import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, render } from "@testing-library/react";
import { usePaginationController } from "@/hooks/pagination/usePaginationController";
import { paginationStorage } from "@/utils/pagination/paginationStorage";

const Probe = ({ onReady, ...options }) => {
  onReady(usePaginationController(options));
  return null;
};

const setup = (options = {}) => {
  let controller;
  const onFetch = options.onFetch ?? vi.fn();
  const utils = render(
    <Probe
      featureKey="case"
      onFetch={onFetch}
      onReady={(value) => {
        controller = value;
      }}
      {...options}
    />,
  );

  return { get: () => controller, onFetch, ...utils };
};

// The cursor is the page: there is no page number to ask the server for, so
// "next" means "the rows after this page's last id".
describe("usePaginationController", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it("starts on page one", () => {
    const { get } = setup();
    expect(get().currentPage).toBe(1);
  });

  it("refuses to go next when the server says there is no next page", () => {
    const { get, onFetch } = setup({ hasNextPage: false, lastId: "c2" });

    expect(get().canGoNext).toBe(false);
    act(() => get().handleNext());

    expect(onFetch).not.toHaveBeenCalled();
    expect(get().currentPage).toBe(1);
  });

  it("refuses to go back from the first page even if the server offers one", () => {
    // hasPreviousPage is true for any cursor-based request, including the
    // first page's, so the page number is what actually guards this.
    const { get, onFetch } = setup({ hasPreviousPage: true, firstId: "c1" });

    expect(get().canGoPrevious).toBe(false);
    act(() => get().handlePrevious());

    expect(onFetch).not.toHaveBeenCalled();
  });

  it("fetches forward from the last id and counts the page up", () => {
    const { get, onFetch } = setup({ hasNextPage: true, lastId: "c2" });

    act(() => get().handleNext());

    expect(onFetch).toHaveBeenCalledWith({ direction: "next", cursorId: "c2" });
    expect(get().currentPage).toBe(2);
  });

  it("fetches backward from the first id and counts the page down", () => {
    const { get, onFetch } = setup({
      hasNextPage: true,
      hasPreviousPage: true,
      firstId: "c3",
      lastId: "c4",
    });

    act(() => get().handleNext());
    act(() => get().handlePrevious());

    expect(onFetch).toHaveBeenLastCalledWith({
      direction: "previous",
      cursorId: "c3",
    });
    expect(get().currentPage).toBe(1);
  });

  it("never counts below page one", () => {
    const { get } = setup({ hasPreviousPage: true, firstId: "c1" });

    act(() => get().handlePrevious());
    act(() => get().handlePrevious());

    expect(get().currentPage).toBe(1);
  });

  it("locks both directions while a request is in flight", () => {
    const { get } = setup({
      isLoading: true,
      hasNextPage: true,
      hasPreviousPage: true,
      lastId: "c2",
    });

    expect(get().canGoNext).toBe(false);
    expect(get().canGoPrevious).toBe(false);
  });

  it("locks both directions while a search is resolving", () => {
    const { get } = setup({
      isSearching: true,
      hasNextPage: true,
      hasPreviousPage: true,
      lastId: "c2",
    });

    expect(get().canGoNext).toBe(false);
    expect(get().canGoPrevious).toBe(false);
  });

  it("resets to page one, so the next mount does not restore the old page", () => {
    const { get, unmount } = setup({
      hasNextPage: true,
      lastId: "c2",
      restorePage: true,
    });

    act(() => get().handleNext());
    expect(paginationStorage.getPage("case")).toBe(2);

    act(() => get().resetToFirstPage());
    expect(get().currentPage).toBe(1);
    unmount();

    // The reset clears the stored page and the save effect then records the
    // new current page, so what survives is page one either way.
    const remounted = setup({ restorePage: true });
    expect(remounted.get().currentPage).toBe(1);
  });

  it("clears a stored page left behind by a screen that was restoring one", () => {
    paginationStorage.savePage("case", 5);

    // Without restorePage nothing re-saves, so the clear is the whole effect.
    const { get } = setup();
    act(() => get().resetToFirstPage());

    expect(paginationStorage.getPage("case")).toBeNull();
  });

  it("restores the page it was left on only when asked to", () => {
    paginationStorage.savePage("case", 4);

    const { get } = setup({ restorePage: true });
    expect(get().currentPage).toBe(4);
  });

  it("ignores a stored page by default, so a fresh mount starts at one", () => {
    paginationStorage.savePage("case", 4);

    const { get } = setup();
    expect(get().currentPage).toBe(1);
  });
});
