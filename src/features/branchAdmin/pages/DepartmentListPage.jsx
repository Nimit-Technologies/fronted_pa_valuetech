import React, { useEffect, useCallback, useMemo } from "react";

import BranchAdminCard from "@/features/branchAdmin/component/BranchAdminCard";
import BranchAdminSearchbar from "@/features/branchAdmin/component/BranchAdminTableHeader";
import ActiveFilters from "@/components/shared/activeFilters";

import DepartmentTable from "@/features/branchAdmin/component/department/DepartmentTable";
// import CreateDepartment from "@/features/branchAdmin/component/department/CreateDepartment";

// import {
//   departmentData,
//   departmentTableHeader,
// } from "@/features/branchAdmin/data/department/departmentTable";

import useAllDepartment from "../hooks/department/useAllDepartments";
import useSearchDepartment from "../hooks/department/useSearchDepartment";
import useDepartmentFilters from "@/hooks/filters/useDepartmentFilters";
import { usePaginationController } from "@/hooks/pagination/usePaginationController";
import { useTableSearch } from "@/hooks/search/useTableSearch";
import Pagination from "@/components/shared/pagination";
import { DepartmentTableHeader } from "../data/department/departmentTableHeader";

const FEATURE_KEY = "department";

const Department = () => {
  const {
    allDepartment,
    departmentData,
    departmentFirstId,
    departmentLastId,
    hasNextPage,
    hasPreviousPage,
    loading,
    totalCount,
    totalActiveCount,
  } = useAllDepartment();

  const { searchDepartment } = useSearchDepartment();

  const fetchDepartments = useCallback(
    ({ direction = "next", cursorId = "", force = false } = {}) =>
      allDepartment({ direction, cursorId, force }),
    [allDepartment],
  );
  const { searchTerm, filteredData, onSearchChange, isSearching } =
    useTableSearch({
      data: departmentData,
      keys: ["name"],
      serverSearch: searchDepartment,
    });

  // ========== COLUMN FILTERS ==========
  // Excel-style filter on Branch, kept in the store. It applies on top of
  // the search result and only to the rows of the loaded page.
  const {
    columns: filterColumns,
    filters,
    clearFilter,
    clearAll,
    activeColumns,
    isFiltered,
    apply,
    buildProps,
  } = useDepartmentFilters();

  const visibleRows = useMemo(() => apply(filteredData), [apply, filteredData]);

  // Options come from the unsearched page so the dropdown still lists every
  // branch on it while a search narrows the rows.
  const columnFilters = useMemo(
    () => buildProps(departmentData),
    [buildProps, departmentData],
  );

  const {
    currentPage,
    canGoNext,
    canGoPrevious,
    handleNext,
    handlePrevious,
    resetToFirstPage,
  } = usePaginationController({
    featureKey: FEATURE_KEY,
    isLoading: loading,
    isSearching,
    hasNextPage,
    hasPreviousPage,
    firstId: departmentFirstId,
    lastId: departmentLastId,
    onFetch: fetchDepartments,
  });

  // Read-only screen: the mount load reuses whatever the store already
  // holds for page 1, so navigating back here does not refetch. Writes for
  // this resource live on the superAdmin pages, which force their own
  // reload and invalidate the shared cache entry.
  const loadFirstPage = useCallback(() => {
    resetToFirstPage();
    return fetchDepartments();
  }, [resetToFirstPage, fetchDepartments]);

  // Load the first page on mount.
  useEffect(() => {
    loadFirstPage();
  }, [loadFirstPage]);

  const loadedActiveCount = departmentData.filter(
    (item) => item.is_active && !item.is_deleted,
  ).length;
  const activeCount = totalActiveCount || loadedActiveCount;

  // Skeleton only while there is nothing to show yet. Paging also sets

  // `loading`, and the totals do not change between pages, so keying off

  // `loading` alone would flash the numbers on every page turn.

  const countsLoading = loading && departmentData.length === 0;

  const noSearchResults =
    Boolean(searchTerm) &&
    filteredData.length === 0 &&
    !loading &&
    !isSearching;

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto">
      {/* Card */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BranchAdminCard
          title="Total Department"
          value={totalCount || departmentData.length}
          loading={countsLoading}
        />
        <BranchAdminCard
          title="Active Department"
          value={activeCount}
          loading={countsLoading}
        />
      </div>

      {/* Search + Create */}

      <BranchAdminSearchbar
        onSearch={onSearchChange}
        placeholder="Search department..."
        disabled={loading}
        // createButton={<CreateDepartment />}
      />

      <ActiveFilters
        columns={filterColumns}
        filters={filters}
        activeColumns={activeColumns}
        onClearColumn={clearFilter}
        onClearAll={clearAll}
        visibleCount={visibleRows.length}
        totalCount={filteredData.length}
      />

      {/* Table */}

      {noSearchResults ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No departments match &quot;{searchTerm}&quot;.
        </div>
      ) : (
        <>
          <DepartmentTable
            data={visibleRows}
            isLoading={loading}
            headers={DepartmentTableHeader}
            columnFilters={columnFilters}
            emptyMessage={
              isFiltered
                ? "No departments on this page match the current filters."
                : "No departments found."
            }
          />
          <Pagination
            currentPage={currentPage}
            onPrev={handlePrevious}
            onNext={handleNext}
            hasPreviousPage={canGoPrevious}
            hasNextPage={canGoNext}
          />
        </>
      )}
    </div>
  );
};

export default Department;
