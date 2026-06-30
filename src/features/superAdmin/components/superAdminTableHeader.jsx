import React from "react";
import SuperAdminSearchbar from "./superAdminSearchbar";
const SuperAdminTableHeader = ({ onSearch, createButton }) => {
  return (
    <div className="flex flex-col sm:flex-row bg-card border border-border shadow-sm rounded-md w-full px-4 py-4 gap-3 sm:items-center sm:justify-between">
      <SuperAdminSearchbar onSearch={onSearch} />
      {createButton}
    </div>
  );
};

export default SuperAdminTableHeader;
