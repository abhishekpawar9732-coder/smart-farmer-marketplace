import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMarketplace } from "../context/MarketplaceContext";

function LoginForm() {
  const { user, login, logout } = useMarketplace();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Customer",
  });

  const [errors, setErrors] = useState({});

  const dashboardPath = (role) => {
    if (role === "Farmer") return "/farmer";
    if (role === "Admin") return "/admin";
    return "/customer";
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (formData.name.trim().length < 3) {
      nextErrors.name = "Name must contain at least 3 characters.";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const loggedInUser = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role,
    };

    login(loggedInUser);
    navigate(dashboardPath(formData.role));
  };

  if (user) {
    return (
      <section className="login-screen">
        <div className="login-panel logged-panel">
          <div className="login-logo">✓</div>

          <span className="login-badge">
            ACCOUNT ACTIVE
          </span>

          <h1>You're already logged in</h1>

          <p className="login-description">
            Welcome back, <strong>{user.name}</strong>.
            Your active role is{" "}
            <strong>{user.role}</strong>.
          </p>

          <button
            className="login-primary"
            onClick={() =>
              navigate(dashboardPath(user.role))
            }
          >
            Open Dashboard
          </button>

          <button
            className="login-text-button"
            onClick={logout}
          >
            Sign out
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="login-screen">
      <div className="login-layout">

        <div className="login-info">
          <div className="login-info-logo">🌾</div>

          <span className="login-info-badge">
            AGRICULTURE + TECHNOLOGY
          </span>

          <h1>
            Welcome to the
            <span> Smart Farmer Marketplace</span>
          </h1>

          <p>
            Connect farmers directly with customers,
            discover fresh agricultural products and
            experience transparent pricing.
          </p>

          <div className="login-features">
            <div>
              <span>🌱</span>
              <div>
                <strong>Direct Marketplace</strong>
                <small>
                  Farmer-to-customer selling without unnecessary intermediaries.
                </small>
              </div>
            </div>

            <div>
              <span>📦</span>
              <div>
                <strong>Order Tracking</strong>
                <small>
                  Follow orders from placement to delivery.
                </small>
              </div>
            </div>

            <div>
              <span>🌾</span>
              <div>
                <strong>Seasonal Crop Matching</strong>
                <small>
                  Discover crops according to the season.
                </small>
              </div>
            </div>
          </div>
        </div>

        <div className="login-panel">
          <div className="login-panel-top">
            <div className="login-logo">🌾</div>

            <div>
              <span className="login-badge">
                SMART FARMER MARKETPLACE
              </span>
              <h2>Welcome back</h2>
              <p>
                Choose your marketplace role to continue.
              </p>
            </div>
          </div>

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >
            <div className="login-field">
              <label htmlFor="name">
                Full Name
              </label>

              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
              />

              {errors.name && (
                <span className="login-error">
                  {errors.name}
                </span>
              )}
            </div>

            <div className="login-field">
              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
              />

              {errors.email && (
                <span className="login-error">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="login-field">
              <label htmlFor="role">
                Marketplace Role
              </label>

              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="Customer">
                  Customer
                </option>

                <option value="Farmer">
                  Farmer
                </option>

                <option value="Admin">
                  Admin
                </option>
              </select>
            </div>

            <button
              className="login-primary"
              type="submit"
            >
              Continue to Marketplace
              <span>→</span>
            </button>
          </form>

          <div className="login-note">
            <span>ℹ</span>
            <p>
              Demo role-based login for the current Exp4
              frontend. Authentication can be connected
              to the backend later.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

export default LoginForm;