import React from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";

import "./App.css";

import { MarketplaceProvider, useMarketplace } from "./context/MarketplaceContext";

import LoginForm from "./components/LoginForm";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import Order from "./components/Order";
import CropDetection from "./components/CropDetection";

import Dashboard from "./components/Dashboard";

import FarmerDashboard from "./pages/FarmerDashboard";
import FarmerProducts from "./pages/FarmerProducts";
import FarmerOrders from "./pages/FarmerOrders";

import CustomerDashboard from "./pages/CustomerDashboard";

import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminUsers from "./pages/AdminUsers";


function Navbar() {
  const { user, logout } = useMarketplace();

  const role = String(
    user?.role ||
    user?.userRole ||
    user?.type ||
    ""
  ).toLowerCase();

  const isCustomer = role === "customer";
  const isFarmer = role === "farmer";
  const isAdmin = role === "admin";

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        🌾 Smart Farmer Marketplace
      </Link>

      <nav className="nav-links">

        {!user && (
          <Link to="/login">Login</Link>
        )}

        {user && (
          <>
            {/* CUSTOMER NAVIGATION */}
            {isCustomer && (
              <>
                <Link to="/customer">Dashboard</Link>
                <Link to="/products">Products</Link>
                <Link to="/cart">Cart</Link>
                <Link to="/orders">Orders</Link>
                <Link to="/crop-matching">Crop Matching</Link>
              </>
            )}

            {/* FARMER NAVIGATION */}
            {isFarmer && (
              <>
                <Link to="/farmer">Dashboard</Link>
                <Link to="/farmer/products">My Products</Link>
                <Link to="/farmer/orders">Customer Orders</Link>
                <Link to="/crop-matching">Crop Matching</Link>
              </>
            )}

            {/* ADMIN NAVIGATION */}
            {isAdmin && (
              <>
                <Link to="/admin">Dashboard</Link>
                <Link to="/admin/users">Users</Link>
                <Link to="/admin/products">Products</Link>
                <Link to="/admin/orders">Orders</Link>
              </>
            )}

            <button
              className="nav-logout"
              onClick={logout}
            >
              Logout
            </button>
          </>
        )}

      </nav>
    </header>
  );
}


function Home() {
  return (
    <main>

      <section className="hero-section">

        <div className="hero-content">

          <span className="section-badge">
            🌱 Agriculture + Technology
          </span>

          <h1>
            Smart Farmer Marketplace
          </h1>

          <p>
            Connecting farmers directly with consumers through a
            transparent and technology-driven marketplace.
          </p>

          <div className="hero-actions">

            <Link
              to="/products"
              className="primary-button"
            >
              Explore Products
            </Link>

            <Link
              to="/login"
              className="secondary-button"
            >
              Get Started
            </Link>

          </div>

        </div>

      </section>


      <section className="home-section">

        <div className="section-heading">

          <span className="section-badge">
            🌾 Our Mission
          </span>

          <h2>
            Empowering Farmers Through Direct Selling
          </h2>

          <p>
            Smart Farmer Marketplace helps farmers sell their
            products directly to consumers without unnecessary
            intermediaries.
          </p>

        </div>


        <div className="feature-grid">

          <div className="feature-card">

            <div className="feature-icon">
              🚜
            </div>

            <h3>
              Direct Farmer Selling
            </h3>

            <p>
              Farmers can list and sell their agricultural
              products directly to customers.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              💰
            </div>

            <h3>
              Price Transparency
            </h3>

            <p>
              Clear product pricing helps farmers and customers
              make better decisions.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              🌱
            </div>

            <h3>
              Seasonal Crop Matching
            </h3>

            <p>
              Get crop recommendations based on seasonal
              agricultural conditions.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              📦
            </div>

            <h3>
              Order Tracking
            </h3>

            <p>
              Track orders from acceptance to delivery with
              transparent order status.
            </p>

          </div>

        </div>

      </section>


      <section className="home-section">

        <div className="section-heading">

          <span className="section-badge">
            👥 Platform Roles
          </span>

          <h2>
            One Marketplace, Three Roles
          </h2>

        </div>


        <div className="role-grid">

          <div className="role-card">

            <div className="feature-icon">
              👨‍🌾
            </div>

            <h3>
              Farmer
            </h3>

            <p>
              Add products, manage inventory, view customer
              orders and track earnings.
            </p>

          </div>


          <div className="role-card">

            <div className="feature-icon">
              🛒
            </div>

            <h3>
              Customer
            </h3>

            <p>
              Browse agricultural products, add items to cart,
              place orders and track deliveries.
            </p>

          </div>


          <div className="role-card">

            <div className="feature-icon">
              🛡️
            </div>

            <h3>
              Admin
            </h3>

            <p>
              Manage products, users and marketplace orders.
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}


function AppRoutes() {

  const { user } = useMarketplace();

  return (
    <>
      <Navbar />

      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={<Home />}
        />


        {/* LOGIN */}
        <Route
          path="/login"
          element={
            user
              ? <Navigate to="/" replace />
              : <LoginForm />
          }
        />


        {/* GENERAL DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            user
              ? <Dashboard />
              : <Navigate to="/login" replace />
          }
        />


        {/* =========================
            CUSTOMER ROUTES
           ========================= */}

        <Route
          path="/customer"
          element={
            user
              ? <CustomerDashboard />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/products"
          element={
            user
              ? <ProductList />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/cart"
          element={
            user
              ? <Cart />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/orders"
          element={
            user
              ? <Order />
              : <Navigate to="/login" replace />
          }
        />


        {/* =========================
            FARMER ROUTES
           ========================= */}

        <Route
          path="/farmer"
          element={
            user
              ? <FarmerDashboard />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/farmer/products"
          element={
            user
              ? <FarmerProducts />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/farmer/orders"
          element={
            user
              ? <FarmerOrders />
              : <Navigate to="/login" replace />
          }
        />


        {/* =========================
            ADMIN ROUTES
           ========================= */}

        <Route
          path="/admin"
          element={
            user
              ? <AdminDashboard />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/admin/users"
          element={
            user
              ? <AdminUsers />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/admin/products"
          element={
            user
              ? <AdminProducts />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/admin/orders"
          element={
            user
              ? <AdminOrders />
              : <Navigate to="/login" replace />
          }
        />


        {/* =========================
            CROP MATCHING
           ========================= */}

        <Route
          path="/crop-matching"
          element={
            user
              ? <CropDetection />
              : <Navigate to="/login" replace />
          }
        />


        {/* UNKNOWN ROUTE */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>


      <footer className="footer">

        <div className="footer-content">

          <div>
            <h3>
              🌾 Smart Farmer Marketplace
            </h3>

            <p>
              Connecting farmers directly with consumers.
            </p>
          </div>

          <div>
            <p>
              Agriculture + Technology
            </p>

            <p>
              © 2026 Smart Farmer Marketplace
            </p>
          </div>

        </div>

      </footer>

    </>
  );
}


export default function App() {

  return (
    <MarketplaceProvider>

      <BrowserRouter>

        <AppRoutes />

      </BrowserRouter>

    </MarketplaceProvider>
  );
}