import { GitBranch, HomeIcon } from "lucide-react";

export const sidebarItems = [
  {
    section: "Individual Cordinator",
    items: [
      { label: "Home", path: "/cordinator", icon: HomeIcon, exact: true },
      { label: "Case management", path: "/cordinator/case", icon: GitBranch },
    ],
  },
];
