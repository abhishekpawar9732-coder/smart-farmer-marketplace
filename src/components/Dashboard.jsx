import { useMarketplace } from "../context/MarketplaceContext";

function Dashboard() {
  const { user, logout } = useMarketplace();

  if (!user) {
    return (
      <section id="dashboard">
        <h2>📊 Dashboard</h2>

        <div className="form-card">
          <h3>Please login to access your dashboard.</h3>
        </div>
      </section>
    );
  }

  return (
    <section id="dashboard">
      <h2>📊 {user.role} Dashboard</h2>

      <div className="dashboard-card">

        <div className="dashboard-header">
          <div>
            <span className="section-badge">
              👋 Welcome
            </span>

            <h3>{user.name}</h3>

            <p>{user.email}</p>

            <strong>Role: {user.role}</strong>
          </div>

          <button onClick={logout}>
            Logout
          </button>
        </div>

        {user.role === "Customer" && (
          <div className="dashboard-grid">

            <div className="dashboard-item">
              🛒
              <h3>Browse Products</h3>
              <p>
                View fresh agricultural products from farmers.
              </p>
            </div>

            <div className="dashboard-item">
              🛍️
              <h3>My Cart</h3>
              <p>
                View products added to your shopping cart.
              </p>
            </div>

            <div className="dashboard-item">
              📦
              <h3>My Orders</h3>
              <p>
                Place orders and track their delivery status.
              </p>
            </div>

          </div>
        )}

        {user.role === "Farmer" && (
          <div className="dashboard-grid">

            <div className="dashboard-item">
              🌾
              <h3>My Products</h3>
              <p>
                List and manage your agricultural products.
              </p>
            </div>

            <div className="dashboard-item">
              📦
              <h3>Received Orders</h3>
              <p>
                View and manage customer orders.
              </p>
            </div>

            <div className="dashboard-item">
              💰
              <h3>Farmer Earnings</h3>
              <p>
                Monitor your sales and earnings.
              </p>
            </div>

          </div>
        )}

        {user.role === "Admin" && (
          <div className="dashboard-grid">

            <div className="dashboard-item">
              👥
              <h3>Manage Users</h3>
              <p>
                Manage farmers and customers.
              </p>
            </div>

            <div className="dashboard-item">
              🌾
              <h3>Manage Products</h3>
              <p>
                Monitor agricultural products listed on the platform.
              </p>
            </div>

            <div className="dashboard-item">
              📦
              <h3>Manage Orders</h3>
              <p>
                Monitor customer orders and order status.
              </p>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}

export default Dashboard;