import { GitBranch, HomeIcon } from "lucide-react";

export const sidebarItems = [
  {
    section: "Individual Coordinator",
    items: [
      { label: "Home", path: "/coordinator", icon: HomeIcon, exact: true },
      { label: "Case management", path: "/coordinator/case", icon: GitBranch },
    ],
  },
];
