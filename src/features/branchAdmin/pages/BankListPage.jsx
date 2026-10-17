import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
// import ConfirmDialog from "@/components/shared/confirmDialog";
import BranchAdminCard from "@/features/branchAdmin/component/BranchAdminCard";
import BranchAdminTableHeader from "@/features/branchAdmin/component/BranchAdminTableHeader";
import BankTable from "@/features/branchAdmin/component/bank/BankTable";
import { bankTableHeader } from "@/features/branchAdmin/data/bank/bankTableHeader";

import { Button } from "@/components/ui/button";
import Pagination from "@/components/shared/pagination";
import ConfirmDialog from "@/components/shared/confirmDialog";
import ActiveFilters from "@/components/shared/activeFilters";

import useAllBank from "@/features/branchAdmin/hooks/bank/useAllBank";
import useBankFilters from "@/features/branchAdmin/hooks/bank/useBankFilters";
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
    ({ direction = "next", cursorId = "", force = false } = {}) =>
      allBank({ direction, cursorId, force }),
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

  // ========== COLUMN FILTERS ==========
  // Excel-style filter on Bank Name, kept in the store. It applies on top of
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
  } = useBankFilters();

  const visibleRows = useMemo(() => apply(filteredData), [apply, filteredData]);

  // Options come from the unsearched page so the dropdown still lists every
  // bank on it while a search narrows the rows.
  const columnFilters = useMemo(
    () => buildProps(bankData),
    [buildProps, bankData],
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
    firstId: bankFirstId,
    lastId: bankLastId,
    onFetch: fetchBanks,
  });

  // Two entry points on purpose. The mount effect reuses whatever the
  // store already holds for page 1, so navigating back here does not
  // refetch; a mutation forces the request, because the rows have
  // genuinely changed.
  const loadFirstPage = useCallback(() => {
    resetToFirstPage();
    return fetchBanks();
  }, [resetToFirstPage, fetchBanks]);

  const reloadFromStart = useCallback(() => {
    resetToFirstPage();
    return fetchBanks({ force: true });
  }, [resetToFirstPage, fetchBanks]);

  useEffect(() => {
    loadFirstPage();
  }, [loadFirstPage]);

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
  // Skeleton only while there is nothing to show yet. Paging also sets
  // `loading`, and the totals do not change between pages, so keying off
  // `loading` alone would flash the numbers on every page turn.
  const countsLoading = loading && bankData.length === 0;

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
          loading={countsLoading}
        />
        <BranchAdminCard
          title="Active Banks"
          value={activeCount}
          loading={countsLoading}
        />
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

      <ActiveFilters
        columns={filterColumns}
        filters={filters}
        activeColumns={activeColumns}
        onClearColumn={clearFilter}
        onClearAll={clearAll}
        visibleCount={visibleRows.length}
        totalCount={filteredData.length}
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
            data={visibleRows}
            headers={bankTableHeader}
            isLoading={loading}
            columnFilters={columnFilters}
            emptyMessage={
              isFiltered
                ? "No banks on this page match the current filters."
                : "No banks found."
            }
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
