import { useEffect, useState } from "react";
import { adminRequest } from "../../lib/adminApi.js";
import {
  AdminCard,
  AdminPageHeader,
  AdminPill,
  AdminShell,
  AdminIcon,
} from "./shared.jsx";

export function AdminCategoriesPage({ pathname, onNavigate }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        setLoading(true);
        const response = await adminRequest("/admin/categories");
        if (!cancelled) setCategories(response.data || []);
      } catch (requestError) {
        if (!cancelled)
          setError(requestError.message || "Failed to load categories");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCategories();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AdminShell pathname={pathname} onNavigate={onNavigate}>
      <AdminPageHeader
        title="Product Categories"
        subtitle="Botanical classifications dynamically aggregated from active product catalog entries."
        actions={
          <button
            type="button"
            className="admin-primary-button"
            onClick={() => onNavigate("/admin/products/new")}
          >
            <AdminIcon type="plus" />
            <span>Add Product</span>
          </button>
        }
      />

      {error && (
        <div className="admin-alert admin-alert--danger">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")}>✕</button>
        </div>
      )}

      <AdminCard
        title="Category Directory"
        subtitle="Click any category to view or edit products assigned to it."
      >
        {loading ? (
          <div className="admin-card-loading">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="admin-table__empty">
            No categories detected yet. Categories populate automatically when products are assigned to them.
          </div>
        ) : (
          <div className="admin-table-container">
            <div className="admin-table">
              <div
                className="admin-table__head"
                style={{ gridTemplateColumns: "2fr 1fr 1fr" }}
              >
                <span>CATEGORY NAME</span>
                <span>INVENTORY COUNT</span>
                <span>ACTION</span>
              </div>
              <div className="admin-table__body">
                {categories.map((category) => (
                  <div
                    key={category.name}
                    className="admin-table__row"
                    style={{ gridTemplateColumns: "2fr 1fr 1fr" }}
                  >
                    <div className="admin-table__product">
                      <div className="admin-category-badge-icon">🌿</div>
                      <strong>{category.name}</strong>
                    </div>
                    <span>
                      <AdminPill tone="blue">
                        {category.productCount}{" "}
                        {category.productCount === 1 ? "Product" : "Products"}
                      </AdminPill>
                    </span>
                    <div>
                      <button
                        type="button"
                        className="admin-secondary-button admin-secondary-button--sm"
                        onClick={() => onNavigate("/admin/products")}
                      >
                        View Items →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </AdminCard>
    </AdminShell>
  );
}
