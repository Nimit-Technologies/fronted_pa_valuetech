import React, { useCallback, useEffect, useMemo, useState } from "react";

import SuperAdminCard from "@/features/superAdmin/components/SuperAdminCard";
import SuperAdminTableHeader from "@/features/superAdmin/components/SuperAdminTableHeader";
import Pagination from "@/components/shared/pagination";
import ConfirmDialog from "@/components/shared/confirmDialog";
import ActiveFilters from "@/components/shared/activeFilters";
import RoleTable from "@/features/superAdmin/components/role/RoleTable";
import CreateRole from "@/features/superAdmin/components/role/CreateRole";
import { roleTableHeader } from "@/features/superAdmin/data/role/roleTableHeader";

import useAllRole from "@/features/superAdmin/hooks/role/useAllRole";
import useRoleFilters from "@/features/superAdmin/hooks/role/useRoleFilters";
import useDeleteRole from "@/features/superAdmin/hooks/role/useDeleteRole";
import useRestoreRole from "@/features/superAdmin/hooks/role/useRestoreRole";
import useUpdateRoleStatus from "@/features/superAdmin/hooks/role/useUpdateRoleStatus";
import useSearchRole from "@/features/superAdmin/hooks/role/useSearchRole";
import { useTableSearch } from "@/hooks/search/useTableSearch";
import { usePaginationController } from "@/hooks/pagination/usePaginationController";

const FEATURE_KEY = "role";

const CONFIRM_ACTIONS = {
  delete: {
    title: "Delete role",
    describe: (role) =>
      `"${role.name}" will be moved to deleted roles. You can restore it later.`,
    confirmLabel: "Delete",
    destructive: true,
  },
  restore: {
    title: "Restore role",
    describe: (role) => `"${role.name}" will be moved back to active roles.`,
    confirmLabel: "Restore",
    destructive: false,
  },
  status: {
    title: "Change role status",
    describe: (role) =>
      `"${role.name}" will be set to ${role.is_active ? "inactive" : "active"}.`,
    confirmLabel: "Update",
    destructive: false,
  },
};

const Role = () => {
  // ========== DATA ==========
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

  const { Delete } = useDeleteRole();
  const { Restore } = useRestoreRole();
  const { UpdateStatus } = useUpdateRoleStatus();
  const { searchRole } = useSearchRole();

  // ========== FETCH ==========
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
  // Excel-style filters on Department / Branch, kept in the store. They
  // apply on top of the search result and only to the loaded rows.
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

  // Like Excel, each column lists the values still available after the
  // OTHER column's filter, so a choice in one narrows the next.
  const columnFilters = useMemo(
    () => buildProps(roleData),
    [buildProps, roleData],
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
    firstId: roleFirstId,
    lastId: roleLastId,
    onFetch: fetchRoles,
  });

  // Two entry points on purpose. The mount effect reuses whatever the
  // store already holds for page 1, so navigating back here does not
  // refetch; a mutation forces the request, because the rows have
  // genuinely changed.
  const loadFirstPage = useCallback(() => {
    resetToFirstPage();
    return fetchRoles();
  }, [resetToFirstPage, fetchRoles]);

  const reloadFromStart = useCallback(() => {
    resetToFirstPage();
    return fetchRoles({ force: true });
  }, [resetToFirstPage, fetchRoles]);

  // Load the first page on mount.
  useEffect(() => {
    loadFirstPage();
  }, [loadFirstPage]);

  // ========== ROW ACTIONS ==========
  const [pendingAction, setPendingAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const runPendingAction = useCallback(async () => {
    if (!pendingAction) return;
    const { type, role } = pendingAction;
    const services = {
      delete: Delete,
      restore: Restore,
      status: UpdateStatus,
    };

    setActionLoading(true);
    try {
      await services[type]({ id: role.id });
      await reloadFromStart();
    } finally {
      setActionLoading(false);
      setPendingAction(null);
    }
  }, [pendingAction, Delete, Restore, UpdateStatus, reloadFromStart]);

  // ========== DERIVED ==========
  // Backend sends the table-wide active total; fall back to counting the
  // loaded page until the first response lands.
  const loadedActiveCount = roleData.filter(
    (item) => item.is_active && !item.is_deleted,
  ).length;
  const activeCount = totalActiveCount || loadedActiveCount;

  const actionCopy = pendingAction ? CONFIRM_ACTIONS[pendingAction.type] : null;
  // Skeleton only while there is nothing to show yet. Paging also sets
  // `loading`, and the totals do not change between pages, so keying off
  // `loading` alone would flash the numbers on every page turn.
  const countsLoading = loading && roleData.length === 0;

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
          title="Total Roles"
          value={totalCount || roleData.length}
          loading={countsLoading}
        />
        <SuperAdminCard
          title="Active Roles"
          value={activeCount}
          loading={countsLoading}
        />
      </div>

      <SuperAdminTableHeader
        onSearch={onSearchChange}
        placeholder="Search role..."
        disabled={loading}
        createButton={
          <CreateRole onCreated={reloadFromStart} disabled={loading} />
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
            onEdited={reloadFromStart}
            onDelete={(role) => setPendingAction({ type: "delete", role })}
            onRestore={(role) => setPendingAction({ type: "restore", role })}
            onToggleStatus={(role) =>
              setPendingAction({ type: "status", role })
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
          pendingAction ? actionCopy.describe(pendingAction.role) : ""
        }
        confirmLabel={actionCopy?.confirmLabel}
        destructive={actionCopy?.destructive}
        loading={actionLoading}
        onConfirm={runPendingAction}
      />
    </div>
  );
};

export default Role;
