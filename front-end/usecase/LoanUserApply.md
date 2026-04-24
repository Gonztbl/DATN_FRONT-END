# Use Case: Đăng ký vay vốn (User)

## 1. Tóm tắt
Người dùng có nhu cầu vay vốn thực hiện đăng ký hồ sơ vay trên hệ thống. Hệ thống sẽ sử dụng mô hình chấm điểm tín dụng AI (Credit Scoring) để đánh giá sơ bộ mức độ rủi ro trước khi chuyển hồ sơ cho Admin xét duyệt cuối cùng.

## 2. Các bên liên quan
*   **Tác nhân chính**: Người dùng (User).
*   **Tác nhân phối hợp**: Hệ thống AI (Mô hình XGBoost chấm điểm), Ngân hàng (Ví điện tử).

## 3. Tiền điều kiện
*   Người dùng đã đăng nhập vào hệ thống.
*   Người dùng đã hoàn tất định danh (KYC) - Hệ thống ưu tiên các cấp độ KYC cao hơn.

## 4. Luồng công việc chính (Happy Path)
1.  Người dùng truy cập vào trang **Vay vốn** (`/loans/apply`).
2.  Hệ thống hiển thị form đăng ký với các trường thông tin:
    *   **Số tiền vay**: Người dùng nhập số tiền mong muốn.
    *   **Kỳ hạn vay**: Chọn từ 3, 6, 9, 12, đến 24 tháng.
    *   **Mục đích vay**: Nhập lý do vay vốn.
    *   **Thu nhập khai báo**: Nhập mức thu nhập hàng tháng.
    *   **Phân khúc nghề nghiệp**: Chọn nhóm ngành nghề phù hợp (Công chức, Kinh doanh, Tự do, v.v.).
3.  Người dùng nhấn **"Gửi hồ sơ"**.
4.  Hệ thống thực hiện:
    *   Phân tích dữ liệu giao dịch thực tế của người dùng (Cashflow, Balance).
    *   Mô hình AI tính toán xác suất rủi ro (`aiScore`).
    *   Gửi hồ sơ vào hàng đợi chờ Admin phê duyệt.
5.  Hệ thống hiển thị thông báo gửi hồ sơ thành công và chuyển hướng sang trang lịch sử vay.

## 5. Các trường hợp ngoại lệ
*   **Hệ thống AI từ chối sớm**: Nếu `aiScore` vượt ngưỡng rủi ro cực cao, hệ thống có thể đánh dấu `REJECTED_AI` ngay lập tức (Tùy cấu hình).
*   **Thông tin không hợp lệ**: Người dùng nhập số tiền không nằm trong hạn mức cho phép hoặc để trống các trường bắt buộc. Hệ thống sẽ chặn và báo lỗi tại form.

## 6. Quy tắc nghiệp vụ
*   **Phân khúc nghề nghiệp**: Được mã hóa thành các con số chuẩn để AI có thể hiểu và chấm điểm.
*   **Logic Phê duyệt**:
    *   `PASSED_AI`: Hồ sơ có điểm rủi ro thấp, chuyển sang trạng thái `PENDING_ADMIN`.
    *   `PENDING_ADMIN`: Trạng thái mặc định chờ Admin ra quyết định cuối cùng.

## 7. Giao diện (UI Features)
*   Form nhập liệu thiết kế hiện đại, tối giản.
*   Sử dụng SweetAlert2 để thông báo trạng thái gửi đơn.
*   Hiển thị các gói vay ưu đãi (6.5%/năm) để thu hút người dùng.
