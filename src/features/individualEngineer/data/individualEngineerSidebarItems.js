import { GitBranch, HomeIcon } from "lucide-react";

export const sidebarItems = [
  {
    section: "Engineer Dashboard",
    items: [
      { label: "Home", path: "/engineer", icon: HomeIcon, exact: true },
      { label: "Case management", path: "/engineer/case", icon: GitBranch },
    ],
  },
];
