import apiClient from "../../../api/apiClient";

const USERMANAGE_ENDPOINT = "/api/userManager";

const userManageService = {
  /**
   * Lấy toàn bộ user
   * @returns {Promise<Array>}
   */
  getAllUsers: async () => {
    try {
      const response = await apiClient.get(`${USERMANAGE_ENDPOINT}/all`);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      throw error;
    }
  },
  lockUser(id) {
    return apiClient.put(`${USERMANAGE_ENDPOINT}/lock/${id}`);
  },

  unlockUser(id) {
    return apiClient.put(`${USERMANAGE_ENDPOINT}/unlock/${id}`);
  },
  getUserById: async (userId) => {
    try {
      // Backend docs không có API lấy 1 user cho admin, nên ta gọi list `all` rồi filter
      const response = await apiClient.get(`${USERMANAGE_ENDPOINT}/all`);
      const allUsers = response.data;
      const foundUser = allUsers.find(u => String(u.id) === String(userId));
      if (!foundUser) {
          throw new Error("Không tìm thấy người dùng");
      }
      return foundUser;
    } catch (error) {
      console.error(`❌ Error fetching user ${userId}:`, error);
      throw error;
    }
  },
  updateUser: async (userId, data) => {
    try {
      const response = await apiClient.put(`${USERMANAGE_ENDPOINT}/update/${userId}`, data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error updating user ${userId}:`, error);
      throw error;
    }
  },
};

export default userManageService;
