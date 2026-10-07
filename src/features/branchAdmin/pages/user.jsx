// ...existing code...
import React, { useCallback, useMemo, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserTable from "@/features/branchAdmin/component/user/userTable";
import { userTableHeader } from "@/features/branchAdmin/data/user/userTableHeader";
// import { userTableData } from "@/features/branchAdmin/data/user/userTable";

// import { Button } from "@/components/ui/button";
// import { Plus } from "lucide-react";
import BranchAdminCard from "@/features/branchAdmin/component/branchAdminCard";
import BranchAdminTableHeader from "@/features/branchAdmin/component/branchAdminTableHeader";
import useAllUser from "@/features/branchAdmin/hooks/user/useAllUser";
import useSearchUser from "../hooks/user/useSearchUser";
import { useTableSearch } from "@/hooks/search/useTableSearch";
import useUserFilters, {
  USER_FILTER_COLUMNS,
  applyUserFilters,
  buildFilterOptions,
} from "../hooks/user/useUserFilter";

import { usePaginationController } from "@/hooks/pagination/usePaginationController";
import Pagination from "@/components/shared/pagination";

const FEATURE_KEY = "user";
// const fullName = (user) =>
//   `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || user.employee_id;

const User = () => {
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

  const { searchUser } = useSearchUser();

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

  // ========== DERIVED ==========
  // Backend sends the table-wide active total; fall back to counting the
  // loaded page until the first response lands.
  const loadedActiveCount = userData.filter(
    (item) => item.is_active && !item.is_deleted,
  ).length;
  const activeCount = totalActiveCount || loadedActiveCount;

  const noSearchResults =
    Boolean(searchTerm) &&
    filteredData.length === 0 &&
    !loading &&
    !isSearching;

  // const [search, setSearch] = useState("");
  // // const navigate = useNavigate();

  // const filteredData = {
  //   ...userTableData,
  //   data: (userTableData.data || []).filter((user) => {
  //     const q = (search || "").trim().toLowerCase();
  //     if (!q) return true;
  //     const fullName =
  //       `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();
  //     return (
  //       (user.employee_id ?? "").toLowerCase().includes(q) ||
  //       fullName.toLowerCase().includes(q) ||
  //       (user.phone ?? "").toLowerCase().includes(q) ||
  //       (user.email ?? "").toLowerCase().includes(q) ||
  //       (user.adhar_number ?? "").toLowerCase().includes(q) ||
  //       (user.branch?.name ?? "").toLowerCase().includes(q) ||
  //       (user.department?.name ?? "").toLowerCase().includes(q) ||
  //       (user.role?.name ?? "").toLowerCase().includes(q)
  //     );
  //   }),
  // };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
      {/* Dashboard Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BranchAdminCard
          title="Total Users"
          value={totalCount || userData.length}
        />
        <BranchAdminCard title="Active Users" value={activeCount} />
      </div>

      <BranchAdminTableHeader
        onSearch={onSearchChange}
        placeholder="Search user..."
        disabled={loading}
        // createButton={
        //   <Button
        //     className="gap-2"
        //     onClick={() => navigate("/branch-admin/user/create")}
        //   >
        //     <Plus size={16} />
        //     Create User
        //   </Button>
        // }
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
            // onDelete={(user) => setPendingAction({ type: "delete", user })}
            // onRestore={(user) => setPendingAction({ type: "restore", user })}
            // onToggleStatus={(user) =>
            //   setPendingAction({ type: "status", user })
            // }
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
    </div>
  );
};

export default User;
// ...existing code...
