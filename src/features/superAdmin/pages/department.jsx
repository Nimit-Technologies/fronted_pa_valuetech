import React, { useState } from "react";

import SuperAdminCard from "@/features/superAdmin/components/superAdminCard";
import SuperAdminTableHeader from "@/features/superAdmin/components/superAdminTableHeader";

import DepartmentTable from "@/features/superAdmin/components/department/departmentTable";
import CreateDepartment from "@/features/superAdmin/components/department/createDepartment";

import { departmentData } from "@/features/superAdmin/data/department/departmentTable";
import { DepartmentTableHeader } from "@/features/superAdmin/data/department/departmentTableHeader";

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
        placeholder="Search department..."
        createButton={<CreateDepartment />}
      />

      {/* Table */}

      <DepartmentTable
        data={filteredData}

        headers={DepartmentTableHeader}
      />
    </div>
  );
};

export default Department;
