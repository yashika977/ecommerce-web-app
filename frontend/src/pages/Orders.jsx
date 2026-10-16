
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Orders({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      if (!user) {
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/orders/user/${user.id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load orders");
        }

        setOrders(data);
      } catch (error) {
        console.log("Error loading orders:", error);
        alert("Unable to load your orders.");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="empty-cart">
        <h2>Please log in to view your orders</h2>
        <Link to="/login" className="hero-button">
          Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return <div className="empty-cart">Loading your orders...</div>;
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <div>
          <p>YOUR PURCHASES</p>
          <h1>My Orders</h1>
        </div>

        <span>{orders.length} Orders</span>
      </div>

      {orders.length === 0 ? (
        <div className="empty-cart">
          <h2>No orders yet</h2>
          <p>Your placed orders will appear here.</p>
          <Link to="/products" className="hero-button">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="product-container">
          {orders.map((order) => (
            <div className="product-card" key={order._id}>
              <p className="category">
                Order ID: {order._id}
              </p>

              <h2>
                Total: ₹
                {Number(order.totalAmount).toLocaleString("en-IN")}
              </h2>

              <p>
                Status: <strong>{order.status}</strong>
              </p>

              <p>
                Date:{" "}
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("en-IN")
                  : "Not available"}
              </p>

              <h3>Items</h3>

              {order.items.map((item, index) => (
                <p key={item._id || index}>
                  {item.productId?.name || "Product"} × {item.quantity}
                  {" — "}₹
                  {(
                    Number(item.price) * Number(item.quantity)
                  ).toLocaleString("en-IN")}
                </p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;

