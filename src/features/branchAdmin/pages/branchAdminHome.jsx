// import SuperAdminCard from "@/features/superAdmin/components/superAdminCard";
// import BranchAdminCard from "@/features/branchAdmin/component/branchAdminCard";
// import { useNavigate } from "react-router-dom";
// import GreetingHeader from "@/components/shared/greetingHeader";
// import { Button } from "@/components/ui/button";

import React from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import GreetingHeader from "@/components/shared/greetingHeader";
import BranchAdminCard from "@/features/branchAdmin/component/branchAdminCard";
// import SuperAdminCard from "@/features/superAdmin/components/superAdminCard";
// import useSuperAdminSummary from "@/features/superAdmin/hooks/dashboard/useSuperAdminSummary";
import useBranchAdminSummary from "@/features/branchAdmin/hooks/dashboard/useBranchAdminSummary";
const SECTIONS = [
  { key: "users", label: "Users", to: "user" },
  { key: "banks", label: "Banks", to: "bank" },
  { key: "departments", label: "Departments", to: "department" },
  { key: "roles", label: "Roles", to: "role" },
];

const BranchAdminHome = () => {
  const navigate = useNavigate();
  const { summary, loading, error, refresh } = useBranchAdminSummary();

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto">
      <GreetingHeader />

      {error ? (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive sm:flex-row sm:items-center sm:justify-between"
        >
          <span>Couldn&apos;t load the dashboard: {error}</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={refresh}
            disabled={loading}
          >
            Retry
          </Button>
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SECTIONS.map(({ key, label, to }) => {
          const counts = summary[key] ?? {};
          return (
            <React.Fragment key={key}>
              <button
                type="button"
                className="text-left rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => navigate(to)}
                aria-label={`Open ${label.toLowerCase()}`}
              >
                <BranchAdminCard
                  title={`Total ${label}`}
                  value={counts.total}
                  loading={loading}
                />
              </button>
              <button
                type="button"
                className="text-left rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => navigate(to)}
                aria-label={`Open ${label.toLowerCase()}`}
              >
                <BranchAdminCard
                  title={`Active ${label}`}
                  value={counts.active}
                  loading={loading}
                />
              </button>
            </React.Fragment>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground"
          onClick={refresh}
          disabled={loading}
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default BranchAdminHome;
