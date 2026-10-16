
import { useEffect, useState } from "react";

function Admin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [image, setImage] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  async function loadProducts() {
    try {
      const response = await fetch("http://localhost:5000/api/products");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load products");
      }

      setProducts(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    try {
      const url = editingId
        ? `http://localhost:5000/api/products/${editingId}`
        : "http://localhost:5000/api/products";

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: name.trim(),
          price: Number(price),
          category,
          image: image.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Product save failed");
      }

      setMessage(
        editingId
          ? "Product updated successfully!"
          : "Product added successfully!"
      );

      resetForm();
      await loadProducts();
    } catch (error) {
      setMessage(error.message);
    }
  }

  function handleEdit(product) {
    setEditingId(product._id);
    setName(product.name);
    setPrice(String(product.price));
    setCategory(product.category);
    setImage(product.image || "");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Product deletion failed");
      }

      setMessage("Product deleted successfully!");
      await loadProducts();
    } catch (error) {
      setMessage(error.message);
    }
  }

  function resetForm() {
    setEditingId(null);
    setName("");
    setPrice("");
    setCategory("Electronics");
    setImage("");
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your ShopEase products from one place.</p>
      </div>

      {message && <p className="admin-message">{message}</p>}

      <section className="admin-form-section">
        <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>

        <form className="admin-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Product name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Price in ₹"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            min="0.01"
            step="0.01"
            required
          />

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            required
          >
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Bags">Bags</option>
            <option value="Home">Home</option>
          </select>

          <input
            type="url"
            placeholder="Product image URL (https://...)"
            value={image}
            onChange={(event) => setImage(event.target.value)}
            required
          />

          {image.trim() && (
            <div className="admin-image-preview">
              <p>Image preview</p>
              <img
                src={image}
                alt="Product preview"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
                onLoad={(event) => {
                  event.currentTarget.style.display = "block";
                }}
              />
            </div>
          )}

          <div className="admin-form-buttons">
            <button type="submit">
              {editingId ? "Update Product" : "Add Product"}
            </button>

            {editingId && (
              <button type="button" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-products-section">
        <h2>Manage Products ({products.length})</h2>

        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="admin-product-list">
            {products.map((product) => (
              <div className="admin-product-card" key={product._id}>
                <div className="admin-product-info">
                  {product.image ? (
                    <img
                      className="admin-product-image"
                      src={product.image}
                      alt={product.name}
                    />
                  ) : (
                    <span className="admin-product-icon">
                      {product.icon || "🛍️"}
                    </span>
                  )}

                  <div>
                    <h3>{product.name}</h3>
                    <p>{product.category}</p>
                    <strong>
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>

                <div className="admin-product-actions">
                  <button type="button" onClick={() => handleEdit(product)}>
                    Edit
                  </button>

                  <button
                    type="button"
                    className="admin-delete-button"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Admin;