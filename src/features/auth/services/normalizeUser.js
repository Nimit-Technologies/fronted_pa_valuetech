/**
 * Normalizes the user object returned by the backend's auth endpoints into
 * one stable shape, regardless of which endpoint produced it.
 *
 * Backend inconsistency this absorbs: the real login response nests the
 * branch id as `branch.branch_id` (built fresh from the DB), while the
 * JWT-derived responses — the "already logged in" short-circuit on
 * POST /auth/login and GET /auth/session — use `branch.id` instead, since
 * those are read straight off the decoded token payload. Everything
 * downstream of this function (Redux, components) should only ever see one
 * shape: `branch.id`.
 *
 * Also strips the `{success, message, data}` envelope's nesting — callers
 * pass in the `data` portion of a response, and get back a flat user object
 * with no wrapper to accidentally leak into state (see the `user.data.*`
 * bug this replaces in protectedRoute.jsx / userAvatar.jsx).
 */
export const normalizeUser = (rawUser) => {
  if (!rawUser) return null;

  const { branch, ...rest } = rawUser;

  return {
    ...rest,
    branch: branch
      ? { id: branch.id ?? branch.branch_id, name: branch.name }
      : null,
  };
};
