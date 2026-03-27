# Tài liệu Use Case: AdminWalletPage

## 1. Thông tin chung
- **Tên màn hình**: Quản lý Ví SmartPay (Admin)
- **File**: `AdminWalletPage.jsx`
- **Role**: Admin
- **Mô tả**: Trung tâm quản lý tài chính cho phép Quản trị viên theo dõi số dư, kiểm soát trạng thái ví của tất cả người dùng và thực hiện nạp tiền thủ công khi cần thiết.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-AWP-01: Hiển thị danh sách ví
- Liệt kê toàn bộ ví trong hệ thống với các thông tin: ID Ví, Số tài khoản, ID Người dùng, Số dư khả dụng, Trạng thái và Ngày tạo.

### UC-AWP-02: Tìm kiếm và Lọc ví
- Cho phép tìm kiếm nhanh theo ID, UserID hoặc Số tài khoản.
- Lọc theo trạng thái: Tất cả, Hoạt động (Active), Bị khóa/Đóng băng (Locked/Frozen).

### UC-AWP-03: Đóng băng/Kích hoạt ví (Toggle Lock)
- Cho phép khóa ví ngay lập tức để ngăn chặn giao dịch nếu phát hiện nghi vấn.
- Cho phép mở khóa ví để khôi phục hoạt động bình thường.
- Sử dụng nút gạt (Switch) màu xanh/đỏ để thể hiện trực quan trạng thái hiện tại.

### UC-AWP-04: Nạp tiền vào ví (Topup)
- Mở modal cho phép nạp tiền cho một ví cụ thể.
- Cung cấp các nút gợi ý số tiền nhanh (100k, 500k, 1M).
- Hiển thị tóm tắt thông tin ví (Số dư hiện tại, Số tài khoản) trong modal nạp tiền.

### UC-AWP-05: Thông báo kết quả nạp tiền
- Sau khi nạp tiền, hiển thị modal thông báo kết quả chi tiết bao gồm: Số tiền đã nạp, Số dư cũ và Số dư mới sau giao dịch.

## 3. Yêu cầu phi chức năng (Non-functional Requirements)

### NFR-AWP-01: Hiệu năng xử lý danh sách lớn
- Thực hiện fetch dữ liệu số lượng lớn (ví dụ 1000 bản ghi) một lần để hỗ trợ tìm kiếm và lọc tức thì tại máy khách (Client-side filtering).

### NFR-AWP-02: Tính bảo mật tài chính
- Mọi thao tác nạp tiền hoặc khóa ví phải được xác nhận lại và ghi nhật ký hệ thống.
- Chỉ hiển thị số dư dưới dạng tiền tệ Việt Nam (VND).

### NFR-AWP-03: UX/UI
- Sử dụng font chữ Monospace cho Số tài khoản để dễ đọc và phân biệt các chữ số tương tự nhau.
- Scrollbar tùy chỉnh để không làm ảnh hưởng đến thẩm mỹ giao diện trang quản trị.
