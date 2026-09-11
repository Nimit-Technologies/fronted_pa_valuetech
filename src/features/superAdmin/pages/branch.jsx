import React, { useCallback, useEffect, useState } from "react";

import SuperAdminCard from "@/features/superAdmin/components/superAdminCard";
import SuperAdminTableHeader from "@/features/superAdmin/components/superAdminTableHeader";
import Pagination from "@/features/superAdmin/components/pagination";
import ConfirmDialog from "@/components/shared/confirmDialog";
import BranchTable from "@/features/superAdmin/components/branch/branchTable";
import CreateBranch from "@/features/superAdmin/components/branch/createBranch";
import { branchTableHeader } from "@/features/superAdmin/data/branch/branchTableHeader.js";

import useAllBranch from "@/features/superAdmin/hooks/branch/useAllBranch";
import useDeleteBranch from "@/features/superAdmin/hooks/branch/useDeleteBranch";
import useRestoreBranch from "@/features/superAdmin/hooks/branch/useRestoreBranch";
import useUpdateBranchStatus from "@/features/superAdmin/hooks/branch/useUpdateBranchStatus";
import useSearchBranch from "@/features/superAdmin/hooks/branch/useSearchBranch";
import { useTableSearch } from "@/hooks/search/useTableSearch";
import { usePaginationController } from "@/hooks/pagination/usePaginationController";

const FEATURE_KEY = "branch";

// Copy for each row action the confirm dialog gates.
const CONFIRM_ACTIONS = {
  delete: {
    title: "Delete branch",
    describe: (branch) =>
      `"${branch.name}" will be moved to deleted branches. You can restore it later.`,
    confirmLabel: "Delete",
    destructive: true,
  },
  restore: {
    title: "Restore branch",
    describe: (branch) =>
      `"${branch.name}" will be moved back to active branches.`,
    confirmLabel: "Restore",
    destructive: false,
  },
  status: {
    title: "Change branch status",
    describe: (branch) =>
      `"${branch.name}" will be set to ${branch.isActive ? "inactive" : "active"}.`,
    confirmLabel: "Update",
    destructive: false,
  },
};

const Branch = () => {
  // ========== DATA ==========
  const {
    allBranch,
    branchData,
    branchFirstId,
    branchLastId,
    hasNextPage,
    hasPreviousPage,
    loading,
    totalCount,
    totalActiveCount,
  } = useAllBranch();

  const { Delete } = useDeleteBranch();
  const { Restore } = useRestoreBranch();
  const { UpdateStatus } = useUpdateBranchStatus();
  const { searchBranch } = useSearchBranch();

  // ========== FETCH ==========
  const fetchBranches = useCallback(
    ({ direction = "next", cursorId = "" } = {}) =>
      allBranch({ direction, cursorId }),
    [allBranch],
  );

  const { searchTerm, filteredData, onSearchChange, isSearching } =
    useTableSearch({
      data: branchData,
      keys: ["name"],
      serverSearch: searchBranch,
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
    firstId: branchFirstId,
    lastId: branchLastId,
    onFetch: fetchBranches,
  });

  const reloadFromStart = useCallback(() => {
    resetToFirstPage();
    return fetchBranches();
  }, [resetToFirstPage, fetchBranches]);

  // Load the first page on mount.
  useEffect(() => {
    reloadFromStart();
  }, [reloadFromStart]);

  // ========== ROW ACTIONS ==========
  const [pendingAction, setPendingAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const runPendingAction = useCallback(async () => {
    if (!pendingAction) return;
    const { type, branch } = pendingAction;
    const services = { delete: Delete, restore: Restore, status: UpdateStatus };

    setActionLoading(true);
    try {
      await services[type]({ id: branch.id });
      await reloadFromStart();
    } finally {
      setActionLoading(false);
      setPendingAction(null);
    }
  }, [pendingAction, Delete, Restore, UpdateStatus, reloadFromStart]);

  // ========== DERIVED ==========
  // Backend sends the table-wide active total; fall back to counting the
  // loaded page until the first response lands.
  const loadedActiveCount = branchData.filter(
    (item) => item.isActive && !item.isDeleted,
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
          title="Total Branches"
          value={totalCount || branchData.length}
        />
        <SuperAdminCard title="Active Branches" value={activeCount} />
      </div>

      <SuperAdminTableHeader
        onSearch={onSearchChange}
        placeholder="Search branch..."
        disabled={loading}
        createButton={
          <CreateBranch onCreated={reloadFromStart} disabled={loading} />
        }
      />

      {noSearchResults ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No branches match &quot;{searchTerm}&quot;.
        </div>
      ) : (
        <>
          <BranchTable
            data={filteredData}
            headers={branchTableHeader}
            isLoading={loading}
            onEdited={reloadFromStart}
            onDelete={(branch) => setPendingAction({ type: "delete", branch })}
            onRestore={(branch) =>
              setPendingAction({ type: "restore", branch })
            }
            onToggleStatus={(branch) =>
              setPendingAction({ type: "status", branch })
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
          pendingAction ? actionCopy.describe(pendingAction.branch) : ""
        }
        confirmLabel={actionCopy?.confirmLabel}
        destructive={actionCopy?.destructive}
        loading={actionLoading}
        onConfirm={runPendingAction}
      />
    </div>
  );
};

export default Branch;
