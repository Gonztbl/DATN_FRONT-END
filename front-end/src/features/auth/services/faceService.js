import apiClient from "../../../api/apiClient";

const faceService = {
    /**
     * Helper to resolve the current user's ID reliably.
     * Checks localStorage first, then JWT token, then /api/me as fallback.
     */
    _getUserId: async (userId) => {
        console.log("🔍 [faceService._getUserId] Input userId:", userId);
        
        if (userId) {
            console.log("✅ [faceService._getUserId] Using provided userId:", userId);
            return userId;
        }
        
        // Try localStorage first (faster and more reliable)
        try {
            const userStr = localStorage.getItem('user');
            console.log("🔍 [faceService._getUserId] localStorage user string:", userStr);
            
            if (userStr) {
                const user = JSON.parse(userStr);
                console.log("🔍 [faceService._getUserId] Parsed user object:", user);
                
                const id = user.id ?? user.userId;
                if (id) {
                    console.log("✅ [faceService._getUserId] Resolved userId from localStorage:", id);
                    return id;
                } else {
                    console.warn("⚠️ [faceService._getUserId] No id or userId field in localStorage user object");
                }
            } else {
                console.warn("⚠️ [faceService._getUserId] No user in localStorage");
            }
        } catch (err) {
            console.error("❌ [faceService._getUserId] Could not parse user from localStorage", err);
        }
        
        // Try to extract from JWT token
        try {
            const token = localStorage.getItem('token');
            if (token) {
                console.log("🔍 [faceService._getUserId] Trying to parse JWT token...");
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(
                    atob(base64)
                        .split('')
                        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                        .join('')
                );
                const payload = JSON.parse(jsonPayload);
                console.log("🔍 [faceService._getUserId] JWT payload:", payload);
                
                // Try common JWT claim names for user ID
                const id = payload.userId ?? payload.id ?? payload.sub ?? payload.user_id;
                if (id) {
                    console.log("✅ [faceService._getUserId] Resolved userId from JWT token:", id);
                    return id;
                } else {
                    console.warn("⚠️ [faceService._getUserId] No userId field in JWT token");
                }
            }
        } catch (err) {
            console.error("❌ [faceService._getUserId] Could not parse JWT token", err);
        }
        
        // Fallback to /api/me
        console.log("🔍 [faceService._getUserId] Falling back to /api/me...");
        try {
            const res = await apiClient.get('/api/me');
            console.log("🔍 [faceService._getUserId] /api/me response:", res.data);
            
            // Try different paths: directly, in user object, or as userId field
            const id = res.data.id ?? 
                       res.data.userId ?? 
                       res.data.user?.id ?? 
                       res.data.user?.userId;
            
            if (id === undefined || id === null) {
                console.error("❌ [faceService._getUserId] CRITICAL: Could not find User ID in /api/me response");
                console.error("❌ [faceService._getUserId] /api/me full response:", JSON.stringify(res.data, null, 2));
            } else {
                console.log("✅ [faceService._getUserId] Resolved userId from /api/me:", id);
            }
            return id;
        } catch (err) {
            console.error("❌ [faceService._getUserId] Failed to get session info from /api/me", err);
            return null;
        }
    },

    /**
     * List registered face embeddings for a user.
     * GET /api/face/list/{userId}
     */
    listEmbeddings: async (userId) => {
        try {
            const id = await faceService._getUserId(userId);
            if (!id) return [];
            
            const res = await apiClient.get(`/api/face/list/${id}`);
            return Array.isArray(res.data) ? res.data : [];
        } catch (err) {
            console.error("Lỗi list embeddings:", err);
            return [];
        }
    },

    /**
     * Register a face pose (Front, Left, or Right).
     * POST /api/face/register?userId=&pose=
     * Backend expects multipart/form-data with image field
     */
    registerFace: async (formData) => {
        try {
            // 1. Resolve userId
            const userIdFromForm = formData.get("userId");
            const id = await faceService._getUserId(userIdFromForm || undefined);
            if (!id) throw new Error("Không tìm thấy User ID. Vui lòng đăng nhập lại.");

            // 2. Extract pose from FormData (backend expects it in query params only)
            const pose = formData.get("pose");
            
            console.log("📤 [registerFace] BEFORE delete - FormData keys:", Array.from(formData.keys()));
            console.log("📤 [registerFace] userId:", id, "pose:", pose);
            
            // 3. Remove pose and userId from FormData body (backend uses @RequestParam for these)
            formData.delete("pose");
            formData.delete("userId");
            
            console.log("📤 [registerFace] AFTER delete - FormData keys:", Array.from(formData.keys()));

            // 4. Build query params (backend uses @RequestParam)
            const config = {
                params: { userId: id, ...(pose ? { pose } : {}) }
            };

            console.log(`📤 [registerFace] Sending request with query params:`, config.params);

            // 5. Send FormData directly (multipart/form-data with only image field)
            const res = await apiClient.post(`/api/face/register`, formData, config);

            console.log('✅ Register success:', res.data);
            return res.data;
        } catch (err) {
            console.error('❌ Register error detail:', {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message
            });

            const errorMsg = err.response?.data?.message || err.response?.data?.error || "Đăng ký thất bại.";
            throw new Error(errorMsg);
        }
    },

    /**
     * Verify face (Authentication).
     * POST /api/face/verify?userId=
     * Backend expects multipart/form-data with image field
     */
    verifyFace: async (formData) => {
        try {
            // 1. Resolve userId
            const userIdFromForm = formData.get("userId");
            const id = await faceService._getUserId(userIdFromForm || undefined);

            // 2. Remove userId from FormData body (backend uses @RequestParam)
            formData.delete("userId");

            const config = {
                params: id ? { userId: id } : {}
            };

            // 3. Send FormData directly (multipart/form-data with only image field)
            const res = await apiClient.post(`/api/face/verify`, formData, config);
            return res.data;
        } catch (err) {
            throw new Error(err.response?.data?.message || "Xác thực thất bại.");
        }
    },

    /**
     * Delete an existing face embedding.
     * DELETE /api/face/{embeddingId}
     */
    deleteEmbedding: async (embeddingId) => {
        const res = await apiClient.delete(`/api/face/${embeddingId}`);
        return res.data;
    },

    /**
     * Generate embedding (Utility tool).
     */
    generateEmbedding: async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await apiClient.post(`/api/face/embedding`, formData);
        return res.data;
    },

    /**
     * Compare two faces (Utility tool).
     */
    compareFaces: async (img1, img2) => {
        const formData = new FormData();
        formData.append("img1", img1);
        formData.append("img2", img2);
        const res = await apiClient.post(`/api/face/compare`, formData);
        return res.data;
    },

    /**
     * Add face after user is already registered.
     * POST /api/face/add?userId=&pose=
     * Backend expects multipart/form-data with image field
     */
    addFace: async (formData) => {
        try {
            // 1. Resolve userId
            const userIdFromForm = formData.get("userId");
            const id = await faceService._getUserId(userIdFromForm || undefined);

            // 2. Extract pose from FormData (backend expects it in query params only)
            const pose = formData.get("pose");
            
            // 3. Remove pose and userId from FormData body (backend uses @RequestParam for these)
            formData.delete("pose");
            formData.delete("userId");

            const config = {
                params: { ...(id ? { userId: id } : {}), ...(pose ? { pose } : {}) }
            };

            // 4. Send FormData directly (multipart/form-data with only image field)
            const res = await apiClient.post(`/api/face/add`, formData, config);
            return res.data;
        } catch (err) {
            throw new Error(err.response?.data?.message || "Thêm khuôn mặt thất bại.");
        }
    }
};

export default faceService;