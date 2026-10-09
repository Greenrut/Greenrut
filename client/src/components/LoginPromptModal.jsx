import { useState, useEffect } from "react";
import { requestJson } from "../lib/api.js";
import { saveUserAuth } from "../lib/auth.js";

export function LoginPromptModal({
  isOpen,
  onClose,
  onSuccess,
  pathname = "/",
  onNavigate,
}) {
  const [tab, setTab] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Close when user presses Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isResearch = pathname.startsWith("/research");
  const isLibrary = pathname.startsWith("/library");

  const badgeText = isResearch
    ? "RESEARCH PORTAL"
    : isLibrary
    ? "HERBAL LIBRARY"
    : "MEMBER ACCESS";

  const modalTitle = isResearch
    ? "Access Scientific Research"
    : isLibrary
    ? "Explore Our Herbal Library"
    : "Welcome to Greenrut";

  const modalSubtitle = isResearch
    ? "Sign in to read in-depth scientific monographs, clinical trials, and bioactive plant analyses. You can also exit to preview."
    : isLibrary
    ? "Sign in to unlock detailed herbal remedies, therapeutic profiles, and traditional preparation methods. You can exit anytime."
    : "Sign in or create an account for exclusive botanical wellness insights, easy order tracking, and member benefits.";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);

    try {
      const endpoint = tab === "Login" ? "/auth/login" : "/auth/signup";
      const body =
        tab === "Login" ? { email, password } : { name, email, password };

      const result = await requestJson(endpoint, {
        method: "POST",
        body,
      });

      saveUserAuth({
        token: result.token,
        user: result.user,
      });

      setMessage(
        tab === "Login" ? "Signed in successfully!" : "Account created!"
      );

      if (onSuccess) {
        onSuccess(result);
      } else {
        onClose();
      }
    } catch (err) {
      setError(err.message || "Failed to authenticate. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    onClose();
    if (onNavigate) {
      onNavigate("/forgot-password?role=user");
    } else {
      window.location.href = "/forgot-password?role=user";
    }
  };

  return (
    <div
      className="login-prompt-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-prompt-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="login-prompt-card">
        {/* Close / Exit button */}
        <button
          type="button"
          className="login-prompt-close"
          onClick={onClose}
          aria-label="Exit prompt and browse"
          title="Exit and continue browsing"
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            stroke="currentColor"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Header Header Brand Icon */}
        <div className="login-prompt-header">
          <div className="login-prompt-badge">
            <span className="login-prompt-badge-dot" />
            <span>{badgeText}</span>
          </div>
          <h2 id="login-prompt-title" className="login-prompt-title">
            {modalTitle}
          </h2>
          <p className="login-prompt-subtitle">{modalSubtitle}</p>
        </div>

        {/* Tab switchers: Login vs Register */}
        <div className="login-prompt-tabs">
          <button
            type="button"
            className={`login-prompt-tab ${
              tab === "Login" ? "is-active" : ""
            }`}
            onClick={() => {
              setTab("Login");
              setError("");
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`login-prompt-tab ${
              tab === "Register" ? "is-active" : ""
            }`}
            onClick={() => {
              setTab("Register");
              setError("");
            }}
          >
            Create Account
          </button>
        </div>

        {/* Login / Register Form */}
        <form className="login-prompt-form" onSubmit={handleSubmit}>
          {tab === "Register" && (
            <div className="login-prompt-field">
              <label htmlFor="prompt-name">Full Name</label>
              <input
                id="prompt-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alexander John"
                required
              />
            </div>
          )}

          <div className="login-prompt-field">
            <label htmlFor="prompt-email">Email Address</label>
            <input
              id="prompt-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. alex@example.com"
              required
            />
          </div>

          <div className="login-prompt-field">
            <div className="login-prompt-field-header">
              <label htmlFor="prompt-password">Password</label>
              {tab === "Login" && (
                <button
                  type="button"
                  className="login-prompt-link"
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </button>
              )}
            </div>
            <input
              id="prompt-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="login-prompt-error">{error}</p>}
          {message && <p className="login-prompt-success">{message}</p>}

          <button
            type="submit"
            className="login-prompt-submit"
            disabled={submitting}
          >
            {submitting
              ? "Please wait..."
              : tab === "Login"
              ? "SIGN IN"
              : "CREATE ACCOUNT"}
          </button>

          {/* Quick Exit Action */}
          <div className="login-prompt-exit-action">
            <button
              type="button"
              className="login-prompt-guest-btn"
              onClick={onClose}
            >
              Continue Browsing as Guest &rarr;
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
