import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import BranchAdminCard from "@/features/branchAdmin/component/branchAdminCard";
import BranchAdminTableHeader from "@/features/branchAdmin/component/branchAdminTableHeader";

import BankTable from "@/features/branchAdmin/component/bank/bankTable";

import { bankData } from "@/features/branchAdmin/data/bank/bankTable";
import { bankTableHeader } from "@/features/branchAdmin/data/bank/bankTableHeader";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Bank = () => {
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const filteredData = {
    ...bankData,
    data: bankData.data.filter(
      (bank) =>
        bank.bank_name.toLowerCase().includes(search.toLowerCase()) ||
        bank.branch.toLowerCase().includes(search.toLowerCase()) ||
        bank.branch_code.toLowerCase().includes(search.toLowerCase()) ||
        bank.gst.toLowerCase().includes(search.toLowerCase()),
    ),
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
      {/* Dashboard Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BranchAdminCard title="Total Banks" value={bankData.total_bank} />
      </div>

      {/* Search + Create */}
      <BranchAdminTableHeader
        onSearch={setSearch}
        placeholder={"Search Bank..."}
        createButton={
          <Button
            className="gap-2"
            onClick={() => navigate("/branch-admin/bank/create")}
          >
            <Plus size={16} />
            Create Bank
          </Button>
        }
      />

      {/* Table */}
      <BankTable data={filteredData} headers={bankTableHeader} />
    </div>
  );
};

export default Bank;
