import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

const AADHAAR_PATTERN = /^\d{12}$/;

const isBlank = (value) =>
  value === undefined || value === null || value === "";

// Maps the profile form's camelCase state to the backend's snake_case
// self-service schema. Only personal fields are included — no employee_id,
// branch_id, department_id, role_id or is_active, which PUT /user/profile
// rejects (.strict()) even if sent.
export const normalizeUpdateProfilePayload = (form = {}) => {
  const payload = {
    first_name: form.firstName,
    last_name: form.lastName,
    email: form.email,
    phone: form.phone,
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

  // Responses only ever carry the masked Aadhaar (XXXXXXXX1234), so the form
  // starts blank; only a freshly typed 12-digit number is sent.
  if (AADHAAR_PATTERN.test(form.aadharNumber ?? "")) {
    payload.aadhaar_number = form.aadharNumber;
  }

  for (const [key, value] of Object.entries(payload)) {
    if (isBlank(value)) delete payload[key];
  }

  return payload;
};

const UpdateProfileAPI = async (form) => {
  const response = await api.put(
    apiConfig.user.updateProfile,
    normalizeUpdateProfilePayload(form),
  );
  return response.data;
};

export default UpdateProfileAPI;
