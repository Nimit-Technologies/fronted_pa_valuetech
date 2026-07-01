import { Route, Routes } from "react-router-dom";
import Navbar from "./components/shared/navigation/navbar";
import SuperAdmin from "./pages/superAdmin";
import Branch from "./features/superAdmin/pages/branch";
import BranchAdmin from "./features/superAdmin/pages/branchAdmin";
import CreateBranchAdmin from "./features/superAdmin/components/branchAdmin/createBranchAdmin";
import UpdateBranchAdmin from "./features/superAdmin/components/branchAdmin/updateBranchAdmin";
import ViewBranchAdmin from "./features/superAdmin/components/branchAdmin/viewBranchAdmin";
import SuperAdminHome from "./features/superAdmin/pages/superAdminHome";
import UserProfile from "./components/shared/auth/userProfile";
import Footer from "./components/shared/navigation/footer";

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
        </Routes>
      </div>
      <Footer/>
    </div>
  );
};

export default App;
