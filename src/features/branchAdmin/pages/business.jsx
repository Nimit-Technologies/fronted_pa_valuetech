import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import BranchAdminCard from "@/features/branchAdmin/component/branchAdminCard";
import BranchAdminTableHeader from "@/features/branchAdmin/component/branchAdminTableHeader";
import BusinessTable from "@/features/branchAdmin/component/business/businessTable";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/shared/confirmDialog";
import Pagination from "@/components/shared/pagination";

import useAllBusiness from "@/features/branchAdmin/hooks/business/useAllBusiness";
import useDeleteBusiness from "@/features/branchAdmin/hooks/business/useDeleteBusiness";
import useRestoreBusiness from "@/features/branchAdmin/hooks/business/useRestoreBusiness";
import useUpdateBusinessStatus from "@/features/branchAdmin/hooks/business/useUpdateBusinessStatus";
import { useTableSearch } from "@/hooks/search/useTableSearch";
import { usePaginationController } from "@/hooks/pagination/usePaginationController";

const FEATURE_KEY = "business";

const BUSINESS_TABLE_HEADERS = ["S.No", "business name", "status", "action"];

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
  const navigate = useNavigate();

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
    ({ direction = "next", cursorId = "" } = {}) =>
      allBusiness({ direction, cursorId }),
    [allBusiness],
  );

  const { searchTerm, filteredData, onSearchChange, isSearching } =
    useTableSearch({
      data: businessData,
      keys: ["name"],
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
    firstId: businessFirstId,
    lastId: businessLastId,
    onFetch: fetchBusinesses,
  });

  const reloadFromStart = useCallback(() => {
    resetToFirstPage();
    return fetchBusinesses();
  }, [resetToFirstPage, fetchBusinesses]);

  useEffect(() => {
    reloadFromStart();
  }, [reloadFromStart]);

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

  const loadedActiveCount = businessData.filter(
    (business) => business.isActive && !business.isDeleted,
  ).length;
  const activeCount = totalActiveCount || loadedActiveCount;
  const actionCopy = pendingAction ? CONFIRM_ACTIONS[pendingAction.type] : null;
  const noSearchResults =
    Boolean(searchTerm) &&
    filteredData.length === 0 &&
    !loading &&
    !isSearching;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <BranchAdminCard
          title="Total Businesses"
          value={totalCount || businessData.length}
        />
        <BranchAdminCard title="Active Businesses" value={activeCount} />
      </div>

      <BranchAdminTableHeader
        onSearch={onSearchChange}
        placeholder="Search business..."
        createButton={
          <Button
            className="gap-2"
            disabled={loading}
            onClick={() => navigate("/branch-admin/business/create")}
          >
            <Plus size={16} />
            Create Business
          </Button>
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

      {noSearchResults ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No businesses match &quot;{searchTerm}&quot;.
        </div>
      ) : (
        <>
          <BusinessTable
            data={filteredData}
            headers={BUSINESS_TABLE_HEADERS}
            isLoading={loading}
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
