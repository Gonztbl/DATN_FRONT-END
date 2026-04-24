# Use Case: Quản lý Duyệt đơn vay vốn (Admin)

## 1. Tóm tắt
Admin thực hiện xem xét các đơn vay đang ở trạng thái chờ duyệt. Admin được hỗ trợ bởi các chỉ số phân tích chuyên sâu từ AI để đưa ra quyết định chính xác nhất.

## 2. Các bên liên quan
*   **Tác nhân chính**: Quản trị viên (Admin).
*   **Tác nhân phối hợp**: Hệ thống AI (Cung cấp phân tích dữ liệu).

## 3. Luồng công việc chính
1.  Admin truy cập trang **Phê duyệt vay vốn** (`/admin/loans`).
2.  Hệ thống hiển thị dashboard thống kê nhanh:
    *   Tổng số đơn chờ duyệt.
    *   Phân loại đơn theo mức độ rủi ro (Cao, Trung bình, Thấp).
3.  Admin sử dụng bộ lọc để ưu tiên xử lý:
    *   Lọc theo mức độ rủi ro (AI Score).
    *   Tìm kiếm theo tên/số điện thoại khách hàng.
4.  Admin chọn **"Xem xét"** một đơn vay nhất định.
5.  Hệ thống hiển thị Modal chi tiết với hai tab phân tích:
    *   **Tab Thông tin**: Mục đích vay, thu nhập khai báo, thông tin khách hàng, số dư ví hiện tại.
    *   **Tab Phân tích AI**:So sánh thu nhập khai báo với dòng tiền thực tế; các chỉ số rủi ro (GD bị từ chối, biến động số dư, tuổi tài khoản).
6.  Admin đưa ra quyết định:
    *   **Duyệt**: Hệ thống giải ngân vào ví người dùng.
    *   **Từ chối**: Bắt buộc nhập lý do từ chối.
7.  Hệ thống cập nhật trạng thái và thông báo cho người dùng.

## 4. Quy tắc nghiệp vụ (Risk Management)
*   **Khớp thu nhập**: Nếu thu nhập thực tế lệch > 50% so với khai báo, AI sẽ cảnh báo đỏ "Thu nhập không khớp".
*   **Mức rủi ro**:
    *   High (Score ≥ 30%): Cần kiểm tra kỹ dòng tiền.
    *   Moderate (10% - 30%): Rủi ro trung bình.
    *   Low (< 10%): Độ tin cậy cao.

## 5. UI/UX Features
*   Biểu đồ hình tròn hiển thị tỷ lệ phân bố rủi ro.
*   Thanh progress bar đánh giá tỷ lệ chi tiêu trên thu nhập (Spend/Income Ratio).
*   Giao diện Dark Mode tối ưu cho quản trị viên.
