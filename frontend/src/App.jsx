
import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useLocation
} from "react-router-dom";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin";
import Toast from "./Toast";

function AppContent() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState({
    message: "",
    type: "error"
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedToast = sessionStorage.getItem("shopeaseToast");

    if (savedToast) {
      try {
        setToast(JSON.parse(savedToast));
      } catch {
        setToast({
          message: "Welcome to ShopEase!",
          type: "success"
        });
      }

      sessionStorage.removeItem("shopeaseToast");
    }
  }, [location.pathname]);

  function closeToast() {
    setToast({ message: "", type: "error" });
  }

  function handleLogin(userData, token) {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
  }

  function handleLogout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setCart([]);

    sessionStorage.setItem(
      "shopeaseToast",
      JSON.stringify({
        message: "You have logged out successfully. See you soon!",
        type: "success"
      })
    );

    navigate("/login");
  }

  async function loadCartCount() {
    if (!user) {
      setCart([]);
      return;
    }

    const userId = user._id || user.id;

    if (!userId) {
      setCart([]);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/cart/${userId}`
      );

      if (!response.ok) {
        setCart([]);
        return;
      }

      const data = await response.json();
      const cartItems = Array.isArray(data)
        ? data
        : data.items || data.cart || [];

      setCart(cartItems);
    } catch (error) {
      console.error("Unable to load cart:", error);
    }
  }

  useEffect(() => {
    loadCartCount();
  }, [user]);

  function refreshCart() {
    loadCartCount();
  }

  const cartCount = cart.reduce(
    (total, item) => total + Number(item.quantity || 1),
    0
  );

  return (
    <div className="app">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
      />

      <header className="site-header">
        <nav className="navbar">
          <Link to="/" className="logo">
            <span className="logo-icon">S</span>
            <span className="logo-text">
              Shop<span>Ease</span>
            </span>
          </Link>

          <div className="nav-content">
            <div className="nav-links">
              <Link to="/">Home</Link>
              <Link to="/products">Products</Link>

              {user && user.role !== "admin" && (
                <Link to="/orders">My Orders</Link>
              )}

              {user && user.role === "admin" && (
                <Link to="/admin">Admin Dashboard</Link>
              )}
            </div>

            <div className="nav-actions">
              <Link to="/cart" className="nav-cart">
                <span>🛒</span>
                Cart
                {cartCount > 0 && (
                  <span className="cart-count">{cartCount}</span>
                )}
              </Link>

              {!user ? (
                <div className="nav-auth-buttons">
                  <Link to="/login" className="nav-login">
                    Login
                  </Link>
                  <Link to="/register" className="nav-register">
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="nav-user-actions">
                  <span className="user-greeting">
                    Hi, {user.name || "Shopper"}
                  </span>

                  <button
                    type="button"
                    className="logout-button"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/products"
            element={
              <Products
                user={user}
                addToCart={refreshCart}
              />
            }
          />

          <Route
            path="/cart"
            element={
              <Cart
                user={user}
                refreshCart={refreshCart}
              />
            }
          />

          <Route
            path="/login"
            element={
              user ? (
                <Navigate
                  to={user.role === "admin" ? "/admin" : "/"}
                  replace
                />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/orders"
            element={
              user ? (
                <Orders user={user} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/admin"
            element={
              user && user.role === "admin" ? (
                <Admin />
              ) : (
                <Navigate to={user ? "/" : "/login"} replace />
              )
            }
          />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="footer-content">
          <Link to="/" className="logo footer-logo">
            <span className="logo-icon">S</span>
            <span className="logo-text">
              Shop<span>Ease</span>
            </span>
          </Link>

          <p>Your trusted destination for everyday shopping.</p>
          <p>© 2026 ShopEase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
