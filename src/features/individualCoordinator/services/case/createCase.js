import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

// POST /case/create-case
//
// The schema is strict, so the payload carries exactly the fields it declares:
// file_number, banker_name, customer_name, customer_contact_number, case_type,
// business_type_id, bank_id, address and confirm_duplicate (plus an optional
// employee_id, which this form does not set). branch_id is deliberately left
// out — the backend derives the case's branch from the bank.
const createCase = async (payload) => {
  const response = await api.post(apiConfig.case.createCase, payload);
  return response.data;
};

export default createCase;
