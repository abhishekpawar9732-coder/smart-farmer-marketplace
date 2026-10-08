import { useEffect, useMemo, useState } from "react";
import { useMarketplace } from "../context/MarketplaceContext";

const API_URL =
  "https://smart-farmer-marketplace-1.onrender.com/api/orders";

function Order() {
  const { cart, cartTotal, user } = useMarketplace();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderError, setOrderError] = useState("");

  const [address, setAddress] = useState("");
  const [paymentMode, setPaymentMode] =
    useState("Cash on Delivery");

  const [errors, setErrors] = useState({});
  const [placingOrder, setPlacingOrder] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // --------------------------------------------------
  // Logged-in customer
  // --------------------------------------------------

  const customerName =
    user?.name ||
    user?.username ||
    user?.userName ||
    user?.email ||
    "Customer";

  // --------------------------------------------------
  // Load all orders from backend
  // --------------------------------------------------

  const loadOrders = async () => {
    try {
      setLoadingOrders(true);
      setOrderError("");

      const response = await fetch(API_URL, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}`
        );
      }

      const data = await response.json();

      console.log("ALL BACKEND ORDERS:", data);

      setOrders(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Error loading orders:",
        error
      );

      setOrderError(
        "Unable to load orders. Please try again."
      );
    } finally {
      setLoadingOrders(false);
    }
  };

  // --------------------------------------------------
  // Initial load + automatic refresh
  // --------------------------------------------------

  useEffect(() => {
    loadOrders();

    const interval = setInterval(() => {
      loadOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // --------------------------------------------------
  // Only show orders belonging to logged-in customer
  // --------------------------------------------------

  const customerOrders = useMemo(() => {
    const loggedInName = String(
      customerName || ""
    )
      .trim()
      .toLowerCase();

    if (!loggedInName) {
      return [];
    }

    return orders.filter((order) => {
      const orderCustomer = String(
        order.customer || ""
      )
        .trim()
        .toLowerCase();

      return orderCustomer === loggedInName;
    });
  }, [orders, customerName]);

  // --------------------------------------------------
  // Validate new order
  // --------------------------------------------------

  const validateOrder = () => {
    const newErrors = {};

    if (!cart || cart.length === 0) {
      newErrors.cart =
        "Your cart is empty. Add products before placing an order.";
    }

    if (!address.trim()) {
      newErrors.address =
        "Delivery address is required.";
    } else if (address.trim().length < 10) {
      newErrors.address =
        "Please enter a complete delivery address.";
    }

    if (!paymentMode) {
      newErrors.payment =
        "Please select a payment mode.";
    }

    return newErrors;
  };

  // --------------------------------------------------
  // Place order
  // --------------------------------------------------

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    const validationErrors =
      validateOrder();

    if (
      Object.keys(validationErrors).length > 0
    ) {
      setErrors(validationErrors);
      return;
    }

    try {
      setPlacingOrder(true);
      setErrors({});
      setSuccessMessage("");

      const orderData = {
        customer: customerName,
        total: Number(cartTotal),
        address: address.trim(),
        paymentMode: paymentMode,
        status: "Pending",
        date: new Date().toLocaleDateString(
          "en-US"
        ),
      };

      console.log(
        "SENDING ORDER TO BACKEND:",
        orderData
      );

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorText =
          await response.text();

        console.error(
          "BACKEND ORDER ERROR:",
          errorText
        );

        throw new Error(
          `Server returned ${response.status}`
        );
      }

      const savedOrder =
        await response.json();

      console.log(
        "ORDER SAVED SUCCESSFULLY:",
        savedOrder
      );

      // Immediately add the new order
      setOrders((previousOrders) => [
        savedOrder,
        ...previousOrders,
      ]);

      setAddress("");
      setPaymentMode(
        "Cash on Delivery"
      );
      setErrors({});

      setSuccessMessage(
        `Order #${savedOrder.id} placed successfully!`
      );

      // Confirm latest backend data
      setTimeout(() => {
        loadOrders();
      }, 1000);
    } catch (error) {
      console.error(
        "ERROR PLACING ORDER:",
        error
      );

      setErrors({
        submit:
          "Unable to place order. Please try again.",
      });
    } finally {
      setPlacingOrder(false);
    }
  };

  // --------------------------------------------------
  // Order tracking
  // --------------------------------------------------

  const statusSteps = [
    "Pending",
    "Accepted",
    "Shipped",
    "Delivered",
  ];

  const getStatusIndex = (status) => {
    const index =
      statusSteps.indexOf(status);

    return index === -1 ? 0 : index;
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <section className="customer-orders-page">

      {/* PAGE HEADER */}
      <div className="products-header">
        <span className="section-badge">
          📦 Order Management
        </span>

        <h1>My Orders</h1>

        <p>
          Track your agricultural orders
          from the farmer to your doorstep.
        </p>
      </div>

      {/* SUCCESS MESSAGE */}
      {successMessage && (
        <div className="success-message">
          ✓ {successMessage}
        </div>
      )}

      {/* ============================================ */}
      {/* PLACE NEW ORDER */}
      {/* ============================================ */}

      <div className="form-card">
        <h2>🛒 Place New Order</h2>

        {errors.cart && (
          <p className="error">
            ❌ {errors.cart}
          </p>
        )}

        {cart && cart.length > 0 ? (
          <>
            <div className="order-summary-box">
              <p>
                <strong>
                  Products in Cart:
                </strong>{" "}
                {cart.length}
              </p>

              <p>
                <strong>
                  Order Total:
                </strong>{" "}
                ₹{cartTotal}
              </p>
            </div>

            <form onSubmit={handlePlaceOrder}>

              {/* ADDRESS */}
              <label htmlFor="address">
                📍 Delivery Address
              </label>

              <textarea
                id="address"
                rows="4"
                placeholder="Enter your complete delivery address"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);

                  setErrors((previous) => ({
                    ...previous,
                    address: "",
                    submit: "",
                  }));
                }}
              />

              {errors.address && (
                <p className="error">
                  ❌ {errors.address}
                </p>
              )}

              {/* PAYMENT */}
              <label htmlFor="payment">
                💳 Payment Mode
              </label>

              <select
                id="payment"
                value={paymentMode}
                onChange={(e) => {
                  setPaymentMode(
                    e.target.value
                  );

                  setErrors((previous) => ({
                    ...previous,
                    payment: "",
                    submit: "",
                  }));
                }}
              >
                <option value="Cash on Delivery">
                  Cash on Delivery
                </option>

                <option value="Online Payment">
                  Online Payment
                </option>
              </select>

              {errors.payment && (
                <p className="error">
                  ❌ {errors.payment}
                </p>
              )}

              {errors.submit && (
                <p className="error">
                  ❌ {errors.submit}
                </p>
              )}

              <button
                type="submit"
                disabled={placingOrder}
              >
                {placingOrder
                  ? "Placing Order..."
                  : "📦 Place Order"}
              </button>

            </form>
          </>
        ) : (
          <p>
            Add products to your cart first
            to place an order.
          </p>
        )}
      </div>

      {/* ============================================ */}
      {/* ORDER HISTORY */}
      {/* ============================================ */}

      <div className="order-history-section">

        <div className="order-history-header">
          <div>
            <h2>📋 Order History</h2>

            <p>
              Your orders and their current
              delivery status.
            </p>
          </div>

          <button
            type="button"
            onClick={loadOrders}
            disabled={loadingOrders}
          >
            🔄 Refresh
          </button>
        </div>

        {/* LOADING */}
        {loadingOrders && (
          <div className="loading-message">
            Loading your orders...
          </div>
        )}

        {/* ERROR */}
        {!loadingOrders &&
          orderError && (
            <div className="error-message">
              <p>
                ❌ {orderError}
              </p>

              <button
                type="button"
                onClick={loadOrders}
              >
                Retry
              </button>
            </div>
          )}

        {/* NO ORDERS */}
        {!loadingOrders &&
          !orderError &&
          customerOrders.length === 0 && (
            <div className="empty-products">

              <div className="empty-icon">
                📦
              </div>

              <h3>
                No orders found
              </h3>

              <p>
                Your placed orders will
                appear here.
              </p>

            </div>
          )}

        {/* CUSTOMER ORDERS */}
        {!loadingOrders &&
          !orderError &&
          customerOrders.length > 0 && (
            <div className="order-list">

              {customerOrders.map((order) => {

                const currentStatus =
                  order.status || "Pending";

                const currentIndex =
                  getStatusIndex(
                    currentStatus
                  );

                return (
                  <article
                    className="order-card"
                    key={order.id}
                  >

                    {/* ORDER HEADER */}
                    <div className="order-card-header">

                      <div>
                        <span className="section-badge">
                          ORDER #{order.id}
                        </span>

                        <h3>
                          Order #{order.id}
                        </h3>
                      </div>

                      <span className="order-status-badge">
                        {currentStatus}
                      </span>

                    </div>

                    {/* ORDER DETAILS */}
                    <div className="order-details">

                      <p>
                        <strong>
                          👤 Customer:
                        </strong>{" "}
                        {order.customer}
                      </p>

                      <p>
                        <strong>
                          📅 Date:
                        </strong>{" "}
                        {order.date}
                      </p>

                      <p>
                        <strong>
                          💰 Total:
                        </strong>{" "}
                        ₹{order.total}
                      </p>

                      <p>
                        <strong>
                          💳 Payment:
                        </strong>{" "}
                        {order.paymentMode}
                      </p>

                      <p>
                        <strong>
                          📍 Delivery Address:
                        </strong>{" "}
                        {order.address}
                      </p>

                    </div>

                    {/* TRACKING */}
                    <div className="tracking-section">

                      <h3>
                        🚚 Order Tracking
                      </h3>

                      <div className="order-status">

                        {statusSteps.map(
                          (
                            status,
                            index
                          ) => {

                            const completed =
                              index <=
                              currentIndex;

                            const active =
                              status ===
                              currentStatus;

                            return (
                              <div
                                key={status}
                                className={
                                  completed
                                    ? "active-status"
                                    : ""
                                }
                              >
                                <span>
                                  {completed
                                    ? "✓"
                                    : index + 1}
                                </span>

                                <strong>
                                  {status}
                                </strong>

                                {active && (
                                  <small>
                                    Current
                                    Status
                                  </small>
                                )}
                              </div>
                            );
                          }
                        )}

                      </div>

                    </div>

                    {/* STATUS MESSAGE */}
                    <div className="tracking-info">

                      {currentStatus ===
                        "Pending" && (
                        <p>
                          ⏳ Your order has been
                          placed and is waiting
                          for farmer confirmation.
                        </p>
                      )}

                      {currentStatus ===
                        "Accepted" && (
                        <p>
                          ✅ Your order has been
                          accepted by the farmer.
                        </p>
                      )}

                      {currentStatus ===
                        "Shipped" && (
                        <p>
                          🚚 Your order has been
                          shipped and is on its way.
                        </p>
                      )}

                      {currentStatus ===
                        "Delivered" && (
                        <p>
                          🎉 Your order has been
                          delivered successfully!
                        </p>
                      )}

                    </div>

                  </article>
                );
              })}

            </div>
          )}

      </div>

    </section>
  );
}

export default Order;