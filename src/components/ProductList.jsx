import { useEffect, useMemo, useState } from "react";
import { useMarketplace } from "../context/MarketplaceContext";

const API_URL =
  "https://smart-farmer-marketplace-1.onrender.com/api/products";

function ProductList() {
  const { addToCart } = useMarketplace();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [season, setSeason] = useState("All");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("default");

  // ================= LOAD PRODUCTS =================

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}`
        );
      }

      const data = await response.json();

      console.log(
        "CUSTOMER PRODUCTS:",
        data
      );

      setProducts(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Error loading products:",
        error
      );

      setError(
        "Unable to load products. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);


  // ================= FILTER + SORT =================

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // SEARCH
    if (search.trim()) {
      const searchText =
        search.trim().toLowerCase();

      result = result.filter((product) =>
        String(
          product.name ||
          product.productName ||
          ""
        )
          .toLowerCase()
          .includes(searchText)
      );
    }

    // CATEGORY
    if (category !== "All") {
      result = result.filter(
        (product) =>
          String(product.category || "")
            .toLowerCase() ===
          category.toLowerCase()
      );
    }

    // SEASON
    if (season !== "All") {
      result = result.filter(
        (product) =>
          String(product.season || "")
            .toLowerCase() ===
          season.toLowerCase()
      );
    }

    // MAX PRICE
    if (maxPrice !== "") {
      const priceLimit =
        Number(maxPrice);

      if (!Number.isNaN(priceLimit)) {
        result = result.filter(
          (product) =>
            Number(product.price || 0) <=
            priceLimit
        );
      }
    }

    // SORT
    if (sort === "low") {
      result.sort(
        (a, b) =>
          Number(a.price || 0) -
          Number(b.price || 0)
      );
    }

    if (sort === "high") {
      result.sort(
        (a, b) =>
          Number(b.price || 0) -
          Number(a.price || 0)
      );
    }

    if (sort === "name") {
      result.sort((a, b) =>
        String(
          a.name ||
          a.productName ||
          ""
        ).localeCompare(
          String(
            b.name ||
            b.productName ||
            ""
          )
        )
      );
    }

    return result;
  }, [
    products,
    search,
    category,
    season,
    maxPrice,
    sort,
  ]);


  // ================= RESET FILTERS =================

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setSeason("All");
    setMaxPrice("");
    setSort("default");
  };


  // ================= ADD TO CART =================

  const handleAddToCart = (product) => {
    addToCart(product);
  };


  return (
    <section className="products-page">

      {/* ================= HEADER ================= */}

      <div className="products-header">

        <span className="section-badge">
          🌾 Direct Farmer Marketplace
        </span>

        <h1>
          Agricultural Products
        </h1>

        <p>
          Buy fresh agricultural products
          directly from farmers.
        </p>

      </div>


      {/* ================= FILTERS ================= */}

      <div className="product-filters">

        <div className="filter-group">

          <label>
            🔎 Search Product
          </label>

          <input
            type="text"
            placeholder="Search crops or products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        <div className="filter-group">

          <label>
            🥕 Category
          </label>

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >

            <option value="All">
              All Categories
            </option>

            <option value="Vegetable">
              Vegetable
            </option>

            <option value="Fruit">
              Fruit
            </option>

            <option value="Grain">
              Grain
            </option>

            <option value="Pulse">
              Pulse
            </option>

            <option value="Spice">
              Spice
            </option>

            <option value="Other">
              Other
            </option>

          </select>

        </div>


        <div className="filter-group">

          <label>
            🌦️ Season
          </label>

          <select
            value={season}
            onChange={(e) =>
              setSeason(e.target.value)
            }
          >

            <option value="All">
              All Seasons
            </option>

            <option value="Winter">
              Winter
            </option>

            <option value="Summer">
              Summer
            </option>

            <option value="Monsoon">
              Monsoon
            </option>

            <option value="All Season">
              All Season
            </option>

          </select>

        </div>


        <div className="filter-group">

          <label>
            💰 Maximum Price
          </label>

          <input
            type="number"
            min="0"
            placeholder="₹ Maximum"
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(e.target.value)
            }
          />

        </div>


        <div className="filter-group">

          <label>
            ↕️ Sort
          </label>

          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value)
            }
          >

            <option value="default">
              Default
            </option>

            <option value="low">
              Price: Low to High
            </option>

            <option value="high">
              Price: High to Low
            </option>

            <option value="name">
              Name: A to Z
            </option>

          </select>

        </div>


        <button
          type="button"
          onClick={resetFilters}
          className="reset-filter-button"
        >
          Reset Filters
        </button>

      </div>


      {/* ================= RESULTS INFO ================= */}

      <div className="products-result-info">

        <strong>
          {filteredProducts.length}
        </strong>{" "}
        product(s) found

      </div>


      {/* ================= LOADING ================= */}

      {loading && (
        <div className="loading-message">
          Loading agricultural products...
        </div>
      )}


      {/* ================= ERROR ================= */}

      {!loading && error && (
        <div className="error-message">

          <p>
            ❌ {error}
          </p>

          <button
            onClick={loadProducts}
          >
            Retry
          </button>

        </div>
      )}


      {/* ================= NO PRODUCTS ================= */}

      {!loading &&
        !error &&
        filteredProducts.length === 0 && (

          <div className="empty-products">

            <div className="empty-icon">
              🌱
            </div>

            <h3>
              No products found
            </h3>

            <p>
              Try changing your search or
              filters.
            </p>

            <button
              onClick={resetFilters}
            >
              Clear Filters
            </button>

          </div>
        )}


      {/* ================= PRODUCT GRID ================= */}

      {!loading &&
        !error &&
        filteredProducts.length > 0 && (

          <div className="product-grid">

            {filteredProducts.map(
              (product) => {

                const productName =
                  product.name ||
                  product.productName ||
                  "Agricultural Product";

                const price =
                  Number(product.price || 0);

                const quantity =
                  Number(
                    product.quantity || 0
                  );

                return (
                  <article
                    className="product-card"
                    key={product.id}
                  >

                    {/* IMAGE / ICON */}

                    <div className="product-image">

                      <span>
                        {product.category ===
                        "Fruit"
                          ? "🍎"
                          : product.category ===
                            "Grain"
                          ? "🌾"
                          : product.category ===
                            "Pulse"
                          ? "🫘"
                          : product.category ===
                            "Spice"
                          ? "🌶️"
                          : "🥬"}
                      </span>

                    </div>


                    {/* PRODUCT DETAILS */}

                    <div className="product-content">

                      <span className="product-category">

                        {product.category ||
                          "Agricultural Product"}

                        {" · "}

                        {product.season ||
                          "All Season"}

                      </span>


                      <h2>
                        {productName}
                      </h2>


                      <p className="farmer-name">
                        🧑‍🌾 Farmer:{" "}
                        {product.farmer ||
                          product.farmerName ||
                          "Local Farmer"}
                      </p>


                      <p className="product-stock">

                        📦 Available:{" "}
                        {quantity} kg

                      </p>


                      <div className="product-bottom">

                        <strong className="product-price">
                          ₹{price} / kg
                        </strong>


                        <button
                          type="button"
                          onClick={() =>
                            handleAddToCart(
                              product
                            )
                          }
                          disabled={
                            quantity <= 0
                          }
                        >
                          {quantity > 0
                            ? "🛒 Add to Cart"
                            : "Out of Stock"}
                        </button>

                      </div>

                    </div>

                  </article>
                );
              }
            )}

          </div>
        )}

    </section>
  );
}

export default ProductList;