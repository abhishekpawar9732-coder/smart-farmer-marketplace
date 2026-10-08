import { useEffect, useState } from "react";
import { useMarketplace } from "../context/MarketplaceContext";

const USERS_KEY = "smart_farmer_marketplace_demo_users";

const defaultUsers = [
  {
    id: 1,
    name: "Ramesh Farmer",
    email: "ramesh@farmer.com",
    role: "Farmer"
  },
  {
    id: 2,
    name: "Suresh Farmer",
    email: "suresh@farmer.com",
    role: "Farmer"
  },
  {
    id: 3,
    name: "Amit Customer",
    email: "amit@gmail.com",
    role: "Customer"
  }
];

function AdminUsers() {
  const { user } = useMarketplace();

  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(USERS_KEY);
      return saved
        ? JSON.parse(saved)
        : defaultUsers;
    } catch {
      return defaultUsers;
    }
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "Customer"
  });

  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem(
      USERS_KEY,
      JSON.stringify(users)
    );
  }, [users]);

  const addUser = (event) => {
    event.preventDefault();

    if (form.name.trim().length < 3) {
      setError("Name must contain at least 3 characters.");
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email.trim()
      )
    ) {
      setError("Please enter a valid email address.");
      return;
    }

    setUsers((current) => [
      ...current,
      {
        id: Date.now(),
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role
      }
    ]);

    setForm({
      name: "",
      email: "",
      role: "Customer"
    });

    setError("");
  };

  const deleteUser = (id) => {
    setUsers((current) =>
      current.filter((item) => item.id !== id)
    );
  };

  return (
    <main className="page-shell">
      <div className="page-heading">
        <div>
          <span className="eyebrow">ADMIN PANEL</span>
          <h1>Manage Users</h1>
          <p>
            Manage the role-based users shown in the
            current Exp4 interface.
          </p>
        </div>
      </div>

      <div className="management-grid">
        <section className="management-card">
          <span className="eyebrow">USER MANAGEMENT</span>
          <h2>Add New User</h2>

          <form
            className="product-form"
            onSubmit={addUser}
          >
            <label>
              Name
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value
                  })
                }
                placeholder="Enter user name"
              />
            </label>

            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value
                  })
                }
                placeholder="user@example.com"
              />
            </label>

            <label>
              Role
              <select
                value={form.role}
                onChange={(e) =>
                  setForm({
                    ...form,
                    role: e.target.value
                  })
                }
              >
                <option>Customer</option>
                <option>Farmer</option>
                <option>Admin</option>
              </select>
            </label>

            {error && (
              <p className="error">{error}</p>
            )}

            <button className="primary-button">
              Add User
            </button>
          </form>

          <p className="auth-note">
            User persistence is currently local to the
            frontend because Exp9 does not yet expose a
            User API.
          </p>
        </section>

        <section className="management-card">
          <span className="eyebrow">REGISTERED USERS</span>
          <h2>Users</h2>

          <div className="management-list">
            {users.map((item) => (
              <div
                className="management-item"
                key={item.id}
              >
                <div className="management-item-icon">
                  {item.role === "Farmer"
                    ? "👨‍🌾"
                    : item.role === "Admin"
                      ? "🛠️"
                      : "🛒"}
                </div>

                <div className="management-item-info">
                  <span>{item.role}</span>
                  <h3>{item.name}</h3>
                  <p>{item.email}</p>
                </div>

                {item.name !== user?.name && (
                  <button
                    className="danger-button"
                    onClick={() =>
                      deleteUser(item.id)
                    }
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminUsers;
