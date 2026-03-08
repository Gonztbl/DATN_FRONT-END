import apiClient from './apiClient';

const qrService = {
    /**
     * Get wallet QR code (Base64)
     * Endpoint: GET /api/qr/wallet
     */
    getWalletQR: async () => {
        const response = await apiClient.get('/api/qr/wallet');
        return response.data.qrBase64;
    },

    /**
     * Get wallet QR code with specific amount
     * Endpoint: POST /api/qr/wallet/with-amount
     * @param {number} amount - Amount to include in QR code
     */
    getWalletQRWithAmount: async (amount) => {
        const response = await apiClient.post('/api/qr/wallet/with-amount', { amount });
        return response.data.qrBase64;
    },

    /**
     * Download wallet QR code
     * Endpoint: GET /api/qr/wallet/download
     * Returns blob for file download
     */
    downloadWalletQR: async () => {
        const response = await apiClient.get('/api/qr/wallet/download', {
            responseType: 'blob'
        });
        return response.data;
    },

    /**
     * Read QR code from uploaded image
     * Endpoint: POST /api/qr/read-image
     * @param {File} file - QR code image file
     * @returns {Promise<QrImageReadResponse>} Wallet info and transfer readiness
     * Response: { userId, walletId, receiverName, accountNumber, amount, currency, valid, transferReady }
     */
    readQrImage: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiClient.post('/api/qr/read-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    /**
     * Resolve QR payload to get wallet information
     * Endpoint: POST /api/qr/resolve
     * @param {string} qrPayload - QR payload string (e.g., "walletapp://pay?version=1&walletId=123&amount=50000")
     * @returns {Promise<ResolveQrResponse>} Resolved wallet information
     * Response: { userId, walletId, receiverName, accountNumber, amount, currency, valid }
     */
    resolveQrPayload: async (qrPayload) => {
        const response = await apiClient.post('/api/qr/resolve', { qrPayload });
        return response.data;
    }
};

export default qrService;
