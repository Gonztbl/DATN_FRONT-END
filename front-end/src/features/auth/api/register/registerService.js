import apiClient from "../../../../api/apiClient";

const REGISTER_ENDPOINT = "/api/auth/register";

export const RegisterService = {
  register(data) {
    return apiClient.post(REGISTER_ENDPOINT, data);
  },
  adminRegister(data) {
    return apiClient.post("/api/auth/admin/register", data);
  }
};

export default RegisterService;
