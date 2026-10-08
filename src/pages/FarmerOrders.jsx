import { useEffect, useState } from "react";

const API_URL =
  "https://smart-farmer-marketplace-1.onrender.com/api/orders";

function FarmerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      console.log("ALL BACKEND ORDERS:", data);

      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading farmer orders:", error);
      setError("Unable to load customer orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();

    const interval = setInterval(() => {
      loadOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const currentOrder = orders.find(
        (order) => order.id === orderId
      );

      if (!currentOrder) return;

      const updatedOrder = {
        customer: currentOrder.customer,
        total: currentOrder.total,
        address: currentOrder.address,
        paymentMode: currentOrder.paymentMode,
        status: newStatus,
        date: currentOrder.date,
      };

      const response = await fetch(
        `${API_URL}/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedOrder),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}`
        );
      }

      const savedOrder = await response.json();

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId ? savedOrder : order
        )
      );
    } catch (error) {
      console.error("Error updating order:", error);

      alert("Unable to update order status.");
    }
  };

  return (
    <section className="farmer-orders">
      <h2>📦 Manage Customer Orders</h2>

      <p>
        View and manage orders placed by customers.
      </p>

      <button onClick={loadOrders}>
        🔄 Refresh Orders
      </button>

      {loading && <p>Loading orders...</p>}

      {!loading && error && (
        <div>
          <p>{error}</p>

          <button onClick={loadOrders}>
            Retry
          </button>
        </div>
      )}

      {!loading &&
        !error &&
        orders.length === 0 && (
          <p>No customer orders found.</p>
        )}

      {!loading &&
        !error &&
        orders.length > 0 && (
          <div className="order-list">
            {orders.map((order) => (
              <div
                className="order-card"
                key={order.id}
              >
                <h3>Order #{order.id}</h3>

                <p>
                  <strong>Customer:</strong>{" "}
                  {order.customer}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {order.date}
                </p>

                <p>
                  <strong>Total:</strong>{" "}
                  ₹{order.total}
                </p>

                <p>
                  <strong>Payment:</strong>{" "}
                  {order.paymentMode}
                </p>

                <p>
                  <strong>Delivery Address:</strong>{" "}
                  {order.address}
                </p>

                <p>
                  <strong>Current Status:</strong>{" "}
                  {order.status}
                </p>

                <h4>Order Status</h4>

                <ol>
                  <li
                    className={
                      order.status === "Pending"
                        ? "active-status"
                        : ""
                    }
                  >
                    Pending
                  </li>

                  <li
                    className={
                      order.status === "Accepted"
                        ? "active-status"
                        : ""
                    }
                  >
                    Accepted
                  </li>

                  <li
                    className={
                      order.status === "Shipped"
                        ? "active-status"
                        : ""
                    }
                  >
                    Shipped
                  </li>

                  <li
                    className={
                      order.status === "Delivered"
                        ? "active-status"
                        : ""
                    }
                  >
                    Delivered
                  </li>
                </ol>

                <label>
                  Update Order Status
                </label>

                <select
                  value={order.status}
                  onChange={(e) =>
                    updateStatus(
                      order.id,
                      e.target.value
                    )
                  }
                >
                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Accepted">
                    Accepted
                  </option>

                  <option value="Shipped">
                    Shipped
                  </option>

                  <option value="Delivered">
                    Delivered
                  </option>
                </select>
              </div>
            ))}
          </div>
        )}
    </section>
  );
}

export default FarmerOrders;