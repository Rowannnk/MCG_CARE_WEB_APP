import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Aircons from "./pages/Aircons";
import Services from "./pages/Services";
import MyBooking from "./pages/MyBooking";
import AirconDetails from "./pages/AirconDetails";
import Favorite from "./pages/Favorite";
import Layout from "./pages/admin/Layout";
import Dashboard from "./pages/admin/Dashboard";
import AddProduct from "./pages/admin/AddProduct";
import AddTechnician from "./pages/admin/AddTechnician";
import ListBooking from "./pages/admin/ListBooking";
import ListProducts from "./pages/admin/ListProducts";
import UserManagement from "./pages/admin/UserManagement";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
  const location = useLocation();
  const isAdminRoute = useLocation().pathname.startsWith("/admin");
  const isAuthPage = ["/login", "/register"].includes(location.pathname);
  return (
    <>
      {!isAdminRoute && !isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aircons" element={<Aircons />} />
        <Route path="/aircons/:id" element={<AirconDetails />} />
        <Route path="/services" element={<Services />} />
        <Route path="/my-booking" element={<MyBooking />} />
        <Route path="/favorite" element={<Favorite />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route path="/admin/*" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-products" element={<AddProduct />} />
          <Route path="add-technician" element={<AddTechnician />} />
          <Route path="list-bookings" element={<ListBooking />} />
          <Route path="list-products" element={<ListProducts />} />
          <Route path="users" element={<UserManagement />} />
        </Route>
      </Routes>

      {!isAdminRoute && !isAuthPage && <Footer />}
    </>
  );
};

export default App;
