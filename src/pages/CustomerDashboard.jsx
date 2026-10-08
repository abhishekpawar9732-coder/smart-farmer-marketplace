import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { useMarketplace } from "../context/MarketplaceContext";

const API_URL =
  "https://smart-farmer-marketplace-1.onrender.com/api/orders";

function CustomerDashboard() {
  const { user, cart } = useMarketplace();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await fetch(API_URL, {
          cache: "no-store"
        });

        if (!response.ok) {
          throw new Error("Failed to load orders");
        }

        const data = await response.json();

        setOrders(data);
      } catch (error) {
        console.error(
          "Error loading customer orders:",
          error
        );
      } finally {
        setLoadingOrders(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <section className="dashboard-page">

      <div className="dashboard-card">

        <span className="section-badge">
          🛒 Customer Dashboard
        </span>

        <h2>
          Welcome, {user?.name}! 👋
        </h2>

        <p>
          Manage your shopping, orders and seasonal
          crop recommendations from one place.
        </p>

        <div className="dashboard-grid">

          {/* PRODUCTS */}

          <Link
            to="/customer/products"
            className="dashboard-item"
          >
            <div className="feature-icon">
              🌾
            </div>

            <h3>
              Browse Products
            </h3>

            <p>
              Browse fresh agricultural products
              directly from farmers.
            </p>
          </Link>

          {/* CART */}

          <Link
            to="/customer/cart"
            className="dashboard-item"
          >
            <div className="feature-icon">
              🛒
            </div>

            <h3>
              My Cart
            </h3>

            <p>
              {cart.length} product(s) currently
              in your shopping cart.
            </p>
          </Link>

          {/* ORDERS */}

          <Link
            to="/customer/orders"
            className="dashboard-item"
          >
            <div className="feature-icon">
              📦
            </div>

            <h3>
              My Orders
            </h3>

            <p>
              {loadingOrders
                ? "Loading orders..."
                : `${orders.length} order(s) placed.`}
            </p>

            <p>
              Track your order status.
            </p>
          </Link>

          {/* SEASONAL CROP MATCHING */}

          <Link
            to="/crop-detection"
            className="dashboard-item"
          >
            <div className="feature-icon">
              🌱
            </div>

            <h3>
              Seasonal Crop Matching
            </h3>

            <p>
              Find suitable crops according
              to the farming season.
            </p>
          </Link>

        </div>

      </div>

    </section>
  );
}

export default CustomerDashboard;