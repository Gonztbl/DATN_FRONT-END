import apiClient from "../../../../api/apiClient";

const BASE_URL = "/api/user/E-Wallet/transfers";

const TransferService = {
  transfer({ toUserId, amount, note }) {
    return apiClient.post(BASE_URL, {
      toUserId,
      amount,
      note,
    });
  },

  checkFraud({ toAccountNumber, amount, note }) {
    return apiClient.post("/api/v1/transfer/check-fraud", { toAccountNumber, amount, note });
  },

  confirmTransfer({ sessionToken, faceVerified }) {
    return apiClient.post("/api/v1/transfer/confirm", { sessionToken, faceVerified });
  },

  getTransferHistory(walletId, params = {}) {
    return apiClient
      .get(`${BASE_URL}/wallet/${walletId}/history`, { params })
      .then(res => res.data);
  },

  getTransferDetail(transferId) {
    return apiClient
      .get(`${BASE_URL}/${transferId}`)
      .then(res => res.data);
  },

  getTargetWallets(phone) {
    return apiClient
      .get(`${BASE_URL}/wallets/search`, { params: { phone } })
      .then(res => res.data);
  },
};

export default TransferService;
