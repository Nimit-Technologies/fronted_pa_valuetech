import React, { useState } from "react";
import SuperAdminTableHeader from "../components/superAdminTableHeader";
import BranchTable from "../components/branch/branchTable";
import SuperAdminCard from "../components/superAdminCard";
import { branchData } from "../data/branch/branchTable.js";
import { branchTableHeader } from "../data/branch/branchTableHeader.js";
import CreateBranch from "../components/branch/createBranch";
const Branch = () => {
  const [search, setSearch] = useState("");

  const filteredData = {
    ...branchData,
    data: branchData.data.filter((b) =>
      b.name.toLowerCase().includes(search.toLowerCase()),
    ),
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SuperAdminCard
          title="Total Branches"
          value={branchData.total_branch}
        />
        <SuperAdminCard
          title="Active Branches"
          value={branchData.active_branch}
        />
      </div>

      <SuperAdminTableHeader
        onSearch={setSearch}
        createButton={<CreateBranch />}
      />

      <BranchTable data={filteredData} headers={branchTableHeader} />
    </div>
  );
};

export default Branch;
