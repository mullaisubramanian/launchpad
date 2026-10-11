import React from "react";
import { useApp } from "../context/AppContext";
import { formatIndianDate } from "../utils/formatters";

export const StatusView = () => {
  const { data, currentUser, navigate } = useApp();

  const myApps = currentUser
    ? data.apps.filter((a) => a.userId === currentUser.id)
    : [];

  const totalCount = myApps.length;
  const regCount = myApps.filter((a) => a.status === "Registered").length;
  const accCount = myApps.filter((a) => a.status === "Accepted").length;
  const rejCount = myApps.filter((a) => a.status === "Rejected").length;

  const renderTableForType = (typeKey, title) => {
    const typeApps = myApps.filter((app) => {
      const scheme = data.schemes.find((s) => s.id === app.schemeId);
      return scheme && scheme.type === typeKey;
    });

    return (
      <div className="status-section">
        <h2>{title}</h2>
        <div className="status-table-wrap">
          <table className="status-table">
            <thead>
              <tr>
                <th>Company name</th>
                <th>Scheme name</th>
                <th>Start up name</th>
                <th>Applied on</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {typeApps.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "24px",
                      color: "var(--muted)",
                      fontStyle: "italic"
                    }}
                  >
                    No {typeKey} applications yet
                  </td>
                </tr>
              ) : (
                typeApps.map((app) => {
                  const scheme =
                    data.schemes.find((s) => s.id === app.schemeId) || {};
                  const badgeClass =
                    app.status === "Accepted"
                      ? "badge-accepted"
                      : app.status === "Rejected"
                      ? "badge-rejected"
                      : "badge-registered";

                  return (
                    <tr key={app.id}>
                      <td>
                        <strong>{scheme.company || "-"}</strong>
                      </td>
                      <td>{scheme.name || "-"}</td>
                      <td>{app.startupName || "-"}</td>
                      <td>{formatIndianDate(app.created)}</td>
                      <td>
                        <span className={`badge ${badgeClass}`}>{app.status}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="container" style={{ paddingTop: "20px" }}>
      <h1 className="page-title">Your Registrations</h1>

      {/* 4 Count Cards */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-number">{totalCount}</div>
          <div className="stat-label">Total Applications</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{regCount}</div>
          <div className="stat-label">Registered</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{accCount}</div>
          <div className="stat-label">Accepted</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{rejCount}</div>
          <div className="stat-label">Rejected</div>
        </div>
      </div>

      {/* Pilot Applications */}
      {renderTableForType("pilot", "Pilot Applications")}

      {/* Grant Applications */}
      {renderTableForType("grant", "Grant Applications")}

      {/* Investor Applications */}
      {renderTableForType("investor", "Investor Applications")}

      <div style={{ textAlign: "center", margin: "36px 0 60px" }}>
        <button className="btn btn-acc btn-lg" onClick={() => navigate("#/apply")}>
          Apply for more funding
        </button>
      </div>
    </div>
  );
};
