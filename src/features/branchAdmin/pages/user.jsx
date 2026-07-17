// ...existing code...
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import UserTable from "../component/user/userTable";
import { userTableHeader } from "../data/user/userTableHeader";
import { userTableData } from "../data/user/userTable";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import BranchAdminCard from "../component/branchAdminCard";
import BranchAdminTableHeader from "../component/branchAdminTableHeader";

const User = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredData = {
    ...userTableData,
    data: (userTableData.data || []).filter((user) => {
      const q = (search || "").trim().toLowerCase();
      if (!q) return true;
      const fullName =
        `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();
      return (
        (user.employee_id ?? "").toLowerCase().includes(q) ||
        fullName.toLowerCase().includes(q) ||
        (user.phone ?? "").toLowerCase().includes(q) ||
        (user.email ?? "").toLowerCase().includes(q) ||
        (user.adhar_number ?? "").toLowerCase().includes(q) ||
        (user.branch?.name ?? "").toLowerCase().includes(q) ||
        (user.department?.name ?? "").toLowerCase().includes(q) ||
        (user.role?.name ?? "").toLowerCase().includes(q)
      );
    }),
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
      {/* Dashboard Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BranchAdminCard title="Total Users" value={userTableData.total_user} />
      </div>

      <BranchAdminTableHeader
        onSearch={setSearch}
        createButton={
          <Button
            className="gap-2"
            onClick={() => navigate("/branch-admin/user/create")}
          >
            <Plus size={16} />
            Create User
          </Button>
        }
      />

      <UserTable data={filteredData} headers={userTableHeader} />
    </div>
  );
};

export default User;
// ...existing code...
