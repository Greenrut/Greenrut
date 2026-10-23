import { useState } from "react";
import { requestJson } from "../../lib/api.js";
import { saveAdminAuth } from "../../lib/auth.js";

export function AdminLoginPage({ onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      const result = await requestJson("/admin/auth/login", {
        method: "POST",
        body: { email, password },
      });

      saveAdminAuth({
        token: result.token,
        user: result.user,
      });

      setMessage("Admin access verified. Redirecting...");
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
            <h1>Sign In to Admin Hub</h1>
            <p>
              Enter your verified administrator credentials to access store operations.
            </p>
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
                <button
                  type="button"
                  className="admin-login-forgot-link"
                  onClick={goToForgotPassword}
                >
                  Forgot password?
                </button>
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

            <button
              type="submit"
              className="admin-login-submit-btn"
              disabled={submitting}
            >
              {submitting ? "Verifying..." : "Access Dashboard →"}
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
