
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleRegister(event) {
    event.preventDefault();

    if (name.trim().length < 2) {
      alert("Please enter your full name.");
      return;
    }

    if (password.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Registration failed.");
        return;
      }

      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      alert("Unable to connect to server. Make sure your backend is running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-visual-content">
          <span className="auth-badge">
            YOUR SHOPPING JOURNEY STARTS HERE
          </span>

          <h1>
            Find your next
            <span> favourite.</span>
          </h1>

          <p>
            Create your ShopEase account to explore products,
            manage your cart, and keep track of your orders
            in one convenient place.
          </p>

          <div className="auth-benefits">
            <div>
              <span>✓</span>
              A simple shopping experience
            </div>
            <div>
              <span>✓</span>
              Keep your orders organised
            </div>
            <div>
              <span>✓</span>
              Discover products you love
            </div>
          </div>

          <div className="auth-decoration auth-decoration-one"></div>
          <div className="auth-decoration auth-decoration-two"></div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">
          <Link to="/" className="auth-brand">
            <span className="auth-brand-icon">S</span>
            <span>
              Shop<span>Ease</span>
            </span>
          </Link>

          <div className="auth-heading">
            <span className="auth-eyebrow">CREATE YOUR ACCOUNT</span>
            <h2>Join ShopEase today</h2>
            <p>Enter your details to get started.</p>
          </div>

          <form onSubmit={handleRegister} className="auth-form">
            <div className="auth-field">
              <label htmlFor="register-name">Full name</label>
              <input
                id="register-name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                minLength={2}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="register-email">Email address</label>
              <input
                id="register-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="register-password">Password</label>

              <div className="password-input-wrap">
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  minLength={6}
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

              <span className="auth-field-hint">
                Use at least 6 characters.
              </span>
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
              {!loading && <span>→</span>}
            </button>
          </form>

          <div className="auth-divider">
            <span>ALREADY A MEMBER?</span>
          </div>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </p>

          <Link to="/" className="auth-back-home">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;