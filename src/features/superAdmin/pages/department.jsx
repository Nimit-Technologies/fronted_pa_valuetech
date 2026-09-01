import React, { useState } from "react";

import SuperAdminCard from "@/features/superAdmin/components/superAdminCard";
import SuperAdminTableHeader from "@/features/superAdmin/components/superAdminTableHeader";

import DepartmentTable from "@/features/superAdmin/components/department/departmentTable";
import CreateDepartment from "@/features/superAdmin/components/department/createDepartment";

// import { departmentData } from "@/features/superAdmin/data/department/departmentTable";
import { DepartmentTableHeader } from "@/features/superAdmin/data/department/departmentTableHeader";
import useAllDepartment from "../hooks/department/useAllDepartment";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Department = () => {
  const department = useSelector((state) => state.department);
  const departmentData = department.departmentData;
  const { allDepartment } = useAllDepartment();
  const [search, setSearch] = useState("");

  const fetchDepartments = async ({
    direction = "next",
    cursorId = "",
  } = {}) => {
    await allDepartment({ direction, cursorId, dataLimit: 2 });
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const filteredData = departmentData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handlePrev = () => {
    if (!department.hasPreviousPage) return;
    fetchDepartments({
      direction: "previous",
      cursorId: department.departmentFirstId,
    });
  };

  const handleNext = () => {
    if (!department.hasNextPage) return;
    fetchDepartments({
      direction: "next",
      cursorId: department.departmentLastId,
    });
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SuperAdminCard
          title="Total Department"
          value={department.departmentLength || departmentData.length}
        />
      </div>

      <SuperAdminTableHeader
        onSearch={setSearch}
        placeholder="Search department..."
        createButton={<CreateDepartment />}
      />

      <DepartmentTable
        data={filteredData}
        headers={DepartmentTableHeader}
        hasNextPage={department.hasNextPage}
        hasPreviousPage={department.hasPreviousPage}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
};

export default Department;
