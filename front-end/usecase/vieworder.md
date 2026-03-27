# Tài liệu Use Case: vieworder

## 1. Thông tin chung
- **Tên màn hình**: Theo dõi đơn hàng chi tiết (Order Details & Tracking)
- **File**: `vieworder.jsx`
- **Role**: Customer (Khách hàng)
- **Mô tả**: Trang chi tiết dành cho khách hàng để giám sát quy trình thực hiện món ăn và giao hàng trong thời gian thực.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-VO-01: Lộ trình xử lý đơn (Visual Timeline)
- Hiển thị 6 bước quan trọng của đơn hàng bằng các icon trực quan: Đã đặt -> Xác nhận -> Đang nấu -> Chờ lấy hàng -> Đang giao -> Hoàn thành.
- Các bước đã hoàn tất được đánh dấu màu xanh (Emerald) kèm thời gian xử lý thực tế.

### UC-VO-02: Chi tiết Sản phẩm và Thanh toán
- Liệt kê bảng danh sách món ăn: Ảnh, Tên món, Số lượng, Đơn giá, Tạm tính.
- Hiển thị Tổng thanh toán cuối cùng nổi bật.

### UC-VO-03: Thông tin đối tác (Shipper & Restaurant)
- **Tài xế**: Hiển thị ảnh đại diện, Tên và Số điện thoại liên lạc khi đơn hàng đang giao.
- **Nhà hàng**: Hiển thị tên nhà hàng cung cấp.

### UC-VO-04: Thông tin nhận hàng
- Hiển thị thông tin người nhận: Tên, SĐT, Địa chỉ giao hàng và Ghi chú đặc biệt.

### UC-VO-05: Các thao tác hỗ trợ
- **Đặt lại ngay (Reorder)**: Cho phép tạo nhanh một đơn hàng mới tương tự đơn cũ chỉ với một nút bấm.
- **Hủy đơn hàng (Cancel)**: Khách hàng có thể yêu cầu hủy đơn kèm lý do nếu đơn hàng đang ở trạng thái Chờ duyệt hoặc vừa được xác nhận.

## 3. Yêu cầu phi chức năng (Non-functional Requirements)

### NFR-VO-01: Cập nhật thời gian thực (Real-time Tracking)
- Hệ thống cố gắng truy xuất thông tin Tracking liên tục nếu đơn hàng đang trong trạng thái "Đang chuẩn bị" hoặc "Đang giao".

### NFR-VO-02: UX/UI (Attention to Detail)
- Ghi chú của khách hàng được đặt trong khung màu vàng (Amber) để người dùng dễ dàng kiểm tra lại yêu cầu của mình.
- Sử dụng font chữ Monospace cho các số liệu tài chính và mã đơn để tăng độ chuyên nghiệp.

### NFR-VO-03: Tính bảo mật và Riêng tư
- Thông tin của tài xế chỉ được hiển thị khi đơn hàng đã được chỉ định (Assigned) cho tài xế đó.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Theo dõi đơn hàng (Order Tracking)
1. **Tên Use Case**: Xem lộ trình và chi tiết đơn hàng.
2. **Mô tả vắn tắt**: Khách hàng kiểm tra trạng thái thực thi đơn hàng và thông tin các bên liên quan.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Khách hàng nhấn "Track" từ lịch sử đơn hàng hoặc thông báo.
        2) Hệ thống hiển thị Timeline 6 bước với trạng thái hiện tại nổi bật.
        3) Hệ thống hiển thị thông tin Shipper (nếu đã nhận đơn).
        4) Khách hàng xem danh sách món ăn và tổng thanh toán.
    - **3.2 Luồng hủy đơn hàng**:
        1) Khách hàng nhấn "Cancel Order" (chỉ khả dụng khi đơn mới khởi tạo).
        2) Hệ thống yêu cầu xác nhận và lý do.
        3) Hệ thống gọi API hủy đơn và thông báo kết quả. [A1]
    - **3.3 Các luồng rẽ nhánh**:
        1) **[A1] Đơn đã được nhà hàng chuẩn bị**: Nếu nhà hàng đã bắt đầu nấu, khách hàng không thể tự hủy đơn và phải liên hệ hỗ trợ.
4. **Tiền điều kiện**: Đã đặt đơn hàng thành công.
5. **Hậu điều kiện**: Không có.
