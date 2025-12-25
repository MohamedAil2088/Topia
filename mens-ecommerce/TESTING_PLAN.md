# 🧪 Topia E-Commerce - Manual Testing Plan

This document outlines the testing scenarios to ensure the application is bug-free and fully functional.

## 🟢 1. Authentication & Authorization (Auth)
**Goal**: Verify users can register, login, and access appropriate resources.
- [x] **Register**:
    - [x] Create a new user with valid data. -> Should redirect to Home/Login.
    - [x] Try to register with an existing email. -> Should show error "This email is already registered".
    - [x] Passwords match validation. -> Shows "Passwords do not match" error.
- [x] **Login**:
    - [x] Login with valid user credentials (Admin: admin@example.com / 123456). -> Redirect to Home.
    - [ ] Login with invalid credentials. -> Show "Invalid email or password" error.
- [x] **Logout**:
    - [x] Click Logout from Navbar/Profile. -> Should clear state and redirect to Login.
- [x] **Route Protection**:
    - [x] Admin routes protected.
    - [x] Checkout protected.

## 🛒 2. Shopping Experience (User Side)
**Goal**: Verify browsing, searching, and purchasing flow.

### A. Navigation & Search
- [x] **Navbar**:
    - [x] Links (Home, Shop, About, Contact) work.
    - [x] Sticky header works on scroll.
    - [x] Cart icon updates badge number.
- [x] **Live Search**:
    - [x] Type "Shirt" in search bar. -> Dropdown appears with results.
    - [x] Click a result. -> Goes to `ProductDetailsPage`.

### B. Product Browsing (Shop Page)
- [x] **Listing**: Products appear from DB (Seeded Data).
- [x] **Filters**:
    - [x] Filter by Category (Sidebar). -> Product list updates.
- [x] **Sorting**:
    - [x] Sort by "Newest", "Price". -> Order changes.

### C. Product Details
- [x] **Display**: Images, Title, Price, Description load correctly.
- [x] **Gallery**: Clicking thumbnails changes the main image.
- [x] **Selection**:
    - [x] Select Size & Color. -> Visual selection highlighting works.
- [x] **Add to Cart**:
    - [x] Click "Add to Cart". -> Success Toast appears.
    - [x] Cart count in Navbar increments.

### D. Cart & Checkout
- [x] **Cart Page**:
    - [x] Items listed correctly (Image, Name, Price, Qty).
    - [x] Increase/Decrease quantity. -> Total price updates.
    - [x] Remove item. -> Item disappears.
- [x] **Checkout**:
    - [x] Fill shipping address form.
    - [x] Place Order. -> Should create order in DB and redirect to Success Page.

## 👮‍♂️ 3. Admin Dashboard
**Goal**: Verify the admin can manage the store.

### A. Dashboard Overview
- [x] **Stats**: Total Sales, Orders, Products count loading.

### B. Product Management
- [x] **Create Product**:
    - [x] Fill form (Name, Price, Category, Image URL, Stock).
    - [x] Submit. -> Product appears in list.
- [x] **Edit Product**:
    - [x] Change price/stock of existing product. -> Updates reflect on Shop Page.
- [x] **Delete Product**:
    - [x] Click delete. -> Confirm alert (SweetAlert2) -> Product removed.

### C. Order Management
- [x] **List Orders**: View all user orders.
- [x] **Process Order**: Change status to "Delivered".

## 🐛 Known/Potential Issues to Check
1.  [x] **Image Loading**: Placeholder images (`via.placeholder.com` & Unsplash) load correctly.
2.  [x] **Responsiveness**: Navbar/Sidebar work on Mobile (implemented with mobile menu).
3.  [x] **Form Validation**: Empty fields in Contact/Checkout forms are blocked by `required` attribute.
4.  [x] **404 Pages**: Accessing nonsense URL (`/xyz`) shows 404 layout.

---

**Testing Status**:
- Status: [Draft]
- Date: 2024-12-20
