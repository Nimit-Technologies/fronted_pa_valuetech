import { GitBranch, Users } from "lucide-react";

export const sidebarItems = [
  {
    section: "Super Admin",
    items: [
      { label: "Branch", path: "/super-admin/branch", icon: GitBranch },
      { label: "Branch Admin", path: "/super-admin/branch-admin", icon: Users },
    ],
  },
];
