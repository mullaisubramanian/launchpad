import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Store } from "../services/storage";

export const LoginView = () => {
  const { login, showToast, navigate, openModal, closeModal } = useApp();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [role, setRole] = useState("startup");
  const [showPassword, setShowPassword] = useState(false);

  const redirectAfterLogin = (user) => {
    if (user.role === "startup") {
      navigate("#/apply");
    } else {
      const data = Store.get();
      const schemes = data.schemes.filter((s) => s.ownerId === user.id);
      if (schemes.length === 0) {
        navigate("#/add");
      } else {
        navigate("#/applicants");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, pass, role);
    if (!result.success) {
      showToast(result.message, "bad");
      return;
    }
    const user = result.user;
    showToast(`Welcome back, ${user.name}!`, "ok");
    redirectAfterLogin(user);
  };

  const openForgotPasswordModal = () => {
    openModal(<ForgotPasswordModal onDone={closeModal} />);
  };

  return (
    <div className="auth-page">
      <div className="container" style={{ display: "flex", justifyContent: "center" }}>
        <div className="auth-card">
          {/* Left: Login Form */}
          <div className="auth-card-left">
            <h2>Login</h2>
            <form id="login-form" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="auth-input-wrap">
                <input
                  type="email"
                  className="auth-input"
                  id="login-email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <span className="auth-input-icon" title="Envelope">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </span>
              </div>

              {/* Password */}
              <div className="auth-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  className="auth-input"
                  id="login-pass"
                  placeholder="Password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  required
                />
                <span
                  className="auth-input-icon"
                  onClick={() => setShowPassword(!showPassword)}
                  title="Toggle Show/Hide"
                >
                  {showPassword ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </span>
              </div>

              {/* Role Select - Login as */}
              <div className="auth-input-wrap">
                <select
                  className="auth-input"
                  id="login-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  style={{ cursor: "pointer" }}
                >
                  <option value="startup">Startup</option>
                  <option value="pilot">Pilot</option>
                  <option value="grant">Grant</option>
                  <option value="investor">Investor</option>
                </select>
              </div>

              <button type="submit" className="auth-reg-btn">
                Login
              </button>

              <div
                style={{
                  textAlign: "center",
                  marginTop: "20px",
                  fontSize: "14px",
                  color: "#64748b",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px"
                }}
              >
                <div>
                  New here?{" "}
                  <a href="#/register" style={{ color: "var(--pri)", fontWeight: 700 }}>
                    Create an account
                  </a>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={openForgotPasswordModal}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--muted)",
                      fontSize: "13.5px",
                      textDecoration: "underline",
                      cursor: "pointer"
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Right Panel */}
          <div className="auth-card-right">
            <h3>Welcome back</h3>
            <p className="lead">Track every pilot, grant and investment in one place.</p>
            <div className="sparkles" style={{ color: "#ffc107" }}>✦ ✦</div>

            {/* Thumbs-up illustration */}
            <svg
              width="150"
              height="150"
              viewBox="0 0 160 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginTop: "16px" }}
            >
              <rect x="25" y="85" width="28" height="55" rx="6" fill="#9ec5fe" />
              <rect x="22" y="80" width="34" height="12" rx="4" fill="#6ea8fe" />
              <path d="M53 92H115C124 92 131 99 130 108L126 138C125 145 119 150 112 150H53V92Z" fill="#cfe2ff" stroke="#9ec5fe" strokeWidth="2.5" />
              <line x1="53" y1="106" x2="120" y2="106" stroke="#9ec5fe" strokeWidth="2" strokeLinecap="round" />
              <line x1="53" y1="120" x2="118" y2="120" stroke="#9ec5fe" strokeWidth="2" strokeLinecap="round" />
              <line x1="53" y1="134" x2="114" y2="134" stroke="#9ec5fe" strokeWidth="2" strokeLinecap="round" />
              <path d="M53 92L78 45C83 36 94 36 98 44C100 48 100 54 97 59L88 80H115" stroke="#9ec5fe" strokeWidth="2.5" fill="#cfe2ff" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

const ForgotPasswordModal = ({ onDone }) => {
  const [emailInput, setEmailInput] = useState("");
  const [result, setResult] = useState(null);

  const handleCheck = () => {
    const trimmed = emailInput.trim().toLowerCase();
    if (!trimmed) {
      setResult({ status: "error", message: "Please enter an email address." });
      return;
    }
    const data = Store.get();
    const user = data.users.find((u) => u.email.toLowerCase() === trimmed);
    if (user) {
      setResult({
        status: "success",
        user
      });
    } else {
      setResult({
        status: "error",
        message: "No account found with this email."
      });
    }
  };

  return (
    <div>
      <h3
        style={{
          fontSize: "22px",
          fontWeight: 700,
          color: "var(--pri)",
          marginBottom: "12px"
        }}
      >
        Forgot Password
      </h3>
      <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "16px" }}>
        Enter your registered email address to reveal your password hint.
      </p>
      <div className="form-group">
        <input
          type="email"
          placeholder="Enter your email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          style={{ marginBottom: "12px" }}
        />
        <button className="btn" type="button" onClick={handleCheck}>
          Find Password
        </button>
      </div>
      {result && (
        <div style={{ marginTop: "12px", fontSize: "14px" }}>
          {result.status === "success" ? (
            <div
              style={{
                background: "var(--soft2)",
                border: "1px solid var(--soft)",
                padding: "12px",
                borderRadius: "6px",
                color: "var(--ok)"
              }}
            >
              Found account for <strong>{result.user.name}</strong>.<br />
              Password is: <strong>{result.user.pass}</strong>
            </div>
          ) : (
            <span style={{ color: "var(--bad)" }}>{result.message}</span>
          )}
        </div>
      )}
    </div>
  );
};
