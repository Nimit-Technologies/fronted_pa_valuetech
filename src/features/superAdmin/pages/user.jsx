import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import SuperAdminCard from "@/features/superAdmin/components/superAdminCard";
import SuperAdminTableHeader from "@/features/superAdmin/components/superAdminTableHeader";
import Pagination from "@/components/shared/pagination";
import ConfirmDialog from "@/components/shared/confirmDialog";
import UserTable from "@/features/superAdmin/components/user/userTable";
import { userTableHeader } from "@/features/superAdmin/data/user/userTableHeader.js";

import useAllUser from "@/features/superAdmin/hooks/user/useAllUser";
import useDeleteUser from "@/features/superAdmin/hooks/user/useDeleteUser";
import useRestoreUser from "@/features/superAdmin/hooks/user/useRestoreUser";
import useUpdateUserStatus from "@/features/superAdmin/hooks/user/useUpdateUserStatus";
import useSearchUser from "@/features/superAdmin/hooks/user/useSearchUser";
import useUserFilters, {
  USER_FILTER_COLUMNS,
  applyUserFilters,
  buildFilterOptions,
} from "@/features/superAdmin/hooks/user/useUserFilters";
import { useTableSearch } from "@/hooks/search/useTableSearch";
import { usePaginationController } from "@/hooks/pagination/usePaginationController";

const FEATURE_KEY = "user";

const fullName = (user) =>
  `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || user.employee_id;

// Copy for each row action the confirm dialog gates.
const CONFIRM_ACTIONS = {
  delete: {
    title: "Delete user",
    describe: (user) =>
      `"${fullName(user)}" will be moved to deleted users and signed out. You can restore them later.`,
    confirmLabel: "Delete",
    destructive: true,
  },
  restore: {
    title: "Restore user",
    describe: (user) =>
      `"${fullName(user)}" will be moved back to active users.`,
    confirmLabel: "Restore",
    destructive: false,
  },
  status: {
    title: "Change user status",
    describe: (user) =>
      `"${fullName(user)}" will be set to ${user.is_active ? "inactive" : "active"}.${
        user.is_active
          ? " Their current session stops working immediately."
          : ""
      }`,
    confirmLabel: "Update",
    destructive: false,
  },
};

const User = () => {
  const navigate = useNavigate();

  // ========== DATA ==========
  const {
    allUser,
    userData,
    userFirstId,
    userLastId,
    hasNextPage,
    hasPreviousPage,
    loading,
    totalCount,
    totalActiveCount,
  } = useAllUser();

  const { Delete } = useDeleteUser();
  const { Restore } = useRestoreUser();
  const { UpdateStatus } = useUpdateUserStatus();
  const { searchUser } = useSearchUser();

  // ========== FETCH ==========
  const fetchUsers = useCallback(
    ({ direction = "next", cursorId = "" } = {}) =>
      allUser({ direction, cursorId }),
    [allUser],
  );

  const { searchTerm, filteredData, onSearchChange, isSearching } =
    useTableSearch({
      data: userData,
      keys: ["first_name", "last_name", "employee_id"],
      serverSearch: searchUser,
    });

  // ========== COLUMN FILTERS ==========
  // Excel-style filters on Branch / Department / Role, kept in the store.
  // They apply on top of the search result and only to the loaded rows.
  const {
    filters,
    setFilter,
    clearFilter,
    clearAll,
    activeColumns,
    isFiltered,
  } = useUserFilters();

  const visibleRows = useMemo(
    () => applyUserFilters(filteredData, filters),
    [filteredData, filters],
  );

  // Like Excel, each column lists the values still available after the
  // OTHER columns' filters, so a choice in one column narrows the next.
  const columnFilters = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(USER_FILTER_COLUMNS).map(([column, { label }]) => {
          const others = { ...filters, [column]: null };
          return [
            label,
            {
              label,
              options: buildFilterOptions(
                applyUserFilters(userData, others),
                column,
              ),
              selected: filters[column],
              onChange: (values) => setFilter(column, values),
            },
          ];
        }),
      ),
    [userData, filters, setFilter],
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
    firstId: userFirstId,
    lastId: userLastId,
    onFetch: fetchUsers,
  });

  const reloadFromStart = useCallback(() => {
    resetToFirstPage();
    return fetchUsers();
  }, [resetToFirstPage, fetchUsers]);

  // Load the first page on mount (and again when returning from the create
  // and update pages, since this page remounts).
  useEffect(() => {
    reloadFromStart();
  }, [reloadFromStart]);

  // ========== ROW ACTIONS ==========
  const [pendingAction, setPendingAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const runPendingAction = useCallback(async () => {
    if (!pendingAction) return;
    const { type, user } = pendingAction;
    const services = { delete: Delete, restore: Restore, status: UpdateStatus };

    setActionLoading(true);
    try {
      await services[type]({ id: user.id });
      await reloadFromStart();
    } finally {
      setActionLoading(false);
      setPendingAction(null);
    }
  }, [pendingAction, Delete, Restore, UpdateStatus, reloadFromStart]);

  // ========== DERIVED ==========
  // Backend sends the table-wide active total; fall back to counting the
  // loaded page until the first response lands.
  const loadedActiveCount = userData.filter(
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
          title="Total Users"
          value={totalCount || userData.length}
        />
        <SuperAdminCard title="Active Users" value={activeCount} />
      </div>

      <SuperAdminTableHeader
        onSearch={onSearchChange}
        placeholder="Search user..."
        disabled={loading}
        createButton={
          <Button
            className="gap-2 whitespace-nowrap"
            disabled={loading}
            onClick={() => navigate("create")}
          >
            <Plus size={16} />
            Create User
          </Button>
        }
      />

      {isFiltered ? (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">Filters:</span>
          {activeColumns.map((column) => {
            const { label } = USER_FILTER_COLUMNS[column];
            return (
              <span
                key={column}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground"
              >
                {label} ({filters[column].length})
                <button
                  type="button"
                  aria-label={`Clear ${label} filter`}
                  className="rounded-full text-muted-foreground hover:text-destructive"
                  onClick={() => clearFilter(column)}
                >
                  <X size={12} />
                </button>
              </span>
            );
          })}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={clearAll}
          >
            Clear all
          </Button>
          <span className="ml-auto text-xs text-muted-foreground">
            Showing {visibleRows.length} of {filteredData.length} on this page
          </span>
        </div>
      ) : null}

      {noSearchResults ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No users match &quot;{searchTerm}&quot;.
        </div>
      ) : (
        <>
          <UserTable
            data={visibleRows}
            headers={userTableHeader}
            isLoading={loading}
            columnFilters={columnFilters}
            emptyMessage={
              isFiltered
                ? "No users on this page match the current filters."
                : "No users found."
            }
            onDelete={(user) => setPendingAction({ type: "delete", user })}
            onRestore={(user) => setPendingAction({ type: "restore", user })}
            onToggleStatus={(user) =>
              setPendingAction({ type: "status", user })
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
          pendingAction ? actionCopy.describe(pendingAction.user) : ""
        }
        confirmLabel={actionCopy?.confirmLabel}
        destructive={actionCopy?.destructive}
        loading={actionLoading}
        onConfirm={runPendingAction}
      />
    </div>
  );
};

export default User;
