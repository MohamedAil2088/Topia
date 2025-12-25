# TOPIA - Men's E-commerce Store

A modern, full-stack e-commerce application built for men's fashion, featuring a premium UI/UX, real-time product management, and a seamless checkout experience.

## 🚀 Tech Stack

- **Frontend:** React (Vite), TypeScript, Tailwind CSS, Redux Toolkit, React Router DOM.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB.
- **Authentication:** JWT (JSON Web Tokens).

## 🛠️ Features

- **Public Store:**
  - Modern implementation of Home, Shop, and Product Details pages.
  - Advanced filtering and searching (UI ready, API integrated).
  - Shopping Cart with quantity management.
  - Checkout process with shipping and payment steps.
- **Admin Dashboard:**
  - Dedicated layout with sidebar navigation.
  - Product Management (Add, Edit, Delete).
  - Order Management (View Orders).
  - Sales Overview.

## 📦 Installation

1.  **Clone the repository.**
2.  **Install dependencies:**
    ```bash
    # Frontend
    cd frontend
    npm install

    # Backend
    cd backend
    npm install
    ```
3.  **Environment Setup:**
    - Create `.env` in `frontend` with `VITE_API_URL=http://localhost:5000/api`.
    - Create `.env` in `backend` with your MongoDB URI and JWT_SECRET.

## 🏃‍♂️ Running the Project

1.  **Start Backend:**
    ```bash
    cd backend
    npm run dev
    ```
2.  **Start Frontend:**
    ```bash
    cd frontend
    npm run dev
    ```
3.  **Access the App:**
    - Store: `http://localhost:5174/`
    - Admin: `http://localhost:5174/admin`

## 🧪 Admin Access

To access the admin panel, ensure your user has `isAdmin: true` in the database, or use the temporary bypass implemented for development testing.

---
*Built with ❤️ by AI Assistant*
