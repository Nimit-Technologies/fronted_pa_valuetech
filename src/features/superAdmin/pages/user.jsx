import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SuperAdminTableHeader from "@/features/superAdmin/components/superAdminTableHeader";
import UserTable from "@/features/superAdmin/components/user/userTable";
import SuperAdminCard from "@/features/superAdmin/components/superAdminCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { userData } from "@/features/superAdmin/data/user/userTable.js";
import { userTableHeader } from "@/features/superAdmin/data/user/userTableHeader.js";

const User = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredData = {
    ...userData,
    data: userData.data.filter((u) => {
      const fullName = `${u.first_name} ${u.last_name}`.toLowerCase();
      const q = search.toLowerCase();
      return fullName.includes(q) || u.employee_id?.toLowerCase().includes(q);
    }),
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SuperAdminCard title="Total Users" value={userData.total_user} />
        <SuperAdminCard title="Active Users" value={userData.active_user} />
      </div>

      <SuperAdminTableHeader
        onSearch={setSearch}
        placeholder="Search user..."
        createButton={
          <Button
            className="gap-2 whitespace-nowrap"
            onClick={() => navigate("/super-admin/user/create")}
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
