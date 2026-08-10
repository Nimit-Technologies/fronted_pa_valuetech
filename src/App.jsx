import { Route, Routes } from "react-router-dom";
import Navbar from "@/components/shared/navigation/navbar";
import Footer from "@/components/shared/navigation/footer";

import UserProfile from "@/components/shared/userProfile";

import Login from "@/features/auth/pages/login";
import ProtectedRoute from "@/features/auth/guards/protectedRoute";
import PublicOnlyRoute from "@/features/auth/guards/publicOnlyRoute";
import useVerifySession from "@/features/auth/hooks/useVerifySession";
import { ROLES } from "@/features/auth/constants/roles";
import { Loader2 } from "lucide-react";



import SuperAdmin from "@/pages/superAdmin";
import SuperAdminHome from "@/features/superAdmin/pages/home";
import Branch from "@/features/superAdmin/pages/branch";
import BranchAdmin from "@/features/superAdmin/pages/branchAdmin";
import CreateBranchAdmin from "@/features/superAdmin/components/branchAdmin/createBranchAdmin";
import UpdateBranchAdmin from "@/features/superAdmin/components/branchAdmin/updateBranchAdmin";
import ViewBranchAdmin from "@/features/superAdmin/components/branchAdmin/viewBranchAdmin";

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
  const { checking } = useVerifySession();

  if (checking) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Navbar />

      <div className="flex-1 overflow-hidden">
        <Routes>
          <Route
            path="/"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />

          {/* super admin */}
          <Route
            path="/super-admin"
            element={
              <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                <SuperAdmin />
              </ProtectedRoute>
            }
          >
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

          {/* coordinator */}
          <Route
            path="/coordinator"
            element={
              <ProtectedRoute allowedRoles={[ROLES.COORDINATOR]}>
                <IndividualCoordinator />
              </ProtectedRoute>
            }
          >
            <Route index element={<IndividualCoordinatorHome />} />
            <Route path="case" element={<CaseDashboard />} />
            <Route path="case/create" element={<CreateCase />} />
            <Route path="case/view/:id" element={<ViewCase />} />
            <Route path="case/update/:id" element={<UpdateCase />} />
            <Route path="user-profile" element={<UserProfile />} />
          </Route>
          {/* engineer */}
          <Route
            path="/engineer"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ENGINEER]}>
                <IndividualEngineer />
              </ProtectedRoute>
            }
          >
            <Route index element={<IndividualEngineerHome />} />
            <Route path="case" element={<EngineerCaseDashboard />} />
            <Route path="case/view/:id" element={<EngineerViewCase />} />
            <Route path="report/create/:id" element={<Report />} />
            <Route path="user-profile" element={<UserProfile />} />
          </Route>

          {/* branch admin */}
          <Route
            path="/branch-admin"
            element={
              <ProtectedRoute allowedRoles={[ROLES.BRANCH_ADMIN]}>
                <BranchAdminPage />
              </ProtectedRoute>
            }
          >
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
