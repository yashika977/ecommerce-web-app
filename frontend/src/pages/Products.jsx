
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Toast from "../Toast";

function getProductPhoto(product) {
  const name = (product.name || "").toLowerCase();
  const category = (product.category || "").toLowerCase();

  if (name.includes("sunglass") || name.includes("eyewear")) {
    return "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85";
  }

  if (name.includes("backpack") || name.includes("laptop bag")) {
    return "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85";
  }

  if (name.includes("speaker")) {
    return "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85";
  }

  if (name.includes("lamp")) {
    return "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85";
  }

  if (name.includes("headphone") || name.includes("earphone")) {
    return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85";
  }

  if (name.includes("watch")) {
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85";
  }

  if (name.includes("shoe") || name.includes("sneaker")) {
    return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85";
  }

  if (
    name.includes("t-shirt") ||
    name.includes("tshirt") ||
    name.includes("tee")
  ) {
    return "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85";
  }

  if (name.includes("bag") || name.includes("purse")) {
    return "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85";
  }

  if (name.includes("sofa") || name.includes("furniture")) {
    return "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85";
  }

  if (name.includes("perfume") || name.includes("fragrance")) {
    return "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85";
  }

  if (name.includes("skincare") || name.includes("cream")) {
    return "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85";
  }

  if (name.includes("camera")) {
    return "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85";
  }

  if (name.includes("keyboard")) {
    return "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85";
  }

  if (name.includes("bottle") || name.includes("water bottle")) {
    return "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=85";
  }

  if (category.includes("electronic")) {
    return "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=900&q=85";
  }

  if (category.includes("fashion")) {
    return "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85";
  }

  if (category.includes("bag")) {
    return "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85";
  }

  if (category.includes("home")) {
    return "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85";
  }

  if (category.includes("beauty")) {
    return "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85";
  }

  return "";
}

function Products({ addToCart, user }) {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );
  const [sortBy, setSortBy] = useState("featured");
  const [wishlist, setWishlist] = useState([]);

  const [toast, setToast] = useState({
    message: "",
    type: "error",
  });

  function showToast(message, type = "error") {
    setToast({ message, type });
  }

  function closeToast() {
    setToast({ message: "", type: "error" });
  }

  const category = searchParams.get("category") || "";

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          "http://localhost:5000/api/products"
        );

        if (!response.ok) {
          throw new Error("Unable to load products.");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid product data received.");
        }

        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(
          "Could not load products. Please check that the backend is running."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const knownCategories = [
      "Electronics",
      "Fashion",
      "Bags",
      "Home",
      "Beauty",
      "Accessories",
      "Footwear",
    ];

    const actualCategories = products
      .map((product) => product.category)
      .filter(Boolean);

    return [...new Set([...knownCategories, ...actualCategories])];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory =
        !category ||
        (product.category || "").toLowerCase() ===
          category.toLowerCase();

      const query = search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        (product.name || "").toLowerCase().includes(query) ||
        (product.category || "").toLowerCase().includes(query) ||
        (product.description || "").toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });

    if (sortBy === "price-low") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "name") {
      result.sort((a, b) =>
        (a.name || "").localeCompare(b.name || "")
      );
    }

    return result;
  }, [products, category, search, sortBy]);

  function toggleWishlist(productId) {
    const alreadyWished = wishlist.includes(productId);

    setWishlist((current) =>
      alreadyWished
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    );

    showToast(
      alreadyWished
        ? "Removed from your wishlist."
        : "Added to your wishlist!",
      "success"
    );
  }

  async function handleAddToCart(product) {
    if (!user) {
      showToast("Please login before adding products to your cart.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id || user.id,
          productId: product._id,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Unable to add product to cart.");
        return;
      }

      if (addToCart) {
        addToCart(product);
      }

      showToast("Product added to cart!", "success");
    } catch (err) {
      console.error("Error adding to cart:", err);
      showToast("Unable to add product to cart.");
    }
  }

  function scrollToProducts(event) {
    event.preventDefault();

    document.getElementById("product-list")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <main className="products-page">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
      />

      <section className="products-banner">
        <div className="products-banner-content">
          <span className="products-eyebrow">
            ✦ YOUR NEXT FAVOURITE IS HERE
          </span>

          <h1>
            Little things.
            <br />
            <span>Big happiness.</span>
          </h1>

          <p>
            Discover everyday essentials, trending finds, and
            products that make life a little more exciting.
          </p>

          <div className="products-banner-points">
            <span>✓ Curated collections</span>
            <span>✓ Easy everyday shopping</span>
          </div>

          <a
            href="#product-list"
            className="products-shop-button"
            onClick={scrollToProducts}
          >
            Explore Collection <span>→</span>
          </a>
        </div>

        <div className="products-banner-art">
          <div className="products-banner-orbit"></div>
          <div className="products-banner-orbit orbit-two"></div>

          <div className="products-banner-symbol">S</div>

          <div className="products-banner-note">
            <span>THE SHOPEASE EDIT</span>
            <strong>Good finds. Great vibes.</strong>
          </div>

          <div className="products-floating-label">
            <span>✦</span>
            Your style, your way
          </div>
        </div>
      </section>

      <section className="products-catalog" id="product-list">
        <div className="products-header">
          <div>
            <span className="section-eyebrow">MADE FOR YOU</span>
            <h2>
              {category
                ? category + " Collection"
                : "Explore Our Collection"}
            </h2>
            <p>
              Discover something new and find the things you'll love.
            </p>
          </div>

          <div className="products-count">
            <strong>{filteredProducts.length}</strong>
            <span>
              {filteredProducts.length === 1 ? "product" : "products"}
            </span>
          </div>
        </div>

        <div className="products-toolbar">
          <div className="products-search">
            <span>⌕</span>
            <input
              type="search"
              placeholder="Search by name or category..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search products"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <label className="products-sort">
            <span>Sort by</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </label>
        </div>

        <nav className="category-navigation">
          <Link
            to="/products"
            className={!category ? "active-category" : ""}
          >
            ✦ All Products
          </Link>

          {categories.map((item) => (
            <Link
              key={item}
              to={"/products?category=" + encodeURIComponent(item)}
              className={
                category.toLowerCase() === item.toLowerCase()
                  ? "active-category"
                  : ""
              }
            >
              {item}
            </Link>
          ))}
        </nav>

        {!loading && !error && (
          <div className="products-results-label">
            Showing <strong>{filteredProducts.length}</strong> of{" "}
            <strong>{products.length}</strong> products
          </div>
        )}

        {loading ? (
          <div className="products-message">
            <div className="products-loader"></div>
            <h2>Finding your favourites...</h2>
            <p>Please wait while we load the collection.</p>
          </div>
        ) : error ? (
          <div className="products-message">
            <div className="products-message-icon">!</div>
            <h2>Something went wrong</h2>
            <p>{error}</p>
            <button
              className="products-retry-button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="products-message">
            <div className="products-message-icon">♡</div>
            <h2>No products found</h2>
            <p>
              Try another search or category, or add products through your
              admin dashboard.
            </p>
            <button
              className="products-retry-button"
              onClick={() => {
                setSearch("");
                setSortBy("featured");
                window.history.replaceState({}, "", "/products");
                window.location.reload();
              }}
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className="product-container">
            {filteredProducts.map((product, index) => {
              const photo = getProductPhoto(product);
              const wished = wishlist.includes(product._id);

              return (
                <article className="product-card" key={product._id}>
                  <div className="product-image">
                    {photo && (
                      <img
                        src={photo}
                        alt={product.name}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";

                          const fallback =
                            event.currentTarget.parentElement.querySelector(
                              ".product-fallback-icon"
                            );

                          if (fallback) {
                            fallback.style.display = "flex";
                          }
                        }}
                      />
                    )}

                    <span className="product-image-tag">
                      {index < 3 ? "TRENDING" : "SHOPEASE PICK"}
                    </span>

                    <button
                      type="button"
                      className={
                        "product-wishlist" +
                        (wished ? " product-wishlist-active" : "")
                      }
                      onClick={() => toggleWishlist(product._id)}
                      aria-label={
                        wished
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                    >
                      {wished ? "♥" : "♡"}
                    </button>

                    <span
                      className="product-fallback-icon"
                      style={{ display: photo ? "none" : "flex" }}
                    >
                      {product.icon || "🛍️"}
                    </span>
                  </div>

                  <div className="product-card-content">
                    <p className="category">
                      {product.category || "Everyday essentials"}
                    </p>

                    <h2>{product.name}</h2>

                    <div className="product-rating">
                      <span>★</span>
                      <span>New arrival</span>
                    </div>

                    <div className="product-bottom">
                      <div className="product-price">
                        <span>PRICE</span>
                        <h3>
                          ₹{Number(product.price).toLocaleString("en-IN")}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add <span className="add-cart-icon">+</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default Products;
