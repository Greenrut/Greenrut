import { useEffect, useState, useMemo } from "react";
import { adminRequest } from "../../lib/adminApi.js";
import {
  AdminCard,
  AdminPageHeader,
  AdminPill,
  AdminShell,
  AdminIcon,
} from "./shared.jsx";

const CATEGORIES = [
  "NUTRITION & INSTANTS",
  "DAILY SUPPLEMENTS",
  "IMMUNITY & METABOLISM",
  "SKIN & BODY CARE",
  "TARGETED HEALTH",
  "MEN & WOMEN",
  "Uncategorized",
];

const initialForm = {
  name: "",
  sku: "",
  description: "",
  price: "",
  stock: "",
  category: "NUTRITION & INSTANTS",
  status: "draft",
  benefits: "",
  ingredients: "",
  scientificValidation: "",
  directions: "",
  warnings: "",
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
  const isDirectNew = pathname === "/admin/products/new";
  const [form, setForm] = useState(initialForm);
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [viewMode, setViewMode] = useState(isDirectNew ? "editor" : "catalog");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setListLoading(true);
      setError("");
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

  useEffect(() => {
    if (isDirectNew) {
      setViewMode("editor");
      setSelectedId(null);
      setForm(initialForm);
    }
  }, [isDirectNew]);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setSelectedId(null);
    setViewMode("catalog");
    setMessage("");
    setError("");
  };

  const startCreate = () => {
    setSelectedId(null);
    setForm(initialForm);
    setViewMode("editor");
    setMessage("");
    setError("");
  };

  const startEdit = (product) => {
    setSelectedId(product.id);
    setForm({
      name: product.name || "",
      sku: product.sku || "",
      description: product.description || "",
      price: String(product.price ?? ""),
      stock: String(product.stock ?? ""),
      category: product.category || "NUTRITION & INSTANTS",
      status: product.status || "draft",
      benefits: product.benefits || "",
      ingredients: product.ingredients || "",
      scientificValidation: product.scientificValidation || "",
      directions: product.directions || "",
      warnings: product.warnings || "",
      images: Array.isArray(product.images) ? product.images : [],
    });
    setViewMode("editor");
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      setMessage("Images uploaded successfully.");
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
    if (event) event.preventDefault();
    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

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
        setMessage("Product updated successfully.");
      } else {
        await adminRequest("/admin/products", {
          method: "POST",
          body: payload,
        });
        setMessage("Product published successfully.");
      }

      await loadProducts();
      // Keep on screen for a moment or return to catalog
      setTimeout(() => {
        resetForm();
      }, 900);
    } catch (requestError) {
      setError(requestError.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name || "this product"}"?`))
      return;

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

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.sku && item.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        categoryFilter === "ALL" || item.category === categoryFilter;

      const matchesStatus =
        statusFilter === "ALL" || item.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchQuery, categoryFilter, statusFilter]);

  return (
    <AdminShell pathname={pathname} onNavigate={onNavigate}>
      {/* Page Header */}
      <AdminPageHeader
        title={
          viewMode === "editor"
            ? selectedId
              ? "Edit Product"
              : "Create New Product"
            : "Product Catalog"
        }
        subtitle={
          viewMode === "editor"
            ? "Configure formulation parameters, ingredients, pricing, and high-resolution product photography."
            : `Manage all natural wellness formulations and herbal inventory (${products.length} total items).`
        }
        backLabel={viewMode === "editor" ? "Back to Products Catalog" : undefined}
        onBack={resetForm}
        actions={
          viewMode === "catalog" ? (
            <button
              type="button"
              className="admin-primary-button"
              onClick={startCreate}
            >
              <AdminIcon type="plus" />
              <span>Add New Product</span>
            </button>
          ) : (
            <div className="admin-header-actions-group">
              <button
                type="button"
                className="admin-secondary-button"
                onClick={resetForm}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-primary-button"
                onClick={handleSubmit}
                disabled={loading || uploadingImages}
              >
                {loading
                  ? "Saving..."
                  : selectedId
                    ? "Update Product"
                    : "Publish Product"}
              </button>
            </div>
          )
        }
      />

      {/* Alerts */}
      {message && (
        <div className="admin-alert admin-alert--success">
          <span>✓ {message}</span>
          <button type="button" onClick={() => setMessage("")}>✕</button>
        </div>
      )}
      {error && (
        <div className="admin-alert admin-alert--danger">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")}>✕</button>
        </div>
      )}

      {/* CATALOG VIEW */}
      {viewMode === "catalog" && (
        <div className="admin-catalog-view">
          {/* Filter Bar */}
          <div className="admin-filter-bar">
            <div className="admin-filter-search">
              <AdminIcon type="search" />
              <input
                type="text"
                placeholder="Search products by title, SKU, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="admin-search-clear-btn"
                  onClick={() => setSearchQuery("")}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="admin-filter-group">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="admin-select"
              >
                <option value="ALL">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="admin-select"
              >
                <option value="ALL">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Products Table Card */}
          <AdminCard>
            {listLoading ? (
              <div className="admin-card-loading">Loading catalog items...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="admin-table__empty">
                {products.length === 0
                  ? "Your catalog is empty. Click '+ Add New Product' above to create one."
                  : "No products matched your search or filters."}
              </div>
            ) : (
              <div className="admin-table-container">
                <div className="admin-table">
                  <div className="admin-table__head admin-table__head--products">
                    <span>PRODUCT</span>
                    <span>CATEGORY</span>
                    <span>PRICE</span>
                    <span>STOCK</span>
                    <span>STATUS</span>
                    <span>ACTIONS</span>
                  </div>
                  <div className="admin-table__body">
                    {filteredProducts.map((item) => {
                      const firstImg =
                        item.images && item.images.length > 0
                          ? getImageUrl(item.images[0])
                          : "";

                      return (
                        <div
                          key={item.id || item.name}
                          className="admin-table__row admin-table__row--products"
                        >
                          <div className="admin-table__product">
                            <div className="admin-table__product-thumb">
                              {firstImg ? (
                                <img src={firstImg} alt={item.name} />
                              ) : (
                                <span>{(item.name?.[0] || "P").toUpperCase()}</span>
                              )}
                            </div>
                            <div className="admin-table__product-info">
                              <strong>{item.name}</strong>
                              {item.sku && <span>SKU: {item.sku}</span>}
                            </div>
                          </div>
                          <span>
                            <span className="admin-category-tag">
                              {item.category || "Uncategorized"}
                            </span>
                          </span>
                          <span className="admin-price-tag">
                            NGN {Number(item.price || 0).toLocaleString()}
                          </span>
                          <span className="admin-stock-tag">
                            {item.stock !== undefined && item.stock !== ""
                              ? `${item.stock} in stock`
                              : "Unlimited"}
                          </span>
                          <span>
                            {item.status === "published" ? (
                              <AdminPill tone="green">Published</AdminPill>
                            ) : (
                              <AdminPill tone="amber">Draft</AdminPill>
                            )}
                          </span>
                          <div className="admin-actions">
                            <button
                              type="button"
                              className="admin-action-btn"
                              title="Edit product"
                              onClick={() => startEdit(item)}
                            >
                              <AdminIcon type="pencil" />
                            </button>
                            <button
                              type="button"
                              className="admin-action-btn admin-action-btn--danger"
                              title="Delete product"
                              onClick={() => handleDelete(item.id, item.name)}
                            >
                              <AdminIcon type="trash" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </AdminCard>
        </div>
      )}

      {/* EDITOR VIEW */}
      {viewMode === "editor" && (
        <form className="admin-form-layout" onSubmit={handleSubmit}>
          <div className="admin-form-layout__main">
            {/* General Info */}
            <AdminCard title="Basic Information" subtitle="Primary product identifiers and descriptions.">
              <div className="admin-form-grid">
                <label>
                  Product Name *
                  <input
                    value={form.name}
                    onChange={updateField("name")}
                    type="text"
                    placeholder="e.g. Pure Bitter Leaf Extract"
                    required
                  />
                </label>
                <label>
                  SKU (Stock Keeping Unit)
                  <input
                    value={form.sku}
                    onChange={updateField("sku")}
                    type="text"
                    placeholder="e.g. GR-BL-001"
                  />
                </label>
                <label className="admin-form-grid__full">
                  Detailed Description
                  <textarea
                    value={form.description}
                    onChange={updateField("description")}
                    placeholder="Provide a comprehensive summary of this natural herbal formula..."
                    rows={6}
                  />
                </label>
              </div>
            </AdminCard>

            {/* Media Gallery */}
            <AdminCard
              title="Product Photography"
              subtitle="Upload high-definition photos showcasing packaging and pure botanical textures."
            >
              <div className="admin-media-uploader">
                <label className="admin-upload-dropzone">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImages}
                  />
                  <div className="admin-upload-dropzone__content">
                    <AdminIcon type="plus" />
                    <strong>{uploadingImages ? "Uploading..." : "Click to Upload Product Photos"}</strong>
                    <span>PNG, JPG, WebP up to 5MB</span>
                  </div>
                </label>

                {form.images && form.images.length > 0 && (
                  <div className="admin-media-gallery">
                    {form.images.map((img, index) => {
                      const url = getImageUrl(img);
                      return (
                        <div key={index} className="admin-media-thumb">
                          <img src={url} alt={`Photo ${index + 1}`} />
                          <button
                            type="button"
                            className="admin-media-thumb__remove"
                            onClick={() => removeImage(index)}
                            title="Remove image"
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </AdminCard>

            {/* Blueprint Formulation Details */}
            <AdminCard
              title="Blueprint Herbal Details"
              subtitle="Scientific monograph parameters, active ingredients, and holistic health benefits."
            >
              <div className="admin-form-grid admin-form-grid--single">
                <label>
                  Key Health Benefits
                  <textarea
                    value={form.benefits}
                    onChange={updateField("benefits")}
                    placeholder="Highlight biological systems supported, antioxidant potency, immune response, etc."
                    rows={4}
                  />
                </label>
                <label>
                  Key Active Ingredients
                  <textarea
                    value={form.ingredients}
                    onChange={updateField("ingredients")}
                    placeholder="Full botanical nomenclature, active phytonutrients, purity assay notes..."
                    rows={4}
                  />
                </label>
                <label>
                  Scientific Validation & Research Notes
                  <textarea
                    value={form.scientificValidation}
                    onChange={updateField("scientificValidation")}
                    placeholder="Clinical trials, peer-reviewed citations, extraction methodology..."
                    rows={4}
                  />
                </label>
                <label>
                  Directions for Consumption
                  <textarea
                    value={form.directions}
                    onChange={updateField("directions")}
                    placeholder="Dosage, recommended frequency, morning/evening routine..."
                    rows={3}
                  />
                </label>
                <label>
                  Safety & Warnings
                  <textarea
                    value={form.warnings}
                    onChange={updateField("warnings")}
                    placeholder="Contraindications, pregnancy advisories, storage conditions..."
                    rows={3}
                  />
                </label>
              </div>
            </AdminCard>
          </div>

          {/* Side Panel */}
          <aside className="admin-form-layout__side">
            {/* Status & Actions Card */}
            <AdminCard title="Publishing Status">
              <div className="admin-status-radio-group">
                <label className="admin-status-radio">
                  <input
                    type="radio"
                    name="status"
                    value="published"
                    checked={form.status === "published"}
                    onChange={updateField("status")}
                  />
                  <div>
                    <strong>Published</strong>
                    <span>Immediately visible to storefront visitors</span>
                  </div>
                </label>
                <label className="admin-status-radio">
                  <input
                    type="radio"
                    name="status"
                    value="draft"
                    checked={form.status === "draft"}
                    onChange={updateField("status")}
                  />
                  <div>
                    <strong>Draft</strong>
                    <span>Hidden from public catalog</span>
                  </div>
                </label>
              </div>

              <div className="admin-form-side-actions">
                <button
                  type="submit"
                  className="admin-primary-button"
                  disabled={loading || uploadingImages}
                >
                  {loading
                    ? "Saving..."
                    : selectedId
                      ? "Update Product"
                      : "Publish Product"}
                </button>
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </AdminCard>

            {/* Category & Pricing */}
            <AdminCard title="Pricing & Classification">
              <div className="admin-form-grid admin-form-grid--single">
                <label>
                  Category
                  <select
                    value={form.category}
                    onChange={updateField("category")}
                    className="admin-select"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Price in NGN (₦) *
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={form.price}
                    onChange={updateField("price")}
                    placeholder="e.g. 15000"
                    required
                  />
                </label>

                <label>
                  Stock Inventory Count
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={updateField("stock")}
                    placeholder="e.g. 50"
                  />
                </label>
              </div>
            </AdminCard>
          </aside>
        </form>
      )}
    </AdminShell>
  );
}
