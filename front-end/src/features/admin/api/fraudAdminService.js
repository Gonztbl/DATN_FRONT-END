import apiClient from "../../../api/apiClient";

const BASE_URL = "/api/v1/admin/fraud-alerts";

const fraudAdminService = {
  getFraudStats: async () => {
    const response = await apiClient.get(`${BASE_URL}/stats`);
    return response.data;
  },

  getFraudAlerts: async (params) => {
    const response = await apiClient.get(BASE_URL, { params });
    return response.data;
  },

  getFraudAlertDetail: async (id) => {
    const response = await apiClient.get(`${BASE_URL}/${id}`);
    return response.data;
  }
};

export default fraudAdminService;
