

--- START FILE: MerchantDashboardPage.md ---

# Tài liệu Use Case: MerchantDashboardPage

## 1. Thông tin chung
- **Tên màn hình**: Bảng điều khiển Chủ nhà hàng (Merchant Dashboard)
- **File**: `MerchantDashboardPage.jsx`
- **Role**: Restaurant Owner (Chủ nhà hàng)
- **Mô tả**: Trang quản trị trung tâm dành cho chủ cửa hàng để theo dõi tình hình kinh doanh, doanh thu và kiểm soát trạng thái hoạt động của quán.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-MDP-01: Kiểm soát trạng thái cửa hàng (Open/Closed)
- Cung cấp nút gạt (Toggle Switch) để mở hoặc đóng cửa quán trên ứng dụng khách hàng.
- **Xác nhận hành động**: Hiển thị hộp thoại cảnh báo (Swal) trước khi thay đổi trạng thái để tránh nhầm lẫn.

### UC-MDP-02: Theo dõi Số dư Ví SmartPay
- Hiển thị số dư thực tế mà chủ quán nhận được (sau khi trừ chiết khấu hệ thống).
- Hiển thị xu hướng thay đổi số dư theo tỷ lệ % hàng tháng.

### UC-MDP-03: Thống kê doanh thu và đơn hàng
- **Doanh thu hôm nay**: Tổng tiền thu được từ các đơn hàng thành công trong ngày (tính 95% giá trị đơn).
- **Đơn hàng mới**: Số lượng đơn hàng phát sinh trong ngày.
- **Đang xử lý**: Tổng số đơn hàng ở trạng thái Chờ duyệt hoặc Đang chuẩn bị món.

### UC-MDP-04: Biểu đồ doanh thu tuần
- Hiển thị biểu đồ cột (Bar Chart) minh họa doanh thu của 7 ngày gần nhất.
- Hỗ trợ định dạng số tiền rút gọn (M cho triệu, K cho ngàn) để giao diện gọn gàng.

### UC-MDP-05: Danh sách đơn hàng gần đây
- Liệt kê 5 đơn hàng mới nhất với các thông tin: Mã đơn, Thời gian, Tên khách hàng, Tổng tiền, Trạng thái.
- Cho phép xem nhanh chi tiết đơn hàng bằng một cú click.

### UC-MDP-06: Xử lý tài khoản chưa có quán
- Trường hợp tài khoản chủ quán chưa được liên kết với nhà hàng nào, hệ thống phải hiển thị màn hình thông báo lỗi và hướng dẫn liên hệ Quản trị viên.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Quản lý hoạt động cửa hàng (Merchant Dashboard)
1. **Tên Use Case**: Theo dõi và điều phối cửa hàng.
2. **Mô tả vắn tắt**: Chủ cửa hàng xem doanh thu, số lượng đơn hàng và điều chỉnh trạng thái đóng/mở cửa.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Chủ quán đăng nhập và vào trang Dashboard.
        2) Hệ thống hiển thị các chỉ số: Doanh thu ngày, Đơn hàng mới, Số dư ví.
        3) Chủ quán nhấn nút Toggle để thay đổi trạng thái "Open/Closed".
        4) Hệ thống hiển thị hộp thoại xác nhận.
        5) Chủ quán xác nhận, hệ thống cập nhật trạng thái cửa hàng trên toàn ứng dụng.
4. **Tiền điều kiện**: Tài khoản đã được gán quyền chủ nhà hàng và đã liên kết với một cụm nhà hàng.
5. **Hậu điều kiện**: Trạng thái cửa hàng thay đổi ảnh hưởng đến khả năng đặt hàng của khách.


--- END FILE: MerchantDashboardPage.md ---


--- START FILE: MerchantManagement.md ---

# Tài liệu Use Case: Quản lý Nhà hàng (Merchant Management)

## 2.5.1 Mô tả use case: Theo dõi doanh thu và trạng thái cửa hàng (Dashboard)
1. **Tên Use Case**: Theo dõi doanh thu và trạng thái cửa hàng.
2. **Mô tả vắn tắt**: Cho phép Chủ nhà hàng xem tổng quan hiệu quả kinh doanh, số dư ví và điều chỉnh trạng thái hoạt động của quán (Đóng/Mở cửa).
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản (Xem thống kê)**:
        1) Chủ nhà hàng truy cập Dashboard.
        2) Hệ thống hiển thị các chỉ số: Số dư ví, Doanh thu hôm nay (95% tổng giá trị đơn), Số đơn mới, Số đơn đang xử lý.
        3) Hệ thống hiển thị biểu đồ doanh thu 7 ngày gần nhất.
        4) Hệ thống hiển thị danh sách 5 đơn hàng mới nhất.
    - **3.2 Luồng điều chỉnh trạng thái cửa hàng**:
        1) Chủ nhà hàng gạt nút Toggle "Trạng thái cửa hàng".
        2) Hệ thống yêu cầu xác nhận.
        3) Nếu xác nhận mở: Quán xuất hiện trên App khách hàng. Nếu xác nhận đóng: Khách không thể đặt món.
4. **Các yêu cầu đặc biệt**: Doanh thu hiển thị là doanh thu thực nhận (thường là 95% sau khi trừ phí hệ thống/shipper).
5. **Tiền điều kiện**: Chủ nhà hàng đã đăng nhập và đã được gán nhà hàng.
6. **Hậu điều kiện**: Trạng thái quán được cập nhật trên toàn hệ thống.
7. **Điểm mở rộng**: Không có.

## 2.5.2 Mô tả use case: Quản lý thực đơn (Merchant Menu Management)
1. **Tên Use Case**: Quản lý thực đơn nhà hàng.
2. **Mô tả vắn tắt**: Cho phép Chủ nhà hàng tự quản lý danh sách món ăn, giá cả và hình ảnh của quán mình.
3. **Luồng các sự kiện**:
    - **3.1 Luồng thêm/Sửa món ăn**:
        1) Chủ nhà hàng nhấn "Thêm món mới" hoặc "Sửa".
        2) Nhập: Tên món, Giá, Danh mục, Mô tả và Tải ảnh.
        3) Nhấn "Lưu". Hệ thống kiểm tra dữ liệu và cập nhật.
    - **3.2 Luồng thay đổi trạng thái món ăn (Bật/Tắt bán)**:
        1) Chủ nhà hàng dùng nút Toggle trên thẻ món ăn để báo "Hết hàng" (Unavailable) hoặc "Còn hàng" (Available).
    - **3.3 Luồng xóa món**:
        1) Chủ nhà hàng nhấn "Xóa" và xác nhận để gỡ món ăn khỏi thực đơn.
4. **Các yêu cầu đặc biệt**: Chủ nhà hàng chỉ có quyền quản lý sản phẩm thuộc nhà hàng của mình (Phân quyền Role Merchant).
5. **Tiền điều kiện**: Đã đăng nhập Role MERCHANT.
6. **Hậu điều kiện**: Thực đơn được cập nhật.
7. **Điểm mở rộng**: Không có.

## 2.5.3 Mô tả use case: Quy trình xử lý đơn hàng (Order Processing)
1. **Tên Use Case**: Quy trình tiếp nhận và xử lý đơn hàng.
2. **Mô tả vắn tắt**: Chủ nhà hàng tiếp nhận đơn hàng từ khách, chuẩn bị món và báo cho hệ thống để shipper đến lấy.
3. **Luồng các sự kiện**:
    - **3.1 Luồng tiếp nhận đơn**:
        1) Đơn hàng mới xuất hiện ở tab "Chờ duyệt" (PENDING).
        2) Chủ nhà hàng xem chi tiết và nhấn "Xác nhận" (Confirm).
        3) Trạng thái chuyển sang "Đã xác nhận" (CONFIRMED).
    - **3.2 Luồng chuẩn bị món xong**:
        1) Khi món ăn đã sẵn sàng, Chủ nhà hàng nhấn "Báo món sẵn sàng" (Mark Ready).
        2) Trạng thái chuyển sang "Sẵn sàng" (READY_FOR_PICKUP). Hệ thống sẽ thông báo cho Shipper.
    - **3.3 Luồng từ chối đơn**:
        1) Nếu không thể phục vụ, Chủ nhà hàng nhấn "Từ chối".
        2) Nhập lý do (ví dụ: Hết nguyên liệu).
        3) Hệ thống hủy đơn và thông báo cho khách hàng.
4. **Các yêu cầu đặc biệt**: Quy trình chuyển trạng thái phải tuân thủ đúng trình tự (Pending -> Confirmed -> Ready).
5. **Tiền điều kiện**: Có đơn hàng mới được đặt tới nhà hàng.
6. **Hậu điều kiện**: Shipper nhận được thông báo để tới lấy hàng.
7. **Điểm mở rộng**: Không có.

## 2.5.4 Mô tả use case: Cài đặt thông tin nhà hàng (Restaurant Settings)
1. **Tên Use Case**: Cài đặt thông tin và thời gian hoạt động.
2. **Mô tả vắn tắt**: Chủ nhà hàng cập nhật thông tin liên hệ và lịch mở cửa định kỳ trong tuần.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cập nhật thông tin**:
        1) Chủ nhà hàng sửa Số điện thoại, Địa chỉ. (Lưu ý: Tên nhà hàng thường do Admin quản lý nên có thể để Read-only).
    - **3.2 Luồng thiết lập giờ mở cửa (Schedule)**:
        1) Chủ nhà hàng tick chọn các ngày trong tuần quán mở cửa.
        2) Thiết lập Giờ mở và Giờ đóng cho từng ngày.
        3) Nhấn "Lưu cài đặt".
4. **Các yêu cầu đặc biệt**: Giờ đóng cửa phải sau giờ mở cửa.
5. **Tiền điều kiện**: Admin đã gán quyền quản lý nhà hàng cho User.
6. **Hậu điều kiện**: Thời gian hiển thị "Đang mở cửa/Đóng cửa" trên App khách hàng sẽ tự động cập nhật theo lịch.
7. **Điểm mở rộng**: Không có.


--- END FILE: MerchantManagement.md ---


--- START FILE: MerchantMenuPage.md ---

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


--- END FILE: MerchantMenuPage.md ---


--- START FILE: MerchantOrderDetailPage.md ---

# Tài liệu Use Case: MerchantOrderDetailPage

## 1. Thông tin chung
- **Tên màn hình**: Chi tiết Đơn hàng (Merchant Order Detail)
- **File**: `MerchantOrderDetailPage.jsx`
- **Role**: Restaurant Owner (Chủ nhà hàng)
- **Mô tả**: Cung cấp đầy đủ thông tin về một đơn hàng đơn lẻ, bao gồm chi tiết món ăn, thông tin khách hàng và lịch sử thay đổi để phục vụ việc chế biến và đối soát.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-MODP-01: Hiển thị chi tiết món ăn (Invoice view)
- Liệt kê danh sách món ăn kèm ảnh, số lượng, đơn giá và tổng số tiền của mỗi món.
- Tính toán Tổng thanh toán cuối cùng của đơn hàng.

### UC-MODP-02: Thông tin Khách hàng
- Hiển thị đầy đủ: Tên khách hàng, Số điện thoại, Địa chỉ giao hàng.
- **Ghi chú đặc biệt**: Hiển thị nổi bật yêu cầu riêng của khách (ví dụ: "Ít cay", "Đừng để hành").

### UC-MODP-03: Thông tin Thanh toán và Vận chuyển
- Hiển thị phương thức thanh toán (Ví SmartPay, Tiền mặt, v.v.).
- Hiển thị Mã số tài xế (Shipper ID) nếu đơn đã có tài xế nhận.

### UC-MODP-04: Lịch sử cập nhật (Timeline)
- Hiển thị dòng thời gian các mốc quan trọng của đơn (Thời điểm đặt, Thời điểm xác nhận, Thời điểm sẵn sàng).

### UC-MODP-05: Thao tác điều phối đơn hàng
- Cung cấp các nút hành động dựa trên trạng thái hiện tại:
    - Nút "Nhận Đơn Hàng" và "Từ Chối" (Khi đang PENDING).
    - Nút "Đã Làm Xong Món" (Khi đang CONFIRMED).

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Xử lý đơn hàng tại nhà hàng (Merchant)
1. **Tên Use Case**: Tiếp nhận và chế biến đơn hàng.
2. **Mô tả vắn tắt**: Chủ nhà hàng kiểm tra chi tiết món ăn và điều phối quy trình nấu nướng.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Chủ quán nhận đơn hàng mới (Pending).
        2) Nhấn "Accept" để xác nhận nhận đơn.
        3) In hóa đơn hoặc xem danh sách món để chế biến.
        4) Nhấn "Ready for Pickup" sau khi nấu xong.
        5) Hệ thống thông báo cho Shipper đến lấy hàng.
    - **3.2 Luồng từ chối đơn**:
        1) Chủ quán nhấn "Reject" (nếu hết hàng hoặc quá tải).
        2) Chọn lý do từ chối.
        3) Hệ thống hủy đơn và hoàn tiền cho khách (nếu thanh toán ví).
4. **Tiền điều kiện**: Đã đăng nhập quyền Merchant.
5. **Hậu điều kiện**: Trạng thái đơn hàng chuyển sang READY_FOR_PICKUP.


--- END FILE: MerchantOrderDetailPage.md ---


--- START FILE: MerchantOrderPage.md ---

# Tài liệu Use Case: MerchantOrderPage

## 1. Thông tin chung
- **Tên màn hình**: Quản lý Đơn hàng (Merchant Orders)
- **File**: `MerchantOrderPage.jsx`
- **Role**: Restaurant Owner (Chủ nhà hàng)
- **Mô tả**: Trang quản lý tập trung toàn bộ vòng đời của đơn hàng tại quán, giúp quy trình xử lý món ăn trở nên chuyên nghiệp và chính xác.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-MOP-01: Quản lý đơn theo quy trình (Tabs)
- Chia đơn hàng thành các trạng thái:
    - **Chờ duyệt (PENDING)**: Đơn mới từ khách hàng cần quán xác nhận nhận đơn.
    - **Đã xác nhận (CONFIRMED)**: Quán đang trong quá trình chế biến món ăn.
    - **Sẵn sàng (READY_FOR_PICKUP)**: Món đã xong, chờ tài xế đến lấy.
    - **Đang giao (DELIVERING)**: Tài xế đã lấy hàng và đang đi giao.
    - **Hoàn tất (COMPLETED)**: Đơn hàng giao thành công.
    - **Đã hủy (CANCELLED)**: Đơn bị hủy bởi khách hoặc quán.

### UC-MOP-02: Xác nhận nhận đơn
- Chủ quán có thể nhấn "Xác nhận" ngay tại danh sách để bắt đầu chế biến.

### UC-MOP-03: Báo món sẵn sàng (Mark Ready)
- Khi chế biến xong, chủ quán nhấn "Báo Món Sẵn Sàng" để hệ thống thông báo cho tài xế.

### UC-MOP-04: Từ chối đơn hàng (Reject)
- Cho phép quán từ chối đơn hàng (ví dụ: do hết món, quá tải).
- Yêu cầu nhập lý do từ chối để thông báo cho khách hàng.

### UC-MOP-05: Tìm kiếm đơn hàng
- Hỗ trợ tìm kiếm theo Mã đơn hàng hoặc Tên khách hàng để truy xuất nhanh thông tin.

### UC-MOP-06: Phân trang (Pagination)
- Quản lý danh sách đơn hàng lớn (10 đơn/trang) giúp trang tải nhanh và dễ theo dõi.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Xử lý đơn hàng (Order Processing)
1. **Tên Use Case**: Xác nhận và chế biến đơn hàng.
2. **Mô tả vắn tắt**: Chủ cửa hàng tiếp nhận đơn hàng mới và cập nhật trạng thái theo tiến độ chế biến.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Chủ quán truy cập tab "Pending" để xem các đơn hàng mới.
        2) Nhấn nút "Confirm" để chấp nhận đơn. Trạng thái chuyển sang "CONFIRMED".
        3) Sau khi chế biến xong, chủ quán nhấn "Mark Ready". Trạng thái chuyển sang "READY_FOR_PICKUP".
        4) Hệ thống thông báo cho phí Shipper đến nhận hàng.
        5) Khi Shipper lấy hàng, trạng thái chuyển sang "DELIVERING".
    - **3.2 Các luồng rẽ nhánh**:
        1) **Từ chối đơn hàng**: Tại bước 2, nếu không thể thực hiện đơn (hết món/quá tải), chủ quán nhấn "Reject" và nhập lý do. Đơn chuyển sang "CANCELLED".
4. **Tiền điều kiện**: Có đơn hàng mới được gửi đến nhà hàng.
5. **Hậu điều kiện**: Đơn hàng được cập nhật trạng thái và thông báo cho các bên liên quan (Khách hàng/Shipper).


--- END FILE: MerchantOrderPage.md ---


--- START FILE: MerchantSettingsPage.md ---

# Tài liệu Use Case: MerchantSettingsPage

## 1. Thông tin chung
- **Tên màn hình**: Cài đặt Nhà hàng (Merchant Settings)
- **File**: `MerchantSettingsPage.jsx`
- **Role**: Restaurant Owner (Chủ nhà hàng)
- **Mô tả**: Trang cấu hình thông tin cơ bản và thời gian vận hành của cửa hàng trên hệ thống SmartPay.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-MSP-01: Quản lý trạng thái Mở/Đóng cửa tức thì
- Cung cấp nút gạt để chủ quán có thể ngay lập tức ngừng nhận đơn (ví dụ khi quán quá tải đột xuất) hoặc mở lại.

### UC-MSP-02: Cập nhật Thông tin liên hệ
- Cho phép sửa Số điện thoại và Địa chỉ kinh doanh của quán.
- **Lưu ý**: Tên nhà hàng thường cố định theo giấy phép (Read-only) để đảm bảo tính xác thực.

### UC-MSP-03: Cấu hình Giờ hoạt động (Operating Hours)
- Cho phép thiết lập lịch làm việc chi tiết cho từng ngày trong tuần (Thứ 2 đến Chủ nhật).
- **Tính năng cho mỗi ngày**: 
    - Bật/Tắt ngày làm việc (isOpen toggle).
    - Chọn Giờ mở cửa và Giờ đóng cửa cụ thể.

### UC-MSP-04: Lưu trữ và Đồng bộ
- Nút "Lưu cài đặt" giúp đồng bộ toàn bộ thay đổi lên hệ thống.
- Yêu cầu xác nhận (Swal) khi thực hiện chuyển đổi trạng thái cửa hàng.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Thiết lập cửa hàng (Store Settings)
1. **Tên Use Case**: Cập nhật thông tin và giờ hoạt động.
2. **Mô tả vắn tắt**: Chủ cửa hàng cấu hình các thông số vận hành của quán trên hệ thống.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Chủ quán truy cập trang "Settings".
        2) Chỉnh sửa SĐT, Địa chỉ hoặc trạng thái Mở/Đóng cửa.
        3) Thiết lập Giờ mở/đóng cửa cho từng ngày trong tuần.
        4) Nhấn "Save Settings".
        5) Hệ thống hiển thị loading và thông báo lưu thành công.
4. **Tiền điều kiện**: Đã đăng nhập vào hệ thống.
5. **Hậu điều kiện**: Thông tin quán được cập nhật và áp dụng ngay lập tức cho các đơn hàng mới.

## 3. Yêu cầu phi chức năng (Non-functional Requirements)

### NFR-MSP-01: Thiết kế giao diện (UI)
- Sử dụng các khung nhập liệu (Input) và chọn giờ (Time Picker) trực quan, chuẩn hóa.
- Hiển thị trạng thái "Nghỉ đóng cửa" xám mờ cho các ngày không hoạt động.

### NFR-MSP-02: Phản hồi hệ thống
- Tự động làm mới dữ liệu (Fetch) sau khi lưu thành công để đảm bảo chủ quán luôn thấy thông tin mới nhất.
- Hiển thị trạng thái "Đang lưu..." trên nút bấm để người dùng không nhấn liên tục.

### NFR-MSP-03: Trải nghiệm người dùng (UX)
- Phân tách rõ ràng các nhóm thông tin (Trạng thái, Thông tin cơ bản, Giờ hoạt động) bằng các Section có tiêu đề riêng biệt.


--- END FILE: MerchantSettingsPage.md ---
