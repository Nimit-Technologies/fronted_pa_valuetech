import { Route, Routes, Navigate } from "react-router-dom";

import Navbar from "./components/shared/navigation/navbar";
import Footer from "./components/shared/navigation/footer";
import UserProfile from "./components/shared/auth/userProfile";

// Super Admin
import SuperAdmin from "./pages/superAdmin";
import Branch from "./features/superAdmin/pages/branch";
import BranchAdmin from "./features/superAdmin/pages/branchAdmin";
import CreateBranchAdmin from "./features/superAdmin/components/branchAdmin/createBranchAdmin";
import UpdateBranchAdmin from "./features/superAdmin/components/branchAdmin/updateBranchAdmin";
import ViewBranchAdmin from "./features/superAdmin/components/branchAdmin/viewBranchAdmin";
import SuperAdminHome from "./features/superAdmin/pages/home";

// Branch Admin
import BranchAdminPage from "./pages/branchAdmin";
import BranchAdminHome from "./features/branchAdmin/pages/branchAdminHome";
import Bank from "./features/branchAdmin/pages/bank";
import Business from "./features/branchAdmin/pages/business";
import Case from "./features/branchAdmin/pages/case";
import Department from "./features/branchAdmin/pages/department";
import Engineer from "./features/branchAdmin/pages/engineer";
import Role from "./features/branchAdmin/pages/role";
import User from "./features/branchAdmin/pages/user";

const App = () => {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Navbar />

      <div className="flex-1 overflow-hidden">
        <Routes>
          {/* Default Route */}
          <Route
            path="/"
            element={<Navigate to="/branch-admin" replace />}
          />

          {/* Super Admin */}
          <Route path="/super-admin" element={<SuperAdmin />}>
            <Route index element={<SuperAdminHome />} />

            <Route path="branch" element={<Branch />} />

            <Route path="branch-admin" element={<BranchAdmin />} />

            <Route
              path="branch-admin/create"
              element={<CreateBranchAdmin />}
            />

            <Route
              path="branch-admin/view/:id"
              element={<ViewBranchAdmin />}
            />

            <Route
              path="branch-admin/update/:id"
              element={<UpdateBranchAdmin />}
            />

            <Route
              path="user-profile"
              element={<UserProfile />}
            />
          </Route>

          {/* Branch Admin */}
          <Route path="/branch-admin" element={<BranchAdminPage />}>
            <Route index element={<BranchAdminHome />} />

            <Route path="bank" element={<Bank />} />

            <Route path="business" element={<Business />} />

            <Route path="case" element={<Case />} />

            <Route
              path="department"
              element={<Department />}
            />

            <Route
              path="engineer"
              element={<Engineer />}
            />

            <Route path="role" element={<Role />} />

            <Route path="user" element={<User />} />
          </Route>
        </Routes>
      </div>

      <Footer />
    </div>
  );
};

export default App;