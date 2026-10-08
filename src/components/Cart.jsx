import { Link } from "react-router-dom";
import { useMarketplace } from "../context/MarketplaceContext";

function Cart() {
  const {
    cart,
    cartTotal,
    removeFromCart,
    clearCart
  } = useMarketplace();

  return (
    <main className="page-shell">
      <div className="page-heading">
        <div>
          <span className="eyebrow">SHOPPING CART</span>
          <h1>Your Cart</h1>
          <p>
            Review your selected agricultural products
            before placing an order.
          </p>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="state-card">
          <span className="empty-icon">🛒</span>
          <h3>Your cart is empty</h3>
          <p>
            Explore products and add fresh crops to your
            cart.
          </p>
          <Link
            className="primary-button"
            to="/customer/products"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <section className="cart-list">
            {cart.map((product, index) => (
              <article
                className="cart-product"
                key={`${product.id}-${index}`}
              >
                <div className="cart-product-icon">
                  🌾
                </div>

                <div className="cart-product-info">
                  <span>{product.category}</span>
                  <h3>{product.name}</h3>
                  <p>
                    Season: {product.season}
                  </p>
                  <strong>
                    ₹{product.price} / kg
                  </strong>
                </div>

                <button
                  className="danger-button"
                  onClick={() =>
                    removeFromCart(index)
                  }
                >
                  Remove
                </button>
              </article>
            ))}
          </section>

          <aside className="cart-summary">
            <span className="eyebrow">SUMMARY</span>
            <h2>Order Total</h2>

            <div className="summary-row">
              <span>Items</span>
              <strong>{cart.length}</strong>
            </div>

            <div className="summary-row total-row">
              <span>Total</span>
              <strong>₹{cartTotal}</strong>
            </div>

            <Link
              className="primary-button full-width"
              to="/customer/orders"
            >
              Proceed to Checkout
            </Link>

            <button
              className="text-button"
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </aside>
        </div>
      )}
    </main>
  );
}

export default Cart;
