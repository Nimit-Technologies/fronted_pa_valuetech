import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

const AADHAAR_PATTERN = /^\d{12}$/;

const isBlank = (value) =>
  value === undefined || value === null || value === "";

// Maps the update form's camelCase state to the backend's snake_case update
// schema, which is strict: any unknown key or empty optional value is a 400.
// UI-only fields (id, status, the dropdown objects) never leave this function.
export const normalizeUpdateUserPayload = (form = {}) => {
  const payload = {
    employee_id: form.employeeId,
    first_name: form.firstName,
    last_name: form.lastName,
    email: form.email,
    phone: form.phone,
    branch_id: form.branchId || form.branch?.branch_id || form.branch?.id,
    department_id: form.departmentId || form.department?.id,
    role_id: form.roleId || form.role?.id,
    address: {
      city: form.city,
      district: form.district,
      state: form.state,
      pin_code: form.pincode,
      country: form.country,
      lane: form.lane,
      landmark: form.landmark,
    },
  };

  // Responses carry Aadhaar masked as XXXXXXXX1234, so the form is pre-filled
  // with something the backend would reject. Only a freshly typed 12-digit
  // number is sent; anything else keeps the stored value.
  if (AADHAAR_PATTERN.test(form.aadharNumber ?? "")) {
    payload.aadhaar_number = form.aadharNumber;
  }

  if (form.status === "Active" || form.status === "Inactive") {
    payload.is_active = form.status === "Active";
  }

  // Blank optionals (email, an unpicked dropdown) are omitted rather than sent
  // as "", which the schema's format checks would reject.
  for (const [key, value] of Object.entries(payload)) {
    if (isBlank(value)) delete payload[key];
  }

  return payload;
};

const UpdateUserAPI = async (payload) => {
  const response = await api.put(
    `${apiConfig.user.updateUser}/${payload.id}`,
    normalizeUpdateUserPayload(payload),
  );
  return response.data;
};

export default UpdateUserAPI;
