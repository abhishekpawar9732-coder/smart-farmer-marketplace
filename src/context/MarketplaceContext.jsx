import { createContext, useContext, useState } from "react";

const MarketplaceContext = createContext();

export function MarketplaceProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const addToCart = (product) => {
    setCart((currentCart) => [
      ...currentCart,
      product
    ]);
  };

  const removeFromCart = (index) => {
    setCart((currentCart) =>
      currentCart.filter((_, i) => i !== index)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce(
    (total, product) =>
      total + Number(product.price || 0),
    0
  );

  const placeOrder = (orderDetails) => {
    const newOrder = {
      id: Date.now(),
      customer: user?.name || "Customer",
      products: [...cart],
      total: cartTotal,
      address: orderDetails.address,
      paymentMode: orderDetails.paymentMode,
      status: "Pending",
      date: new Date().toLocaleDateString()
    };

    setOrders((currentOrders) => [
      ...currentOrders,
      newOrder
    ]);

    setCart([]);

    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  return (
    <MarketplaceContext.Provider
      value={{
        user,
        cart,
        cartTotal,
        orders,
        login,
        logout,
        addToCart,
        removeFromCart,
        clearCart,
        placeOrder,
        updateOrderStatus
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  return useContext(MarketplaceContext);
}