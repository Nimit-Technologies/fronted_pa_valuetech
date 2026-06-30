import React from "react";
import DesktopSidebar from "./desktopSidebar";
import MobileSidebar from "./mobileSidebar";

const Sidebar = ({ menu = [] }) => {
  return (
    <>
      {/* Icon-only sidebar — mobile & tablet (< lg) */}
      <div className="lg:hidden h-full">
        <MobileSidebar menu={menu} />
      </div>

      {/* Full sidebar with labels — desktop (lg+) */}
      <div className="hidden lg:block h-full">
        <DesktopSidebar menu={menu} />
      </div>
    </>
  );
};

export default Sidebar;
