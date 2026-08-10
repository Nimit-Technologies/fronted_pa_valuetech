import React, { useState } from "react";
import SuperAdminCard from "@/features/superAdmin/components/superAdminCard";
import SuperAdminTableHeader from "@/features/superAdmin/components/superAdminTableHeader";

import RoleTable from "@/features/branchAdmin/component/role/roleTable";
import CreateRole from "@/features/branchAdmin/component/role/createRole";

import { roleData } from "@/features/branchAdmin/data/role/roleTable";
import { roleTableHeader } from "@/features/branchAdmin/data/role/roleTableHeader";

const Role = () => {
  const [search, setSearch] = useState("");

  const filteredData = {
    ...roleData,
    data: roleData.data.filter((role) =>
      role.name.toLowerCase().includes(search.toLowerCase()),
    ),
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto">
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SuperAdminCard title="Total Cases" value={roleData.total_role} />
      </div>

      {/* Search + Create Button */}
      <SuperAdminTableHeader
        onSearch={setSearch}
        createButton={<CreateRole />}
      />

      {/* Table */}
      <RoleTable data={filteredData} headers={roleTableHeader} />
    </div>
  );
};

export default Role;
