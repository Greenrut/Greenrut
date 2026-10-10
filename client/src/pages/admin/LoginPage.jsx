import { useState } from "react";
import { requestJson } from "../../lib/api.js";
import { clearAdminAuth, saveAdminAuth } from "../../lib/auth.js";

export function AdminLoginPage({ onNavigate }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupKey, setSignupKey] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const goToForgotPassword = () => {
    onNavigate("/forgot-password?role=admin");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setSubmitting(true);

    try {
      const endpoint =
        mode === "login" ? "/admin/auth/login" : "/admin/auth/signup";
      const body =
        mode === "login"
          ? { email, password }
          : { name, email, password, signupKey };

      const result = await requestJson(endpoint, {
        method: "POST",
        body,
      });

      saveAdminAuth({
        token: result.token,
        user: result.user,
      });

      setMessage(
        mode === "login"
          ? "Admin access verified. Redirecting..."
          : "Admin account provisioned successfully."
      );
      setTimeout(() => {
        onNavigate("/admin");
      }, 500);
    } catch (submitError) {
      setError(
        submitError.message || "Invalid credentials or unauthorized access."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        {/* Brand & Title */}
        <div className="admin-login-card">
          <div className="admin-login-card__header">
            <button
              type="button"
              className="admin-login-card__logo-btn"
              onClick={() => onNavigate("/")}
              title="Return to Greenrut Storefront"
            >
              <img src="/logo.png" alt="Greenrut" />
            </button>
            <div className="admin-login-card__badge">
              <span className="admin-login-card__dot" />
              <span>CONTROL CONSOLE</span>
            </div>
            <h1>{mode === "login" ? "Sign In to Admin Hub" : "Create Admin Profile"}</h1>
            <p>
              {mode === "login"
                ? "Enter your verified administrator credentials to access store operations."
                : "Provision an executive administrative profile for catalog and CMS management."}
            </p>
          </div>

          {/* Switcher */}
          <div className="admin-login-card__tabs">
            <button
              type="button"
              className={`admin-login-tab ${mode === "login" ? "is-active" : ""}`}
              onClick={() => {
                setMode("login");
                setError("");
                setMessage("");
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`admin-login-tab ${mode === "signup" ? "is-active" : ""}`}
              onClick={() => {
                setMode("signup");
                setError("");
                setMessage("");
              }}
            >
              New Admin Setup
            </button>
          </div>

          {/* Alerts */}
          {error && (
            <div className="admin-login-alert admin-login-alert--danger">
              <span>✕ {error}</span>
            </div>
          )}
          {message && (
            <div className="admin-login-alert admin-login-alert--success">
              <span>✓ {message}</span>
            </div>
          )}

          {/* Form */}
          <form className="admin-login-form" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <div className="admin-login-field">
                <label>Full Name</label>
                <div className="admin-login-input-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Mfoniso"
                    required
                  />
                </div>
              </div>
            )}

            <div className="admin-login-field">
              <label>Administrator Email</label>
              <div className="admin-login-input-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@greenrut.com"
                  required
                />
              </div>
            </div>

            <div className="admin-login-field">
              <div className="admin-login-field__label-row">
                <label>Password</label>
                {mode === "login" && (
                  <button
                    type="button"
                    className="admin-login-forgot-link"
                    onClick={goToForgotPassword}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="admin-login-input-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            {mode === "signup" && (
              <div className="admin-login-field">
                <label>Admin Security Key</label>
                <div className="admin-login-input-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M21 2l-2 2m-1.5 1.5L16 7l-1.5 1.5L12 11l-4 4-2-2-4 4 3 3 4-4 2 2 4-4 2.5-2.5L18 8l1.5-1.5L21 2z" />
                  </svg>
                  <input
                    type="password"
                    value={signupKey}
                    onChange={(e) => setSignupKey(e.target.value)}
                    placeholder="Enter system deployment key"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="admin-login-submit-btn"
              disabled={submitting}
            >
              {submitting
                ? "Verifying..."
                : mode === "login"
                  ? "Access Dashboard →"
                  : "Create Administrator Account"}
            </button>
          </form>

          {/* Bottom Link */}
          <div className="admin-login-card__footer">
            <button
              type="button"
              className="admin-login-back-store-btn"
              onClick={() => onNavigate("/")}
            >
              ← Back to Greenrut Store
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
