export const ROLES = {
  SUPER_ADMIN: "super-admin",
  BRANCH_ADMIN: "branch-admin",
  CORDINATOR: "cordinator",
  ENGINEER: "engineer",
};

export const ROLE_HOME_ROUTES = {
  [ROLES.SUPER_ADMIN]: "/super-admin",
  [ROLES.BRANCH_ADMIN]: "/branch-admin",
  [ROLES.CORDINATOR]: "/cordinator",
  [ROLES.ENGINEER]: "/engineer",
};

export const DEFAULT_AUTHENTICATED_ROUTE = "/";
