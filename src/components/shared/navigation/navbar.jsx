import React from "react";
import { useLocation } from "react-router-dom";
import MobileNavbar from "@/components/shared/navigation/mobileNavbar";
import DesktopNavbar from "@/components/shared/navigation/desktopNavbar";

const Navbar = () => {
  const { pathname } = useLocation();
  const title = pathname.startsWith("/coordinator")
    ? "Coordinator Dashboard"
    : "Super Admin Dashboard";

  return (
    <>
      <div className="block md:hidden">
        <MobileNavbar title={title} />
      </div>
      <div className="hidden md:block">
        <DesktopNavbar title={title} />
      </div>
    </>
  );
};

export default Navbar;
