import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMarketplace } from "../context/MarketplaceContext";
import "./LoginForm.css";

function LoginForm() {
  const { user, login } = useMarketplace();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Customer");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      alert("Please enter your name and email.");
      return;
    }

    const loggedUser = {
      name: name.trim(),
      email: email.trim(),
      role,
    };

    login(loggedUser);

    if (role === "Farmer") {
      navigate("/farmer");
    } else if (role === "Admin") {
      navigate("/admin");
    } else {
      navigate("/customer");
    }
  };

  if (user) {
    return (
      <div className="login-page">
        <div className="login-card logged-in">
          <div className="login-icon">🌾</div>
          <span className="login-label">SMART FARMER MARKETPLACE</span>

          <h1>Welcome back</h1>

          <p>
            You are logged in as <strong>{user.role}</strong>.
          </p>

          <button
            onClick={() => {
              if (user.role === "Farmer") navigate("/farmer");
              else if (user.role === "Admin") navigate("/admin");
              else navigate("/customer");
            }}
          >
            Open Dashboard →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">

        <div className="login-left">
          <div className="brand-icon">🌾</div>

          <span className="login-label">
            AGRICULTURE + TECHNOLOGY
          </span>

          <h1>
            Smart Farmer
            <span>Marketplace</span>
          </h1>

          <p>
            A direct farmer-to-customer marketplace
            that makes agricultural products easier
            to discover, buy and sell.
          </p>

          <div className="features">
            <div>
              <b>🌱</b>
              <section>
                <strong>Direct Marketplace</strong>
                <small>Farmer-to-customer selling</small>
              </section>
            </div>

            <div>
              <b>📦</b>
              <section>
                <strong>Order Tracking</strong>
                <small>Track orders from start to delivery</small>
              </section>
            </div>

            <div>
              <b>🌾</b>
              <section>
                <strong>Seasonal Crop Matching</strong>
                <small>Find crops according to the season</small>
              </section>
            </div>
          </div>
        </div>

        <div className="login-card">
          <div className="card-icon">🌾</div>

          <span className="login-label">
            SMART FARMER MARKETPLACE
          </span>

          <h2>Welcome back</h2>

          <p className="card-subtitle">
            Choose your marketplace role to continue.
          </p>

          <form onSubmit={handleSubmit}>

            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Marketplace Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Customer">Customer</option>
              <option value="Farmer">Farmer</option>
              <option value="Admin">Admin</option>
            </select>

            <button type="submit">
              Continue to Marketplace →
            </button>
          </form>

          <div className="login-note">
            
          </div>
        </div>

      </div>
    </div>
  );
}

export default LoginForm;