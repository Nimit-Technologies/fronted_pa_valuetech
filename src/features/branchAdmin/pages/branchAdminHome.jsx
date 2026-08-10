import SuperAdminCard from "@/features/superAdmin/components/superAdminCard";
import BranchAdminCard from "@/features/branchAdmin/component/branchAdminCard";

const dashboardData = {
  totalCases: 15000,
  totalVisit: 20000,
  totalEngineers: 50000,
  totalCoordinators: 15000,
  totalDrafter: 60000,
  totalAppraiser: 20000,
};

const BranchAdminHome = () => {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SuperAdminCard title="Total Cases" value={dashboardData.totalCases} />

        <SuperAdminCard title="Total Visits" value={dashboardData.totalVisit} />
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <BranchAdminCard
          title="Total Engineers"
          value={dashboardData.totalEngineers}
        />

        <BranchAdminCard
          title="Total Co-ordinators"
          value={dashboardData.totalCoordinators}
        />

        <BranchAdminCard
          title="Total Drafter"
          value={dashboardData.totalDrafter}
        />

        <BranchAdminCard
          title="Total Appraisers"
          value={dashboardData.totalAppraiser}
        />
      </div>
    </div>
  );
};

export default BranchAdminHome;
