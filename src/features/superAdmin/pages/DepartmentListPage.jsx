import React, { useCallback, useEffect, useMemo, useState } from "react";

import SuperAdminCard from "@/features/superAdmin/components/SuperAdminCard";
import SuperAdminTableHeader from "@/features/superAdmin/components/SuperAdminTableHeader";
import Pagination from "@/components/shared/pagination";
import ConfirmDialog from "@/components/shared/confirmDialog";
import ActiveFilters from "@/components/shared/activeFilters";
import DepartmentTable from "@/features/superAdmin/components/department/DepartmentTable";
import CreateDepartment from "@/features/superAdmin/components/department/CreateDepartment";
import { DepartmentTableHeader } from "@/features/superAdmin/data/department/departmentTableHeader";

import useAllDepartment from "@/features/superAdmin/hooks/department/useAllDepartment";
import useDepartmentFilters from "@/features/superAdmin/hooks/department/useDepartmentFilters";
import useDeleteDepartment from "@/features/superAdmin/hooks/department/useDeleteDepartment";
import useRestoreDepartment from "@/features/superAdmin/hooks/department/useRestoreDepartment";
import useUpdateDepartmentStatus from "@/features/superAdmin/hooks/department/useUpdateDepartmentStatus";
import useSearchDepartment from "@/features/superAdmin/hooks/department/useSearchDepartment";
import { useTableSearch } from "@/hooks/search/useTableSearch";
import { usePaginationController } from "@/hooks/pagination/usePaginationController";

const FEATURE_KEY = "department";

// Copy for each row action the confirm dialog gates.
const CONFIRM_ACTIONS = {
  delete: {
    title: "Delete department",
    describe: (department) =>
      `"${department.name}" will be moved to deleted departments. You can restore it later.`,
    confirmLabel: "Delete",
    destructive: true,
  },
  restore: {
    title: "Restore department",
    describe: (department) =>
      `"${department.name}" will be moved back to active departments.`,
    confirmLabel: "Restore",
    destructive: false,
  },
  status: {
    title: "Change department status",
    describe: (department) =>
      `"${department.name}" will be set to ${department.is_active ? "inactive" : "active"}.`,
    confirmLabel: "Update",
    destructive: false,
  },
};

const Department = () => {
  // ========== DATA ==========
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

  const { Delete } = useDeleteDepartment();
  const { Restore } = useRestoreDepartment();
  const { UpdateStatus } = useUpdateDepartmentStatus();
  const { searchDepartment } = useSearchDepartment();

  // ========== FETCH ==========
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
    isLoading: loading,
    isSearching,
    hasNextPage,
    hasPreviousPage,
    firstId: departmentFirstId,
    lastId: departmentLastId,
    onFetch: fetchDepartments,
  });

  // Two entry points on purpose. The mount effect reuses whatever the
  // store already holds for page 1, so navigating back here does not
  // refetch; a mutation forces the request, because the rows have
  // genuinely changed.
  const loadFirstPage = useCallback(() => {
    resetToFirstPage();
    return fetchDepartments();
  }, [resetToFirstPage, fetchDepartments]);

  const reloadFromStart = useCallback(() => {
    resetToFirstPage();
    return fetchDepartments({ force: true });
  }, [resetToFirstPage, fetchDepartments]);

  // Load the first page on mount.
  useEffect(() => {
    loadFirstPage();
  }, [loadFirstPage]);

  // ========== ROW ACTIONS ==========
  const [pendingAction, setPendingAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const runPendingAction = useCallback(async () => {
    if (!pendingAction) return;
    const { type, department } = pendingAction;
    const services = { delete: Delete, restore: Restore, status: UpdateStatus };

    setActionLoading(true);
    try {
      await services[type]({ id: department.id });
      await reloadFromStart();
    } finally {
      setActionLoading(false);
      setPendingAction(null);
    }
  }, [pendingAction, Delete, Restore, UpdateStatus, reloadFromStart]);

  // ========== DERIVED ==========
  // Backend sends the table-wide active total; fall back to counting the
  // loaded page until the first response lands.
  const loadedActiveCount = departmentData.filter(
    (item) => item.is_active && !item.is_deleted,
  ).length;
  const activeCount = totalActiveCount || loadedActiveCount;

  const actionCopy = pendingAction ? CONFIRM_ACTIONS[pendingAction.type] : null;
  // Skeleton only while there is nothing to show yet. Paging also sets
  // `loading`, and the totals do not change between pages, so keying off
  // `loading` alone would flash the numbers on every page turn.
  const countsLoading = loading && departmentData.length === 0;

  const noSearchResults =
    Boolean(searchTerm) &&
    filteredData.length === 0 &&
    !loading &&
    !isSearching;

  // ========== RENDER ==========
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SuperAdminCard
          title="Total Departments"
          value={totalCount || departmentData.length}
          loading={countsLoading}
        />
        <SuperAdminCard
          title="Active Departments"
          value={activeCount}
          loading={countsLoading}
        />
      </div>

      <SuperAdminTableHeader
        onSearch={onSearchChange}
        placeholder="Search department..."
        disabled={loading}
        createButton={
          <CreateDepartment onCreated={reloadFromStart} disabled={loading} />
        }
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

      {noSearchResults ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No departments match &quot;{searchTerm}&quot;.
        </div>
      ) : (
        <>
          <DepartmentTable
            data={visibleRows}
            headers={DepartmentTableHeader}
            isLoading={loading}
            columnFilters={columnFilters}
            emptyMessage={
              isFiltered
                ? "No departments on this page match the current filters."
                : "No departments found."
            }
            onEdited={reloadFromStart}
            onDelete={(department) =>
              setPendingAction({ type: "delete", department })
            }
            onRestore={(department) =>
              setPendingAction({ type: "restore", department })
            }
            onToggleStatus={(department) =>
              setPendingAction({ type: "status", department })
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

      <ConfirmDialog
        open={Boolean(pendingAction)}
        onOpenChange={(open) => {
          if (!open) setPendingAction(null);
        }}
        title={actionCopy?.title}
        description={
          pendingAction ? actionCopy.describe(pendingAction.department) : ""
        }
        confirmLabel={actionCopy?.confirmLabel}
        destructive={actionCopy?.destructive}
        loading={actionLoading}
        onConfirm={runPendingAction}
      />
    </div>
  );
};

export default Department;
