# Tài liệu Use Case: ViewOrderByAdmin

## 1. Thông tin chung
- **Tên màn hình**: Chi tiết Đơn hàng & Điều phối (Admin)
- **File**: `ViewOrderByAdmin.jsx`
- **Role**: Admin
- **Mô tả**: Trang chi tiết dành cho Quản trị viên để can thiệp, xử lý các tình huống phát sinh liên quan đến đơn hàng, cập nhật trạng thái hoặc thực hiện hoàn tiền nếu cần.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-VOBA-01: Hiển thị thông tin thực thể liên quan
- **Khách hàng**: Tên người đặt, người nhận, SĐT, Địa chỉ giao hàng và Ghi chú.
- **Nhà hàng**: Tên nhà hàng, thông tin liên hệ chủ nhà hàng, địa chỉ lấy hàng.
- **Tài xế (Shipper)**: Thông tin định danh, SĐT và trạng thái hoạt động thực tế của tài xế đang nhận đơn.

### UC-VOBA-02: Chi tiết giỏ hàng và thanh toán
- Liệt kê các món ăn kèm ảnh minh họa, số lượng, đơn giá và thành tiền.
- Hiển thị phương thức thanh toán (Visa, Ví, Tiền mặt) và trạng thái thanh toán.

### UC-VOBA-03: Cập nhật trạng thái đơn hàng thủ công
- Cho phép Admin ghi đè trạng thái đơn hàng (ví dụ: chuyển từ Deliviering sang Completed) trong trường hợp có lỗi vận hành.

### UC-VOBA-04: Hủy đơn hàng và Hoàn tiền
- Cho phép Admin hủy đơn hàng với các lý do: Hết hàng, Khách hủy, Sự cố vận hành.
- Hệ thống tự động xử lý hoàn tiền vào ví khách hàng nếu đơn hàng đã được thanh toán trước đó.

### UC-VOBA-05: Theo dõi lịch trình (Tracking Timeline)
- Hiển thị dòng thời gian chi tiết các bước thay đổi trạng thái kèm thời gian thực hiện chính xác đến từng phút.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Điều phối và xử lý đơn hàng (Admin)
1. **Tên Use Case**: Xem chi tiết và can thiệp đơn hàng.
2. **Mô tả vắn tắt**: Admin kiểm tra toàn bộ thông tin đơn hàng và cập nhật trạng thái thủ công nếu có sự cố.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Admin truy cập trang chi tiết một đơn hàng.
        2) Hệ thống hiển thị thông tin 3 bên: Khách - Nhà hàng - Shipper.
        3) Admin theo dõi Timeline lịch trình đơn hàng.
        4) Admin chọn trạng thái mới (Ví dụ: Từ Preparing sang Delivering) và nhấn "Update Status".
        5) Hệ thống cập nhật trạng thái và ghi log người thực hiện.
    - **3.2 Luồng hủy đơn và hoàn tiền**:
        1) Admin chọn "Cancel Order" và chọn lý do.
        2) Hệ thống xác nhận hùy và tự động gọi API refund vào ví khách hàng (nếu đã thanh toán).
        3) Hiển thị mã giao dịch hoàn tiền.
4. **Tiền điều kiện**: Đăng nhập quyền Admin.
5. **Hậu điều kiện**: Trạng thái đơn hàng thay đổi và tiền được hoàn trả (nếu có).
