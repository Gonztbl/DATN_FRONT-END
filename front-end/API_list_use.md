# Danh sách các API đang được sử dụng ở Front-end

Báo cáo tổng hợp các endpoint API được gọi từ mã nguồn front-end, bao gồm các dịch vụ trong `src/features/**/api` và các dịch vụ xác thực.

## 1. Thông tin chung
- **Base URL chính:** `http://localhost:8080` (Cấu hình tại `src/api/apiClient.js`)
- **Phương thức xác thực:** Bearer Token (JWT stored in localStorage)

---

## 2. Chi tiết các API theo Module

### 🔐 Authentication & User Profile
| STT | Endpoint | Method | Service/File | Mô tả |
|:---:|:---|:---:|:---|:---|
| 1 | `/api/auth/login` | `POST` | `authService.js` | Đăng nhập hệ thống |
| 2 | `/api/auth/register` | `POST` | `registerService.js` | Đăng ký tài khoản người dùng |
| 3 | `/api/auth/admin/register` | `POST` | `registerService.js` | Admin đăng ký tài khoản (Merchant/Shipper) |
| 4 | `/api/user/profile` | `GET/PUT` | `userService.js` | Lấy/Cập nhật profile người dùng |
| 5 | `/api/user/profile/avatar` | `PUT` | `userService.js` | Cập nhật ảnh đại diện (Base64) |
| 6 | `/api/me` | `GET` | `userService.js` | Lấy thông tin phiên đăng nhập & ví |

### 🎭 Face Biometrics (Sinh trắc học)
| STT | Endpoint | Method | Service/File | Mô tả |
|:---:|:---|:---:|:---|:---|
| 1 | `/api/face/register` | `POST` | `faceService.js` | Đăng ký khuôn mặt (Multi-pose) |
| 2 | `/api/face/verify` | `POST` | `faceService.js` | Xác thực khuôn mặt (Login/Transfer) |
| 3 | `/api/face/list/{userId}` | `GET` | `faceService.js` | Danh sách các embedding đã đăng ký |
| 4 | `/api/face/{embeddingId}` | `DELETE` | `faceService.js` | Xóa dữ liệu khuôn mặt |
| 5 | `/api/face/compare` | `POST` | `faceService.js` | So sánh 2 ảnh khuôn mặt |

### 🛡️ AI Fraud & Security
| STT | Endpoint | Method | Service/File | Mô tả |
|:---:|:---|:---:|:---|:---|
| 1 | `/api/v1/admin/fraud-alerts` | `GET` | `fraudAdminService.js` | Lấy danh sách cảnh báo gian lận |
| 2 | `/api/v1/admin/fraud-alerts/stats` | `GET` | `fraudAdminService.js` | Thống kê tình hình gian lận AI |
| 3 | `/api/v1/transfer/check-fraud` | `POST` | `transactionService.js` | Kiểm tra rủi ro trước khi chuyển tiền |

### 💰 Vay Vốn (Loans)
| STT | Endpoint | Method | Service/File | Mô tả |
|:---:|:---|:---:|:---|:---|
| 1 | `/api/v1/loans/apply` | `POST` | `loanService.js` | Gửi đơn đăng ký vay vốn (AI Scoring) |
| 2 | `/api/v1/loans/my-loans` | `GET` | `loanService.js` | Danh sách khoản vay cá nhân |
| 3 | `/api/v1/admin/loans/all` | `GET` | `adminLoanService.js` | Quản lý toàn bộ đơn vay (Admin) |
| 4 | `/api/v1/admin/loans/{id}/approve` | `POST` | `adminLoanService.js` | Phê duyệt khoản vay |

### 💳 Wallet & Bank Operations
| STT | Endpoint | Method | Service/File | Mô tả |
|:---:|:---|:---:|:---|:---|
| 1 | `/api/wallet/me` | `GET` | `walletService.js` | Lấy thông tin ví cá nhân |
| 2 | `/api/wallet/summary` | `GET` | `walletService.js` | Báo cáo thu chi tổng hợp |
| 3 | `/api/cards` | `GET/POST` | `cardService.js` | Quản lý thẻ ngân hàng liên kết |
| 4 | `/api/cards/deposit` | `POST` | `cardService.js` | Nạp tiền từ thẻ vào ví |
| 5 | `/api/transactions/transfer` | `POST` | `transactionService.js` | Chuyển tiền P2P |

### 🚚 Shipper (Tài xế giao hàng)
| STT | Endpoint | Method | Service/File | Mô tả |
|:---:|:---|:---:|:---|:---|
| 1 | `/api/shipper/orders` | `GET` | `shipperApi.js` | Danh sách đơn hàng chờ shipper |
| 2 | `/api/shipper/orders/{id}/status` | `PUT` | `shipperApi.js` | Cập nhật trạng thái (Picked up/Delivered) |
| 3 | `/api/shipper/status` | `PUT` | `shipperApi.js` | Bật/Tắt trạng thái hoạt động |

### 👨‍🍳 Merchant / Restaurant Owner
| STT | Endpoint | Method | Service/File | Mô tả |
|:---:|:---|:---:|:---|:---|
| 1 | `/api/restaurant-owner/my-restaurant` | `GET` | `merchantDashboardService.js` | Thông tin nhà hàng của tôi |
| 2 | `/api/restaurant-owner/products` | `GET/POST/PUT` | `merchantProductService.js` | Quản lý thực đơn (Món ăn) |
| 3 | `/api/restaurant-owner/orders` | `GET` | `merchantOrderService.js` | Quản lý đơn hàng đang chờ |

### 🛒 Shopping & Orders (User)
| STT | Endpoint | Method | Service/File | Mô tả |
|:---:|:---|:---:|:---|:---|
| 1 | `/api/categories` | `GET` | `shoppingService.js` | Lấy danh mục món ăn |
| 2 | `/api/products` | `GET` | `shoppingService.js` | Danh sách sản phẩm khả dụng |
| 3 | `/api/orders` | `POST` | `shoppingService.js` | Đặt hàng mới |
| 4 | `/api/orders` | `GET` | `shoppingService.js` | Lịch sử đơn hàng cá nhân |

---
**Ghi chú:** Danh sách này được cập nhật dựa trên cấu trúc thực tế của thư mục `src/features/**/api` và `src/features/auth/services`. (Cập nhật: 24/04/2026)
