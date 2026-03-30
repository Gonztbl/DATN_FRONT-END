import { useState, useEffect } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/layout/Sidebar";
import userService from "../../profile/api/userService";
import walletService from "../api/walletService";
import cardService from "../api/cardService";
import contactService from "../../../api/contactService";
import TransferService from "../api/transfer/transferService";
import qrService from "../../../api/qrService";
import { useNotification } from "../../../context/NotificationContext";
import { showSuccess, showError, showWarning, showAlert } from "../../../utils/swalUtils";
import { useTheme } from "../../../context/ThemeContext";

export default function DashboardPage() {
    const { isDarkMode, toggleDarkMode } = useTheme();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { showSuccess } = useNotification();

    const [profile, setProfile] = useState(null);
    const [wallet, setWallet] = useState(null);
    const [cards, setCards] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [transferAmount, setTransferAmount] = useState("");
    const [selectedContact, setSelectedContact] = useState(null);

    // Phone search state
    const [phoneSearch, setPhoneSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);

    const [walletSummary, setWalletSummary] = useState({ income: 0, expense: 0 });
    const [sevenDaySummary, setSevenDaySummary] = useState({ income: 0, expense: 0 });
    const [spendingData, setSpendingData] = useState([]);

    // Notification state
    const [balanceFluctuations, setBalanceFluctuations] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    // New State for Modals
    const [showAddCardModal, setShowAddCardModal] = useState(false);
    const [showTopupModal, setShowTopupModal] = useState(false);
    const [showQrScanModal, setShowQrScanModal] = useState(false);

    // QR Scanning State
    const [qrFile, setQrFile] = useState(null);
    const [qrPreview, setQrPreview] = useState(null);
    const [qrScanning, setQrScanning] = useState(false);
    const [qrResult, setQrResult] = useState(null);
    const [newCard, setNewCard] = useState({
        cardNumber: "",
        holderName: "",
        expiryDate: "",
        cvv: "",
        type: "Debit",
        bankName: ""
    });
    const [topupData, setTopupData] = useState({
        amount: "",
        sourceCardId: ""
    });

    const extractNumericId = (str) => {
        const match = str?.match(/\d+/);
        return match ? parseInt(match[0], 10) : null;
    };

    // Helper to refresh data
    // Helper to refresh data
    const refreshData = async () => {
        try {
            console.log("Fetching dashboard data...");

            // First fetch user and wallet info to get robust wallet ID
            const [currentUser, walletInfo] = await Promise.all([
                userService.getCurrentUser(),
                walletService.getWalletInfo().catch(() => null)
            ]);

            setProfile(currentUser);

            // Robust Wallet ID Resolution (same as Withdraw.jsx)
            const numericIdFromUser = currentUser?.wallet?.id;
            const numericIdFromWalletInfo = typeof walletInfo?.id === 'number' ? walletInfo.id : null;
            const numericIdFromExtraction = extractNumericId(walletInfo?.walletId);

            const walletId = numericIdFromUser ?? numericIdFromWalletInfo ?? numericIdFromExtraction;
            console.log("Resolved Wallet ID:", walletId);

            // Use Promise.allSettled to prevent one failure from blocking all data
            const results = await Promise.allSettled([
                walletService.getBalance(),
                cardService.getCards(),
                contactService.getFrequentContacts(),
                walletId ? TransferService.getTransferHistory(walletId, { page: 0, size: 50, filter: 'LAST_30_DAYS' }) : Promise.reject('No wallet ID'),
                walletService.getWalletSummary()
            ]);

            // Destructure results
            const [
                balanceStatsResult,
                cardsResult,
                contactsResult,
                transferHistoryResult,
                summaryResult
            ] = results;

            // Log errors for debugging
            results.forEach((res, index) => {
                if (res.status === 'rejected') {
                    console.error(`API call ${index} failed:`, res.reason);
                }
            });

            // Process Wallet
            let mergedWallet = { ...currentUser.wallet };
            if (balanceStatsResult.status === 'fulfilled') {
                const balanceStats = balanceStatsResult.value;
                mergedWallet.monthlyChangePercent = balanceStats.monthlyChangePercent;
                if (balanceStats.balance !== undefined && balanceStats.balance !== null) {
                    mergedWallet.balance = balanceStats.balance;
                }
            }
            console.log("Final Merged Wallet:", mergedWallet);
            setWallet(mergedWallet);

            // Process Cards
            if (cardsResult.status === 'fulfilled') {
                setCards(cardsResult.value);
            } else {
                console.warn("Cards failed to load");
            }

            // Process Contacts (fallback)
            if (contactsResult.status === 'fulfilled') {
                setContacts(contactsResult.value);
            }

            // Process Transfer History
            if (transferHistoryResult.status === 'fulfilled') {
                const historyData = transferHistoryResult.value;
                const txList = historyData.content || [];

                // CHỈ lấy các giao dịch thành công (success: true)
                const successfulTxs = txList.filter(tx => tx.success === true);

                // Set recent transactions (limit to 10 for dashboard)
                setTransactions(successfulTxs.slice(0, 10));

                // Extract all successful transactions for notifications and chart
                const fluctuations = successfulTxs.map(tx => ({
                    id: tx.id,
                    type: tx.type,
                    amount: tx.amount,
                    direction: tx.direction,
                    partnerName: tx.partnerName,
                    note: tx.note,
                    createdAt: tx.createdAt
                }));
                setBalanceFluctuations(fluctuations.slice(0, 10));

                // Extract unique recent contacts from TRANSFER_OUT transactions - CHỈ LẤY GIAO DỊCH THÀNH CÔNG
                const recentContactsMap = new Map();
                successfulTxs
                    .filter(tx => tx.direction === 'OUT' && tx.type === 'TRANSFER_OUT')
                    .forEach(tx => {
                        // Use note as identifier if available, otherwise use partnerName
                        const contactKey = tx.note || tx.partnerName;
                        if (!recentContactsMap.has(contactKey) && contactKey && contactKey !== 'Sent money') {
                            recentContactsMap.set(contactKey, {
                                id: tx.id,
                                name: tx.note || tx.partnerName,
                                avatarUrl: null,
                                phone: null,
                                userId: null,
                                lastTransactionDate: tx.createdAt,
                                amount: tx.amount
                            });
                        }
                    });

                // If no contacts from API, use transfer history contacts (limited functionality)
                if (contactsResult.status === 'rejected' && recentContactsMap.size > 0) {
                    const recentContactsList = Array.from(recentContactsMap.values()).slice(0, 5);
                    setContacts(recentContactsList);
                }

                // TÍNH TOÁN WALLET SUMMARY TỪ GIAO DỊCH THÀNH CÔNG
                const calculatedSummary = {
                    income: 0,
                    expense: 0
                };

                successfulTxs.forEach(tx => {
                    if (tx.direction === 'IN') {
                        calculatedSummary.income += tx.amount;
                    } else if (tx.direction === 'OUT') {
                        calculatedSummary.expense += tx.amount;
                    }
                });

                // Kết hợp với summary từ API (nếu có) hoặc chỉ dùng calculatedSummary
                let finalSummary = calculatedSummary;

                // Nếu muốn giữ summary từ API, comment dòng trên và sử dụng:
                // if (summaryResult.status === 'fulfilled') {
                //     finalSummary = summaryResult.value;
                // }

                setWalletSummary(finalSummary);

                // Process data for Spending Analytics (Last 7 days) - CHỈ TÍNH GIAO DỊCH THÀNH CÔNG
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                // Get last 7 days including today
                const last7DaysData = [];
                for (let i = 6; i >= 0; i--) {
                    const date = new Date(today);
                    date.setDate(date.getDate() - i);
                    last7DaysData.push({
                        date: date,
                        dayLabel: date.toLocaleDateString('vi-VN', { weekday: 'short' }),
                        spending: 0
                    });
                }

                // Calculate spending for each day (chỉ từ các giao dịch thành công)
                successfulTxs.forEach(tx => {
                    const txDate = new Date(tx.createdAt);
                    txDate.setHours(0, 0, 0, 0);

                    // Find matching day in last 7 days
                    const dayData = last7DaysData.find(d => d.date.getTime() === txDate.getTime());

                    if (dayData && tx.direction === 'OUT') {
                        dayData.spending += tx.amount;
                    }
                });

                // Convert to chart format (keeping points for a line chart)
                const chartData = last7DaysData.map(day => ({
                    label: day.dayLabel,
                    amount: day.spending
                }));

                setSpendingData(chartData);

                // Calculate 7-day summary for Donut Chart
                const last7DaysSummary = {
                    income: 0,
                    expense: 0
                };
                const sevenDaysAgo = new Date(today);
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Include today

                successfulTxs.forEach(tx => {
                    const txDate = new Date(tx.createdAt);
                    if (txDate >= sevenDaysAgo) {
                        if (tx.direction === 'IN') {
                            last7DaysSummary.income += tx.amount;
                        } else if (tx.direction === 'OUT') {
                            last7DaysSummary.expense += tx.amount;
                        }
                    }
                });
                setSevenDaySummary(last7DaysSummary);
            } else {
                // Nếu không có transfer history, vẫn xử lý summary từ API
                if (summaryResult.status === 'fulfilled') {
                    setWalletSummary(summaryResult.value);
                }
            }

        } catch (error) {
            console.error("Critical error in refreshData:", error);
        }
    };

    useEffect(() => {
        const init = async () => {
            await refreshData();
            setLoading(false);
        };
        init();
    }, []);

    // Close notification dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showNotifications && !event.target.closest('.notification-dropdown')) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showNotifications]);

    const handleLogout = () => {
        logout();
        showSuccess("Đăng xuất thành công", "Thành công");
        navigate("/login");
    };

    const handlePhoneSearch = async () => {
        if (!phoneSearch || phoneSearch.trim().length < 10) {
            showWarning("Số điện thoại không hợp lệ", "Vui lòng nhập số điện thoại hợp lệ (tối thiểu 10 chữ số)");
            return;
        }

        setSearching(true);
        try {
            const results = await TransferService.getTargetWallets(phoneSearch.trim());
            setSearchResults(results);

            if (results.length === 0) {
                showAlert("Không tìm thấy", "Không tìm thấy ví với số điện thoại này", "info");
            } else if (results.length === 1) {
                // Auto-select if only one result
                setSelectedContact({
                    userId: results[0].userId,
                    walletId: results[0].walletId,
                    fullName: results[0].fullName,
                    name: results[0].fullName,
                    phone: results[0].accountNumber
                });
            }
        } catch (error) {
            console.error("Phone search failed:", error);
            showError("Tìm kiếm thất bại", (error.response?.data?.message || error.message));
        } finally {
            setSearching(false);
        }
    };

    const handleTransfer = async () => {
        if (!selectedContact || !selectedContact.userId) {
            showWarning("Yêu cầu thông tin liên hệ", "Vui lòng chọn người liên hệ hoặc tìm kiếm bằng số điện thoại");
            return;
        }
        if (!transferAmount || isNaN(transferAmount) || parseFloat(transferAmount) <= 0) {
            showWarning("Số tiền không hợp lệ", "Vui lòng nhập số tiền hợp lệ");
            return;
        }

        try {
            const result = await TransferService.transfer({
                toUserId: parseInt(selectedContact.userId), // Convert to integer
                amount: parseFloat(transferAmount),
                note: "Quick Transfer from Dashboard"
            });

            if (result.data?.success || result.data?.status === 'COMPLETED') {
                showSuccess("Chuyển tiền thành công", `Đã gửi $${transferAmount} đến ${selectedContact.fullName || selectedContact.name}`);
                setTransferAmount("");
                setSelectedContact(null);
                setPhoneSearch("");
                setSearchResults([]);
                // Refresh data
                await refreshData();
            }
        } catch (error) {
            console.error("Transfer failed:", error);
            const errorMsg = error.response?.data?.note || error.response?.data?.message || error.message;
            showError("Chuyển tiền thất bại", errorMsg);
        }
    };

    const handleAddCardSubmit = async (e) => {
        e.preventDefault();
        try {
            await cardService.createCard(newCard);
            showSuccess("Đã thêm thẻ", "Đã thêm thẻ thành công!");
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

    const handleTopupSubmit = async (e) => {
        e.preventDefault();
        if (!topupData.amount || !topupData.sourceCardId) {
            showWarning("Thiếu thông tin", "Vui lòng nhập số tiền và chọn thẻ");
            return;
        }
        try {
            // Updated to use cardService.depositFromCard as per API requirement
            const res = await cardService.depositFromCard({
                cardId: topupData.sourceCardId,
                amount: parseFloat(topupData.amount),
                description: "Topup from Dashboard"
            });

            if (res.status === 'FAILED' || res.status === 'ERROR') {
                throw new Error(res.message || "Transaction failed");
            }

            showSuccess("Topup Successful", "Your wallet has been credited.");
            setShowTopupModal(false);
            setTopupData({ amount: "", sourceCardId: "" });

            // Refresh data
            await refreshData();
        } catch (error) {
            console.error("Topup failed:", error);
            showError("Nạp tiền thất bại", (error.response?.data?.message || error.message));
        }
    };

    // QR Scanning Handlers
    const handleQrFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setQrFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setQrPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleQrImageScan = async () => {
        if (!qrFile) {
            showWarning("Yêu cầu quét mã", "Vui lòng chọn ảnh mã QR trước");
            return;
        }

        setQrScanning(true);
        try {
            const result = await qrService.readQrImage(qrFile);

            if (!result.valid) {
                showError("Quét mã thất bại", "Mã QR không hợp lệ. Vui lòng thử ảnh khác.");
                return;
            }

            setQrResult(result);
            showSuccess("Đã quét mã QR", `Người nhận: ${result.receiverName}`);

            // Auto-populate transfer form
            setSelectedContact({
                userId: result.userId || result.walletId, // Use userId from API, fallback to walletId
                walletId: result.walletId,
                fullName: result.receiverName,
                name: result.receiverName,
                phone: result.accountNumber
            });

            // Auto-fill amount if present
            if (result.amount && result.amount > 0) {
                setTransferAmount(result.amount.toString());
            }

            // Close QR modal
            setShowQrScanModal(false);
            resetQrScanState();

        } catch (error) {
            console.error("QR scan failed:", error);
            showError("Lỗi khi quét", (error.response?.data?.message || error.message));
        } finally {
            setQrScanning(false);
        }
    };

    const resetQrScanState = () => {
        setQrFile(null);
        setQrPreview(null);
        setQrResult(null);
    };

    // Donut Chart Component
    const DonutChart = ({ income, expense, title, subtitle }) => {
        const total = income + expense;
        const incomePercent = total > 0 ? (income / total) * 100 : 0;
        const expensePercent = total > 0 ? (expense / total) * 100 : 0;
        
        // SVG circle properties
        const radius = 35;
        const circumference = 2 * Math.PI * radius;
        const incomeOffset = circumference * (1 - incomePercent / 100);
        const expenseOffset = circumference * (1 - expensePercent / 100);
        
        return (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-800 flex flex-col items-center gap-3">
                <h4 className="text-xs font-bold text-text-sub dark:text-slate-400 uppercase tracking-widest">{title}</h4>
                <div className="relative size-32">
                    <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                        {/* Background Circle */}
                        <circle
                            cx="50" cy="50" r={radius}
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth="10"
                            className="text-gray-100 dark:text-slate-700"
                        />
                        {/* Income Segment */}
                        {income > 0 && (
                            <circle
                                cx="50" cy="50" r={radius}
                                fill="transparent"
                                stroke="#36e27b"
                                strokeWidth="10"
                                strokeDasharray={circumference}
                                strokeDashoffset={incomeOffset}
                                strokeLinecap="round"
                                className="transition-all duration-1000"
                            />
                        )}
                        {/* Expense Segment */}
                        {expense > 0 && (
                            <circle
                                cx="50" cy="50" r={radius}
                                fill="transparent"
                                stroke="#ef4444"
                                strokeWidth="10"
                                strokeDasharray={circumference}
                                strokeDashoffset={expenseOffset}
                                strokeLinecap="round"
                                transform={`rotate(${(incomePercent / 100) * 360} 50 50)`}
                                className="transition-all duration-1000"
                            />
                        )}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-[10px] text-text-sub dark:text-slate-400 font-medium">Tổng thu chi</span>
                        <span className="text-xs font-bold text-text-main dark:text-white">${total.toLocaleString()}</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <div className="size-2 rounded-full bg-primary"></div>
                            <span className="text-[10px] text-text-sub dark:text-slate-400 font-medium">Thu</span>
                        </div>
                        <span className="text-xs font-bold text-green-500">${income.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col items-center border-l border-gray-100 dark:border-slate-700">
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <div className="size-2 rounded-full bg-red-500"></div>
                            <span className="text-[10px] text-text-sub dark:text-slate-400 font-medium">Chi</span>
                        </div>
                        <span className="text-xs font-bold text-red-500">${expense.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-slate-900 font-display text-text-main dark:text-white overflow-hidden">
            {/* Tailwind CDN + Config */}
            <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
            <script
                dangerouslySetInnerHTML={{
                    __html: `
            tailwind.config = {
              darkMode: "class",
              theme: {
                extend: {
                  colors: {
                    primary: "#36e27b",
                    "background-light": "#f6f8f7",
                    "background-dark": "#112217",
                    "text-main": "#111714",
                    "text-sub": "#648772",
                  },
                  fontFamily: {
                    display: ["Spline Sans", "sans-serif"]
                  },
                  borderRadius: {
                    DEFAULT: "1rem",
                    lg: "2rem",
                    xl: "3rem",
                    full: "9999px"
                  }
                }
              }
            }
          `,
                }}
            />
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Spline+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

            <div className="flex h-screen w-full">
                {/* Sidebar */}
                <Sidebar activeRoute="dashboard" />

                {/* Main Content */}
                <main className="flex-1 flex flex-col h-full overflow-y-auto bg-background-light dark:bg-slate-900 p-4 md:p-8">
                    {/* Header */}
                    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-text-main dark:text-white mb-1">Chào mừng trở lại, {profile?.fullName || user?.fullName || 'Người dùng'}! 👋</h1>
                            <p className="text-text-sub dark:text-slate-400">Đây là thông tin tài khoản của bạn hôm nay</p>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Search */}
                            <div className="hidden md:flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-full border border-gray-200 dark:border-slate-800">
                                <span className="material-symbols-outlined text-text-sub dark:text-slate-400">search</span>
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm..."
                                    className="bg-transparent border-none outline-none text-sm w-32 text-text-main dark:text-white placeholder:text-text-sub"
                                />
                            </div>
                            {/* Dark Mode Toggle */}
                            <button
                                onClick={toggleDarkMode}
                                className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center"
                                title={isDarkMode ? "Chế độ sáng" : "Chế độ tối"}
                            >
                                <span className="material-symbols-outlined transition-all">
                                    {isDarkMode ? "light_mode" : "dark_mode"}
                                </span>
                            </button>
                            {/* Notifications */}
                            <div className="relative notification-dropdown">
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="relative size-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center"
                                >
                                    <span className="material-symbols-outlined text-text-sub dark:text-slate-400">notifications</span>
                                    {balanceFluctuations.length > 0 && (
                                        <span className="absolute -top-1 -right-1 size-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800">
                                            {balanceFluctuations.length > 9 ? '9+' : balanceFluctuations.length}
                                        </span>
                                    )}
                                </button>

                                {/* Notification Dropdown */}
                                {showNotifications && (
                                    <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-800 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
                                        <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center">
                                            <div>
                                                <h3 className="font-bold text-text-main dark:text-white">Thông báo biến động</h3>
                                                <p className="text-xs text-text-sub dark:text-slate-400">Giao dịch mới nhất</p>
                                            </div>
                                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Mới</span>
                                        </div>

                                        {balanceFluctuations.length > 0 ? (
                                            <div className="divide-y divide-gray-50 dark:divide-slate-700/50">
                                                {balanceFluctuations.map((tx) => (
                                                    <div key={tx.id} className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer group">
                                                        <div className="flex items-start gap-3">
                                                            <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${tx.direction === 'IN' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                                                                <span className={`material-symbols-outlined text-lg ${tx.direction === 'IN' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                                    {tx.direction === 'IN' ? 'trending_up' : 'trending_down'}
                                                                </span>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex justify-between items-start">
                                                                    <p className="text-sm font-semibold text-text-main dark:text-white truncate group-hover:text-primary transition-colors">
                                                                        {tx.direction === 'IN' ? 'Nhận tiền' : 'Gửi tiền'}
                                                                    </p>
                                                                    <p className={`text-sm font-bold ${tx.direction === 'IN' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                                        {tx.direction === 'IN' ? '+' : '-'}${tx.amount.toLocaleString()}
                                                                    </p>
                                                                </div>
                                                                <p className="text-xs text-text-sub dark:text-slate-400 mt-0.5 truncate italic">
                                                                    "{tx.note || (tx.direction === 'IN' ? `Từ ${tx.partnerName}` : `Đến ${tx.partnerName}`)}"
                                                                </p>
                                                                <div className="flex items-center gap-1 mt-2">
                                                                    <span className="material-symbols-outlined text-[10px] text-text-sub dark:text-slate-500">schedule</span>
                                                                    <p className="text-[10px] text-text-sub dark:text-slate-500">
                                                                        {new Date(tx.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} • {new Date(tx.createdAt).toLocaleDateString('vi-VN')}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-8 text-center">
                                                <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600 mb-2">notifications_off</span>
                                                <p className="text-sm text-text-sub dark:text-slate-400">Không có thông báo mới</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center justify-center size-10 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 transition-colors group"
                                title="Đăng xuất"
                            >
                                <span className="material-symbols-outlined text-text-sub dark:text-slate-400 group-hover:text-red-500">logout</span>
                            </button>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Left Column */}
                        <div className="lg:col-span-8 flex flex-col gap-6">
                            {/* Balance Card */}
                            <div className="bg-gradient-to-br from-primary via-emerald-400 to-teal-400 dark:from-primary/90 dark:via-emerald-500/90 dark:to-teal-500/90 rounded-xl p-8 text-text-main shadow-lg shadow-primary/20">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <p className="text-sm opacity-80 mb-2">Tổng số dư</p>
                                        <h2 className="text-4xl font-bold">${(wallet?.availableBalance ?? wallet?.balance)?.toLocaleString() || '0.00'}</h2>
                                        <p className="text-xs opacity-70 mt-2 font-mono">Acc: {user?.phone || user?.username || '@user'}</p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="material-symbols-outlined text-3xl mb-1">account_balance</span>
                                        {wallet?.monthlyChangePercent && (
                                            <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${wallet.monthlyChangePercent >= 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                {wallet.monthlyChangePercent >= 0 ? '+' : ''}{wallet.monthlyChangePercent}%
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-lg p-4">
                                        <p className="text-xs opacity-80 mb-1">Thu nhập</p>
                                        <p className="text-lg font-semibold text-white">+$
                                            {walletSummary.income?.toLocaleString() || '0'}
                                        </p>
                                    </div>
                                    <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-lg p-4">
                                        <p className="text-xs opacity-80 mb-1">Chi tiêu</p>
                                        <p className="text-lg font-semibold text-white">-$
                                            {walletSummary.expense?.toLocaleString() || '0'}
                                        </p>
                                    </div>
                                    <button onClick={() => setShowTopupModal(true)} className="flex-1 bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm rounded-lg p-4 flex flex-col justify-center items-center gap-1 group">
                                        <span className="material-symbols-outlined group-hover:scale-110 transition-transform">add_card</span>
                                        <span className="text-sm font-semibold">Nạp tiền</span>
                                    </button>
                                    <button onClick={() => navigate('/receive-money')} className="flex-1 bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm rounded-lg p-4 flex flex-col justify-center items-center gap-1 group">
                                        <span className="material-symbols-outlined group-hover:scale-110 transition-transform">qr_code_scanner</span>
                                        <span className="text-sm font-semibold">Nhận tiền</span>
                                    </button>
                                </div>
                            </div>

                            {/* Chart */}
                            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-100 dark:border-slate-800">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-semibold text-text-main dark:text-white">Phân tích chi tiêu</h3>
                                    <select className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-800 text-text-main dark:text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer">
                                        <option>7 ngày qua</option>
                                        <option disabled>30 ngày qua (Sắp có)</option>
                                    </select>
                                </div>

                                <div className="h-64 relative mt-4">
                                    {spendingData.length > 0 ? (
                                        <>
                                            {/* Premium SVG Area Chart */}
                                            <svg className="w-full h-full overflow-visible" viewBox="0 0 700 250" preserveAspectRatio="none">
                                                <defs>
                                                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#36e27b" stopOpacity="0.4" />
                                                        <stop offset="100%" stopColor="#36e27b" stopOpacity="0" />
                                                    </linearGradient>
                                                </defs>

                                                {/* Grid Lines */}
                                                {[0, 1, 2, 3, 4].map(i => (
                                                    <line
                                                        key={i}
                                                        x1="0"
                                                        y1={i * 62.5}
                                                        x2="700"
                                                        y2={i * 62.5}
                                                        stroke="currentColor"
                                                        className="text-gray-100 dark:text-slate-700/50"
                                                        strokeWidth="1"
                                                    />
                                                ))}

                                                {/* Line & Area Path */}
                                                {(() => {
                                                    const maxAmount = Math.max(...spendingData.map(d => d.amount), 1);
                                                    const points = spendingData.map((d, i) => ({
                                                        x: (i / (spendingData.length - 1)) * 700,
                                                        y: 250 - (d.amount / maxAmount) * 200 - 25
                                                    }));

                                                    const pathD = points.reduce((acc, p, i) =>
                                                        i === 0 ? `M 0,${p.y}` : `${acc} L ${p.x},${p.y}`
                                                        , "");

                                                    const areaD = `${pathD} L 700,250 L 0,250 Z`;

                                                    return (
                                                        <>
                                                            <path d={areaD} fill="url(#chartGradient)" />
                                                            <path d={pathD} fill="none" stroke="#36e27b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

                                                            {/* Data Points */}
                                                            {points.map((p, i) => (
                                                                <g key={i} className="group/dot">
                                                                    <circle
                                                                        cx={p.x}
                                                                        cy={p.y}
                                                                        r="6"
                                                                        fill="#36e27b"
                                                                        className="drop-shadow-md cursor-pointer transition-all group-hover/dot:r-8"
                                                                    />
                                                                    <circle
                                                                        cx={p.x}
                                                                        cy={p.y}
                                                                        r="10"
                                                                        fill="#36e27b"
                                                                        fillOpacity="0.2"
                                                                        className="group-hover/dot:fill-opacity-40 transition-all"
                                                                    />
                                                                </g>
                                                            ))}
                                                        </>
                                                    );
                                                })()}
                                            </svg>

                                            {/* X-Axis Labels */}
                                            <div className="flex justify-between mt-4">
                                                {spendingData.map((day, i) => (
                                                    <div key={i} className="flex flex-col items-center group relative cursor-help">
                                                        <span className="text-[10px] text-text-sub dark:text-slate-400 font-medium">{day.label}</span>
                                                        <span className="text-[11px] text-text-main dark:text-white font-bold">${day.amount.toLocaleString()}</span>
                                                        
                                                        {/* Tooltip on hover for extra focus */}
                                                        <span className="text-[11px] text-text-main dark:text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 bg-gray-900 px-2 py-1 rounded shadow-xl whitespace-nowrap z-20">
                                                            Chi tiêu: ${day.amount.toLocaleString()}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center py-8">
                                            <div className="size-20 bg-gray-50 dark:bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
                                                <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600">bar_chart</span>
                                            </div>
                                            <p className="text-sm font-medium text-text-main dark:text-white">Không có dữ liệu chi tiêu</p>
                                            <p className="text-xs text-text-sub dark:text-slate-500 mt-1">Phân tích sẽ được hiển thị sau khi bạn giao dịch</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Recent Transactions - Improved Table Style */}
                            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">history</span>
                                        <h3 className="text-lg font-semibold text-text-main dark:text-white">Lịch sử giao dịch</h3>
                                    </div>
                                    <button
                                        onClick={() => navigate('/transfer-history')}
                                        className="text-xs font-bold text-primary hover:bg-primary/10 px-4 py-2 rounded-full transition-all border border-primary/20"
                                    >
                                        Xem tất cả
                                    </button>
                                </div>

                                <div className="overflow-x-auto -mx-6 px-6">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-gray-50 dark:border-slate-700/50">
                                                <th className="pb-4 text-xs font-bold text-text-sub dark:text-slate-500 uppercase tracking-wider">Giao dịch</th>
                                                <th className="pb-4 text-xs font-bold text-text-sub dark:text-slate-500 uppercase tracking-wider">Ngày</th>
                                                <th className="pb-4 text-xs font-bold text-text-sub dark:text-slate-500 uppercase tracking-wider">Loại</th>
                                                <th className="pb-4 text-xs font-bold text-text-sub dark:text-slate-500 uppercase tracking-wider text-right">Số tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
                                            {transactions.length > 0 ? transactions.map((tx, i) => (
                                                <tr key={tx.id || i} className="group hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer">
                                                    <td className="py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${tx.direction === 'IN' ? 'bg-green-50 dark:bg-green-900/20 text-green-500' : 'bg-red-50 dark:bg-red-900/20 text-red-500'}`}>
                                                                <span className="material-symbols-outlined text-xl">
                                                                    {tx.type.includes('TRANSFER') ? 'swap_horiz' : tx.type.includes('DEPOSIT') ? 'add_circle' : 'do_not_disturb_on'}
                                                                </span>
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-semibold text-text-main dark:text-white truncate">
                                                                    {tx.partnerName || (tx.direction === 'IN' ? 'Nhận tiền' : 'Gửi tiền')}
                                                                </p>
                                                                <p className="text-[11px] text-text-sub dark:text-slate-500 truncate italic">
                                                                    {tx.note || 'Không có ghi chú'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 whitespace-nowrap">
                                                        <p className="text-xs text-text-main dark:text-white font-medium">
                                                            {new Date(tx.createdAt).toLocaleDateString('vi-VN')}
                                                        </p>
                                                        <p className="text-[10px] text-text-sub dark:text-slate-500">
                                                            {new Date(tx.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </td>
                                                    <td className="py-4">
                                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${tx.direction === 'IN' ? 'bg-green-100/50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100/50 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                            {tx.type}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 text-right">
                                                        <p className={`text-sm font-bold ${tx.direction === 'IN' ? 'text-green-500' : 'text-red-500'}`}>
                                                            {tx.direction === 'IN' ? '+' : '-'}${tx.amount.toLocaleString()}
                                                        </p>
                                                    </td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="4" className="py-8 text-center text-text-sub dark:text-slate-500">
                                                        Không có giao dịch nào
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="lg:col-span-4 flex flex-col gap-6">
                            {/* My Cards */}
                            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-100 dark:border-slate-800">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-text-main dark:text-white">Thẻ của tôi</h3>
                                    <button onClick={() => setShowAddCardModal(true)} className="text-sm text-primary hover:text-primary/80 transition-colors">+ Thêm</button>
                                </div>
                                <div className="space-y-3">
                                    {cards.length > 0 ? cards.map((card, index) => (
                                        <div key={card.id || index} className={`bg-gradient-to-br ${index === 0 ? 'from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black text-white' : 'from-primary to-emerald-400 dark:from-primary/90 dark:to-emerald-500/90 text-text-main'} rounded-xl p-5 relative overflow-hidden`}>
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                                            <div className="relative z-10">
                                                <p className="text-xs opacity-70 mb-1">Thẻ {card.type}</p>
                                                <p className="text-2xl font-bold mb-6">**** {card.last4}</p>
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <p className="text-xs opacity-70 mb-1">Chủ thẻ</p>
                                                        <p className="text-sm font-mono">{card.holderName}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs opacity-70 mb-1">Ngân hàng</p>
                                                        <p className="text-sm">{card.bankName}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="text-center text-text-sub">Chưa có thẻ liên kết</p>
                                    )}
                                </div>
                            </div>

                            {/* Quick Transfer */}
                            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-100 dark:border-slate-800">
                                <h3 className="text-lg font-semibold text-text-main dark:text-white mb-4">Chuyển khoản nhanh</h3>
                                <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                                    {contacts.length > 0 ? contacts.map((contact, i) => (
                                        <div
                                            key={contact.userId || contact.id || i}
                                            className="flex flex-col items-center gap-2 cursor-pointer group min-w-[70px]"
                                            onClick={() => setSelectedContact(contact)}
                                        >

                                            {/* Phone number if available */}
                                            {contact.phone && (
                                                <p className="text-[10px] text-text-sub dark:text-gray-500 truncate w-full text-center">
                                                    {contact.phone}
                                                </p>
                                            )}
                                        </div>
                                    )) : (
                                        <div className="w-full text-center py-4"></div>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    {/* QR Scan Button */}
                                    <button
                                        onClick={() => setShowQrScanModal(true)}
                                        className="w-full bg-gradient-to-r from-primary to-emerald-400 hover:from-primary/90 hover:to-emerald-400/90 text-text-main font-medium py-3 rounded-lg transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">qr_code_scanner</span>
                                        Quét mã QR
                                    </button>

                                    {/* Divider */}
                                    <div className="flex items-center gap-3 my-4">
                                        <div className="flex-1 h-px bg-gray-200 dark:bg-slate-800"></div>
                                        <span className="text-xs text-text-sub dark:text-slate-400">HOẶC</span>
                                        <div className="flex-1 h-px bg-gray-200 dark:bg-slate-800"></div>
                                    </div>

                                    {/* Phone Search */}
                                    <div>
                                        <label className="text-sm text-text-sub dark:text-slate-400 mb-2 block">Tìm kiếm bằng số điện thoại</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="tel"
                                                value={phoneSearch}
                                                onChange={(e) => setPhoneSearch(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handlePhoneSearch()}
                                                placeholder="Nhập số điện thoại"
                                                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-800 text-text-main dark:text-white outline-none focus:ring-2 focus:ring-primary/50"
                                            />
                                            <button
                                                onClick={handlePhoneSearch}
                                                disabled={searching || !phoneSearch}
                                                className="px-4 py-3 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-text-main font-medium rounded-lg transition-all"
                                            >
                                                {searching ? (
                                                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                                ) : (
                                                    <span className="material-symbols-outlined">search</span>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Search Results */}
                                    {searchResults.length > 0 && (
                                        <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-800">
                                            <p className="text-xs text-text-sub dark:text-slate-400 mb-2">Kết quả tìm kiếm:</p>
                                            <div className="space-y-2">
                                                {searchResults.map((result) => (
                                                    <div
                                                        key={result.walletId}
                                                        onClick={() => {
                                                            setSelectedContact({
                                                                userId: result.userId,
                                                                walletId: result.walletId,
                                                                fullName: result.fullName,
                                                                name: result.fullName,
                                                                phone: result.accountNumber
                                                            });
                                                            setSearchResults([]);
                                                        }}
                                                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${selectedContact?.userId === result.userId
                                                            ? 'bg-primary/20 border-2 border-primary'
                                                            : 'bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
                                                            }`}
                                                    >
                                                        <div className="size-10 rounded-full bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center text-text-main font-bold">
                                                            {result.fullName[0].toUpperCase()}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-text-main dark:text-white">{result.fullName}</p>
                                                            <p className="text-xs text-text-sub dark:text-slate-400">{result.accountNumber}</p>
                                                        </div>
                                                        {selectedContact?.userId === result.userId && (
                                                            <span className="material-symbols-outlined text-primary">check_circle</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Selected Contact Display */}
                                    {selectedContact && selectedContact.userId && (
                                        <div className="bg-primary/10 border-2 border-primary rounded-lg p-3">
                                            <p className="text-xs text-text-sub dark:text-slate-400 mb-1">Gửi đến:</p>
                                            <div className="flex items-center gap-2">
                                                <div className="size-8 rounded-full bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center text-text-main font-bold text-sm">
                                                    {(selectedContact.fullName || selectedContact.name)[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-text-main dark:text-white">{selectedContact.fullName || selectedContact.name}</p>
                                                    {selectedContact.phone && (
                                                        <p className="text-xs text-text-sub dark:text-slate-400">{selectedContact.phone}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div>
                                        <label className="text-sm text-text-sub dark:text-slate-400 mb-2 block">Số tiền</label>
                                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800 rounded-lg px-4 py-3 border border-gray-200 dark:border-slate-800">
                                            <span className="text-text-main dark:text-white font-medium">$</span>
                                            <input
                                                type="number"
                                                value={transferAmount}
                                                onChange={(e) => setTransferAmount(e.target.value)}
                                                placeholder="0.00"
                                                className="bg-transparent border-none outline-none flex-1 text-text-main dark:text-white"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleTransfer}
                                        disabled={!selectedContact || !transferAmount}
                                        className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-text-main font-medium py-3 rounded-lg transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
                                    >
                                        Gửi {transferAmount ? `$${transferAmount}` : 'tiền'}
                                    </button>
                                </div>
                            </div>

                            {/* Donut Charts Section */}
                            <div className="grid grid-cols-2 gap-4">
                                <DonutChart 
                                    income={sevenDaySummary.income} 
                                    expense={sevenDaySummary.expense} 
                                    title="7 Ngày Qua" 
                                />
                                <DonutChart 
                                    income={walletSummary.income} 
                                    expense={walletSummary.expense} 
                                    title="Tổng quan" 
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            {/* Modals */}
            {showAddCardModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl border border-gray-100 dark:border-slate-800">
                        <h3 className="text-xl font-bold mb-4 text-text-main dark:text-white">Thêm thẻ mới</h3>
                        <form onSubmit={handleAddCardSubmit} className="flex flex-col gap-4">
                            <input
                                placeholder="Số thẻ"
                                className="form-input rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3"
                                value={newCard.cardNumber}
                                onChange={e => setNewCard({ ...newCard, cardNumber: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Tên chủ thẻ"
                                className="form-input rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3"
                                value={newCard.holderName}
                                onChange={e => setNewCard({ ...newCard, holderName: e.target.value })}
                                required
                            />
                            <div className="flex gap-4">
                                <input
                                    placeholder="Ngày hết hạn (MM/YY)"
                                    className="form-input rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 flex-1"
                                    value={newCard.expiryDate}
                                    onChange={e => setNewCard({ ...newCard, expiryDate: e.target.value })}
                                    required
                                />
                                <input
                                    placeholder="CVV"
                                    className="form-input rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 w-24"
                                    value={newCard.cvv}
                                    onChange={e => setNewCard({ ...newCard, cvv: e.target.value })}
                                    required
                                />
                            </div>
                            <select
                                className="form-select rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3"
                                value={newCard.type}
                                onChange={e => setNewCard({ ...newCard, type: e.target.value })}
                            >
                                <option value="Debit">Debit</option>
                                <option value="Credit">Credit</option>
                            </select>
                            <input
                                placeholder="Tên ngân hàng"
                                className="form-input rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3"
                                value={newCard.bankName}
                                onChange={e => setNewCard({ ...newCard, bankName: e.target.value })}
                                required
                            />
                            <div className="flex gap-3 justify-end mt-4">
                                <button type="button" onClick={() => setShowAddCardModal(false)} className="px-5 py-2.5 rounded-xl text-text-sub hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors">Hủy</button>
                                <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary text-text-main font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">Thêm thẻ</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showTopupModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl border border-gray-100 dark:border-slate-800">
                        <h3 className="text-xl font-bold mb-4 text-text-main dark:text-white">Nạp tiền vào ví</h3>
                        <form onSubmit={handleTopupSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Số tiền</label>
                                <input
                                    type="number"
                                    placeholder="Nhập số tiền"
                                    className="w-full form-input rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3"
                                    value={topupData.amount}
                                    onChange={e => setTopupData({ ...topupData, amount: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Thẻ nguồn</label>
                                <select
                                    className="w-full form-select rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3"
                                    value={topupData.sourceCardId}
                                    onChange={e => setTopupData({ ...topupData, sourceCardId: e.target.value })}
                                    required
                                >
                                    <option value="">Chọn thẻ</option>
                                    {cards.map(card => (
                                        <option key={card.id} value={card.id}>{card.bankName} - {card.last4}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-3 justify-end mt-4">
                                <button type="button" onClick={() => setShowTopupModal(false)} className="px-5 py-2.5 rounded-xl text-text-sub hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors">Hủy</button>
                                <button type="submit" disabled={!topupData.sourceCardId} className="px-5 py-2.5 rounded-xl bg-primary text-text-main font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all disabled:opacity-50">Nạp tiền</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* QR Scan Modal */}
            {showQrScanModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl border border-gray-100 dark:border-slate-800">
                        <h3 className="text-xl font-bold mb-4 text-text-main dark:text-white">Quét mã QR</h3>

                        <div className="space-y-4">
                            {/* File Input */}
                            <div className="border-2 border-dashed border-gray-300 dark:border-slate-800 rounded-xl p-6 text-center">
                                {qrPreview ? (
                                    <div className="space-y-3">
                                        <img src={qrPreview} alt="Xem trước QR" className="max-h-48 mx-auto rounded-lg" />
                                        <button
                                            onClick={() => {
                                                setQrFile(null);
                                                setQrPreview(null);
                                            }}
                                            className="text-sm text-red-500 hover:text-red-600"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                ) : (
                                    <label className="cursor-pointer block">
                                        <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-2 block">upload_file</span>
                                        <p className="text-sm text-text-sub dark:text-slate-400 mb-2">Nhấn để tải lên ảnh mã QR</p>
                                        <p className="text-xs text-text-sub dark:text-gray-500">PNG, JPG tối đa 10MB</p>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleQrFileSelect}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>

                            {/* Scan Button */}
                            <button
                                onClick={handleQrImageScan}
                                disabled={!qrFile || qrScanning}
                                className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-text-main font-medium py-3 rounded-lg transition-all shadow-md shadow-primary/20"
                            >
                                {qrScanning ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                        Đang quét...
                                    </span>
                                ) : (
                                    "Quét mã QR"
                                )}
                            </button>

                            {/* Cancel Button */}
                            <button
                                onClick={() => {
                                    setShowQrScanModal(false);
                                    resetQrScanState();
                                }}
                                className="px-5 py-2.5 rounded-xl text-text-sub hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}