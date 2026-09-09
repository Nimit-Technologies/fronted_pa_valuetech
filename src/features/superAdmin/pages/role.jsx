import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SuperAdminCard from "@/features/superAdmin/components/superAdminCard";
import SuperAdminTableHeader from "@/features/superAdmin/components/superAdminTableHeader";

import RoleTable from "@/features/superAdmin/components/role/roleTable";
import CreateRole from "@/features/superAdmin/components/role/createRole";
import { roleTableHeader } from "@/features/superAdmin/data/role/roleTableHeader";
import useAllRole from "@/features/superAdmin/hooks/role/useAllRole";

const Role = () => {
  const role = useSelector((state) => state.role);
  const roleData = role.roleData || [];
  const { allRole } = useAllRole();
  const [search, setSearch] = useState("");

  const fetchRoles = async ({ direction = "next", cursorId = "" } = {}) => {
    await allRole({ direction, cursorId, dataLimit: 2 });
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const filteredData = roleData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handlePrev = () => {
    if (!role.hasPreviousPage) return;
    fetchRoles({ direction: "previous", cursorId: role.roleFirstId });
  };

  const handleNext = () => {
    if (!role.hasNextPage) return;
    fetchRoles({ direction: "next", cursorId: role.roleLastId });
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SuperAdminCard
          title="Total Roles"
          value={role.roleLength || roleData.length}
        />
      </div>

      <SuperAdminTableHeader
        onSearch={setSearch}
        placeholder="Search role..."
        createButton={<CreateRole />}
      />

      <RoleTable
        data={filteredData}
        headers={roleTableHeader}
        hasNextPage={role.hasNextPage}
        hasPreviousPage={role.hasPreviousPage}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
};

export default Role;
