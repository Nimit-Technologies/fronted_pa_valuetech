import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EngineerTableHeader from "@/features/individualEngineer/components/engineerTableHeader";
import CaseTable from "@/features/individualEngineer/components/case/engineerCaseTable";
import EngineerCard from "@/features/individualEngineer/components/engineerCard";
import {
  clearEngineerTasks,
  fetchEngineerTasks,
} from "@/features/individualEngineer/slice/engineerTaskSlice";
import { caseTableHeader } from "@/features/individualEngineer/data/case/caseTableHeader.js";
import useTransitionEngineerCase from "@/features/individualEngineer/hooks/useTransitionEngineerCase";

const CaseDashboard = () => {
  const dispatch = useDispatch();
  const {
    engineerTaskData: tasks,
    loading,
    error,
    hasPreviousPage,
    hasNextPage,
    taskFirstId,
    taskLastId,
    totalCount,
    totalActiveCount,
  } = useSelector((state) => state.engineerTask);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const requestId = useRef(0);
  const { transition, updatingCaseId } = useTransitionEngineerCase();

  const loadTasks = useCallback(
    async (params = {}) => {
      const currentRequestId = ++requestId.current;

      try {
        const response = await dispatch(fetchEngineerTasks(params)).unwrap();
        if (currentRequestId !== requestId.current) return;

        return response;
      } catch {
        if (currentRequestId !== requestId.current) return;
        return null;
      }
    },
    [dispatch],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPage(1);
      dispatch(clearEngineerTasks());
      loadTasks({ search: search.trim(), direction: "next", cursorId: "" });
    }, 250);

    return () => {
      clearTimeout(timeoutId);
      requestId.current += 1;
    };
  }, [dispatch, loadTasks, search]);

  const handleNext = async () => {
    const response = await loadTasks({
      direction: "next",
      cursorId: taskLastId,
      search: search.trim(),
    });
    if (response) setPage((currentPage) => currentPage + 1);
  };

  const handlePrevious = async () => {
    const response = await loadTasks({
      direction: "previous",
      cursorId: taskFirstId,
      search: search.trim(),
    });
    if (response) setPage((currentPage) => Math.max(1, currentPage - 1));
  };

  const handleRetry = () => {
    setPage(1);
    return loadTasks({
      search: search.trim(),
      direction: "next",
      cursorId: "",
    });
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <EngineerCard
          title="Total Tasks"
          value={totalCount === null && loading ? "—" : totalCount}
        />
        <EngineerCard
          title="Active Tasks"
          value={totalActiveCount === null && loading ? "—" : totalActiveCount}
        />
      </div>

      <EngineerTableHeader
        onSearch={setSearch}
        placeholder="Search by file number, customer, case type or phone..."
      />

      <CaseTable
        tasks={tasks}
        headers={caseTableHeader}
        loading={loading}
        error={error}
        page={page}
        hasPreviousPage={hasPreviousPage}
        hasNextPage={hasNextPage}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onRetry={handleRetry}
        onStatusSelect={transition}
        updatingCaseId={updatingCaseId}
      />
    </div>
  );
};

export default CaseDashboard;
