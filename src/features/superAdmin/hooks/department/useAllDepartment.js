import React from "react";
import allDepartments from "../../services/department/allDepartments";
import { useDispatch } from "react-redux";
import { setDepartment } from "../../slice/department/departmentSlice";
import { normalizeDepartments } from "../../services/department/normalizeDepartment";
// import allDepartments from '../../services/department/allDepartments';

const useAllDepartment = () => {
  const dispatch = useDispatch();
  const allDepartment = async ({
    direction = "next",
    cursorId = "",
    dataLimit = 2,
  } = {}) => {
    try {
      const response = await allDepartments({ direction, cursorId, dataLimit });
      const clearDepartment = normalizeDepartments(
        response.data || response.departments || [],
      );

      dispatch(
        setDepartment({
          data: clearDepartment,
          hasNextPage: response.hasNextPage,
          hasPreviousPage: response.hasPreviousPage,
          departmentFirstId: response.departmentFirstId,
          departmentLastId: response.departmentLastId,
          dataLimit: response.dataLimit || dataLimit,
          departmentLength: response.departmentLength,
        }),
      );

      return clearDepartment;
    } catch (err) {
      console.log(err);
      return err;
    }
  };
  return { allDepartment };
};

export default useAllDepartment;
