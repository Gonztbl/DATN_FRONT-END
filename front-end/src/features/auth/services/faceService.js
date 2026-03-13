import apiClient from "../../../services/apiClient";

const faceService = {
    // Helper để lấy userId từ api /api/me nếu không được truyền vào
    _getUserId: async (userId) => {
        if (userId) return userId;
        try {
            const res = await apiClient.get('/api/me');
            // Dựa theo doc, response của /api/me chứa thông tin user
            return res.data.id || res.data.userId; 
        } catch (err) {
            console.error("Failed to get current userId", err);
            return null;
        }
    },

    // 1. Lấy danh sách metadata của các embedding đã đăng ký
    // Endpoint: GET /api/face/list/{userId}
    listEmbeddings: async (userId) => {
        try {
            const id = await faceService._getUserId(userId);
            if (!id) return [];
            
            const res = await apiClient.get(`/api/face/list/${id}`);
            return Array.isArray(res.data) ? res.data : [];
        } catch (err) {
            console.error("Lỗi list embeddings:", err);
            return [];
        }
    },

    // 2. Đăng ký một pose khuôn mặt (multipart/form-data)
    // Endpoint: POST /api/face/register
    registerFace: async (formData) => {
        try {
            // Tự động bổ sung userId nếu chưa có trong formData
            if (!formData.has("userId")) {
                const id = await faceService._getUserId();
                if (id) formData.append("userId", id);
            }

            // Log FormData trước khi gửi (debug)
            for (let [key, value] of formData.entries()) {
                console.log(`FormData entry: ${key} =`, value instanceof Blob ? 'Blob/File' : value);
            }

            const res = await apiClient.post(`/api/face/register`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',  // Bắt buộc
                },
            });

            console.log('Register success:', res.data);
            return res.data;
        } catch (err) {
            // Log chi tiết lỗi từ backend
            console.error('Register error full:', {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message,
                headers: err.response?.headers,
            });

            // Hiển thị message từ backend nếu có
            const errorMsg = err.response?.data?.message 
                || err.response?.data?.error 
                || "Đăng ký thất bại. Vui lòng kiểm tra ảnh và thử lại.";

            throw new Error(errorMsg);  // Để showError ở FE bắt được
        }
    },

    // 3. Xóa một embedding theo ID
    // Endpoint: DELETE /api/face/{embeddingId}
    deleteEmbedding: async (embeddingId) => {
        const res = await apiClient.delete(`/api/face/${embeddingId}`);
        return res.data;
    },

    // 4. Xác thực khuôn mặt (Verify)
    // Endpoint: POST /api/face/verify
    verifyFace: async (formData) => {
        if (!formData.has("userId")) {
            const id = await faceService._getUserId();
            if (id) formData.append("userId", id);
        }

        const res = await apiClient.post(`/api/face/verify`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    },

    // 5. Generate Embedding (Utility) - POST /api/face/embedding
    generateEmbedding: async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await apiClient.post(`/api/face/embedding`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    },

    // 6. Compare Two Faces (Utility) - POST /api/face/compare
    compareFaces: async (img1, img2) => {
        const formData = new FormData();
        formData.append("img1", img1);
        formData.append("img2", img2);
        const res = await apiClient.post(`/api/face/compare`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    },
};

export default faceService;