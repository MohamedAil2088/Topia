# 🚀 TOPIA E-commerce - Full Deployment Guide

## 📦 Step 1: Database Setup (MongoDB Atlas)

### 1. إنشاء حساب MongoDB Atlas
1. روح على: https://www.mongodb.com/cloud/atlas/register
2. اعمل حساب مجاني
3. اختار **M0 Free Tier**
4. اختار Region قريب منك (Europe/Frankfurt مثلاً)

### 2. إنشاء Cluster
1. اسم الـ Cluster: `topia-cluster`
2. Cloud Provider: AWS
3. Region: Frankfurt (eu-central-1)
4. Cluster Tier: M0 Sandbox (FREE)
5. اضغط **Create Cluster**

### 3. إنشاء Database User
1. **Database Access** → Add New Database User
2. Username: `topiaAdmin`
3. Password: **احفظ الباسورد ده!** (مثلاً: `Topia@2024Secure`)
4. Database User Privileges: **Atlas Admin**
5. اضغط **Add User**

### 4. السماح بالاتصال
1. **Network Access** → Add IP Address
2. اختار **Allow Access from Anywhere** (0.0.0.0/0)
3. اضغط **Confirm**

### 5. الحصول على Connection String
1. **Databases** → Connect → Connect your application
2. Driver: **Node.js**
3. Version: **5.5 or later**
4. **انسخ الـ Connection String:**
```
mongodb+srv://topiaAdmin:<password>@topia-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
5. **استبدل `<password>` بالباسورد الحقيقي!**

---

## 🖥️ Step 2: Backend Deployment (Render)

### 1. تجهيز الكود
ملف `.env` للـ production:
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://topiaAdmin:YourPassword@topia-cluster.xxxxx.mongodb.net/topia-ecommerce?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

### 2. Deploy على Render
1. روح على: https://render.com
2. Sign up with GitHub
3. اضغط **New +** → **Web Service**
4. Connect Repository: `Topia`
5. Settings:
   - **Name**: `topia-backend`
   - **Region**: Frankfurt
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
   - **Instance Type**: Free

### 3. Environment Variables
اضف كل الـ variables دي:
- `NODE_ENV`: `production`
- `MONGO_URI`: (الـ connection string من MongoDB)
- `JWT_SECRET`: (مفتاح قوي 32+ حرف)
- `CORS_ORIGIN`: (هنضيفه بعدين من Vercel)

### 4. Deploy
اضغط **Create Web Service**

⏰ **الانتظار:** 5-10 دقايق

**النتيجة:** Backend URL مثل:
```
https://topia-backend.onrender.com
```

---

## 🎨 Step 3: Frontend Deployment (Vercel)

### 1. تحديث API URL
في ملف `.env.production`:
```env
VITE_API_URL=https://topia-backend.onrender.com/api
```

### 2. Deploy على Vercel
1. روح على: https://vercel.com
2. Sign up with GitHub
3. اضغط **Add New** → **Project**
4. Import `Topia` repository
5. Settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. **Environment Variables**:
   - `VITE_API_URL`: `https://topia-backend.onrender.com/api`

### 3. Deploy
اضغط **Deploy**

⏰ **الانتظار:** 2-3 دقايق

**النتيجة:** Frontend URL مثل:
```
https://topia-mens.vercel.app
```

---

## 🔄 Step 4: ربط Frontend بـ Backend

### 1. تحديث CORS
ارجع لـ Render → Backend → Environment:
- `CORS_ORIGIN`: `https://topia-mens.vercel.app`

### 2. Redeploy Backend
Render → Manual Deploy → Deploy latest commit

---

## ✅ Step 5: اختبار الموقع

1. افتح Frontend URL
2. جرب:
   - التسجيل
   - Login
   - إضافة منتج للسلة
   - Checkout

---

## 📝 ملاحظات مهمة:

### Free Tier Limitations:
- **Render Free**: Backend بيدخل sleep mode بعد 15 دقيقة عدم نشاط
- **MongoDB Atlas M0**: 512MB storage
- **Vercel**: Unlimited bandwidth

### Performance:
- أول request للـ Backend ممكن ياخد 30-60 ثانية (cold start)
- بعد كده هيكون سريع

---

## 🎉 النتيجة النهائية:

✅ Frontend Live على Vercel
✅ Backend Live على Render  
✅ Database على MongoDB Atlas
✅ كل حاجة شغالة!

---

**مبروك! 🎊 المشروع بقى Live!**
