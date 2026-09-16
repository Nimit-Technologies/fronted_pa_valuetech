import React, { useCallback, useEffect, useState } from "react";

import SuperAdminCard from "@/features/superAdmin/components/superAdminCard";
import SuperAdminTableHeader from "@/features/superAdmin/components/superAdminTableHeader";
import Pagination from "@/components/shared/pagination";
import ConfirmDialog from "@/components/shared/confirmDialog";
import DepartmentTable from "@/features/superAdmin/components/department/departmentTable";
import CreateDepartment from "@/features/superAdmin/components/department/createDepartment";
import { DepartmentTableHeader } from "@/features/superAdmin/data/department/departmentTableHeader";

import useAllDepartment from "@/features/superAdmin/hooks/department/useAllDepartment";
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
    ({ direction = "next", cursorId = "" } = {}) =>
      allDepartment({ direction, cursorId }),
    [allDepartment],
  );

  const { searchTerm, filteredData, onSearchChange, isSearching } =
    useTableSearch({
      data: departmentData,
      keys: ["name"],
      serverSearch: searchDepartment,
    });

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

  const reloadFromStart = useCallback(() => {
    resetToFirstPage();
    return fetchDepartments();
  }, [resetToFirstPage, fetchDepartments]);

  // Load the first page on mount.
  useEffect(() => {
    reloadFromStart();
  }, [reloadFromStart]);

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
        />
        <SuperAdminCard title="Active Departments" value={activeCount} />
      </div>

      <SuperAdminTableHeader
        onSearch={onSearchChange}
        placeholder="Search department..."
        disabled={loading}
        createButton={
          <CreateDepartment onCreated={reloadFromStart} disabled={loading} />
        }
      />

      {noSearchResults ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No departments match &quot;{searchTerm}&quot;.
        </div>
      ) : (
        <>
          <DepartmentTable
            data={filteredData}
            headers={DepartmentTableHeader}
            isLoading={loading}
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
