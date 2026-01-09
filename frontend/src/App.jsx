import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Navbar from "./components/Navbar";

import ProtectedRoutes from "./components/ProtectedRoutes";
import AdminRoute from "./components/AdminRoute";
import Dashboard from "./admin/Dashboard";
import Checkout from "./pages/Checkout";
import AdminLayout from "./admin/AdminLayout";
import AdminOrders from "./admin/AdminOrders";
import AdminProducts from "./admin/Products";
import AdminUsers from "./admin/Users";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { loadUser } from "./redux/authSlice";
import MyOrders from "./pages/MyOrders";
import OrderSuccess from "./pages/OrderSuccess";


const App = () => {
  const dispatch = useDispatch();

useEffect(() => {
  dispatch(loadUser());
}, []);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/orders"
          element={
            <ProtectedRoutes>
              <MyOrders />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoutes>
              <Checkout />
            </ProtectedRoutes>
          }
        />
        <Route path="/order-success/:id" element={<OrderSuccess />} />


        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
