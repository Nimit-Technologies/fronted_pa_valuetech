import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
// import ConfirmDialog from "@/components/shared/confirmDialog";
import BranchAdminCard from "@/features/branchAdmin/component/branchAdminCard";
import BranchAdminTableHeader from "@/features/branchAdmin/component/branchAdminTableHeader";
import BankTable from "@/features/branchAdmin/component/bank/bankTable";
import { bankTableHeader } from "@/features/branchAdmin/data/bank/bankTableHeader";

import { Button } from "@/components/ui/button";
import Pagination from "@/components/shared/pagination";
import ConfirmDialog from "@/components/shared/confirmDialog";

import useAllBank from "@/features/branchAdmin/hooks/bank/useAllBank";
import useDeleteBank from "@/features/branchAdmin/hooks/bank/useDeleteBank";
import useUpdateBankStatus from "@/features/branchAdmin/hooks/bank/useUpdateBankStatus";
import useRestoreBank from "@/features/branchAdmin/hooks/bank/useRestoreBank";
import { useTableSearch } from "@/hooks/search/useTableSearch";
import { usePaginationController } from "@/hooks/pagination/usePaginationController";

const FEATURE_KEY = "bank";

const CONFIRM_ACTIONS = {
  delete: {
    title: "Delete bank",
    describe: (bank) =>
      `"${bank.displayName || bank.name}" will be moved to deleted banks. You can restore it later.`,
    confirmLabel: "Delete",
    destructive: true,
  },
  restore: {
    title: "Restore bank",
    describe: (bank) =>
      `"${bank.displayName || bank.name}" will be moved back to active banks.`,
    confirmLabel: "Restore",
    destructive: false,
  },
  status: {
    title: "Change bank status",
    describe: (bank) =>
      `"${bank.displayName || bank.name}" will be set to ${
        bank.isActive ? "inactive" : "active"
      }.`,
    confirmLabel: "Update",
    destructive: false,
  },
};

const Bank = () => {
  const navigate = useNavigate();

  const {
    allBank,
    bankData,
    bankFirstId,
    bankLastId,
    hasNextPage,
    hasPreviousPage,
    loading,
    error,
    totalCount,
    totalActiveCount,
  } = useAllBank();

  const { Delete } = useDeleteBank();
  const { UpdateStatus } = useUpdateBankStatus();
  const { Restore } = useRestoreBank();

  const fetchBanks = useCallback(
    ({ direction = "next", cursorId = "" } = {}) =>
      allBank({ direction, cursorId }),
    [allBank],
  );

  const { searchTerm, filteredData, onSearchChange, isSearching } =
    useTableSearch({
      data: bankData,
      keys: [
        "name",
        "displayName",
        "bankBranch",
        "bankBranchCode",
        "gstNumber",
      ],
    });

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
    firstId: bankFirstId,
    lastId: bankLastId,
    onFetch: fetchBanks,
  });

  const reloadFromStart = useCallback(() => {
    resetToFirstPage();
    return fetchBanks();
  }, [resetToFirstPage, fetchBanks]);

  useEffect(() => {
    reloadFromStart();
  }, [reloadFromStart]);

  const [pendingAction, setPendingAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const runPendingAction = useCallback(async () => {
    if (!pendingAction) return;
    const { type, bank } = pendingAction;
    const services = { delete: Delete, status: UpdateStatus, restore: Restore };

    setActionLoading(true);
    try {
      await services[type]({ id: bank.id });
      await reloadFromStart();
    } finally {
      setActionLoading(false);
      setPendingAction(null);
    }
  }, [pendingAction, Delete, UpdateStatus, Restore, reloadFromStart]);

  const loadedActiveCount = bankData.filter(
    (item) => item.isActive && !item.isDeleted,
  ).length;
  const activeCount = totalActiveCount || loadedActiveCount;

  const actionCopy = pendingAction ? CONFIRM_ACTIONS[pendingAction.type] : null;
  const noSearchResults =
    Boolean(searchTerm) &&
    filteredData.length === 0 &&
    !loading &&
    !isSearching;

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BranchAdminCard
          title="Total Banks"
          value={totalCount || bankData.length}
        />
        <BranchAdminCard title="Active Banks" value={activeCount} />
      </div>

      <BranchAdminTableHeader
        onSearch={onSearchChange}
        placeholder="Search bank..."
        createButton={
          <Button
            className="gap-2"
            disabled={loading}
            onClick={() => navigate("/branch-admin/bank/create")}
          >
            <Plus size={16} />
            Create Bank
          </Button>
        }
      />

      {error && !loading ? (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive sm:flex-row sm:items-center sm:justify-between"
        >
          <span>Couldn&apos;t load banks: {error}</span>
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
          No banks match &quot;{searchTerm}&quot;.
        </div>
      ) : (
        <>
          <BankTable
            data={filteredData}
            headers={bankTableHeader}
            isLoading={loading}
            onDelete={(bank) => setPendingAction({ type: "delete", bank })}
            onRestore={(bank) => setPendingAction({ type: "restore", bank })}
            onToggleStatus={(bank) =>
              setPendingAction({ type: "status", bank })
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
          pendingAction ? actionCopy.describe(pendingAction.bank) : ""
        }
        confirmLabel={actionCopy?.confirmLabel}
        destructive={actionCopy?.destructive}
        loading={actionLoading}
        onConfirm={runPendingAction}
      />
    </div>
  );
};

export default Bank;
