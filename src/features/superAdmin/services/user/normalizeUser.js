export const normalizeUser = (rawUser) => {
  if (!rawUser) return null;

  const user = rawUser.data ?? rawUser;

  return {
    id: user.id ?? user.user_id ?? user._id,
    employee_id: user.employee_id ?? user.employeeId ?? "",
    first_name: user.first_name ?? user.firstName ?? "",
    last_name: user.last_name ?? user.lastName ?? "",
    phone: user.phone ?? "",
    adhar_number: user.aadhaar_number ?? user.adhar_number ?? "",
    is_active:
      typeof user.is_active === "boolean"
        ? user.is_active
        : user.status === "ACTIVE",
    branch: user.branch ?? null,
    department: user.department ?? null,
    role: user.role ?? null,
    created_at: user.created_at ?? null,
    updated_at: user.updated_at ?? null,
  };
};

export const normalizeUsers = (userList) => {
  if (!Array.isArray(userList)) return [];
  return userList.map(normalizeUser);
};

export default normalizeUser;
