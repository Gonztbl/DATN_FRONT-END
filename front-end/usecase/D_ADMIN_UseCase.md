

--- START FILE: AdminAllLoans.md ---

# Use Case: Quản lý Toàn bộ lịch sử vay vốn (Admin)

## 1. Tóm tắt
Admin quản lý và tra cứu toàn bộ hồ sơ vay vốn trong hệ thống, bao gồm cả các hồ sơ đã duyệt, bị từ chối hoặc đã hoàn tất thành công.

## 2. Các bên liên quan
*   **Tác nhân chính**: Quản trị viên (Admin).

## 3. Luồng công việc chính
1.  Admin truy cập vào trang **Toàn bộ đơn vay** (`/admin/loans/all`).
2.  Hệ thống hiển thị danh sách toàn bộ hồ sơ với đầy đủ các bộ lọc:
    *   **Trạng thái**: Đang chờ, Đã duyệt, Đã từ chối, Hoàn tất.
    *   **Mức rủi ro AI**: Thấp, Trung bình, Cao.
    *   **Tìm kiếm**: Theo tên, số điện thoại hoặc mã đơn vay.
3.  Hệ thống cung cấp các biểu đồ phân tích xu hướng:
    *   **Biểu đồ cột**: Số lượng đơn đăng ký theo các ngày trong tuần/tháng.
    *   **Biểu đồ rủi ro**: Tỷ lệ phần trăm các mức rủi ro của hồ sơ hiện tại.
4.  Admin xem chi tiết hồ sơ bằng cách nhấn nút **"Chi tiết"**.
5.  Đối với hồ sơ còn ở trạng thái `PENDING_ADMIN`, Admin có quyền duyệt hoặc từ chối ngay tại màn hình này.

## 4. Tính năng hệ thống
*   **Thống kê thời gian thực**: Cập nhật số tiền vay trung bình, số lượng đơn rủi ro cao cần chú ý.
*   **Đồng bộ dữ liệu**: Các biểu đồ tự động cập nhật khi trạng thái hồ sơ thay đổi.
*   **Lịch sử thao tác**: Ghi lại lịch sử phê duyệt và lý do từ chối để phục vụ đối soát.

## 5. UI/UX Features
*   Sử dụng font chữ Manrope hiện đại, rõ nét cho các báo cáo thống kê.
*   Giao diện Chart trực quan giúp Admin nắm bắt tình hình tài chính hệ thống nhanh chóng.


--- END FILE: AdminAllLoans.md ---


--- START FILE: AdminFaceRegisterPage.md ---

# Tài liệu Use Case: AdminFaceRegisterPage

## 1. Thông tin chung
- **Tên màn hình**: Đăng ký Sinh trắc học Khuôn mặt (Admin)
- **File**: `AdminFaceRegisterPage.jsx`
- **Role**: Admin
- **Mô tả**: Cho phép Quản trị viên thực hiện quy trình đăng ký dữ liệu khuôn mặt cho một người dùng cụ thể trong hệ thống.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-AFR-01: Hiển thị thông tin người dùng mục tiêu
- Hệ thống phải tự động lấy và hiển thị tên đầy đủ hoặc tên đăng nhập của người dùng đang được đăng ký dựa trên ID từ URL.

### UC-AFR-02: Truy cập Camera
- Hệ thống phải yêu cầu và nhận được quyền truy cập vào camera của thiết bị để thực hiện quay video trực tiếp.
- Hiển thị khung hình video trực tiếp với lớp phủ (overlay) hướng dẫn vị trí đặt khuôn mặt.

### UC-AFR-03: Đăng ký theo từng tư thế (3 bước)
- **Bước 1 (Chính diện)**: Chụp và gửi ảnh khuôn mặt nhìn thẳng.
- **Bước 2 (Nghiêng trái)**: Chụp và gửi ảnh khuôn mặt quay sang trái 45 độ.
- **Bước 3 (Nghiêng phải)**: Chụp và gửi ảnh khuôn mặt quay sang phải 45 độ.

### UC-AFR-04: Chụp và Gửi ảnh
- Khi nhấn nút "Capture", hệ thống chụp ảnh từ luồng video hiện tại.
- Tự động chuyển đổi ảnh sang định dạng Blob/File (image/jpeg).
- Gửi ảnh cùng thông tin tư thế (pose) và ID người dùng lên server thông qua `faceService`.

### UC-AFR-05: Xem trước ảnh đã chụp
- Hiển thị các ô xem trước (preview) cho từng tư thế sau khi đã được lưu thành công.

### UC-AFR-06: Hoàn tất quy trình
- Sau khi hoàn thành đủ 3 tư thế, hệ thống thông báo thành công và tự động điều hướng quay lại trang chi tiết người dùng (`UserDetailPage`).

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Đăng ký khuôn mặt Admin (Biometric Registration)
1. **Tên Use Case**: Đăng ký sinh trắc học cho người dùng.
2. **Mô tả vắn tắt**: Admin thực hiện lấy mẫu khuôn mặt 3 tư thế để phục vụ tính năng xác thực sinh trắc học.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Admin truy cập trang đăng ký khuôn mặt cho một User ID cụ thể.
        2) Hệ thống yêu cầu quyền camera và hiển thị luồng video.
        3) Admin hướng dẫn người dùng thực hiện 3 tư thế: Chính diện, Nghiêng trái, Nghiêng phải. [A1]
        4) Với mỗi tư thế, Admin nhấn "Capture".
        5) Hệ thống chụp ảnh, hiển thị preview và gửi dữ liệu lên server.
        6) Sau khi hoàn thành đủ 3 ảnh, hệ thống thông báo thành công.
        7) Tự động quay lại trang chi tiết người dùng.
    - **3.2 Các luồng rẽ nhánh**:
        1) **[A1] Lỗi camera**: Nếu không thể mở camera, hệ thống hiển thị thông báo "Camera access denied" và dừng quy trình.
4. **Tiền điều kiện**: Đăng nhập quyền Admin và User ID mục tiêu tồn tại.
5. **Hậu điều kiện**: Dữ liệu khuôn mặt được lưu trữ và gán cho người dùng tương ứng.


--- END FILE: AdminFaceRegisterPage.md ---


--- START FILE: AdminFraudAlertPage.md ---

# Use Case: Quản lý Cảnh báo Gian lận AI (Admin)

## 1. Tóm tắt
Hệ thống AI liên tục giám sát các giao dịch chuyển tiền (Transfer). Nếu phát hiện dấu hiệu bất thường, hệ thống sẽ gắn nhãn rủi ro và Admin sẽ quản lý các cảnh báo này để ngăn chặn hành vi gian lận tài chính.

## 2. Các bên liên quan
*   **Tác nhân chính**: Quản trị viên (Admin).
*   **Tác nhân hỗ trợ**: Hệ thống AI (Mô hình XGBoost đánh giá rủi ro giao dịch).

## 3. Luồng công việc chính
1.  Admin truy cập vào trang **Cảnh báo Gian lận** (`/admin/fraud-alerts`).
2.  Hệ thống hiển thị dashboard thống kê gian lận:
    *   Tổng số cảnh báo.
    *   Số giao dịch cần Review (Yêu cầu nhận diện khuôn mặt).
    *   Số giao dịch đã bị chặn (Blocked).
3.  Admin sử dụng bộ lọc để phân tích danh sách:
    *   Lọc theo **Vùng rủi ro (Zone)**: ACCEPT, REVIEW (Face verification), REJECT.
    *   Lọc theo trạng thái giao dịch: Đang chờ, Thành công, Bị chặn.
4.  Admin nhấn **"Xem"** chi tiết một cảnh báo.
5.  Hệ thống hiển thị Modal chi tiết bao gồm:
    *   Thông tin giao dịch: Người gửi, người nhận, số tiền.
    *   **Phân tích rủi ro**: Điểm số AI (Fraud Score).
    *   **Xác thực khuôn mặt**: Hiển thị kết quả Face ID nếu giao dịch rơi vào vùng REVIEW.
    *   **Features Input**: Hiển thị 13 thông số đầu vào mà mô hình AI đã sử dụng để đưa ra quyết định (Ví dụ: `hour_of_day`, `avg_balance`, `peer_transfer_ratio`...).

## 4. Quy tắc vận hành (Fraud Logic)
*   **Vùng ACCEPT**: Giao dịch rủi ro thấp, cho phép thực hiện bình thường.
*   **Vùng REVIEW**: Giao dịch có nghi ngờ, hệ thống yêu cầu người dùng xác thực khuôn mặt (FaceID) mới cho phép tiếp tục.
*   **Vùng REJECT**: Giao dịch rủi ro cực cao, hệ thống tự động chặn giao dịch ngay lập tức (BLOCKED).

## 5. UI/UX Features
*   Hệ thống "đèn giao thông" (Xanh - Vàng - Đỏ) để phân loại mức độ rủi ro trực quan.
*   Bảng hiển thị chi tiết các feature kỹ thuật giúp Admin hiểu tại sao AI đánh dấu gian lận.


--- END FILE: AdminFraudAlertPage.md ---


--- START FILE: AdminListLoans.md ---

# Use Case: Quản lý Duyệt đơn vay vốn (Admin)

## 1. Tóm tắt
Admin thực hiện xem xét các đơn vay đang ở trạng thái chờ duyệt. Admin được hỗ trợ bởi các chỉ số phân tích chuyên sâu từ AI để đưa ra quyết định chính xác nhất.

## 2. Các bên liên quan
*   **Tác nhân chính**: Quản trị viên (Admin).
*   **Tác nhân phối hợp**: Hệ thống AI (Cung cấp phân tích dữ liệu).

## 3. Luồng công việc chính
1.  Admin truy cập trang **Phê duyệt vay vốn** (`/admin/loans`).
2.  Hệ thống hiển thị dashboard thống kê nhanh:
    *   Tổng số đơn chờ duyệt.
    *   Phân loại đơn theo mức độ rủi ro (Cao, Trung bình, Thấp).
3.  Admin sử dụng bộ lọc để ưu tiên xử lý:
    *   Lọc theo mức độ rủi ro (AI Score).
    *   Tìm kiếm theo tên/số điện thoại khách hàng.
4.  Admin chọn **"Xem xét"** một đơn vay nhất định.
5.  Hệ thống hiển thị Modal chi tiết với hai tab phân tích:
    *   **Tab Thông tin**: Mục đích vay, thu nhập khai báo, thông tin khách hàng, số dư ví hiện tại.
    *   **Tab Phân tích AI**:So sánh thu nhập khai báo với dòng tiền thực tế; các chỉ số rủi ro (GD bị từ chối, biến động số dư, tuổi tài khoản).
6.  Admin đưa ra quyết định:
    *   **Duyệt**: Hệ thống giải ngân vào ví người dùng.
    *   **Từ chối**: Bắt buộc nhập lý do từ chối.
7.  Hệ thống cập nhật trạng thái và thông báo cho người dùng.

## 4. Quy tắc nghiệp vụ (Risk Management)
*   **Khớp thu nhập**: Nếu thu nhập thực tế lệch > 50% so với khai báo, AI sẽ cảnh báo đỏ "Thu nhập không khớp".
*   **Mức rủi ro**:
    *   High (Score ≥ 30%): Cần kiểm tra kỹ dòng tiền.
    *   Moderate (10% - 30%): Rủi ro trung bình.
    *   Low (< 10%): Độ tin cậy cao.

## 5. UI/UX Features
*   Biểu đồ hình tròn hiển thị tỷ lệ phân bố rủi ro.
*   Thanh progress bar đánh giá tỷ lệ chi tiêu trên thu nhập (Spend/Income Ratio).
*   Giao diện Dark Mode tối ưu cho quản trị viên.


--- END FILE: AdminListLoans.md ---


--- START FILE: AdminProductOrderManagement.md ---

# Tài liệu Use Case: Quản lý Sản phẩm và Đơn hàng (Admin Product & Order Management)

## 2.4.1 Mô tả use case: Quản lý danh mục món ăn (Products)
1. **Tên Use Case**: Quản lý danh mục món ăn toàn hệ thống.
2. **Mô tả vắn tắt**: Cho phép Admin quản lý thực đơn của tất cả các nhà hàng, bao gồm việc thêm mới, chỉnh sửa thông tin, giá cả và trạng thái kinh doanh.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản (Xem và Lọc)**:
        1) Admin truy cập "Product Management".
        2) Hệ thống hiển thị danh sách món ăn kèm các thông tin: Tên, Danh mục, Nhà hàng, Giá, Đánh giá, Trạng thái.
        3) Admin có thể lọc theo: Tên món (Search), Danh mục (Category), Nhà hàng (Restaurant).
    - **3.2 Luồng thêm món ăn mới**:
        1) Admin nhấn "Thêm món mới".
        2) Admin nhập: Tên món, Mô tả, Giá bán, Chọn Danh mục, Chọn Nhà hàng.
        3) Admin tải lên hình ảnh món ăn (Hệ thống chuyển đổi sang Base64 để lưu trữ).
        4) Admin chọn trạng thái khởi tạo (Available/Unavailable).
        5) Hệ thống lưu và thông báo thành công.
    - **3.3 Luồng chỉnh sửa**:
        1) Admin nhấn biểu tượng "Sửa" tại dòng món ăn.
        2) Hệ thống mở Modal hiển thị thông tin hiện tại.
        3) Admin thay đổi thông tin và nhấn "Lưu thay đổi".
    - **3.4 Luồng thay đổi trạng thái nhanh (Toggle Status)**:
        1) Admin nhấn vào công tắc (Toggle) tại cột Trạng thái.
        2) Hệ thống ngay lập tức cập nhật trạng thái món ăn (Available/Unavailable) mà không cần mở Modal.
    - **3.5 Các luồng rẽ nhánh**:
        1) Nếu thiếu thông tin bắt buộc: Hệ thống báo "Vui lòng điền đầy đủ thông tin bắt buộc!".
        2) Nếu ảnh quá lớn (>2MB): Hệ thống báo "Kích thước ảnh không được vượt quá 2MB".
4. **Các yêu cầu đặc biệt**: Giá bán phải là số dương. Ảnh được xử lý render an toàn từ các định dạng URL hoặc Base64.
5. **Tiền điều kiện**: Admin đã đăng nhập.
6. **Hậu điều kiện**: Dữ liệu thực đơn được cập nhật và hiển thị đúng cho khách hàng.
7. **Điểm mở rộng**: Không có.

## 2.4.2 Mô tả use case: Quản lý đơn hàng (Order Management)
1. **Tên Use Case**: Quản lý đơn hàng toàn hệ thống.
2. **Mô tả vắn tắt**: Cho phép Admin theo dõi tất cả các giao dịch đặt hàng, lọc theo trạng thái, đối tác vận chuyển hoặc nhà hàng để quản lý vận hành.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Admin truy cập "Quản lý đơn hàng".
        2) Hệ thống hiển thị danh sách đơn hàng mới nhất.
        3) Admin sử dụng bộ lọc nâng cao: Trạng thái (Pending, Confirmed, Delivering...), Nhà hàng cụ thể, Shipper cụ thể, hoặc theo Khoảng ngày.
        4) Admin có thể tìm kiếm theo Mã đơn, Tên khách hàng hoặc SĐT.
    - **3.2 Luồng xem chi tiết**:
        1) Admin nhấn biểu tượng "Xem" (Visibility) tại một đơn hàng.
        2) Hệ thống chuyển đến trang Chi tiết đơn hàng.
    - **3.3 Luồng xóa đơn hàng**:
        1) Admin nhấn "Xóa" tại một đơn hàng không hợp lệ hoặc đơn ảo.
        2) Hệ thống yêu cầu xác nhận. Nếu đồng ý, đơn hàng được gỡ khỏi hệ thống.
4. **Các yêu cầu đặc biệt**: Thông tin Khách hàng được bảo mật nhưng hiển thị đủ SĐT/Địa chỉ để hỗ trợ xử lý khi có sự cố.
5. **Tiền điều kiện**: Admin đã đăng nhập.
6. **Hậu điều kiện**: Trạng thái đơn hàng được kiểm soát.
7. **Điểm mở rộng**: Không có.

## 2.4.3 Mô tả use case: Xử lý và Hủy đơn hàng (Order Processing & Cancellation)
1. **Tên Use Case**: Xử lý và Hủy đơn hàng.
2. **Mô tả vắn tắt**: Cho phép Admin can thiệp vào quy trình xử lý đơn hàng (thay đổi trạng thái thủ công) hoặc hủy đơn hàng nếu có sự cố nghiêm trọng.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cập nhật trạng thái đơn (Manual Override)**:
        1) Tại trang Chi tiết đơn hàng, Admin chọn trạng thái mới từ Menu (ví dụ: Chuyển từ PENDING sang CONFIRMED).
        2) Admin nhấn "Lưu thay đổi".
        3) Hệ thống cập nhật trạng thái và ghi nhận vào Lịch trình đơn hàng (Status History).
    - **3.2 Luồng hủy đơn hàng và hoàn tiền**:
        1) Admin chọn lý do hủy đơn từ danh sách (Hết hàng, Khách yêu cầu, Sự cố vận hành...).
        2) Admin nhấn "Xác nhận hủy đơn hàng".
        3) Hệ thống gọi API hủy đơn.
        4) **Đặc biệt**: Nếu đơn hàng đã thanh toán qua ví, hệ thống sẽ thực hiện giao dịch hoàn tiền tự động và thông báo mã giao dịch hoàn tiền (Refund Transaction ID).
    - **3.3 Luồng theo dõi lịch trình (Timeline)**:
        1) Hệ thống hiển thị dòng thời gian (Timeline) ghi lại mọi thay đổi trạng thái kèm thời gian thực và người thực hiện.
4. **Các yêu cầu đặc biệt**: Tính năng hủy đơn yêu cầu lý do bắt buộc. Giao dịch hoàn tiền phải được đảm bảo tính nhất quán dữ liệu.
5. **Tiền điều kiện**: Đơn hàng đang ở trạng thái cho phép xử lý (không phải đã hoàn thành hoặc đã hủy trước đó).
6. **Hậu điều kiện**: Trạng thái đơn hàng được cập nhật, tiền được hoàn trả cho khách nếu có.
7. **Điểm mở rộng**: Không có.


--- END FILE: AdminProductOrderManagement.md ---


--- START FILE: AdminProductPage.md ---

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


--- END FILE: AdminProductPage.md ---


--- START FILE: AdminRestaurantManagement.md ---

# Tài liệu Use Case: Quản lý đối tác Nhà hàng và Danh mục (Admin Restaurant & Category Management)

## 2.3.1 Mô tả use case: Quản lý nhà hàng đối tác
1. **Tên Use Case**: Quản lý nhà hàng đối tác.
2. **Mô tả vắn tắt**: Cho phép Admin thêm, sửa, xóa và theo dõi trạng thái hoạt động của các nhà hàng trong hệ thống.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản (Xem và Lọc)**:
        1) Admin truy cập "Restaurant Management".
        2) Hệ thống hiển thị danh sách nhà hàng kèm bộ lọc: Theo tên, địa chỉ hoặc trạng thái (Mở/Đóng).
        3) Admin có thể nhấn "Xuất dữ liệu" để tải về file CSV danh sách nhà hàng.
    - **3.2 Luồng thêm mới**:
        1) Admin nhấn "Thêm nhà hàng".
        2) Admin nhập: Tên, SĐT, Email, Địa chỉ, Giờ mở/đóng cửa và Chọn chủ nhà hàng (từ danh sách RESTAURANT_OWNER).
        3) Hệ thống kiểm tra trùng tên nhà hàng.
        4) Nếu hợp lệ, hệ thống lưu và thông báo thành công.
    - **3.3 Luồng chỉnh sửa**:
        1) Admin nhấn biểu tượng "Edit" tại một nhà hàng.
        2) Hệ thống hiển thị Modal chứa thông tin cũ.
        3) Admin sửa thông tin và nhấn "Lưu".
    - **3.4 Luồng xóa**:
        1) Admin nhấn biểu tượng "Delete".
        2) Hệ thống hiển thị xác nhận. Nếu Admin đồng ý, hệ thống gọi API xóa.
    - **3.5 Các luồng rẽ nhánh**:
        1) Nếu xóa nhà hàng đang có sản phẩm: Hệ thống báo lỗi "Không thể xóa nhà hàng. Có thể nhà hàng này đang chứa sản phẩm."
        2) Nếu trùng tên nhà hàng: Hệ thống báo "Tên nhà hàng ... đã tồn tại!"
4. **Các yêu cầu đặc biệt**: Chủ nhà hàng phải được chọn từ danh sách người dùng có vai trò `RESTAURANT_OWNER`.
5. **Tiền điều kiện**: Admin đã đăng nhập.
6. **Hậu điều kiện**: Thông tin nhà hàng được cập nhật.
7. **Điểm mở rộng**: Không có.

## 2.3.2 Mô tả use case: Quản lý danh mục sản phẩm (Category)
1. **Tên Use Case**: Quản lý danh mục sản phẩm.
2. **Mô tả vắn tắt**: Cho phép Admin định nghĩa các loại hình dịch vụ hoặc nhóm sản phẩm (như Đồ ăn, Đồ uống, Đồ gia dụng...) để phân loại trên App khách hàng.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Admin truy cập "Category Management".
        2) Hệ thống hiển thị bảng danh sách: Biểu tượng (Icon), Tên danh mục, Thứ tự hiển thị, Số lượng sản phẩm liên kết.
        3) Admin có thể tìm kiếm theo tên hoặc mã danh mục.
    - **3.2 Luồng thêm/sửa danh mục**:
        1) Admin nhấn "Thêm danh mục" hoặc "Sửa".
        2) Admin nhập Tên, chọn Biểu tượng từ bộ sưu tập có sẵn và nhập Thứ tự hiển thị.
        3) Hệ thống kiểm tra trùng tên danh mục.
        4) Admin nhấn "Lưu".
    - **3.3 Luồng xóa**:
        1) Admin nhấn "Xóa" và xác nhận.
        2) Hệ thống xóa danh mục khỏi cơ sở dữ liệu.
    - **3.4 Các luồng rẽ nhánh**:
        1) Nếu danh mục đang có sản phẩm: Hệ thống ngăn chặn việc xóa và báo lỗi.
4. **Các yêu cầu đặc biệt**: Biểu tượng được chọn từ bộ icon chuẩn (Material Symbols).
5. **Tiền điều kiện**: Admin đã đăng nhập.
6. **Hậu điều kiện**: Cấu trúc danh mục hệ thống được cập nhật.
7. **Điểm mở rộng**: Không có.


--- END FILE: AdminRestaurantManagement.md ---


--- START FILE: AdminRestaurantPage.md ---

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


--- END FILE: AdminRestaurantPage.md ---


--- START FILE: AdminTransactionHistoryPage.md ---

# Tài liệu Use Case: AdminTransactionHistoryPage

## 1. Thông tin chung
- **Tên màn hình**: Lịch sử Giao dịch Toàn hệ thống (Admin)
- **File**: `AdminTransactionHistoryPage.jsx`
- **Role**: Admin
- **Mô tả**: Cho phép Quản trị viên theo dõi, giám sát và kiểm tra tất cả các giao dịch tài chính (Nạp, Rút, Chuyển tiền) diễn ra trong hệ thống SmartPay.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-ATH-01: Hiển thị danh sách giao dịch
- Hiển thị bảng giao dịch theo thứ tự thời gian mới nhất lên đầu.
- Các cột thông tin: STT, Mã giao dịch (Transaction ID), Mã ví (Wallet ID), Số tiền, Trạng thái, Loại giao dịch, Thời gian tạo.

### UC-ATH-02: Bộ lọc giao dịch chuyên sâu
- **Theo Mã**: Tìm kiếm chính xác hoặc gần đúng theo Transaction ID hoặc Wallet ID.
- **Theo Trạng thái**: Tất cả, Thành công (Complete), Đang xử lý (Pending), Thất bại (Failed).
- **Theo Loại**: Tất cả, Nạp tiền (Deposit), Rút tiền (Withdraw), Nhận tiền (Transfer In), Chuyển tiền (Transfer Out).

### UC-ATH-03: Xem chi tiết giao dịch
- Hiển thị Modal chi tiết khi nhấn nút "View":
    - Banner trạng thái với màu sắc tương ứng.
    - Thông tin định danh: Transaction ID, Reference ID, Wallet ID, User ID.
    - Thông tin tài chính: Số tiền, Hướng tiền (Vào/Ra), Tên đối tác (Partner Name).
    - Ghi chú (Note) và thời gian thực hiện chính xác.

### UC-ATH-04: Phân trang
- Phân chia danh sách thành nhiều trang (mặc định 10 mục/trang) để đảm bảo tốc độ tải.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Giám sát giao dịch (Transaction Monitoring)
1. **Tên Use Case**: Tra cứu lịch sử giao dịch toàn hệ thống.
2. **Mô tả vắn tắt**: Admin theo dõi và kiểm tra các biến động số dư của tất cả người dùng để đảm bảo tính minh bạch.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Admin truy cập trang Lịch sử giao dịch.
        2) Hệ thống tải danh sách giao dịch mới nhất (phân trang).
        3) Admin nhập mã giao dịch (Transaction ID) hoặc mã ví (Wallet ID) để tìm kiếm.
        4) Admin chọn bộ lọc Loại giao dịch (Nạp/Rút/Chuyển) để thu hẹp phạm vi.
        5) Hệ thống hiển thị kết quả tương ứng.
        6) Admin nhấn "View" để xem chi tiết thông tin đối tác và ghi chú.
4. **Tiền điều kiện**: Đăng nhập với quyền Admin.
5. **Hậu điều kiện**: Không có.


--- END FILE: AdminTransactionHistoryPage.md ---


--- START FILE: AdminUserCreatePage.md ---

# Tài liệu Use Case: AdminUserCreatePage

## 1. Thông tin chung
- **Tên màn hình**: Tạo Tài khoản Người dùng (Admin)
- **File**: `AdminUserCreatePage.jsx`
- **Role**: Admin
- **Mô tả**: Cho phép Quản trị viên khởi tạo tài khoản mới cho các đối tượng trong hệ thống (Người dùng, Tài xế, Nhân viên hỗ trợ, Chủ nhà hàng).

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-AUCP-01: Nhập liệu thông tin cơ bản
- Hỗ trợ nhập các trường: Tên đăng nhập (Username), Họ tên đầy đủ (Full Name), Email, Số điện thoại.

### UC-AUCP-02: Thiết lập mật khẩu
- Cho phép nhập mật khẩu và xác nhận lại mật khẩu.
- Hỗ trợ tính năng ẩn/hiện mật khẩu để kiểm tra độ chính xác khi nhập.

### UC-AUCP-03: Chọn vai trò hệ thống (Role)
- Quản trị viên chọn một trong các vai trò: `USER`, `SHIPPER`, `SUPPORT`, `RESTAURANT_OWNER`.
- Giao diện cung cấp các thẻ chọn vai trò kèm icon trực quan.

### UC-AUCP-04: Kiểm tra tính hợp lệ (Validation)
- **Username**: 4-20 ký tự, chỉ gồm chữ cái, số và dấu gạch dưới.
- **Email**: Đúng định dạng email tiêu chuẩn.
- **Số điện thoại**: Định dạng Việt Nam (bắt đầu bằng số 0, 10-11 số).
- **Mật khẩu**: Tối thiểu 8 ký tự, bao gồm cả chữ và số.
- **Xác nhận mật khẩu**: Phải khớp hoàn toàn với mật khẩu đã nhập.

### UC-AUCP-05: Xử lý trùng lặp (Conflict Handling)
- Hệ thống phải phát hiện và hiển thị lỗi cụ thể nếu Email, Username hoặc Số điện thoại đã tồn tại trong hệ thống (lỗi 409 từ server).

### UC-AUCP-06: Hồ sơ thành công
- Sau khi tạo thành công, hiển thị thông báo kèm Mã số tài khoản (AccountNumber) và điều hướng về trang quản lý người dùng.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Tạo tài khoản người dùng mới (Admin)
1. **Tên Use Case**: Khởi tạo tài khoản hệ thống.
2. **Mô tả vắn tắt**: Admin tạo tài khoản cho các đối tượng người dùng khác nhau để họ có thể tham gia vào hệ thống.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Admin truy cập trang "Create User".
        2) Chọn vai trò (Role) cho tài khoản mới.
        3) Nhập đầy đủ thông tin: Username, Full Name, Email, Phone, Password.
        4) Nhấn "Create Account".
        5) Hệ thống kiểm tra tính duy nhất của Username/Email/SĐT. [A1]
        6) Hệ thống tạo tài khoản, khởi tạo ví điện tử và hiển thị thông báo thành công.
        7) Tự động quay lại trang danh sách người dùng.
    - **3.2 Các luồng rẽ nhánh**:
        1) **[A1] Dữ liệu đã tồn tại**: Nếu Email hoặc Username đã có người sử dụng, hệ thống báo đỏ trường tương ứng và yêu cầu nhập lại.
4. **Tiền điều kiện**: Đăng nhập quyền Admin.
5. **Hậu điều kiện**: Một tài khoản mới và một ví điện tử mới được tạo thành công.


--- END FILE: AdminUserCreatePage.md ---


--- START FILE: AdminUserManagement.md ---

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


--- END FILE: AdminUserManagement.md ---


--- START FILE: AdminVerifyFacePage.md ---

# Tài liệu Use Case: AdminVerifyFacePage

## 1. Thông tin chung
- **Tên màn hình**: Kiểm tra Xác thực Khuôn mặt (Admin)
- **File**: `AdminVerifyFacePage.jsx`
- **Role**: Admin
- **Mô tả**: Công cụ dành cho Quản trị viên để kiểm tra tính chính xác của dữ liệu sinh trắc học đã đăng ký bằng cách thực hiện xác thực thực tế tại chỗ.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-AVFP-01: Nhận diện người dùng mục tiêu
- Hiển thị thông tin người dùng đang được kiểm tra (Họ tên/Username/ID) để đảm bảo Admin thực hiện đúng đối tượng.

### UC-AVFP-02: Truyền phát Camera
- Tự động kích hoạt camera ngay khi vào trang.
- Hiển thị khung định vị (Overlay) hình oval để người dùng căn chỉnh khuôn mặt.

### UC-AVFP-03: Chụp và So khớp (Recognition)
- Chụp ảnh khuôn mặt từ luồng video và gửi lên `faceService` cùng với ID người dùng để so sánh với các embedding đã lưu.

### UC-AVFP-04: Hiển thị kết quả chi tiết
- **Trường hợp khớp mẫu (Match Found)**: Hiển thị trạng thái thành công (màu xanh) kèm điểm số tương đồng (Similarity Score) tính theo tỷ lệ %.
- **Trường hợp không khớp (No Match)**: Hiển thị trạng thái thất bại (màu đỏ) kèm thông báo lỗi từ server.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Kiểm tra xác thực khuôn mặt (Admin)
1. **Tên Use Case**: Xác minh sinh trắc học thực tế.
2. **Mô tả vắn tắt**: Admin thực hiện quét mặt người dùng tại chỗ để kiểm tra độ tin cậy của thuật toán và dữ liệu đã lưu.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Admin truy cập trang "Verify Face" cho một User ID.
        2) Hệ thống mở camera và hiển thị khung oval.
        3) Người dùng đưa mặt vào khung hình.
        4) Hệ thống tự động chụp ảnh và gửi so khớp.
        5) Hệ thống hiển thị điểm số Similarity (Ví dụ: 95.5%). [A1]
        6) Hệ thống báo "Match" (Xanh) nếu trên ngưỡng cho phép.
    - **3.2 Các luồng rẽ nhánh**:
        1) **[A1] Không khớp**: Nếu điểm số thấp, hệ thống báo "No Match" (Đỏ) và yêu cầu kiểm tra lại dữ liệu mẫu.
4. **Tiền điều kiện**: Đã đăng nhập Admin và User đã có dữ liệu khuôn mặt.
5. **Hậu điều kiện**: Không có.


--- END FILE: AdminVerifyFacePage.md ---


--- START FILE: AdminWalletManagement.md ---

# Tài liệu Use Case: Quản lý Ví và Giao dịch (Admin Wallet & Transaction Management)

## 2.2.1 Mô tả use case: Xem danh sách ví điện tử
1. **Tên Use Case**: Xem danh sách ví điện tử.
2. **Mô tả vắn tắt**: Cho phép Admin xem danh sách tất cả các ví điện tử trong hệ thống kèm số dư và trạng thái.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Admin truy cập menu "Wallet Management".
        2) Hệ thống gọi API `getAllWallets` để lấy dữ liệu (tối đa 1000 bản ghi để phục vụ lọc tại client).
        3) Hệ thống hiển thị bảng gồm: ID, Account Number, User ID, Balance (VND), Status, Created At.
        4) Use case kết thúc.
    - **3.2 Các luồng rẽ nhánh**:
        1) Nếu lỗi tải dữ liệu: Hệ thống hiển thị thông báo "Failed to load wallets."
4. **Các yêu cầu đặc biệt**: Số dư phải được định dạng theo tiền tệ VND (ví dụ: 1.000.000 ₫).
5. **Tiền điều kiện**: Admin đã đăng nhập.
6. **Hậu điều kiện**: Không có.
7. **Điểm mở rộng**: Không có.

## 2.2.2 Mô tả use case: Nạp tiền vào ví (Admin Topup)
1. **Tên Use Case**: Nạp tiền vào ví (Admin Topup).
2. **Mô tả vắn tắt**: Cho phép Admin cộng tiền trực tiếp vào ví của người dùng trong các trường hợp đặc biệt (khuyến mãi, hoàn tiền thủ công...).
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Admin chọn một ví trong danh sách và kích nút "Topup".
        2) Hệ thống hiển thị Modal "Topup Wallet" kèm thông tin ví hiện tại.
        3) Admin nhập số tiền cần nạp.
        4) Admin kích nút "Topup" trong modal.
        5) Hệ thống gọi API `adminTopupWallet`.
        6) Hệ thống hiển thị thông báo thành công kèm chi tiết: Số tiền đã nạp, Số dư trước và sau khi nạp.
        7) Use case kết thúc.
    - **3.2 Các luồng rẽ nhánh**:
        1) Nếu Admin nhập số tiền nhỏ hơn hoặc bằng 0: Hệ thống báo lỗi "Please enter a valid amount greater than 0".
        2) Nếu API phản hồi lỗi: Hệ thống hiển thị Modal thông báo thất bại kèm lý do lỗi từ Server.
4. **Các yêu cầu đặc biệt**: Cung cấp các nút chọn nhanh số tiền (100k, 500k, 1M).
5. **Tiền điều kiện**: Ví mục tiêu đang ở trạng thái ACTIVE.
6. **Hậu điều kiện**: Số dư khả dụng của ví được cập nhật tăng lên.
7. **Điểm mở rộng**: Không có.

## 2.2.3 Mô tả use case: Khóa/Mở khóa ví
1. **Tên Use Case**: Khóa/Mở khóa ví.
2. **Mô tả vắn tắt**: Cho phép Admin đóng băng hoặc kích hoạt lại một ví điện tử.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Admin kích vào nút Toggle tại hàng tương ứng của ví.
        2) Hệ thống xác định: Nếu ví đang ACTIVE thì gọi `lockWallet`, nếu đang LOCKED/FROZEN thì gọi `unlockWallet`.
        3) Hệ thống cập nhật trạng thái mới trên bảng.
        4) Use case kết thúc.
    - **3.2 Các luồng rẽ nhánh**:
        1) Nếu lỗi: Hệ thống báo "Failed to update wallet status. Please try again."
4. **Các yêu cầu đặc biệt**: Không có.
5. **Tiền điều kiện**: Admin đã đăng nhập.
6. **Hậu điều kiện**: Trạng thái ví được cập nhật trong DB.
7. **Điểm mở rộng**: Không có.

## 2.2.4 Mô tả use case: Xem lịch sử giao dịch hệ thống
1. **Tên Use Case**: Xem lịch sử giao dịch hệ thống.
2. **Mô tả vắn tắt**: Cho phép Admin theo dõi tất cả các luồng tiền (Nạp, Rút, Chuyển) của toàn bộ người dùng.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Admin truy cập menu "Transaction History".
        2) Hệ thống gọi API `getAllAdminTransactions`.
        3) Hệ thống sắp xếp giao dịch mới nhất lên đầu và hiển thị trong bảng.
        4) Admin có thể tìm kiếm theo Transaction ID hoặc Wallet ID.
        5) Use case kết thúc.
    - **3.2 Các luồng rẽ nhánh**:
        1) Nếu không có kết nối: Hệ thống báo "Failed to load transactions."
4. **Các yêu cầu đặc biệt**: Phân biệt màu sắc cho số tiền (Xanh cho tiền vào, Đỏ cho tiền ra).
5. **Tiền điều kiện**: Admin đã đăng nhập.
6. **Hậu điều kiện**: Không có.
7. **Điểm mở rộng**: Không có.

## 2.2.5 Mô tả use case: Xem chi tiết giao dịch
1. **Tên Use Case**: Xem chi tiết giao dịch.
2. **Mô tả vắn tắt**: Xem thông tin đối tác, ghi chú và mã tham chiếu của một giao dịch cụ thể.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Admin kích nút "View" tại một hàng giao dịch.
        2) Hệ thống hiển thị Modal "Transaction Details" gồm: ID, Reference ID, Wallet ID, User ID, Type, Direction, Partner Name, Note, Created At và kết quả (Success/Fail).
        3) Admin xem xong và kích "Close".
        4) Use case kết thúc.
    - **3.2 Các luồng rẽ nhánh**: Không có.
4. **Các yêu cầu đặc biệt**: Hiển thị Note (Ghi chú) đầy đủ trong khung riêng.
5. **Tiền điều kiện**: Admin đang ở trang lịch sử giao dịch.
6. **Hậu điều kiện**: Không có.
7. **Điểm mở rộng**: Không có.


--- END FILE: AdminWalletManagement.md ---


--- START FILE: AdminWalletPage.md ---

# Tài liệu Use Case: AdminWalletPage

## 1. Thông tin chung
- **Tên màn hình**: Quản lý Ví SmartPay (Admin)
- **File**: `AdminWalletPage.jsx`
- **Role**: Admin
- **Mô tả**: Trung tâm quản lý tài chính cho phép Quản trị viên theo dõi số dư, kiểm soát trạng thái ví của tất cả người dùng và thực hiện nạp tiền thủ công khi cần thiết.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-AWP-01: Hiển thị danh sách ví
- Liệt kê toàn bộ ví trong hệ thống với các thông tin: ID Ví, Số tài khoản, ID Người dùng, Số dư khả dụng, Trạng thái và Ngày tạo.

### UC-AWP-02: Tìm kiếm và Lọc ví
- Cho phép tìm kiếm nhanh theo ID, UserID hoặc Số tài khoản.
- Lọc theo trạng thái: Tất cả, Hoạt động (Active), Bị khóa/Đóng băng (Locked/Frozen).

### UC-AWP-03: Đóng băng/Kích hoạt ví (Toggle Lock)
- Cho phép khóa ví ngay lập tức để ngăn chặn giao dịch nếu phát hiện nghi vấn.
- Cho phép mở khóa ví để khôi phục hoạt động bình thường.
- Sử dụng nút gạt (Switch) màu xanh/đỏ để thể hiện trực quan trạng thái hiện tại.

### UC-AWP-04: Nạp tiền vào ví (Topup)
- Mở modal cho phép nạp tiền cho một ví cụ thể.
- Cung cấp các nút gợi ý số tiền nhanh (100k, 500k, 1M).
- Hiển thị tóm tắt thông tin ví (Số dư hiện tại, Số tài khoản) trong modal nạp tiền.

### UC-AWP-05: Thông báo kết quả nạp tiền
- Sau khi nạp tiền, hiển thị modal thông báo kết quả chi tiết bao gồm: Số tiền đã nạp, Số dư cũ và Số dư mới sau giao dịch.

## 3. Yêu cầu phi chức năng (Non-functional Requirements)

### NFR-AWP-01: Hiệu năng xử lý danh sách lớn
- Thực hiện fetch dữ liệu số lượng lớn (ví dụ 1000 bản ghi) một lần để hỗ trợ tìm kiếm và lọc tức thì tại máy khách (Client-side filtering).

### NFR-AWP-02: Tính bảo mật tài chính
- Mọi thao tác nạp tiền hoặc khóa ví phải được xác nhận lại và ghi nhật ký hệ thống.
- Chỉ hiển thị số dư dưới dạng tiền tệ Việt Nam (VND).

### NFR-AWP-03: UX/UI
- Sử dụng font chữ Monospace cho Số tài khoản để dễ đọc và phân biệt các chữ số tương tự nhau.
- Scrollbar tùy chỉnh để không làm ảnh hưởng đến thẩm mỹ giao diện trang quản trị.


--- END FILE: AdminWalletPage.md ---


--- START FILE: ListOrderAdmin.md ---

# Tài liệu Use Case: ListOrderAdmin

## 1. Thông tin chung
- **Tên màn hình**: Quản lý Đơn hàng Toàn hệ thống (Admin)
- **File**: `ListOrderAdmin.jsx`
- **Role**: Admin
- **Mô tả**: Trung tâm giám sát đơn hàng cho phép Quản trị viên theo dõi luồng vận hành của tất cả các đơn hàng từ khi khách đặt đến khi giao hàng thành công.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-LOA-01: Hiển thị danh sách đơn hàng tổng thể
- Liệt kê đơn hàng với các cột: Mã đơn (#ID), Khách hàng, Nhà hàng, Shipper, Tổng tiền, Trạng thái, và Thời gian tạo.

### UC-LOA-02: Hệ thống bộ lọc chuyên sâu
- **Theo trạng thái**: Pending, Confirmed, Preparing, Delivering, Completed, Cancelled, Delivery Failed.
- **Theo chủ thể**: Lọc đơn hàng của một Nhà hàng cụ thể hoặc một Shipper cụ thể.
- **Theo thời gian**: Lọc đơn hàng phát sinh trong khoảng thời gian (Từ ngày - Đến ngày).

### UC-LOA-03: Tìm kiếm thông minh
- Hỗ trợ tìm kiếm theo Mã đơn hàng, Tên người nhận, Số điện thoại hoặc Tên đăng nhập của khách hàng.

### UC-LOA-04: Xem chi tiết và Xóa đơn
- Điều hướng nhanh đến trang chi tiết để xử lý đơn hàng.
- Cho phép xóa đơn hàng khỏi hệ thống sau khi xác nhận (dành cho quản trị cấp cao).

### UC-LOA-05: Phân trang dữ liệu
- Quản lý danh sách hàng nghìn đơn hàng thông qua cơ chế phân trang của API.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Giám sát đơn hàng toàn hệ thống (Admin)
1. **Tên Use Case**: Tra cứu và quản lý đơn hàng.
2. **Mô tả vắn tắt**: Admin theo dõi toàn bộ luồng đơn hàng và can thiệp nếu cần thiết (xóa đơn/kiểm tra lỗi).
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Admin truy cập trang "Order Management".
        2) Hệ thống hiển thị danh sách tất cả các đơn hàng.
        3) Admin sử dụng ô tìm kiếm để lọc theo Mã đơn, Tên khách, SĐT.
        4) Admin chọn bộ lọc Trạng thái (Pending, Delivered...) hoặc lọc theo Nhà hàng/Shipper.
        5) Admin nhấn "View" để xem chi tiết hoặc "Delete" để xóa đơn (sau khi xác nhận).
4. **Tiền điều kiện**: Đăng nhập quyền Admin.
5. **Hậu điều kiện**: Không có.


--- END FILE: ListOrderAdmin.md ---


--- START FILE: UserManagePage.md ---

# Tài liệu Use Case: UserManagePage

## 1. Thông tin chung
- **Tên màn hình**: Danh sách Người dùng (Admin)
- **File**: `UserManagePage.jsx`
- **Role**: Admin
- **Mô tả**: Trang tổng quan cho phép Quản trị viên quản trị toàn bộ người dùng trong hệ thống, cung cấp cái nhìn đa chiều về vai trò và trạng thái tài khoản.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-UMP-01: Hiển thị danh sách người dùng
- Hiển thị bảng danh sách với thông tin: ID, Username, Họ tên, SĐT, Email, Vai trò, Ngày tạo và Trạng thái.
- Hỗ trợ phân trang 10 người dùng trên mỗi trang.

### UC-UMP-02: Tìm kiếm đa trường
- Tìm kiếm đồng thời trên các trường: Username, Email, Họ tên và Số điện thoại.

### UC-UMP-03: Bộ lọc nâng cao
- **Lọc theo Trạng thái**: Hoạt động, Bị khóa.
- **Lọc theo Vai trò**: Quản trị viên, Người dùng, Tài xế, Chủ nhà hàng, Nhân viên hỗ trợ.

### UC-UMP-04: Quản lý trạng thái khóa (Lock/Unlock)
- Cho phép Quản trị viên bật/tắt quyền truy cập của người dùng ngay tại danh sách.

### UC-UMP-05: Điều hướng chi tiết
- Khi nhấn vào một hàng trong bảng, hệ thống điều hướng đến trang Chi tiết người dùng tương ứng.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Quản lý người dùng (Admin)
1. **Tên Use Case**: Tra cứu và quản lý tài khoản.
2. **Mô tả vắn tắt**: Admin thực hiện giám sát danh sách người dùng, lọc theo vai trò và kiểm soát trạng thái hoạt động.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Admin truy cập trang "User Management".
        2) Hệ thống hiển thị danh sách toàn bộ người dùng.
        3) Admin sử dụng ô tìm kiếm để lọc theo Tên/Email/SĐT.
        4) Admin chọn Role (ví dụ: Shipper) để xem danh sách tài xế.
        5) Admin nhấn nút Gạt (Switch) để Khóa/Mở khóa một tài khoản.
        6) Hệ thống cập nhật trạng thái ngay lập tức trên UI.
4. **Tiền điều kiện**: Đăng nhập quyền Admin.
5. **Hậu điều kiện**: Trạng thái người dùng được cập nhật.


--- END FILE: UserManagePage.md ---


--- START FILE: UserDetailPage.md ---

# Tài liệu Use Case: UserDetailPage

## 1. Thông tin chung
- **Tên màn hình**: Chi tiết Hồ sơ Người dùng (Admin)
- **File**: `UserDetailPage.jsx`
- **Role**: Admin
- **Mô tả**: Cung cấp cái nhìn 360 độ về một người dùng, bao gồm thông tin cá nhân, dữ liệu sinh trắc học, tài chính (ví) và lịch sử hoạt động.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-UDP-01: Hiển thị thông tin hồ sơ chi tiết
- Hiển thị đầy đủ thông tin: ID hệ thống, Username, Họ tên, Email, Số điện thoại, Vai trò, Ngày tạo tài khoản và Trạng thái hiện tại.

### UC-UDP-02: Chỉnh sửa thông tin người dùng
- Cung cấp Modal chỉnh sửa cho phép Admin cập nhật lại Username, Họ tên, Email, SĐT và thay đổi trạng thái hoạt động của người dùng.

### UC-UDP-03: Quản lý Sinh trắc học (Biometrics)
- Liệt kê danh sách các mẫu khuôn mặt (embeddings) đã đăng ký.
- Cho phép xóa từng mẫu ảnh hoặc xóa tất cả (Reset) dữ liệu khuôn mặt của user.
- Tắt/Mở nhanh tính năng xác thực khuôn mặt từ trang này.

### UC-UDP-04: Quản lý Ví và Số dư
- Hiển thị các thẻ Ví liên kết với người dùng.
- Cho phép xem số dư khả dụng và thực hiện nạp tiền nhanh thông qua điều hướng đến trung tâm quản lý ví.

### UC-UDP-05: Truy soát lịch sử giao dịch
- Hiển thị danh sách 10 giao dịch gần nhất của người dùng này (Loại giao dịch, Số tiền, Trạng thái, Thời gian).

### UC-UDP-06: Xóa người dùng
- Cho phép xóa hoàn toàn người dùng khỏi hệ thống (trừ vai trò ADMIN).
- Yêu cầu xác nhận qua hộp thoại Confirm trước khi thực hiện hành động xóa.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Quản lý chi tiết người dùng (Admin)
1. **Tên Use Case**: Truy soát và cập nhận thông tin User.
2. **Mô tả vắn tắt**: Admin xem toàn bộ thông tin của một người dùng cụ thể và thực hiện các điều chỉnh cần thiết.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Admin chọn một người dùng từ danh sách quản lý.
        2) Hệ thống hiển thị trang Chi tiết với các Tab chức năng.
        3) Admin chuyển đổi giữa các Tab để xem: Thông tin chung, Ví, Sinh trắc học, Lịch sử.
        4) Admin nhấn "Edit" để mở form chỉnh sửa thông tin.
        5) Admin nhấn "Delete" để xóa tài khoản (sau khi xác nhận). [A1]
    - **3.2 Các luồng rẽ nhánh**:
        1) **[A1] Xóa tài khoản Admin**: Nếu tài khoản mục tiêu là Admin, nút xóa sẽ bị ẩn hoặc vô hiệu hóa để bảo vệ hệ thống.
4. **Tiền điều kiện**: Đăng nhập quyền Admin.
5. **Hậu điều kiện**: Thông tin người dùng được cập nhật hoặc tài khoản bị xóa khỏi hệ thống.


--- END FILE: UserDetailPage.md ---


--- START FILE: ViewOrderByAdmin.md ---

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


--- END FILE: ViewOrderByAdmin.md ---


--- START FILE: VendorManagerPage.md ---

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


--- END FILE: VendorManagerPage.md ---
