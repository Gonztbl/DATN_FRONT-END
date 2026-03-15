import apiClient from "../../../api/apiClient";

const vendorService = {
    // 1. Lấy danh sách danh mục (có phân trang, tìm kiếm, sắp xếp)
    getCategories: async (params = {}) => {
        try {
            const response = await apiClient.get('/api/admin/categories', { params });
            // API có thể trả về { data: [...], total: ... } hoặc mảng trực tiếp
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách danh mục:', error);
            throw error;
        }
    },

    // 2. Lấy chi tiết một danh mục
    getCategory: async (id) => {
        try {
            const response = await apiClient.get(`/api/admin/categories/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi lấy chi tiết danh mục ${id}:`, error);
            throw error;
        }
    },

    // 3. Thêm mới danh mục
    createCategory: async (data) => {
        try {
            const response = await apiClient.post('/api/admin/categories', data);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi thêm danh mục:', error);
            throw error;
        }
    },

    // 4. Cập nhật danh mục
    updateCategory: async (id, data) => {
        try {
            const response = await apiClient.put(`/api/admin/categories/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi cập nhật danh mục ${id}:`, error);
            throw error;
        }
    },

    // 5. Xóa danh mục
    deleteCategory: async (id) => {
        try {
            const response = await apiClient.delete(`/api/admin/categories/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi xóa danh mục ${id}:`, error);
            throw error;
        }
    },

    // 6. Xuất dữ liệu danh mục
    exportCategories: async () => {
        try {
            const response = await apiClient.get('/api/admin/categories/export', { responseType: 'blob' });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi xuất dữ liệu danh mục:', error);
            throw error;
        }
    },

    // 7. Kiểm tra tên danh mục đã tồn tại
    checkCategoryName: async (name, exclude_id = null) => {
        try {
            const params = { name };
            if (exclude_id) params.exclude_id = exclude_id;
            const response = await apiClient.get('/api/admin/categories/check-name', { params });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi kiểm tra tên danh mục:', error);
            throw error;
        }
    }
};

export default vendorService;
