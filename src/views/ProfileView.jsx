import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Store } from "../services/storage";
import { formatIndianDate } from "../utils/formatters";

export const ProfileView = () => {
  const { data, setData, currentUser, setCurrentUser, logout, showToast, refreshData, navigate } =
    useApp();

  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [newPass, setNewPass] = useState("");

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setOrg(currentUser.org || "");
      setPhone(currentUser.phone || "");
      setCity(currentUser.city || "");
      setState(currentUser.state || "");
      setPincode(currentUser.pincode || "");
    }
  }, [currentUser]);

  if (!currentUser) return null;

  const role = currentUser.role;
  const initials = (currentUser.name || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Stats line
  let statLine = "";
  if (role === "startup") {
    const count = data.apps.filter((a) => a.userId === currentUser.id).length;
    statLine = `${count} applications submitted`;
  } else {
    const mySchemes = data.schemes.filter((s) => s.ownerId === currentUser.id);
    const schemeIds = new Set(mySchemes.map((s) => s.id));
    const appCount = data.apps.filter((a) => schemeIds.has(a.schemeId)).length;
    statLine = `${mySchemes.length} schemes published • ${appCount} applicants`;
  }

  const orgLabel =
    role === "startup"
      ? "Startup name"
      : role === "grant"
      ? "Government or department name"
      : "Company name";

  const handleSave = (e) => {
    e.preventDefault();
    const currentStore = Store.get();
    const user = currentStore.users.find((u) => u.id === currentUser.id);
    if (!user) return;

    user.name = name.trim();
    user.org = org.trim();
    user.phone = phone.trim();
    user.city = city.trim();
    user.state = state.trim();
    user.pincode = pincode.trim();

    if (newPass && newPass.trim().length >= 6) {
      user.pass = newPass.trim();
    }

    Store.save(currentStore);
    setData(currentStore);
    setCurrentUser({ ...user });
    showToast("Profile updated successfully", "ok");
    setNewPass("");
  };

  const handleResetDemoData = () => {
    if (
      window.confirm(
        "Are you sure you want to restore the platform seed data? All custom registrations and applications will be reset."
      )
    ) {
      const initial = Store.resetSeedData();
      setData(initial);
      showToast("Platform restored to default seed data", "warn");
      refreshData();
      const updatedUser = Store.get().users.find((u) => u.id === currentUser.id);
      if (updatedUser) {
        setCurrentUser(updatedUser);
      } else {
        navigate("#/home");
      }
    }
  };

  return (
    <div className="container" style={{ paddingTop: "20px" }}>
      <h1 className="page-title">Profile</h1>

      <div className="white-panel" style={{ maxWidth: "860px", margin: "0 auto 40px" }}>
        {/* Profile Header Card */}
        <div className="profile-header-card">
          <div className="profile-avatar">{initials}</div>
          <div className="profile-info">
            <h3>{currentUser.name}</h3>
            <div className="profile-role-date">
              {currentUser.role} &bull; Member since{" "}
              {formatIndianDate(currentUser.created)}
            </div>
            <div className="profile-stats-pill">{statLine}</div>
          </div>
        </div>

        {/* Editable Form */}
        <form id="profile-form" onSubmit={handleSave}>
          <div className="profile-grid-form">
            <div className="form-group">
              <label htmlFor="prof-name">Name</label>
              <input
                type="text"
                id="prof-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="prof-org">{orgLabel}</label>
              <input
                type="text"
                id="prof-org"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="prof-email">Email (read-only)</label>
              <input
                type="email"
                id="prof-email"
                value={currentUser.email}
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="prof-phone">Phone</label>
              <input
                type="tel"
                id="prof-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                pattern="[0-9]{10,14}"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="prof-city">City</label>
              <input
                type="text"
                id="prof-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="prof-state">State</label>
              <input
                type="text"
                id="prof-state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="prof-pincode">Pincode</label>
              <input
                type="text"
                id="prof-pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                pattern="[0-9]{6}"
                maxLength="6"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="prof-role">Role (read-only)</label>
              <input
                type="text"
                id="prof-role"
                value={currentUser.role.toUpperCase()}
                disabled
              />
            </div>

            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="prof-newpass">New password (optional)</label>
              <input
                type="password"
                id="prof-newpass"
                placeholder="Leave blank to keep existing password"
                minLength="6"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "14px",
              marginTop: "28px",
              paddingTop: "20px",
              borderTop: "1.5px solid var(--line)"
            }}
          >
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button type="submit" className="btn">
                Save changes
              </button>
              <button type="button" className="btn btn-ghost" onClick={logout}>
                Logout
              </button>
            </div>

            <button
              type="button"
              className="btn btn-sm btn-bad"
              onClick={handleResetDemoData}
            >
              Reset demo data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
