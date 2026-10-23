import { useEffect, useState } from "react";
import { adminRequest } from "../../lib/adminApi.js";
import {
  AdminCard,
  AdminPageHeader,
  AdminPill,
  AdminShell,
  AdminStatCard,
  AdminIcon,
} from "./shared.jsx";

function getProductThumbnail(product) {
  if (product.images && product.images.length > 0) {
    const img = product.images[0];
    return typeof img === "string" ? img : img.url || img.src || "";
  }
  return "";
}

export function AdminDashboardPage({ pathname, onNavigate }) {
  const [stats, setStats] = useState({
    blogPosts: 0,
    products: 0,
    users: 0,
    accounts: 0,
    orders: 0,
  });
  const [products, setProducts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await adminRequest("/admin/dashboard");
      setStats(
        response.stats || { blogPosts: 0, products: 0, users: 0, accounts: 0, orders: 0 }
      );
      setProducts(response.products || []);
      setRecentPosts(response.recentPosts || []);
      setRecentUsers(response.users || []);
    } catch (requestError) {
      setError(requestError.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleDeleteProduct = async (id, name) => {
    if (!id || !window.confirm(`Are you sure you want to delete "${name || "this product"}"?`))
      return;
    try {
      await adminRequest(`/admin/products/${id}`, { method: "DELETE" });
      await loadDashboard();
    } catch (requestError) {
      setError(requestError.message || "Failed to delete product");
    }
  };

  const handleDeletePost = async (id, title) => {
    if (!id || !window.confirm(`Are you sure you want to delete "${title || "this post"}"?`))
      return;
    try {
      await adminRequest(`/admin/posts/${id}`, { method: "DELETE" });
      await loadDashboard();
    } catch (requestError) {
      setError(requestError.message || "Failed to delete blog post");
    }
  };

  const currentDateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <AdminShell pathname={pathname} onNavigate={onNavigate}>
      {/* Welcome Banner */}
      <div className="admin-welcome-hero">
        <div className="admin-welcome-hero__content">
          <div className="admin-welcome-hero__pill">
            <span className="admin-welcome-hero__dot" />
            <span>STORE OPERATIONS</span>
          </div>
          <h1>Greenrut Executive Dashboard</h1>
          <p>
            Real-time control center for herbal wellness products, scientific research publications,
            and customer engagement.
          </p>
          <div className="admin-welcome-hero__date">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>{currentDateStr}</span>
          </div>
        </div>

        <div className="admin-welcome-hero__actions">
          <button
            type="button"
            className="admin-hero-btn admin-hero-btn--primary"
            onClick={() => onNavigate("/admin/products/new")}
          >
            <AdminIcon type="plus" />
            <span>Add Product</span>
          </button>
          <button
            type="button"
            className="admin-hero-btn admin-hero-btn--secondary"
            onClick={() => onNavigate("/admin/blog/new")}
          >
            <AdminIcon type="pencil" />
            <span>Write Article</span>
          </button>
          <button
            type="button"
            className="admin-hero-btn admin-hero-btn--secondary"
            onClick={() => window.open("/", "_blank")}
          >
            <AdminIcon type="external" />
            <span>Live Store</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="admin-alert admin-alert--danger">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")}>✕</button>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="admin-stats-grid">
        <AdminStatCard
          iconTone="green"
          title="Orders & Sales"
          value={loading ? "..." : stats.orders}
          description="Customer orders & fulfillment"
          badge="Orders"
          onClick={() => onNavigate("/admin/orders")}
        />
        <AdminStatCard
          iconTone="green"
          title="Store Products"
          value={loading ? "..." : stats.products}
          description="Active catalog items"
          badge="Live"
          onClick={() => onNavigate("/admin/products")}
        />
        <AdminStatCard
          iconTone="blue"
          title="Self-Care Articles"
          value={loading ? "..." : stats.blogPosts}
          description="Published health blogs"
          badge="Content"
          onClick={() => onNavigate("/admin/blog/new")}
        />
        <AdminStatCard
          iconTone="purple"
          title="Registered Users"
          value={loading ? "..." : stats.users}
          description="Verified customer accounts"
          badge="Audience"
          onClick={() => onNavigate("/admin/users")}
        />
        <AdminStatCard
          iconTone="amber"
          title="System Profiles"
          value={loading ? "..." : stats.accounts}
          description="Administrative access"
          badge="System"
          onClick={() => onNavigate("/admin/settings")}
        />
      </div>

      {/* Main Grid: Left side content, Right side status */}
      <div className="admin-dashboard-layout">
        <div className="admin-dashboard-layout__primary">
          {/* Recent Products Card */}
          <AdminCard
            title="Products Catalog"
            subtitle="Latest natural herbal formulations and supplements in inventory."
            actions={
              <div className="admin-card-action-group">
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={() => onNavigate("/admin/products")}
                >
                  View All ({stats.products})
                </button>
                <button
                  type="button"
                  className="admin-primary-button"
                  onClick={() => onNavigate("/admin/products/new")}
                >
                  <AdminIcon type="plus" />
                  <span>Add Product</span>
                </button>
              </div>
            }
          >
            {loading ? (
              <div className="admin-card-loading">Loading catalog items...</div>
            ) : products.length === 0 ? (
              <div className="admin-table__empty">
                No products found. Click "+ Add Product" to publish your first herbal formula.
              </div>
            ) : (
              <div className="admin-table-container">
                <div className="admin-table">
                  <div className="admin-table__head admin-table__head--products">
                    <span>PRODUCT</span>
                    <span>CATEGORY</span>
                    <span>PRICE</span>
                    <span>STATUS</span>
                    <span>ACTIONS</span>
                  </div>
                  <div className="admin-table__body">
                    {products.slice(0, 5).map((item) => {
                      const thumb = getProductThumbnail(item);
                      return (
                        <div
                          key={item.id || item.name}
                          className="admin-table__row admin-table__row--products"
                        >
                          <div className="admin-table__product">
                            <div className="admin-table__product-thumb">
                              {thumb ? (
                                <img src={thumb} alt={item.name} />
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
                              onClick={() => onNavigate("/admin/products")}
                            >
                              <AdminIcon type="pencil" />
                            </button>
                            <button
                              type="button"
                              className="admin-action-btn admin-action-btn--danger"
                              title="Delete product"
                              onClick={() => handleDeleteProduct(item.id, item.name)}
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

          {/* Recent Self-Care / Blog Posts */}
          <AdminCard
            title="Recent Self-Care Articles"
            subtitle="Educational wellness guides, recipes, and healthy living posts."
            actions={
              <button
                type="button"
                className="admin-secondary-button"
                onClick={() => onNavigate("/admin/blog/new")}
              >
                <AdminIcon type="plus" />
                <span>New Article</span>
              </button>
            }
          >
            {loading ? (
              <div className="admin-card-loading">Loading articles...</div>
            ) : recentPosts.length === 0 ? (
              <div className="admin-table__empty">
                No self-care articles published yet.
              </div>
            ) : (
              <div className="admin-table-container">
                <div className="admin-table">
                  <div className="admin-table__head admin-table__head--posts">
                    <span>ARTICLE TITLE</span>
                    <span>CATEGORY</span>
                    <span>AUTHOR</span>
                    <span>ACTIONS</span>
                  </div>
                  <div className="admin-table__body">
                    {recentPosts.slice(0, 5).map((post) => (
                      <div
                        key={post.id || post.title}
                        className="admin-table__row admin-table__row--posts"
                      >
                        <div className="admin-table__title-cell">
                          <strong>{post.title}</strong>
                        </div>
                        <span>
                          <span className="admin-category-tag">
                            {post.category || "Wellness"}
                          </span>
                        </span>
                        <span className="admin-author-tag">
                          {post.author || "Greenrut Team"}
                        </span>
                        <div className="admin-actions">
                          <button
                            type="button"
                            className="admin-action-btn"
                            title="Edit post"
                            onClick={() => onNavigate(`/admin/blog?id=${post.id}`)}
                          >
                            <AdminIcon type="pencil" />
                          </button>
                          <button
                            type="button"
                            className="admin-action-btn admin-action-btn--danger"
                            title="Delete post"
                            onClick={() => handleDeletePost(post.id, post.title)}
                          >
                            <AdminIcon type="trash" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </AdminCard>
        </div>

        {/* Right Side Widgets */}
        <div className="admin-dashboard-layout__secondary">
          {/* System Health */}
          <AdminCard title="System Status" subtitle="Infrastructure connectivity">
            <div className="admin-system-health">
              <div className="admin-health-row">
                <div className="admin-health-row__label">
                  <span className="admin-health-dot admin-health-dot--online" />
                  <span>Database Engine</span>
                </div>
                <strong className="admin-health-row__val">MongoDB Atlas</strong>
              </div>
              <div className="admin-health-row">
                <div className="admin-health-row__label">
                  <span className="admin-health-dot admin-health-dot--online" />
                  <span>API Server</span>
                </div>
                <strong className="admin-health-row__val">Node / Express</strong>
              </div>
              <div className="admin-health-row">
                <div className="admin-health-row__label">
                  <span className="admin-health-dot admin-health-dot--online" />
                  <span>Media Storage</span>
                </div>
                <strong className="admin-health-row__val">Cloudinary CDN</strong>
              </div>
              <div className="admin-health-row">
                <div className="admin-health-row__label">
                  <span className="admin-health-dot admin-health-dot--online" />
                  <span>Currency</span>
                </div>
                <strong className="admin-health-row__val">NGN (₦)</strong>
              </div>
            </div>
          </AdminCard>

          {/* Quick Shortcuts */}
          <AdminCard title="Quick Management" subtitle="Frequent admin tasks">
            <div className="admin-shortcuts-list">
              <button
                type="button"
                className="admin-shortcut-item"
                onClick={() => onNavigate("/admin/banners")}
              >
                <div className="admin-shortcut-item__icon">
                  <AdminIcon type="banners" />
                </div>
                <div className="admin-shortcut-item__text">
                  <strong>Hero Banners</strong>
                  <span>Manage homepage slider & promotions</span>
                </div>
                <span className="admin-shortcut-item__arrow">→</span>
              </button>

              <button
                type="button"
                className="admin-shortcut-item"
                onClick={() => onNavigate("/admin/categories")}
              >
                <div className="admin-shortcut-item__icon">
                  <AdminIcon type="categories" />
                </div>
                <div className="admin-shortcut-item__text">
                  <strong>Categories</strong>
                  <span>Manage product classification</span>
                </div>
                <span className="admin-shortcut-item__arrow">→</span>
              </button>

              <button
                type="button"
                className="admin-shortcut-item"
                onClick={() => onNavigate("/admin/research/new")}
              >
                <div className="admin-shortcut-item__icon">
                  <AdminIcon type="research" />
                </div>
                <div className="admin-shortcut-item__text">
                  <strong>Scientific Research</strong>
                  <span>Publish clinical monographs</span>
                </div>
                <span className="admin-shortcut-item__arrow">→</span>
              </button>

              <button
                type="button"
                className="admin-shortcut-item"
                onClick={() => onNavigate("/admin/library/new")}
              >
                <div className="admin-shortcut-item__icon">
                  <AdminIcon type="library" />
                </div>
                <div className="admin-shortcut-item__text">
                  <strong>Herbal Library</strong>
                  <span>Botanical monographs database</span>
                </div>
                <span className="admin-shortcut-item__arrow">→</span>
              </button>

              <button
                type="button"
                className="admin-shortcut-item"
                onClick={() => onNavigate("/admin/reviews")}
              >
                <div className="admin-shortcut-item__icon">
                  <AdminIcon type="reviews" />
                </div>
                <div className="admin-shortcut-item__text">
                  <strong>Reviews & Testimonials</strong>
                  <span>Manage customer feedback</span>
                </div>
                <span className="admin-shortcut-item__arrow">→</span>
              </button>
            </div>
          </AdminCard>

          {/* Recently Registered Users */}
          {recentUsers.length > 0 && (
            <AdminCard
              title="Recent Users"
              subtitle="Latest registered customers"
              actions={
                <button
                  type="button"
                  className="admin-card-link"
                  onClick={() => onNavigate("/admin/users")}
                >
                  View All →
                </button>
              }
            >
              <div className="admin-recent-users-list">
                {recentUsers.slice(0, 4).map((u) => (
                  <div key={u.id || u.email} className="admin-recent-user-row">
                    <div className="admin-recent-user-avatar">
                      {(u.name?.[0] || u.email?.[0] || "U").toUpperCase()}
                    </div>
                    <div className="admin-recent-user-info">
                      <strong>{u.name || "Customer"}</strong>
                      <span>{u.email}</span>
                    </div>
                    <AdminPill tone={u.role === "admin" ? "purple" : "blue"}>
                      {u.role || "User"}
                    </AdminPill>
                  </div>
                ))}
              </div>
            </AdminCard>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
