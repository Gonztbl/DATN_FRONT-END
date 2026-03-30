# Sequence Diagram – Admin Face & User Management

## UC-70: Đăng ký sinh trắc học khuôn mặt cho người dùng (Admin)

```plantuml
@startuml UC70_AdminDangKyMat
actor Admin
boundary ":AdminFaceRegisterUI" as UI
control ":FaceController" as CTRL
entity ":CSDL" as DB

Admin -> UI : 1: Truy cập trang đăng ký mặt cho User ID
activate UI

UI -> CTRL : 2: getUserInfo(id)
activate CTRL
CTRL -> DB : 3: GET /api/admin/users/{id}
activate DB
DB --> CTRL : 4: 200 OK {user}
deactivate DB
CTRL --> UI : 5: Hiển thị tên User
deactivate CTRL

UI --> Admin : 6: Hiển thị Video Stream & Hướng dẫn

loop 3 tư thế (Chính diện, Trái, Phải)
    Admin -> UI : 7: Nhấn "Capture"
    UI -> CTRL : 8: registerFacePose({userId, imageBlob, pose})
    activate CTRL
    CTRL -> DB : 9: POST /api/admin/face/register
    activate DB
    DB --> CTRL : 10: 200 OK {success: true}
    deactivate DB
    CTRL --> UI : 11: Thành công
    deactivate CTRL
    UI --> Admin : 12: Hiển thị Preview nhỏ
end

UI --> Admin : 13: Thông báo hoàn tất đủ 3 mẫu
UI -> UI : 14: Điều hướng về UserDetailPage
deactivate UI
@enduml
```

## UC-71: Kiểm tra xác thực khuôn mặt (Admin Verify)

```plantuml
@startuml UC71_AdminXacThucMat
actor Admin
boundary ":AdminVerifyFaceUI" as UI
control ":FaceController" as CTRL
entity ":CSDL" as DB

Admin -> UI : 1: Truy cập trang xác thực mặt cho User ID
activate UI

UI --> Admin : 2: Hiển thị Video Stream & Khung Oval

loop Liên tục (Auto-Capture)
    UI -> CTRL : 3: verifyFaceRecognition(userId, imageBlob)
    activate CTRL
    CTRL -> DB : 4: POST /api/admin/face/verify
    activate DB
    
    alt Không khớp (Similarity < Threshold)
        DB --> CTRL : 4.1: 200 OK {match: false, similarity: 0.x}
        CTRL --> UI : 4.2: Trả về kết quả No Match
        UI --> Admin : 4.3: Hiển thị thông báo Đỏ
    else Khớp
        DB --> CTRL : 5.1: 200 OK {match: true, similarity: 0.9x}
        deactivate DB
        CTRL --> UI : 5.2: Trả về kết quả Match
        deactivate CTRL
        UI --> Admin : 6: Hiển thị trạng thái Xanh + Điểm số %
    end
end

deactivate UI
@enduml
```

## UC-72: Khởi tạo tài khoản hệ thống (Admin Create)

```plantuml
@startuml UC72_AdminTaoNguoiDung
actor Admin
boundary ":AdminUserCreateUI" as UI
control ":AdminController" as CTRL
entity ":UserAccount" as ENT
entity ":CSDL" as DB

Admin -> UI : 1: Truy cập trang "Create User"
activate UI

UI --> Admin : 2: Hiển thị Form (Username, Fullname, Email, Role...)

Admin -> UI : 3: Nhập thông tin, chọn Role, nhấn "Create Account"

UI -> UI : 4: Validate (Email format, Password strength...)

UI -> CTRL : 5: createUser(userData)
activate CTRL

CTRL -> DB : 6: POST /api/admin/users/create
activate DB

alt Lỗi trùng dữ liệu (Conflict)
    DB --> CTRL : 6.1: 409 Conflict {field: "email"}
    CTRL --> UI : 6.2: Trả về lỗi trùng email
    UI --> Admin : 6.3: Báo đỏ trường Email
else Thành công
    DB --> CTRL : 7.1: 201 Created {user, wallet}
    deactivate DB
    
    CTRL -> ENT : 7.2: Khởi tạo UserAccount
    activate ENT
    ENT --> CTRL : 7.3: Đã tạo
    deactivate ENT
    
    CTRL --> UI : 7.4: Thành công
    deactivate CTRL
    
    UI --> Admin : 8: Hiện thông báo thành công + AccountNumber, quay lại Dashboard
end

deactivate UI
@enduml
```

## UC-73: Truy soát và cập nhật hồ sơ người dùng

```plantuml
@startuml UC73_AdminChiTietUser
actor Admin
boundary ":UserDetailUI" as UI
control ":AdminController" as CTRL
entity ":UserAccount" as ENT
entity ":CSDL" as DB

Admin -> UI : 1: Chọn một người dùng từ danh sách
activate UI

UI -> CTRL : 2: getUserFullDetail(id)
activate CTRL
CTRL -> DB : 3: GET /api/admin/users/{id}/full
activate DB
DB --> CTRL : 4: 200 OK {profile, wallets, biometrics, logs}
deactivate DB
CTRL --> UI : 5: Data tổng hợp
deactivate CTRL

UI --> Admin : 6: Hiển thị các Tab: General, Wallet, Face, Activity

== Chỉnh sửa ==
Admin -> UI : 7: Nhấn "Edit Profile"
UI --> Admin : 8: Mở modal chỉnh sửa
Admin -> UI : 9: Thay đổi thông tin, nhấn "Save"
UI -> CTRL : 10: updateProfile(data)
activate CTRL
CTRL -> DB : 11: PUT /api/admin/users/{id}
activate DB
DB --> CTRL : 12: 200 OK
deactivate DB
CTRL --> UI : 13: Thành công
deactivate CTRL
UI --> Admin : 14: Cập nhật thông tin trên trang

== Xóa tài khoản ==
Admin -> UI : 15: Nhấn "Delete User"
UI --> Admin : 16: Hộp thoại xác nhận
Admin -> UI : 17: Đồng ý xóa
UI -> CTRL : 18: deleteUser(id)
activate CTRL
CTRL -> DB : 19: DELETE /api/admin/users/{id}
activate DB
DB --> CTRL : 20: 200 OK
deactivate DB
CTRL --> UI : 21: Thành công
deactivate CTRL
UI -> UI : 22: Redirect về danh sách người dùng

deactivate UI
@enduml
```
