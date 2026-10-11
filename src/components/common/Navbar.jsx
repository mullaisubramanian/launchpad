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
      { label: "Services", hash: "#/services", key: "services" },
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 17L9 12L13 15L19 7"
                stroke="#ffffff"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 7H19V12"
                stroke="#f59e0b"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="logo-text">{BRAND}</span>
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
