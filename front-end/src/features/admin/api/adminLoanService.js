import apiClient from '../../../api/apiClient';

const adminLoanService = {
    /**
     * Lấy danh sách khoản vay chờ duyệt (paginated + search/filter)
     * @param {Object} params - { page, size, sort, keyword, minAiScore, maxAiScore }
     */
    getPendingLoans: (params = {}) => {
        return apiClient.get('/api/v1/admin/loans', { params });
    },

    /**
     * Lấy chi tiết khoản vay + thông tin user + AI features
     * @param {number} id - Loan ID
     */
    getLoanDetail: (id) => {
        return apiClient.get(`/api/v1/admin/loans/${id}`);
    },

    /**
     * Lấy thống kê tổng hợp dashboard
     * Returns: { totalPending, averageAmount, highRiskCount, moderateRiskCount, lowRiskCount }
     */
    getDashboardStats: () => {
        return apiClient.get('/api/v1/admin/loans/stats');
    },

    /**
     * Duyệt khoản vay và tự động chuyển tiền vào ví user
     * @param {number} id - Loan ID
     * @param {string} adminNote - Ghi chú của admin (optional)
     */
    approveLoan: (id, adminNote = '') => {
        return apiClient.post(`/api/v1/admin/loans/${id}/approve`, { adminNote });
    },

    /**
     * Từ chối khoản vay với lý do cụ thể
     * @param {number} id - Loan ID
     * @param {string} adminNote - Lý do từ chối (required)
     */
    rejectLoan: (id, adminNote) => {
        return apiClient.post(`/api/v1/admin/loans/${id}/reject`, { adminNote });
    },

    /**
     * Lấy phân tích AI + metrics ví của 1 user cho admin review
     * @param {number} userId - User ID
     * Returns: { userId, fullName, email, phone, walletBalance, availableBalance,
     *            monthlyInflowMean, monthlyOutflowMean, transactionCount, accountAgeDays,
     *            spendIncomeRatio (%), balanceVolatility, rejectedTransactionRatio (%),
     *            age, avgBalance, lowBalanceDaysRatio (%), largestInflow,
     *            peerTransferRatio (%), uniqueReceivers }
     */
    getUserAiAnalysis: (userId) => {
        return apiClient.get(`/api/v1/admin/users/${userId}/ai-analysis`);
    },

    /**
     * Lấy tất cả khoản vay trong hệ thống (paginated + search/filter)
     * @param {Object} params - { page, size, keyword, minAiScore, maxAiScore, status }
     */
    getAllLoans: (params = {}) => {
        const query = {
            page: params.page ?? 0,
            size: params.size ?? 10,
            ...(params.keyword     && { keyword:    params.keyword }),
            ...(params.minAiScore !== undefined && { minAiScore: params.minAiScore }),
            ...(params.maxAiScore !== undefined && { maxAiScore: params.maxAiScore }),
            ...(params.status     && { status:     params.status }),  // '' hoặc undefined = lấy tất cả
        };
        return apiClient.get('/api/v1/admin/loans/all', { params: query });
    },
};

export default adminLoanService;
