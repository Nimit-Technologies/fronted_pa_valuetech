import React from "react";
import BranchAdminSearchbar from "./branchAdminSearchbar";

const BranchAdminTableHeader = ({ onSearch, placeholder, createButton }) => {
  return (
    <div className="flex flex-col sm:flex-row bg-card border border-border shadow-sm rounded-md w-full px-4 py-4 gap-3 sm:items-center sm:justify-between">
      <BranchAdminSearchbar onSearch={onSearch} placeholder={placeholder} />
      {createButton}
    </div>
  );
};

export default BranchAdminTableHeader;
