import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Store } from "../services/storage";
import { formatIndianDate, formatIndianCurrency, generateId } from "../utils/formatters";

export const ApplicationFormView = ({ schemeId }) => {
  const { data, setData, currentUser, showToast, navigate } = useApp();

  const scheme = data.schemes.find((s) => s.id === schemeId);

  const existingApp =
    currentUser && scheme
      ? data.apps.find((a) => a.schemeId === scheme.id && a.userId === currentUser.id)
      : null;

  const [startupName, setStartupName] = useState(
    currentUser?.org || currentUser?.name || ""
  );
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!scheme) {
    return (
      <div className="container" style={{ paddingTop: "20px" }}>
        <div className="empty-state">
          Scheme not found.{" "}
          <button className="btn btn-sm" onClick={() => navigate("#/apply")}>
            Back to search
          </button>
        </div>
      </div>
    );
  }

  const amountFormatted = formatIndianCurrency(scheme.amount);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startupName.trim() || !desc.trim()) {
      showToast("Please complete startup name and description", "bad");
      return;
    }

    if (existingApp) {
      showToast("You have already applied to this scheme", "warn");
      navigate("#/status");
      return;
    }

    setSubmitting(true);

    const saveAndRedirect = (fileName, fileData) => {
      const currentStore = Store.get();
      const newApp = {
        id: generateId("app"),
        schemeId: scheme.id,
        userId: currentUser.id,
        startupName: startupName.trim(),
        desc: desc.trim(),
        fileName: fileName || "",
        fileData: fileData || "",
        status: "Registered",
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      };

      currentStore.apps.unshift(newApp);
      Store.save(currentStore);
      setData(currentStore);

      showToast("Application submitted successfully", "ok");
      navigate("#/status");
    };

    if (file) {
      const fileName = file.name;
      const maxBytes = 1.5 * 1024 * 1024; // 1.5 MB
      if (file.size <= maxBytes) {
        const reader = new FileReader();
        reader.onload = () => {
          saveAndRedirect(fileName, reader.result);
        };
        reader.onerror = () => {
          saveAndRedirect(fileName, "");
        };
        reader.readAsDataURL(file);
      } else {
        showToast("File exceeds 1.5 MB; attaching file name only", "warn");
        saveAndRedirect(fileName, "");
      }
    } else {
      saveAndRedirect("", "");
    }
  };

  return (
    <div className="container" style={{ paddingTop: "20px" }}>
      <div className="white-panel" style={{ maxWidth: "800px", margin: "0 auto 40px" }}>
        <h1
          style={{
            color: "var(--pri)",
            fontWeight: 800,
            fontSize: "32px",
            textAlign: "center",
            marginBottom: "20px"
          }}
        >
          Application form
        </h1>

        {/* Scheme Summary Dark Box */}
        <div className="scheme-summary-box">
          <h3>
            {scheme.name} &bull; {scheme.company}
          </h3>
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "10px",
              flexWrap: "wrap"
            }}
          >
            <span
              className="pill pill-teal"
              style={{ background: "#0f766e", color: "#ffffff" }}
            >
              {scheme.type.toUpperCase()}
            </span>
            <span className="pill pill-amber">{scheme.dept}</span>
            <span
              className="pill"
              style={{ background: "rgba(255,255,255,0.2)", color: "#ffffff" }}
            >
              {amountFormatted}
            </span>
          </div>
          <div
            style={{
              fontSize: "13.5px",
              color: "#cfe3e1",
              marginBottom: "6px"
            }}
          >
            <strong>Eligibility:</strong> {scheme.eligibility}
          </div>
          <div style={{ fontSize: "13.5px", color: "#94a3b8" }}>
            {scheme.desc}
          </div>
        </div>

        {existingApp ? (
          <div style={{ textAlign: "center", padding: "30px 10px" }}>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "var(--ink)",
                marginBottom: "12px"
              }}
            >
              You have already submitted an application for this scheme.
            </div>
            <div style={{ marginBottom: "20px" }}>
              Current Status:{" "}
              <span
                className={`badge ${
                  existingApp.status === "Accepted"
                    ? "badge-accepted"
                    : existingApp.status === "Rejected"
                    ? "badge-rejected"
                    : "badge-registered"
                }`}
              >
                {existingApp.status}
              </span>
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "var(--muted)",
                marginBottom: "24px"
              }}
            >
              Applied on: {formatIndianDate(existingApp.created)}
            </div>
            <button className="btn btn-acc" onClick={() => navigate("#/status")}>
              Go to Status
            </button>
          </div>
        ) : (
          <form id="apply-scheme-form" onSubmit={handleSubmit}>
            <div className="form-group center-label">
              <label htmlFor="app-startup-name">Startup Name:</label>
              <input
                type="text"
                id="app-startup-name"
                value={startupName}
                onChange={(e) => setStartupName(e.target.value)}
                required
              />
            </div>

            <div className="form-group center-label">
              <label htmlFor="app-desc">Description:</label>
              <textarea
                id="app-desc"
                placeholder="Detail your solution, current metrics, and alignment with the scheme"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                required
                style={{ minHeight: "120px" }}
              />
            </div>

            <div className="form-group center-label">
              <label htmlFor="app-file">Upload document:</label>
              <input
                type="file"
                id="app-file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                style={{ padding: "8px" }}
              />
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--muted)",
                  textAlign: "center",
                  marginTop: "4px"
                }}
              >
                Accepts PDF, DOC, DOCX, PPT, PPTX, PNG, JPG (up to 1.5 MB stored
                with data)
              </span>
            </div>

            <div style={{ textAlign: "center", marginTop: "24px" }}>
              <button
                type="submit"
                className="btn btn-lg"
                style={{ minWidth: "200px" }}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>

            <div style={{ textAlign: "center", marginTop: "16px" }}>
              <button
                type="button"
                onClick={() => navigate("#/apply")}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--muted)",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                &larr; Back to search
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
