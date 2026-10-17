import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import CoordinatorTableHeader from "@/features/individualCoordinator/components/CoordinatorTableHeader";
import CoordinatorCard from "@/features/individualCoordinator/components/CoordinatorCard";
import CaseTable from "@/features/individualCoordinator/components/case/CaseTable";
import Pagination from "@/components/shared/pagination";
import ActiveFilters from "@/components/shared/activeFilters";
import { caseTableHeader } from "@/features/individualCoordinator/data/case/caseTableHeader.js";

import useAllCase from "@/features/individualCoordinator/hooks/case/useAllCase";
import useSearchCase from "@/features/individualCoordinator/hooks/case/useSearchCase";
import useCaseFilters from "@/features/individualCoordinator/hooks/case/useCaseFilters";
import { useTableSearch } from "@/hooks/search/useTableSearch";
import { usePaginationController } from "@/hooks/pagination/usePaginationController";

const FEATURE_KEY = "case";

const CaseDashboard = () => {
  // ========== DATA ==========
  const {
    allCase,
    caseData,
    caseFirstId,
    caseLastId,
    hasNextPage,
    hasPreviousPage,
    loading,
    error,
    totalCount,
    totalActiveCount,
  } = useAllCase();

  const { searchCase } = useSearchCase();

  // The endpoint hides close/cancelled cases unless asked, so the default view
  // is the coordinator's live queue. The toggle is the only way to reach a
  // finished case from this list.
  const [includeFinished, setIncludeFinished] = useState(false);

  // Coming back from a case detail — the browser's Back button, or the view
  // page's own — remounts this page on top of a store that still holds the rows
  // the user left. The mount fetch below is still worth running, since a case
  // may have moved on while they were away, but it is not worth dimming rows
  // that are already correct behind a spinner: that reads as the page reloading
  // every single time they come back.
  //
  // Captured once, on mount, and never set again: a later paging or filter
  // fetch does replace what is on screen, and those keep their spinner.
  //
  // `!hasPreviousPage` is what makes this honest. The fetch below always asks
  // for the first page, so the rows already on screen are the ones it is about
  // to repeat only when they *are* the first page. A user who had paged deeper
  // is sent back to page one, which really does replace the table, and that
  // still says so.
  const [revalidating, setRevalidating] = useState(
    () => caseData.length > 0 && !hasPreviousPage,
  );

  // What the UI treats as "busy". A silent revalidation is deliberately not.
  const busy = loading && !revalidating;

  // ========== FETCH ==========
  const fetchCases = useCallback(
    ({ direction = "next", cursorId = "" } = {}) =>
      allCase({ direction, cursorId, includeFinished }),
    [allCase, includeFinished],
  );

  // Server search runs under the same lifecycle filter as the table, so a
  // search can never surface a row the current view excludes.
  const serverSearch = useCallback(
    (term) => searchCase(term, { includeFinished }),
    [searchCase, includeFinished],
  );

  const { searchTerm, filteredData, onSearchChange, isSearching, isFiltered } =
    useTableSearch({
      data: caseData,
      keys: [
        "file_number",
        "customer_name",
        "banker_name",
        "case_type",
        "customer_contact_number",
      ],
      serverSearch,
    });

  // ========== COLUMN FILTERS ==========
  // Excel-style filters on Bank / Case Type, kept in the store so they survive
  // a trip to a case detail page. They are client-side and apply only to the
  // rows in hand: the loaded page, or the search match set when a search is
  // running. Paging fetches a new page, so a filter never reaches rows the
  // server has not sent.
  const {
    columns: filterColumns,
    filters,
    clearFilter,
    clearAll,
    activeColumns,
    isFiltered: isColumnFiltered,
    apply,
    buildProps,
  } = useCaseFilters();

  const visibleRows = useMemo(() => apply(filteredData), [apply, filteredData]);

  // Options come from the search result when one is on screen, not from the
  // loaded page: a server search returns rows that are not in caseData, and
  // listing values those rows do not have would let a filter blank the table
  // with nothing to tick. Like Excel, each column lists the values still
  // available after the OTHER columns' filters, so a choice in one column
  // narrows the next.
  const columnFilters = useMemo(
    () => buildProps(filteredData),
    [buildProps, filteredData],
  );

  // ========== PAGINATION ==========
  const {
    currentPage,
    canGoNext,
    canGoPrevious,
    handleNext,
    handlePrevious,
    resetToFirstPage,
  } = usePaginationController({
    featureKey: FEATURE_KEY,
    isLoading: busy,
    isSearching,
    hasNextPage,
    hasPreviousPage,
    firstId: caseFirstId,
    lastId: caseLastId,
    onFetch: fetchCases,
  });

  const reloadFromStart = useCallback(() => {
    resetToFirstPage();
    return fetchCases();
  }, [resetToFirstPage, fetchCases]);

  // Load the first page on mount, and again whenever the finished-case toggle
  // changes the filter the cursor was built against.
  useEffect(() => {
    // Whichever fetch settles last clears the flag; from then on every fetch
    // is one the user asked for, and shows that it is working.
    reloadFromStart().finally(() => setRevalidating(false));
  }, [reloadFromStart]);

  // ========== DERIVED ==========
  // With finished cases hidden the endpoint counts against that same filter,
  // so both totals describe the live queue and agree by definition.
  const noSearchResults =
    Boolean(searchTerm) &&
    filteredData.length === 0 &&
    !loading &&
    !isSearching;

  // ========== RENDER ==========
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CoordinatorCard
          title={includeFinished ? "Total Cases" : "Open Cases"}
          value={totalCount}
        />
        <CoordinatorCard title="Active Cases" value={totalActiveCount} />
      </div>

      <CoordinatorTableHeader
        onSearch={onSearchChange}
        placeholder="Search case..."
        disabled={busy}
        createRoute="/cordinator/case/create"
        createLabel="Create Case"
      >
        <Button
          type="button"
          variant="outline"
          className="whitespace-nowrap"
          disabled={busy}
          onClick={() => setIncludeFinished((shown) => !shown)}
        >
          {includeFinished ? "Hide finished" : "Show finished"}
        </Button>
      </CoordinatorTableHeader>

      <ActiveFilters
        columns={filterColumns}
        filters={filters}
        activeColumns={activeColumns}
        onClearColumn={clearFilter}
        onClearAll={clearAll}
        visibleCount={visibleRows.length}
        totalCount={filteredData.length}
      />

      {/* A failed list request would otherwise fall through to "No cases
          found", which is indistinguishable from an empty queue. */}
      {error && !loading ? (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive sm:flex-row sm:items-center sm:justify-between"
        >
          <span>Couldn&apos;t load cases: {error}</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={reloadFromStart}
          >
            Retry
          </Button>
        </div>
      ) : null}

      {noSearchResults ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No cases match &quot;{searchTerm}&quot;.
        </div>
      ) : (
        <>
          <CaseTable
            data={visibleRows}
            headers={caseTableHeader}
            isLoading={busy}
            columnFilters={columnFilters}
            emptyMessage={
              isColumnFiltered
                ? "No cases on this page match the current filters."
                : "No cases found."
            }
          />
          {/* Paging describes the loaded page, and a search replaces the rows
              on screen with a match set that has no cursor of its own — the
              server search returns its own unpaginated page. Showing "Page 3"
              with Next and Previous under search results would page something
              the user is not looking at, so the controls stand down until the
              search is cleared. */}
          {isFiltered ? null : (
            <Pagination
              currentPage={currentPage}
              onPrev={handlePrevious}
              onNext={handleNext}
              hasPreviousPage={canGoPrevious}
              hasNextPage={canGoNext}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CaseDashboard;
