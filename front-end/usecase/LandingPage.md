# Tài liệu Use Case: LandingPage

## 1. Thông tin chung
- **Tên màn hình**: Trang chủ (Landing Page)
- **File**: `LandingPage.jsx`
- **Role**: Public User / Customer
- **Mô tả**: Trang giới thiệu dịch vụ SmartPay, cung cấp thông tin tổng quan về hệ sinh thái và điểm truy cập đăng nhập/đăng ký.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-LP-01: Giới thiệu hệ sinh thái SmartPay
- Hiển thị các tính năng cốt lõi: Chuyển tiền, Thanh toán hóa đơn, Tích lũy (Túi thần tài), Bảo mật.
- Hiển thị các đối tác chiến lược (Carousel chạy ngang).

### UC-LP-02: Chatbot Tư vấn tài chính
- Cung cấp cửa sổ chat tương tác với AI để giải đáp thắc mắc của người dùng.
- **Tính năng**:
    - Gửi/Nhận tin nhắn thời gian thực.
    - Hiển thị trạng thái "Đang trả lời..." khi AI xử lý.
    - Tự động cuộn xuống tin nhắn mới nhất.

### UC-LP-03: Điều hướng Hệ thống
- Nút "Đăng nhập" điều hướng tới trang Login.
- Nút "Đăng ký" điều hướng tới trang Register.
- Các liên kết nhanh (Anchor links) tới các phần: Tính năng, Tích lũy, Thanh toán, Bảo mật.

### UC-LP-04: Header bám dính (Sticky Header)
- Thanh menu luôn hiển thị khi người dùng cuộn trang để dễ dàng truy cập các tính năng điều hướng.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Khám phá hệ sinh thái (Landing Page)
1. **Tên Use Case**: Xem thông tin giới thiệu dịch vụ.
2. **Mô tả vắn tắt**: Người dùng mới hoặc khách hàng vãng lai tìm hiểu về các tính năng của SmartPay.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Người dùng truy cập tên miền của hệ thống.
        2) Hệ thống hiển thị Hero Section với thông điệp chào mừng.
        3) Người dùng cuộn trang để xem các tính năng chính (Chuyển tiền, Tích lũy, Bảo mật).
        4) Nhấn vào nút "Get Started" hoặc "Log in" để chuyển sang trang xác thực.
4. **Tiền điều kiện**: Không có.
5. **Hậu điều kiện**: Không có.

### 4.2 Mô tả usecase Tương tác với Chatbot AI
1. **Tên Use Case**: Tư vấn qua Chatbot.
2. **Mô tả vắn tắt**: Người dùng hỏi đáp thông tin với hệ thống thông qua giao diện chatbot.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Người dùng nhấn vào icon Chat ở góc màn hình.
        2) Nhập nội dung câu hỏi.
        3) Hệ thống hiển thị trạng thái "Thinking..." và trả về câu trả lời từ AI.
4. **Tiền điều kiện**: Không có.
5. **Hậu điều kiện**: Không có.
