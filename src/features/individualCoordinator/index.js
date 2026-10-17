// Public surface of the individualCoordinator feature (CLAUDE.md §3.1).
//
// Pages and the layout are deliberately absent — the router lazy-imports those
// directly so each keeps its own chunk.

export { default as useCaseSummary } from "./hooks/dashboard/useCaseSummary";
export { default as useMyBusinessType } from "./hooks/businessType/useMyBusinessType";
