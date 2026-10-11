import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Store } from "../services/storage";
import { DEPARTMENTS } from "../data/constants";
import { generateId } from "../utils/formatters";

export const AddSchemeView = () => {
  const { data, setData, currentUser, showToast, navigate } = useApp();

  const role = currentUser?.role || "investor";
  const isGrant = role === "grant";
  const pageTitle = isGrant
    ? "Register your grant or scheme"
    : "Register your scheme";

  const btnText =
    role === "investor" ? "Add" : role === "pilot" ? "Add Pilot" : "Add";

  const defaultDept =
    role === "pilot"
      ? "Logistics"
      : role === "grant"
      ? "Agriculture"
      : "Ecommerce";

  const userSchemes = currentUser
    ? data.schemes.filter((s) => s.ownerId === currentUser.id)
    : [];
  const lastScheme = userSchemes[userSchemes.length - 1];
  const initialCompany =
    lastScheme?.company || currentUser?.org || currentUser?.name || "";

  const [company, setCompany] = useState(initialCompany);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dept, setDept] = useState(defaultDept);
  const [desc, setDesc] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [grantKind, setGrantKind] = useState("Grant");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !company.trim() ||
      !name.trim() ||
      !amount.trim() ||
      !desc.trim() ||
      !eligibility.trim()
    ) {
      showToast("Please complete all scheme fields", "bad");
      return;
    }

    const currentStore = Store.get();
    const newScheme = {
      id: generateId("s"),
      type: role,
      ownerId: currentUser.id,
      company: company.trim(),
      name: name.trim(),
      amount: amount.trim(),
      dept,
      desc: desc.trim(),
      eligibility: eligibility.trim(),
      grantKind: isGrant ? grantKind : undefined,
      created: new Date().toISOString()
    };

    currentStore.schemes.unshift(newScheme);
    Store.save(currentStore);
    setData(currentStore);

    showToast(`"${name.trim()}" added`, "ok");
    window.sessionStorage.setItem("expanded_scheme_id", newScheme.id);
    navigate("#/applicants");
  };

  return (
    <div className="container" style={{ paddingTop: "20px" }}>
      <h1 className="page-title">{pageTitle}</h1>

      <div
        className="white-panel"
        style={{ maxWidth: "860px", marginLeft: "auto", marginRight: "auto" }}
      >
        <form id="add-scheme-form" onSubmit={handleSubmit}>
          <div
            className="grid-2col"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px"
            }}
          >
            {/* Left Column */}
            <div>
              {isGrant ? (
                <>
                  <div className="form-group center-label">
                    <label htmlFor="scheme-company">Government name</label>
                    <input
                      type="text"
                      id="scheme-company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group center-label">
                    <label htmlFor="scheme-name">Scheme or Grant name</label>
                    <input
                      type="text"
                      id="scheme-name"
                      placeholder="e.g. National AgriTech Mission"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group center-label">
                    <label htmlFor="scheme-grant-kind">Type</label>
                    <select
                      id="scheme-grant-kind"
                      value={grantKind}
                      onChange={(e) => setGrantKind(e.target.value)}
                      style={{
                        borderBottom: "3px solid var(--pri)",
                        textAlignLast: "center"
                      }}
                    >
                      <option value="Grant">Grant</option>
                      <option value="Scheme">Scheme</option>
                    </select>
                  </div>
                  <div className="form-group center-label">
                    <label htmlFor="scheme-dept">Department</label>
                    <select
                      id="scheme-dept"
                      value={dept}
                      onChange={(e) => setDept(e.target.value)}
                      style={{
                        borderBottom: "3px solid var(--pri)",
                        textAlignLast: "center"
                      }}
                    >
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group center-label">
                    <label htmlFor="scheme-company">Company name</label>
                    <input
                      type="text"
                      id="scheme-company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group center-label">
                    <label htmlFor="scheme-amount">Investment Range</label>
                    <input
                      type="text"
                      id="scheme-amount"
                      placeholder="e.g. 500000-2500000 or 2000000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group center-label">
                    <label htmlFor="scheme-dept">Department</label>
                    <select
                      id="scheme-dept"
                      value={dept}
                      onChange={(e) => setDept(e.target.value)}
                      style={{
                        borderBottom: "3px solid var(--pri)",
                        textAlignLast: "center"
                      }}
                    >
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Right Column */}
            <div>
              {isGrant ? (
                <>
                  <div className="form-group center-label">
                    <label htmlFor="scheme-amount">Investment amount</label>
                    <input
                      type="text"
                      id="scheme-amount"
                      placeholder="e.g. 1000000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group center-label">
                    <label htmlFor="scheme-desc">Brief Description</label>
                    <textarea
                      id="scheme-desc"
                      placeholder="Detail the objectives and funding allocations"
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      required
                      style={{ minHeight: "90px" }}
                    />
                  </div>
                  <div className="form-group center-label">
                    <label htmlFor="scheme-eligibility">Eligibility</label>
                    <textarea
                      id="scheme-eligibility"
                      placeholder="Specify requirements, DPIIT guidelines, stage"
                      value={eligibility}
                      onChange={(e) => setEligibility(e.target.value)}
                      required
                      style={{ minHeight: "90px" }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group center-label">
                    <label htmlFor="scheme-name">Scheme name</label>
                    <input
                      type="text"
                      id="scheme-name"
                      placeholder="e.g. Innovation Power"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group center-label">
                    <label htmlFor="scheme-desc">Brief Description</label>
                    <textarea
                      id="scheme-desc"
                      placeholder="Detail your investment thesis or pilot objectives"
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      required
                      style={{ minHeight: "90px" }}
                    />
                  </div>
                  <div className="form-group center-label">
                    <label htmlFor="scheme-eligibility">Eligibility</label>
                    <textarea
                      id="scheme-eligibility"
                      placeholder="e.g. No age limit, MVP required"
                      value={eligibility}
                      onChange={(e) => setEligibility(e.target.value)}
                      required
                      style={{ minHeight: "90px" }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "28px" }}>
            <button
              type="submit"
              className="btn btn-lg"
              style={{ minWidth: "200px" }}
            >
              {btnText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
