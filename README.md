# 🛍️ Aura Ecommerce

![AURA Ecommerce Banner](Gemini_Generated_Image_l9au9l9au9l9au9l.png)

**Aura Ecommerce** is a full-stack e-commerce platform built with the **MERN Stack** (MongoDB, Express, React, Node.js). It features a robust admin dashboard, secure user authentication, shopping cart functionality, and integrated payment processing via Razorpay.

The application is fully responsive, designed with **Tailwind CSS**, and deployed for production using **Vercel** (Frontend) and **Render** (Backend).

## 🚀 Live Demo

- **Frontend (Storefront):** [https://aura-ecommerce-mu.vercel.app](https://aura-ecommerce-mu.vercel.app)
- **Backend (API):** [https://aura-ecommerce-1.onrender.com](https://aura-ecommerce-1.onrender.com)

---

## ✨ Key Features

### 👤 User Features
- **Secure Authentication:** JWT-based login/register with HttpOnly cookies and authorization headers.
- **Product Browsing:** Advanced filtering by category, price, and "New Arrivals."
- **Shopping Cart:** Real-time add-to-cart functionality with local storage persistence.
- **Wishlist:** Save favorite items for later.
- **Order Management:** View order history and status tracking.
- **Secure Payments:** Integrated **Razorpay** gateway for safe transactions.
- **Responsive Design:** Mobile-first UI built with Tailwind CSS.

### 🛡️ Admin Dashboard
- **Product Management:** Create, update, and delete products (CRUD).
- **Sales Analytics:** Visual charts showing sales performance and user growth.
- **Order Control:** Update order status (Processing, Shipped, Delivered).
- **User Management:** View user lists and block/unblock users.

---

## 🛠️ Tech Stack

**Frontend:**
- [React.js](https://reactjs.org/) - UI Library
- [Redux Toolkit](https://redux-toolkit.js.org/) - State Management
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Axios](https://axios-http.com/) - API Requests
- [Vite](https://vitejs.dev/) - Build Tool

**Backend:**
- [Node.js](https://nodejs.org/) - Runtime Environment
- [Express.js](https://expressjs.com/) - Web Framework
- [MongoDB Atlas](https://www.mongodb.com/atlas) - Database
- [Mongoose](https://mongoosejs.com/) - ODM

**Tools & Services:**
- **Authentication:** JSON Web Tokens (JWT)
- **Payments:** Razorpay
- **Deployment:** Vercel (Frontend), Render (Backend)
- **Version Control:** Git & GitHub

---

## 📸 Screenshots

| Landing Page | Product Details |
|:---:|:---:|
| ![Home](screenshots/homepage.png) | ![Product](screenshots/product detail.png) | 


| Shopping Cart | Admin Dashboard |
|:---:|:---:|
| ![Cart](screenshots/shop page.png)(screenshots/cart page.png) | ![Admin](screenshots/admin dashbord.png) 

---

## ⚙️ Installation & Local Setup

Follow these steps to run the project locally on your machine.

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB Account (URI)

### 1. Clone the Repository
```bash
git clone [https://github.com/AmanTiwari23/Aura-Ecommerce.git](https://github.com/AmanTiwari23/Aura-Ecommerce.git)
cd Aura-Ecommerce


### 2. Backend Setup
Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install

## Create a .env file in the backend directory:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
NODE_ENV=development
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLIENT_URL=http://localhost:5173

Start the backend server:

Bash

npm run server


## 3. Frontend Setup
Open a new terminal, navigate to the frontend folder, and install dependencies:

Bash

cd frontend
npm install
Create a .env file in the frontend directory:

Code snippet

VITE_API_URL=http://localhost:5000/api
Start the React app:

Bash

npm run dev
## 🔒 Security Measures
JWT Authentication: Tokens are managed via a dual-check system (Cookies & Authorization Headers) to ensure compatibility with modern browser privacy settings.

CORS Configuration: Strictly configured to allow requests only from trusted frontend domains.

Environment Variables: Sensitive keys (Database URI, Payment Secrets) are never exposed in the client-side code.

 ## 🤝 Contributing
Contributions are welcome!

Fork the project.

Create your Feature Branch (git checkout -b feature/AmazingFeature).

Commit your changes (git commit -m 'Add some AmazingFeature').

Push to the Branch (git push origin feature/AmazingFeature).

Open a Pull Request.

📞 Contact
Your Aman Tiwari - LinkedIn: https://www.linkedin.com/in/www.linkedin.com/in/aman-tiwari2001

GitHub: https://github.com/AmanTiwari23

Email: tiwari95aman@gmail.com