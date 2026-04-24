# Use Case: Quản lý Toàn bộ lịch sử vay vốn (Admin)

## 1. Tóm tắt
Admin quản lý và tra cứu toàn bộ hồ sơ vay vốn trong hệ thống, bao gồm cả các hồ sơ đã duyệt, bị từ chối hoặc đã hoàn tất thành công.

## 2. Các bên liên quan
*   **Tác nhân chính**: Quản trị viên (Admin).

## 3. Luồng công việc chính
1.  Admin truy cập vào trang **Toàn bộ đơn vay** (`/admin/loans/all`).
2.  Hệ thống hiển thị danh sách toàn bộ hồ sơ với đầy đủ các bộ lọc:
    *   **Trạng thái**: Đang chờ, Đã duyệt, Đã từ chối, Hoàn tất.
    *   **Mức rủi ro AI**: Thấp, Trung bình, Cao.
    *   **Tìm kiếm**: Theo tên, số điện thoại hoặc mã đơn vay.
3.  Hệ thống cung cấp các biểu đồ phân tích xu hướng:
    *   **Biểu đồ cột**: Số lượng đơn đăng ký theo các ngày trong tuần/tháng.
    *   **Biểu đồ rủi ro**: Tỷ lệ phần trăm các mức rủi ro của hồ sơ hiện tại.
4.  Admin xem chi tiết hồ sơ bằng cách nhấn nút **"Chi tiết"**.
5.  Đối với hồ sơ còn ở trạng thái `PENDING_ADMIN`, Admin có quyền duyệt hoặc từ chối ngay tại màn hình này.

## 4. Tính năng hệ thống
*   **Thống kê thời gian thực**: Cập nhật số tiền vay trung bình, số lượng đơn rủi ro cao cần chú ý.
*   **Đồng bộ dữ liệu**: Các biểu đồ tự động cập nhật khi trạng thái hồ sơ thay đổi.
*   **Lịch sử thao tác**: Ghi lại lịch sử phê duyệt và lý do từ chối để phục vụ đối soát.

## 5. UI/UX Features
*   Sử dụng font chữ Manrope hiện đại, rõ nét cho các báo cáo thống kê.
*   Giao diện Chart trực quan giúp Admin nắm bắt tình hình tài chính hệ thống nhanh chóng.
