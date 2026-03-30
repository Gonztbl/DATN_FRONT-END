# Sequence Diagram – Admin Product & Order Management

## UC-74: Quản lý món ăn toàn hệ thống (Products)

```plantuml
@startuml UC74_AdminQuanLySanPham
actor Admin
boundary ":AdminProductUI" as UI
control ":ProductController" as CTRL
entity ":Product" as ENT
entity ":CSDL" as DB

Admin -> UI : 1: Truy cập trang "Product Management"
activate UI

UI -> CTRL : 2: getAllProducts(filters)
activate CTRL
CTRL -> DB : 3: GET /api/admin/products?...
activate DB
DB --> CTRL : 4: 200 OK {products: [...]}
deactivate DB
CTRL --> UI : 5: Hiển thị danh sách sản phẩm
deactivate CTRL

== Thêm món mới ==
Admin -> UI : 6: Nhấn "Thêm món mới"
UI --> Admin : 7: Mở form (Tên, Giá, Danh mục, Nhà hàng...)
Admin -> UI : 8: Nhập thông tin, tải ảnh (Base64), nhấn "Save"
UI -> CTRL : 9: createProduct(data)
activate CTRL
CTRL -> DB : 10: POST /api/admin/products
activate DB
DB --> CTRL : 11: 201 Created
deactivate DB
CTRL --> UI : 12: Thành công
deactivate CTRL
UI --> Admin : 13: Đóng modal, refresh danh sách

== Thay đổi trạng thái (Toggle) ==
Admin -> UI : 14: Nhấn nút gạt Status (Available/Unavailable)
UI -> CTRL : 15: toggleProductAvailability(id)
activate CTRL
CTRL -> DB : 16: PATCH /api/admin/products/{id}/status
activate DB
DB --> CTRL : 17: 200 OK
deactivate DB
CTRL --> UI : 18: Thành công (Optimistic already updated)
deactivate CTRL

deactivate UI
@enduml
```

## UC-75: Quản lý và xử lý đơn hàng hệ thống

```plantuml
@startuml UC75_AdminQuanLyDonHang
actor Admin
boundary ":AdminOrderUI" as UI
control ":OrderController" as CTRL
entity ":Order" as ENT
entity ":CSDL" as DB

Admin -> UI : 1: Truy cập "Quản lý đơn hàng"
activate UI

UI -> CTRL : 2: getAllSystemOrders(filters)
activate CTRL
CTRL -> DB : 3: GET /api/admin/orders?...
activate DB
DB --> CTRL : 4: 200 OK {orders: [...]}
deactivate DB
CTRL --> UI : 5: Hiển thị danh sách đơn hàng mới nhất
deactivate CTRL

== Xem chi tiết ==
Admin -> UI : 6: Nhấn "Xem" (Visibility icon)
UI -> UI : 7: Điều hướng về ViewOrderByAdmin

== Hủy đơn & Hoàn tiền ==
Admin -> UI : 8: Nhấn "Hủy đơn", chọn lý do
UI -> CTRL : 9: cancelOrder(id, reason)
activate CTRL
CTRL -> DB : 10: POST /api/admin/orders/{id}/cancel
activate DB
alt Đã thanh toán ví
    DB -> DB : 10.1: Tự động hoàn tiền vào ví User
    DB --> CTRL : 11.1: 200 OK {refundId, status: CANCELLED}
else Chưa thanh toán
    DB --> CTRL : 11.2: 200 OK {status: CANCELLED}
end
deactivate DB
CTRL --> UI : 12: Thành công
deactivate CTRL
UI --> Admin : 13: Thông báo thành công, cập nhật Timeline

deactivate UI
@enduml
```
