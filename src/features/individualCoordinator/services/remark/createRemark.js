import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

// POST /remark/:caseId
//
// The body is exactly { content }: the schema is strict, so any extra key is a
// 400, and the author is taken from the session — a client-supplied user id
// would let anyone post a remark in someone else's name.
//
// Returns the created remark with its author snapshot, ready to drop into the
// thread without refetching the case.
const createRemark = async (caseId, content) => {
  const response = await api.post(
    `${apiConfig.remark.createRemark}/${caseId}`,
    { content },
  );
  return response.data;
};

export default createRemark;
