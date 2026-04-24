

--- START FILE: OrderDetailShipperPage.md ---

# Tài liệu Use Case: OrderDetailShipperPage

## 1. Thông tin chung
- **Tên màn hình**: Điều phối Chi tiết Đơn hàng (Shipper Detail)
- **File**: `OrderDetailShipperPage.jsx`
- **Role**: Shipper (Tài xế)
- **Mô tả**: Trang làm việc chính của tài xế khi thực hiện một đơn hàng cụ thể, tích hợp các công cụ liên lạc và chỉ đường.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-ODSP-01: Thông tin liên lạc Khách hàng
- Hiển thị tên, số điện thoại và địa chỉ giao hàng.
- **Nút "Gọi điện"**: Tự động kích hoạt ứng dụng cuộc gọi trên điện thoại với số của khách hàng.
- **Nút "Bản đồ"**: Mở Google Maps điều dẫn đến tọa độ vị trí khách hàng.

### UC-ODSP-02: Thông tin Nhà hàng (Điểm lấy hàng)
- Hiển thị logo, tên nhà hàng và nút "Chỉ đường" để tài xế đến lấy món.

### UC-ODSP-03: Kiểm soát giỏ hàng (Checklist)
- Liệt kê chi tiết các món ăn, số lượng và tổng tiền để tài xế đối soát khi nhận hàng từ quán.
- Hiển thị ghi chú cụ thể của khách (ví dụ: "Không lấy hành", "Giao trước 12h").

### UC-ODSP-04: Quy trình Giao hàng (Workflow Actions)
- **Xác nhận Lấy hàng**: Chuyển trạng thái từ Chờ lấy sang Đang giao.
- **Xác nhận Giao hàng**: Hoàn tất đơn hàng. Hệ thống ghi nhận thời gian hoàn thành chính xác.

### UC-ODSP-05: Báo cáo Giao hàng Thất bại
- Cung cấp tính năng báo cáo nếu không thể hoàn thành đơn.
- **Chọn lý do**: Khách vắng nhà, Sai địa chỉ, Không liên lạc được, Khách từ chối nhận, v.v.
- **Ghi chú**: Cho phép tài xế nhập mô tả chi tiết tình huống.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Thực hiện giao hàng (Delivery Execution)
1. **Tên Use Case**: Giao hàng cho khách.
2. **Mô tả vắn tắt**: Tài xế thực hiện các bước giao hàng vật lý và cập nhật trạng thái hoàn tất đơn hàng.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Tài xế xem địa chỉ và SĐT khách hàng trên trang chi tiết.
        2) Sử dụng nút "Giao hàng" (Delivered) sau khi đã đưa hàng cho khách.
        3) Hệ thống kiểm tra hình thức thanh toán.
        4) Nếu là thanh toán bằng Ví, hệ thống thực hiện phân phối tiền (95% quán, 5% shipper).
        5) Hệ thống hiển thị thông báo thành công và tự động quay lại trang danh sách sau 5 giây.
    - **3.2 Các luồng rẽ nhánh**:
        1) **Giao hàng thất bại**: Nếu không thể giao (sai địa chỉ/không gọi được khách), tài xế nhấn "Report Failure" và chọn lý do. Đơn chuyển sang trạng thái `FAILED`.
4. **Tiền điều kiện**: Tài xế đã lấy hàng thành công từ nhà hàng.
5. **Hậu điều kiện**: Đơn hàng kết thúc chu kỳ giao.

### 4.2 Mô tả usecase Liên lạc và Chỉ đường
1. **Tên Use Case**: Hỗ trợ liên lạc và dẫn đường.
2. **Mô tả vắn tắt**: Tài xế sử dụng các công cụ tích hợp để tối ưu quãng đường di chuyển và liên lạc với các bên.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Nhấn icon "Phone" để gọi điện cho khách hàng hoặc nhà hàng.
        2) Nhấn icon "Map" để mở ứng dụng Google Maps dẫn đường đến địa chỉ đích.
4. **Tiền điều kiện**: Thiết bị có cài đặt ứng dụng gọi điện và bản đồ.
5. **Hậu điều kiện**: Không có.


--- END FILE: OrderDetailShipperPage.md ---


--- START FILE: OrderListShipperPage.md ---

# Tài liệu Use Case: OrderListShipperPage

## 1. Thông tin chung
- **Tên màn hình**: Danh sách Đơn hàng của Tài xế
- **File**: `OrderListShipperPage.jsx`
- **Role**: Shipper (Tài xế)
- **Mô tả**: Quản lý các giai đoạn của đơn hàng từ khi chờ nhận đến khi hoàn tất hoặc thất bại.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-OLSP-01: Phân loại đơn hàng theo trạng thái (Tabs)
- **Chờ nhận (PENDING)**: Hiển thị các đơn hàng hệ thống đang cần tài xế (trạng thái `READY_FOR_PICKUP`, chưa gán tài xế).
- **Đang giao (DELIVERING)**: Danh sách đơn hàng tài xế đã nhận nhưng chưa giao xong (bao gồm cả đơn đang lấy hàng và đơn đang trên đường đi).
- **Đã giao (COMPLETED)**: Lịch sử các đơn hàng giao thành công.
- **Thất bại (FAILED)**: Các đơn hàng không thể giao đến khách.

### UC-OLSP-02: Nhận đơn hàng mới
- Trong tab "Chờ nhận", tài xế có thể nhấn "Nhận đơn" để gán mình vào đơn hàng đó.

### UC-OLSP-03: Xác nhận lấy hàng (Pick up)
- Đối với đơn hàng trong tab "Đang giao" có trạng thái `READY_FOR_PICKUP`, cung cấp nút "Lấy hàng" để cập nhật trạng thái đơn thành `DELIVERING`.

### UC-OLSP-04: Xem tóm tắt thông tin đơn hàng
- Mỗi thẻ đơn hàng hiển thị: Mã đơn, Thời gian đặt, Tên khách hàng, Số điện thoại (ẩn/hiện tùy bảo mật), Địa chỉ giao hàng (rút gọn), và Tổng số tiền.

### UC-OLSP-05: Chuyển hướng xử lý chi tiết
- Cung cấp nút "Chi tiết" hoặc "Giao hàng" để đi sâu vào trang điều phối đơn hàng cụ thể.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Nhận đơn hàng (Accept Order)
1. **Tên Use Case**: Nhận đơn hàng mới.
2. **Mô tả vắn tắt**: Tài xế chọn và nhận các đơn hàng đang ở trạng thái "Sẵn sàng" để đi giao.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Tài xế truy cập tab "Pending" (Chờ nhận).
        2) Hệ thống hiển thị danh sách các đơn hàng chưa có tài xế.
        3) Tài xế nhấn nút "Accept" trên một đơn hàng cụ thể.
        4) Hệ thống kiểm tra xem đơn hàng đã bị ai nhận chưa. [A1]
        5) Hệ thống gán ID tài xế vào đơn hàng và chuyển đơn sang tab "Delivering".
    - **3.2 Các luồng rẽ nhánh**:
        1) **[A1] Đơn hàng đã bị nhận**: Nếu trong lúc tài xế nhấn nút, đã có tài xế khác nhận đơn thành công, hệ thống hiển thị thông báo "Order already taken" và làm mới danh sách.
4. **Tiền điều kiện**: Tài xế đang ở trạng thái "Online".
5. **Hậu điều kiện**: Đơn hàng được gán cho tài xế và sẵn sàng để lấy hàng.

### 4.2 Mô tả usecase Lấy hàng tại quán (Pick up)
1. **Tên Use Case**: Xác nhận đã lấy hàng.
2. **Mô tả vắn tắt**: Tài xế xác nhận đã nhận hàng vật lý từ nhà hàng để bắt đầu đi giao.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Tài xế di chuyển đến nhà hàng.
        2) Truy cập tab "Delivering" và tìm đơn hàng tương ứng.
        3) Nhấn nút "Pick up".
        4) Hệ thống cập nhật trạng thái đơn thành `DELIVERING` (Đang giao).
4. **Tiền điều kiện**: Đơn hàng đã được tài xế nhận và đang ở trạng thái `READY_FOR_PICKUP`.
5. **Hậu điều kiện**: Trạng thái đơn hàng chuyển sang `DELIVERING`.

## 3. Yêu cầu phi chức năng (Non-functional Requirements)

### NFR-OLSP-01: Tính nhất quán trạng thái (Filtering)
- Phải đảm bảo lọc đúng đơn hàng dựa trên ID tài xế đang đăng nhập (trừ tab PENDING là đơn chung).

### NFR-OLSP-02: Phản hồi nhanh (Instant Feedback)
- Khi tài xế nhận đơn, hệ thống phải cập nhật danh sách ngay lập tức để tránh tình trạng nhiều tài xế nhận cùng một đơn (Concurrency handling).

### NFR-OLSP-03: Giao diện trực quan
- Các trạng thái phải được gắn nhãn màu sắc (Badge) đặc trưng: Chờ lấy (Vàng), Đang giao (Xanh dương), Thành công (Xanh lá), Thất bại (Đỏ).
- Hỗ trợ cuộn trang (Infinite scroll hoặc phân trang) khi danh sách dài.


--- END FILE: OrderListShipperPage.md ---


--- START FILE: ProfileShipperPage.md ---

# Tài liệu Use Case: ProfileShipperPage

## 1. Thông tin chung
- **Tên màn hình**: Quản lý Hồ sơ Tài xế
- **File**: `ProfileShipperPage.jsx`
- **Role**: Shipper (Tài xế)
- **Mô tả**: Cho phép tài xế cập nhật thông tin cá nhân, phương tiện di chuyển và kiểm soát trạng thái làm việc trực tuyến.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-PSP-01: Quản lý Trạng thái Trực tuyến (Online/Offline)
- Cung cấp nút gạt (Toggle Switch) để tài xế bật/tắt trạng thái làm việc.
- Chỉ khi "Online", tài xế mới được hệ thống gán đơn hoặc nhìn thấy đơn hàng mới.

### UC-PSP-02: Quản lý Ảnh đại diện
- Cho phép tải ảnh lên từ thư viện hoặc chụp trực tiếp.
- Kiểm soát dung lượng ảnh (dưới 2MB).
- Xem trước ảnh (Preview) ngay khi chọn.

### UC-PSP-03: Cập nhật Thông tin cơ bản
- Hỗ trợ chỉnh sửa: Họ và tên, Số điện thoại liên hệ, Email cá nhân.
- Hiển thị Mã số định danh (Shipper ID) duy nhất của tài xế.

### UC-PSP-04: Cập nhật Thông tin Phương tiện
- **Loại xe**: Cho phép chọn Xe máy (Motorcycle), Xe tải (Truck), hoặc Xe điện (Electric).
- **Biển số xe**: Ô nhập liệu tự động viết hoa biển số để chuẩn hóa dữ liệu.

### UC-PSP-05: Lưu thay đổi đồng bộ
- Sử dụng cơ chế cập nhật đồng thời (Promise.all) để lưu cả thông tin hồ sơ và phương tiện trong một lần nhấn nút, đảm bảo tính toàn vẹn dữ liệu.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Điều chỉnh trạng thái trực tuyến
1. **Tên Use Case**: Bật/Tắt trạng thái làm việc.
2. **Mô tả vắn tắt**: Tài xế thay đổi trạng thái để hệ thống biết có thể gán đơn hàng cho mình hay không.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Tài xế truy cập trang hồ sơ cá nhân.
        2) Nhấn vào nút gạt (Toggle) Online/Offline.
        3) Hệ thống gửi yêu cầu cập nhật lên server.
        4) Giao diện thay đổi màu sắc và nhãn trạng thái tương ứng.
4. **Tiền điều kiện**: Đã đăng nhập vào hệ thống.
5. **Hậu điều kiện**: Trạng thái "Online" cho phép nhận đơn, "Offline" sẽ không nhận được đơn mới.

### 4.2 Mô tả usecase Cập nhật thông tin phương tiện
1. **Tên Use Case**: Chỉnh sửa thông tin xe.
2. **Mô tả vắn tắt**: Tài xế cập nhật loại xe và biển số xe để khách hàng và nhà hàng nhận diện.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Tài xế nhập Loại xe (Motorcycle, Truck...) và Biển số xe vào form.
        2) Nhấn nút "Save Profile".
        3) Hệ thống hiển thị loading và thực hiện cập nhật đồng thời thông tin cá nhân và phương tiện.
        4) Thông báo "Profile updated successfully" hiển thị.
4. **Tiền điều kiện**: Không có.
5. **Hậu điều kiện**: Thông tin xe được cập nhật và hiển thị trên các đơn hàng shipper nhận.


--- END FILE: ProfileShipperPage.md ---


--- START FILE: ShipperDashboardPage.md ---

# Tài liệu Use Case: ShipperDashboardPage

## 1. Thông tin chung
- **Tên màn hình**: Bảng điều khiển Tài xế (Shipper Dashboard)
- **File**: `ShipperDashboardPage.jsx`
- **Role**: Shipper (Tài xế)
- **Mô tả**: Trung tâm chỉ huy cho tài xế, cung cấp tóm tắt về hiệu suất làm việc, thu nhập và truy cập nhanh vào đơn hàng đang thực hiện.

## 2. Yêu cầu chức năng (Functional Requirements)

### UC-SDP-01: Truy cập nhanh đơn hàng đang giao (Active Order)
- Hiển thị Banner nổi bật nếu tài xế đang có đơn hàng ở trạng thái `READY_FOR_PICKUP` hoặc `DELIVERING`.
- Cung cấp nút "Tiếp tục giao" để chuyển nhanh đến trang chi tiết đơn hàng đó.

### UC-SDP-02: Theo dõi Ví hoa hồng
- Hiển thị số dư hiện tại trong Ví hoa hồng của tài xế (mức phí shipper nhận được từ mỗi đơn hàng).
- Thể hiện sự thay đổi số dư theo chu kỳ tháng.

### UC-SDP-03: Thống kê hiệu suất (Stats)
- Hiển thị các chỉ số quan trọng: Tổng số đơn hàng, Số đơn giao thành công, Tổng doanh thu (VNĐ), Số đơn giao trong ngày hôm nay.

### UC-SDP-04: Biểu đồ khối lượng đơn hàng
- Hiển thị biểu đồ cột (Bar Chart) minh họa số lượng đơn hàng hoàn thành trong 7 ngày gần nhất (Thứ 2 đến Chủ nhật).
- Tự động highlight ngày hiện tại trên biểu đồ.

### UC-SDP-05: Lịch sử hoạt động gần đây
- Liệt kê 5 đơn hàng mới nhất kèm Mã đơn, Thời gian, Số tiền và Trạng thái (Hoàn thành, Thất bại, Đang giao).
- Cho phép nhấn vào từng đơn để xem chi tiết.

## 4. Mô tả chi tiết Use Case (Detailed Flow)

### 4.1 Mô tả usecase Theo dõi hiệu suất làm việc (Shipper Dashboard)
1. **Tên Use Case**: Xem thống kê và thu nhập.
2. **Mô tả vắn tắt**: Tài xế theo dõi các chỉ số quan trọng, thu nhập thực tế và các đơn hàng đang hoạt động.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Tài xế đăng nhập và vào màn hình Dashboard.
        2) Hệ thống hiển thị số lượng đơn hàng đã giao, đơn thành công và tổng thu nhập (5% mỗi đơn).
        3) Hệ thống hiển thị biểu đồ cột xu hướng trong 7 ngày qua. [A1]
        4) Nếu có đơn đang giao, hệ thống hiển thị Banner "Active Order" ở trên cùng.
        5) Tài xế nhấn "Continue" trên banner để quay lại xử lý đơn.
    - **3.2 Các luồng rẽ nhánh**:
        1) **[A1] Không có dữ liệu**: Nếu tài xế mới đăng ký hoặc chưa giao đơn nào, các chỉ số hiển thị là 0 và biểu đồ trống.
4. **Tiền điều kiện**: Đã đăng nhập vào hệ thống với quyền Shipper.
5. **Hậu điều kiện**: Không có.


--- END FILE: ShipperDashboardPage.md ---


--- START FILE: ShipperManagement.md ---

# Tài liệu Use Case: Quản lý Shipper (Shipper Management)

## 2.6.1 Mô tả use case: Theo dõi hiệu suất và ví hoa hồng (Shipper Dashboard)
1. **Tên Use Case**: Theo dõi hiệu suất và ví hoa hồng.
2. **Mô tả vắn tắt**: Cho phép Shipper xem thu nhập từ hoa hồng, số dư ví và trạng thái đơn hàng đang thực hiện ngay khi vào ứng dụng.
3. **Luồng các sự kiện**:
    - **3.1 Luồng cơ bản**:
        1) Shipper truy cập Dashboard.
        2) Hệ thống hiển thị: Tổng đơn, Đơn thành công, Doanh thu hoa hồng (5% giá trị đơn), Số đơn giao hôm nay.
        3) Hệ thống hiển thị "Ví hoa hồng" với số dư hiện tại.
        4) Nếu có đơn hàng đang giao, hệ thống hiển thị "Banner Đơn hàng đang thực hiện" để truy cập nhanh.
        5) Hệ thống hiển thị biểu đồ cột thống kê khối lượng giao hàng theo tuần.
4. **Các yêu cầu đặc biệt**: Doanh thu của Shipper được tính là 5% tổng giá trị đơn hàng (theo logic chia sẻ 95/5).
5. **Tiền điều kiện**: User đăng nhập với Role SHIPPER.
6. **Hậu điều kiện**: Shipper nắm bắt được tình hình thu nhập.
7. **Điểm mở rộng**: Nhấn vào Banner đơn hàng để đi tới trang Chi tiết đơn.

## 2.6.2 Mô tả use case: Nhận và Quản lý đơn hàng (Order Management for Shipper)
1. **Tên Use Case**: Nhận và Quản lý danh sách đơn hàng.
2. **Mô tả vắn tắt**: Shipper tìm kiếm đơn hàng mới sẵn sàng để giao và quản lý các đơn mình đã nhận.
3. **Luồng các sự kiện**:
    - **3.1 Luồng nhận đơn mới**:
        1) Shipper vào tab "Chờ nhận" (PENDING).
        2) Hệ thống hiển thị các đơn hàng ở trạng thái READY_FOR_PICKUP chưa có người nhận.
        3) Shipper nhấn "Nhận đơn".
        4) Hệ thống gán Shipper cho đơn hàng và chuyển đơn sang tab "Đang giao".
    - **3.2 Luồng quản lý danh sách**:
        1) Shipper chuyển đổi giữa các tab: Chờ nhận, Đang giao, Đã giao, Thất bại để theo dõi lịch sử.
        2) Trong mỗi tab, Shipper có thể xem nhanh thông tin: Mã đơn, Thời gian, Tên khách, Địa chỉ và Tổng tiền.
4. **Các yêu cầu đặc biệt**: Tính năng "Nhận đơn" chỉ khả dụng khi đơn hàng chưa có shipper gán (assigned=false).
5. **Tiền điều kiện**: Shipper đang ở trạng thái Online.
6. **Hậu điều kiện**: Đơn hàng được gán cho Shipper và chuyển vào quy trình giao hàng.

## 2.6.3 Mô tả use case: Quy trình Giao hàng (Delivery Execution)
1. **Tên Use Case**: Quy trình Thực hiện Giao hàng.
2. **Mô tả vắn tắt**: Các bước từ khi Shipper lấy hàng tại quán đến khi giao tận tay khách hàng.
3. **Luồng các sự kiện**:
    - **3.1 Luồng Lấy hàng (Picked Up)**:
        1) Shipper đến Nhà hàng, nhấn "Xác nhận Lấy hàng" (Picked up).
        2) Trạng thái đơn chuyển sang DELIVERING.
    - **3.2 Luồng Giao hàng thành công (Delivered)**:
        1) Shipper đến địa chỉ khách hàng.
        2) Shipper có thể dùng tính năng "Gọi điện" hoặc "Chỉ đường" trên giao diện.
        3) Sau khi khách nhận hàng, Shipper nhấn "Xác nhận Giao hàng" (Delivered).
        4) Hệ thống cập nhật trạng thái COMPLETED, thực hiện chia tiền hoa hồng và tự động quay lại danh sách sau 5 giây.
    - **3.3 Luồng Giao hàng thất bại (Delivery Failed)**:
        1) Nếu không thể giao (Khách không nghe máy, sai địa chỉ...), Shipper nhấn "Thất bại".
        2) Chọn lý do từ danh sách và nhập ghi chú chi tiết.
        3) Nhấn "Yêu cầu Hủy". Hệ thống cập nhật trạng thái DELIVERY_FAILED.
4. **Các yêu cầu đặc biệt**: Nút "Gọi điện" và "Chỉ đường" tích hợp với ứng dụng gốc của điện thoại.
5. **Tiền điều kiện**: Đơn hàng đã được Shipper nhận thành công.
6. **Hậu điều kiện**: Đơn hàng kết thúc vòng đời (Thành công hoặc Thất bại).

## 2.6.4 Mô tả use case: Quản lý hồ sơ và Trạng thái làm việc (Shipper Profile & Status)
1. **Tên Use Case**: Quản lý hồ sơ và Trạng thái làm việc.
2. **Mô tả vắn tắt**: Shipper bật/tắt chế độ nhận đơn và cập nhật thông tin cá nhân/phương tiện.
3. **Luồng các sự kiện**:
    - **3.1 Luồng Toggle Online/Offline**:
        1) Shipper gạt nút "Trạng thái".
        2) Nếu Online: Có thể nhận đơn mới. Nếu Offline: Tạm ngừng nhận đơn.
    - **3.2 Luồng cập nhật thông tin**:
        1) Shipper thay đổi Ảnh đại diện, Họ tên, SĐT, Email.
        2) Shipper cập nhật Loại xe (Xe máy, Xe tải...) và Biển số xe.
        3) Nhấn "Cập nhật thông tin" để lưu.
4. **Các yêu cầu đặc biệt**: Thông tin biển số xe quan trọng để khách hàng nhận diện shipper.
5. **Tiền điều kiện**: Đã đăng nhập.
6. **Hậu điều kiện**: Thông tin cá nhân được cập nhật.


--- END FILE: ShipperManagement.md ---
