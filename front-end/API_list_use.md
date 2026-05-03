# Danh sách các API đang được sử dụng ở Front-end

Báo cáo tổng hợp toàn bộ các endpoint API được gọi từ mã nguồn front-end, rà soát 100% từ các file `.jsx` và các service trong `src/features/**/api`, `src/services`, và `src/api`.

---

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

### 💰 E-Wallet & Transactions (User)
| STT | Endpoint | Method | Service/File | Mô tả |
|:---:|:---|:---:|:---|:---|
| 1 | `/api/wallet/me` | `GET` | `walletService.js` | Lấy thông tin ví cá nhân |
| 2 | `/api/wallet/balance` | `GET` | `walletService.js` | Lấy số dư ví nhanh |
| 3 | `/api/wallet/summary` | `GET` | `walletService.js` | Báo cáo thu chi tổng hợp |
| 4 | `/api/transactions` | `GET` | `transactionService.js` | Lịch sử giao dịch tổng quát |
| 5 | `/api/transactions/incoming` | `GET` | `transactionService.js` | Danh sách giao dịch nhận tiền gần đây |
| 6 | `/api/analytics/spending` | `GET` | `transactionService.js` | Phân tích chi tiêu theo hạng mục |
| 7 | `/api/cards` | `GET/POST` | `cardService.js` | Quản lý thẻ ngân hàng liên kết |
| 8 | `/api/cards/deposit` | `POST` | `cardService.js` | Nạp tiền từ thẻ vào ví |
| 9 | `/api/cards/deposit/history` | `GET` | `cardService.js` | Lịch sử nạp tiền từ thẻ |
| 10 | `/api/cards/withdraw/history` | `GET` | `cardService.js` | Lịch sử rút tiền về thẻ |
| 11 | `/api/bank-account` | `GET` | `bankAccountService.js` | Lấy danh sách tài khoản ngân hàng theo userId |
| 12 | `/api/user/E-Wallet/transfers` | `POST` | `transferService.js` | Thực hiện chuyển tiền P2P |
| 13 | `/api/user/E-Wallet/transfers/confirm`| `POST` | `transferService.js` | Xác nhận chuyển tiền sau FaceID |
| 14 | `/api/user/E-Wallet/transfers/wallet/{id}/history` | `GET` | `transferService.js` | Lịch sử chuyển tiền của ví |
| 15 | `/api/user/E-Wallet/transfers/{id}` | `GET` | `transferService.js` | Chi tiết một giao dịch chuyển tiền |
| 16 | `/api/user/E-Wallet/transfers/wallets/search` | `GET` | `transferService.js` | Tìm kiếm ví đích theo số điện thoại |
| 17 | `/api/E-Wallet/deposits` | `POST` | `depositService.js` | Nạp tiền vào ví (General) |
| 18 | `/api/E-Wallet/deposits/wallet/{id}`| `GET` | `depositService.js` | Lấy ví theo ID để nạp tiền |
| 19 | `/api/contacts/frequent` | `GET` | `contactService.js` | Danh sách liên lạc thường xuyên |

### 🔍 QR Code Operations
| STT | Endpoint | Method | Service/File | Mô tả |
|:---:|:---|:---:|:---|:---|
| 1 | `/api/qr/wallet` | `GET` | `qrService.js` | Lấy mã QR ví (Base64) |
| 2 | `/api/qr/wallet/with-amount` | `POST` | `qrService.js` | Tạo mã QR kèm số tiền chỉ định |
| 3 | `/api/qr/wallet/download` | `GET` | `qrService.js` | Tải xuống ảnh QR ví |
| 4 | `/api/qr/read-image` | `POST` | `qrService.js` | Đọc dữ liệu từ file ảnh QR |
| 5 | `/api/qr/resolve` | `POST` | `qrService.js` | Giải mã payload QR thành thông tin ví |

### 💰 Vay Vốn & AI Scoring (User)
| STT | Endpoint | Method | Service/File | Mô tả |
|:---:|:---|:---:|:---|:---|
| 1 | `/api/v1/loans/apply` | `POST` | `loanService.js` | Gửi đơn đăng ký vay vốn |
| 2 | `/api/v1/loans/my-loans` | `GET` | `loanService.js` | Danh sách khoản vay cá nhân |
| 3 | `/api/v1/loans/summary` | `GET` | `loanService.js` | Tóm tắt lịch sử vay và điểm tín dụng |
| 4 | `/api/v1/loans/{id}` | `GET` | `loanService.js` | Chi tiết một đơn vay cá nhân |

### 🛒 Shopping & Consumer Orders
| STT | Endpoint | Method | Service/File | Mô tả |
|:---:|:---|:---:|:---|:---|
| 1 | `/api/categories` | `GET` | `shoppingService.js` | Lấy danh mục món ăn hệ thống |
| 2 | `/api/products` | `GET` | `shoppingService.js` | Danh sách sản phẩm khả dụng |
| 3 | `/api/products/{id}` | `GET` | `shoppingService.js` | Chi tiết sản phẩm |
| 4 | `/api/products/{id}/reviews` | `GET` | `shoppingService.js` | Lấy các đánh giá của khách về món |
| 5 | `/api/orders` | `POST` | `shoppingService.js` | Đặt hàng mới |
| 6 | `/api/orders` | `GET` | `orderService.js` | Lịch sử đơn hàng của User |
| 7 | `/api/orders/{id}` | `GET` | `orderService.js` | Chi tiết một đơn hàng |
| 8 | `/api/orders/{id}/cancel` | `PUT` | `orderService.js` | User yêu cầu hủy đơn |
| 9 | `/api/orders/{id}/reorder` | `POST` | `orderService.js` | Đặt lại đơn hàng cũ |
| 10| `/api/orders/tracking/{id}` | `GET` | `orderService.js` | Theo dõi trạng thái đơn hàng (Timeline) |

### 🚚 Shipper (Tài xế giao hàng)
| STT | Endpoint | Method | Service/File | Mô tả |
|:---:|:---|:---:|:---|:---|
| 1 | `/api/shipper/orders` | `GET` | `shipperApi.js` | Danh sách đơn hàng có sẵn/đã nhận |
| 2 | `/api/shipper/orders/{id}` | `GET` | `shipperApi.js` | Chi tiết đơn hàng cho shipper |
| 3 | `/api/shipper/orders/{id}/accept` | `PUT` | `shipperApi.js` | Shipper nhận đơn hàng |
| 4 | `/api/shipper/orders/{id}/picked-up`| `PUT` | `shipperApi.js` | Xác nhận đã lấy hàng từ quán |
| 5 | `/api/shipper/orders/{id}/delivered`| `PUT` | `shipperApi.js` | Xác nhận giao hàng thành công (kèm ảnh) |
| 6 | `/api/shipper/orders/{id}/failed` | `PUT` | `shipperApi.js` | Báo cáo giao hàng thất bại (kèm lý do) |
| 7 | `/api/shipper/wallet/balance` | `GET` | `shipperApi.js` | Xem số dư ví shipper |
| 8 | `/api/shipper/status` | `GET/PUT` | `shipperApi.js` | Quản lý trạng thái Online/Offline |
| 9 | `/api/shipper/vehicle` | `GET/PUT` | `shipperApi.js` | Quản lý thông tin phương tiện |

### 👨‍🍳 Merchant / Restaurant Owner
| STT | Endpoint | Method | Service/File | Mô tả |
|:---:|:---|:---:|:---|:---|
| 1 | `/api/restaurant-owner/my-restaurant` | `GET` | `merchantDashboardService.js` | Thông tin nhà hàng |
| 2 | `/api/restaurant-owner/restaurant/status` | `PUT` | `merchantDashboardService.js` | Đóng/mở cửa nhà hàng |
| 3 | `/api/restaurant-owner/restaurant/info` | `PUT` | `merchantDashboardService.js` | Cập nhật thông tin chi tiết nhà hàng |
| 4 | `/api/restaurant-owner/wallet/balance`| `GET` | `merchantDashboardService.js` | Xem số dư ví nhà hàng |
| 5 | `/api/restaurant-owner/products` | `GET/POST`| `merchantProductService.js` | Quản lý thực đơn |
| 6 | `/api/restaurant-owner/products/{id}`| `PUT/DELETE`| `merchantProductService.js` | Cập nhật/Xóa món ăn |
| 7 | `/api/restaurant-owner/products/{id}/status`| `PUT` | `merchantProductService.js` | Bật/tắt món trên menu |
| 8 | `/api/restaurant-owner/orders` | `GET` | `merchantOrderService.js` | Quản lý đơn của quán |
| 9 | `/api/restaurant-owner/orders/{id}` | `GET` | `merchantOrderService.js` | Chi tiết đơn hàng cho quán |
| 10| `/api/restaurant-owner/orders/{id}/confirm`| `PUT` | `merchantOrderService.js` | Quán nhận đơn hàng |
| 11| `/api/restaurant-owner/orders/{id}/ready`| `PUT` | `merchantOrderService.js` | Báo món đã chuẩn bị xong |
| 12| `/api/restaurant-owner/orders/{id}/reject`| `PUT` | `merchantOrderService.js` | Quán từ chối đơn hàng |

### 👑 Admin (System Management)
| STT | Endpoint | Method | Service/File | Mô tả |
|:---:|:---|:---:|:---|:---|
| 1 | `/api/admin/users/all` | `GET` | `userManageService.js` | Danh sách toàn bộ người dùng |
| 2 | `/api/admin/users/lock/{id}` | `PUT` | `userManageService.js` | Khóa trạng thái tài khoản |
| 3 | `/api/admin/users/unlock/{id}` | `PUT` | `userManageService.js` | Mở khóa tài khoản |
| 4 | `/api/admin/users/update/{userId}` | `PUT` | `userManageService.js` | Cập nhật hồ sơ tài khoản |
| 5 | `/api/admin/users/{userId}` | `DELETE` | `userManageService.js` | Xóa tài khoản hệ thống |
| 6 | `/api/admin/categories` | `GET/POST`| `vendorService.js` | Quản lý danh mục hệ thống |
| 7 | `/api/admin/categories/{id}` | `GET/PUT/DELETE`| `vendorService.js` | Chi tiết/Sửa/Xóa danh mục |
| 8 | `/api/admin/categories/export` | `GET` | `vendorService.js` | Xuất dữ liệu danh mục (Blob) |
| 9 | `/api/admin/categories/check-name` | `GET` | `vendorService.js` | Kiểm tra trùng tên danh mục |
| 10 | `/api/admin/restaurants`| `GET/POST`| `restaurantService.js`| Quản lý nhà hàng (Admin) |
| 11 | `/api/admin/restaurants/{id}`| `GET/PUT/DELETE`| `restaurantService.js`| Chi tiết/Sửa/Xóa nhà hàng |
| 12 | `/api/admin/restaurants/check-name`| `GET` | `restaurantService.js`| Kiểm tra trùng tên nhà hàng |
| 13 | `/api/admin/restaurants/export`| `GET` | `restaurantService.js`| Xuất dữ liệu nhà hàng |
| 14 | `/api/admin/products` | `GET/POST`| `productService.js` | Quản lý Món ăn toàn bộ hệ thống |
| 15 | `/api/admin/products/{id}` | `GET/PUT/DELETE`| `productService.js` | Chi tiết/Sửa/Xóa món ăn (Admin) |
| 16 | `/api/admin/products/{id}/status` | `PUT` | `productService.js` | Bật/tắt trạng thái có sẵn của Món ăn |
| 17 | `/api/admin/orders` | `GET` | `adminOrderService.js`| Truy vấn toàn bộ đơn hàng hệ thống |
| 18 | `/api/admin/orders/{id}`| `GET` | `adminOrderService.js`| Chi tiết đơn quản trị |
| 19 | `/api/admin/orders/{id}/status` | `PUT` | `adminOrderService.js`| Cập nhật trạng thái thủ công (Admin) |
| 20 | `/api/admin/orders/{id}/cancel` | `PUT` | `adminOrderService.js`| Hủy đơn và auto hoàn tiền |
| 21 | `/api/admin/orders/{id}`| `DELETE` | `adminOrderService.js`| Xóa vĩnh viễn đơn hàng |
| 22 | `/api/admin/shippers` | `GET` | `adminOrderService.js`| Danh sách lookup Shipper |
| 23 | `/api/admin/shippers/{id}` | `GET` | `adminOrderService.js`| Chi tiết Shipper (Admin) |
| 24 | `/api/admin/restaurant-owners` | `GET` | `adminOrderService.js`| Danh sách lookup Chủ quán |

### 🛡️ AI Fraud & Security (Admin)
| STT | Endpoint | Method | Service/File | Mô tả |
|:---:|:---|:---:|:---|:---|
| 1 | `/api/v1/admin/fraud-alerts` | `GET` | `fraudAdminService.js` | Danh sách giao dịch nghi ngờ gian lận |
| 2 | `/api/v1/admin/fraud-alerts/stats` | `GET` | `fraudAdminService.js` | Thống kê tổng quan gian lận AI |
| 3 | `/api/v1/admin/fraud-alerts/{id}` | `GET` | `fraudAdminService.js` | Chi tiết các chỉ số AI (13 features) |
| 4 | `/api/v1/transfer/check-fraud` | `POST` | `transactionService.js` | Kiểm tra rủi ro trước khi chuyển (Client-side trigger) |

### 🏦 Loan Management & AI Scoring (Admin)
| STT | Endpoint | Method | Service/File | Mô tả |
|:---:|:---|:---:|:---|:---|
| 1 | `/api/v1/admin/loans` / `all` | `GET` | `adminLoanService.js` | Danh sách đơn vay đang chờ duyệt |
| 2 | `/api/v1/admin/loans/{id}` | `GET` | `adminLoanService.js` | Chi tiết hồ sơ vay vốn |
| 3 | `/api/v1/admin/loans/stats` | `GET` | `adminLoanService.js` | Thống kê tình trạng vay hệ thống |
| 4 | `/api/v1/admin/loans/{id}/approve` | `POST` | `adminLoanService.js` | Duyệt cho vay |
| 5 | `/api/v1/admin/loans/{id}/reject` | `POST` | `adminLoanService.js` | Từ chối cho vay |
| 6 | `/api/v1/admin/users/{userId}/ai-analysis` | `GET` | `adminLoanService.js` | Lấy chi tiết phân tích hành vi AI (Cash flow, Wallet metrics) |

---
**Ghi chú:** Danh sách này được rà soát thủ công 100% dựa trên toàn bộ thư mục `src/features/**/api` và `src/api` đảm bảo không bỏ sót bất kỳ call API apiClient nào hiện có trong front-end. (Cập nhật: 27/04/2026)
