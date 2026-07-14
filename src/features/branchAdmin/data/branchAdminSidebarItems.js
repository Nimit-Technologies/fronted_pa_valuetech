import { Home, User, Landmark, Building2, ShieldCheck } from "lucide-react";

export const sidebarItems = [
  {
    section: "Branch Admin",
    items: [
      { label: "Home", path: "/branch-admin", icon: Home },
      { label: "User", path: "/branch-admin/user", icon: User },
      { label: "Bank", path: "/branch-admin/bank", icon: Landmark },
      {
        label: "Department",
        path: "/branch-admin/department",
        icon: Building2,
      },
      { label: "Role", path: "/branch-admin/role", icon: ShieldCheck },
      // { label: "Business", path: "/branch-admin/business", icon: Briefcase },
      // { label: "Case", path: "/branch-admin/case", icon: FolderKanban },
      // { label: "Engineer", path: "/branch-admin/engineer", icon: Wrench },
    ],
  },
];
