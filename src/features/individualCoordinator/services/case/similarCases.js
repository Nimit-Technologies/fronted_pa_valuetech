import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

// POST /case/similar — the cases that may already be the one being filed: same
// customer phone number, or an address that reads like the same property.
//
// The create endpoint returns the first page of these itself when it holds a
// create back; this is what the next pages come from.
//
// The schema is strict, so the body carries exactly the fields it declares:
// customer_contact_number, address, offset, and case_id when a case is being
// edited rather than created (it is excluded from its own matches). There is no
// `limit` — page size is the server's DATA_LIMIT, and sending one is a 400.
//
// `offset` rather than a cursor: these rows are ordered by match quality, not
// by id, so there is nothing stable to carry forward but the position.
const SimilarCasesAPI = async ({
  customerContactNumber,
  address,
  caseId,
  offset = 0,
}) => {
  const response = await api.post(apiConfig.case.similarCase, {
    customer_contact_number: customerContactNumber,
    address,
    ...(caseId ? { case_id: caseId } : {}),
    offset,
  });
  return response.data;
};

export default SimilarCasesAPI;
