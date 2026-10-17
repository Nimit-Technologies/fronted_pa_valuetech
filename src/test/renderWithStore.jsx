import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import cacheReducer from "@/store/slice/cache/cacheSlice";

// Renders `ui` inside a real Redux store.
//
// Needed by any component that embeds a mutation popover (<UpdateBranch>,
// <UpdateRole>, <UpdateBusiness>, …): those call the feature's mutation hook,
// which drops the cached list through the `cache` slice, so the tree has to sit
// under a Provider even when the test only asserts on markup.
//
// The default store carries just the `cache` slice. Pass `reducer` to add the
// list slices a component actually reads, and `preloadedState` to seed them.
export function renderWithStore(ui, { reducer, preloadedState } = {}) {
  const store = configureStore({
    reducer: { cache: cacheReducer, ...reducer },
    preloadedState,
  });

  const result = render(<Provider store={store}>{ui}</Provider>);
  return { ...result, store };
}

export default renderWithStore;
