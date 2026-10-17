export const ROLES = {
  SUPER_ADMIN: "super admin",
  BRANCH_ADMIN: "branch admin",
  CORDINATOR: "cordinator",
  ENGINEER: "engineer",
};

// Role rows are free text created per department, so the name is the only
// branch-independent handle on "is this a coordinator". Normalized before
// comparing, exactly as the backend does in middlewares/authorize.js.
//
// Note the backend additionally requires the department to be "cordination"
// before it treats a user as a coordinator (isCoordinatorRole there); this
// checks the role name alone, which is what gates the business-type field.
export const isCoordinatorRoleName = (name) =>
  name?.trim().toLowerCase() === ROLES.CORDINATOR;

export const ROLE_HOME_ROUTES = {
  [ROLES.SUPER_ADMIN]: "/super-admin",
  [ROLES.BRANCH_ADMIN]: "/branch-admin",
  [ROLES.CORDINATOR]: "/cordinator",
  [ROLES.ENGINEER]: "/engineer",
};

export const DEFAULT_AUTHENTICATED_ROUTE = "/";

// The dashboard a role lives under, for building in-dashboard links such as
// the profile pages. Derive it from the session role — never by sniffing
// `pathname`, which silently fell through to /super-admin for every role whose
// prefix was spelled wrong and bounced non-admins off their own profile.
// Role rows are free text, so normalize before the lookup, as
// isCoordinatorRoleName does. Returns null when the role has no dashboard,
// so callers can hide the link instead of linking somewhere broken.
export const roleBasePath = (name) =>
  ROLE_HOME_ROUTES[name?.trim().toLowerCase()] ?? null;
