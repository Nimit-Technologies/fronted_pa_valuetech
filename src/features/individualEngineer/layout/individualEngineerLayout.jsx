import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/shared/navigation/sidebar";
import { sidebarItems } from "@/features/individualEngineer/data/individualEngineerSidebarItems";

const IndividualEngineerLayout = () => {
  return (
    <div className="flex h-full overflow-hidden">
      <Sidebar menu={sidebarItems} />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default IndividualEngineerLayout;
