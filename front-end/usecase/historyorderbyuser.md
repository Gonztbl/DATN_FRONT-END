# Tài liệu Use Case: historyorderbyuser

## 1. Thông tin chung
- **Tên màn hình**: Lịch sử đơn hàng (Order History)
- **File**: `historyorderbyuser.jsx`
- **Role**: Customer (Khách hàng)
- **Mô tả**: Nơi khách hàng quản lý và theo dõi toàn bộ các đơn đặt hàng đã thực hiện, từ các đơn đang chờ đến các đơn đã hoàn tất hoặc bị hủy.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-HOU-01: Phân loại đơn hàng theo trạng thái (Tabs)
- Bộ lọc nhanh theo các trạng thái: Chờ duyệt, Đã xác nhận, Đang chuẩn bị, Chờ lấy hàng, Đang giao, Hoàn thành, Đã hủy.

### UC-HOU-02: Tìm kiếm đơn hàng nâng cao
- Cho phép tìm kiếm đơn hàng dựa trên: Mã đơn (#ID), Tên khách hàng, Tên nhà hàng, hoặc Tên món ăn trong đơn.

### UC-HOU-03: Hiển thị tóm tắt Đơn hàng (Order Cards)
- Mỗi thẻ đơn hàng hiển thị:
    - **Bộ sưu tập ảnh**: Hiển thị tối đa 3 ảnh món ăn đầu tiên (dạng chồng lên nhau - Stacked images).
    - Mã đơn hàng, Thời gian đặt, Trạng thái (kèm màu sắc phân biệt).
    - Tên nhà hàng và tổng số lượng món.
    - Tổng số tiền thanh toán.

### UC-HOU-04: Tải dữ liệu linh hoạt (Load More)
- Hỗ trợ tính năng "Xem thêm" (Pagination/Infinite scroll) để truy xuất các đơn hàng cũ mà không làm chậm trang.

### UC-HOU-05: Truy cập Chi tiết và Theo dõi
- Nút "Track" (Theo dõi) dẫn người dùng đến trang chi tiết để xem lộ trình đơn hàng.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Tra cứu lịch sử đặt hàng (Customer)
1. **Tên Use Case**: Xem danh sách đơn hàng đã đặt.
2. **Mô tả vắn tắt**: Khách hàng xem lại các đơn hàng cũ hoặc theo dõi đơn hàng mới nhất của mình.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Khách hàng truy cập trang "Order History".
        2) Hệ thống hiển thị danh sách đơn hàng dưới dạng thẻ (Cards).
        3) Khách hàng sử dụng các Tab trạng thái (Pending, Completed...) để lọc đơn.
        4) Khách hàng nhập Mã đơn hoặc Tên món vào ô tìm kiếm.
        5) Nhấn "Track" hoặc vào thẻ đơn để xem chi tiết.
    - **3.2 Các luồng rẽ nhánh**:
        1) **[A1] Không có đơn hàng**: Nếu chưa có đơn, hệ thống hiển thị hình ảnh minh họa trống và nút "Order Now".
4. **Tiền điều kiện**: Đã đăng nhập.
5. **Hậu điều kiện**: Không có.
