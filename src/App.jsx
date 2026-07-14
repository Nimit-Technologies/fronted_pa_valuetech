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

// Branch Admin
import BranchAdminPage from "@/pages/branchAdmin";
import BranchAdminHome from "@/features/branchAdmin/pages/branchAdminHome";
import Bank from "@/features/branchAdmin/pages/bank";
import Business from "@/features/branchAdmin/pages/business";
import Case from "@/features/branchAdmin/pages/case";
import Department from "@/features/branchAdmin/pages/department";
import Engineer from "@/features/branchAdmin/pages/engineer";
import Role from "@/features/branchAdmin/pages/role";
import User from "@/features/branchAdmin/pages/user";
import CreateUser from "@/features/branchAdmin/pages/user/createUser";
import UpdateUser from "@/features/branchAdmin/pages/user/updateUser";
import ViewUser from "@/features/branchAdmin/pages/user/viewUser";
import CreateBank from "./features/branchAdmin/component/bank/createBank";
import UpdateBank from "@/features/branchAdmin/component/bank/updateBank";
import ViewBank from "@/features/branchAdmin/component/bank/viewBank";

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

          <Route path="/branch-admin" element={<BranchAdminPage />}>
            <Route index element={<BranchAdminHome />} />

            <Route path="bank" element={<Bank />} />
            <Route path="bank/create" element={<CreateBank />} />
            <Route path="bank/update/:id" element={<UpdateBank />} />
            <Route path="bank/view/:id" element={<ViewBank />} />

            <Route path="business" element={<Business />} />

            <Route path="case" element={<Case />} />

            <Route path="department" element={<Department />} />

            <Route path="engineer" element={<Engineer />} />

            <Route path="role" element={<Role />} />

            <Route path="user" element={<User />} />
            <Route path="user/create" element={<CreateUser />} />
            <Route path="user/update/:id" element={<UpdateUser />} />
            <Route path="user/view/:id" element={<ViewUser />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
