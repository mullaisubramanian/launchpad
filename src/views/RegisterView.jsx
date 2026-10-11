import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Store } from "../services/storage";
import { api } from "../services/api";
import { supabaseSyncProfile } from "../services/supabase";
import { generateId } from "../utils/formatters";

export const RegisterView = ({ initialRole = "startup" }) => {
  const { data, setData, setCurrentUser, showToast, navigate } = useApp();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    pass: "",
    city: "",
    state: "",
    pincode: "",
    role: ["startup", "pilot", "grant", "investor"].includes(initialRole.toLowerCase())
      ? initialRole.toLowerCase()
      : "startup"
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, phone, email, pass, city, state, pincode, role } = formData;

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedCity = city.trim();
    const trimmedState = state.trim();
    const trimmedPincode = pincode.trim();

    if (
      !trimmedName ||
      !trimmedEmail ||
      !pass ||
      !trimmedPhone ||
      !trimmedCity ||
      !trimmedState ||
      !trimmedPincode
    ) {
      showToast("Please fill out all required fields", "bad");
      return;
    }

    const currentStore = Store.get();
    const exists = currentStore.users.find(
      (u) => u.email.toLowerCase() === trimmedEmail
    );
    if (exists) {
      showToast("This email is already registered. Please login.", "bad");
      return;
    }

    const newUser = {
      id: generateId("u"),
      role,
      name: trimmedName,
      phone: trimmedPhone,
      email: trimmedEmail,
      pass,
      city: trimmedCity,
      state: trimmedState,
      pincode: trimmedPincode,
      org: role === "startup" ? `${trimmedName}'s Venture` : `${trimmedName}'s Org`,
      created: new Date().toISOString()
    };

    // Save to local store immediately
    currentStore.users.push(newUser);
    Store.save(currentStore);
    Store.setSessionUser(newUser);
    setData({ ...currentStore });
    setCurrentUser(newUser);

    // Also register on backend if server is active
    api.register(newUser).catch((err) => console.warn("Backend register sync:", err));

    // Direct Supabase sync
    supabaseSyncProfile(newUser).catch((err) => console.warn("Supabase register sync:", err));

    showToast("Registration successful", "ok");
    if (newUser.role === "startup") {
      navigate("#/apply");
    } else {
      navigate("#/applicants");
    }
  };

  return (
    <div className="auth-page">
      <div className="container" style={{ display: "flex", justifyContent: "center" }}>
        <div className="auth-card">
          {/* Left: Form */}
          <div className="auth-card-left">
            <h2>Register</h2>
            <form id="register-form" onSubmit={handleSubmit}>
              {/* Name */}
              <div className="auth-input-wrap">
                <input
                  type="text"
                  className="auth-input"
                  id="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <span className="auth-input-icon" title="ID Card">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                    <circle cx="9" cy="10" r="2"></circle>
                    <line x1="15" y1="8" x2="17" y2="8"></line>
                    <line x1="15" y1="12" x2="17" y2="12"></line>
                    <line x1="7" y1="16" x2="17" y2="16"></line>
                  </svg>
                </span>
              </div>

              {/* Phone */}
              <div className="auth-input-wrap">
                <input
                  type="tel"
                  className="auth-input"
                  id="phone"
                  placeholder="Phone (10-14 digits)"
                  pattern="[0-9]{10,14}"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <span className="auth-input-icon" title="Phone">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </span>
              </div>

              {/* Email */}
              <div className="auth-input-wrap">
                <input
                  type="email"
                  className="auth-input"
                  id="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
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
                  id="pass"
                  placeholder="Password (min 6 chars)"
                  minLength="6"
                  value={formData.pass}
                  onChange={handleChange}
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

              {/* City */}
              <div className="auth-input-wrap">
                <input
                  type="text"
                  className="auth-input"
                  id="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
                <span className="auth-input-icon" title="Navigation">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                  </svg>
                </span>
              </div>

              {/* State */}
              <div className="auth-input-wrap">
                <input
                  type="text"
                  className="auth-input"
                  id="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
                <span className="auth-input-icon" title="Map Pin">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </span>
              </div>

              {/* Pincode */}
              <div className="auth-input-wrap">
                <input
                  type="text"
                  className="auth-input"
                  id="pincode"
                  placeholder="Pincode (6 digits)"
                  pattern="[0-9]{6}"
                  maxLength="6"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                />
                <span className="auth-input-icon" title="Hash">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="4" y1="9" x2="20" y2="9"></line>
                    <line x1="4" y1="15" x2="20" y2="15"></line>
                    <line x1="10" y1="3" x2="8" y2="21"></line>
                    <line x1="16" y1="3" x2="14" y2="21"></line>
                  </svg>
                </span>
              </div>

              {/* Role Select */}
              <div className="auth-input-wrap">
                <select
                  className="auth-input"
                  id="role"
                  value={formData.role}
                  onChange={handleChange}
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
                Register
              </button>

              <div
                style={{
                  textAlign: "center",
                  marginTop: "20px",
                  fontSize: "14px",
                  color: "#64748b"
                }}
              >
                Already have an account?{" "}
                <a href="#/login" style={{ color: "var(--pri)", fontWeight: 700 }}>
                  Login
                </a>
              </div>
            </form>
          </div>

          {/* Right Panel */}
          <div className="auth-card-right">
            <h3>Create an account</h3>
            <p className="lead">Believe you can, and you're halfway there.</p>
            <div className="sparkles">✦ ✦ ✦</div>

            <svg
              width="140"
              height="140"
              viewBox="0 0 140 140"
              fill="none"
              style={{ marginTop: "10px" }}
            >
              <circle
                cx="70"
                cy="70"
                r="62"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="4"
                strokeDasharray="6 6"
              />
              <circle cx="70" cy="70" r="50" fill="#ccfbf1" />
              <path
                d="M52 70L65 83L90 55"
                stroke="#0d9488"
                strokeWidth="9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="28" cy="40" r="5" fill="#f59e0b" />
              <circle cx="112" cy="98" r="6" fill="#f59e0b" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
