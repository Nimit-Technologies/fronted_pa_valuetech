import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import SuperAdminCard from "@/features/superAdmin/components/superAdminCard";
import SuperAdminTableHeader from "@/features/superAdmin/components/superAdminTableHeader";
import UserTable from "@/features/superAdmin/components/user/userTable";
import { userTableHeader } from "@/features/superAdmin/data/user/userTableHeader.js";
import useAllUser from "@/features/superAdmin/hooks/user/useAllUser";

const User = () => {
  const user = useSelector((state) => state.user);
  const userData = user.userData || [];
  const { allUser } = useAllUser();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const fetchUsers = useCallback(
    async ({ direction = "next", cursorId = "" } = {}) => {
      await allUser({ direction, cursorId, dataLimit: 5 });
    },
    [allUser],
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredData = userData.filter((item) => {
    const fullName = `${item.first_name ?? ""} ${item.last_name ?? ""}`
      .trim()
      .toLowerCase();
    const q = search.toLowerCase();
    return (
      fullName.includes(q) || (item.employee_id ?? "").toLowerCase().includes(q)
    );
  });

  const handlePrev = () => {
    if (!user.hasPreviousPage) return;
    fetchUsers({ direction: "previous", cursorId: user.userFirstId });
  };

  const handleNext = () => {
    if (!user.hasNextPage) return;
    fetchUsers({ direction: "next", cursorId: user.userLastId });
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SuperAdminCard
          title="Total Users"
          value={user.userLength || userData.length}
        />
        <SuperAdminCard
          title="Active Users"
          value={userData.filter((item) => item.is_active).length}
        />
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

      <UserTable
        data={filteredData}
        headers={userTableHeader}
        hasNextPage={user.hasNextPage}
        hasPreviousPage={user.hasPreviousPage}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
};

export default User;
