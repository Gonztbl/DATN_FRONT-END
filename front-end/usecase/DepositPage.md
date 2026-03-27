# Tài liệu Use Case: DepositPage

## 1. Thông tin chung
- **Tên màn hình**: Nạp tiền vào ví (Deposit Funds)
- **File**: `DepositPage.jsx`
- **Role**: User (Người dùng SmartPay)
- **Mô tả**: Cho phép người dùng chuyển tiền từ thẻ ngân hàng đã liên kết vào số dư ví SmartPay.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-DP-01: Chọn nguồn tiền (Source Selection)
- Hiển thị danh sách các thẻ ngân hàng đã liên kết để người dùng chọn.
- Hiển thị số dư hiện tại của từng thẻ (nếu có) để người dùng cân nhắc.
- Cung cấp lối tắt liên kết thẻ mới nếu người dùng chưa có thẻ nào.

### UC-DP-02: Nhập số tiền nạp
- Cho phép người dùng nhập thủ công số tiền muốn nạp.
- **Gợi ý nhanh (Quick Add)**: Các nút chọn nhanh mức giá phổ biến (50k, 100k, 200k, 500k).
- Kiểm tra số tiền nạp phải lớn hơn 0.

### UC-DP-03: Chi tiết giao dịch (Transaction Review)
- Hiển thị tóm tắt trước khi xác nhận: Số dư ví hiện tại, Số tiền nạp, Tổng tiền thanh toán.

### UC-DP-04: Lịch sử nạp tiền gần đây
- Hiển thị bảng danh sách các giao dịch nạp tiền từ thẻ trong quá khứ.
- Thông tin: Nội dung, Thời gian, Tên ngân hàng, Số thẻ (4 số cuối), Số tiền và Trạng thái (Thành công/Thất bại).

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Nạp tiền vào ví
1. **Tên Use Case**: Nạp tiền từ thẻ ngân hàng.
2. **Mô tả vắn tắt**: Người dùng nạp tiền từ thẻ ngân hàng đã liên kết vào ví SmartPay.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Người dùng truy cập trang Nạp tiền.
        2) Hệ thống hiển thị danh sách thẻ đã liên kết.
        3) Người dùng chọn thẻ muốn sử dụng. [A1]
        4) Người dùng nhập số tiền cần nạp hoặc chọn các mức gợi ý nhanh (50k, 100k, ...).
        5) Người dùng nhấn nút "Confirm Deposit".
        6) Hệ thống kiểm tra số dư và thông báo kết quả.
        7) Hệ thống cập nhật số dư ví và hiển thị thông báo thành công. [A2]
    - **3.2 Các luồng rẽ nhánh**:
        1) **[A1] Người dùng chưa liên kết thẻ**: Nếu không có thẻ nào, hệ thống hiển thị nút "Link New Card". Người dùng thực hiện liên kết thẻ trước khi nạp.
        2) **[A2] Giao dịch thất bại**: Nếu ngân hàng từ chối hoặc thẻ không đủ tiền, hệ thống hiển thị thông báo lỗi và yêu cầu kiểm tra lại nguồn tiền.
4. **Tiền điều kiện**: Đăng nhập thành công và có thẻ ngân hàng được liên kết.
5. **Hậu điều kiện**: Số dư ví được cập nhật, giao dịch được lưu vào lịch sử.
