import React, { useEffect, useCallback } from "react";

import BranchAdminCard from "@/features/branchAdmin/component/branchAdminCard";
import BranchAdminSearchbar from "@/features/branchAdmin/component/branchAdminTableHeader";

import DepartmentTable from "@/features/branchAdmin/component/department/departmentTable";
// import CreateDepartment from "@/features/branchAdmin/component/department/createDepartment";

// import {
//   departmentData,
//   departmentTableHeader,
// } from "@/features/branchAdmin/data/department/departmentTable";

import useAllDepartment from "../hooks/department/useAllDepartments";
import useSearchDepartment from "../hooks/department/useSearchDepartment";
import { usePaginationController } from "@/hooks/pagination/usePaginationController";
import { useTableSearch } from "@/hooks/search/useTableSearch";
import Pagination from "@/components/shared/pagination";
import { DepartmentTableHeader } from "../data/department/departmentTableHeader";

const FEATURE_KEY = "department";

const Department = () => {
  const {
    allDepartment,
    departmentData,
    departmentFirstId,
    departmentLastId,
    hasNextPage,
    hasPreviousPage,
    loading,
    totalCount,
    totalActiveCount,
  } = useAllDepartment();

  const { searchDepartment } = useSearchDepartment();

  const fetchDepartments = useCallback(
    ({ direction = "next", cursorId = "" } = {}) =>
      allDepartment({ direction, cursorId }),
    [allDepartment],
  );
  const { searchTerm, filteredData, onSearchChange, isSearching } =
    useTableSearch({
      data: departmentData,
      keys: ["name"],
      serverSearch: searchDepartment,
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
    firstId: departmentFirstId,
    lastId: departmentLastId,
    onFetch: fetchDepartments,
  });

  const reloadFromStart = useCallback(() => {
    resetToFirstPage();
    return fetchDepartments();
  }, [resetToFirstPage, fetchDepartments]);

  // Load the first page on mount.
  useEffect(() => {
    reloadFromStart();
  }, [reloadFromStart]);

  const loadedActiveCount = departmentData.filter(
    (item) => item.is_active && !item.is_deleted,
  ).length;
  const activeCount = totalActiveCount || loadedActiveCount;

  const noSearchResults =
    Boolean(searchTerm) &&
    filteredData.length === 0 &&
    !loading &&
    !isSearching;

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto">
      {/* Card */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BranchAdminCard
          title="Total Department"
          value={totalCount || departmentData.length}
        />
        <BranchAdminCard title="Active Department" value={activeCount} />
      </div>

      {/* Search + Create */}

      <BranchAdminSearchbar
        onSearch={onSearchChange}
        placeholder="Search department..."
        disabled={loading}
        // createButton={<CreateDepartment />}
      />

      {/* Table */}

      {noSearchResults ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No departments match &quot;{searchTerm}&quot;.
        </div>
      ) : (
        <>
          <DepartmentTable
            data={filteredData}
            isLoading={loading}
            headers={DepartmentTableHeader}
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

export default Department;
