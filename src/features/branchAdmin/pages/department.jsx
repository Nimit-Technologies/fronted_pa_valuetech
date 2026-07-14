import React, { useState } from "react";

import SuperAdminCard from "../../superAdmin/components/superAdminCard";
import SuperAdminTableHeader from "../../superAdmin/components/superAdminTableHeader";

import DepartmentTable from "../component/Department/DepartmentTable";
import CreateDepartment from "../component/Department/createDepartment";

import {
  departmentData,
  departmentTableHeader,
} from "../data/department/departmentTable";

const Department = () => {
  const [search, setSearch] = useState("");

  const filteredData = {
    ...departmentData,

    data: departmentData.data.filter((department) =>
      department.name.toLowerCase().includes(search.toLowerCase()),
    ),
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto">
      {/* Card */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SuperAdminCard
          title="Total Department"

          value={departmentData.total_department}
        />
      </div>

      {/* Search + Create */}

      <SuperAdminTableHeader
        onSearch={setSearch}

        createButton={<CreateDepartment />}
      />

      {/* Table */}

      <DepartmentTable
        data={filteredData}

        headers={departmentTableHeader}
      />
    </div>
  );
};

export default Department;
