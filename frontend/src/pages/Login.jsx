
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Toast from "../Toast";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    message: "",
    type: "error"
  });

  const navigate = useNavigate();

  function showToast(message, type = "error") {
    setToast({ message, type });
  }

  function closeToast() {
    setToast({ message: "", type: "error" });
  }

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: email.trim(),
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Login failed. Please try again.");
        return;
      }

      if (!data.token || !data.user) {
        showToast(
          "Login response is missing the token or user details."
        );
        return;
      }

      if (!data.user.role) {
        showToast("User role is missing from the server response.");
        return;
      }

      onLogin(data.user, data.token);

      sessionStorage.setItem(
        "shopeaseToast",
        JSON.stringify({
          message: `Welcome back, ${data.user.name || "Shopper"}! You have logged in successfully.`,
          type: "success"
        })
      );

      if (data.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);

      showToast(
        "Unable to connect to server. Make sure your backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
      />

      <div className="auth-visual">
        <div className="auth-visual-content">
          <span className="auth-badge">
            YOUR EVERYDAY SHOPPING PARTNER
          </span>

          <h1>
            Shopping that feels
            <span> effortless.</span>
          </h1>

          <p>
            Discover products you love, enjoy a smooth shopping
            experience, and find something special every day.
          </p>

          <div className="auth-benefits">
            <div><span>✓</span> Quality products</div>
            <div><span>✓</span> Easy shopping</div>
            <div><span>✓</span> Your account, your way</div>
          </div>

          <div className="auth-decoration auth-decoration-one"></div>
          <div className="auth-decoration auth-decoration-two"></div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">
          <Link to="/" className="auth-brand">
            <span className="auth-brand-icon">S</span>
            <span>Shop<span>Ease</span></span>
          </Link>

          <div className="auth-heading">
            <span className="auth-eyebrow">WELCOME BACK</span>
            <h2>Sign in to your account</h2>
            <p>Enter your details to continue shopping.</p>
          </div>

          <form onSubmit={handleLogin} className="auth-form">
            <div className="auth-field">
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="login-password">Password</label>

              <div className="password-input-wrap">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <span>→</span>}
            </button>
          </form>

          <div className="auth-divider">
            <span>NEW TO SHOPEASE?</span>
          </div>

          <p className="auth-switch">
            Don't have an account?{" "}
            <Link to="/register">Create an account</Link>
          </p>

          <Link to="/" className="auth-back-home">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;