import React from "react";

export const normalizeRole = (rawRole) => {
  if (!rawRole) return null;

  const roleData = rawRole.data ?? rawRole;
  return {
    id: roleData.id ?? roleData.role_id ?? roleData._id,
    name: roleData.name ?? roleData.role_name ?? "N/A",
    code: roleData.code ?? roleData.role_code ?? "",
    isActive: roleData.is_active ?? roleData.status === "ACTIVE",
  };
};

export const normalizeRoles = (roleList) => {
  if (!Array.isArray(roleList)) return [];
  return roleList.map(normalizeRole);
};
