import React, { useCallback, useEffect, useMemo } from "react";
import BranchAdminCard from "@/features/branchAdmin/component/BranchAdminCard";
import BranchAdminTableHeader from "@/features/branchAdmin/component/BranchAdminTableHeader";
import ActiveFilters from "@/components/shared/activeFilters";

import RoleTable from "@/features/branchAdmin/component/role/RoleTable";
// import CreateRole from "@/features/branchAdmin/component/role/CreateRole";

// import { roleData } from "@/features/branchAdmin/data/role/roleTable";
import { roleTableHeader } from "@/features/branchAdmin/data/role/roleTableHeader";
import useAllRole from "../hooks/role/useAllRole";
import useSearchRole from "../hooks/role/useSearchRole";
import useRoleFilters from "@/hooks/filters/useRoleFilters";
import { useTableSearch } from "@/hooks/search/useTableSearch";
import { usePaginationController } from "@/hooks/pagination/usePaginationController";
import Pagination from "@/components/shared/pagination";

const Role = () => {
  const FEATURE_KEY = "role";

  const {
    allRole,
    roleData,
    roleFirstId,
    roleLastId,
    hasNextPage,
    hasPreviousPage,
    loading,
    totalCount,
    totalActiveCount,
  } = useAllRole();

  const { searchRole } = useSearchRole();
  // const [searchTerm, setSearchTerm] = useState("");

  const fetchRoles = useCallback(
    ({ direction = "next", cursorId = "", force = false } = {}) =>
      allRole({ direction, cursorId, force }),
    [allRole],
  );

  const { searchTerm, filteredData, onSearchChange, isSearching } =
    useTableSearch({
      data: roleData,
      keys: ["name"],
      serverSearch: searchRole,
    });

  // ========== COLUMN FILTERS ==========
  // Excel-style filter on Department, kept in the store. It applies on top
  // of the search result and only to the rows of the loaded page. The shared
  // column map also covers Branch, which this table has no column for, so no
  // control is rendered for it.
  const {
    columns: filterColumns,
    filters,
    clearFilter,
    clearAll,
    activeColumns,
    isFiltered,
    apply,
    buildProps,
  } = useRoleFilters();

  const visibleRows = useMemo(() => apply(filteredData), [apply, filteredData]);

  // Options come from the unsearched page so the dropdown still lists every
  // department on it while a search narrows the rows.
  const columnFilters = useMemo(
    () => buildProps(roleData),
    [buildProps, roleData],
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
    firstId: roleFirstId,
    lastId: roleLastId,
    onFetch: fetchRoles,
  });

  // Read-only screen: the mount load reuses whatever the store already
  // holds for page 1, so navigating back here does not refetch. Writes for
  // this resource live on the superAdmin pages, which force their own
  // reload and invalidate the shared cache entry.
  const loadFirstPage = useCallback(() => {
    resetToFirstPage();
    return fetchRoles();
  }, [resetToFirstPage, fetchRoles]);

  // Load the first page on mount.
  useEffect(() => {
    loadFirstPage();
  }, [loadFirstPage]);

  const loadedActiveCount = roleData.filter((item) => item.is_active).length;
  const activeCount = totalActiveCount || loadedActiveCount;

  // Skeleton only while there is nothing to show yet. Paging also sets

  // `loading`, and the totals do not change between pages, so keying off

  // `loading` alone would flash the numbers on every page turn.

  const countsLoading = loading && roleData.length === 0;

  const noSearchResults =
    Boolean(searchTerm) &&
    filteredData.length === 0 &&
    !loading &&
    !isSearching;

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto">
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BranchAdminCard
          title="Total Roles"
          value={totalCount || roleData.length}
          loading={countsLoading}
        />
        <BranchAdminCard
          title="Active Roles"
          value={activeCount}
          loading={countsLoading}
        />
      </div>

      {/* Search + Create Button */}
      <BranchAdminTableHeader
        onSearch={onSearchChange}
        placeholder="Search role..."
        disabled={loading}
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
          No roles match &quot;{searchTerm}&quot;.
        </div>
      ) : (
        <>
          <RoleTable
            data={visibleRows}
            headers={roleTableHeader}
            isLoading={loading}
            columnFilters={columnFilters}
            emptyMessage={
              isFiltered
                ? "No roles on this page match the current filters."
                : "No roles found."
            }
            // onToggleStatus={(role) =>
            //   setPendingAction({ type: "status", role })
            // }
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

export default Role;
