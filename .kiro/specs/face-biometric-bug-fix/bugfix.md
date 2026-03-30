# Bugfix Requirements Document

## Introduction

Người dùng đã đăng ký khuôn mặt thành công nhưng hệ thống vẫn hiển thị trạng thái "chưa đăng ký" trên ProfilePage và FaceManagementPage không hiển thị danh sách khuôn mặt đã đăng ký. Ngoài ra, việc đăng ký khuôn mặt mới cũng thất bại với lỗi 400 Bad Request.

Ba nguyên nhân gốc rễ đã được xác định:
1. `ProfilePage` truyền `user?.id` vào `faceService.listEmbeddings()` nhưng `/api/user/profile` không trả về field `id`, dẫn đến `undefined` được truyền vào.
2. `faceService.registerFace()` gửi dữ liệu dạng `FormData` (multipart/form-data) trong khi backend yêu cầu JSON body `{image: "base64string"}`.
3. `AuthContext` lưu user object từ login response không có field `id`, nên `authUser?.id` trong `FaceManagementPage` cũng là `undefined`.

---

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN `ProfilePage` gọi `faceService.listEmbeddings(user?.id)` sau khi load profile từ `/api/user/profile` THEN hệ thống truyền `undefined` vì response không có field `id`, khiến `faceService._getUserId()` phải fallback gọi `/api/me`

1.2 WHEN `/api/me` không trả về id ở đúng field hoặc request thất bại THEN hệ thống trả về mảng rỗng và ProfilePage hiển thị trạng thái "Chưa thiết lập" dù user đã đăng ký khuôn mặt

1.3 WHEN `FaceManagementPage` gọi `faceService.listEmbeddings(authUser?.id)` THEN hệ thống truyền `undefined` vì `authUser` được lưu từ login response không có field `id`, dẫn đến danh sách khuôn mặt không được hiển thị

1.4 WHEN user thực hiện đăng ký khuôn mặt mới qua `faceService.registerFace(formData)` THEN hệ thống gửi request dạng `multipart/form-data` với `FormData` object trong khi backend `POST /api/face/register` yêu cầu JSON body `{image: "base64string"}`, dẫn đến lỗi 400 Bad Request

### Expected Behavior (Correct)

2.1 WHEN `ProfilePage` cần kiểm tra trạng thái biometrics THEN hệ thống SHALL lấy userId từ `/api/me` một cách đáng tin cậy mà không phụ thuộc vào field `id` trong profile response

2.2 WHEN `faceService._getUserId()` được gọi với `undefined` THEN hệ thống SHALL gọi `/api/me` và trả về id hợp lệ, sau đó `listEmbeddings` SHALL trả về đúng danh sách khuôn mặt đã đăng ký

2.3 WHEN `FaceManagementPage` load danh sách khuôn mặt THEN hệ thống SHALL resolve userId thành công và hiển thị đúng danh sách khuôn mặt đã đăng ký của user

2.4 WHEN user đăng ký khuôn mặt mới THEN `faceService.registerFace()` SHALL gửi request với JSON body `{image: "base64string"}` và query params `?userId=&pose=` đúng theo spec của backend, nhận về response thành công thay vì lỗi 400

### Unchanged Behavior (Regression Prevention)

3.1 WHEN userId hợp lệ được truyền trực tiếp vào `faceService.listEmbeddings(userId)` THEN hệ thống SHALL CONTINUE TO sử dụng userId đó mà không gọi thêm `/api/me`

3.2 WHEN user xóa một embedding qua `faceService.deleteEmbedding(embeddingId)` THEN hệ thống SHALL CONTINUE TO gọi `DELETE /api/face/{embeddingId}` và cập nhật danh sách hiển thị đúng

3.3 WHEN `faceService.verifyFace()` được gọi để xác thực giao dịch THEN hệ thống SHALL CONTINUE TO hoạt động đúng như hiện tại

3.4 WHEN user đã đăng nhập và token hợp lệ THEN hệ thống SHALL CONTINUE TO tự động đính kèm JWT token vào tất cả API requests qua `apiClient` interceptor

3.5 WHEN token hết hạn hoặc không hợp lệ (401) THEN hệ thống SHALL CONTINUE TO xóa token và redirect về trang login

---

## Bug Condition Pseudocode

```pascal
FUNCTION isBugCondition_userId(X)
  INPUT: X là userId được truyền vào faceService
  OUTPUT: boolean
  RETURN X = undefined OR X = null
END FUNCTION

// Property: Fix Checking - userId resolution
FOR ALL X WHERE isBugCondition_userId(X) DO
  id ← faceService._getUserId'(X)
  ASSERT id ≠ undefined AND id ≠ null
END FOR

// Property: Preservation Checking
FOR ALL X WHERE NOT isBugCondition_userId(X) DO
  ASSERT faceService._getUserId'(X) = X  // Không gọi thêm /api/me
END FOR

FUNCTION isBugCondition_registerFormat(request)
  INPUT: request là HTTP request từ registerFace
  OUTPUT: boolean
  RETURN request.contentType = "multipart/form-data"
END FUNCTION

// Property: Fix Checking - register format
FOR ALL request WHERE isBugCondition_registerFormat(request) DO
  response ← registerFace'(request)
  ASSERT response.status ≠ 400
  ASSERT request'.contentType = "application/json"
  ASSERT request'.body HAS field "image" OF TYPE string
END FOR
```
