# Sequence Diagram – MerchantMenuPage.jsx

## UC-32: Xem danh sách sản phẩm nhà hàng

```plantuml
@startuml UC32_XemDanhSachSanPham
actor Merchant
boundary ":MerchantMenuUI" as UI
control ":MenuController" as CTRL
entity ":Product" as ENT
entity ":CSDL" as DB

Merchant -> UI : 1: Truy cập trang Quản lý Menu
activate UI

UI -> CTRL : 2: getProducts(restaurantId)
activate CTRL

CTRL -> DB : 3: GET /api/products?restaurantId=...
activate DB
DB --> CTRL : 4: 200 OK {products: [...]}
deactivate DB

CTRL -> ENT : 5: Mapping danh sách Product
activate ENT
ENT --> CTRL : 6: Products data
deactivate ENT

CTRL --> UI : 7: Danh sách sản phẩm
deactivate CTRL

UI --> Merchant : 8: Hiển thị danh sách sản phẩm với tìm kiếm & lọc
deactivate UI
@enduml
```

## UC-33: Thêm sản phẩm mới

```plantuml
@startuml UC33_ThemSanPham
actor Merchant
boundary ":MerchantMenuUI" as UI
control ":MenuController" as CTRL
entity ":Product" as ENT
entity ":CSDL" as DB

Merchant -> UI : 1: Nhấn "Thêm món mới"
activate UI

UI --> Merchant : 2: Hiển thị modal thêm sản phẩm

Merchant -> UI : 3: Nhập tên, giá, mô tả, danh mục, ảnh
Merchant -> UI : 4: Nhấn "Lưu"

UI -> UI : 5: Validate form (tên, giá > 0)

UI -> CTRL : 6: createProduct(productData)
activate CTRL

CTRL -> DB : 7: POST /api/products
activate DB

alt Thêm thất bại
    DB --> CTRL : 7.1: Error
    CTRL --> UI : 7.2: Lỗi
    UI --> Merchant : 7.3: Hiển thị thông báo lỗi
else Thành công
    DB --> CTRL : 8.1: 201 Created
    deactivate DB

    CTRL -> ENT : 8.2: Tạo Product mới
    activate ENT
    ENT --> CTRL : 8.3: Đã tạo
    deactivate ENT

    CTRL --> UI : 8.4: Thành công
    deactivate CTRL

    UI --> Merchant : 9: Đóng modal, refresh danh sách
end

deactivate UI
@enduml
```

## UC-34: Sửa sản phẩm

```plantuml
@startuml UC34_SuaSanPham
actor Merchant
boundary ":MerchantMenuUI" as UI
control ":MenuController" as CTRL
entity ":Product" as ENT
entity ":CSDL" as DB

Merchant -> UI : 1: Nhấn "Sửa" trên sản phẩm
activate UI

UI --> Merchant : 2: Hiển thị modal chỉnh sửa (với dữ liệu hiện tại)

Merchant -> UI : 3: Chỉnh sửa thông tin sản phẩm
Merchant -> UI : 4: Nhấn "Cập nhật"

UI -> CTRL : 5: updateProduct(productId, updatedData)
activate CTRL

CTRL -> DB : 6: PUT /api/products/{productId}
activate DB

alt Cập nhật thất bại
    DB --> CTRL : 6.1: Error
    CTRL --> UI : 6.2: Lỗi
    UI --> Merchant : 6.3: Hiển thị thông báo lỗi
else Thành công
    DB --> CTRL : 7.1: 200 OK
    deactivate DB

    CTRL -> ENT : 7.2: Cập nhật Product
    activate ENT
    ENT --> CTRL : 7.3: Đã cập nhật
    deactivate ENT

    CTRL --> UI : 7.4: Thành công
    deactivate CTRL

    UI --> Merchant : 8: Đóng modal, refresh danh sách
end

deactivate UI
@enduml
```

## UC-35: Xóa sản phẩm

```plantuml
@startuml UC35_XoaSanPham
actor Merchant
boundary ":MerchantMenuUI" as UI
control ":MenuController" as CTRL
entity ":Product" as ENT
entity ":CSDL" as DB

Merchant -> UI : 1: Nhấn "Xóa" trên sản phẩm
activate UI

UI --> Merchant : 2: Hiển thị xác nhận xóa (SweetAlert2)
Merchant -> UI : 3: Xác nhận xóa

UI -> CTRL : 4: deleteProduct(productId)
activate CTRL

CTRL -> DB : 5: DELETE /api/products/{productId}
activate DB

alt Xóa thất bại
    DB --> CTRL : 5.1: Error
    CTRL --> UI : 5.2: Lỗi
    UI --> Merchant : 5.3: Hiển thị thông báo lỗi
else Thành công
    DB --> CTRL : 6.1: 200 OK
    deactivate DB

    CTRL -> ENT : 6.2: Xóa Product
    activate ENT
    ENT --> CTRL : 6.3: Đã xóa
    deactivate ENT

    CTRL --> UI : 6.4: Thành công
    deactivate CTRL

    UI --> Merchant : 7: Refresh danh sách
end

deactivate UI
@enduml
```

## UC-36: Bật/Tắt sản phẩm (Toggle availability)

```plantuml
@startuml UC36_ToggleSanPham
actor Merchant
boundary ":MerchantMenuUI" as UI
control ":MenuController" as CTRL
entity ":Product" as ENT
entity ":CSDL" as DB

Merchant -> UI : 1: Nhấn toggle available/unavailable trên sản phẩm
activate UI

UI -> CTRL : 2: toggleAvailability(productId, newStatus)
activate CTRL

CTRL -> DB : 3: PUT /api/products/{productId}/availability
activate DB
DB --> CTRL : 4: 200 OK
deactivate DB

CTRL -> ENT : 5: Cập nhật Product.available
activate ENT
ENT --> CTRL : 6: Đã cập nhật
deactivate ENT

CTRL --> UI : 7: Thành công
deactivate CTRL

UI --> Merchant : 8: Cập nhật trạng thái hiển thị
deactivate UI
@enduml
```
