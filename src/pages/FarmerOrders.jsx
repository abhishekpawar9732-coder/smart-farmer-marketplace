import { useCallback, useEffect, useRef, useState } from "react";

const API_URL =
  "https://smart-farmer-marketplace-1.onrender.com/api/orders";

const ORDER_STATUSES = [
  "Pending",
  "Accepted",
  "Shipped",
  "Delivered",
];

function FarmerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrders, setUpdatingOrders] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  // Prevent overlapping order fetches.
  const loadingRef = useRef(false);

  const loadOrders = useCallback(async (showLoading = true) => {
    if (loadingRef.current) return;

    loadingRef.current = true;

    if (showLoading) {
      setLoading(true);
    }

    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(API_URL, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid orders response from server.");
      }

      setOrders(data);
    } catch (err) {
      console.error("Error loading farmer orders:", err);
      setError("Unable to load customer orders. Please try again.");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  // Load orders once when the page opens.
  // No automatic polling or repeated page refresh.
  useEffect(() => {
    loadOrders();

    return () => {
      // No interval or timeout to clean up.
    };
  }, [loadOrders]);

  const updateStatus = async (orderId, newStatus) => {
    const currentOrder = orders.find(
      (order) => order.id === orderId
    );

    if (!currentOrder) {
      setError("Order not found.");
      return;
    }

    if (!ORDER_STATUSES.includes(newStatus)) {
      setError("Invalid order status.");
      return;
    }

    if (
      currentOrder.status === newStatus ||
      updatingOrders.includes(orderId)
    ) {
      return;
    }

    setUpdatingOrders((current) => [...current, orderId]);
    setError("");
    setSuccessMessage("");

    try {
      const updatedOrder = {
        ...currentOrder,
        status: newStatus,
      };

      const response = await fetch(
        `${API_URL}/${encodeURIComponent(orderId)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedOrder),
        }
      );

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const responseText = await response.text();

      const savedOrder = responseText
        ? JSON.parse(responseText)
        : updatedOrder;

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          String(order.id) === String(orderId)
            ? { ...order, ...savedOrder, status: newStatus }
            : order
        )
      );

      setSuccessMessage(
        `Order #${orderId} updated to ${newStatus}.`
      );
    } catch (err) {
      console.error("Error updating order:", err);
      setError(
        `Unable to update order #${orderId}. Please try again.`
      );

      // Reload server data to show the actual saved status.
      loadOrders(false);
    } finally {
      setUpdatingOrders((current) =>
        current.filter(
          (id) => String(id) !== String(orderId)
        )
      );
    }
  };

  return (
    <section className="farmer-orders">
      <h2>📦 Manage Customer Orders</h2>

      <p>
        View customer orders and manage their delivery status.
      </p>

      <button
        type="button"
        onClick={() => loadOrders()}
        disabled={loading}
      >
        {loading ? "Loading Orders..." : "🔄 Refresh Orders"}
      </button>

      {error && (
        <div className="error-message" role="alert">
          <p>{error}</p>

          {!loading && (
            <button
              type="button"
              onClick={() => loadOrders()}
            >
              Retry
            </button>
          )}
        </div>
      )}

      {successMessage && (
        <p className="success-message" role="status">
          ✅ {successMessage}
        </p>
      )}

      {loading && (
        <p>Loading customer orders...</p>
      )}

      {!loading && !error && orders.length === 0 && (
        <p>No customer orders found.</p>
      )}

      {!loading && orders.length > 0 && (
        <div className="order-list">
          {orders.map((order) => {
            const isUpdating = updatingOrders.some(
              (id) => String(id) === String(order.id)
            );

            return (
              <div
                className="order-card"
                key={order.id}
              >
                <h3>Order #{order.id}</h3>

                <p>
                  <strong>Customer:</strong>{" "}
                  {order.customer || "Customer"}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {order.date || "N/A"}
                </p>

                <p>
                  <strong>Total:</strong>{" "}
                  ₹{Number(order.total || 0).toFixed(2)}
                </p>

                <p>
                  <strong>Payment:</strong>{" "}
                  {order.paymentMode || "N/A"}
                </p>

                <p>
                  <strong>Delivery Address:</strong>{" "}
                  {order.address || "N/A"}
                </p>

                <p>
                  <strong>Current Status:</strong>{" "}
                  {order.status || "Pending"}
                </p>

                <h4>Order Status</h4>

                <ol>
                  {ORDER_STATUSES.map((status) => (
                    <li
                      key={status}
                      className={
                        order.status === status
                          ? "active-status"
                          : ""
                      }
                    >
                      {status}
                    </li>
                  ))}
                </ol>

                <label htmlFor={`status-${order.id}`}>
                  Update Order Status
                </label>

                <select
                  id={`status-${order.id}`}
                  value={order.status || "Pending"}
                  disabled={isUpdating}
                  onChange={(event) =>
                    updateStatus(order.id, event.target.value)
                  }
                >
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                {isUpdating && (
                  <p>Saving order status...</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default FarmerOrders;