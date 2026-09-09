export const ROLES = {
  SUPER_ADMIN: "super-admin",
  BRANCH_ADMIN: "branch-admin",
  COORDINATOR: "coordinator",
  ENGINEER: "engineer",
};

export const ROLE_HOME_ROUTES = {
  [ROLES.SUPER_ADMIN]: "/super-admin",
  [ROLES.BRANCH_ADMIN]: "/branch-admin",
  [ROLES.COORDINATOR]: "/coordinator",
  [ROLES.ENGINEER]: "/engineer",
};

export const DEFAULT_AUTHENTICATED_ROUTE = "/";
