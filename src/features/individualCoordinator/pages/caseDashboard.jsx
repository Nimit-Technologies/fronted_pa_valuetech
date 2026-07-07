import React, { useState } from "react";
import CoordinatorTableHeader from "@/features/individualCoordinator/components/coordinatorTableHeader.jsx";
import CaseTable from "@/features/individualCoordinator/components/case/caseTable.jsx";
import CoordinatorCard from "@/features/individualCoordinator/components/coordinatorCard.jsx";
import { caseData } from "@/features/individualCoordinator/data/case/caseTable.js";
import { caseTableHeader } from "@/features/individualCoordinator/data/case/caseTableHeader.js";

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
        <CoordinatorCard title="Total Case" value={caseData.meta.total_cases} />
        <CoordinatorCard
          title="Visit Completed"
          value={caseData.meta.visit_completed}
        />
      </div>

      <CoordinatorTableHeader
        onSearch={setSearch}
        createRoute="/coordinator/case/create"
        createLabel="Create Case"
      />

      <CaseTable data={filteredData} headers={caseTableHeader} />
    </div>
  );
};

export default CaseDashboard;
