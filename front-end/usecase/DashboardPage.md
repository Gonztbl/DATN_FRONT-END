# Tài liệu Use Case: Wallet Dashboard

## 1. Thông tin chung
- **Tên màn hình**: Bảng điều khiển Ví (Wallet Dashboard)
- **File**: `DashboardPage.jsx`
- **Role**: User (Người dùng SmartPay)
- **Mô tả**: Giao diện trung tâm hiển thị tình trạng tài chính, quản lý thẻ liên kết và thực hiện các giao dịch nhanh.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-WD-01: Hiển thị Tổng số dư (Balance Overview)
- Hiển thị số dư khả dụng một cách nổi bật.
- Thống kê Tổng thu (Income) và Tổng chi (Expense) trong tháng.
- Hiển thị phần trăm thay đổi số dư so với tháng trước.

### UC-WD-02: Phân tích chi tiêu (Spending Analytics)
- Biểu đồ cột hiển thị xu hướng chi tiêu trong 7 ngày gần nhất.
- Hỗ trợ xem chi tiết số tiền khi di chuột (Hover tooltip) vào từng cột ngày.

### UC-WD-03: Quản lý Thẻ liên kết (Card Management)
- Hiển thị danh sách các thẻ ngân hàng đã liên kết (Số thẻ ẩn, Tên ngân hàng, Loại thẻ).
- Cho phép thêm thẻ mới (Add Card Modal) với các trường: Số thẻ, Tên chủ thẻ, Ngày hết hạn, CVV.

### UC-WD-04: Giao dịch nhanh (Quick Actions)
- **Nạp tiền nhanh (Top-up)**: Nạp tiền từ thẻ đã chọn vào ví.
- **Chuyển tiền nhanh (P2P Transfer)**: 
    - Tìm kiếm người nhận theo số điện thoại.
    - Quét mã QR để tự động điền thông tin người nhận.
    - Hiển thị danh sách liên lạc thường xuyên (Frequent Contacts).

### UC-WD-05: Thông báo giao dịch (Live Notifications)
- Hiển thị danh sách các giao dịch nhận tiền mới nhất trong menu thông báo (Bell icon).

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Quản lý số dư và Thống kê (Dashboard)
1. **Tên Use Case**: Theo dõi tài chính cá nhân.
2. **Mô tả vắn tắt**: Người dùng xem tổng quan số dư, thu chi và biểu đồ phân tích để quản lý tiền tệ.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Người dùng truy cập Dashboard Ví.
        2) Hệ thống tải song song: Số dư, Thẻ liên kết, Lịch sử 7 ngày.
        3) Hệ thống hiển thị biểu đồ chi tiêu (Chart).
        4) Người dùng có thể nhấn vào biểu tượng "Mắt" để ẩn/hiện số dư thực tế.
        5) Người dùng nhấn vào các nút Quick Actions (Topup, Transfer) để thực hiện giao dịch nhanh.
4. **Tiền điều kiện**: Đã đăng nhập vào hệ thống.
5. **Hậu điều kiện**: Không có.
