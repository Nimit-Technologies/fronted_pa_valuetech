import React, { useCallback, useEffect, useState } from "react";

import SuperAdminCard from "@/features/superAdmin/components/superAdminCard";
import SuperAdminTableHeader from "@/features/superAdmin/components/superAdminTableHeader";
import Pagination from "@/components/shared/pagination";
import ConfirmDialog from "@/components/shared/confirmDialog";
import RoleTable from "@/features/superAdmin/components/role/roleTable";
import CreateRole from "@/features/superAdmin/components/role/createRole";
import { roleTableHeader } from "@/features/superAdmin/data/role/roleTableHeader";

import useAllRole from "@/features/superAdmin/hooks/role/useAllRole";
import useDeleteRole from "@/features/superAdmin/hooks/role/useDeleteRole";
import useUpdateRoleStatus from "@/features/superAdmin/hooks/role/useUpdateRoleStatus";
import useSearchRole from "@/features/superAdmin/hooks/role/useSearchRole";
import { useTableSearch } from "@/hooks/search/useTableSearch";
import { usePaginationController } from "@/hooks/pagination/usePaginationController";

const FEATURE_KEY = "role";

// Copy for each row action the confirm dialog gates. The list API hides
// soft-deleted roles, so there is no restore action on this page.
const CONFIRM_ACTIONS = {
  delete: {
    title: "Delete role",
    describe: (role) =>
      `"${role.name}" will be removed from the roles list. Users holding it keep their assignment until they are re-assigned.`,
    confirmLabel: "Delete",
    destructive: true,
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
  const { UpdateStatus } = useUpdateRoleStatus();
  const { searchRole } = useSearchRole();

  // ========== FETCH ==========
  const fetchRoles = useCallback(
    ({ direction = "next", cursorId = "" } = {}) =>
      allRole({ direction, cursorId }),
    [allRole],
  );

  const { searchTerm, filteredData, onSearchChange, isSearching } =
    useTableSearch({
      data: roleData,
      keys: ["name"],
      serverSearch: searchRole,
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
    firstId: roleFirstId,
    lastId: roleLastId,
    onFetch: fetchRoles,
  });

  const reloadFromStart = useCallback(() => {
    resetToFirstPage();
    return fetchRoles();
  }, [resetToFirstPage, fetchRoles]);

  // Load the first page on mount.
  useEffect(() => {
    reloadFromStart();
  }, [reloadFromStart]);

  // ========== ROW ACTIONS ==========
  const [pendingAction, setPendingAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const runPendingAction = useCallback(async () => {
    if (!pendingAction) return;
    const { type, role } = pendingAction;
    const services = { delete: Delete, status: UpdateStatus };

    setActionLoading(true);
    try {
      await services[type]({ id: role.id });
      await reloadFromStart();
    } finally {
      setActionLoading(false);
      setPendingAction(null);
    }
  }, [pendingAction, Delete, UpdateStatus, reloadFromStart]);

  // ========== DERIVED ==========
  // Backend sends the table-wide active total; fall back to counting the
  // loaded page until the first response lands.
  const loadedActiveCount = roleData.filter((item) => item.is_active).length;
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
          title="Total Roles"
          value={totalCount || roleData.length}
        />
        <SuperAdminCard title="Active Roles" value={activeCount} />
      </div>

      <SuperAdminTableHeader
        onSearch={onSearchChange}
        placeholder="Search role..."
        disabled={loading}
        createButton={
          <CreateRole onCreated={reloadFromStart} disabled={loading} />
        }
      />

      {noSearchResults ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No roles match &quot;{searchTerm}&quot;.
        </div>
      ) : (
        <>
          <RoleTable
            data={filteredData}
            headers={roleTableHeader}
            isLoading={loading}
            onEdited={reloadFromStart}
            onDelete={(role) => setPendingAction({ type: "delete", role })}
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
