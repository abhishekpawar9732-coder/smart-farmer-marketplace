import { useEffect, useState } from "react";
import { apiRequest } from "../api";

const emptyForm = {
  name: "",
  category: "Vegetable",
  price: "",
  quantity: "",
  season: "Winter"
};

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/api/products");
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load marketplace products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const reset = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const saveProduct = async (event) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.price ||
      !form.quantity
    ) {
      setError("Complete all product details.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      quantity: Number(form.quantity),
      season: form.season
    };

    try {
      setSaving(true);
      setError("");

      await apiRequest(
        editingId
          ? `/api/products/${editingId}`
          : "/api/products",
        {
          method: editingId ? "PUT" : "POST",
          body: JSON.stringify(payload)
        }
      );

      reset();
      await loadProducts();
    } catch (err) {
      console.error(err);
      setError("Unable to save product.");
    } finally {
      setSaving(false);
    }
  };

  const editProduct = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      category: product.category || "Vegetable",
      price: product.price ?? "",
      quantity: product.quantity ?? "",
      season: product.season || "Winter"
    });
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) {
      return;
    }

    try {
      await apiRequest(`/api/products/${id}`, {
        method: "DELETE"
      });

      await loadProducts();
    } catch (err) {
      console.error(err);
      setError("Unable to delete product.");
    }
  };

  return (
    <main className="page-shell">
      <div className="page-heading">
        <div>
          <span className="eyebrow">ADMIN PANEL</span>
          <h1>Manage Products</h1>
          <p>
            Monitor and manage the products available
            in the marketplace.
          </p>
        </div>

        <button
          className="secondary-button small-button"
          onClick={loadProducts}
        >
          ↻ Refresh
        </button>
      </div>

      <section className="management-grid">
        <div className="management-card">
          <span className="eyebrow">
            PRODUCT MANAGEMENT
          </span>
          <h2>
            {editingId
              ? "Edit Product"
              : "Add Product"}
          </h2>

          <form
            className="product-form"
            onSubmit={saveProduct}
          >
            <label>
              Product Name
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value
                  })
                }
                placeholder="Tomato"
              />
            </label>

            <div className="form-row">
              <label>
                Category
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value
                    })
                  }
                >
                  <option>Vegetable</option>
                  <option>Fruit</option>
                  <option>Grain</option>
                  <option>Pulse</option>
                  <option>Spice</option>
                  <option>Other</option>
                </select>
              </label>

              <label>
                Season
                <select
                  value={form.season}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      season: e.target.value
                    })
                  }
                >
                  <option>Winter</option>
                  <option>Summer</option>
                  <option>Monsoon</option>
                  <option>All Season</option>
                </select>
              </label>
            </div>

            <div className="form-row">
              <label>
                Price / kg
                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      price: e.target.value
                    })
                  }
                />
              </label>

              <label>
                Quantity (kg)
                <input
                  type="number"
                  min="0"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      quantity: e.target.value
                    })
                  }
                />
              </label>
            </div>

            {error && (
              <p className="error">{error}</p>
            )}

            <div className="form-actions">
              <button
                className="primary-button"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Product"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={reset}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="management-card">
          <span className="eyebrow">
            LIVE DATABASE
          </span>
          <h2>Marketplace Products</h2>

          {loading ? (
            <div className="inline-loading">
              <div className="loader" />
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="empty-management">
              <span>🌾</span>
              <p>No products found.</p>
            </div>
          ) : (
            <div className="management-list">
              {products.map((product) => (
                <div
                  className="management-item"
                  key={product.id}
                >
                  <div className="management-item-icon">
                    🌱
                  </div>

                  <div className="management-item-info">
                    <span>
                      {product.category} ·{" "}
                      {product.season}
                    </span>
                    <h3>{product.name}</h3>
                    <p>
                      ₹{product.price}/kg ·{" "}
                      {product.quantity} kg
                    </p>
                  </div>

                  <div className="item-actions">
                    <button
                      className="secondary-button"
                      onClick={() =>
                        editProduct(product)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="danger-button"
                      onClick={() =>
                        deleteProduct(product.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default AdminProducts;
