# ⚡ Quick Deploy Guide - TL;DR

> **Mục đích:** Hướng dẫn nhanh deploy lên production trong 10 phút

---

## 🚀 Deploy trong 6 bước

### 1️⃣ Deploy Backend (5 phút)

```bash
# Trên Render.com hoặc Railway.app
1. Connect GitHub repo
2. Chọn thư mục: DATN-BACK-END
3. Build command: ./mvnw clean package -DskipTests
4. Start command: java -jar target/*.jar
5. Thêm biến môi trường:
   ALLOWED_ORIGINS=https://your-app.vercel.app  # Sẽ cập nhật sau
6. Deploy và lấy URL (ví dụ: https://api-xyz.onrender.com)
```

### 2️⃣ Cập nhật Frontend Config (1 phút)

```bash
cd front-end
echo "VITE_API_URL=https://api-xyz.onrender.com" > .env.production
```

### 3️⃣ Kiểm tra và Build (2 phút)

```bash
npm run pre-deploy  # Kiểm tra
npm run build       # Build
```

### 4️⃣ Deploy Frontend (2 phút)

```bash
# Option A: Vercel
vercel --prod

# Option B: Netlify
netlify deploy --prod --dir=dist
```

Lấy URL frontend (ví dụ: https://my-app.vercel.app)

### 5️⃣ Cập nhật CORS Backend (1 phút)

```bash
# Trên Render/Railway dashboard:
1. Vào Environment Variables
2. Cập nhật ALLOWED_ORIGINS=https://my-app.vercel.app
3. Restart service
```

### 6️⃣ Test (2 phút)

```bash
1. Mở https://my-app.vercel.app
2. Login
3. Test các chức năng
4. F5 (refresh) → Không bị 404 ✅
5. Mở DevTools Console → Không có lỗi CORS ✅
```

---

## ✅ Files đã được tạo sẵn

- ✅ `front-end/vercel.json` - Routing cho Vercel
- ✅ `front-end/public/_redirects` - Routing cho Netlify
- ✅ `front-end/.env.production.example` - Template env
- ✅ `DATN-BACK-END/WebConfig.java` - CORS config

---

## 🔴 Checklist Nhanh

**Trước khi deploy:**
- [ ] Backend đã deploy và có URL HTTPS
- [ ] File `.env.production` có URL backend đúng
- [ ] Chạy `npm run build` thành công

**Sau khi deploy:**
- [ ] Frontend có URL HTTPS
- [ ] Backend có biến `ALLOWED_ORIGINS` với URL frontend
- [ ] Backend đã restart
- [ ] Test login thành công
- [ ] F5 không bị 404
- [ ] Console không có lỗi CORS

---

## 🆘 Troubleshooting 1 dòng

| Lỗi | Giải pháp |
|-----|-----------|
| 404 khi F5 | Đảm bảo có `vercel.json` hoặc `_redirects` |
| CORS error | Kiểm tra `ALLOWED_ORIGINS` trên backend và restart |
| Failed to fetch | Kiểm tra URL trong `.env.production` |
| Mixed Content | Đảm bảo backend URL dùng HTTPS |

---

## 📚 Chi tiết hơn?

- **Full guide:** [front-end/DEPLOYMENT_GUIDE.md](front-end/DEPLOYMENT_GUIDE.md)
- **Checklist:** [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md)
- **Status:** [front-end/PRODUCTION_READY.md](front-end/PRODUCTION_READY.md)

---

**Thời gian ước tính:** 10-15 phút

**Độ khó:** ⭐⭐☆☆☆ (Dễ)

**Good luck! 🚀**
