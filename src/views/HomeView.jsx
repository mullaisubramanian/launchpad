import React, { useMemo } from "react";
import { useApp } from "../context/AppContext";
import { BRAND } from "../data/constants";

export const HomeView = () => {
  const { currentUser, navigate, openModal, closeModal } = useApp();

  // Generate stable twinkling stars
  const stars = useMemo(() => {
    return Array.from({ length: 70 }, (_, i) => ({
      id: i,
      top: (Math.random() * 100).toFixed(1),
      left: (Math.random() * 100).toFixed(1),
      delay: (Math.random() * 4).toFixed(2),
      dur: (2.2 + Math.random() * 3).toFixed(2)
    }));
  }, []);

  const openServiceModal = (roleKey) => {
    let title = "";
    let explanation = "";
    let bullets = [];
    let partnerRole = "";

    if (roleKey === "startup") {
      title = "Startup Acceleration & Fund Access";
      explanation =
        "Built to give early-stage founders an unfair advantage in raising capital and commercial pilots.";
      bullets = [
        "Create a unified founder profile once with company details and location.",
        "Explore thousands of open schemes across VC investment, grants, and corporate pilots.",
        "Attach comprehensive slide decks and pitch dossiers directly without cold emails.",
        "Receive transparent status notifications as decision-makers review your submissions."
      ];
    } else if (roleKey === "pilot") {
      title = "Corporate Paid Pilots Program";
      explanation =
        "Empowering market-leading enterprises to discover plug-and-play B2B startups for paid trials.";
      bullets = [
        "Publish open challenges across logistics, manufacturing, retail, and IT.",
        "Specify pilot budget ranges (e.g. ₹5,00,000 - ₹10,00,000) and operational parameters.",
        "Download and review detailed solution blueprints from qualified founders.",
        "Accept high-potential candidates to initiate commercial integration agreements."
      ];
      partnerRole = "pilot";
    } else if (roleKey === "grant") {
      title = "Government & Institutional Grants";
      explanation =
        "Facilitating non-dilutive public capital deployment to fuel indigenous technological self-reliance.";
      bullets = [
        "Publish state and central innovation schemes with clear departmental guidelines.",
        "Define strict statutory eligibility parameters and grant amounts.",
        "Access digital dossiers and DPIIT credentials of applying startups.",
        "Drive auditable grant allocations with real-time acceptance workflows."
      ];
      partnerRole = "grant";
    } else if (roleKey === "investor") {
      title = "Venture Capital & Angel Syndicates";
      explanation =
        "Streamlined deal-flow pipeline for micro-VCs, angel networks, and family offices.";
      bullets = [
        "Set targeted ticket sizes ranging from ₹20 Lakhs to ₹2.5 Crores.",
        "Filter applicants by specific sector verticals such as Fintech, AgTech, or Clean Energy.",
        "Inspect verified executive summaries and pitch decks from pre-screened founders.",
        "Issue direct term-sheet evaluations and manage pipeline status effortlessly."
      ];
      partnerRole = "investor";
    }

    const modalContent = (
      <div>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: 800,
            color: "var(--pri)",
            marginBottom: "10px"
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontSize: "15px",
            color: "var(--muted)",
            marginBottom: "16px"
          }}
        >
          {explanation}
        </p>
        <ul
          style={{
            paddingLeft: "20px",
            fontSize: "14px",
            color: "#334155",
            lineHeight: 1.6,
            marginBottom: "24px"
          }}
        >
          {bullets.map((b, idx) => (
            <li key={idx} style={{ marginBottom: "8px" }}>
              {b}
            </li>
          ))}
        </ul>

        {currentUser ? (
          <button
            className="btn btn-acc"
            onClick={() => {
              closeModal();
              if (currentUser.role === "startup") {
                navigate("#/apply");
              } else {
                navigate("#/applicants");
              }
            }}
          >
            Go to my dashboard
          </button>
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginTop: "20px"
            }}
          >
            <button
              className="btn"
              onClick={() => {
                closeModal();
                navigate("#/register/startup");
              }}
            >
              Register as a Startup
            </button>
            {partnerRole === "investor" && (
              <button
                className="btn btn-acc"
                onClick={() => {
                  closeModal();
                  navigate("#/register/investor");
                }}
              >
                Register as an Investor
              </button>
            )}
            {partnerRole === "pilot" && (
              <button
                className="btn btn-acc"
                onClick={() => {
                  closeModal();
                  navigate("#/register/pilot");
                }}
              >
                Register as a Pilot partner
              </button>
            )}
            {partnerRole === "grant" && (
              <button
                className="btn btn-acc"
                onClick={() => {
                  closeModal();
                  navigate("#/register/grant");
                }}
              >
                Register as a Grant body
              </button>
            )}
            <button
              className="btn btn-ghost"
              onClick={() => {
                closeModal();
                navigate("#/login");
              }}
            >
              Login
            </button>
          </div>
        )}
      </div>
    );

    openModal(modalContent);
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero-section" id="home">
        <div className="stars-layer">
          {stars.map((star) => (
            <div
              key={star.id}
              className="star"
              style={{
                top: `${star.top}%`,
                left: `${star.left}%`,
                animationDelay: `${star.delay}s`,
                animationDuration: `${star.dur}s`
              }}
            />
          ))}
        </div>
        <div className="container hero-grid">
          <div className="hero-left">
            <div className="hero-tag">Choose your service and scheme</div>
            <h1 className="hero-headline">
              Track your progress <span className="amber-text">every second</span>
            </h1>
            <button
              className="btn btn-acc btn-lg"
              onClick={() => {
                const el = document.getElementById("services");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Discover more
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>

          <div className="hero-right">
            {/* SVG Illustration */}
            <svg
              className="hero-illustration"
              viewBox="0 0 440 380"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Ground line */}
              <line
                x1="20"
                y1="330"
                x2="420"
                y2="330"
                stroke="#1f3a40"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* 4 Teal Bar Columns */}
              <rect x="50" y="240" width="46" height="90" rx="6" fill="#134e4a" />
              <rect x="115" y="195" width="46" height="135" rx="6" fill="#115e59" />
              <rect x="180" y="145" width="46" height="185" rx="6" fill="#0f766e" />
              <rect x="245" y="90" width="46" height="240" rx="6" fill="#0d9488" />

              {/* Sprout in amber pot */}
              <path d="M60 330L63 312H83L86 330H60Z" fill="#f59e0b" />
              <path
                d="M73 312V296"
                stroke="#2dd4bf"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <path
                d="M73 302C66 300 62 292 64 286C72 288 73 298 73 302Z"
                fill="#2dd4bf"
              />
              <path
                d="M73 298C80 295 85 287 83 281C75 282 73 294 73 298Z"
                fill="#2dd4bf"
              />

              {/* Amber Growth Line */}
              <path
                d="M68 220L138 175L203 130L268 70"
                stroke="#f59e0b"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polygon points="268,60 278,74 260,78" fill="#f59e0b" />

              {/* Rocket Group */}
              <g transform="translate(20, -10)">
                <path
                  className="flame-anim"
                  d="M284 172C281 184 290 196 290 196C290 196 299 184 296 172Z"
                  fill="#f97316"
                />
                <path
                  d="M290 112C282 126 278 148 278 168H302C302 148 298 126 290 112Z"
                  fill="#ffffff"
                />
                <circle
                  cx="290"
                  cy="144"
                  r="5"
                  fill="#0d9488"
                  stroke="#ffffff"
                  strokeWidth="1.8"
                />
                <path d="M278 152L266 168H278V152Z" fill="#f59e0b" />
                <path d="M302 152L314 168H302V152Z" fill="#f59e0b" />
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="about-section" id="about">
        <div className="container">
          <h2 className="page-title">About {BRAND}</h2>
          <p className="about-p">
            {BRAND} brings ambitious startups, forward-thinking investors,
            corporate pilot partners, and national government bodies together
            onto one seamless, transparent platform. We eliminate fragmented
            outreach and opaque pipelines by establishing direct, verified
            channels for capital, pilots, and grants.
          </p>
          <p className="about-p">
            Startups can discover curated investors, sovereign grants, and
            industry-defining commercial pilots with zero gatekeeping. Partners
            effortlessly publish eligibility guidelines, review verified proposals
            with attached dossiers, and make definitive accept or reject decisions
            with complete operational velocity.
          </p>
        </div>
      </section>

      {/* OUR SERVICES SECTION */}
      <section className="services-section" id="services">
        <div className="container">
          <h2 className="page-title" style={{ marginTop: 0 }}>
            Our Services
          </h2>
          <p className="page-subtitle">
            Tailored discovery pathways designed for high-velocity growth and
            institutional collaboration.
          </p>

          <div className="services-grid">
            {/* Startup Card */}
            <div className="service-card">
              <div
                className="service-icon-tile"
                style={{ background: "rgba(167, 139, 250, 0.18)" }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#a78bfa"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                  <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                  <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                  <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
                </svg>
              </div>
              <h3>Startup</h3>
              <p>
                Register once, discover active pilots, grants, and strategic
                angel/VC investors, apply in minutes, and track status live.
              </p>
              <button
                className="btn btn-sm btn-ghost"
                style={{ color: "#ffffff", borderColor: "#334e55" }}
                onClick={() => openServiceModal("startup")}
              >
                Know More
              </button>
            </div>

            {/* Pilot Card */}
            <div className="service-card">
              <div
                className="service-icon-tile"
                style={{ background: "rgba(245, 158, 11, 0.18)" }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </div>
              <h3>Pilot</h3>
              <p>
                Run real-world paid pilots with established enterprise leaders to
                validate your technology with enterprise customers.
              </p>
              <button
                className="btn btn-sm btn-ghost"
                style={{ color: "#ffffff", borderColor: "#334e55" }}
                onClick={() => openServiceModal("pilot")}
              >
                Know More
              </button>
            </div>

            {/* Grant Card */}
            <div className="service-card">
              <div
                className="service-icon-tile"
                style={{ background: "rgba(34, 197, 94, 0.18)" }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 21h18"></path>
                  <path d="M3 10h18"></path>
                  <path d="M5 6l7-3 7 3"></path>
                  <path d="M4 10v11"></path>
                  <path d="M20 10v11"></path>
                  <path d="M8 14v4"></path>
                  <path d="M12 14v4"></path>
                  <path d="M16 14v4"></path>
                </svg>
              </div>
              <h3>Grant</h3>
              <p>
                Find non-dilutive central and state innovation schemes, check
                precise departmental eligibility, and secure public grants.
              </p>
              <button
                className="btn btn-sm btn-ghost"
                style={{ color: "#ffffff", borderColor: "#334e55" }}
                onClick={() => openServiceModal("grant")}
              >
                Know More
              </button>
            </div>

            {/* Investment Card */}
            <div className="service-card">
              <div
                className="service-icon-tile"
                style={{ background: "rgba(13, 148, 136, 0.22)" }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2dd4bf"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                  <polyline points="17 6 23 6 23 12"></polyline>
                </svg>
              </div>
              <h3>Investment</h3>
              <p>
                Reach institutional venture firms and syndicates in your sector,
                share executive pitch decks, and raise catalytic rounds.
              </p>
              <button
                className="btn btn-sm btn-ghost"
                style={{ color: "#ffffff", borderColor: "#334e55" }}
                onClick={() => openServiceModal("investor")}
              >
                Know More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="how-section" id="how">
        <div className="container">
          <h2 className="page-title" style={{ marginTop: 0 }}>
            How It Works
          </h2>
          <p className="page-subtitle">
            A transparent 4-step framework connecting supply and demand for
            venture capital and enterprise contracts.
          </p>

          <div className="how-grid">
            <div className="how-card">
              <div className="step-badge">1</div>
              <h4>Register</h4>
              <p>
                Sign up in under 60 seconds as a Startup, Corporate Pilot
                Partner, Grant Body, or Investment Firm.
              </p>
            </div>
            <div className="how-card">
              <div className="step-badge">2</div>
              <h4>Publish or Search</h4>
              <p>
                Partners publish structured funding schemes; founders filter
                opportunities by sector, amount, and eligibility.
              </p>
            </div>
            <div className="how-card">
              <div className="step-badge">3</div>
              <h4>Apply</h4>
              <p>
                Submit customized proposals alongside pitch decks and compliance
                documents directly to decision-makers.
              </p>
            </div>
            <div className="how-card">
              <div className="step-badge">4</div>
              <h4>Track</h4>
              <p>
                Monitor real-time application states across Registered,
                Accepted, and Rejected with instantaneous updates.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
