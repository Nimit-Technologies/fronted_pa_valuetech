/**
 * Department object ko frontend ke liye ek single stable format mein convert karta hai.
 */
export const normalizeDepartment = (rawDept) => {
  if (!rawDept) return null;

  // Envelope unpacker (Agar data { success, data } mein wrapped aae)
  const deptData = rawDept.data ?? rawDept;

  return {
    id: deptData.id ?? deptData.dept_id ?? deptData._id,
    name: deptData.name ?? deptData.dept_name ?? "N/A",
    code: deptData.code ?? deptData.dept_code ?? "",
    isActive: deptData.is_active ?? deptData.status === "ACTIVE",
  };
};

// Agar API array of departments bhejti hai:
export const normalizeDepartments = (deptList) => {
  if (!Array.isArray(deptList)) return [];
  return deptList.map(normalizeDepartment);
};
