import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Navbar from "@/components/shared/navigation/navbar";
import Footer from "@/components/shared/navigation/footer";
import OfflineBanner from "@/components/shared/offlineBanner";

import useVerifySession from "@/features/auth/hooks/useVerifySession";
import Login from "@/features/auth/pages/login";

import PublicOnlyRoute from "@/features/auth/guards/publicOnlyRoute";
import ProtectedRoute from "@/features/auth/guards/protectedRoute";

import UserProfile from "@/components/shared/user/userProfile";
import ManageUser from "@/components/shared/user/manageUser";

import { ROLES } from "@/features/auth/constants/roles";
import { Loader2 } from "lucide-react";

const ResumableUpload = lazy(
  () => import("@/features/assetsUpload/resumableUpload"),
);

// Reachable from every screen's footer, and the destination for every unknown
// URL, so both are lazy like the dashboards rather than in the first chunk.
const DeveloperSupport = lazy(() => import("@/pages/developerSupport"));
const NotFound = lazy(() => import("@/pages/notFound"));

//super admin module
const SuperAdmin = lazy(() => import("@/pages/superAdmin"));
const SuperAdminHome = lazy(
  () => import("@/features/superAdmin/pages/HomePage"),
);
const Branch = lazy(() => import("@/features/superAdmin/pages/BranchListPage"));
const User = lazy(() => import("@/features/superAdmin/pages/UserListPage"));
const Department = lazy(
  () => import("@/features/superAdmin/pages/DepartmentListPage"),
);
const Role = lazy(() => import("@/features/superAdmin/pages/RoleListPage"));
const Business = lazy(
  () => import("@/features/superAdmin/pages/BusinessListPage"),
);
const CreateUser = lazy(
  () => import("@/features/superAdmin/components/user/CreateUser"),
);
const UpdateUser = lazy(
  () => import("@/features/superAdmin/components/user/UpdateUser"),
);
const ViewUser = lazy(
  () => import("@/features/superAdmin/components/user/ViewUser"),
);

const IndividualCoordinator = lazy(
  () => import("@/pages/individualCoordinator"),
);
const IndividualCoordinatorHome = lazy(
  () => import("@/features/individualCoordinator/pages/HomePage"),
);
const CaseDashboard = lazy(
  () => import("@/features/individualCoordinator/pages/CaseDashboardPage"),
);
const CreateCase = lazy(
  () => import("@/features/individualCoordinator/pages/CreateCasePage"),
);
const UpdateCase = lazy(
  () => import("@/features/individualCoordinator/pages/UpdateCasePage"),
);
const ViewCase = lazy(
  () => import("@/features/individualCoordinator/pages/ViewCasePage"),
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
const SubmittedReport = lazy(
  () => import("@/features/individualEngineer/pages/report/submittedReport"),
);
const CoordinatorSubmittedReport = SubmittedReport;
const SubmittedReports = lazy(
  () => import("@/features/individualEngineer/pages/report/submittedReports"),
);

// Branch Admin
const BranchAdminPage = lazy(() => import("@/pages/branchAdmin"));
const BranchAdminHome = lazy(
  () => import("@/features/branchAdmin/pages/BranchAdminHomePage"),
);
const Bank = lazy(() => import("@/features/branchAdmin/pages/BankListPage"));
const Case = lazy(() => import("@/features/branchAdmin/pages/CaseListPage"));
const BranchAdminDepartment = lazy(
  () => import("@/features/branchAdmin/pages/DepartmentListPage"),
);
const Engineer = lazy(
  () => import("@/features/branchAdmin/pages/EngineerListPage"),
);
const BranchAdminRole = lazy(
  () => import("@/features/branchAdmin/pages/RoleListPage"),
);
const BranchAdminUser = lazy(
  () => import("@/features/branchAdmin/pages/UserListPage"),
);

const BranchAdminViewUser = lazy(
  () => import("@/features/branchAdmin/pages/user/ViewUserPage"),
);
const CreateBank = lazy(
  () => import("@/features/branchAdmin/component/bank/CreateBank"),
);
const UpdateBank = lazy(
  () => import("@/features/branchAdmin/component/bank/UpdateBank"),
);
const ViewBank = lazy(
  () => import("@/features/branchAdmin/component/bank/ViewBank"),
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
      <OfflineBanner />

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

            {/* Linked from the footer on every screen, signed in or not, so it
                sits outside the role dashboards and behind no guard. */}
            <Route path="/developer-support" element={<DeveloperSupport />} />
            <Route
              path="/test"
              element={
                <ResumableUpload
                  taskId="test-task"
                  photoType="TestPhoto"
                  slug="test"
                  label="Test Upload"
                />
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
              <Route path="business" element={<Business />} />
              <Route path="user/view/:id" element={<ViewUser />} />
              <Route path="user/create" element={<CreateUser />} />
              <Route path="user/update/:id" element={<UpdateUser />} />
              <Route path="user-profile/:id?" element={<UserProfile />} />
              <Route path="manage-profile" element={<ManageUser />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* cordinator */}
            <Route
              path="/cordinator"
              element={
                <ProtectedRoute allowedRoles={[ROLES.CORDINATOR]}>
                  <IndividualCoordinator />
                </ProtectedRoute>
              }
            >
              <Route index element={<IndividualCoordinatorHome />} />
              <Route path="case" element={<CaseDashboard />} />
              <Route path="case/create" element={<CreateCase />} />
              <Route path="case/view/:id" element={<ViewCase />} />
              <Route path="case/update/:id" element={<UpdateCase />} />
              <Route
                path="report/view/:id"
                element={<CoordinatorSubmittedReport />}
              />
              <Route path="user-profile/:id?" element={<UserProfile />} />
              <Route path="manage-profile" element={<ManageUser />} />
              <Route path="*" element={<NotFound />} />
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
              <Route path="report/view/:id" element={<SubmittedReport />} />
              <Route path="reports" element={<SubmittedReports />} />
              <Route path="user-profile/:id?" element={<UserProfile />} />
              <Route path="manage-profile" element={<ManageUser />} />
              <Route path="*" element={<NotFound />} />
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
              <Route path="case" element={<Case />} />
              <Route path="department" element={<BranchAdminDepartment />} />
              <Route path="engineer" element={<Engineer />} />
              <Route path="role" element={<BranchAdminRole />} />
              {/* View-only by design for users, departments and roles —
                  hence a detail route but no create or update one. The
                  backend agrees: create-user and update/:id are isSuperAdmin,
                  while all-user and :id are isAdmin. Banks above are
                  deliberately different; those branch admins do manage. */}
              <Route path="user" element={<BranchAdminUser />} />
              <Route path="user/view/:id" element={<BranchAdminViewUser />} />
              <Route path="user-profile/:id?" element={<UserProfile />} />
              <Route path="manage-profile" element={<ManageUser />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </div>
  );
};

export default App;
