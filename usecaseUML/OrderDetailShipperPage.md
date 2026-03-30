# Sequence Diagram – OrderDetailShipperPage.jsx

## UC-51: Xem chi tiết đơn hàng (Shipper)

```plantuml
@startuml UC51_XemChiTietDonHangShipper
actor Shipper
boundary ":OrderDetailShipperUI" as UI
control ":ShipperOrderDetailController" as CTRL
entity ":Order" as ENT
entity ":CSDL" as DB

Shipper -> UI : 1: Mở chi tiết đơn hàng (orderId)
activate UI

UI -> CTRL : 2: getOrderDetail(orderId)
activate CTRL

CTRL -> DB : 3: GET /api/shipper/orders/{orderId}
activate DB

alt Không tìm thấy
    DB --> CTRL : 3.1: 404 Not Found
    CTRL --> UI : 3.2: Lỗi
    UI --> Shipper : 3.3: Hiển thị "Không tìm thấy đơn hàng"
else Thành công
    DB --> CTRL : 4.1: 200 OK {order, customer, restaurant, items}
    deactivate DB

    CTRL -> ENT : 4.2: Mapping Order + Customer + Restaurant + Items
    activate ENT
    ENT --> CTRL : 4.3: Order detail data
    deactivate ENT

    CTRL --> UI : 4.4: Chi tiết đơn hàng
    deactivate CTRL

    UI --> Shipper : 5: Hiển thị thông tin khách hàng, nhà hàng, món ăn, timeline, tổng tiền
end

deactivate UI
@enduml
```

## UC-52: Xác nhận lấy hàng (từ Detail)

```plantuml
@startuml UC52_XacNhanLayHangDetail
actor Shipper
boundary ":OrderDetailShipperUI" as UI
control ":ShipperOrderDetailController" as CTRL
entity ":Order" as ENT
entity ":CSDL" as DB

Shipper -> UI : 1: Nhấn "Xác nhận Lấy hàng" (khi status = PENDING/READY_FOR_PICKUP)
activate UI

UI -> CTRL : 2: pickedUpOrder(orderId)
activate CTRL

CTRL -> DB : 3: PUT /api/shipper/orders/{orderId}/picked-up
activate DB

alt Thất bại
    DB --> CTRL : 3.1: Error
    CTRL --> UI : 3.2: Lỗi
    UI --> Shipper : 3.3: Hiển thị lỗi
else Thành công
    DB --> CTRL : 4.1: 200 OK
    deactivate DB

    CTRL -> ENT : 4.2: Cập nhật Order.status = DELIVERING
    activate ENT
    ENT --> CTRL : 4.3: Đã cập nhật
    deactivate ENT

    CTRL --> UI : 4.4: Thành công
    deactivate CTRL

    UI --> Shipper : 5: Hiển thị thông báo, refresh chi tiết
end

deactivate UI
@enduml
```

## UC-53: Xác nhận giao hàng thành công

```plantuml
@startuml UC53_XacNhanGiaoHang
actor Shipper
boundary ":OrderDetailShipperUI" as UI
control ":ShipperOrderDetailController" as CTRL
entity ":Order" as ENT
entity ":CSDL" as DB

Shipper -> UI : 1: Nhấn "Xác nhận Giao hàng" (khi status = DELIVERING)
activate UI

UI -> CTRL : 2: deliveredOrder(orderId, {photoBase64})
activate CTRL

CTRL -> DB : 3: PUT /api/shipper/orders/{orderId}/delivered
activate DB

alt Thất bại
    DB --> CTRL : 3.1: Error
    CTRL --> UI : 3.2: Lỗi
    UI --> Shipper : 3.3: Hiển thị lỗi
else Thành công
    DB --> CTRL : 4.1: 200 OK
    deactivate DB

    CTRL -> ENT : 4.2: Cập nhật Order.status = COMPLETED
    activate ENT
    ENT --> CTRL : 4.3: Đã cập nhật
    deactivate ENT

    CTRL --> UI : 4.4: Thành công
    deactivate CTRL

    UI --> Shipper : 5: Hiển thị "Giao hàng thành công", tự động chuyển hướng /shipper/orders sau 5s
end

deactivate UI
@enduml
```

## UC-54: Báo cáo giao hàng thất bại

```plantuml
@startuml UC54_BaoCaoGiaoHangThatBai
actor Shipper
boundary ":OrderDetailShipperUI" as UI
control ":ShipperOrderDetailController" as CTRL
entity ":Order" as ENT
entity ":CSDL" as DB

Shipper -> UI : 1: Nhấn "Thất bại"
activate UI

UI --> Shipper : 2: Hiển thị modal chọn lý do (Khách vắng nhà / Sai địa chỉ / Không liên lạc được / ...)

Shipper -> UI : 3: Chọn lý do, nhập ghi chú (optional)
Shipper -> UI : 4: Nhấn "Yêu cầu Hủy"

UI -> CTRL : 5: failOrder(orderId, {reason, photoBase64})
activate CTRL

CTRL -> DB : 6: PUT /api/shipper/orders/{orderId}/failed
activate DB

alt Thất bại
    DB --> CTRL : 6.1: Error
    CTRL --> UI : 6.2: Lỗi
    UI --> Shipper : 6.3: Hiển thị lỗi
else Thành công
    DB --> CTRL : 7.1: 200 OK
    deactivate DB

    CTRL -> ENT : 7.2: Cập nhật Order.status = DELIVERY_FAILED
    activate ENT
    ENT --> CTRL : 7.3: Đã cập nhật
    deactivate ENT

    CTRL --> UI : 7.4: Thành công
    deactivate CTRL

    UI --> Shipper : 8: Đóng modal, hiển thị thông báo, tự động chuyển hướng /shipper/orders sau 5s
end

deactivate UI
@enduml
```
