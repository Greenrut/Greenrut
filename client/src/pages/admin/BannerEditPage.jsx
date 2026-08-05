import { useEffect, useState } from "react";
import { adminRequest } from "../../lib/adminApi.js";
import { AdminPageHeader, AdminShell } from "./shared.jsx";

export function AdminBannerEditPage({ pathname, params, onNavigate }) {
  const bannerId = params?.id;
  const isNew = bannerId === "new";

  const [banner, setBanner] = useState({
    eyebrow: "",
    title: "",
    text: "",
    primaryLabel: "Learn More",
    primaryPath: "/product",
    secondaryLabel: "",
    secondaryPath: "",
    image: null,
    alt: "",
    position: 0,
    status: "published",
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isNew) return;

    const loadBanner = async () => {
      try {
        setLoading(true);
        const response = await adminRequest(`/admin/banners/${bannerId}`);
        setBanner(response.data || {});
      } catch (requestError) {
        setError(requestError.message || "Failed to load banner");
      } finally {
        setLoading(false);
      }
    };

    loadBanner();
  }, [bannerId, isNew]);

  const handleInputChange = (field, value) => {
    setBanner((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError("");
      const formData = new FormData();
      formData.append("image", file);

      const result = await adminRequest("/admin/uploads/image", {
        method: "POST",
        body: formData,
      });

      setBanner((prev) => ({
        ...prev,
        image: {
          url: result.data.url,
          publicId: result.data.publicId,
        },
      }));
    } catch (uploadError) {
      setError(uploadError.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!banner.image?.url) {
      setError("Banner image is required");
      return;
    }

    if (!isNew && !banner.title.trim()) {
      setError("Banner title is required");
      return;
    }

    const payload = {
      ...banner,
      eyebrow: isNew ? "" : banner.eyebrow,
      title: isNew ? banner.alt?.trim() || "Banner" : banner.title,
      text: isNew ? "" : banner.text,
      primaryLabel: isNew ? "" : banner.primaryLabel,
      primaryPath: isNew ? "" : banner.primaryPath,
      secondaryLabel: isNew ? "" : banner.secondaryLabel,
      secondaryPath: isNew ? "" : banner.secondaryPath,
      alt: banner.alt?.trim() || "Banner image",
    };

    try {
      setSaving(true);
      setError("");

      if (isNew) {
        await adminRequest("/admin/banners", { method: "POST", body: payload });
      } else {
        await adminRequest(`/admin/banners/${bannerId}`, {
          method: "PUT",
          body: payload,
        });
      }

      onNavigate("/admin/banners");
    } catch (requestError) {
      setError(requestError.message || "Failed to save banner");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell pathname={pathname} onNavigate={onNavigate}>
      <AdminPageHeader
        title={isNew ? "Create Banner" : "Edit Banner"}
        subtitle="Manage your homepage carousel banner."
      />

      {error ? <p className="text-sm text-red-600 mb-4">{error}</p> : null}

      <div className="admin-form-container" style={{ maxWidth: "600px" }}>
        <form onSubmit={handleSave} className="admin-form">
          <div className="form-group">
            <label>Banner Image</label>
            {banner.image?.url && (
              <div style={{ marginBottom: "1rem", textAlign: "center" }}>
                <img
                  src={banner.image.url}
                  alt={banner.alt || "Banner"}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "300px",
                    borderRadius: "4px",
                  }}
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
            />
            {uploading && <p className="text-sm text-gray-600">Uploading...</p>}
          </div>

          {!isNew ? (
            <>
              <div className="form-group">
                <label htmlFor="title">Banner Title *</label>
                <input
                  id="title"
                  type="text"
                  value={banner.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="e.g., 100% Herbal"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="eyebrow">Eyebrow Text</label>
                <input
                  id="eyebrow"
                  type="text"
                  value={banner.eyebrow}
                  onChange={(e) => handleInputChange("eyebrow", e.target.value)}
                  placeholder="e.g., 100% herbal"
                />
              </div>

              <div className="form-group">
                <label htmlFor="text">Description</label>
                <textarea
                  id="text"
                  value={banner.text}
                  onChange={(e) => handleInputChange("text", e.target.value)}
                  placeholder="Banner description text"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label htmlFor="alt">Image Alt Text</label>
                <input
                  id="alt"
                  type="text"
                  value={banner.alt}
                  onChange={(e) => handleInputChange("alt", e.target.value)}
                  placeholder="Describe the banner image"
                />
              </div>
            </>
          ) : null}

          {!isNew ? (
            <>
              <div className="form-group">
                <label htmlFor="primaryLabel">Primary Button Label</label>
                <input
                  id="primaryLabel"
                  type="text"
                  value={banner.primaryLabel}
                  onChange={(e) =>
                    handleInputChange("primaryLabel", e.target.value)
                  }
                  placeholder="e.g., Explore Products"
                />
              </div>

              <div className="form-group">
                <label htmlFor="primaryPath">Primary Button Path</label>
                <input
                  id="primaryPath"
                  type="text"
                  value={banner.primaryPath}
                  onChange={(e) =>
                    handleInputChange("primaryPath", e.target.value)
                  }
                  placeholder="e.g., /product"
                />
              </div>

              <div className="form-group">
                <label htmlFor="secondaryLabel">Secondary Button Label</label>
                <input
                  id="secondaryLabel"
                  type="text"
                  value={banner.secondaryLabel}
                  onChange={(e) =>
                    handleInputChange("secondaryLabel", e.target.value)
                  }
                  placeholder="e.g., Learn More (optional)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="secondaryPath">Secondary Button Path</label>
                <input
                  id="secondaryPath"
                  type="text"
                  value={banner.secondaryPath}
                  onChange={(e) =>
                    handleInputChange("secondaryPath", e.target.value)
                  }
                  placeholder="e.g., /about-us (optional)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="position">Position (Order)</label>
                <input
                  id="position"
                  type="number"
                  value={banner.position}
                  onChange={(e) =>
                    handleInputChange("position", parseInt(e.target.value) || 0)
                  }
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  value={banner.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </>
          ) : null}

          <div className="form-actions">
            <button
              type="button"
              className="admin-secondary-button"
              onClick={() => onNavigate("/admin/banners")}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-primary-button"
              disabled={saving || loading}
            >
              {saving ? "Saving..." : isNew ? "Create Banner" : "Save Banner"}
            </button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
