import React from "react";
import EngineerSearchbar from "@/features/individualEngineer/components/engineerSearchbar";

const EngineerTableHeader = ({ onSearch }) => {
  return (
    <div className="flex flex-col sm:flex-row bg-card border border-border shadow-sm rounded-md w-full px-4 py-4 gap-3 sm:items-center sm:justify-between">
      <EngineerSearchbar onSearch={onSearch} />
    </div>
  );
};

export default EngineerTableHeader;
