import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

// GET /case/:id — the detail payload: everything a list row carries plus the
// full address, update_history, and the newest remarks (with has_more_remarks
// when the thread is longer than the preview). Scoped server-side, so a case
// outside the caller's scope comes back as a plain 404.
const getCaseById = async (id) => {
  const response = await api.get(`${apiConfig.case.getCaseById}/${id}`);
  return response.data;
};

export default getCaseById;
