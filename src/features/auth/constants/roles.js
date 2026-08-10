// Role names as stored on the backend — see backend_pa_valuetech's
// src/middlewares/authorize.js, which checks req.user.role.name against
// these exact strings.
//
// ROLES.ENGINEER is a best guess (kebab-style, matching the other three) —
// the backend has no isEngineer authorize middleware or seed data to
// confirm it against yet. Verify against a real `roles` table row before
// relying on it, and update here if it differs.
export const ROLES = {
  SUPER_ADMIN: "super-admin",
  BRANCH_ADMIN: "branch-admin",
  COORDINATOR: "coordinator",
  ENGINEER: "engineer",
};

// Where each role lands after a successful login — mirrors the route trees
// defined in src/App.jsx.
export const ROLE_HOME_ROUTES = {
  [ROLES.SUPER_ADMIN]: "/super-admin",
  [ROLES.BRANCH_ADMIN]: "/branch-admin",
  [ROLES.COORDINATOR]: "/coordinator",
  [ROLES.ENGINEER]: "/engineer",
};

// Fallback if a logged-in user's role doesn't match any known landing route.
export const DEFAULT_AUTHENTICATED_ROUTE = "/login";
