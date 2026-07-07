import { GitBranch, Users, HomeIcon } from "lucide-react";

export const sidebarItems = [
  {
    section: "Super Admin",
    items: [
      { label: "Home", path: "/super-admin", icon: HomeIcon, exact: true },
      { label: "Branch", path: "/super-admin/branch", icon: GitBranch },
      { label: "Branch Admin", path: "/super-admin/branch-admin", icon: Users },
    ],
  },
];
