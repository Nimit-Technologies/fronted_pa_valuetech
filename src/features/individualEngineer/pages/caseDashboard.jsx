import React, { useState } from "react";
import EngineerTableHeader from "@/features/individualEngineer/components/engineerTableHeader";
import CaseTable from "@/features/individualEngineer/components/case/caseTable";
import EngineerCard from "@/features/individualEngineer/components/engineerCard";
import { caseData } from "@/features/individualEngineer/data/case/caseTable.js";
import { caseTableHeader } from "@/features/individualEngineer/data/case/caseTableHeader.js";

const CaseDashboard = () => {
  const [search, setSearch] = useState("");

  const filteredData = {
    ...caseData,
    data: caseData.data.filter((c) => {
      const query = search.toLowerCase().trim();
      if (!query) return true;

      return (
        c.customer_name?.toLowerCase().includes(query) ||
        c.file_number?.toLowerCase().includes(query) ||
        c.banker?.toLowerCase().includes(query) ||
        c.bank?.display_name?.toLowerCase().includes(query)
      );
    }),
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <EngineerCard title="Total Case" value={caseData.meta.total_cases} />
        <EngineerCard
          title="Visit Completed"
          value={caseData.meta.visit_completed}
        />
      </div>

      <EngineerTableHeader onSearch={setSearch} />

      <CaseTable data={filteredData} headers={caseTableHeader} />
    </div>
  );
};

export default CaseDashboard;
