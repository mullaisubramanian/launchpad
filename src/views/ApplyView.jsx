import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { DEPARTMENTS } from "../data/constants";
import { formatIndianCurrency } from "../utils/formatters";

export const ApplyView = () => {
  const { data, currentUser, navigate } = useApp();

  const [selectedType, setSelectedType] = useState("investor");
  const [selectedIndustry, setSelectedIndustry] = useState("All industries");

  // Filter schemes
  let results = data.schemes.filter((s) => s.type === selectedType);
  if (selectedIndustry !== "All industries") {
    results = results.filter((s) => s.dept === selectedIndustry);
  }

  return (
    <div className="container" style={{ paddingTop: "20px" }}>
      <div className="white-panel search-panel">
        <h2 style={{ color: "var(--pri)", fontWeight: 800, fontSize: "28px" }}>
          Application form
        </h2>
        <p style={{ color: "var(--muted)", fontSize: "14.5px", marginTop: "4px" }}>
          Discover tailored investment tranches, commercial pilot partners, and
          state innovation grants.
        </p>

        <div className="search-controls">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Select user type:</label>
            <select
              id="search-user-type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="investor">Investor</option>
              <option value="pilot">Pilot</option>
              <option value="grant">Grant</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Select industry:</label>
            <select
              id="search-industry"
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
            >
              <option value="All industries">All industries</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <button
            className="btn"
            style={{ height: "44px" }}
            type="button"
          >
            Search
          </button>
        </div>
      </div>

      <div className="results-grid">
        {results.length === 0 ? (
          <div style={{ gridColumn: "1 / -1" }}>
            <div className="empty-state">
              No {selectedType} schemes found for {selectedIndustry}. Try
              another industry.
            </div>
          </div>
        ) : (
          results.map((scheme) => {
            const hasApplied = currentUser
              ? data.apps.find(
                  (a) => a.schemeId === scheme.id && a.userId === currentUser.id
                )
              : null;

            const borderClass =
              scheme.type === "pilot"
                ? "border-pilot"
                : scheme.type === "grant"
                ? "border-grant"
                : "border-investor";

            return (
              <div key={scheme.id} className={`scheme-search-card ${borderClass}`}>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                    flexWrap: "wrap"
                  }}
                >
                  <span className="pill pill-teal">{scheme.type.toUpperCase()}</span>
                  <span className="pill">{scheme.dept}</span>
                  {scheme.grantKind && (
                    <span className="pill pill-green">{scheme.grantKind}</span>
                  )}
                </div>

                <h3>{scheme.name}</h3>
                <div className="scheme-company-name">{scheme.company}</div>

                <div>
                  <span className="scheme-amount-highlight">
                    Investment range / Amount: {formatIndianCurrency(scheme.amount)}
                  </span>
                </div>

                <p>{scheme.desc}</p>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#64748b",
                    marginTop: "auto"
                  }}
                >
                  <strong>Eligibility:</strong> {scheme.eligibility}
                </p>

                <div className="scheme-card-footer">
                  {hasApplied ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%"
                      }}
                    >
                      <span
                        className={`badge ${
                          hasApplied.status === "Accepted"
                            ? "badge-accepted"
                            : hasApplied.status === "Rejected"
                            ? "badge-rejected"
                            : "badge-registered"
                        }`}
                      >
                        {hasApplied.status}
                      </span>
                      <button
                        className="btn btn-sm btn-ghost"
                        onClick={() => navigate("#/status")}
                      >
                        View status
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-sm"
                      style={{ width: "100%" }}
                      onClick={() => navigate(`#/form/${scheme.id}`)}
                    >
                      Apply
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
