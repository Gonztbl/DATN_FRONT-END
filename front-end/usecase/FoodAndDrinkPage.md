# Tài liệu Use Case: FoodAndDrinkPage

## 1. Thông tin chung
- **Tên màn hình**: Đặt món trực tuyến (Food & Drink)
- **File**: `FoodAndDrinkPage.jsx`
- **Role**: Customer (Khách hàng)
- **Mô tả**: Giao diện chính để khách hàng tìm kiếm món ăn, xem chi tiết và thực hiện đặt hàng thông qua ví điện tử SmartPay.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-FDP-01: Tra cứu món ăn và Danh mục
- Hiển thị danh mục món ăn (Tab pills) với icon sinh động.
- Tìm kiếm món ăn theo tên (Search bar) với bộ lọc thời gian thực (Debounce 500ms).

### UC-FDP-02: Xem chi tiết sản phẩm (Product Modal)
- Hiển thị thông tin chi tiết: Tên, Giá, Mô tả, Đánh giá trung bình.
- Hiển thị thông tin nhà hàng cung cấp (Logo, Tên, Địa chỉ).
- Hiển thị danh sách nhận xét (Reviews) từ các khách hàng khác.

### UC-FDP-03: Quản lý Giỏ hàng nhanh
- Cho phép điều chỉnh số lượng món muốn mua (+/-) ngay trong Modal chi tiết.
- Tính toán tổng tiền dựa trên giá và số lượng tức thì.

### UC-FDP-04: Quy trình Đặt hàng (Checkout)
- Nhập thông tin giao hàng: Địa chỉ chi tiết, Tên người nhận, Số điện thoại.
- Thêm ghi chú cho nhà hàng.
- **Thanh toán**: Sử dụng mặc định phương thức "SmartPay".
- **Định vị**: Hỗ trợ nút sử dụng vị trí GPS hiện tại (Placeholder).

### UC-FDP-05: Kiểm tra số dư và Trạng thái nhà hàng
- Hiển thị số dư ví SmartPay hiện tại trên Header để khách hàng đối soát.
- Ngăn chặn đặt hàng nếu nhà hàng đang ở trạng thái "Đóng cửa".

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Đặt món ăn (Order Food)
1. **Tên Use Case**: Tìm kiếm và đặt món ăn.
2. **Mô tả vắn tắt**: Khách hàng chọn món ăn từ các nhà hàng và thực hiện thanh toán qua ví.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Khách hàng truy cập trang "Food & Drink".
        2) Chọn Danh mục hoặc nhập tên món vào ô tìm kiếm.
        3) Nhấn vào thẻ món ăn để xem chi tiết.
        4) Chọn số lượng và nhấn "Add to Order".
        5) Nhập địa chỉ giao hàng, SĐT người nhận và ghi chú.
        6) Nhấn "Place Order via SmartPay".
        7) Hệ thống kiểm tra số dư ví. [A1]
        8) Hệ thống trừ tiền, tạo đơn hàng trạng thái "PENDING" và thông báo thành công.
    - **3.2 Các luồng rẽ nhánh**:
        1) **[A1] Số dư không đủ**: Nếu giá trị đơn hàng lớn hơn số dư ví, hệ thống báo lỗi và yêu cầu nạp thêm tiền.
4. **Tiền điều kiện**: Đã đăng nhập và có số dư ví > 0.
5. **Hậu điều kiện**: Đơn hàng được khởi tạo và gửi tới nhà hàng.
