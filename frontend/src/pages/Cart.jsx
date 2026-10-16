
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Toast from "../Toast";

function Cart({ user, refreshCart }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [toast, setToast] = useState({
    message: "",
    type: "error",
  });

  const navigate = useNavigate();

  function showToast(message, type = "error") {
    setToast({ message, type });
  }

  function closeToast() {
    setToast({ message: "", type: "error" });
  }

  async function loadCart() {
    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/cart/${user._id || user.id}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load cart");
      }

      setCartItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading cart:", error);
      showToast("Unable to load cart. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCart();
  }, [user]);

  async function updateQuantity(item, newQuantity) {
    if (newQuantity < 1) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/cart/${item._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Could not update quantity.");
        return;
      }

      setCartItems((items) =>
        items.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: newQuantity }
            : cartItem
        )
      );

      if (refreshCart) refreshCart();

      showToast("Cart quantity updated!", "success");
    } catch (error) {
      console.error("Error updating quantity:", error);
      showToast("Unable to update quantity.");
    }
  }

  async function removeItem(cartItemId) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/cart/${cartItemId}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Could not remove item.");
        return;
      }

      setCartItems((items) =>
        items.filter((item) => item._id !== cartItemId)
      );

      if (refreshCart) refreshCart();

      showToast("Product removed from your cart.", "success");
    } catch (error) {
      console.error("Error removing item:", error);
      showToast("Unable to remove item.");
    }
  }

  async function placeOrder() {
    if (placingOrder) return;

    const validItems = cartItems.filter((item) => item.productId);

    if (validItems.length === 0) {
      showToast("Your cart is empty.");
      return;
    }

    const totalAmount = validItems.reduce(
      (sum, item) =>
        sum + (Number(item.productId.price) || 0) * item.quantity,
      0
    );

    const orderItems = validItems.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: Number(item.productId.price) || 0,
    }));

    setPlacingOrder(true);

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id || user.id,
          items: orderItems,
          totalAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Unable to place order.");
        return;
      }

      const deleteResults = await Promise.all(
        validItems.map((item) =>
          fetch(`http://localhost:5000/api/cart/${item._id}`, {
            method: "DELETE",
          })
        )
      );

      const failedDelete = deleteResults.some(
        (result) => !result.ok
      );

      if (failedDelete) {
        showToast(
          "Your order was placed, but some cart items could not be cleared.",
          "error"
        );
      } else {
        showToast("Order placed successfully!", "success");
      }

      await loadCart();

      if (refreshCart) refreshCart();

      navigate("/orders", {
        state: {
          orderMessage: failedDelete
            ? "Your order was placed, but some cart items could not be cleared."
            : "Order placed successfully!",
          orderMessageType: failedDelete ? "error" : "success",
        },
      });
    } catch (error) {
      console.error("Error placing order:", error);
      showToast("Unable to connect to the server. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  }

  if (!user) {
    return (
      <main className="cart-page">
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />

        <div className="cart-message">
          <div className="cart-empty-icon">♙</div>
          <span className="cart-eyebrow">WELCOME BACK</span>
          <h1>Login to your account</h1>
          <p>
            Please log in to see your shopping bag and continue shopping.
          </p>
          <Link to="/login" className="cart-primary-link">
            Login to Continue
          </Link>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="cart-page">
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />

        <div className="cart-message">
          <div className="cart-spinner"></div>
          <h2>Loading your shopping bag...</h2>
        </div>
      </main>
    );
  }

  const validItems = cartItems.filter((item) => item.productId);

  const total = validItems.reduce(
    (sum, item) =>
      sum + (Number(item.productId.price) || 0) * item.quantity,
    0
  );

  const itemCount = validItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <main className="cart-page">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
      />

      <section className="cart-hero">
        <div>
          <span className="cart-eyebrow">YOUR SHOPPING BAG</span>
          <h1>
            Your cart, <span>your picks.</span>
          </h1>
          <p>Everything you love, gathered in one place.</p>
        </div>

        <div className="cart-hero-icon" aria-hidden="true">
          ♡
        </div>
      </section>

      <div className="cart-heading-row">
        <div>
          <h2>Shopping Cart</h2>
          <p>
            {itemCount} {itemCount === 1 ? "item" : "items"} in your bag
          </p>
        </div>

        <Link to="/products" className="cart-continue-link">
          ← Continue Shopping
        </Link>
      </div>

      {validItems.length === 0 ? (
        <div className="cart-message">
          <div className="cart-empty-icon">♡</div>
          <span className="cart-eyebrow">NOTHING HERE YET</span>
          <h2>Your cart is waiting for you</h2>
          <p>
            Discover something you love and add it to your shopping bag.
          </p>
          <Link to="/products" className="cart-primary-link">
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <section className="cart-items-panel">
            {validItems.map((item) => {
              const product = item.productId;
              const price = Number(product.price) || 0;

              return (
                <article className="cart-item" key={item._id}>
                  <div className="cart-item-image">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                          event.currentTarget.nextElementSibling.style.display =
                            "flex";
                        }}
                      />
                    ) : null}

                    <span
                      className="cart-item-fallback"
                      style={{
                        display: product.image ? "none" : "flex",
                      }}
                    >
                      {product.icon || "🛍️"}
                    </span>
                  </div>

                  <div className="cart-item-details">
                    <span className="cart-item-category">
                      {product.category}
                    </span>

                    <h3>{product.name}</h3>

                    <p className="cart-item-unit-price">
                      ₹{price.toLocaleString("en-IN")} each
                    </p>

                    <div className="cart-item-actions">
                      <div className="cart-quantity">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          aria-label={`Decrease quantity of ${product.name}`}
                        >
                          −
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item, item.quantity + 1)
                          }
                          aria-label={`Increase quantity of ${product.name}`}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="cart-remove-button"
                        onClick={() => removeItem(item._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-subtotal">
                    <span>SUBTOTAL</span>
                    <strong>
                      ₹{(price * item.quantity).toLocaleString("en-IN")}
                    </strong>
                  </div>
                </article>
              );
            })}
          </section>

          <aside className="cart-summary">
            <span className="cart-eyebrow">ORDER OVERVIEW</span>
            <h2>Order Summary</h2>

            <div className="cart-summary-line">
              <span>Items ({itemCount})</span>
              <strong>₹{total.toLocaleString("en-IN")}</strong>
            </div>

            <div className="cart-summary-line">
              <span>Delivery</span>
              <strong className="cart-free-delivery">FREE</strong>
            </div>

            <div className="cart-summary-line">
              <span>Discount</span>
              <strong>—</strong>
            </div>

            <div className="cart-summary-total">
              <span>Total Amount</span>
              <strong>₹{total.toLocaleString("en-IN")}</strong>
            </div>

            <button
              type="button"
              className="cart-checkout-button"
              onClick={placeOrder}
              disabled={placingOrder}
            >
              {placingOrder ? "Placing Order..." : "Place Order"}
              {!placingOrder && <span>→</span>}
            </button>

            <p className="cart-summary-note">
              ♡ Thank you for shopping with ShopEase.
            </p>

            <div className="cart-secure-note">
              <span>✓</span>
              <p>Your order will be recorded in your ShopEase account.</p>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}

export default Cart;