# Tài liệu Use Case: AdminTransactionHistoryPage

## 1. Thông tin chung
- **Tên màn hình**: Lịch sử Giao dịch Toàn hệ thống (Admin)
- **File**: `AdminTransactionHistoryPage.jsx`
- **Role**: Admin
- **Mô tả**: Cho phép Quản trị viên theo dõi, giám sát và kiểm tra tất cả các giao dịch tài chính (Nạp, Rút, Chuyển tiền) diễn ra trong hệ thống SmartPay.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-ATH-01: Hiển thị danh sách giao dịch
- Hiển thị bảng giao dịch theo thứ tự thời gian mới nhất lên đầu.
- Các cột thông tin: STT, Mã giao dịch (Transaction ID), Mã ví (Wallet ID), Số tiền, Trạng thái, Loại giao dịch, Thời gian tạo.

### UC-ATH-02: Bộ lọc giao dịch chuyên sâu
- **Theo Mã**: Tìm kiếm chính xác hoặc gần đúng theo Transaction ID hoặc Wallet ID.
- **Theo Trạng thái**: Tất cả, Thành công (Complete), Đang xử lý (Pending), Thất bại (Failed).
- **Theo Loại**: Tất cả, Nạp tiền (Deposit), Rút tiền (Withdraw), Nhận tiền (Transfer In), Chuyển tiền (Transfer Out).

### UC-ATH-03: Xem chi tiết giao dịch
- Hiển thị Modal chi tiết khi nhấn nút "View":
    - Banner trạng thái với màu sắc tương ứng.
    - Thông tin định danh: Transaction ID, Reference ID, Wallet ID, User ID.
    - Thông tin tài chính: Số tiền, Hướng tiền (Vào/Ra), Tên đối tác (Partner Name).
    - Ghi chú (Note) và thời gian thực hiện chính xác.

### UC-ATH-04: Phân trang
- Phân chia danh sách thành nhiều trang (mặc định 10 mục/trang) để đảm bảo tốc độ tải.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Giám sát giao dịch (Transaction Monitoring)
1. **Tên Use Case**: Tra cứu lịch sử giao dịch toàn hệ thống.
2. **Mô tả vắn tắt**: Admin theo dõi và kiểm tra các biến động số dư của tất cả người dùng để đảm bảo tính minh bạch.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Admin truy cập trang Lịch sử giao dịch.
        2) Hệ thống tải danh sách giao dịch mới nhất (phân trang).
        3) Admin nhập mã giao dịch (Transaction ID) hoặc mã ví (Wallet ID) để tìm kiếm.
        4) Admin chọn bộ lọc Loại giao dịch (Nạp/Rút/Chuyển) để thu hẹp phạm vi.
        5) Hệ thống hiển thị kết quả tương ứng.
        6) Admin nhấn "View" để xem chi tiết thông tin đối tác và ghi chú.
4. **Tiền điều kiện**: Đăng nhập với quyền Admin.
5. **Hậu điều kiện**: Không có.
