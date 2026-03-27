# Tài liệu Use Case: MerchantMenuPage

## 1. Thông tin chung
- **Tên màn hình**: Quản lý Thực đơn (Merchant Menu)
- **File**: `MerchantMenuPage.jsx`
- **Role**: Restaurant Owner (Chủ nhà hàng)
- **Mô tả**: Công cụ quản lý danh sách món ăn, cho phép chủ quán chủ động cập nhật thực đơn, giá cả và trạng thái còn/hết hàng.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-MMP-01: Hiển thị danh sách món ăn
- Liệt kê toàn bộ sản phẩm của nhà hàng dưới dạng lưới (Grid Cards).
- Mỗi thẻ món ăn hiển thị: Ảnh minh họa, Tên món, Giá bán, Mô tả ngắn, Danh mục.

### UC-MMP-02: Phân loại theo Danh mục (Filtering)
- Cung cấp các tab danh mục (All Items, Cơm, Bún, Nước, v.v.) để chủ quán dễ dàng quản lý thực đơn lớn.

### UC-MMP-03: Quản lý Sản phẩm (CRUD)
- **Thêm món mới**: Nhập tên, giá, mô tả, chọn danh mục và tải ảnh.
- **Chỉnh sửa**: Cập nhật thông tin của món ăn hiện có.
- **Xóa**: Gỡ bỏ vĩnh viễn món ăn khỏi thực đơn (có yêu cầu xác nhận).

### UC-MMP-04: Quản lý Trạng thái món ăn (Tạm ngưng bán)
- Cung cấp nút gạt để chuyển trạng thái món ăn giữa "Đang bán" (Available) và "Hết hàng" (Unavailable).
- Món ăn "Hết hàng" sẽ hiển thị hiệu ứng xám (Grayscale) và nhãn nhấp nháy trên ứng dụng khách hàng.

### UC-MMP-05: Tải lên hình ảnh sản phẩm
- Hỗ trợ chọn tệp ảnh từ thiết bị.
- Tự động chuyển đổi ảnh sang định dạng Base64 để lưu trữ.
- Giới hạn kích thước ảnh tối đa 2MB để tối ưu hiệu năng.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Quản lý thực đơn (Menu Management)
1. **Tên Use Case**: Thêm/Sửa/Xóa và cập nhật trạng thái món ăn.
2. **Mô tả vắn tắt**: Chủ cửa hàng thực hiện các thao tác quản lý danh mục món ăn để khách hàng có thể đặt mua.
3. **Luồng các sự kiện**:
    - **3.1 Luồng thêm món mới**:
        1) Chủ quán nhấn nút "Add Product".
        2) Nhập thông tin: Tên, Giá, Mô tả, Danh mục.
        3) Chọn ảnh từ thiết bị.
        4) Nhấn "Create".
        5) Hệ thống kiểm tra dữ liệu, tải ảnh lên (Base64) và lưu món mới.
    - **3.2 Luồng cập nhật trạng thái (Còn/Hết hàng)**:
        1) Chủ quán nhấn nút Switch trên thẻ món ăn.
        2) Hệ thống gửi yêu cầu cập nhật trang thái `available`.
        3) Trạng thái hiển thị thay đổi ngay lập tức trên UI.
    - **3.3 Các luồng rẽ nhánh**:
        1) **Xóa món ăn**: Chủ quán nhấn icon thùng rác, xác nhận xóa. Món ăn bị gỡ khỏi danh sách hiển thị.
4. **Tiền điều kiện**: Đã đăng nhập vào hệ thống với quyền chủ nhà hàng.
5. **Hậu điều kiện**: Thực đơn được cập nhật và hiển thị đồng bộ cho khách hàng.
