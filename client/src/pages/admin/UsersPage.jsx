import { useEffect, useState, useMemo } from "react";
import { adminRequest } from "../../lib/adminApi.js";
import {
  AdminCard,
  AdminPageHeader,
  AdminPill,
  AdminShell,
  AdminIcon,
} from "./shared.jsx";

export function AdminUsersPage({ pathname, onNavigate }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Administrator",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "Administrator",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await adminRequest("/admin/users");
      setUsers(response.data || []);
    } catch (requestError) {
      setError(requestError.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const startEditUser = (user) => {
    setEditingId(user.id);
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "Administrator",
    });
  };

  const cancelEditUser = () => {
    setEditingId(null);
  };

  const updateEditField = (field) => (event) => {
    setEditForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSaveUser = async (id) => {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await adminRequest(`/admin/users/${id}`, {
        method: "PUT",
        body: editForm,
      });
      setMessage("User permissions updated successfully.");
      setEditingId(null);
      await loadUsers();
    } catch (requestError) {
      setError(requestError.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete user "${name || "this user"}"?`))
      return;
    setMessage("");
    setError("");
    try {
      await adminRequest(`/admin/users/${id}`, { method: "DELETE" });
      setMessage("User deleted successfully.");
      await loadUsers();
    } catch (requestError) {
      setError(requestError.message || "Failed to delete user");
    }
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();
    if (!form.email || !form.password) {
      setError("Email and password are required.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      await adminRequest("/admin/users", {
        method: "POST",
        body: form,
      });
      setMessage("User account provisioned successfully.");
      setForm({ name: "", email: "", password: "", role: "Administrator" });
      setCreating(false);
      await loadUsers();
    } catch (requestError) {
      setError(requestError.message || "Failed to create user");
    } finally {
      setSaving(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        !searchQuery ||
        (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRole =
        roleFilter === "ALL" ||
        (u.role && u.role.toLowerCase() === roleFilter.toLowerCase());

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  return (
    <AdminShell pathname={pathname} onNavigate={onNavigate}>
      <AdminPageHeader
        title="Users & Administrative Staff"
        subtitle={`Directory of verified customer accounts and operations personnel (${users.length} registered).`}
        actions={
          <button
            type="button"
            className="admin-primary-button"
            onClick={() => setCreating(!creating)}
          >
            <AdminIcon type="plus" />
            <span>{creating ? "Close Form" : "Add User / Admin"}</span>
          </button>
        }
      />

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

      {/* Create User Drawer / Card */}
      {creating && (
        <AdminCard
          title="Provision New Account"
          subtitle="Create a new administrator or authorized staff profile."
        >
          <form onSubmit={handleCreateUser} className="admin-form-grid">
            <label>
              Full Name
              <input
                value={form.name}
                onChange={updateField("name")}
                type="text"
                placeholder="e.g. Alexander Mfoniso"
                required
              />
            </label>
            <label>
              Email Address *
              <input
                value={form.email}
                onChange={updateField("email")}
                type="email"
                placeholder="staff@greenrut.com"
                required
              />
            </label>
            <label>
              Password *
              <input
                value={form.password}
                onChange={updateField("password")}
                type="password"
                placeholder="Temporary secure password"
                required
              />
            </label>
            <label>
              Role & Permissions
              <select
                value={form.role}
                onChange={updateField("role")}
                className="admin-select"
              >
                <option value="Administrator">Administrator (Full Access)</option>
                <option value="Editor">Editor (Catalog & Content)</option>
                <option value="Author">Author (Self-Care & Blogs)</option>
                <option value="Viewer">Viewer (Read-only)</option>
              </select>
            </label>

            <div className="admin-form-grid__full admin-header-actions-group">
              <button
                type="button"
                className="admin-secondary-button"
                onClick={() => setCreating(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="admin-primary-button"
                disabled={saving}
              >
                {saving ? "Provisioning..." : "Create Account"}
              </button>
            </div>
          </form>
        </AdminCard>
      )}

      {/* Filter Toolbar */}
      <div className="admin-filter-bar">
        <div className="admin-filter-search">
          <AdminIcon type="search" />
          <input
            type="text"
            placeholder="Search users by name or email..."
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
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="admin-select"
          >
            <option value="ALL">All Roles</option>
            <option value="admin">Administrator</option>
            <option value="editor">Editor</option>
            <option value="author">Author</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <AdminCard>
        {loading ? (
          <div className="admin-card-loading">Loading users directory...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="admin-table__empty">No users found matching search.</div>
        ) : (
          <div className="admin-table-container">
            <div className="admin-table">
              <div
                className="admin-table__head"
                style={{ gridTemplateColumns: "2fr 2fr 1.5fr 1fr" }}
              >
                <span>USER IDENTITY</span>
                <span>EMAIL ADDRESS</span>
                <span>ROLE</span>
                <span>ACTIONS</span>
              </div>
              <div className="admin-table__body">
                {filteredUsers.map((user) => {
                  const initial = (
                    user.name?.[0] ||
                    user.email?.[0] ||
                    "U"
                  ).toUpperCase();

                  if (editingId === user.id) {
                    return (
                      <div
                        key={user.id}
                        className="admin-table__row is-editing"
                        style={{ gridTemplateColumns: "2fr 2fr 1.5fr 1fr" }}
                      >
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={updateEditField("name")}
                          placeholder="Full Name"
                        />
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={updateEditField("email")}
                          placeholder="Email"
                        />
                        <select
                          value={editForm.role}
                          onChange={updateEditField("role")}
                          className="admin-select"
                        >
                          <option value="Administrator">Administrator</option>
                          <option value="Editor">Editor</option>
                          <option value="Author">Author</option>
                          <option value="Viewer">Viewer</option>
                        </select>
                        <div className="admin-actions">
                          <button
                            type="button"
                            className="admin-action-btn admin-action-btn--primary"
                            onClick={() => handleSaveUser(user.id)}
                            disabled={saving}
                            title="Save changes"
                          >
                            ✓
                          </button>
                          <button
                            type="button"
                            className="admin-action-btn"
                            onClick={cancelEditUser}
                            title="Cancel"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    );
                  }

                  const isRootAdmin =
                    user.role?.toLowerCase() === "admin" ||
                    user.role?.toLowerCase() === "administrator";

                  return (
                    <div
                      key={user.id || user.email}
                      className="admin-table__row"
                      style={{ gridTemplateColumns: "2fr 2fr 1.5fr 1fr" }}
                    >
                      <div className="admin-table__product">
                        <div className="admin-user-avatar-circle">{initial}</div>
                        <strong>{user.name || "Customer Account"}</strong>
                      </div>
                      <span className="admin-email-text">{user.email}</span>
                      <span>
                        <AdminPill tone={isRootAdmin ? "purple" : "blue"}>
                          {user.role || "Viewer"}
                        </AdminPill>
                      </span>
                      <div className="admin-actions">
                        <button
                          type="button"
                          className="admin-action-btn"
                          title="Edit permissions"
                          onClick={() => startEditUser(user)}
                        >
                          <AdminIcon type="pencil" />
                        </button>
                        <button
                          type="button"
                          className="admin-action-btn admin-action-btn--danger"
                          title="Delete user"
                          onClick={() => handleDeleteUser(user.id, user.name || user.email)}
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
    </AdminShell>
  );
}
