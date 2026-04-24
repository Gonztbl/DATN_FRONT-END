# Use Case: Quản lý Cảnh báo Gian lận AI (Admin)

## 1. Tóm tắt
Hệ thống AI liên tục giám sát các giao dịch chuyển tiền (Transfer). Nếu phát hiện dấu hiệu bất thường, hệ thống sẽ gắn nhãn rủi ro và Admin sẽ quản lý các cảnh báo này để ngăn chặn hành vi gian lận tài chính.

## 2. Các bên liên quan
*   **Tác nhân chính**: Quản trị viên (Admin).
*   **Tác nhân hỗ trợ**: Hệ thống AI (Mô hình XGBoost đánh giá rủi ro giao dịch).

## 3. Luồng công việc chính
1.  Admin truy cập vào trang **Cảnh báo Gian lận** (`/admin/fraud-alerts`).
2.  Hệ thống hiển thị dashboard thống kê gian lận:
    *   Tổng số cảnh báo.
    *   Số giao dịch cần Review (Yêu cầu nhận diện khuôn mặt).
    *   Số giao dịch đã bị chặn (Blocked).
3.  Admin sử dụng bộ lọc để phân tích danh sách:
    *   Lọc theo **Vùng rủi ro (Zone)**: ACCEPT, REVIEW (Face verification), REJECT.
    *   Lọc theo trạng thái giao dịch: Đang chờ, Thành công, Bị chặn.
4.  Admin nhấn **"Xem"** chi tiết một cảnh báo.
5.  Hệ thống hiển thị Modal chi tiết bao gồm:
    *   Thông tin giao dịch: Người gửi, người nhận, số tiền.
    *   **Phân tích rủi ro**: Điểm số AI (Fraud Score).
    *   **Xác thực khuôn mặt**: Hiển thị kết quả Face ID nếu giao dịch rơi vào vùng REVIEW.
    *   **Features Input**: Hiển thị 13 thông số đầu vào mà mô hình AI đã sử dụng để đưa ra quyết định (Ví dụ: `hour_of_day`, `avg_balance`, `peer_transfer_ratio`...).

## 4. Quy tắc vận hành (Fraud Logic)
*   **Vùng ACCEPT**: Giao dịch rủi ro thấp, cho phép thực hiện bình thường.
*   **Vùng REVIEW**: Giao dịch có nghi ngờ, hệ thống yêu cầu người dùng xác thực khuôn mặt (FaceID) mới cho phép tiếp tục.
*   **Vùng REJECT**: Giao dịch rủi ro cực cao, hệ thống tự động chặn giao dịch ngay lập tức (BLOCKED).

## 5. UI/UX Features
*   Hệ thống "đèn giao thông" (Xanh - Vàng - Đỏ) để phân loại mức độ rủi ro trực quan.
*   Bảng hiển thị chi tiết các feature kỹ thuật giúp Admin hiểu tại sao AI đánh dấu gian lận.
