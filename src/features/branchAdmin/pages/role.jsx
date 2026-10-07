import React, { useCallback, useEffect } from "react";
import BranchAdminCard from "@/features/branchAdmin/component/branchAdminCard";
import BranchAdminTableHeader from "@/features/branchAdmin/component/branchAdminTableHeader";

import RoleTable from "@/features/branchAdmin/component/role/roleTable";
// import CreateRole from "@/features/branchAdmin/component/role/createRole";

// import { roleData } from "@/features/branchAdmin/data/role/roleTable";
import { roleTableHeader } from "@/features/branchAdmin/data/role/roleTableHeader";
import useAllRole from "../hooks/role/useAllRole";
import useSearchRole from "../hooks/role/useSearchRole";
import { useTableSearch } from "@/hooks/search/useTableSearch";
import { usePaginationController } from "@/hooks/pagination/usePaginationController";
import Pagination from "@/components/shared/pagination";

const Role = () => {
  const FEATURE_KEY = "role";

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

  const { searchRole } = useSearchRole();
  // const [searchTerm, setSearchTerm] = useState("");

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

  const loadedActiveCount = roleData.filter((item) => item.is_active).length;
  const activeCount = totalActiveCount || loadedActiveCount;

  const noSearchResults =
    Boolean(searchTerm) &&
    filteredData.length === 0 &&
    !loading &&
    !isSearching;

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto">
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BranchAdminCard
          title="Total Roles"
          value={totalCount || roleData.length}
        />
        <BranchAdminCard title="Active Roles" value={activeCount} />
      </div>

      {/* Search + Create Button */}
      <BranchAdminTableHeader
        onSearch={onSearchChange}
        placeholder="Search role..."
        disabled={loading}
      />

      {/* Table */}

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

            // onToggleStatus={(role) =>
            //   setPendingAction({ type: "status", role })
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

export default Role;
