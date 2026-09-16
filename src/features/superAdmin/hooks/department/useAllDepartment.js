import { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import GetAllDepartments from "@/features/superAdmin/services/department/allDepartments";

import {
  departmentStart,
  departmentFailure,
  setDepartment,
} from "@/features/superAdmin/slice/department/departmentSlice";
import { extractErrorMessage } from "@/utils/extractErrorMessage";

const useAllDepartment = () => {
  const dispatch = useDispatch();
  const latestRequest = useRef(0);

  const {
    departmentData,
    departmentFirstId,
    departmentLastId,
    hasNextPage,
    hasPreviousPage,
    departmentLength,
    dataLimit,
    loading,
    error,
    totalCount,
    totalActiveCount,
    success,
  } = useSelector((state) => state.department);

  const allDepartment = useCallback(
    async ({ direction = "next", cursorId = "", search = "" } = {}) => {
      const term = String(search ?? "").trim();
      const requestId = ++latestRequest.current;

      dispatch(departmentStart());
      try {
        const params = { direction, cursorId };
        if (term) params.search = term;

        const response = await GetAllDepartments(params);

        // Rows are stored exactly as the API sends them: id, name, is_active,
        // is_deleted, branch_id and branch { id, name }.
        const departments = response.data || [];

        // A newer call from this hook instance started while we were waiting
        // (e.g. the user kept typing, or paged again). Let that one own the
        // slice instead of clobbering it with this stale response.
        if (requestId !== latestRequest.current) return departments;

        dispatch(
          setDepartment({
            data: departments,
            departmentFirstId: response.departmentFirstId,
            departmentLastId: response.departmentLastId,
            hasNextPage: response.hasNextPage,
            hasPreviousPage: response.hasPreviousPage,
            dataLimit: response.dataLimit,
            departmentLength: response.departmentLength,
            totalCount: response.totalCount,
            totalActiveCount: response.totalActiveCount,
          }),
        );

        return departments;
      } catch (err) {
        if (requestId !== latestRequest.current) return [];
        dispatch(
          departmentFailure(
            extractErrorMessage(err, "Failed to load departments"),
          ),
        );
        return [];
      }
    },
    [dispatch],
  );

  return {
    allDepartment,
    departmentData,
    departmentFirstId,
    departmentLastId,
    hasNextPage,
    hasPreviousPage,
    departmentLength,
    dataLimit,
    loading,
    error,
    totalCount,
    totalActiveCount,
    success,
  };
};

export default useAllDepartment;
