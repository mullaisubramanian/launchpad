import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Store } from "../services/storage";
import { DEPARTMENTS } from "../data/constants";
import { formatIndianDate, formatIndianCurrency } from "../utils/formatters";

export const ApplicantsView = () => {
  const { data, setData, currentUser, showToast, navigate, openModal, closeModal } = useApp();

  const [expandedSchemes, setExpandedSchemes] = useState(new Set());
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Auto-expand last created scheme if stored in sessionStorage
  useEffect(() => {
    const autoExpand = window.sessionStorage.getItem("expanded_scheme_id");
    if (autoExpand) {
      setExpandedSchemes((prev) => new Set(prev).add(autoExpand));
      window.sessionStorage.removeItem("expanded_scheme_id");
    }
  }, []);

  const mySchemes = currentUser
    ? data.schemes.filter((s) => s.ownerId === currentUser.id)
    : [];
  const mySchemeIds = new Set(mySchemes.map((s) => s.id));
  const myApps = data.apps.filter((a) => mySchemeIds.has(a.schemeId));

  // Counts
  const countSchemes = mySchemes.length;
  const countNew = myApps.filter((a) => a.status === "Registered").length;
  const countAccepted = myApps.filter((a) => a.status === "Accepted").length;
  const countRejected = myApps.filter((a) => a.status === "Rejected").length;

  const addBtnText =
    currentUser?.role === "investor"
      ? "+ Add Investment"
      : currentUser?.role === "pilot"
      ? "+ Add Pilots"
      : "+ Add Grant";

  const toggleExpand = (schemeId) => {
    setExpandedSchemes((prev) => {
      const next = new Set(prev);
      if (next.has(schemeId)) next.delete(schemeId);
      else next.add(schemeId);
      return next;
    });
  };

  const updateAppStatus = (appId, newStatus) => {
    const currentStore = Store.get();
    const app = currentStore.apps.find((a) => a.id === appId);
    if (!app) return;
    app.status = newStatus;
    app.updated = new Date().toISOString();
    Store.save(currentStore);
    setData(currentStore);
    showToast(
      `Application status updated to ${newStatus}`,
      newStatus === "Accepted" ? "ok" : newStatus === "Rejected" ? "bad" : "pri"
    );
  };

  const deleteSchemeConfirm = (schemeId) => {
    const scheme = data.schemes.find((s) => s.id === schemeId);
    if (!scheme) return;

    if (
      window.confirm(
        `Are you sure you want to delete "${scheme.name}"? This will also remove all its applications.`
      )
    ) {
      const currentStore = Store.get();
      currentStore.schemes = currentStore.schemes.filter((s) => s.id !== schemeId);
      currentStore.apps = currentStore.apps.filter((a) => a.schemeId !== schemeId);
      Store.save(currentStore);
      setData(currentStore);
      setExpandedSchemes((prev) => {
        const next = new Set(prev);
        next.delete(schemeId);
        return next;
      });
      showToast(`Scheme "${scheme.name}" deleted`, "warn");
    }
  };

  const openEditModal = (scheme) => {
    openModal(
      <EditSchemeModal
        scheme={scheme}
        onSave={(updatedScheme) => {
          const currentStore = Store.get();
          const idx = currentStore.schemes.findIndex((s) => s.id === updatedScheme.id);
          if (idx !== -1) {
            currentStore.schemes[idx] = updatedScheme;
            Store.save(currentStore);
            setData(currentStore);
            showToast("Scheme updated successfully", "ok");
          }
          closeModal();
        }}
        onCancel={closeModal}
      />
    );
  };

  const q = searchQuery.toLowerCase().trim();

  return (
    <div className="container" style={{ paddingTop: "20px" }}>
      <h1 className="page-title">Your Registrations</h1>

      {/* 4 Count Cards */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-number">{countSchemes}</div>
          <div className="stat-label">Schemes published</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{countNew}</div>
          <div className="stat-label">New applications (Registered)</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{countAccepted}</div>
          <div className="stat-label">Accepted</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{countRejected}</div>
          <div className="stat-label">Rejected</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar-row">
        <div className="toolbar-left">
          <input
            type="text"
            placeholder="Search applicants by startup name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ maxWidth: "340px" }}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ maxWidth: "200px" }}
          >
            <option value="all">All statuses</option>
            <option value="Registered">Registered</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <button className="btn btn-acc" onClick={() => navigate("#/add")}>
          {addBtnText}
        </button>
      </div>

      {/* Schemes list */}
      {mySchemes.length === 0 ? (
        <div className="empty-state">
          You haven't registered any scheme yet.
          <br />
          <br />
          <button className="btn btn-acc" onClick={() => navigate("#/add")}>
            Add one now
          </button>
        </div>
      ) : (
        mySchemes.map((scheme) => {
          let schemeApps = myApps.filter((a) => a.schemeId === scheme.id);
          const totalApplicantsForScheme = schemeApps.length;

          if (filterStatus !== "all") {
            schemeApps = schemeApps.filter((a) => a.status === filterStatus);
          }

          if (q) {
            schemeApps = schemeApps.filter((a) =>
              (a.startupName || "").toLowerCase().includes(q)
            );
          }

          const isExpanded = expandedSchemes.has(scheme.id);
          const amountFormatted = formatIndianCurrency(scheme.amount);

          return (
            <div key={scheme.id} className="scheme-block">
              <div className="scheme-header">
                <div className="scheme-header-left">
                  <div className="scheme-title-row">
                    <h3>{scheme.name}</h3>
                    <span className="pill pill-teal">{scheme.dept}</span>
                    <span className="pill pill-amber">{amountFormatted}</span>
                    {scheme.grantKind && (
                      <span className="pill pill-green">{scheme.grantKind}</span>
                    )}
                  </div>
                  <div className="scheme-meta-info">
                    <span>Added {formatIndianDate(scheme.created)}</span>
                    <span>&bull;</span>
                    <span>
                      Total Applicants:{" "}
                      <strong>{totalApplicantsForScheme}</strong>
                    </span>
                  </div>
                </div>

                <div className="scheme-actions">
                  <button
                    className="btn btn-sm"
                    onClick={() => toggleExpand(scheme.id)}
                  >
                    {isExpanded
                      ? `Hide Applicants (${totalApplicantsForScheme})`
                      : `Expand Applicants (${totalApplicantsForScheme})`}
                  </button>
                  <button
                    className="btn btn-sm btn-ghost"
                    onClick={() => openEditModal(scheme)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-bad"
                    onClick={() => deleteSchemeConfirm(scheme.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="scheme-body">
                <div className="scheme-kv-row">
                  <strong>DEPARTMENT</strong> &rarr; {scheme.dept}
                </div>
                <div className="scheme-kv-row">
                  <strong>ELIGIBILITY</strong> &rarr; {scheme.eligibility}
                </div>
                <div
                  className="scheme-kv-row"
                  style={{ marginTop: "6px", color: "#475569" }}
                >
                  {scheme.desc}
                </div>

                {isExpanded && (
                  <div className="applicants-container">
                    {schemeApps.length === 0 ? (
                      <div className="empty-state" style={{ padding: "20px" }}>
                        {totalApplicantsForScheme === 0
                          ? "No applicants yet."
                          : "No applicants match this filter."}
                      </div>
                    ) : (
                      schemeApps.map((app) => {
                        const appUser =
                          data.users.find((u) => u.id === app.userId) || {};
                        const partnerCompanyLabel =
                          currentUser?.role === "grant"
                            ? "GOVERNMENT NAME"
                            : currentUser?.role === "pilot"
                            ? "PILOT COMPANY"
                            : "INVESTOR COMPANY";

                        const badgeClass =
                          app.status === "Accepted"
                            ? "badge-accepted"
                            : app.status === "Rejected"
                            ? "badge-rejected"
                            : "badge-registered";

                        return (
                          <div key={app.id} className="applicant-box">
                            <div className="applicant-box-header">
                              <span>
                                APPLICANT {appUser.email || "founder@startup.io"}
                              </span>
                              <span className={`badge ${badgeClass}`}>
                                {app.status}
                              </span>
                            </div>

                            <div className="applicant-row">
                              <strong>CURRENT EMAIL</strong> &rarr;{" "}
                              {appUser.email || "-"}
                            </div>
                            <div className="applicant-row">
                              <strong>PHONE</strong> &rarr;{" "}
                              {appUser.phone || "-"}
                            </div>
                            <div className="applicant-row">
                              <strong>{partnerCompanyLabel}</strong> &rarr;{" "}
                              {scheme.company}
                            </div>
                            <div className="applicant-row">
                              <strong>SCHEME NAME</strong> &rarr; {scheme.name}
                            </div>
                            <div className="applicant-row">
                              <strong>STARTUP DESCRIPTION</strong> &rarr;{" "}
                              {app.desc || "-"}
                            </div>
                            <div className="applicant-row">
                              <strong>DOWNLOAD STARTUP FILE</strong> &rarr;{" "}
                              {app.fileData && app.fileName ? (
                                <a
                                  href={app.fileData}
                                  download={app.fileName}
                                  style={{
                                    color: "var(--pri)",
                                    fontWeight: 700,
                                    textDecoration: "underline",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px"
                                  }}
                                >
                                  <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                  >
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                  </svg>
                                  {app.fileName}
                                </a>
                              ) : app.fileName ? (
                                <span
                                  style={{
                                    fontWeight: 600,
                                    color: "var(--ink)"
                                  }}
                                >
                                  {app.fileName}
                                </span>
                              ) : (
                                <span
                                  style={{
                                    color: "#64748b",
                                    fontStyle: "italic"
                                  }}
                                >
                                  No document uploaded
                                </span>
                              )}
                            </div>
                            <div className="applicant-row">
                              <strong>STARTUP NAME</strong> &rarr;{" "}
                              {app.startupName || "-"}
                            </div>
                            <div className="applicant-row">
                              <strong>APPLIED ON</strong> &rarr;{" "}
                              {formatIndianDate(app.created)}
                            </div>

                            <div className="applicant-actions-bar">
                              <span className={`badge ${badgeClass}`}>
                                {app.status}
                              </span>
                              <div style={{ display: "flex", gap: "8px" }}>
                                <button
                                  className="btn btn-sm btn-ok"
                                  disabled={app.status === "Accepted"}
                                  onClick={() =>
                                    updateAppStatus(app.id, "Accepted")
                                  }
                                >
                                  Accept
                                </button>
                                <button
                                  className="btn btn-sm btn-bad"
                                  disabled={app.status === "Rejected"}
                                  onClick={() =>
                                    updateAppStatus(app.id, "Rejected")
                                  }
                                >
                                  Reject
                                </button>
                                {app.status !== "Registered" && (
                                  <button
                                    className="btn btn-sm btn-ghost"
                                    onClick={() =>
                                      updateAppStatus(app.id, "Registered")
                                    }
                                  >
                                    Undo
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

const EditSchemeModal = ({ scheme, onSave, onCancel }) => {
  const isGrant = scheme.type === "grant";
  const isStandardDept = DEPARTMENTS.filter(d => d !== "Others").includes(scheme.dept);

  const [company, setCompany] = useState(scheme.company);
  const [name, setName] = useState(scheme.name);
  const [amount, setAmount] = useState(scheme.amount);
  const [dept, setDept] = useState(isStandardDept ? scheme.dept : "Others");
  const [customIndustry, setCustomIndustry] = useState(isStandardDept ? "" : scheme.dept);
  const [desc, setDesc] = useState(scheme.desc);
  const [eligibility, setEligibility] = useState(scheme.eligibility);
  const [grantKind, setGrantKind] = useState(scheme.grantKind || "Grant");

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalDept = dept === "Others" ? customIndustry.trim() : dept;
    if (dept === "Others" && !customIndustry.trim()) {
      return;
    }
    onSave({
      ...scheme,
      company: company.trim(),
      name: name.trim(),
      amount: amount.trim(),
      dept: finalDept,
      desc: desc.trim(),
      eligibility: eligibility.trim(),
      grantKind: isGrant ? grantKind : undefined
    });
  };

  return (
    <div>
      <h2
        style={{
          fontSize: "22px",
          fontWeight: 800,
          color: "var(--pri)",
          marginBottom: "18px"
        }}
      >
        Edit Scheme
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Company / Government name</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Scheme name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        {isGrant && (
          <div className="form-group">
            <label>Type</label>
            <select
              value={grantKind}
              onChange={(e) => setGrantKind(e.target.value)}
            >
              <option value="Grant">Grant</option>
              <option value="Scheme">Scheme</option>
            </select>
          </div>
        )}
        <div className="form-group">
          <label>Investment amount / Range</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Department</label>
          <select value={dept} onChange={(e) => setDept(e.target.value)}>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        {dept === "Others" && (
          <div className="form-group">
            <label>Type your industry</label>
            <input
              type="text"
              placeholder="Type your industry"
              value={customIndustry}
              onChange={(e) => setCustomIndustry(e.target.value)}
              required
            />
          </div>
        )}
        <div className="form-group">
          <label>Brief Description</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Eligibility</label>
          <textarea
            value={eligibility}
            onChange={(e) => setEligibility(e.target.value)}
            required
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "20px"
          }}
        >
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};
