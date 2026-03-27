# Tài liệu Use Case: AdminVerifyFacePage

## 1. Thông tin chung
- **Tên màn hình**: Kiểm tra Xác thực Khuôn mặt (Admin)
- **File**: `AdminVerifyFacePage.jsx`
- **Role**: Admin
- **Mô tả**: Công cụ dành cho Quản trị viên để kiểm tra tính chính xác của dữ liệu sinh trắc học đã đăng ký bằng cách thực hiện xác thực thực tế tại chỗ.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-AVFP-01: Nhận diện người dùng mục tiêu
- Hiển thị thông tin người dùng đang được kiểm tra (Họ tên/Username/ID) để đảm bảo Admin thực hiện đúng đối tượng.

### UC-AVFP-02: Truyền phát Camera
- Tự động kích hoạt camera ngay khi vào trang.
- Hiển thị khung định vị (Overlay) hình oval để người dùng căn chỉnh khuôn mặt.

### UC-AVFP-03: Chụp và So khớp (Recognition)
- Chụp ảnh khuôn mặt từ luồng video và gửi lên `faceService` cùng với ID người dùng để so sánh với các embedding đã lưu.

### UC-AVFP-04: Hiển thị kết quả chi tiết
- **Trường hợp khớp mẫu (Match Found)**: Hiển thị trạng thái thành công (màu xanh) kèm điểm số tương đồng (Similarity Score) tính theo tỷ lệ %.
- **Trường hợp không khớp (No Match)**: Hiển thị trạng thái thất bại (màu đỏ) kèm thông báo lỗi từ server.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Kiểm tra xác thực khuôn mặt (Admin)
1. **Tên Use Case**: Xác minh sinh trắc học thực tế.
2. **Mô tả vắn tắt**: Admin thực hiện quét mặt người dùng tại chỗ để kiểm tra độ tin cậy của thuật toán và dữ liệu đã lưu.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Admin truy cập trang "Verify Face" cho một User ID.
        2) Hệ thống mở camera và hiển thị khung oval.
        3) Người dùng đưa mặt vào khung hình.
        4) Hệ thống tự động chụp ảnh và gửi so khớp.
        5) Hệ thống hiển thị điểm số Similarity (Ví dụ: 95.5%). [A1]
        6) Hệ thống báo "Match" (Xanh) nếu trên ngưỡng cho phép.
    - **3.2 Các luồng rẽ nhánh**:
        1) **[A1] Không khớp**: Nếu điểm số thấp, hệ thống báo "No Match" (Đỏ) và yêu cầu kiểm tra lại dữ liệu mẫu.
4. **Tiền điều kiện**: Đã đăng nhập Admin và User đã có dữ liệu khuôn mặt.
5. **Hậu điều kiện**: Không có.
