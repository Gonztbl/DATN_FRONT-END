# 🚀 Hướng Dẫn Deploy Lên Production

## ✅ Checklist Trước Khi Deploy

### 1. 🔴 **Cấu hình Backend CORS (BẮT BUỘC)**

Backend Spring Boot đã được cấu hình để đọc danh sách origins từ biến môi trường.

**Trên server Backend (Render/Railway/VPS), thêm biến môi trường:**

```bash
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app,https://your-frontend-domain.netlify.app
```

**Ví dụ cụ thể:**
```bash
ALLOWED_ORIGINS=https://food-ordering-app.vercel.app,https://food-ordering-app.netlify.app
```

> ⚠️ **Quan trọng:** Không có dấu cách sau dấu phẩy, và phải dùng HTTPS cho production!

---

### 2. 🔴 **Cấu hình Frontend API URL (BẮT BUỘC)**

Cập nhật file `.env.production` với URL backend thực tế:

```env
VITE_API_URL=https://your-backend.onrender.com
```

**Ví dụ:**
```env
VITE_API_URL=https://food-ordering-api.onrender.com
```

> ⚠️ **Lưu ý:** URL backend PHẢI là HTTPS, không được dùng HTTP!

---

### 3. ✅ **File cấu hình routing đã được tạo sẵn**

- ✅ `vercel.json` - Cho Vercel deployment
- ✅ `public/_redirects` - Cho Netlify deployment

Các file này đảm bảo khi người dùng nhấn F5 (refresh) trên bất kỳ route nào, sẽ không bị lỗi 404.

---

## 📦 Deploy Frontend

### Option 1: Deploy lên Vercel (Khuyến nghị)

1. **Cài đặt Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login vào Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy từ thư mục front-end:**
   ```bash
   cd front-end
   vercel
   ```

4. **Cấu hình biến môi trường trên Vercel Dashboard:**
   - Vào project settings → Environment Variables
   - Thêm: `VITE_API_URL` = `https://your-backend.onrender.com`

5. **Deploy production:**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy lên Netlify

1. **Cài đặt Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login vào Netlify:**
   ```bash
   netlify login
   ```

3. **Build project:**
   ```bash
   cd front-end
   npm run build
   ```

4. **Deploy:**
   ```bash
   netlify deploy --prod --dir=dist
   ```

5. **Cấu hình biến môi trường trên Netlify Dashboard:**
   - Vào Site settings → Environment variables
   - Thêm: `VITE_API_URL` = `https://your-backend.onrender.com`

---

## 🔧 Deploy Backend (Spring Boot)

### Deploy lên Render.com (Khuyến nghị - Free tier có HTTPS)

1. **Tạo tài khoản tại:** https://render.com

2. **Tạo Web Service mới:**
   - Connect GitHub repository
   - Chọn thư mục `DATN-BACK-END`
   - Build Command: `./mvnw clean package -DskipTests`
   - Start Command: `java -jar target/*.jar`

3. **Thêm biến môi trường:**
   ```
   ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
   SPRING_PROFILES_ACTIVE=prod
   ```

4. **Thêm biến môi trường database (nếu dùng MySQL external):**
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://your-db-host:3306/your_database
   SPRING_DATASOURCE_USERNAME=your_username
   SPRING_DATASOURCE_PASSWORD=your_password
   ```

---

## 🧪 Kiểm Tra Sau Khi Deploy

### 1. Kiểm tra CORS
Mở DevTools (F12) → Console, xem có lỗi CORS không:
```
Access to XMLHttpRequest at 'https://backend.com/api' from origin 'https://frontend.com' 
has been blocked by CORS policy
```

**Nếu có lỗi này:** Kiểm tra lại biến môi trường `ALLOWED_ORIGINS` trên backend.

### 2. Kiểm tra Mixed Content
Nếu thấy lỗi:
```
Mixed Content: The page at 'https://...' was loaded over HTTPS, 
but requested an insecure resource 'http://...'
```

**Giải pháp:** Đảm bảo `VITE_API_URL` trong `.env.production` dùng HTTPS.

### 3. Kiểm tra Routing
- Truy cập: `https://your-domain.com/login`
- Nhấn F5 (Refresh)
- **Kết quả mong đợi:** Trang vẫn hiển thị bình thường, không bị 404

---

## 🐛 Troubleshooting

### Lỗi: "Failed to fetch" hoặc "Network Error"

**Nguyên nhân:** Backend chưa chạy hoặc CORS chưa được cấu hình đúng.

**Giải pháp:**
1. Kiểm tra backend có đang chạy không: `curl https://your-backend.com/api/health`
2. Kiểm tra biến môi trường `ALLOWED_ORIGINS` trên backend
3. Restart backend service sau khi thay đổi biến môi trường

### Lỗi: 404 khi refresh trang

**Nguyên nhân:** Server không redirect về `index.html`.

**Giải pháp:**
- Vercel: Đảm bảo có file `vercel.json`
- Netlify: Đảm bảo có file `public/_redirects`

### Lỗi: "Chunk size too large"

**Tác động:** Trang web load chậm lần đầu.

**Giải pháp tạm thời:** Chấp nhận được, không ảnh hưởng chức năng.

**Giải pháp dài hạn:** Implement code splitting với React.lazy() và Suspense.

---

## 📊 Monitoring

Sau khi deploy, theo dõi:
- **Vercel Analytics:** Xem traffic và performance
- **Backend Logs:** Kiểm tra lỗi API trên Render dashboard
- **Browser DevTools:** Kiểm tra Network tab và Console

---

## 🔒 Security Checklist

- ✅ Backend dùng HTTPS
- ✅ Frontend dùng HTTPS
- ✅ CORS được cấu hình chính xác
- ✅ Không commit file `.env` vào Git
- ✅ Sử dụng biến môi trường cho sensitive data
- ⚠️ Cân nhắc thêm rate limiting cho API
- ⚠️ Cân nhắc thêm API authentication/authorization

---

## 📝 Notes

- File `vercel.json` và `public/_redirects` đã được tạo sẵn
- Backend `WebConfig.java` đã được cập nhật để hỗ trợ dynamic CORS origins
- Nhớ cập nhật biến môi trường sau mỗi lần thay đổi domain

**Good luck! 🚀**
