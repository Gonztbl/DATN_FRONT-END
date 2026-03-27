# Tài liệu Use Case: AdminProductPage

## 1. Thông tin chung
- **Tên màn hình**: Quản lý Món ăn (Admin)
- **File**: `AdminProductPage.jsx`
- **Role**: Admin
- **Mô tả**: Cung cấp giao diện để Quản trị viên quản lý danh sách các món ăn/sản phẩm trên toàn hệ thống, bao gồm tạo mới, cập nhật thông tin và điều chỉnh trạng thái kinh doanh.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-APP-01: Hiển thị danh sách món ăn
- Hiển thị danh sách món ăn dưới dạng bảng với các thông tin: Tên món, Danh mục, Cửa hàng, Giá bán, Đánh giá trung bình và Trạng thái.
- Hỗ trợ phân trang (Pagination) để quản lý danh sách lớn.

### UC-APP-02: Tìm kiếm và Lọc
- **Tìm kiếm**: Theo tên món ăn (với cơ chế debounce 300ms).
- **Lọc theo Danh mục**: Chọn từ danh sách các danh mục hiện có.
- **Lọc theo Cửa hàng**: Chọn từ danh sách các nhà hàng đối tác.

### UC-APP-03: Thêm món ăn mới
- Mở modal form để nhập thông tin: Tên món (bắt buộc), Mô tả, Giá (bắt buộc), Danh mục (bắt buộc), Cửa hàng (bắt buộc).
- Cho phép tải lên hình ảnh món ăn (hỗ trợ JPG, PNG, WEBP, tối đa 2MB).
- Tự động chuyển đổi ảnh sang Base64 để gửi lên server.

### UC-APP-04: Cập nhật thông tin món ăn
- Cho phép chỉnh sửa tất cả thông tin của một món ăn hiện có.
- Hiển thị thông tin cũ trong form khi mở modal chỉnh sửa.

### UC-APP-05: Xem chi tiết món ăn
- Hiển thị modal xem chi tiết đầy đủ thông tin: Ảnh lớn, tên, giá, mô tả, thông tin nhà hàng (tên, logo) và điểm đánh giá từ khách hàng.

### UC-APP-06: Thay đổi trạng thái kinh doanh (Toggle Status)
- Cho phép bật/tắt trạng thái "Còn hàng" (Available) hoặc "Ngưng bán" (Unavailable) ngay tại danh sách bằng nút gạt (switch).
- Thực hiện cập nhật tức thì (Optimistic update) và có cơ chế hoàn tác (rollback) nếu lỗi server.

### UC-APP-07: Xóa món ăn
- Cho phép xóa món ăn khỏi hệ thống sau khi đã xác nhận qua hộp thoại cảnh báo.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Quản lý sản phẩm (Product Management)
1. **Tên Use Case**: Thêm/Sửa/Xóa món ăn.
2. **Mô tả vắn tắt**: Admin thực hiện các thao tác quản trị trên danh sách món ăn của toàn bộ hệ thống.
3. **Luồng các sự kiện**:
    - **3.1 Luồng thêm món ăn**:
        1) Admin mở form thêm món ăn.
        2) Nhập: Tên, Mô tả, Giá, Danh mục.
        3) Chọn Nhà hàng sở hữu món ăn này.
        4) Tải lên hình ảnh (Base64).
        5) Nhấn "Save".
        6) Hệ thống kiểm tra và lưu dữ liệu.
    - **3.2 Luồng thay đổi trạng thái**:
        1) Admin nhấn nút gạt (Switch) tại cột Status.
        2) Hệ thống gửi yêu cầu cập nhật `available` lên server.
        3) Giao diện cập nhật ngay lập tức (Optimistic).
4. **Tiền điều kiện**: Có ít nhất một nhà hàng và danh mục tồn tại trên hệ thống.
5. **Hậu điều kiện**: Dữ liệu món ăn được cập nhật và hiển thị cho khách hàng.
