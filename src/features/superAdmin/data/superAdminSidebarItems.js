import {
  GitBranch,
  Users,
  HomeIcon,
  ShieldCheck,
  Building2,
} from "lucide-react";

export const sidebarItems = [
  {
    section: "Super Admin",
    items: [
      { label: "Home", path: "/super-admin", icon: HomeIcon, exact: true },
      { label: "Branch", path: "/super-admin/branch", icon: GitBranch },
      { label: "User", path: "/super-admin/user", icon: Users },

      { label: "Department", path: "/super-admin/department", icon: Building2 },
      { label: "Role", path: "/super-admin/role", icon: ShieldCheck },
    ],
  },
];
