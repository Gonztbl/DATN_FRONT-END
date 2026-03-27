# Tài liệu Use Case: WithdrawPage

## 1. Thông tin chung
- **Tên màn hình**: Rút tiền về tài khoản (Withdraw Funds)
- **File**: `Withdraw.jsx`
- **Role**: User (Người dùng SmartPay)
- **Mô tả**: Cho phép người dùng chuyển tiền từ số dư ví SmartPay về tài khoản ngân hàng hoặc thẻ đã liên kết.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-WP-01: Chọn tài khoản đích (Recipient Account)
- Hiển thị danh sách các thẻ/tài khoản ngân hàng đã liên kết.
- Cho phép người dùng chọn một tài khoản để nhận tiền.

### UC-WP-02: Quản lý số tiền rút
- Hiển thị Số dư khả dụng (Available Balance) để người dùng đối soát.
- Hỗ trợ nút "Max" để tự động điền toàn bộ số tiền hiện có trong ví.
- Kiểm tra tính hợp lệ: Số tiền rút + Phí dịch vụ không được vượt quá số dư khả dụng.

### UC-WP-03: Tính toán Phí dịch vụ (Service Fee)
- Tự động tính phí dịch vụ (Ví dụ: 0.5% trên tổng số tiền rút).
- Hiển thị "Tổng tiền bị trừ" (Total Deducted) bao gồm cả tiền rút và phí.

### UC-WP-04: Ước tính thời gian (Arrival Estimation)
- Hiển thị thông báo về thời gian xử lý dự kiến (Ví dụ: 1-3 ngày làm việc tùy loại thẻ).

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Rút tiền về tài khoản
1. **Tên Use Case**: Rút tiền từ ví về ngân hàng.
2. **Mô tả vắn tắt**: Người dùng chuyển tiền từ số dư ví SmartPay về tài khoản ngân hàng đã liên kết.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Người dùng truy cập trang Rút tiền.
        2) Hệ thống hiển thị số dư khả dụng và phí dịch vụ (0.5%).
        3) Người dùng chọn tài khoản ngân hàng nhận tiền.
        4) Người dùng nhập số tiền cần rút hoặc nhấn "Max".
        5) Hệ thống tính toán và hiển thị "Tổng tiền bị trừ".
        6) Người dùng nhấn "Confirm Withdraw".
        7) Hệ thống kiểm tra điều kiện (Số dư >= Tiền rút + Phí).
        8) Hệ thống trừ tiền ví và tạo lệnh rút tiền trạng thái "PENDING".
    - **3.2 Các luồng rẽ nhánh**:
        1) **Số dư không đủ**: Nếu số dư nhỏ hơn (Tiền rút + Phí), hệ thống hiển thị thông báo lỗi "Insufficient Balance" và vô hiệu hóa nút xác nhận.
        2) **Số tiền rút không hợp lệ**: Nếu người dùng nhập số tiền <= 0, hệ thống hiển thị cảnh báo yêu cầu nhập số tiền lớn hơn 0.
4. **Tiền điều kiện**: Có số dư ví > 0 và đã liên kết ít nhất một tài khoản ngân hàng.
5. **Hậu điều kiện**: Số dư ví giảm ngay lập tức, một giao dịch loại WITHDRAW được ghi nhận.
