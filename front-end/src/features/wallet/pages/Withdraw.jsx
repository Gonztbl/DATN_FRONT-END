import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatVND, formatDateRangeFromNow } from "../utils";
import { showSuccess, showError, showWarning } from "../../../utils/swalUtils";
import { useTheme } from "../../../context/ThemeContext";
import Sidebar from "../../../components/layout/Sidebar";
import apiClient from "../../../api/apiClient";

import userService from "../../profile/api/userService";
import walletService from "../api/walletService";
import cardService from "../api/cardService";

// WithdrawPage.jsx
export default function Withdraw() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [cards, setCards] = useState(null);
  const [user, setUser] = useState(null);
  const [walletInfo, setWalletInfo] = useState(null); // { id, walletId, availableBalance, ... }
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [note, setNote] = useState("Rút tiền qua ứng dụng ví điện tử");

  // History State
  const [recentWithdrawals, setRecentWithdrawals] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState("");

  // Modal state
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: "",
    holderName: "",
    expiryDate: "",
    cvv: "",
    type: "Debit",
    bankName: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    const extractNumericId = (str) => {
      const match = str?.match(/\d+/);
      return match ? parseInt(match[0], 10) : null;
    };

    const fetchData = async () => {
      try {
        const [userData, walletMe, walletBalance, cardsData] = await Promise.all([
          userService.getCurrentUser(),       // GET /api/me
          walletService.getWalletInfo(),      // GET /api/wallet/me
          walletService.getBalance(),          // GET /api/wallet/available-balance
          cardService.getCards(),
        ]);
        console.log("userData:", userData);
        console.log("walletMe:", walletMe);

        setUser(userData);
        
        const numericIdFromUser = userData?.wallet?.id;
        const numericIdFromWalletMe = typeof walletMe?.id === 'number' ? walletMe.id : null;
        const numericIdFromExtraction = extractNumericId(walletMe?.walletId);
        
        const finalWalletId = numericIdFromUser ?? numericIdFromWalletMe ?? numericIdFromExtraction;

        if (!finalWalletId) {
          console.error("Could not determine numeric wallet ID from any source", { userData, walletMe });
        }

        const walletData = {
          ...walletMe,
          id: finalWalletId, 
          availableBalance: walletBalance?.availableBalance ?? walletBalance?.balance ?? userData?.wallet?.availableBalance ?? walletMe?.balance ?? 0,
        };
        
        console.log("Final walletInfo (Aligned with API JSON):", walletData);
        setWalletInfo(walletData);
        setCards(cardsData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    const fetchWithdrawHistory = async () => {
      setLoadingHistory(true);
      setHistoryError("");
      try {
        const res = await cardService.getWithdrawHistory();
        console.log("Withdraw History:", res);
        if (Array.isArray(res)) {
          setRecentWithdrawals(res);
        } else {
          setHistoryError("Invalid data format received.");
        }
      } catch (e) {
        console.error("Load withdraw history failed", e);
        setHistoryError("Không thể tải lịch sử rút tiền.");
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchData();
    fetchWithdrawHistory();
  }, []);

  function handleWithdrawAmountChange(e) {
    const val = Number(e.target.value);
    if (val < 0) return;
    
    // Check if Amount + 5% Fee exceeds available balance
    if (val * 1.05 > (walletInfo?.availableBalance ?? Infinity)) return;
    
    setWithdrawAmount(e.target.value);
  }

  function handleWithdrawAvailalbeMax(amount) {
    if (amount < 0 || amount * 1.05 > (walletInfo?.availableBalance ?? Infinity))
      return;
    setWithdrawAmount(amount);
  }

  async function confirmWithdraw() {
    if (!walletInfo) {
      showWarning("Đang tải", "Vui lòng đợi trong khi chúng tôi tải thông tin ví của bạn.");
      return;
    }
    if (!selectedAccount) {
      showWarning("Yêu cầu tài khoản", "Vui lòng chọn tài khoản ngân hàng để rút tiền.");
      return;
    }
    const amount = Number(withdrawAmount);
    if (!amount || amount <= 0) {
      showWarning("Số tiền không hợp lệ", "Vui lòng nhập số tiền lớn hơn 0.");
      return;
    }
    // Backend fix cứng phí rút tiền là 5% (0.05)
    if (amount * 1.05 > (walletInfo.availableBalance ?? 0)) {
      showWarning("Số dư không đủ", "Số tiền vượt quá số dư khả dụng (bao gồm 5% phí).");
      return;
    }

    // API: POST /api/wallets/{walletId}/withdraw — walletId là số (Integer) từ /api/me
    const walletId = walletInfo.id;

    if (!walletId) {
      console.error("Invalid wallet ID:", walletInfo);
      showError("Lỗi ID Ví", "Không thể lấy ID ví dạng số. Vui lòng thử tải lại trang.");
      return;
    }

    try {
      const response = await apiClient.post(
        `/api/wallets/${walletId}/withdraw`,
        {
          bankAccountId: selectedAccount,
          amount: amount,
          note: note, // Sử dụng ghi chú từ người dùng
        },
        {
          headers: { "Idempotency-Key": crypto.randomUUID() },
        }
      );

      showSuccess("Rút tiền thành công", "Tiền của bạn đang được xử lý.");
      console.log("Withdraw response:", response.data);

      if (response.data?.availableBalanceAfter !== undefined) {
        setWalletInfo((prev) => ({
          ...prev,
          availableBalance: response.data.availableBalanceAfter,
        }));
      } else {
        // Refetch balance
        const updated = await walletService.getBalance();
        setWalletInfo((prev) => ({
          ...prev,
          availableBalance: updated?.availableBalance ?? updated?.balance ?? 0,
        }));
      }
      setWithdrawAmount(0);
      setSelectedAccount(null);
      
      // Refresh balance and history
      const fetchWithdrawHistory = async () => {
        try {
          const res = await cardService.getWithdrawHistory();
          if (Array.isArray(res)) setRecentWithdrawals(res);
        } catch (e) { console.error(e); }
      };
      fetchWithdrawHistory();
    } catch (e) {
      console.error("Withdraw error:", e);
      const msg = e.response?.data?.message || e.response?.data?.error || "Rút tiền thất bại. Vui lòng thử lại.";
      showError("Rút tiền thất bại", msg);
    }
  }

  const handleAddCardSubmit = async (e) => {
    e.preventDefault();
    try {
      await cardService.createCard(newCard);
      showSuccess("Đã thêm thẻ thành công!", "Thành công");
      setShowAddCardModal(false);
      setNewCard({ cardNumber: "", holderName: "", expiryDate: "", cvv: "", type: "Debit", bankName: "" });

      // Refresh cards list
      const cardsRes = await cardService.getCards();
      setCards(cardsRes);
    } catch (error) {
      console.error("Add card failed:", error);
      showError("Thêm thẻ thất bại", (error.response?.data?.message || error.message));
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#f6f8f7] dark:bg-slate-900 font-display text-[#111714] dark:text-white overflow-hidden">
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <Sidebar activeRoute="withdraw" />

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full overflow-y-auto bg-[#f6f8f7] dark:bg-slate-900">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">arrow_upward</span>
              <span className="font-bold text-lg">Rút tiền</span>
            </div>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>

          {/* Content Container */}
          <div className="flex-1 p-6 md:p-10 max-w-[1400px] mx-auto w-full">
            {/* Page Header */}
            <div className="flex justify-between items-start mb-10">
              <div className="flex flex-col gap-2">
                <h1 className="text-[#111714] dark:text-white text-4xl font-black leading-tight tracking-[-0.02em]">
                  Rút tiền
                </h1>
                <p className="text-[#648772] dark:text-slate-400">
                  Chọn tài khoản ngân hàng và nhập số tiền để rút khỏi ví của bạn.
                </p>
              </div>
              <button
                onClick={toggleDarkMode}
                className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                <span className="material-symbols-outlined transition-all">
                  {isDarkMode ? "light_mode" : "dark_mode"}
                </span>
              </button>
            </div>

            {/* Main form layout */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Left: Form */}
              <div className="flex-1 w-full bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-6 md:p-8">
                <div className="flex flex-col gap-2 mb-8 border-b border-gray-200 dark:border-slate-800 pb-6">
                  <h3 className="text-2xl font-bold leading-tight">
                    Rút về tài khoản ngân hàng
                  </h3>
                  <p className="text-[#648772] dark:text-slate-400">
                    Chuyển tiền an toàn đến tài khoản đã liên kết của bạn.
                  </p>
                </div>

                <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
                  {/* Card selection */}
                  <div className="flex flex-col gap-3">
                    <label className="text-base font-medium leading-normal flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">account_balance</span>
                      Rút về
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {cards && cards.map((card) => (
                        <label
                          className="cursor-pointer relative"
                          key={card.id}
                          onClick={() => setSelectedAccount(card.id)}
                        >
                          <input className="peer sr-only" name="account" type="radio" />
                          <div className="p-4 rounded-lg border border-gray-200 dark:border-slate-800 flex items-center gap-4 transition-all hover:bg-[#f6f8f7] dark:hover:bg-slate-700 peer-checked:border-primary peer-checked:bg-primary/5 dark:peer-checked:bg-primary/10">
                            <div className="size-10 rounded-full bg-white flex items-center justify-center shadow-sm text-blue-800">
                              <span className="material-symbols-outlined">payments</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-sm">{card.bankName}</span>
                              <span className="text-xs text-[#648772] dark:text-slate-400">{card.cardNumber}</span>
                              <span className="text-xs text-primary font-bold">
                                Số dư: {card.balanceCard?.toLocaleString('vi-VN')} đ
                              </span>
                            </div>
                            <div className="ml-auto text-primary opacity-0 peer-checked:opacity-100">
                              <span className="material-symbols-outlined fill-current">check_circle</span>
                            </div>
                          </div>
                        </label>
                      ))}

                      <button
                        type="button"
                        onClick={() => setShowAddCardModal(true)}
                        className="flex items-center justify-center gap-2 p-4 rounded-lg border border-dashed border-gray-200 dark:border-slate-800 text-[#648772] dark:text-slate-400 hover:text-primary hover:border-primary transition-colors"
                      >
                        <span className="material-symbols-outlined">add</span>
                        <span className="text-sm font-medium">Liên kết thẻ mới</span>
                      </button>
                    </div>
                  </div>

                  {/* Amount input */}
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-end">
                      <label className="text-base font-medium leading-normal flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[20px]">attach_money</span>
                        Số tiền
                      </label>
                      <span className="text-xs font-medium text-[#648772] dark:text-slate-400">
                        Số dư khả dụng:
                        <span className="text-[#111714] dark:text-white font-bold ml-1">
                          {walletInfo ? formatVND(walletInfo.availableBalance ?? 0) : "Đang tải..."}
                        </span>
                      </span>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-[#648772] dark:text-slate-400 font-bold text-lg">đ</span>
                      </div>
                      <input
                        className="form-input block w-full pl-10 pr-4 py-4 rounded-lg bg-[#f6f8f7] dark:bg-slate-800 border border-gray-200 dark:border-slate-800 text-[#111714] dark:text-white placeholder:text-[#648772]/50 focus:border-primary focus:ring-primary text-3xl font-bold tracking-tight"
                        placeholder="0"
                        type="number"
                        value={withdrawAmount}
                        onChange={handleWithdrawAmountChange}
                      />
                    </div>

                    <div className="flex gap-3 flex-wrap pt-2">
                      <button
                        className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-[#f6f8f7] dark:hover:bg-slate-700 px-4 transition-colors"
                        type="button"
                        onClick={() => handleWithdrawAvailalbeMax(50000)}
                      >
                        <p className="text-sm font-medium leading-normal">50.000 đ</p>
                      </button>

                      <button
                        className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-[#f6f8f7] dark:hover:bg-slate-700 px-4 transition-colors"
                        type="button"
                        onClick={() => handleWithdrawAvailalbeMax(500000)}
                      >
                        <p className="text-sm leading-normal">500.000 đ</p>
                      </button>

                      <button
                        className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-[#f6f8f7] dark:hover:bg-slate-700 px-4 transition-colors"
                        type="button"
                        onClick={() => handleWithdrawAvailalbeMax(1000000)}
                      >
                        <p className="text-sm font-medium leading-normal">1.000.000 đ</p>
                      </button>

                      <button
                        className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-[#f6f8f7] dark:hover:bg-slate-700 px-4 transition-colors ml-auto"
                        type="button"
                        onClick={() => {
                          const available = walletInfo?.availableBalance ?? 0;
                          // Amount * 1.05 = Available => Amount = Available / 1.05
                          const maxPossible = Math.floor(available / 1.05);
                          setWithdrawAmount(maxPossible);
                        }}
                      >
                        <p className="text-sm font-bold leading-normal text-[#648772] dark:text-slate-400">Tối đa</p>
                      </button>
                    </div>
                  </div>

                  {/* Note input */}
                  <div className="flex flex-col gap-3">
                    <label className="text-base font-medium leading-normal flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">notes</span>
                      Ghi chú (Không bắt buộc)
                    </label>
                    <input
                      className="form-input block w-full px-4 py-3 rounded-lg bg-[#f6f8f7] dark:bg-slate-800 border border-gray-200 dark:border-slate-800 text-[#111714] dark:text-white placeholder:text-[#648772]/50 focus:border-primary focus:ring-primary text-sm"
                      placeholder="VD: Rút tiền tiêu vặt"
                      type="text"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>

                  {/* Info box */}
                  <div className="flex gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 shrink-0">info</span>
                    <div className="text-sm text-blue-900 dark:text-blue-100">
                      <p className="font-bold mb-1">Thời gian xử lý &amp; Phí</p>
                      <p>
                        Khách hàng thường nhận được tiền vào tài khoản ngân hàng trong 1-3 ngày làm việc.
                        Phí giao dịch cố định là <span className="font-bold text-blue-700 dark:text-blue-300">5%</span> áp dụng cho tất cả các khoản rút.
                      </p>
                    </div>
                  </div>
                </form>
              </div>

              {/* Right: Summary */}
              <div className="w-full lg:w-96 shrink-0 flex flex-col gap-6 sticky top-8">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden">
                  <div className="p-6 border-b border-gray-200 dark:border-slate-800 bg-[#f6f8f7]/50 dark:bg-slate-900/50">
                    <h3 className="text-lg font-bold">Tóm tắt giao dịch</h3>
                  </div>

                  <div className="p-6 flex flex-col gap-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#648772] dark:text-slate-400">Số tiền rút</span>
                      <span className="font-medium">{formatVND(withdrawAmount)}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#648772] dark:text-slate-400">Phí dịch vụ (5%)</span>
                      <span className="font-medium text-red-500">-{formatVND(withdrawAmount * 0.05)}</span>
                    </div>

                    <div className="my-2 border-t border-gray-200 dark:border-slate-800 border-dashed" />

                    <div className="flex justify-between items-center">
                      <span className="font-bold text-base">Tổng khấu trừ</span>
                      <span className="font-extrabold text-xl text-[#111714] dark:text-white">
                        {formatVND(withdrawAmount * 1.05)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs text-[#648772] dark:text-slate-400 mt-1">
                      <span>Dự kiến nhận tiền</span>
                      <span>{formatDateRangeFromNow()}</span>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button
                      type="button"
                      onClick={confirmWithdraw}
                      className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-primary hover:bg-primary/90 transition-colors text-[#111714] text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/20"
                    >
                      Xác nhận rút tiền
                    </button>

                    <div className="flex justify-center items-center gap-2 mt-4 text-xs text-[#648772] dark:text-slate-400">
                      <span className="material-symbols-outlined text-[16px]">lock</span>
                      <span>Giao dịch bảo mật bằng SSL 256-bit</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-6 flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full text-primary shrink-0">
                    <span className="material-symbols-outlined">support_agent</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1">Cần hỗ trợ?</h4>
                    <p className="text-xs text-[#648772] dark:text-slate-400 mb-2">
                      Nếu bạn gặp bất kỳ vấn đề nào khi rút tiền, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi.
                    </p>
                    <a className="text-primary text-xs font-bold hover:underline" href="#">
                      Liên hệ hỗ trợ
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* HISTORY SECTION SEPARATE FROM COLUMNS */}
            <div className="mt-12 flex justify-center pb-20">
              <div className="max-w-[1400px] w-full">
                <h3 className="text-[#111714] dark:text-white text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">history</span>
                  Giao dịch rút tiền gần đây
                </h3>

                {loadingHistory ? (
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-8 text-center border border-gray-100 dark:border-slate-800">
                    <div className="size-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-sm text-text-sub dark:text-slate-400 font-medium">Đang tải lịch sử...</p>
                  </div>
                ) : historyError ? (
                  <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-100 dark:border-red-800/20 text-center">
                    <span className="material-symbols-outlined text-red-500 mb-2">error</span>
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">{historyError}</p>
                  </div>
                ) : recentWithdrawals.length === 0 ? (
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border border-gray-100 dark:border-slate-800 shadow-sm">
                    <span className="material-symbols-outlined text-gray-300 dark:text-slate-700 text-6xl mb-4">history_toggle_off</span>
                    <p className="text-gray-500 dark:text-slate-500 font-medium">Không tìm thấy lịch sử rút tiền.</p>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                      <thead className="bg-[#f6f8f7] dark:bg-slate-900/50 text-[#648772] dark:text-slate-400 text-xs uppercase font-bold tracking-wider">
                        <tr>
                          <th className="px-6 py-4">Mã giao dịch</th>
                          <th className="px-6 py-4">Thời gian</th>
                          <th className="px-6 py-4">Ngân hàng &amp; Thẻ</th>
                          <th className="px-6 py-4">Nội dung</th>
                          <th className="px-6 py-4">Số tiền</th>
                          <th className="px-6 py-4">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-sm">
                        {recentWithdrawals.map((tx) => (
                          <tr key={tx.transactionId} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                            <td className="px-6 py-5 font-mono text-xs text-text-sub dark:text-slate-400 font-bold">
                              #{tx.transactionId}
                            </td>
                            <td className="px-6 py-5">
                              <p className="text-text-main dark:text-white font-medium">
                                {tx.timestamp ? new Date(tx.timestamp).toLocaleDateString('vi-VN') : ""}
                              </p>
                              <p className="text-[10px] text-text-sub dark:text-slate-500">
                                {tx.timestamp ? new Date(tx.timestamp).toLocaleTimeString('vi-VN') : ""}
                              </p>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="size-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                  <span className="material-symbols-outlined text-[18px]">account_balance</span>
                                </div>
                                <div>
                                  <p className="text-text-main dark:text-white font-bold">{tx.bankName}</p>
                                  <p className="text-xs text-text-sub dark:text-slate-500">{tx.cardNumber}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-text-sub dark:text-slate-400 max-w-[200px] truncate italic">
                              {tx.description || "Rút tiền về thẻ"}
                            </td>
                            <td className="px-6 py-5">
                              <span className="font-extrabold text-red-500 text-base">
                                -{formatVND(tx.amount)}
                              </span>
                            </td>
                            <td className="px-6 py-5">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ring-1 ring-inset ${
                                tx.status === "SUCCESS"
                                  ? "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/20 dark:text-green-400"
                                  : tx.status === "PENDING"
                                  ? "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-900/20 dark:text-amber-400"
                                  : "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/20 dark:text-red-400"
                              }`}>
                                <span className={`size-1.5 rounded-full mr-1.5 ${
                                  tx.status === "SUCCESS" ? "bg-green-500" : tx.status === "PENDING" ? "bg-amber-500" : "bg-red-500"
                                }`}></span>
                                {tx.status === "SUCCESS" ? "Thành công" : tx.status === "PENDING" ? "Đang xử lý" : "Thất bại"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
    
      {/* ADD CARD MODAL */}
      {showAddCardModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl border border-gray-100 dark:border-slate-800 animate-slideUp">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-text-main dark:text-white">Thêm thẻ mới</h3>
              <button 
                onClick={() => setShowAddCardModal(false)}
                className="size-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                <span className="material-symbols-outlined text-gray-500">close</span>
              </button>
            </div>
            
            <form onSubmit={handleAddCardSubmit} className="flex flex-col gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-sub dark:text-slate-400 uppercase ml-1">Số thẻ</label>
                <input
                  placeholder="0000 0000 0000 0000"
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                  value={newCard.cardNumber}
                  onChange={e => setNewCard({ ...newCard, cardNumber: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-sub dark:text-slate-400 uppercase ml-1">Tên chủ thẻ</label>
                <input
                  placeholder="NGUYEN VAN A"
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                  value={newCard.holderName}
                  onChange={e => setNewCard({ ...newCard, holderName: e.target.value.toUpperCase() })}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-sub dark:text-slate-400 uppercase ml-1">Hết hạn</label>
                  <input
                    placeholder="MM/YY"
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                    value={newCard.expiryDate}
                    onChange={e => setNewCard({ ...newCard, expiryDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-sub dark:text-slate-400 uppercase ml-1">CVV</label>
                  <input
                    placeholder="***"
                    type="password"
                    maxLength="3"
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                    value={newCard.cvv}
                    onChange={e => setNewCard({ ...newCard, cvv: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-sub dark:text-slate-400 uppercase ml-1">Loại thẻ</label>
                <select
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                  value={newCard.type}
                  onChange={e => setNewCard({ ...newCard, type: e.target.value })}
                >
                  <option value="Debit">Debit Card</option>
                  <option value="Credit">Credit Card</option>
                </select>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-sub dark:text-slate-400 uppercase ml-1">Ngân hàng</label>
                <input
                  placeholder="Ví dụ: Vietcombank"
                  className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                  value={newCard.bankName}
                  onChange={e => setNewCard({ ...newCard, bankName: e.target.value })}
                  required
                />
              </div>
              
              <div className="flex gap-3 justify-end mt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddCardModal(false)} 
                  className="px-6 py-2.5 rounded-xl text-text-sub font-bold hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="px-8 py-2.5 rounded-xl bg-primary text-text-main font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                >
                  Liên kết thẻ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
