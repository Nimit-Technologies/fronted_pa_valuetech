import React from "react";
import GreetingHeader from "@/components/shared/greetingHeader";
import SuperAdminCard from "@/features/superAdmin/components/superAdminCard";
import { branchData } from "@/features/superAdmin/data/branch/branchTable.js";
import { branchAdminData } from "@/features/superAdmin/data/branch_admin/branchAdminTable.js";

const SuperAdminHome = () => {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto">
      <GreetingHeader />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SuperAdminCard
          title="Total Branches"
          value={branchData.total_branch}
        />
        <SuperAdminCard
          title="Active Branches"
          value={branchData.active_branch}
        />
        <SuperAdminCard
          title="Total Users"
          value={branchAdminData.total_user}
        />
      </div>
    </div>
  );
};

export default SuperAdminHome;
