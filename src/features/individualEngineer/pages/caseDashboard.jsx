import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EngineerTableHeader from "@/features/individualEngineer/components/engineerTableHeader";
import CaseTable from "@/features/individualEngineer/components/case/engineerCaseTable";
import EngineerCard from "@/features/individualEngineer/components/engineerCard";
import { fetchEngineerTasks } from "@/features/individualEngineer/slice/engineerTaskSlice";
import { caseTableHeader } from "@/features/individualEngineer/data/case/caseTableHeader.js";
import useTransitionEngineerCase from "@/features/individualEngineer/hooks/useTransitionEngineerCase";

// How long to wait after the last keystroke before asking the server. Not
// applied to the first load: that one used to run through this same timer,
// which meant every engineer opening this screen stared at an empty table for
// a quarter second before the request even went out, for no reason — there
// was no typing to debounce yet.
const SEARCH_DEBOUNCE_MS = 250;

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
  // Distinguishes the mount run of the effect below from a run caused by the
  // user actually typing, since only the latter should wait out the debounce.
  const isFirstRun = useRef(true);
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
    const loadFirstPage = () => {
      setPage(1);
      loadTasks({ search: search.trim(), direction: "next", cursorId: "" });
    };

    // The first task list an engineer sees on this screen, not a reaction to
    // a search they typed — nothing to debounce, and nothing gained by making
    // them wait SEARCH_DEBOUNCE_MS to find out what is on their queue.
    if (isFirstRun.current) {
      isFirstRun.current = false;
      loadFirstPage();
      return undefined;
    }

    const timeoutId = setTimeout(loadFirstPage, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timeoutId);
      requestId.current += 1;
    };
  }, [loadTasks, search]);

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
