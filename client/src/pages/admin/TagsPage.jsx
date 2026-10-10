import { useEffect, useState } from "react";
import { adminRequest } from "../../lib/adminApi.js";
import {
  AdminCard,
  AdminPageHeader,
  AdminPill,
  AdminShell,
  AdminIcon,
} from "./shared.jsx";

export function AdminTagsPage({ pathname, onNavigate }) {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadTags() {
      try {
        setLoading(true);
        const response = await adminRequest("/admin/tags");
        if (!cancelled) setTags(response.data || []);
      } catch (requestError) {
        if (!cancelled) setError(requestError.message || "Failed to load tags");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTags();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AdminShell pathname={pathname} onNavigate={onNavigate}>
      <AdminPageHeader
        title="Product & Content Tags"
        subtitle="Manage keyword taxonomy and indexing tags for products and self-care content."
      />

      {error && (
        <div className="admin-alert admin-alert--danger">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")}>✕</button>
        </div>
      )}

      <AdminCard
        title="Tag Cloud & Taxonomy"
        subtitle="Active keyword tags across database records"
      >
        {loading ? (
          <div className="admin-card-loading">Loading tags...</div>
        ) : tags.length === 0 ? (
          <div className="admin-empty-state-card">
            <div className="admin-empty-state-card__icon">
              <AdminIcon type="tags" />
            </div>
            <h3>No Tags Generated Yet</h3>
            <p>
              Tag taxonomy is generated automatically when keywords are assigned to products and wellness articles.
            </p>
            <button
              type="button"
              className="admin-primary-button"
              onClick={() => onNavigate("/admin/products/new")}
            >
              <AdminIcon type="plus" />
              <span>Add a Product</span>
            </button>
          </div>
        ) : (
          <div className="admin-tag-cloud">
            {tags.map((tag) => (
              <span key={tag.name || tag} className="admin-tag-badge">
                #{tag.name || tag}
              </span>
            ))}
          </div>
        )}
      </AdminCard>
    </AdminShell>
  );
}
