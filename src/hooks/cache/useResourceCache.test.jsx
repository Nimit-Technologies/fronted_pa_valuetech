import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import cacheReducer from "@/store/slice/cache/cacheSlice";
import userReducer from "@/store/slice/user/userSlice";
import { buildCacheKey } from "@/hooks/cache/useResourceCache";

// The network seam. useAllUser calls this; counting it is the whole point.
const allUserApi = vi.fn();
vi.mock("@/features/superAdmin/services/user/allUser", () => ({
  default: (...args) => allUserApi(...args),
}));

const { default: useAllUser } =
  await import("@/features/superAdmin/hooks/user/useAllUser");
const { default: useCreateUser } =
  await import("@/features/superAdmin/hooks/user/useCreateUser");

vi.mock("@/features/superAdmin/services/user/createUser", () => ({
  default: vi.fn(async () => ({ message: "created", data: { id: "u9" } })),
}));

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const makeStore = () =>
  configureStore({
    reducer: { cache: cacheReducer, user: userReducer },
  });

const wrapperFor = (store) => {
  const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );
  return Wrapper;
};

const PAGE = {
  data: [{ id: "u1", first_name: "A", last_name: "B" }],
  userFirstId: "u1",
  userLastId: "u1",
  hasNextPage: false,
  hasPreviousPage: false,
  dataLimit: 10,
  userLength: 1,
};

beforeEach(() => {
  allUserApi.mockReset();
  allUserApi.mockResolvedValue(PAGE);
});

describe("buildCacheKey", () => {
  it("is stable regardless of argument order", () => {
    expect(buildCacheKey({ a: 1, b: 2 })).toBe(buildCacheKey({ b: 2, a: 1 }));
  });

  it("ignores empty and undefined values, so defaults collapse to one key", () => {
    expect(buildCacheKey({ direction: "next", cursorId: "", search: "" })).toBe(
      buildCacheKey({ direction: "next" }),
    );
  });

  it("separates different queries", () => {
    expect(buildCacheKey({ search: "ann" })).not.toBe(
      buildCacheKey({ search: "bob" }),
    );
  });
});

describe("useAllUser request suppression", () => {
  it("fetches once, then serves the identical query from the store", async () => {
    const store = makeStore();
    const { result } = renderHook(() => useAllUser(), {
      wrapper: wrapperFor(store),
    });

    await act(async () => {
      await result.current.allUser();
    });
    expect(allUserApi).toHaveBeenCalledTimes(1);

    // What a remount or a reopened dropdown does.
    await act(async () => {
      await result.current.allUser();
      await result.current.allUser();
    });
    expect(allUserApi).toHaveBeenCalledTimes(1);
  });

  it("returns the stored rows on a cached call", async () => {
    const store = makeStore();
    const { result } = renderHook(() => useAllUser(), {
      wrapper: wrapperFor(store),
    });

    await act(async () => {
      await result.current.allUser();
    });
    let rows;
    await act(async () => {
      rows = await result.current.allUser();
    });
    expect(rows).toEqual(PAGE.data);
  });

  it("still fetches when the query differs", async () => {
    const store = makeStore();
    const { result } = renderHook(() => useAllUser(), {
      wrapper: wrapperFor(store),
    });

    await act(async () => {
      await result.current.allUser();
      await result.current.allUser({ search: "ann" });
      await result.current.allUser({ cursorId: "u1" });
    });
    expect(allUserApi).toHaveBeenCalledTimes(3);
  });

  it("refetches when force is passed, which is what mutations use", async () => {
    const store = makeStore();
    const { result } = renderHook(() => useAllUser(), {
      wrapper: wrapperFor(store),
    });

    await act(async () => {
      await result.current.allUser();
      await result.current.allUser({ force: true });
    });
    expect(allUserApi).toHaveBeenCalledTimes(2);
  });

  it("refetches after the cache is invalidated", async () => {
    const store = makeStore();
    const { result } = renderHook(() => useAllUser(), {
      wrapper: wrapperFor(store),
    });

    await act(async () => {
      await result.current.allUser();
    });
    act(() => {
      result.current.invalidateUsers();
    });
    await act(async () => {
      await result.current.allUser();
    });
    expect(allUserApi).toHaveBeenCalledTimes(2);
  });

  it("a create invalidates, so the list reloads instead of hiding the new row", async () => {
    const store = makeStore();
    const wrapper = wrapperFor(store);
    const list = renderHook(() => useAllUser(), { wrapper });
    const create = renderHook(() => useCreateUser(), { wrapper });

    await act(async () => {
      await list.result.current.allUser();
    });
    expect(allUserApi).toHaveBeenCalledTimes(1);

    await act(async () => {
      await create.result.current.create({ employee_id: "e9" });
    });

    // This is the navigate-back-to-the-list case.
    await act(async () => {
      await list.result.current.allUser();
    });
    expect(allUserApi).toHaveBeenCalledTimes(2);
  });

  it("expires after the TTL", async () => {
    vi.useFakeTimers();
    try {
      const store = makeStore();
      const { result } = renderHook(() => useAllUser(), {
        wrapper: wrapperFor(store),
      });

      await act(async () => {
        await result.current.allUser();
      });
      vi.setSystemTime(Date.now() + 31_000);
      await act(async () => {
        await result.current.allUser();
      });
      expect(allUserApi).toHaveBeenCalledTimes(2);
    } finally {
      vi.useRealTimers();
    }
  });
});
