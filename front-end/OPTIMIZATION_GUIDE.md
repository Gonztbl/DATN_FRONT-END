# ⚡ Performance Optimization Guide

## 🟡 Vấn Đề: Chunk Size Quá Lớn (1.1MB)

Hiện tại toàn bộ code đang được bundle vào một file JavaScript duy nhất (~1.1MB). Điều này khiến:
- Trang web load chậm lần đầu tiên
- Người dùng phải tải toàn bộ code ngay cả khi chỉ truy cập 1 trang

## ✅ Giải Pháp: Code Splitting với React.lazy()

### Bước 1: Cập nhật Router với Lazy Loading

**File hiện tại:** `src/App.jsx` hoặc `src/routes/index.jsx`

**Thay vì import trực tiếp:**
```javascript
// ❌ Cách cũ - tải tất cả ngay lập tức
import LoginPage from './features/auth/pages/LoginPage';
import DashboardPage from './features/auth/pages/DashboardPage';
import TransferHistoryPage from './features/auth/pages/TransferHistoryPage';
```

**Dùng React.lazy():**
```javascript
// ✅ Cách mới - chỉ tải khi cần
import { lazy, Suspense } from 'react';

const LoginPage = lazy(() => import('./features/auth/pages/LoginPage'));
const DashboardPage = lazy(() => import('./features/auth/pages/DashboardPage'));
const TransferHistoryPage = lazy(() => import('./features/auth/pages/TransferHistoryPage'));
const DepositPage = lazy(() => import('./features/auth/pages/DepositPage'));
const WithdrawPage = lazy(() => import('./features/withdraw/Withdraw'));
// ... các page khác
```

### Bước 2: Thêm Suspense Wrapper

Wrap routes với `<Suspense>` và loading fallback:

```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* ... các route khác */}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

### Bước 3: Cấu Hình Manual Chunks trong Vite

Cập nhật `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Tách vendor libraries thành chunk riêng
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['sweetalert2'],
          'http-vendor': ['axios'],
        }
      }
    },
    // Tăng giới hạn cảnh báo nếu cần
    chunkSizeWarningLimit: 1000,
  }
})
```

## 📊 Kết Quả Mong Đợi

**Trước khi tối ưu:**
```
dist/assets/index-C0UsUx3-.js   1,101.85 kB │ gzip: 260.14 kB
```

**Sau khi tối ưu:**
```
dist/assets/react-vendor-xxx.js      150 kB │ gzip:  50 kB
dist/assets/ui-vendor-xxx.js          80 kB │ gzip:  25 kB
dist/assets/LoginPage-xxx.js          45 kB │ gzip:  12 kB
dist/assets/DashboardPage-xxx.js      60 kB │ gzip:  15 kB
... (các chunk nhỏ khác)
```

## 🎯 Lợi Ích

1. **Initial Load nhanh hơn:** Chỉ tải code cần thiết cho trang đầu tiên
2. **Better Caching:** Vendor code (React, Axios) ít thay đổi → cache lâu hơn
3. **Parallel Loading:** Browser có thể tải nhiều chunk nhỏ song song
4. **Better UX:** Người dùng thấy content nhanh hơn

## 🔧 Các Tối Ưu Khác

### 1. Lazy Load Images
```javascript
<img 
  src={imageUrl} 
  loading="lazy" 
  alt="Description"
/>
```

### 2. Preload Critical Resources
Trong `index.html`:
```html
<link rel="preload" href="/fonts/main-font.woff2" as="font" type="font/woff2" crossorigin>
```

### 3. Optimize Dependencies
Kiểm tra các package không cần thiết:
```bash
npm run build -- --mode analyze
```

### 4. Use Production Build
Đảm bảo luôn dùng production build khi deploy:
```bash
npm run build  # Tự động dùng production mode
```

## 📝 Implementation Priority

### 🔴 Bắt buộc trước khi deploy:
- ✅ Đã xử lý: Routing configuration (vercel.json, _redirects)
- ✅ Đã xử lý: CORS configuration
- ✅ Đã xử lý: Environment variables

### 🟡 Nên làm sau khi deploy (trong 1-2 tuần):
- ⚠️ Code splitting với React.lazy()
- ⚠️ Manual chunks configuration
- ⚠️ Image optimization

### 🟢 Có thể làm sau (khi có traffic cao):
- CDN cho static assets
- Service Worker cho offline support
- Advanced caching strategies

## 🧪 Testing Performance

### Lighthouse Audit
```bash
# Sau khi deploy, chạy Lighthouse
npm install -g lighthouse
lighthouse https://your-domain.com --view
```

### Mục tiêu Performance Score:
- 🎯 **First Contentful Paint:** < 1.8s
- 🎯 **Largest Contentful Paint:** < 2.5s
- 🎯 **Total Blocking Time:** < 200ms
- 🎯 **Cumulative Layout Shift:** < 0.1

---

**Lưu ý:** Các tối ưu này không bắt buộc để app chạy được, nhưng sẽ cải thiện đáng kể trải nghiệm người dùng!
