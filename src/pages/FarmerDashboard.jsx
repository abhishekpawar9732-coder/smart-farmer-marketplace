import { useEffect, useState } from "react";

const API_URL =
  "https://smart-farmer-marketplace-1.onrender.com/api/orders";

function FarmerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Load orders from backend
  const loadOrders = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load orders");
      }

      const data = await response.json();

      setOrders(data);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Update order status in backend
  const updateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);

      // Find current order
      const currentOrder = orders.find(
        (order) => order.id === orderId
      );

      if (!currentOrder) {
        return;
      }

      // Send complete updated order
      const updatedOrder = {
        customer: currentOrder.customer,
        total: currentOrder.total,
        address: currentOrder.address,
        paymentMode: currentOrder.paymentMode,
        status: newStatus,
        date: currentOrder.date
      };

      const response = await fetch(
        `${API_URL}/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedOrder)
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to update order status"
        );
      }

      const savedOrder = await response.json();

      // Replace order with backend response
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? savedOrder
            : order
        )
      );

      alert(
        `Order #${orderId} status updated to ${newStatus}`
      );

    } catch (error) {
      console.error(
        "Error updating order:",
        error
      );

      alert(
        "Unable to update order status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <section className="farmer-orders">

      <h2>📦 Manage Customer Orders</h2>

      <p>
        View and manage orders placed by customers.
      </p>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No customer orders found.</p>
      ) : (
        <div className="order-list">

          {orders.map((order) => (

            <div
              className="order-card"
              key={order.id}
            >

              <h3>
                Order #{order.id}
              </h3>

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
                disabled={updatingId === order.id}
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