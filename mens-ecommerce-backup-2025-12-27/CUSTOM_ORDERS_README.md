# 🎨 Custom Orders System - Complete Documentation

## 📋 Overview
نظام متكامل للطلبات المخصصة (Custom Design Orders) يسمح للعملاء برفع تصاميمهم الخاصة للطباعة على المنتجات.

---

## 🏗️ System Architecture

### **Backend Components:**
```
├── models/
│   ├── CustomOrder.js          # نموذج الطلب المخصص
│   └── Product.js              # تحديث: allowCustomization field
├── controllers/
│   └── customOrderController.js # 9 controller functions
├── middleware/
│   └── uploadCustomDesign.js   # Multer للصور
└── routes/
    └── customOrderRoutes.js    # API Routes
```

### **Frontend Components:**
```
├── components/
│   └── CustomizationSection.tsx    # قسم التخصيص
├── pages/
│   ├── MyCustomOrdersPage.tsx      # طلباتي
│   └── admin/
│       └── AdminCustomOrdersPage.tsx  # إدارة الطلبات
└── redux/
    └── slices/
        └── customOrdersSlice.ts    # Redux state management
```

---

## 🚀 Features

### **For Customers:**
✅ رفع حتى 5 صور للتصميم
✅ اختيار موقع الطباعة (Front/Back/Both)
✅ اختيار حجم الطباعة (Small/Medium/Large)
✅ كتابة ملاحظات خاصة (500 حرف)
✅ تفاصيل إضافية (1000 حرف)
✅ حساب السعر التلقائي
✅ تتبع حالة الطلب

### **For Admin:**
✅ Dashboard بالإحصائيات
✅ فلترة الطلبات حسب الحالة
✅ عرض الصور المرفوعة
✅ قراءة ملاحظات العميل
✅ تحديث حالة الطلب
✅ إضافة ملاحظات Admin
✅ Timeline كامل للطلب

---

## 📊 Order Status Flow

```
pending (قيد الانتظار)
    ↓
reviewing (قيد المراجعة)
    ↓
approved (تمت الموافقة)
    ↓
in-design (قيد التصميم)
    ↓
printing (قيد الطباعة)
    ↓
completed (تم الإنجاز)
    ↓
shipped (تم الشحن)
    ↓
delivered (تم التسليم)

أو

cancelled (تم الإلغاء) - في أي مرحلة قبل الطباعة
```

---

## 💰 Pricing Structure

### **Default Prices:**
```javascript
Print Location:
- Front Only: 80 EGP
- Back Only: 80 EGP
- Both Sides: 150 EGP

Print Size:
- Small (15x15cm): +0 EGP
- Medium (20x20cm): +20 EGP
- Large (30x30cm): +40 EGP
```

### **Example Calculation:**
```
Base Product: 500 EGP
+ Both Sides Print: 150 EGP
+ Large Size: 40 EGP
────────────────────
Total: 690 EGP
```

---

## 🔌 API Endpoints

### **Customer Endpoints:**
```
POST   /api/custom-orders/upload-images     # رفع الصور
POST   /api/custom-orders                   # إنشاء طلب
GET    /api/custom-orders/my-orders         # طلباتي
GET    /api/custom-orders/:id               # عرض طلب
PUT    /api/custom-orders/:id/cancel        # إلغاء طلب
```

### **Admin Endpoints:**
```
GET    /api/custom-orders/admin/all         # جميع الطلبات
GET    /api/custom-orders/admin/stats       # الإحصائيات
PUT    /api/custom-orders/:id/status        # تحديث الحالة
PUT    /api/custom-orders/:id/admin-notes   # إضافة ملاحظات
```

---

## 🎯 How to Enable Custom Orders for a Product

### **في Admin Panel:**
1. اذهب إلى **Products**
2. اختر المنتج (مثلاً: Plain Black Hoodie)
3. في form التعديل، فعّل:
   ```
   allowCustomization: true
   ```
4. اضبط الأسعار (اختياري):
   ```javascript
   customizationPricing: {
     frontPrint: 80,
     backPrint: 80,
     bothSides: 150,
     smallSize: 0,
     mediumSize: 20,
     largeSize: 40
   }
   ```
5. احفظ المنتج

---

## 🧪 Testing Guide

### **Test Scenario 1: Create Custom Order**
1. افتح منتج مفعل للتخصيص
2. اختر "Custom Design"
3. ارفع صور (1-5)
4. اختر Print Location & Size
5. اكتب ملاحظات
6. اضغط "Order Custom Design"
7. تحقق من الرسالة
8. اذهب لـ `/custom-orders/my-orders`

### **Test Scenario 2: Admin Management**
1. سجل دخول كـ Admin
2. اذهب لـ `/admin/custom-orders`
3. شاهد Dashboard
4. افتح طلب
5. شاهد الصور والملاحظات
6. غيّر الحالة
7. أضف ملاحظات Admin

---

## 📁 File Upload Settings

```javascript
Accepted Types: JPG, PNG, GIF, PDF
Max File Size: 10MB per file
Max Files: 5 per order
Upload Directory: uploads/custom-designs/
```

---

## 🔐 Permissions

### **Customer:**
- ✅ إنشاء طلبات مخصصة
- ✅ عرض طلباتهم فقط
- ✅ إلغاء طلباتهم (قبل الطباعة)

### **Admin:**
- ✅ عرض جميع الطلبات
- ✅ تحديث حالة أي طلب
- ✅ إضافة ملاحظات
- ✅ عرض الإحصائيات

---

## 🎨 UI/UX Features

### **Customer Interface:**
- تصميم نظيف وواضح
- Drag & drop للصور
- معاينة الصور المرفوعة
- حساب السعر الفوري
- Progress indicators
- Toast notifications

### **Admin Interface:**
- Dashboard بالإحصائيات
- جدول قابل للفلترة
- Modal لتفاصيل الطلب
- Status badges ملونة
- Quick actions
- Timeline tracking

---

## 🐛 Troubleshooting

### **الصور لا تُرفع:**
- تحقق من اتصال الإنترنت
- تحقق من token في localStorage
- تحقق من مجلد uploads/custom-designs موجود
- تحقق من permissions المناسبة

### **الطلب لا يُنشأ:**
- تحقق من تسجيل الدخول
- تحقق من رفع صورة واحدة على الأقل
- تحقق من console للأخطاء

### **Admin لا يرى الطلبات:**
- تحقق من role = 'admin'
- تحقق من الـ routes محمية بـ admin middleware

---

## 🚀 Future Enhancements

### **Phase 2 (Recommended):**
- [ ] Live Preview للتصميم على المنتج
- [ ] Image Editor مدمج
- [ ] Design Templates جاهزة
- [ ] Text overlay على المنتج
- [ ] Color picker مع preview
- [ ] Size comparison tool

### **Phase 3 (Advanced):**
- [ ] AI Design Suggestions
- [ ] 3D Product Preview
- [ ] Video upload support
- [ ] Multi-product bundles
- [ ] Approval workflow
- [ ] Email/WhatsApp notifications

---

## 📝 Notes

- الصور تُخزن في `uploads/custom-designs/`
- كل صورة لها اسم فريد (timestamp + random)
- الـ Timeline يتتبع جميع التغييرات
- الـ Pricing يمكن تخصيصه لكل منتج
- الـ System يدعم Dark Mode

---

## 🎯 Quick Links

**Customer:**
- My Custom Orders: `/custom-orders/my-orders`

**Admin:**
- Custom Orders Dashboard: `/admin/custom-orders`

---

## ✅ System Status

- [x] Database Models
- [x] Backend API
- [x] File Upload
- [x] Frontend Components
- [x] Redux Integration
- [x] Admin Dashboard
- [x] Customer Pages
- [x] Routing
- [x] Permissions
- [x] Documentation

**Status: ✅ Production Ready**

---

*Last Updated: December 23, 2024*
