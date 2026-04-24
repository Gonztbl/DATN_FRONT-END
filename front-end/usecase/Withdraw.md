# Tài liệu Use Case: WithdrawPage

## 1. Thông tin chung
- **Tên màn hình**: Rút tiền về tài khoản (Withdraw Funds)
- **File**: `Withdraw.jsx`
- **Role**: User (Người dùng SmartPay)
- **Mô tả**: Cho phép người dùng chuyển tiền từ số dư ví SmartPay về tài khoản ngân hàng hoặc thẻ đã liên kết. Hỗ trợ thêm thẻ mới ngay tại màn hình.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-WP-01: Chọn tài khoản đích (Recipient Account)
- Hiển thị danh sách các thẻ/tài khoản ngân hàng đã liên kết.
- Cho phép người dùng chọn một tài khoản để nhận tiền.

### UC-WP-02: Liên kết thẻ mới (Add New Card)
- Cung cấp Modal để người dùng nhập thông tin thẻ mới (Số thẻ, Tên chủ thẻ, Ngày hết hạn, CVV, Loại thẻ, Ngân hàng).
- Hệ thống lưu trữ và cập nhật danh sách thẻ ngay lập tức.

### UC-WP-03: Quản lý số tiền rút
- Hiển thị Số dư khả dụng (Available Balance).
- Hỗ trợ nút "Max" để tự động điền số tiền rút tối đa có thể (đã trừ phí 5%).
- Các nút chọn nhanh: 50.000đ, 500.000đ, 1.000.000đ.
- Kiểm tra tính hợp lệ: Số tiền rút + Phí dịch vụ (5%) không được vượt quá số dư khả dụng.

### UC-WP-04: Tính toán Phí dịch vụ (Service Fee)
- Tự động tính phí dịch vụ cố định là **5%** trên số tiền rút.
- Hiển thị "Tổng tiền bị trừ" (Total Deducted) = Số tiền rút + (Số tiền rút * 5%).

### UC-WP-05: Xem lịch sử rút tiền gần đây
- Hiển thị bảng danh sách các lệnh rút tiền gần nhất với các trạng thái: SUCCESS (Thành công), PENDING (Đang xử lý), FAILED (Thất bại).

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Rút tiền về tài khoản
1. **Tên Use Case**: Rút tiền từ ví về ngân hàng.
2. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Người dùng truy cập trang Rút tiền.
        2) Hệ thống hiển thị số dư khả dụng và thông tin phí dịch vụ (5%).
        3) Người dùng chọn tài khoản ngân hàng nhận tiền hoặc thêm thẻ mới qua Modal.
        4) Người dùng nhập số tiền hoặc chọn các mức tiền gợi ý/nhấn "Max".
        5) Hệ thống tự động tính và hiển thị phí dịch vụ (5%) và Tổng tiền bị trừ.
        6) Người dùng nhấn "Xác nhận rút tiền".
        7) Hệ thống kiểm tra điều kiện số dư và thực hiện giao dịch.
    - **3.2 Các luồng rẽ nhánh**:
        1) **Số dư không đủ**: Hệ thống báo lỗi "Số dư không đủ" nếu Tổng khấu trừ > Số dư khả dụng.
        2) **Thêm thẻ thất bại**: Nếu thông tin thẻ không hợp lệ, hệ thống báo lỗi trong Modal.
3. **Tiền điều kiện**: Có số dư ví và đã liên kết ít nhất một tài khoản ngân hàng (hoặc thực hiện liên kết ngay tại trang).
4. **Hậu điều kiện**: Số dư ví giảm, biến động số dư được ghi nhận vào lịch sử giao dịch.
