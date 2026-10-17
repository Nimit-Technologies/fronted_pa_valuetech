import { useCallback, useEffect, useMemo, useState } from "react";

import SuperAdminCard from "@/features/superAdmin/components/SuperAdminCard";
import SuperAdminTableHeader from "@/features/superAdmin/components/SuperAdminTableHeader";
import BusinessTable from "@/features/superAdmin/components/business/BusinessTable";
import CreateBusiness from "@/features/superAdmin/components/business/CreateBusiness";
import { businessTableHeader } from "@/features/superAdmin/data/business/businessTableHeader";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/shared/confirmDialog";
import Pagination from "@/components/shared/pagination";
import ActiveFilters from "@/components/shared/activeFilters";

import useAllBusiness from "@/features/superAdmin/hooks/business/useAllBusiness";
import useBusinessFilters from "@/features/superAdmin/hooks/business/useBusinessFilters";
import useDeleteBusiness from "@/features/superAdmin/hooks/business/useDeleteBusiness";
import useRestoreBusiness from "@/features/superAdmin/hooks/business/useRestoreBusiness";
import useUpdateBusinessStatus from "@/features/superAdmin/hooks/business/useUpdateBusinessStatus";
import { useTableSearch } from "@/hooks/search/useTableSearch";
import { usePaginationController } from "@/hooks/pagination/usePaginationController";

const FEATURE_KEY = "business";

const CONFIRM_ACTIONS = {
  delete: {
    title: "Delete business",
    describe: (business) =>
      `"${business.name}" will be moved to deleted businesses. You can restore it later.`,
    confirmLabel: "Delete",
    destructive: true,
  },
  restore: {
    title: "Restore business",
    describe: (business) =>
      `"${business.name}" will be moved back to active businesses.`,
    confirmLabel: "Restore",
    destructive: false,
  },
  status: {
    title: "Change business status",
    describe: (business) =>
      `"${business.name}" will be set to ${
        business.isActive ? "inactive" : "active"
      }.`,
    confirmLabel: "Update",
    destructive: false,
  },
};

const Business = () => {
  const {
    allBusiness,
    businessData,
    businessFirstId,
    businessLastId,
    hasNextPage,
    hasPreviousPage,
    loading,
    error,
    totalCount,
    totalActiveCount,
  } = useAllBusiness();

  const { Delete } = useDeleteBusiness();
  const { Restore } = useRestoreBusiness();
  const { UpdateStatus } = useUpdateBusinessStatus();

  const fetchBusinesses = useCallback(
    ({ direction = "next", cursorId = "", force = false } = {}) =>
      allBusiness({ direction, cursorId, force }),
    [allBusiness],
  );

  const { searchTerm, filteredData, onSearchChange, isSearching } =
    useTableSearch({
      data: businessData,
      keys: ["name"],
    });

  // ========== COLUMN FILTERS ==========
  // Excel-style filter on Branch, kept in the slice. It applies on top of
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
  } = useBusinessFilters();

  const visibleRows = useMemo(() => apply(filteredData), [apply, filteredData]);

  // Options come from the unsearched page so the dropdown still lists every
  // branch on it while a search narrows the rows.
  const columnFilters = useMemo(
    () => buildProps(businessData),
    [buildProps, businessData],
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
    firstId: businessFirstId,
    lastId: businessLastId,
    onFetch: fetchBusinesses,
  });

  // Two entry points on purpose. The mount effect reuses whatever the
  // store already holds for page 1, so navigating back here does not
  // refetch; a mutation forces the request, because the rows have
  // genuinely changed.
  const loadFirstPage = useCallback(() => {
    resetToFirstPage();
    return fetchBusinesses();
  }, [resetToFirstPage, fetchBusinesses]);

  const reloadFromStart = useCallback(() => {
    resetToFirstPage();
    return fetchBusinesses({ force: true });
  }, [resetToFirstPage, fetchBusinesses]);

  useEffect(() => {
    loadFirstPage();
  }, [loadFirstPage]);

  const [pendingAction, setPendingAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const runPendingAction = useCallback(async () => {
    if (!pendingAction) return;

    const { type, business } = pendingAction;
    const services = {
      delete: Delete,
      restore: Restore,
      status: UpdateStatus,
    };

    setActionLoading(true);
    try {
      await services[type]({ id: business.id });
      await reloadFromStart();
    } finally {
      setActionLoading(false);
      setPendingAction(null);
    }
  }, [pendingAction, Delete, Restore, UpdateStatus, reloadFromStart]);

  // totalCount / totalActiveCount already fall back to the loaded page inside
  // businessSelectors, so there is nothing to derive here.
  const actionCopy = pendingAction ? CONFIRM_ACTIONS[pendingAction.type] : null;
  // Skeleton only while there is nothing to show yet. Paging also sets
  // `loading`, and the totals do not change between pages, so keying off
  // `loading` alone would flash the numbers on every page turn.
  const countsLoading = loading && businessData.length === 0;

  const noSearchResults =
    Boolean(searchTerm) &&
    filteredData.length === 0 &&
    !loading &&
    !isSearching;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SuperAdminCard
          title="Total Businesses"
          value={totalCount}
          loading={countsLoading}
        />
        <SuperAdminCard
          title="Active Businesses"
          value={totalActiveCount}
          loading={countsLoading}
        />
      </div>

      <SuperAdminTableHeader
        onSearch={onSearchChange}
        placeholder="Search business..."
        disabled={loading}
        createButton={
          <CreateBusiness onCreated={reloadFromStart} disabled={loading} />
        }
      />

      {error && !loading ? (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive sm:flex-row sm:items-center sm:justify-between"
        >
          <span>Couldn&apos;t load businesses: {error}</span>
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
          No businesses match &quot;{searchTerm}&quot;.
        </div>
      ) : (
        <>
          <BusinessTable
            data={visibleRows}
            headers={businessTableHeader}
            isLoading={loading}
            columnFilters={columnFilters}
            emptyMessage={
              isFiltered
                ? "No businesses on this page match the current filters."
                : "No businesses found."
            }
            onEdited={reloadFromStart}
            onDelete={(business) =>
              setPendingAction({ type: "delete", business })
            }
            onRestore={(business) =>
              setPendingAction({ type: "restore", business })
            }
            onToggleStatus={(business) =>
              setPendingAction({ type: "status", business })
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
          pendingAction ? actionCopy.describe(pendingAction.business) : ""
        }
        confirmLabel={actionCopy?.confirmLabel}
        destructive={actionCopy?.destructive}
        loading={actionLoading}
        onConfirm={runPendingAction}
      />
    </div>
  );
};

export default Business;
