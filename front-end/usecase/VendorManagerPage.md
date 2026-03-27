# Tài liệu Use Case: VendorManagerPage

## 1. Thông tin chung
- **Tên màn hình**: Quản lý Danh mục Ngành hàng (Admin)
- **File**: `VendorManagerPage.jsx`
- **Role**: Admin
- **Mô tả**: Cho phép Quản trị viên quản lý hệ thống phân loại sản phẩm/dịch vụ (Categories) hiển thị trên ứng dụng khách hàng.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-VMP-01: Xem danh sách danh mục
- Hiển thị bảng danh mục gồm: Icon minh họa, Tên danh mục, Thứ tự hiển thị, Số lượng sản phẩm thuộc danh mục đó.

### UC-VMP-02: Quản lý Danh mục (CRUD)
- **Thêm mới**: Nhập tên, chọn Icon từ bộ sưu tập có sẵn, đặt thứ tự hiển thị.
- **Chỉnh sửa**: Cập nhật thông tin danh mục hiện có.
- **Xóa**: Loại bỏ danh mục (Cần kiểm tra ràng buộc nếu danh mục đang chứa sản phẩm).

### UC-VMP-03: Kiểm tra định danh danh mục
- Tự động kiểm tra trùng lặp tên danh mục khi thêm mới hoặc chỉnh sửa để đảm bảo tính duy nhất.

### UC-VMP-04: Tìm kiếm và Phân trang
- Tìm kiếm danh mục theo tên hoặc ID.
- Quản lý danh sách qua cơ chế phân trang.

### UC-VMP-05: Xuất báo cáo (Export)
- Cho phép xuất danh sách danh mục ra tệp Excel (.xlsx).

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Quản lý danh mục ngành hàng (Category Management)
1. **Tên Use Case**: Thêm/Sửa/Xóa danh mục.
2. **Mô tả vắn tắt**: Admin quản lý các phân loại sản phẩm để định hướng hiển thị trên ứng dụng khách hàng.
3. **Luồng các sự kiện**:
    - **3.1 Luồng thêm danh mục**:
        1) Admin nhấn nút "Add Category".
        2) Nhập tên danh mục và chọn icon minh họa.
        3) Nhấn "Save".
        4) Hệ thống kiểm tra trùng lặp và lưu dữ liệu.
    - **3.2 Luồng xóa danh mục**:
        1) Admin chọn danh mục cần xóa.
        2) Hệ thống kiểm tra xem có sản phẩm nào đang thuộc danh mục này không. [A1]
        3) Nếu không có, hệ thống thực hiện xóa sau khi Admin xác nhận.
    - **3.3 Các luồng rẽ nhánh**:
        1) **[A1] Danh mục đang sử dụng**: Nếu danh mục có chứa sản phẩm, hệ thống báo lỗi và yêu cầu chuyển sản phẩm sang danh mục khác trước khi xóa.
4. **Tiền điều kiện**: Đăng nhập quyền Admin.
5. **Hậu điều kiện**: Danh mục được cập nhật trên trang chủ khách hàng.
