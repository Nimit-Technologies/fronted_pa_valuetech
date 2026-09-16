import React from "react";
import { useLocation } from "react-router-dom";
import MobileNavbar from "@/components/shared/navigation/mobileNavbar";
import DesktopNavbar from "@/components/shared/navigation/desktopNavbar";

/** Converts a slug like "super-admin" → "Super Admin" */
const toTitleCase = (slug) =>
  slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const Navbar = () => {
  const { pathname } = useLocation();

  // e.g. "/super-admin/branch" → ["super-admin", "branch"]
  const segments = pathname.split("/").filter(Boolean);

  let title = "Welcome to PA Valuetech";

  if (segments.length >= 1) {
    title = `Welcome to ${toTitleCase(segments[0])} Dashboard`;

    if (segments.length >= 2) {
      const subPages = segments.slice(1).map(toTitleCase).join(" - ");
      title += ` - ${subPages}`;
    }
  }

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
