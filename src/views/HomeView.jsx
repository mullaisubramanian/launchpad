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
              Track your progress every second
            </h1>
            <button
              className="btn btn-lg"
              style={{ borderRadius: "6px" }}
              onClick={() => {
                const el = document.getElementById("services");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Discover more
            </button>
          </div>

          <div className="hero-right">
            {/* Flat unDraw-style tree with swing and reader */}
            <svg
              className="hero-illustration"
              viewBox="0 0 480 380"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Ground line */}
              <line x1="20" y1="340" x2="460" y2="340" stroke="#3a4047" strokeWidth="2.5" strokeLinecap="round" />
              
              {/* Tree trunk & branches in dark purple #3f3d56 */}
              <path d="M140 340C140 300 135 250 150 200C165 150 180 130 220 100C260 70 310 65 370 70" stroke="#3f3d56" strokeWidth="18" strokeLinecap="round" fill="none" />
              <path d="M145 340C148 290 152 240 135 210C118 180 90 165 60 155" stroke="#3f3d56" strokeWidth="12" strokeLinecap="round" fill="none" />
              <path d="M180 160C205 135 230 130 270 140" stroke="#3f3d56" strokeWidth="9" strokeLinecap="round" fill="none" />
              <path d="M260 85C290 80 340 105 380 130" stroke="#3f3d56" strokeWidth="9" strokeLinecap="round" fill="none" />
              <path d="M210 105C230 75 250 50 290 40" stroke="#3f3d56" strokeWidth="8" strokeLinecap="round" fill="none" />

              {/* ~8 Teal leaves #2bb3a3 */}
              <ellipse cx="60" cy="150" rx="14" ry="7" fill="#2bb3a3" transform="rotate(-25 60 150)" />
              <ellipse cx="100" cy="168" rx="13" ry="6" fill="#2bb3a3" transform="rotate(30 100 168)" />
              <ellipse cx="280" cy="138" rx="15" ry="7" fill="#2bb3a3" transform="rotate(-15 280 138)" />
              <ellipse cx="295" cy="38" rx="14" ry="7" fill="#2bb3a3" transform="rotate(20 295 38)" />
              <ellipse cx="375" cy="68" rx="15" ry="7" fill="#2bb3a3" transform="rotate(-10 375 68)" />
              <ellipse cx="390" cy="132" rx="14" ry="7" fill="#2bb3a3" transform="rotate(35 390 132)" />
              <ellipse cx="330" cy="95" rx="13" ry="6" fill="#2bb3a3" transform="rotate(-30 330 95)" />
              <ellipse cx="235" cy="70" rx="14" ry="7" fill="#2bb3a3" transform="rotate(15 235 70)" />

              {/* Swing ropes hanging from branch at x=280 and x=310, y=140 */}
              <line x1="285" y1="140" x2="285" y2="255" stroke="#6c757d" strokeWidth="2" />
              <line x1="315" y1="138" x2="315" y2="255" stroke="#6c757d" strokeWidth="2" />
              {/* Swing wooden plank */}
              <rect x="275" y="255" width="50" height="6" rx="2" fill="#d97706" />

              {/* Person sitting on the swing reading a green book */}
              {/* Legs hanging down */}
              <path d="M295 258L290 295L296 315" stroke="#3f3d56" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M305 258L308 295L318 315" stroke="#3f3d56" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              {/* Torso */}
              <path d="M295 220C295 220 290 258 298 258C306 258 312 258 312 220Z" fill="#0d6efd" />
              {/* Head */}
              <circle cx="302" cy="202" r="11" fill="#fed7aa" />
              {/* Hair */}
              <path d="M295 200C295 192 312 190 312 200C312 195 304 193 295 200Z" fill="#2b3035" />
              {/* Arms holding the book */}
              <path d="M298 230L282 242L288 250" stroke="#fed7aa" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M308 230L295 244" stroke="#fed7aa" strokeWidth="4" strokeLinecap="round" fill="none" />
              {/* Open green book */}
              <path d="M276 242L286 248L286 258L276 252Z" fill="#198754" />
              <path d="M286 248L296 242L296 252L286 258Z" fill="#20c997" />
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
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0d6efd"
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
                Register once, discover pilots, grants and investors, apply in
                minutes, and track every application.
              </p>
              <button
                className="btn btn-sm"
                onClick={() => openServiceModal("startup")}
              >
                Know More
              </button>
            </div>

            {/* Pilot Card */}
            <div className="service-card">
              <div
                className="service-icon-tile"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0d6efd"
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
                Run a real-world paid pilot with an established company.
              </p>
              <button
                className="btn btn-sm"
                onClick={() => openServiceModal("pilot")}
              >
                Know More
              </button>
            </div>

            {/* Grant Card */}
            <div className="service-card">
              <div
                className="service-icon-tile"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0d6efd"
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
                Find central/state government grants, check eligibility and apply.
              </p>
              <button
                className="btn btn-sm"
                onClick={() => openServiceModal("grant")}
              >
                Know More
              </button>
            </div>

            {/* Investment Card */}
            <div className="service-card">
              <div
                className="service-icon-tile"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0d6efd"
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
                Reach investors in your industry and share your pitch and document.
              </p>
              <button
                className="btn btn-sm"
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
