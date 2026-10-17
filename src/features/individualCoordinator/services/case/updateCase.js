import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

// PUT /case/update/:id
//
// The schema is strict and every field on it is optional, so the payload
// carries only what the user actually changed — and must carry at least one
// field, or it is a 400. `address` is a partial of its own: the keys left out
// keep their stored values rather than being cleared.
//
// Not sent: branch_id, which the backend re-derives from the bank, and
// business_type_id, which a coordinator is not allowed to move a case between.
// employee_id is not part of this schema at all — assigning an engineer is
// PATCH /case/assign/:id.
const updateCase = async (id, payload) => {
  const response = await api.put(`${apiConfig.case.updateCase}/${id}`, payload);
  return response.data;
};

export default updateCase;
