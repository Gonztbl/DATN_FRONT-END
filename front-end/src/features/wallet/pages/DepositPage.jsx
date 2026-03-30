import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cardService from "../api/cardService";
import walletService from "../api/walletService";
import { useAuth } from "../../auth/context/AuthContext";
import { useNotification } from "../../../context/NotificationContext";
import { useTheme } from "../../../context/ThemeContext";
import Sidebar from "../../../components/layout/Sidebar";

const DepositPage = () => {
  const navigate = useNavigate();
  const { showSuccess } = useNotification();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [error, setError] = useState("");
  const [recentDeposits, setRecentDeposits] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState("");
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [cards, setCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loadingCards, setLoadingCards] = useState(true);

  // Fetch Wallet (for balance) and Cards
  const fetchData = async () => {
    try {
      if (user) {
        const walletRes = await walletService.getWalletInfo();
        setWallet(walletRes);
      }

      // Fetch Cards
      const cardRes = await cardService.getCards();
      setCards(cardRes);
      if (cardRes.length > 0) {
        setSelectedCardId(cardRes[0].id);
      }
    } catch (e) {
      console.error("Error fetching data", e);
      setError("Failed to load user data.");
    } finally {
      setLoadingCards(false);
    }
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    setHistoryError("");
    try {
      const res = await cardService.getDepositHistory();
      console.log("Deposit History:", res);
      // Ensure res is an array
      if (Array.isArray(res)) {
        setRecentDeposits(res);
      } else {
        console.error("History response is not an array", res);
        setHistoryError("Invalid data format received.");
      }
    } catch (e) {
      console.error("Load deposit history failed", e);
      setHistoryError("Failed to load history.");
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
      fetchHistory();
    }
  }, [user]);

  const amountNumber = Number(amount) || 0;
  // Fee calculation can be removed or kept? The prompt didn't specify fee logic, but preserved it is safer or ask?
  // Previous code had fee. Use case doesn't mention fee. I will keep it pure amount unless user asked.
  // Actually, bank usually doesn't take fee for deposit in this mock?
  // Let's assume 0 fee for now or keep previous logic?
  // The API request body only has `amount` and `description`. It doesn't send total pay.
  // So the fee is frontend only display or backend handles it?
  // Let's stick to simple amount.

  const handleDeposit = async (e) => {
    e.preventDefault();
    const amountNumber = Number(amount);

    if (!amountNumber || amountNumber <= 0) {
      setError("Deposit amount must be greater than 0");
      return;
    }

    if (!selectedCardId) {
      setError("Please select a card");
      return;
    }

    setError("");

    try {
      const res = await cardService.depositFromCard({
        cardId: selectedCardId,
        amount: amountNumber, // Provide amount
        description: "Deposit from card"
      });

      if (res.status === 'FAILED' || res.status === 'ERROR') {
        // Manually throw error to trigger catch block
        throw new Error(res.message || "Giao diện nạp tiền thất bại");
      }

      showSuccess(`${amountNumber.toLocaleString('vi-VN')} đ đã được nạp thành công vào ví của bạn!`, "Nạp tiền thành công");
      setAmount("");
      // refetch
      fetchData();
      fetchHistory();
    } catch (e) {
      console.error(e);
      // Check for specific error message from backend
      const msg = e.response?.data?.message || "Deposit failed";
      setError(msg);
    }
  };

  const handleQuickAdd = (value) => {
    const current = Number(amount) || 0;
    setAmount(String(current + value));
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-slate-900 font-display text-[#111714] dark:text-white overflow-hidden">
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <Sidebar activeRoute="deposit" />

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full overflow-y-auto bg-background-light dark:bg-slate-900">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">arrow_downward</span>
              <span className="font-bold text-lg">Nạp tiền</span>
            </div>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>

          <div className="flex-1 px-4 md:px-10 py-8 flex justify-center">
            <div className="flex flex-col lg:flex-row gap-8 max-w-[1200px] w-full">
              {/* LEFT SECTION */}
              <section className="flex-1 flex flex-col gap-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div />
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
                  <h1 className="text-4xl font-black text-[#111714] dark:text-white">Nạp tiền</h1>
                  <p className="text-[#648772] dark:text-slate-400">
                    Chọn một thẻ và nhập số tiền để nạp vào ví của bạn.
                  </p>
                </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Lỗi: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {/* CREDIT CARD SELECTION */}
            <div>
              <h3 className="text-lg font-bold mb-3 text-[#111714] dark:text-white">Chọn thẻ</h3>
              {loadingCards ? (
                <p>Đang tải thẻ...</p>
              ) : cards.length === 0 ? (
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-gray-500 mb-2">Không có thẻ liên kết.</p>
                  <button onClick={() => navigate('/cards')} className="text-primary font-bold hover:underline">Liên kết thẻ ngay</button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {cards.map((card) => (
                    <div
                      key={card.id}
                      onClick={() => setSelectedCardId(card.id)}
                      className={`relative flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedCardId === card.id
                        ? "border-primary bg-primary/5 dark:bg-primary/10"
                        : "border-gray-200 dark:border-slate-800 hover:border-primary/50"
                        }`}
                    >
                      {selectedCardId === card.id && (
                        <span className="absolute top-3 right-3 text-primary material-symbols-outlined">
                          check_circle
                        </span>
                      )}
                      <div className="size-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-gray-600">credit_card</span>
                      </div>
                      <div>
                        <h4 className="font-bold">{card.bankName || "Thẻ ngân hàng"}</h4>
                        <p className="text-xs text-[#648772]">
                          {card.last4 ? `•••• ${card.last4}` : card.cardNumber}
                        </p>
                        <p className="text-xs text-primary font-bold">
                          Số dư: {card.balanceCard?.toLocaleString('vi-VN')} đ
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AMOUNT INPUT */}
            <div>
              <label className="text-lg font-bold text-[#111714] dark:text-white">Nhập số tiền</label>
              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold">
                  đ
                </span>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="0"
                  className="w-full h-16 pl-9 pr-4 text-2xl font-bold border border-gray-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-slate-800 text-[#111714] dark:text-white"
                  value={amount}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (Number(val) < 0) return;
                    setAmount(val);
                  }}
                />
              </div>

              <div className="flex gap-3 mt-3 flex-wrap">
                {[50000, 100000, 200000, 500000].map((v) => (
                  <button
                    key={v}
                    type="button"
                    className="h-8 px-4 border border-gray-200 dark:border-slate-800 rounded-lg hover:border-primary hover:bg-primary/10 transition text-[#111714] dark:text-white"
                    onClick={() => handleQuickAdd(v)}
                  >
                    +{v.toLocaleString('vi-VN')} đ
                  </button>
                ))}
              </div>
            </div>
              </section>

              {/* RIGHT CHECKOUT SECTION */}
              <aside className="w-full lg:w-[380px]">
            <div className="sticky top-24 bg-white dark:bg-slate-800 border rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-6 text-[#111714] dark:text-white">Chi tiết giao dịch</h3>

              <div className="flex justify-between mb-3">
                <span className="text-[#648772] dark:text-slate-400">Số dư ví hiện tại</span>
                <strong className="text-[#111714] dark:text-white">
                  {wallet
                    ? wallet.balance?.toLocaleString("vi-VN")
                    : "..."} đ
                </strong>
              </div>

              <div className="flex justify-between mb-3">
                <span className="text-[#648772] dark:text-slate-400">Số tiền nạp</span>
                <strong className="text-[#111714] dark:text-white">
                  {Number(amount).toLocaleString("vi-VN")} đ
                </strong>
              </div>

              <hr className="my-4 border-dashed border-gray-300 dark:border-slate-800" />

              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-[#111714] dark:text-white">Tổng thanh toán</span>
                <span className="text-primary text-2xl font-black">
                  {Number(amount).toLocaleString("vi-VN")} đ
                </span>
              </div>

              <button
                className="w-full h-12 bg-primary text-white rounded-lg font-bold hover:bg-[#2dd16c] disabled:opacity-50 disabled:cursor-not-allowed transition"
                onClick={handleDeposit}
                disabled={!amount || Number(amount) <= 0 || !selectedCardId}
              >
                Xác nhận nạp tiền
              </button>
            </div>
              </aside>

            </div>
          </div>

          {/* MOVED RECENT DEPOSITS OUTSIDE FLEX ROW TO BE FULL WIDTH BELOW OR KEEP IN FLOW? 
             Original code: Inside main flex, so it was beside/below. 
             Let's put it below the 2 columns if needed, or keep in left column if space permits.
             Actually the original code had it as a sibling to LEFT/RIGHT section?? 
             No, it was inside <div className="flex ..."> but as a sibling of LEFT and RIGHT?
             Wait:
             <div className="flex ...">
               <section ...> ... </section>
               <aside ...> ... </aside>
               <div className="mt-6"> ... </div> (This is inside flex container which is flex-row. So it would be a 3rd column?)
             Let's check original logic.
             Original:
             <div className="flex ...">
                <section> LEFT </section>
                <aside> RIGHT </aside>
                <div className="mt-6"> Recent </div>  // This looks suspicious if it is 3rd col.
             </div>
             Actually, let's put Recent Deposits BELOW the columns, or inside the Left section at the bottom.
             Putting it in the Main container below the flex-row is better for mobile.
         */}

          {/* HISTORY SECTION SEPARATE FROM COLUMNS */}
          <div className="flex justify-center pb-20 px-4 md:px-10">
        <div className="max-w-[1200px] w-full">
          <h3 className="text-[#111714] dark:text-white text-xl font-bold mb-4">
            Giao dịch nạp tiền gần đây
          </h3>

          {loadingHistory ? (
            <p className="text-sm text-gray-500">Đang tải lịch sử...</p>
          ) : historyError ? (
            <p className="text-sm text-red-500">{historyError}</p>
          ) : recentDeposits.length === 0 ? (
            <p className="text-sm text-gray-500">Không tìm thấy lịch sử nạp tiền.</p>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-xl border overflow-hidden">
              {recentDeposits.map((tx) => (
                <div
                  key={tx.transactionId || tx.id} // api might return transactionId
                  className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">
                        credit_card
                      </span>
                    </div>

                    <div>
                      <p className="font-medium text-sm md:text-base">{tx.description || "Nạp từ thẻ"}</p>
                      <p className="text-xs text-[#648772]">
                        {tx.timestamp ? new Date(tx.timestamp).toLocaleString() : ""}
                      </p>
                      <p className="text-xs text-gray-400">
                        {tx.bankName} •••• {tx.cardNumber ? tx.cardNumber.slice(-4) : '****'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-primary block">
                      +{Number(tx.amount).toLocaleString("vi-VN")} đ
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${tx.status === "SUCCESS"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                    >
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DepositPage;
