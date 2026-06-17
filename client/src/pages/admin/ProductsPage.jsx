import { useEffect, useState } from "react";
import { adminRequest } from "../../lib/adminApi.js";
import {
  AdminCard,
  AdminPageHeader,
  AdminPill,
  AdminShell,
} from "./shared.jsx";

const initialForm = {
  name: "",
  sku: "",
  description: "",
  price: "",
  stock: "",
  category: "Uncategorized",
  status: "draft",
  images: [],
};

function getImageUrl(image) {
  if (!image) return "";
  if (typeof image === "string") return image;
  if (typeof image === "object")
    return image.url || image.src || image.secureUrl || image.path || "";
  return "";
}

export function AdminProductsPage({ pathname, onNavigate }) {
  const [form, setForm] = useState(initialForm);
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setListLoading(true);
      const response = await adminRequest("/admin/products");
      setProducts(response.data || []);
    } catch (requestError) {
      setError(requestError.message || "Failed to load products");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setSelectedId(null);
  };

  const startEdit = (product) => {
    setSelectedId(product.id);
    setForm({
      name: product.name || "",
      sku: product.sku || "",
      description: product.description || "",
      price: String(product.price ?? ""),
      stock: String(product.stock ?? ""),
      category: product.category || "Uncategorized",
      status: product.status || "draft",
      images: Array.isArray(product.images) ? product.images : [],
    });
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setUploadingImages(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file, file.name));

      const response = await adminRequest("/admin/uploads/images", {
        method: "POST",
        body: formData,
      });

      setForm((current) => ({
        ...current,
        images: [...current.images, ...(response.data || [])],
      }));
      setMessage("Images uploaded.");
    } catch (requestError) {
      setError(requestError.message || "Failed to upload images");
    } finally {
      setUploadingImages(false);
      event.target.value = "";
    }
  };

  const removeImage = (index) => {
    setForm((current) => ({
      ...current,
      images: current.images.filter((_, imageIndex) => imageIndex !== index),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        ...form,
        price: Number(form.price || 0),
        stock: Number(form.stock || 0),
        images: form.images,
      };

      if (selectedId) {
        await adminRequest(`/admin/products/${selectedId}`, {
          method: "PUT",
          body: payload,
        });
        setMessage("Product updated.");
      } else {
        await adminRequest("/admin/products", {
          method: "POST",
          body: payload,
        });
        setMessage("Product created.");
      }

      resetForm();
      await loadProducts();
    } catch (requestError) {
      setError(requestError.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    setError("");
    setMessage("");
    try {
      await adminRequest(`/admin/products/${id}`, { method: "DELETE" });
      if (selectedId === id) {
        resetForm();
      }
      await loadProducts();
      setMessage("Product deleted.");
    } catch (requestError) {
      setError(requestError.message || "Failed to delete product");
    }
  };

  return (
    <AdminShell pathname={pathname} onNavigate={onNavigate}>
      <AdminPageHeader
        backLabel="<- Back to Products"
        onBack={() => onNavigate("/admin")}
        title={selectedId ? "Edit Product" : "Add New Product"}
        subtitle="Create a new product and add all the details."
        actions={
          <button
            type="button"
            className="admin-primary-button"
            onClick={handleSubmit}
          >
            {loading
              ? "Saving..."
              : selectedId
                ? "Update Product"
                : "Publish Product"}
          </button>
        }
      />

      <form className="admin-form-layout" onSubmit={handleSubmit}>
        <div className="admin-form-layout__main">
          <AdminCard title="Basic Information">
            <div className="admin-form-grid">
              <label>
                Product Name
                <input
                  value={form.name}
                  onChange={updateField("name")}
                  type="text"
                  placeholder="Enter product name"
                />
              </label>
              <label>
                SKU (Stock Keeping Unit)
                <input
                  value={form.sku}
                  onChange={updateField("sku")}
                  type="text"
                  placeholder="Enter SKU (optional)"
                />
              </label>
              <label className="admin-form-grid__full">
                Description
                <textarea
                  value={form.description}
                  onChange={updateField("description")}
                  placeholder="Write a product description..."
                  rows={8}
                />
              </label>
            </div>
          </AdminCard>

          <AdminCard
            title="Product Images"
            subtitle="Upload multiple photos. The first photo will be used as the main image on the storefront."
          >
            <div className="admin-image-uploader">
              <label className="admin-image-uploader__dropzone">
                <input
                  name="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                />
                <span>
                  {uploadingImages ? "Uploading..." : "Choose multiple images"}
                </span>
                <small>
                  PNG, JPG, WebP. You can add several photos at once.
                </small>
              </label>

              {form.images.length ? (
                <div className="admin-image-grid">
                  {form.images.map((image, index) => {
                    const imageUrl = getImageUrl(image);
                    return (
                      <figure
                        key={imageUrl || index}
                        className="admin-image-grid__item"
                      >
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={`Product image ${index + 1}`}
                          />
                        ) : (
                          <div className="admin-image-grid__placeholder">
                            No preview
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                        >
                          Remove
                        </button>
                      </figure>
                    );
                  })}
                </div>
              ) : (
                <p className="admin-help-text">No images uploaded yet.</p>
              )}
            </div>
          </AdminCard>

          <AdminCard title="Additional Details">
            <div className="admin-form-grid">
              <label>
                Category
                <input
                  value={form.category}
                  onChange={updateField("category")}
                  type="text"
                  placeholder="Herbal"
                />
              </label>
              <label>
                Status
                <select value={form.status} onChange={updateField("status")}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>
              <label>
                Price
                <input
                  value={form.price}
                  onChange={updateField("price")}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </label>
              <label>
                Stock
                <input
                  value={form.stock}
                  onChange={updateField("stock")}
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0"
                />
              </label>
            </div>
          </AdminCard>
        </div>

        <aside className="admin-form-layout__side">
          <AdminCard title="Publish">
            <p className="admin-help-text">
              Save the product as draft or publish it right away.
            </p>
            {message ? (
              <p className="text-sm text-green-700">{message}</p>
            ) : null}
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button
              type="submit"
              className="admin-primary-button"
              disabled={loading || uploadingImages}
            >
              {loading
                ? "Saving..."
                : selectedId
                  ? "Update Product"
                  : "Save Product"}
            </button>
            {selectedId ? (
              <button
                type="button"
                className="admin-secondary-button"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            ) : null}
          </AdminCard>
        </aside>
      </form>

      <AdminCard
        title="Existing Products"
        subtitle="Edit or delete products from the admin API."
      >
        {listLoading ? <p>Loading products...</p> : null}
        <div className="admin-table">
          <div className="admin-table__head admin-table__head--products">
            <span>PRODUCT</span>
            <span>CATEGORY</span>
            <span>PRICE</span>
            <span>STATUS</span>
            <span>ACTIONS</span>
          </div>
          <div className="admin-table__body">
            {products.map((item) => (
              <div
                key={item.id || item.name}
                className="admin-table__row admin-table__row--products"
              >
                <div className="admin-table__product">
                  <span>{item.name}</span>
                </div>
                <span>{item.category}</span>
                <span>NGN {item.price?.toLocaleString?.() ?? item.price}</span>
                <span>
                  {item.status === "published" ? (
                    <AdminPill>Published</AdminPill>
                  ) : (
                    <AdminPill tone="amber">Draft</AdminPill>
                  )}
                </span>
                <div className="admin-actions">
                  <button
                    type="button"
                    aria-label="Edit"
                    onClick={() => startEdit(item)}
                  >
                    <span className="admin-action-icon">edit</span>
                  </button>
                  <button
                    type="button"
                    aria-label="Delete"
                    onClick={() => handleDelete(item.id)}
                  >
                    <span className="admin-action-icon admin-action-icon--danger">
                      del
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminCard>
    </AdminShell>
  );
}
