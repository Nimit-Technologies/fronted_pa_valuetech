import { Route, Routes } from "react-router-dom";
import Navbar from "@/components/shared/navigation/navbar";
import SuperAdmin from "@/pages/superAdmin";
import Branch from "@/features/superAdmin/pages/branch";
import BranchAdmin from "@/features/superAdmin/pages/branchAdmin";
import CreateBranchAdmin from "@/features/superAdmin/components/branchAdmin/createBranchAdmin";
import UpdateBranchAdmin from "@/features/superAdmin/components/branchAdmin/updateBranchAdmin";
import ViewBranchAdmin from "@/features/superAdmin/components/branchAdmin/viewBranchAdmin";
import SuperAdminHome from "@/features/superAdmin/pages/home";
import UserProfile from "@/components/shared/auth/userProfile";
import Footer from "@/components/shared/navigation/footer";

import IndividualCoordinator from "@/pages/individualCoordinator";
import IndividualCoordinatorHome from "@/features/individualCoordinator/pages/home";
import CaseDashboard from "@/features/individualCoordinator/pages/caseDashboard";
import CreateCase from "@/features/individualCoordinator/pages/createCase";
import UpdateCase from "@/features/individualCoordinator/pages/updateCase";
import ViewCase from "@/features/individualCoordinator/pages/viewCase";
import IndividualEngineerHome from "@/features/individualEngineer/pages/home";
import IndividualEngineer from "@/pages/individualEngineer";
import EngineerCaseDashboard from "@/features/individualEngineer/pages/caseDashboard";
import EngineerViewCase from "@/features/individualEngineer/pages/viewCase";
import Report from "@/features/individualEngineer/pages/report/report";

const App = () => {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Navbar />

      <div className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/super-admin" element={<SuperAdmin />}>
            <Route index element={<SuperAdminHome />} />
            <Route path="branch" element={<Branch />} />
            <Route path="branch-admin" element={<BranchAdmin />} />
            <Route path="branch-admin/view/:id" element={<ViewBranchAdmin />} />
            <Route path="branch-admin/create" element={<CreateBranchAdmin />} />
            <Route
              path="branch-admin/update/:id"
              element={<UpdateBranchAdmin />}
            />
            <Route path="user-profile" element={<UserProfile />} />
          </Route>

          <Route path="/coordinator" element={<IndividualCoordinator />}>
            <Route index element={<IndividualCoordinatorHome />} />
            <Route path="case" element={<CaseDashboard />} />
            <Route path="case/create" element={<CreateCase />} />
            <Route path="case/view/:id" element={<ViewCase />} />
            <Route path="case/update/:id" element={<UpdateCase />} />
            <Route path="user-profile" element={<UserProfile />} />
          </Route>

          <Route path="/engineer" element={<IndividualEngineer />}>
            <Route index element={<IndividualEngineerHome />} />
            <Route path="case" element={<EngineerCaseDashboard />} />
            <Route path="case/view/:id" element={<EngineerViewCase />} />
            <Route path="report/create/:id" element={<Report />} />
            <Route path="user-profile" element={<UserProfile />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
