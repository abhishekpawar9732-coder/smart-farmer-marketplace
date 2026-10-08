import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

import "./App.css";

import { useMarketplace } from "./context/MarketplaceContext";

import LoginForm from "./components/LoginForm";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import Order from "./components/Order";
import CropDetection from "./components/CropDetection";

import CustomerDashboard from "./pages/CustomerDashboard";

import FarmerDashboard from "./pages/FarmerDashboard";
import FarmerProducts from "./pages/FarmerProducts";
import FarmerOrders from "./pages/FarmerOrders";

import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";


function App() {
  const { user, logout } = useMarketplace();

  // Normalize role so Farmer / FARMER / farmer all work
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
    <BrowserRouter>
      <div className="app">

        {/* ================= NAVBAR ================= */}

        <header className="navbar">

          <Link to="/" className="brand">
            🌾 Smart Farmer Marketplace
          </Link>

          <nav className="nav-links">

            {/* LOGIN */}
            {!user && (
              <Link to="/login">
                Login
              </Link>
            )}


            {/* ================= CUSTOMER NAV ================= */}

            {isCustomer && (
              <>
                <Link to="/customer">
                  Dashboard
                </Link>

                <Link to="/customer/products">
                  Products
                </Link>

                <Link to="/customer/cart">
                  Cart
                </Link>

                <Link to="/customer/orders">
                  Orders
                </Link>

                <Link to="/crop-detection">
                  Crop Matching
                </Link>
              </>
            )}


            {/* ================= FARMER NAV ================= */}

            {isFarmer && (
              <>
                <Link to="/farmer">
                  Dashboard
                </Link>

                <Link to="/farmer/products">
                  My Products
                </Link>

                <Link to="/farmer/orders">
                  Customer Orders
                </Link>

                <Link to="/crop-detection">
                  Crop Matching
                </Link>
              </>
            )}


            {/* ================= ADMIN NAV ================= */}

            {isAdmin && (
              <>
                <Link to="/admin">
                  Dashboard
                </Link>

                <Link to="/admin/users">
                  Users
                </Link>

                <Link to="/admin/products">
                  Products
                </Link>

                <Link to="/admin/orders">
                  Orders
                </Link>
              </>
            )}


            {/* LOGOUT */}

            {user && (
              <button
                className="logout-button"
                onClick={logout}
              >
                Logout
              </button>
            )}

          </nav>
        </header>


        {/* ================= MAIN ================= */}

        <main>

          <Routes>

            {/* ================= HOME ================= */}

            <Route
              path="/"
              element={
                <section className="hero-section">

                  <div className="hero-content">

                    <span className="section-badge">
                      🌱 Agriculture + Technology
                    </span>

                    <h1>
                      Smart Farmer Marketplace
                    </h1>

                    <p>
                      A direct farmer-to-customer
                      agricultural marketplace that
                      reduces intermediaries and provides
                      better price transparency.
                    </p>


                    {/* NOT LOGGED IN */}

                    {!user && (
                      <Link
                        to="/login"
                        className="primary-button"
                      >
                        Get Started
                      </Link>
                    )}


                    {/* CUSTOMER */}

                    {isCustomer && (
                      <Link
                        to="/customer"
                        className="primary-button"
                      >
                        Go to Customer Dashboard
                      </Link>
                    )}


                    {/* FARMER */}

                    {isFarmer && (
                      <Link
                        to="/farmer"
                        className="primary-button"
                      >
                        Go to Farmer Dashboard
                      </Link>
                    )}


                    {/* ADMIN */}

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="primary-button"
                      >
                        Go to Admin Dashboard
                      </Link>
                    )}

                  </div>

                </section>
              }
            />


            {/* ================= LOGIN ================= */}

            <Route
              path="/login"
              element={
                user ? (
                  <Navigate to="/" replace />
                ) : (
                  <LoginForm />
                )
              }
            />


            {/* ================================================= */}
            {/* CUSTOMER ROUTES */}
            {/* ================================================= */}

            <Route
              path="/customer"
              element={
                isCustomer ? (
                  <CustomerDashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />


            <Route
              path="/customer/products"
              element={
                isCustomer ? (
                  <ProductList />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />


            <Route
              path="/customer/cart"
              element={
                isCustomer ? (
                  <Cart />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />


            <Route
              path="/customer/orders"
              element={
                isCustomer ? (
                  <Order />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />


            {/* ================================================= */}
            {/* FARMER ROUTES */}
            {/* ================================================= */}

            <Route
              path="/farmer"
              element={
                isFarmer ? (
                  <FarmerDashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />


            <Route
              path="/farmer/products"
              element={
                isFarmer ? (
                  <FarmerProducts />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />


            <Route
              path="/farmer/orders"
              element={
                isFarmer ? (
                  <FarmerOrders />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />


            {/* ================================================= */}
            {/* ADMIN ROUTES */}
            {/* ================================================= */}

            <Route
              path="/admin"
              element={
                isAdmin ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />


            <Route
              path="/admin/users"
              element={
                isAdmin ? (
                  <AdminUsers />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />


            <Route
              path="/admin/products"
              element={
                isAdmin ? (
                  <AdminProducts />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />


            <Route
              path="/admin/orders"
              element={
                isAdmin ? (
                  <AdminOrders />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />


            {/* ================================================= */}
            {/* SEASONAL CROP MATCHING */}
            {/* ================================================= */}

            <Route
              path="/crop-detection"
              element={
                user ? (
                  <CropDetection />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />


            {/* ================= FALLBACK ================= */}

            <Route
              path="*"
              element={
                <Navigate to="/" replace />
              }
            />

          </Routes>

        </main>


        {/* ================= FOOTER ================= */}

        <footer className="footer">

          <h3>
            🌾 Smart Farmer Marketplace
          </h3>

          <p>
            Direct Farmer-to-Customer Agricultural Marketplace
          </p>

          <p>
            © 2026 Smart Farmer Marketplace
          </p>

        </footer>

      </div>
    </BrowserRouter>
  );
}

export default App;