# Tài liệu Use Case: Quản lý người dùng (Admin User Management)

## 2.1.1 Mô tả use case: Xem danh sách người dùng
1. **Tên Use Case**: Xem danh sách người dùng.
2. **Mô tả vắn tắt**: Use case này cho phép Quản trị viên (Admin) xem danh sách tất cả người dùng trong hệ thống với các thông tin cơ bản.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Use case bắt đầu khi Admin truy cập vào menu "User Management".
        2) Hệ thống gọi API `getAllUsers` để lấy dữ liệu.
        3) Hệ thống hiển thị danh sách người dùng dưới dạng bảng gồm: ID, Username, Fullname, Phone, Email, Role, Created At, trạng thái (Active/Locked).
        4) Use case kết thúc.
    - **3.2 Các luồng rẽ nhánh**:
        1) Nếu không có kết nối Internet hoặc lỗi Server: Hệ thống hiển thị thông báo "Không lấy được danh sách user" trong console và bảng hiển thị "No users found".
4. **Các yêu cầu đặc biệt**: Danh sách cần được phân trang (10 người dùng/trang).
5. **Tiền điều kiện**: Admin đã đăng nhập vào hệ thống với quyền ADMIN.
6. **Hậu điều kiện**: Không có.
7. **Điểm mở rộng**: Không có.

## 2.1.2 Mô tả use case: Tìm kiếm và lọc người dùng
1. **Tên Use Case**: Tìm kiếm và lọc người dùng.
2. **Mô tả vắn tắt**: Cho phép Admin tìm kiếm người dùng theo từ khóa hoặc lọc theo vai trò (Role) và trạng thái (Status).
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Tại màn hình danh sách người dùng, Admin nhập từ khóa vào ô tìm kiếm (Username, Email, Fullname hoặc Phone).
        2) Admin chọn trạng thái (All, Active, Locked) hoặc vai trò (User, Admin, Shipper, Owner...) từ các dropdown.
        3) Hệ thống tự động lọc danh sách dựa trên các tiêu chí đã chọn và cập nhật bảng hiển thị.
        4) Use case kết thúc.
    - **3.2 Các luồng rẽ nhánh**:
        1) Nếu không có kết quả phù hợp: Hệ thống hiển thị thông báo "No users found" trong bảng.
4. **Các yêu cầu đặc biệt**: Tìm kiếm không phân biệt chữ hoa, chữ thường.
5. **Tiền điều kiện**: Admin đang ở trang danh sách người dùng.
6. **Hậu điều kiện**: Không có.
7. **Điểm mở rộng**: Không có.

## 2.1.3 Mô tả use case: Khóa/Mở khóa người dùng
1. **Tên Use Case**: Khóa/Mở khóa người dùng.
2. **Mô tả vắn tắt**: Cho phép Admin tạm dừng hoặc kích hoạt lại tài khoản của người dùng.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Admin kích vào nút Toggle (Switch) tại cột "Action" của một người dùng cụ thể.
        2) Hệ thống xác định trạng thái hiện tại (Nếu đang Active thì chuyển thành Lock, và ngược lại).
        3) Hệ thống gọi API `lockUser` hoặc `unlockUser`.
        4) Hệ thống cập nhật trạng thái mới trên giao diện và hiển thị thông báo thành công.
        5) Use case kết thúc.
    - **3.2 Các luồng rẽ nhánh**:
        1) Nếu API lỗi: Hệ thống hiển thị thông báo lỗi "Có lỗi xảy ra khi cập nhật trạng thái người dùng" qua Notification.
4. **Các yêu cầu đặc biệt**: Không có.
5. **Tiền điều kiện**: Admin đang ở trang danh sách người dùng.
6. **Hậu điều kiện**: Trạng thái `active` của người dùng được cập nhật trong cơ sở dữ liệu.
7. **Điểm mở rộng**: Không có.

## 2.1.4 Mô tả use case: Tạo tài khoản mới
1. **Tên Use Case**: Tạo tài khoản mới.
2. **Mô tả vắn tắt**: Cho phép Admin tạo tài khoản cho nhân viên, đối tác (Shipper, Merchant) hoặc người dùng mới.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Admin kích nút "Create User". Hệ thống hiển thị Form nhập liệu.
        2) Admin nhập: Username, Full Name, Email, Phone, Password, Confirm Password và chọn Role.
        3) Admin kích nút "Create Account".
        4) Hệ thống kiểm tra tính hợp lệ của dữ liệu (Validate).
        5) Hệ thống gọi API tạo tài khoản (`adminCreateUser` hoặc `adminRegister`).
        6) Hệ thống hiển thị thông báo thành công kèm số tài khoản ví (AccountNumber) và điều hướng về trang danh sách.
        7) Use case kết thúc.
    - **3.2 Các luồng rẽ nhánh**:
        1) Nếu dữ liệu không hợp lệ (ví dụ: mật khẩu dưới 8 ký tự, sai định dạng email...): Hệ thống hiển thị thông báo lỗi ngay dưới trường tương ứng.
        2) Nếu Username/Email/Phone đã tồn tại: Hệ thống hiển thị thông báo "Conflict" và báo đỏ trường dữ liệu bị trùng.
        3) Nếu lỗi kết nối: Hệ thống báo "Failed to create user. Please try again later."
4. **Các yêu cầu đặc biệt**: Password phải bao gồm cả chữ và số.
5. **Tiền điều kiện**: Admin đã đăng nhập.
6. **Hậu điều kiện**: Một tài khoản người dùng mới được tạo trong hệ thống.
7. **Điểm mở rộng**: Không có.

## 2.1.5 Mô tả use case: Xem và Cập nhật chi tiết người dùng
1. **Tên Use Case**: Xem và Cập nhật chi tiết người dùng.
2. **Mô tả vắn tắt**: Cho phép Admin xem thông tin chuyên sâu (ví, biến động số dư, sinh trắc học) và chỉnh sửa thông tin người dùng.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Admin kích vào một hàng trong bảng danh sách người dùng.
        2) Hệ thống hiển thị trang chi tiết gồm các Tab: General Info, Wallets, Biometrics, Activity Logs.
        3) Admin kích "Edit Profile" để mở modal chỉnh sửa.
        4) Admin thay đổi thông tin và nhấn "Save Changes".
        5) Hệ thống gọi API `updateUser` và cập nhật dữ liệu.
        6) Use case kết thúc.
    - **3.2 Các luồng rẽ nhánh**:
        1) Tại bất kỳ thời điểm nào nếu không tìm thấy User ID: Hệ thống hiển thị màn hình lỗi "Không tìm thấy người dùng".
        2) Nếu cập nhật thất bại: Hệ thống hiển thị thông báo lỗi qua SweetAlert.
4. **Các yêu cầu đặc biệt**: Không cho phép sửa Username (tùy thuộc logic backend, nếu có).
5. **Tiền điều kiện**: Admin đã chọn một người dùng cụ thể.
6. **Hậu điều kiện**: Thông tin người dùng được cập nhật.
7. **Điểm mở rộng**: Không có.
