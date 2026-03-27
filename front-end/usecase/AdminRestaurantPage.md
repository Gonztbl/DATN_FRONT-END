# Tài liệu Use Case: AdminRestaurantPage

## 1. Thông tin chung
- **Tên màn hình**: Quản lý Nhà hàng (Admin)
- **File**: `AdminRestaurantPage.jsx`
- **Role**: Admin
- **Mô tả**: Trang dành cho Quản trị viên để quản lý thông tin các nhà hàng đối tác, cấu hình hoạt động và gán quyền sở hữu cho chủ nhà hàng (Merchant).

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-ARP-01: Hiển thị danh sách nhà hàng
- Liệt kê danh sách các nhà hàng với thông tin: Tên, ID, Địa chỉ, Số lượng món ăn hiện có, và Trạng thái (Đang mở/Đóng cửa).
- Hỗ trợ phân trang.

### UC-ARP-02: Tìm kiếm và Lọc trạng thái
- Tìm kiếm theo tên nhà hàng hoặc địa chỉ.
- Lọc danh sách theo trạng thái: Tất cả, Đang mở, Đóng cửa.

### UC-ARP-03: Tạo nhà hàng mới
- Nhập thông tin: Tên nhà hàng (bắt buộc), Số điện thoại, Email, Địa chỉ (bắt buộc), Giờ mở/đóng cửa, và chọn Chủ nhà hàng từ danh sách người dùng có vai trò `RESTAURANT_OWNER`.
- Kiểm tra trùng lặp tên nhà hàng trước khi lưu.

### UC-ARP-04: Cập nhật thông tin nhà hàng
- Chỉnh sửa các thông tin đã đăng ký, bao gồm cả việc thay đổi người sở hữu hoặc trạng thái hoạt động.

### UC-ARP-05: Xóa nhà hàng
- Xóa nhà hàng sau khi xác nhận. 
- Ngăn chặn xóa hoặc hiển thị lỗi nếu nhà hàng vẫn còn dữ liệu liên quan (ví dụ: sản phẩm) nếu server yêu cầu.

### UC-ARP-06: Xuất dữ liệu (Export)
- Cho phép tải về danh sách nhà hàng dưới dạng tệp CSV dựa trên bộ lọc hiện tại.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Quản lý nhà hàng (Restaurant Management)
1. **Tên Use Case**: Thêm/Sửa/Xóa nhà hàng.
2. **Mô tả vắn tắt**: Admin thực hiện các thao tác quản trị để duy trì danh sách nhà hàng đối tác trên hệ thống.
3. **Luồng các sự kiện**:
    - **3.1 Luồng thêm nhà hàng mới**:
        1) Admin nhấn nút "Add Restaurant".
        2) Nhập các thông tin bắt buộc: Tên, Địa chỉ, Số điện thoại.
        3) Chọn chủ sở hữu từ danh sách `RESTAURANT_OWNER`. [A1]
        4) Nhấn "Save".
        5) Hệ thống kiểm tra tính hợp lệ và lưu vào cơ sở dữ liệu.
    - **3.2 Luồng xóa nhà hàng**:
        1) Admin chọn nhà hàng cần xóa.
        2) Nhấn nút "Delete" và xác nhận trong hộp thoại (SweetAlert2).
        3) Hệ thống thực hiện xóa và cập nhật danh sách.
    - **3.3 Các luồng rẽ nhánh**:
        1) **[A1] Không có chủ sở hữu hợp lệ**: Nếu danh sách chủ sở hữu trống, Admin phải tạo tài khoản Merchant trước.
4. **Tiền điều kiện**: Đăng nhập với quyền Admin.
5. **Hậu điều kiện**: Thông tin nhà hàng được cập nhật trên toàn hệ thống.
