# Streeva – Women Entrepreneur Platform

Streeva is a full-stack e-commerce platform designed to empower women entrepreneurs by providing a digital marketplace to showcase their products and reach a wider audience.

![Streeva Platform](https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1200&h=600&fit=crop)

## 🚀 Features

- **Store Discovery**: Interactive map to find women-owned businesses near you.
- **Marketplace**: Browse products by category (Clothing, Food, Jewelry, etc.).
- **Entrepreneur Dashboard**: Manage products, track orders, and view revenue.
- **AI Assistant**: Smart chatbot for product recommendations and support.
- **Secure Auth**: JWT-based authentication with role-based access control.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), React Router, Lucide Icons, Framer Motion
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **AI**: Google Gemini API
- **Maps**: Google Maps API (optional)

## 📦 Installation

1.  **Clone the repository** (if applicable)
2.  **Install dependencies**:
    ```bash
    # Install backend deps
    cd server
    npm install

    # Install frontend deps
    cd ../client
    npm install
    ```

3.  **Environment Setup**:
    - Copy `.env.example` to `.env` in the root folder.
    - Add your API keys (MongoDB URI, JWT Secret, Google Maps, Gemini API).

4.  **Seed Database** (Optional):
    ```bash
    npm run seed
    ```
    Creates demo data with 6 stores and 16 products.

## 🏃‍♂️ Running the App

From the root directory, run:

```bash
npm run dev
```

This will concurrently start:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## 🔑 Demo Credentials

**Customer Account**:
- Email: `demo@streeva.com`
- Password: `password123`

**Entrepreneur Accounts**:
- Emails: `priya@streeva.com`, `anita@streeva.com`, `meera@streeva.com`, etc.
- Password: `password123`

## 🤝 Contributing

Built with ❤️ for women entrepreneurs.
