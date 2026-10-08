import { useEffect, useState } from "react";
import { apiRequest } from "../api";

const statuses = [
  "Pending",
  "Accepted",
  "Shipped",
  "Delivered"
];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/api/orders");
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load marketplace orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (
    order,
    newStatus
  ) => {
    try {
      const updated = await apiRequest(
        `/api/orders/${order.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            customer: order.customer,
            total: order.total,
            address: order.address,
            paymentMode: order.paymentMode,
            status: newStatus,
            date: order.date
          })
        }
      );

      setOrders((current) =>
        current.map((item) =>
          item.id === order.id
            ? updated
            : item
        )
      );
    } catch (err) {
      console.error(err);
      setError("Unable to update order.");
    }
  };

  return (
    <main className="page-shell">
      <div className="page-heading">
        <div>
          <span className="eyebrow">ADMIN PANEL</span>
          <h1>Manage Orders</h1>
          <p>
            Monitor marketplace orders and their current
            delivery status.
          </p>
        </div>

        <button
          className="secondary-button small-button"
          onClick={loadOrders}
        >
          ↻ Refresh
        </button>
      </div>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {loading ? (
        <div className="state-card">
          <div className="loader" />
          <p>Loading marketplace orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="state-card">
          <span className="empty-icon">📦</span>
          <h3>No orders found</h3>
          <p>
            Customer orders will appear here.
          </p>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => {
            const activeIndex =
              statuses.indexOf(order.status);

            return (
              <article
                className="order-card"
                key={order.id}
              >
                <div className="order-card-header">
                  <div>
                    <span className="order-label">
                      ORDER
                    </span>
                    <h3>#{order.id}</h3>
                  </div>

                  <span
                    className={`status-pill status-${order.status.toLowerCase()}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="order-info">
                  <div>
                    <span>Customer</span>
                    <strong>{order.customer}</strong>
                  </div>
                  <div>
                    <span>Total</span>
                    <strong>₹{order.total}</strong>
                  </div>
                  <div>
                    <span>Date</span>
                    <strong>{order.date}</strong>
                  </div>
                </div>

                <div className="address-box">
                  <span>Delivery Address</span>
                  <p>{order.address}</p>
                  <small>
                    Payment: {order.paymentMode}
                  </small>
                </div>

                <div className="tracking">
                  <span className="tracking-title">
                    Order Status
                  </span>

                  <div className="tracking-line">
                    {statuses.map(
                      (status, index) => (
                        <div
                          className={`tracking-step ${
                            index <= activeIndex
                              ? "completed"
                              : ""
                          }`}
                          key={status}
                        >
                          <span>{index + 1}</span>
                          <small>{status}</small>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <label className="status-control">
                  Update Status
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(
                        order,
                        e.target.value
                      )
                    }
                  >
                    {statuses.map((status) => (
                      <option key={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default AdminOrders;
