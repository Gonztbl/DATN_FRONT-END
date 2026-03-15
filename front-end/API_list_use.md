# Danh sách các API đang được sử dụng ở Front-end

Báo cáo tổng hợp các endpoint API được gọi từ mã nguồn front-end, bao gôm các dịch vụ trong `src/services` và các lệnh gọi trực tiếp trong component.

## 1. Thông tin chung
- **Base URL chính:** `http://localhost:8080` (Cấu hình tại `src/services/apiClient.js`)
- **Phương thức xác thực:** Bearer Token (JWT stored in localStorage)

---

## 2. Chi tiết các API theo Module

### 🔐 Authentication & User Profile
| STT | Endpoint | Method | Service/File | Mô tả |
|:---:|:---|:---:|:---|:---|
| 1 | `/api/auth/register` | `POST` | `registerService.js` | Đăng ký tài khoản mới |
| 2 | `/api/user/profile` | `GET` | `userService.js` | Lấy thông tin profile người dùng |
| 3 | `/api/user/profile` | `PUT` | `userService.js` | Cập nhật profile người dùng |
| 4 | `/api/user/profile/avatar` | `PUT` | `userService.js` | Cập nhật ảnh đại diện |
| 5 | `/api/me` | `GET` | `userService.js`, `profileService.js` | Lấy thông tin người dùng và ví hiện tại |

### 👥 User Management (Admin)
| STT | Endpoint | Method | Service/File | Mô tả |
|:---:|:---|:---:|:---|:---|
| 1 | `/api/userManager/all` | `GET` | `userManageService.js` | Lấy danh sách tất cả người dùng |
| 2 | `/api/userManager/lock/{id}` | `PUT` | `userManageService.js` | Khóa tài khoản người dùng |
| 3 | `/api/userManager/unlock/{id}` | `PUT` | `userManageService.js` | Mở khóa tài khoản người dùng |
| 4 | `/api/userManager/update/{id}` | `PUT` | `userManageService.js` | Cập nhật thông tin người dùng |

### 💳 Wallet & Card Operations
| STT | Endpoint | Method | Service/File | Mô tả |
|:---:|:---|:---:|:---|:---|
| 1 | `/api/wallet/balance` | `GET` | `walletService.js` | Lấy số dư ví |
| 2 | `/api/wallet/me` | `GET` | `walletService.js` | Lấy thông tin chi tiết ví cá nhân |
| 3 | `/api/wallet/summary` | `GET` | `walletService.js` | Lấy báo cáo thu chi |
| 4 | `/api/E-Wallet/deposits` | `POST` | `depositService.js` | Nạp tiền vào ví |
| 5 | `/api/E-Wallet/deposits/wallet/{id}` | `GET` | `depositService.js` | Lấy thông tin ví theo ID |
| 6 | `/api/E-Wallet/deposits/wallet-by-username/{user}` | `GET` | `depositService.js` | Tìm ví theo username |
| 7 | `/api/user/E-Wallet/transfers` | `POST` | `transferService.js` | Thực hiện chuyển tiền |
| 8 | `/api/user/E-Wallet/transfers/wallet/{id}/history`| `GET` | `transferService.js` | Lịch sử chuyển tiền |
| 9 | `/api/cards` | `GET` | `cardService.js` | Lấy danh sách thẻ liên kết |
| 10 | `/api/cards` | `POST` | `cardService.js` | Thêm thẻ mới |
| 11 | `/api/cards/deposit` | `POST` | `cardService.js` | Nạp tiền từ thẻ |
| 12 | `/api/wallets/${id}/withdraw` | `POST` | `Withdraw.jsx` | Rút tiền về tài khoản ngân hàng |

### 📑 Transactions & Analytics
| STT | Endpoint | Method | Service/File | Mô tả |
|:---:|:---|:---:|:---|:---|
| 1 | `/api/transactions` | `GET` | `transactionService.js` | Lịch sử giao dịch |
| 2 | `/api/transactions/transfer` | `POST` | `transactionService.js` | Chuyển khoản (legacy/tương tự transfer service) |
| 3 | `/api/transactions/incoming` | `GET` | `transactionService.js` | Các giao dịch nhận tiền gần đây |
| 4 | `/api/analytics/spending` | `GET` | `transactionService.js` | Phân tích chi tiêu |
| 5 | `/api/admin/transactions` | `GET` | `transactionService.js` | Quản lý tất cả giao dịch (Admin) |

### 🔍 QR Code Services
| STT | Endpoint | Method | Service/File | Mô tả |
|:---:|:---|:---:|:---|:---|
| 1 | `/api/qr/wallet` | `GET` | `qrService.js` | Lấy mã QR ví cá nhân |
| 2 | `/api/qr/wallet/with-amount` | `POST` | `qrService.js` | Tạo mã QR với số tiền cụ thể |
| 3 | `/api/qr/wallet/download` | `GET` | `qrService.js` | Tải ảnh mã QR |
| 4 | `/api/qr/read-image` | `POST` | `qrService.js` | Giải mã QR từ file ảnh |
| 5 | `/api/qr/resolve` | `POST` | `qrService.js` | Xử lý nội dung mã QR |

### 🍴 Restaurant & Product Management (Admin)
| STT | Endpoint | Method | Service/File | Mô tả |
|:---:|:---|:---:|:---|:---|
| 1 | `/api/admin/restaurants` | `GET` | `restaurantService.js` | Danh sách nhà hàng |
| 2 | `/api/admin/restaurants` | `POST` | `restaurantService.js` | Thêm nhà hàng mới |
| 3 | `/api/admin/products` | `GET` | `productService.js` | Danh sách sản phẩm/món ăn |
| 4 | `/api/admin/categories` | `GET` | `vendorService.js` | Danh sách danh mục món ăn |

### 🛒 Shopping (User)
| STT | Endpoint | Method | Service/File | Mô tả |
|:---:|:---|:---:|:---|:---|
| 1 | `/api/categories` | `GET` | `shoppingService.js` | Lấy danh mục cho khách hàng |
| 2 | `/api/products` | `GET` | `shoppingService.js` | Lấy danh sách sản phẩm |
| 3 | `/api/products/{id}/reviews`| `GET` | `shoppingService.js` | Lấy đánh giá sản phẩm |
| 4 | `/api/orders` | `POST` | `shoppingService.js` | Đặt hàng |

### 🤖 External Services
| STT | Endpoint | Method | File | Mô tả |
|:---:|:---|:---:|:---|:---|
| 1 | `https://messenger-rag-bot-2.../api/chat` | `POST` | `LandingPage.jsx` | Chatbot tư vấn khách hàng |

---
**Ghi chú:** Danh sách này được tự động tổng hợp từ việc phân tích mã nguồn Front-end.
