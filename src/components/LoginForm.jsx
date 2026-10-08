import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMarketplace } from "../context/MarketplaceContext";

function LoginForm() {
  const { user, login, logout } = useMarketplace();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Customer"
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
      [name]: value
    }));

    setErrors((current) => ({
      ...current,
      [name]: ""
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (formData.name.trim().length < 3) {
      nextErrors.name =
        "Name must contain at least 3 characters.";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {
      nextErrors.email =
        "Please enter a valid email address.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const loggedInUser = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role
    };

    login(loggedInUser);
    navigate(dashboardPath(formData.role));
  };

  if (user) {
    return (
      <main className="auth-page">
        <div className="auth-card">
          <span className="auth-icon">✓</span>
          <span className="eyebrow">ACCOUNT</span>
          <h1>You're already logged in</h1>
          <p>
            Welcome back, {user.name}. Your active role is{" "}
            <strong>{user.role}</strong>.
          </p>

          <button
            className="primary-button full-width"
            onClick={() =>
              navigate(dashboardPath(user.role))
            }
          >
            Open Dashboard
          </button>

          <button
            className="text-button"
            onClick={logout}
          >
            Sign out
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">🌾</div>

        <span className="eyebrow">SMART FARMER MARKETPLACE</span>

        <h1>Welcome back</h1>

        <p>
          Choose your marketplace role to continue.
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            Full Name
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </label>

          {errors.name && (
            <p className="error">{errors.name}</p>
          )}

          <label>
            Email Address
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </label>

          {errors.email && (
            <p className="error">{errors.email}</p>
          )}

          <label>
            Marketplace Role
            <select
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
          </label>

          <button
            className="primary-button full-width"
            type="submit"
          >
            Continue to Marketplace
          </button>
        </form>

        <p className="auth-note">
          Demo role-based login for the current Exp4
          frontend. Persistent authentication can be
          added with the backend before final production
          deployment.
        </p>
      </div>
    </main>
  );
}

export default LoginForm;
