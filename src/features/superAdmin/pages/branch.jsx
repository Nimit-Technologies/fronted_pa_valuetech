import React, { useState, useEffect } from "react";
import SuperAdminTableHeader from "@/features/superAdmin/components/superAdminTableHeader";
import BranchTable from "@/features/superAdmin/components/branch/branchTable";
import SuperAdminCard from "@/features/superAdmin/components/superAdminCard";
// import { branchData } from "@/features/superAdmin/data/branch/branchTable.js";
import { branchTableHeader } from "@/features/superAdmin/data/branch/branchTableHeader.js";
import CreateBranch from "@/features/superAdmin/components/branch/createBranch";

import useAllBranch from "../hooks/branch/useAllBranch";
import { useSelector } from "react-redux";

const Branch = () => {
  const branch = useSelector((state) => state.branch);
  const branchData = branch.branchData;
  const { allBranch } = useAllBranch();
  const [search, setSearch] = useState("");

  const fetchBranches = async ({ direction = "next", cursorId = "" } = {}) => {
    await allBranch({ direction, cursorId, dataLimit: 2 });
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const filteredData = branchData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handlePrev = () => {
    if (!branch.hashPreviousPage) return;
    fetchBranches({ direction: "previous", cursorId: branch.branchFirstId });
  };

  const handleNext = () => {
    if (!branch.hashNextPage) return;
    fetchBranches({ direction: "next", cursorId: branch.branchLastId });
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SuperAdminCard
          title="Total Branches"
          value={branch.branchLength || branchData.length}
        />
        <SuperAdminCard
          title="Active Branches"
          value={branchData.filter((item) => item.isActive).length}
        />
      </div>

      <SuperAdminTableHeader
        onSearch={setSearch}
        createButton={<CreateBranch />}
      />

      <BranchTable
        data={filteredData}
        headers={branchTableHeader}
        hasNextPage={branch.hashNextPage}
        hasPreviousPage={branch.hashPreviousPage}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
};

export default Branch;
