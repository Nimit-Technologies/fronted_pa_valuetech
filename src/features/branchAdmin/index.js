// Public surface of the branchAdmin feature (CLAUDE.md §3.1). Nothing outside
// this feature consumes it today; it exists so that when something does, it has
// one declared entry point instead of reaching into the folder tree.
//
// Pages and the layout are deliberately absent — the router lazy-imports those
// directly so each keeps its own chunk.

export { default as bankReducer } from "./slice/bank/bankSlice";
export { default as useAllBank } from "./hooks/bank/useAllBank";
export { default as useBranchAdminSummary } from "./hooks/dashboard/useBranchAdminSummary";
