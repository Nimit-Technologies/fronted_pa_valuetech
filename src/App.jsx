import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Navbar from "@/components/shared/navigation/navbar";
import Footer from "@/components/shared/navigation/footer";

import useVerifySession from "@/features/auth/hooks/useVerifySession";
import Login from "@/features/auth/pages/login";

import PublicOnlyRoute from "@/features/auth/guards/publicOnlyRoute";
import ProtectedRoute from "@/features/auth/guards/protectedRoute";

import UserProfile from "@/components/shared/user/userProfile";
import ManageUser from "@/components/shared/user/manageUser";

import { ROLES } from "@/features/auth/constants/roles";
import { Loader2 } from "lucide-react";

//super admin module
const SuperAdmin = lazy(() => import("@/pages/superAdmin"));
const SuperAdminHome = lazy(() => import("@/features/superAdmin/pages/home"));
const Branch = lazy(() => import("@/features/superAdmin/pages/branch"));
const User = lazy(() => import("@/features/superAdmin/pages/user"));
const Department = lazy(() => import("@/features/superAdmin/pages/department"));
const Role = lazy(() => import("@/features/superAdmin/pages/role"));
const CreateUser = lazy(
  () => import("@/features/superAdmin/components/user/createUser"),
);
const UpdateUser = lazy(
  () => import("@/features/superAdmin/components/user/updateUser"),
);
const ViewUser = lazy(
  () => import("@/features/superAdmin/components/user/viewUser"),
);

const IndividualCoordinator = lazy(
  () => import("@/pages/individualCoordinator"),
);
const IndividualCoordinatorHome = lazy(
  () => import("@/features/individualCoordinator/pages/home"),
);
const CaseDashboard = lazy(
  () => import("@/features/individualCoordinator/pages/caseDashboard"),
);
const CreateCase = lazy(
  () => import("@/features/individualCoordinator/pages/createCase"),
);
const UpdateCase = lazy(
  () => import("@/features/individualCoordinator/pages/updateCase"),
);
const ViewCase = lazy(
  () => import("@/features/individualCoordinator/pages/viewCase"),
);
const IndividualEngineerHome = lazy(
  () => import("@/features/individualEngineer/pages/home"),
);
const IndividualEngineer = lazy(() => import("@/pages/individualEngineer"));
const EngineerCaseDashboard = lazy(
  () => import("@/features/individualEngineer/pages/caseDashboard"),
);
const EngineerViewCase = lazy(
  () => import("@/features/individualEngineer/pages/viewCase"),
);
const Report = lazy(
  () => import("@/features/individualEngineer/pages/report/report"),
);

// Branch Admin
const BranchAdminPage = lazy(() => import("@/pages/branchAdmin"));
const BranchAdminHome = lazy(
  () => import("@/features/branchAdmin/pages/branchAdminHome"),
);
const Bank = lazy(() => import("@/features/branchAdmin/pages/bank"));
const Business = lazy(() => import("@/features/branchAdmin/pages/business"));
const Case = lazy(() => import("@/features/branchAdmin/pages/case"));
const BranchAdminDepartment = lazy(
  () => import("@/features/branchAdmin/pages/department"),
);
const Engineer = lazy(() => import("@/features/branchAdmin/pages/engineer"));
const BranchAdminRole = lazy(() => import("@/features/branchAdmin/pages/role"));
const BranchAdminUser = lazy(() => import("@/features/branchAdmin/pages/user"));
// import CreateUser from "@/features/branchAdmin/pages/user/createUser";
// import UpdateUser from "@/features/branchAdmin/pages/user/updateUser";
const BranchAdminViewUser = lazy(
  () => import("@/features/branchAdmin/pages/user/viewUser"),
);
const CreateBank = lazy(
  () => import("./features/branchAdmin/component/bank/createBank"),
);
const UpdateBank = lazy(
  () => import("@/features/branchAdmin/component/bank/updateBank"),
);
const ViewBank = lazy(
  () => import("@/features/branchAdmin/component/bank/viewBank"),
);

// Same fallback style as the session-check screen below, so a route chunk
// still loading looks identical to session verification still in flight.
const RouteFallback = () => (
  <div className="h-full flex items-center justify-center bg-background">
    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
  </div>
);

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
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route
              path="/"
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
              <Route path="user" element={<User />} />
              <Route path="department" element={<Department />} />
              <Route path="role" element={<Role />} />
              <Route path="user/view/:id" element={<ViewUser />} />
              <Route path="user/create" element={<CreateUser />} />
              <Route path="user/update/:id" element={<UpdateUser />} />
              <Route path="user-profile/:id?" element={<UserProfile />} />
              <Route path="manage-profile" element={<ManageUser />} />
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
              <Route path="user-profile/:id?" element={<UserProfile />} />
              <Route path="manage-profile" element={<ManageUser />} />
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
              <Route path="user-profile/:id?" element={<UserProfile />} />
              <Route path="manage-profile" element={<ManageUser />} />
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

              <Route path="department" element={<BranchAdminDepartment />} />

              <Route path="engineer" element={<Engineer />} />

              <Route path="role" element={<BranchAdminRole />} />

              <Route path="user" element={<BranchAdminUser />} />
              <Route path="user/create" element={<CreateUser />} />
              <Route path="user/update/:id" element={<UpdateUser />} />
              <Route path="user/view/:id" element={<BranchAdminViewUser />} />
              <Route path="user-profile/:id?" element={<UserProfile />} />
              <Route path="manage-profile" element={<ManageUser />} />
            </Route>
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </div>
  );
};

export default App;
