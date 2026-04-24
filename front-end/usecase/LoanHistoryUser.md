# Use Case: Lịch sử vay vốn (User)

## 1. Tóm tắt
Người dùng theo dõi danh sách các hồ sơ vay đã gửi, kiểm tra trạng thái phê duyệt và xem chi tiết phản hồi từ hệ thống/Admin.

## 2. Các bên liên quan
*   **Tác nhân chính**: Người dùng (User).
*   **Hệ thống**: Backend API, AI Scoring.

## 3. Luồng công việc chính
1.  Người dùng truy cập vào mục **Lịch sử vay** (`/loans/history`).
2.  Hệ thống hiển thị danh sách các hồ sơ vay dưới dạng các thẻ (Cards):
    *   **Số tiền vay**.
    *   **Trạng thái**: Chờ duyệt, Đã duyệt, Hoàn tất, Đã từ chối.
    *   **Ngày yêu cầu**.
3.  Người dùng nhấn vào nút **"Chi tiết hồ sơ"** trên mỗi thẻ.
4.  Hệ thống hiển thị Modal chi tiết bao gồm:
    *   Thông tin thu nhập và nghề nghiệp đã khai báo.
    *   **Phân tích AI**: Hiển thị điểm rủi ro (AI Score) và quyết định của AI.
    *   **Phản hồi Admin**: Ghi chú lý do nếu hồ sơ bị từ chối hoặc cảnh báo.
5.  Người dùng xem tổng quan tài chính (Tổng đơn, Số đơn đã duyệt, Điểm tín dụng trung bình).

## 4. Các tính năng đặc biệt
*   **Bento Layout**: Giao diện hiển thị các thẻ đơn vay linh hoạt, trực quan.
*   **Phân màu trạng thái**:
    *   Xanh lá (Emerald): Đã duyệt/Hoàn tất.
    *   Vàng (Amber): Đang chờ (Pending AI/Admin).
    *   Đỏ (Red): Đã từ chối (Rejected).
*   **Cảnh báo gian lận**: Nếu Admin ghi chú "FRAUD ALERT", hệ thống sẽ hiển thị biểu tượng cảnh báo đỏ rực trên hồ sơ để người dùng biết.

## 5. Quy tắc hiển thị
*   **AI Score**: Được hiển thị dưới dạng phần trăm (Ví dụ: 25.50%).
*   **Phân trang**: Hệ thống tự động phân trang nếu người dùng có nhiều đơn vay.
