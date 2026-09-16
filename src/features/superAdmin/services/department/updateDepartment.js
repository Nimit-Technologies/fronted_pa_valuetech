import api from "@/utils/axiosInstance";

const updateDepartment = async (payload) => {
  const { id, ...departmentData } = payload.data;
  const response = await api.put(`/department/update/${id}`, departmentData);
  return response.data;
};

export default updateDepartment;
