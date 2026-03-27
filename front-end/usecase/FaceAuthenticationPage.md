# Tài liệu Use Case: FaceAuthenticationPage

## 1. Thông tin chung
- **Tên màn hình**: Xác thực Khuôn mặt (Face Authentication)
- **File**: `FaceAuthenticationPage.jsx`
- **Role**: User (SmartPay)
- **Mô tả**: Màn hình thực hiện so khớp khuôn mặt để xác thực các hành động quan trọng như giao dịch tài chính hoặc đăng nhập.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-FAP-01: Truyền phát video thực tế (Live Stream)
- Hiển thị luồng camera trực tiếp với khung định vị khuôn mặt.

### UC-FAP-02: So khớp sinh trắc học (Biometric Matching)
- Chụp ảnh khuôn mặt hiện tại và so sánh với Face Embedding đã lưu.
- Trả về điểm số tương đồng (Similarity Score).

### UC-FAP-03: Kết quả xác thực
- Thành công: Cho phép tiếp tục hành động (Chuyển tiền, v.v.).
- Thất bại: Hiển thị lỗi và cung cấp lựa chọn thử lại.

## 3. Yêu cầu phi chức năng (Non-functional Requirements)

### NFR-FAP-01: Độ chính xác
- Ngưỡng so khớp (Threshold) tối thiểu là 0.8 để đảm bảo an toàn.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Xác thực khuôn mặt (Face Verification)
1. **Tên Use Case**: So khớp khuôn mặt.
2. **Mô tả vắn tắt**: Hệ thống đối chiếu khuôn mặt hiện tại với dữ liệu đã đăng ký.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Hệ thống hiển thị màn hình Camera.
        2) Người dùng đưa mặt vào khung hình.
        3) Hệ thống tự động chụp và gửi dữ liệu so khớp.
        4) Server trả về kết quả độ tương đồng. [A1]
        5) Nếu độ tương đồng cao, xác thực thành công.
    - **3.2 Các luồng rẽ nhánh**:
        1) **[A1] Xác thực thất bại**: Nếu không khớp, yêu cầu thử lại.
4. **Tiền điều kiện**: Đã đăng ký khuôn mặt.
5. **Hậu điều kiện**: Hành động được phê duyệt.
