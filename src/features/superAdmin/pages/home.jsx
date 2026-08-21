import React from "react";
import GreetingHeader from "@/components/shared/greetingHeader";
import SuperAdminCard from "@/features/superAdmin/components/superAdminCard";
import { branchData } from "@/features/superAdmin/data/branch/branchTable.js";
import { userData } from "@/features/superAdmin/data/user/userTable.js";
import { roleData } from "@/features/superAdmin/data/role/roleTable.js";
import { departmentData } from "@/features/superAdmin/data/department/departmentTable.js";

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
        <SuperAdminCard title="Total Users" value={userData.total_user} />
        <SuperAdminCard
          title="Total Departments"
          value={departmentData.total_department}
        />
        <SuperAdminCard title="Total Roles" value={roleData.total_role} />
      </div>
    </div>
  );
};

export default SuperAdminHome;
