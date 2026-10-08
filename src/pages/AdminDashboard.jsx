import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMarketplace } from "../context/MarketplaceContext";
import { apiRequest } from "../api";

function AdminDashboard() {
  const { user } = useMarketplace();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const [productData, orderData] =
          await Promise.all([
            apiRequest("/api/products"),
            apiRequest("/api/orders")
          ]);

        setProducts(productData);
        setOrders(orderData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, []);

  return (
    <main className="page-shell">
      <div className="page-heading">
        <div>
          <span className="eyebrow">ADMIN PANEL</span>
          <h1>Admin Dashboard</h1>
          <p>
            Welcome, {user?.name}. Monitor the Smart
            Farmer Marketplace.
          </p>
        </div>
      </div>

      <div className="metric-grid">
        <div className="metric-card">
          <span>🌾</span>
          <strong>
            {loading ? "—" : products.length}
          </strong>
          <small>Marketplace Products</small>
        </div>

        <div className="metric-card">
          <span>📦</span>
          <strong>
            {loading ? "—" : orders.length}
          </strong>
          <small>Total Orders</small>
        </div>

        <div className="metric-card">
          <span>⏳</span>
          <strong>
            {loading
              ? "—"
              : orders.filter(
                  (order) =>
                    order.status === "Pending"
                ).length}
          </strong>
          <small>Pending Orders</small>
        </div>
      </div>

      <div className="dashboard-grid admin-grid">
        <Link
          className="dashboard-item"
          to="/admin/products"
        >
          <div className="feature-icon">🌾</div>
          <h3>Manage Products</h3>
          <p>
            Add, edit and remove marketplace products
            using the live backend.
          </p>
        </Link>

        <Link
          className="dashboard-item"
          to="/admin/orders"
        >
          <div className="feature-icon">📦</div>
          <h3>Manage Orders</h3>
          <p>
            Monitor customer orders and update delivery
            status.
          </p>
        </Link>

        <Link
          className="dashboard-item"
          to="/admin/users"
        >
          <div className="feature-icon">👥</div>
          <h3>Manage Users</h3>
          <p>
            Review the current role-based user management
            interface.
          </p>
        </Link>

        <div className="dashboard-item overview-item">
          <div className="feature-icon">📊</div>
          <h3>Marketplace Overview</h3>
          <p>
            {products.length} products and{" "}
            {orders.length} orders are currently visible
            through the live API.
          </p>
        </div>
      </div>
    </main>
  );
}

export default AdminDashboard;
