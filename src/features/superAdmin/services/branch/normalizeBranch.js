import React from "react";

export const normalizeBranch = (rawBranch) => {
  if (!rawBranch) return null;

  const branchData = rawBranch.data ?? rawBranch;
  return {
    id: branchData.id ?? branchData.branch_id ?? branchData._id,
    name: branchData.name ?? branchData.branch_name ?? "N/A",
    code: branchData.code ?? branchData.branch_code ?? "",
    isActive: branchData.is_active ?? branchData.status === "ACTIVE",
  };
};

export const normalizeBranches = (branchList) => {
  if (!Array.isArray(branchList)) return [];
  return branchList.map(normalizeBranch);
};
