import { useEffect, useState } from "react";
import { adminRequest } from "../../lib/adminApi.js";
import {
  AdminCard,
  AdminPageHeader,
  AdminPill,
  AdminShell,
  AdminIcon,
} from "./shared.jsx";

export function AdminSettingsPage({ pathname, onNavigate }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        setLoading(true);
        const response = await adminRequest("/admin/auth/me");
        if (!cancelled) setProfile(response.data || response.user || null);
      } catch (requestError) {
        if (!cancelled)
          setError(requestError.message || "Failed to load admin profile");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  const updatePasswordField = (field) => (event) => {
    setPasswordForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setPasswordMessage("");
    setPasswordError("");

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    setSavingPassword(true);
    try {
      await adminRequest("/auth/password", {
        method: "PATCH",
        body: {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
      });
      setPasswordMessage("Password updated successfully.");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (requestError) {
      setPasswordError(
        requestError.message || "Failed to update password. Verify current password."
      );
    } finally {
      setSavingPassword(false);
    }
  };

  const initialLetter = (profile?.name?.[0] || profile?.email?.[0] || "A").toUpperCase();

  return (
    <AdminShell pathname={pathname} onNavigate={onNavigate}>
      <AdminPageHeader
        title="Admin Profile & Settings"
        subtitle="Manage executive account credentials, role permissions, and platform security."
      />

      {error && (
        <div className="admin-alert admin-alert--danger">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")}>✕</button>
        </div>
      )}

      <div className="admin-form-layout">
        <div className="admin-form-layout__main">
          {/* Profile Card */}
          <AdminCard
            title="Administrator Identity"
            subtitle="Your verified profile details on Greenrut operations"
          >
            {loading ? (
              <div className="admin-card-loading">Loading administrator profile...</div>
            ) : profile ? (
              <div className="admin-profile-view">
                <div className="admin-profile-view__badge">
                  <div className="admin-profile-view__avatar">
                    {initialLetter}
                  </div>
                  <div>
                    <h3>{profile.name || "Administrator"}</h3>
                    <p>{profile.email}</p>
                    <div style={{ marginTop: "6px" }}>
                      <AdminPill tone="purple">
                        {profile.role || "Executive Administrator"}
                      </AdminPill>
                    </div>
                  </div>
                </div>

                <div className="admin-form-grid" style={{ marginTop: "24px" }}>
                  <label>
                    Display Name
                    <input type="text" value={profile.name || ""} readOnly />
                  </label>
                  <label>
                    Account Email
                    <input type="email" value={profile.email || ""} readOnly />
                  </label>
                  <label className="admin-form-grid__full">
                    Authorization Role
                    <input
                      type="text"
                      value={profile.role || "Administrator"}
                      readOnly
                    />
                  </label>
                </div>
              </div>
            ) : null}
          </AdminCard>

          {/* Change Password Card */}
          <AdminCard
            title="Security & Password"
            subtitle="Update the password used to authenticate into this portal."
          >
            <form className="admin-form-grid" onSubmit={handleChangePassword}>
              <label className="admin-form-grid__full">
                Current Password *
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={updatePasswordField("currentPassword")}
                  placeholder="Enter your current password"
                  required
                />
              </label>

              <label>
                New Password *
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={updatePasswordField("newPassword")}
                  placeholder="At least 6 characters"
                  required
                />
              </label>

              <label>
                Confirm New Password *
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={updatePasswordField("confirmPassword")}
                  placeholder="Repeat new password"
                  required
                />
              </label>

              <div className="admin-form-grid__full">
                {passwordMessage && (
                  <div className="admin-alert admin-alert--success">
                    <span>✓ {passwordMessage}</span>
                  </div>
                )}
                {passwordError && (
                  <div className="admin-alert admin-alert--danger">
                    <span>✕ {passwordError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="admin-primary-button"
                  disabled={savingPassword}
                >
                  {savingPassword ? "Updating..." : "Update Security Password"}
                </button>
              </div>
            </form>
          </AdminCard>
        </div>

        {/* Side Info */}
        <aside className="admin-form-layout__side">
          <AdminCard title="System Environment" subtitle="Platform specs">
            <div className="admin-system-health">
              <div className="admin-health-row">
                <div className="admin-health-row__label">
                  <span className="admin-health-dot admin-health-dot--online" />
                  <span>Access Level</span>
                </div>
                <strong className="admin-health-row__val">Full Root Admin</strong>
              </div>
              <div className="admin-health-row">
                <div className="admin-health-row__label">
                  <span className="admin-health-dot admin-health-dot--online" />
                  <span>Session Security</span>
                </div>
                <strong className="admin-health-row__val">JWT Bearer</strong>
              </div>
              <div className="admin-health-row">
                <div className="admin-health-row__label">
                  <span className="admin-health-dot admin-health-dot--online" />
                  <span>SSL Protocol</span>
                </div>
                <strong className="admin-health-row__val">TLS 1.3 Active</strong>
              </div>
            </div>
          </AdminCard>
        </aside>
      </div>
    </AdminShell>
  );
}
