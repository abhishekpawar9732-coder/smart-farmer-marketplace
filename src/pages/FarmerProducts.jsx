import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../api";

const emptyForm = {
  name: "",
  category: "Vegetable",
  price: "",
  quantity: "",
  season: "Winter"
};

function FarmerProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiRequest("/api/products");
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load your products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.price ||
      !form.quantity
    ) {
      setError("Please complete all product details.");
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

      if (editingId) {
        await apiRequest(
          `/api/products/${editingId}`,
          {
            method: "PUT",
            body: JSON.stringify(payload)
          }
        );
      } else {
        await apiRequest("/api/products", {
          method: "POST",
          body: JSON.stringify(payload)
        });
      }

      resetForm();
      await loadProducts();
    } catch (err) {
      console.error(err);
      setError(
        "Unable to save the product. Please try again."
      );
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

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const deleteProduct = async (id) => {
    if (
      !window.confirm(
        "Delete this product from the marketplace?"
      )
    ) {
      return;
    }

    try {
      await apiRequest(`/api/products/${id}`, {
        method: "DELETE"
      });

      await loadProducts();
    } catch (err) {
      console.error(err);
      setError(
        "Unable to delete the product."
      );
    }
  };

  const totalQuantity = useMemo(
    () =>
      products.reduce(
        (total, product) =>
          total + Number(product.quantity || 0),
        0
      ),
    [products]
  );

  return (
    <main className="page-shell">
      <div className="page-heading">
        <div>
          <span className="eyebrow">FARMER INVENTORY</span>
          <h1>My Products</h1>
          <p>
            Add and manage the agricultural products you list on the marketplace.
          </p>
        </div>

        <button
          className="secondary-button small-button"
          onClick={loadProducts}
        >
          ↻ Refresh
        </button>
      </div>

      <div className="metric-grid">
        <div className="metric-card">
          <span>🌾</span>
          <strong>{products.length}</strong>
          <small>Listed Products</small>
        </div>
        <div className="metric-card">
          <span>📦</span>
          <strong>{totalQuantity}</strong>
          <small>Total Quantity (kg)</small>
        </div>
        <div className="metric-card">
          <span>🌱</span>
          <strong>Direct</strong>
          <small>Farmer-to-Customer</small>
        </div>
      </div>

      <section className="management-grid">
        <div className="management-card">
          <div className="card-heading">
            <div>
              <span className="eyebrow">
                INVENTORY
              </span>
              <h2>
                {editingId
                  ? "Edit Product"
                  : "Add New Product"}
              </h2>
            </div>
          </div>

          <form
            className="product-form"
            onSubmit={handleSubmit}
          >
            <label>
              Crop / Product Name
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value
                  })
                }
                placeholder="e.g. Tomato"
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
                Price per kg (₹)
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
                  placeholder="40"
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
                  placeholder="100"
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
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Product"
                    : "Add Product"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="management-card">
          <div className="card-heading">
            <div>
              <span className="eyebrow">
                MARKETPLACE LISTINGS
              </span>
              <h2>My Products</h2>
            </div>
          </div>

          {loading ? (
            <div className="inline-loading">
              <div className="loader" />
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="empty-management">
              <span>🌾</span>
              <p>
                No products listed yet.
              </p>
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
                      {product.quantity} kg available
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

export default FarmerProducts;
