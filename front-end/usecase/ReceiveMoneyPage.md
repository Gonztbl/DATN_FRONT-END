# Tài liệu Use Case: ReceiveMoneyPage

## 1. Thông tin chung
- **Tên màn hình**: Nhận tiền (Receive Money)
- **File**: `ReceiveMoneyPage.jsx`
- **Role**: User (SmartPay)
- **Mô tả**: Giao diện cung cấp mã QR cá nhân để nhận tiền từ người dùng khác trong hệ thống.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-RMP-01: Hiển thị mã QR tĩnh
- Hệ thống tự động tạo và hiển thị mã QR đại diện cho ví cá nhân của người dùng.

### UC-RMP-02: Tạo mã QR theo số tiền (Set Amount)
- Cho phép người dùng nhập một số tiền cụ thể.
- Hệ thống cập nhật mã QR tương ứng để người quét không cần nhập tay số tiền.

### UC-RMP-03: Chia sẻ và Tải xuống
- Hỗ trợ nút "Download" để lưu mã QR dạng hình ảnh.
- Hỗ trợ tính năng "Share" để gửi mã QR qua các ứng dụng nhắn tin.

## 3. Yêu cầu phi chức năng (Non-functional Requirements)

### NFR-RMP-01: Hiệu năng
- Mã QR phải được tạo nhanh (< 200ms) sau khi thay đổi số tiền.

### NFR-RMP-02: UX/UI
- Giao diện tối giản, tập trung vào mã QR.
- Mã QR có độ tương phản cao, dễ quét.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Nhận tiền qua mã QR (Receive Money)
1. **Tên Use Case**: Tạo và chia sẻ mã QR nhận tiền.
2. **Mô tả vắn tắt**: Người dùng tạo mã QR cá nhân hoặc mã QR kèm số tiền để người khác quét nạp tiền/chuyển tiền.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Người dùng vào trang "Receive Money".
        2) Hệ thống hiển thị QR tĩnh mặc định.
        3) Người dùng nhấn "Set Amount" và nhập số tiền.
        4) Hệ thống tạo QR mới chứa thông tin số tiền.
        5) Người dùng nhấn "Download" để lưu ảnh QR về máy.
4. **Tiền điều kiện**: Đã đăng nhập.
5. **Hậu điều kiện**: Mã QR được tạo thành công.
