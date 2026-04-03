import apiClient from '../../../api/apiClient';

const loanService = {
    /**
     * Nộp đơn vay vốn
     * @param {Object} loanData 
     * @param {number} loanData.amount - Số tiền vay
     * @param {number} loanData.term - Kỳ hạn (tháng)
     * @param {string} loanData.purpose - Mục đích vay
     * @param {number} loanData.declaredIncome - Thu nhập khai báo
     * @param {string} loanData.jobSegmentNum - Phân khúc nghề nghiệp
     */
    applyLoan: async (loanData) => {
        try {
            const response = await apiClient.post('/api/v1/loans/apply', loanData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Lấy danh sách đơn vay của tôi
     * @param {number} page 
     * @param {number} size 
     */
    getMyLoans: async (page = 0, size = 10, sort = 'createdAt,desc') => {
        try {
            const response = await apiClient.get(`/api/v1/loans/my-loans?page=${page}&size=${size}&sort=${sort}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Lấy tóm tắt lịch sử vay và điểm tín dụng
     */
    getLoanSummary: async () => {
        try {
            const response = await apiClient.get('/api/v1/loans/summary');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Lấy chi tiết đơn vay
     * @param {number} id 
     */
    getLoanDetails: async (id) => {
        try {
            const response = await apiClient.get(`/api/v1/loans/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default loanService;
