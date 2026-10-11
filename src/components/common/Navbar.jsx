import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { BRAND } from "../../data/constants";

export const Navbar = () => {
  const { currentUser, currentRoute, navigate, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogoClick = () => {
    if (currentUser) {
      if (currentUser.role === "startup") {
        navigate("#/apply");
      } else {
        navigate("#/applicants");
      }
    } else {
      navigate("#/home");
    }
    setMobileMenuOpen(false);
  };

  // Determine active key from currentRoute
  const routeRoot = currentRoute.replace(/^#\/?/, "").split("/")[0] || "home";

  let links = [];
  if (!currentUser) {
    links = [
      { label: "Home", hash: "#/home", key: "home" },
      { label: "About", hash: "#/about", key: "about" },
      { label: "Register", hash: "#/register", key: "register" },
      { label: "Login", hash: "#/login", key: "login" }
    ];
  } else if (currentUser.role === "investor") {
    links = [
      { label: "Home", hash: "#/home", key: "home" },
      { label: "Applicants List", hash: "#/applicants", key: "applicants" },
      { label: "Add Investment", hash: "#/add", key: "add" },
      { label: "Profile", hash: "#/profile", key: "profile" },
      { label: "Logout", action: logout, key: "logout" }
    ];
  } else if (currentUser.role === "pilot") {
    links = [
      { label: "Home", hash: "#/home", key: "home" },
      { label: "Applicants List", hash: "#/applicants", key: "applicants" },
      { label: "Add Pilots", hash: "#/add", key: "add" },
      { label: "Profile", hash: "#/profile", key: "profile" },
      { label: "Logout", action: logout, key: "logout" }
    ];
  } else if (currentUser.role === "grant") {
    links = [
      { label: "Home", hash: "#/home", key: "home" },
      { label: "Applicants List", hash: "#/applicants", key: "applicants" },
      { label: "Add Grant", hash: "#/add", key: "add" },
      { label: "Profile", hash: "#/profile", key: "profile" },
      { label: "Logout", action: logout, key: "logout" }
    ];
  } else if (currentUser.role === "startup") {
    links = [
      { label: "Home", hash: "#/home", key: "home" },
      { label: "Status", hash: "#/status", key: "status" },
      { label: "Fund Application", hash: "#/apply", key: "apply" },
      { label: "Profile", hash: "#/profile", key: "profile" },
      { label: "Logout", action: logout, key: "logout" }
    ];
  }

  const handleLinkClick = (link) => {
    setMobileMenuOpen(false);
    if (link.action) {
      link.action();
    } else if (link.hash) {
      if (link.hash === "#/about" || link.hash === "#/services") {
        if (!window.location.hash.startsWith("#/home") && window.location.hash !== "") {
          navigate("#/home");
          setTimeout(() => {
            const el = document.getElementById(link.key);
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }, 100);
        } else {
          const el = document.getElementById(link.key);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        navigate(link.hash);
      }
    }
  };

  return (
    <header id="navbar">
      <div className="container nav-inner">
        <div
          className="nav-logo"
          id="logo-btn"
          title={`${BRAND} Home`}
          onClick={handleLogoClick}
        >
          <div className="logo-mark">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" stroke="#ffffff" strokeWidth="2.5" />
              <text x="20" y="27" fontFamily="Poppins, sans-serif" fontWeight="800" fontSize="22" fill="#ffffff" textAnchor="middle">1</text>
            </svg>
          </div>
          <span className="logo-text">{BRAND}</span>
          {currentUser && (
            <span
              className="navbar-role-badge"
              style={{
                marginLeft: "8px",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "capitalize",
                background: "rgba(255, 255, 255, 0.2)",
                color: "#ffffff",
                padding: "3px 9px",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.4)",
                letterSpacing: "0.3px",
                lineHeight: 1
              }}
            >
              {currentUser.role === "investor"
                ? "Investor"
                : currentUser.role === "pilot"
                ? "Pilot"
                : currentUser.role === "grant"
                ? "Grant"
                : "Startup"}
            </span>
          )}
        </div>

        {/* Desktop Links */}
        <ul className="nav-links" id="nav-links-desktop">
          {links.map((link) => {
            const isActive = routeRoot === link.key;
            return (
              <li
                key={link.key}
                className={`nav-link ${isActive ? "active" : ""}`}
                onClick={() => handleLinkClick(link)}
              >
                {link.label}
              </li>
            );
          })}
        </ul>

        {/* Hamburger Mobile Toggle */}
        <button
          className="hamburger-btn"
          id="hamburger-toggle"
          aria-label="Toggle Navigation"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`mobile-dropdown ${mobileMenuOpen ? "open" : ""}`}
        id="mobile-dropdown-menu"
      >
        {links.map((link) => {
          const isActive = routeRoot === link.key;
          return (
            <div
              key={link.key}
              className={`nav-link ${isActive ? "active" : ""}`}
              onClick={() => handleLinkClick(link)}
            >
              {link.label}
            </div>
          );
        })}
      </div>
    </header>
  );
};
