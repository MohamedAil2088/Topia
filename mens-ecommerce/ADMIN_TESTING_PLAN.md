# Admin Panel Testing Plan

This document outlines the comprehensive testing strategy for the Admin Panel of the E-Commerce Application. Use this checklist to verify that all administrative actions are functioning correctly.

---

## 1. Authentication & Access Control
- [x] **Login as Admin**: Verify that logging in with admin credentials redirects to `/admin/dashboard`.
- [x] **Login as User**: Verify that logging in with non-admin credentials **denies access** to `/admin/*` routes and redirects to home or login.
- [x] **Direct URL Access**: Try accessing `/admin/products` without logging in. Should redirect to `/login`.
- [x] **Logout**: Verify that clicking logout clears the session and redirects to login.

## 2. Dashboard Overview (`/admin/dashboard`)
- [x] **Stats Loading**: Verify that "Total Sales", "Orders", "Products", and "Users" cards display numbers (not "Loading..." or errors).
- [x] **Recent Orders**: Ensure the "Recent Orders" table shows the latest 10 orders with correct status badges.
- [x] **Quick Links**: Click on "Add Product", "View Orders", etc., and verify navigation works.

## 3. Product Management (`/admin/products`)
### Create Product
- [x] **Form Validation**: Try submitting an empty form. Ensure "Required" errors appear.
- [x] **Successful Creation**:
    - Enter valid Name, Price, Stock, Description.
    - **Dynamic Categories**: Verify that the "Category" dropdown contains items fetched from the database (e.g., "Sports").
    - **Image Upload**: Upload an image file (JPG/PNG). Verify preview appears.
    - Submit. Verify "Success" SweetAlert appears and redirects to product list.
- [x] **Check Database**: Verify the new product appears in the main Shop page.

### Edit Product
- [x] **Load Data**: Click "Edit" on a product. Verify form is pre-filled with existing data (including existing images).
- [x] **Update Details**: Change Name and Price. Submit. Verify updates are reflected.
- [x] **Image Management**: Remove an old image and upload a new one. Submit. Verify changes.

### Delete Product
- [x] **Confirmation**: Click "Delete". Verify SweetAlert confirmation modal appears.
- [x] **Cancel**: Click "Cancel". Verify product is NOT deleted.
- [x] **Confirm**: Click "Yes, delete it". Verify product is removed from the list and "Deleted!" alert appears.

## 4. Category Management (`/admin/categories`)
- [x] **List Categories**: Verify all categories are listed with correct product counts (if implemented) or slugs.
- [x] **Add Category**:
    - Enter "Test Category".
    - Click "Add".
    - Verify "Success" SweetAlert appears.
    - Verify new category appears in the list immediately.
- [x] **Delete Category**:
    - Click `Trash` icon on "Test Category".
    - Confirm deletion in SweetAlert.
    - Verify category disappears.

## 5. User Management (`/admin/users`)
- [x] **List Users**: Verify list shows Name, Email, Role (Admin/User), and Joined Date.
- [x] **Edit User** (New Feature):
    - Click "Edit" icon.
    - Change a user's role from "User" to "Admin".
    - Click "Save Changes".
    - Verify "Success" alert and that the role badge updates in the table.
- [x] **Delete User**:
    - Try to delete a normal user. Confirm and verify deletion.
    - Try to delete **yourself** (Admin). Should ideally be preventing or handle gracefully.

## 6. Order Management (`/admin/orders`)
- [x] **List Orders**: Verify list shows ID, Customer Name, Date, Total, Payment Status, and Delivery Status.
- [x] **Order Details**: Click on an order ID.
    - Verify Order Items, Shipping Address, and Payment Method are correct.
- [x] **Update Status**:
    - Mark as "Delivered". Verify status updates to Green "Delivered" badge.
    - Mark as "Paid" (if applicable).

## 7. Coupon Management (`/admin/coupons`)
- [x] **Create Coupon**:
    - Create code "SUMMER20" with 20% discount.
    - Set Expiry Date.
    - Submit. Verify success alert.
- [x] **Validation**: Try creating a coupon without a code. Verify error.
- [x] **Copy Code**: Click copy icon. Verify toast notification "Code copied to clipboard".
- [x] **Delete Coupon**: Delete the created coupon and verify removal.

## 8. General UI/UX
- [x] **Responsive Design**: Check Admin Panel on mobile view (devtools). Ensure tables scroll and menus are accessible.
- [x] **Error Handling**: Disconnect internet or stop backend. Refresh page. Verify SweetAlert error message appears gracefully.

---

**Last Updated:** 2025-12-20
**Tester:** AntiGravity Agent
