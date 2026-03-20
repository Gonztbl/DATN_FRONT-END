import apiClient from "../../../api/apiClient";

const productService = {
    getProducts: async (params) => {
        try {
            const response = await apiClient.get('/api/admin/products', { params });
            console.log("=== THÔNG TIN BACKEND TRẢ VỀ TRONG DANH SÁCH MÓN ĂN ===");
            if (response.data && response.data.content) {
                const sampleProduct = response.data.content[0];
                console.log("Món ăn mẫu:", sampleProduct?.name);
                const imgData = sampleProduct?.image_base64 || sampleProduct?.imageBase64;
                console.log("Base64 Backend Trả Về (Length):", imgData ? imgData.length + " ký tự" : "Không có ảnh");
                console.log("Nội dung Base64 bị cụt:", imgData ? imgData.substring(0, 100) + "..." : "Trống");
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getProductDetail: async (id) => {
        try {
            const response = await apiClient.get(`/api/admin/products/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createProduct: async (data) => {
        try {
            const response = await apiClient.post('/api/admin/products', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateProduct: async (id, data) => {
        try {
            // Phòng hờ backend lỗi binding (path variable vs request param vs body)
            const payload = { ...data, id: id, productId: id };
            const response = await apiClient.put(`/api/admin/products/${id}?id=${id}&productId=${id}`, payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteProduct: async (id) => {
        try {
            // Đính kèm params id everywhere
            const response = await apiClient.delete(`/api/admin/products/${id}?id=${id}&productId=${id}`, {
                data: { id: id, productId: id }
            });
            return response ? response.data : null;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Update product status (available/unavailable)
     */
    updateProductStatus: async (id, status) => {
        try {
            const response = await apiClient.put(`/api/admin/products/${id}/status`, { status });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default productService;
