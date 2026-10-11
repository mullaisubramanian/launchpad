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
          <div className="hero-left" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div className="hero-tag" style={{ color: "var(--pri)", fontWeight: 700, fontSize: "clamp(24px, 3.5vw, 42px)", marginBottom: "16px", lineHeight: 1.2 }}>
              Choose your service and scheme
            </div>
            <h1 className="hero-headline" style={{ fontWeight: 800, color: "#ffffff", fontSize: "clamp(32px, 4.8vw, 56px)", lineHeight: 1.15, marginBottom: "28px" }}>
              Track your<br />progress every<br />second
            </h1>
            <button
              className="btn btn-lg"
              style={{ borderRadius: "6px", padding: "10px 28px", fontSize: "16px", fontWeight: "600", background: "var(--pri)", color: "#ffffff", border: "none", cursor: "pointer" }}
              onClick={() => {
                if (currentUser) {
                  navigate(currentUser.role === "startup" ? "#/apply" : "#/applicants");
                } else {
                  navigate("#/register");
                }
              }}
            >
              Discover more
            </button>
          </div>

          <div className="hero-right">
            {/* Exact undraw_Tree_swing_646s from 1-stop.web.app */}
            <svg
              className="hero-illustration"
              viewBox="0 0 1006 830"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: "100%", maxWidth: "560px", height: "auto" }}
            >
              <g id="undraw_Tree_swing_646s" clipPath="url(#clip0_hero)">
                <path d="M462.918 28.5253C463.527 29.9749 463.981 31.4902 464.271 33.0436C463.612 30.674 463.095 29.0655 462.918 28.5253Z" fill="#3F3D56" />
                <path d="M483.784 103.593C483.784 103.593 483.784 105.287 482.031 111.402L483.784 103.593Z" fill="#3F3D56" />
                <path d="M698.541 362.355C652.282 387.525 591.768 409.257 573.643 415.556C587.463 411.799 627.689 406.74 690.014 447.332C768.324 498.322 852.055 464.324 852.055 464.324C852.055 464.324 833.448 501.564 793.905 503.982C754.362 506.413 651.247 438.43 616.362 457.854C581.465 477.278 565.187 452.992 551.225 501.563C537.276 550.123 511.694 682.848 541.157 757.314L570.609 831.768H403.145C403.145 831.768 463.624 663.424 430.279 559.835C411.614 501.821 385.408 459.806 375.634 438.455C370.73 427.76 369.954 422.26 376.305 422.53C379.916 422.69 385.832 424.715 394.618 428.718C394.618 428.718 354.299 387.439 341.126 387.439C327.941 387.439 265.909 380.969 245.761 359.114C245.761 359.114 217.075 338.07 165.899 389.87C114.724 441.671 127.133 441.671 81.3912 437.62C36.3672 433.629 1.09378 410.829 -6.10352e-05 410.117C1.30549 410.669 53.8922 432.61 86.037 421.437C118.605 410.105 146.516 367.205 175.203 352.644C203.89 338.07 220.944 318.646 259.711 339.69L234.164 276.815L227.166 259.589L227.154 259.564C227.154 259.564 218.615 141.401 202.337 133.309C186.059 125.206 196.139 104.174 165.899 100.122C165.899 100.122 203.113 95.2598 210.088 121.977C217.075 148.681 265.145 292.751 265.145 292.751C265.145 292.751 294.596 354.252 327.164 339.69C359.733 325.116 314.756 243.382 314.756 243.382L258.935 216.665C258.935 216.665 300.806 215.044 326.388 240.14C351.97 265.224 353.522 346.161 353.522 346.161C353.522 346.161 417.871 355.873 433.385 392.302C433.385 392.302 443.464 359.924 424.081 340.501C419.235 335.639 414.143 327.191 409.238 317.258C390.646 279.134 383.927 235.899 390.019 193.594C392.901 172.894 394.677 152.647 391.513 147.871C384.538 137.349 355.075 72.6069 352.746 55.6018C350.429 38.6091 355.075 3.00287 355.075 3.00287C355.075 3.00287 355.851 46.7003 365.155 60.4639C374.458 74.2276 400.816 142.211 400.816 142.211C400.816 142.211 400.816 227.997 422.529 270.086C444.241 312.175 486.101 359.114 483.784 389.87V407.674C483.784 407.674 530.301 361.545 527.196 346.161C524.091 330.789 520.221 294.36 490.758 272.517C461.295 250.662 441.912 215.854 462.848 165.674C474.621 137.447 479.773 122.284 482.031 114.413L469.822 168.916C469.822 168.916 462.071 224.756 483.784 244.18C483.842 244.229 483.889 244.278 483.948 244.327C505.625 263.775 534.171 299.222 534.171 299.222L534.089 297.663L527.972 182.679L529.313 185.749L538.981 207.874L548.132 228.808C548.132 228.808 591.545 170.536 642.72 151.112C693.883 131.689 725.675 63.7053 725.675 63.7053L769.1 28.0868L733.426 72.6069C733.426 72.6069 722.57 125.206 661.327 162.445C600.072 199.672 560.541 254.702 558.212 288.7C555.883 322.698 553.554 352.644 553.554 352.644C553.554 352.644 668.302 348.592 693.883 295.981C719.477 243.382 740.413 240.951 740.413 240.951L725.675 286.269L709.397 325.116C709.397 325.116 776.075 326.737 810.96 368.016C845.857 409.294 932.682 421.437 932.682 421.437L883.847 435.189C883.847 435.189 837.318 419.006 793.129 389.06C748.94 359.114 753.586 332.409 698.541 362.355Z" fill="#3F3D56" />
                <path opacity="0.1" d="M723.264 248.928C718.36 271.593 712.585 293.485 704.469 310.17C678.887 362.782 564.14 366.833 564.14 366.833C564.14 366.833 564.681 359.884 565.504 348.92C594.638 346.415 674.277 335.721 695.06 292.981C696.965 289.077 698.729 284.878 700.4 280.458L723.264 248.928Z" fill="black" />
                <path opacity="0.1" d="M544.757 313.412C544.757 313.412 516.07 277.793 494.369 258.369C489.606 254.121 486.266 248.105 483.948 241.328C483.76 240.787 483.584 240.235 483.407 239.682C483.913 240.198 484.419 240.701 484.96 241.18C503.955 258.185 528.314 287.603 534.089 294.663C534.9 295.67 535.347 296.223 535.347 296.223L529.313 182.749L538.982 204.874L544.757 313.412Z" fill="black" />
                <path opacity="0.1" d="M561.362 211.219C561.193 231.146 558.716 242.997 558.716 242.997C558.716 242.997 602.115 184.749 653.272 165.312C656.295 163.316 659.363 161.35 662.502 159.442C723.752 122.212 734.607 69.6039 734.607 69.6039L770.271 25.0898L726.854 60.7011C726.854 60.7011 695.066 128.686 643.895 148.111C609.014 161.351 577.742 192.637 561.362 211.219Z" fill="black" />
                <path opacity="0.1" d="M494.364 404.058V421.863C494.364 421.863 540.883 375.73 537.782 360.353C535.41 348.593 532.571 324.529 518.195 304.083C524.675 319.535 526.647 334.607 528.372 343.164C530.596 354.191 507.306 381.031 493.949 395.336C494.417 398.216 494.557 401.144 494.364 404.058V404.058Z" fill="black" />
                <path opacity="0.1" d="M431.963 281.866C432.332 282.686 432.712 283.493 433.114 284.274C445.003 307.323 462.928 331.824 476.339 354.33C465.5 332.042 446.637 306.556 431.963 281.866Z" fill="black" />
                <path opacity="0.1" d="M691.189 444.332C665.684 427.725 643.884 418.763 626.076 414.223C607.396 421.562 592.021 427.035 584.285 429.722C598.16 425.973 638.356 420.993 700.598 461.521C749.434 493.32 800.377 492.066 831.807 486.619C840.5 479.773 847.785 471.172 853.23 461.328C853.23 461.328 769.496 495.321 691.189 444.332Z" fill="black" />
                <path opacity="0.1" d="M469.762 247.409C463.51 231.418 462.479 212.389 469.662 190.091C469.572 182.01 470.019 173.933 470.999 165.916L483.207 111.401C480.957 119.262 475.807 134.429 464.021 162.679C449.102 198.443 454.67 226.389 469.762 247.409Z" fill="black" />
                <path opacity="0.1" d="M812.138 365.016C787.943 336.39 748.465 326.841 726.534 323.674L719.981 339.31C719.981 339.31 786.659 340.928 821.548 382.205C840.895 405.095 876.213 419.021 903.843 426.889L933.863 418.433C933.863 418.433 847.028 406.293 812.138 365.016Z" fill="black" />
                <path opacity="0.1" d="M337.75 353.878C370.314 339.31 325.345 257.566 325.345 257.566L324.115 256.977C335.326 281.669 351.585 326.29 328.341 336.689C306.591 346.42 286.227 322.21 275.099 305.058C275.503 306.271 275.725 306.936 275.725 306.936C275.725 306.936 305.187 368.446 337.75 353.878Z" fill="black" />
                <path opacity="0.1" d="M443.969 406.486C443.969 406.486 453.781 374.913 435.348 355.42C439.868 372.213 434.559 389.296 434.559 389.296C422.564 361.122 381.346 348.934 363.292 344.857C363.993 354.237 364.111 360.353 364.111 360.353C364.111 360.353 428.462 370.065 443.969 406.486Z" fill="black" />
                <path opacity="0.1" d="M483.207 111.401C484.955 105.298 484.955 103.597 484.955 103.597L483.207 111.401Z" fill="black" />
                <path opacity="0.1" d="M96.1564 435.777C96.3128 435.724 96.4716 435.676 96.6269 435.622C129.19 424.291 157.102 381.396 185.788 366.828C214.475 352.259 231.532 332.835 270.298 353.878C270.298 353.878 263.516 324.899 250.373 305.86C254.726 315.799 258.245 326.114 260.888 336.689C222.123 315.646 205.066 335.07 176.379 349.638C147.692 364.207 119.781 407.102 87.2175 418.433C54.6542 429.764 1.15741 407.102 1.15741 407.102C1.15741 407.102 36.8219 430.573 82.5656 434.62C87.7984 435.083 92.2634 435.491 96.1564 435.777Z" fill="black" />
                <path opacity="0.1" d="M237.74 273.754C237.74 273.754 236.47 273.778 234.164 273.815L227.166 256.589C227.931 256.577 228.331 256.565 228.331 256.565C228.331 256.565 222.944 182.037 212.57 147.303C212.699 147.364 212.805 147.438 212.923 147.499C229.201 155.59 237.74 273.754 237.74 273.754Z" fill="black" />
                <path opacity="0.1" d="M419.395 828.772C433.601 783.312 467.765 657.603 440.868 574.021C429.252 537.925 418.485 514.907 409.383 500.223C416.189 514.124 423.631 532.511 431.458 556.831C464.797 660.428 404.322 828.772 404.322 828.772H419.395Z" fill="black" />
                <path opacity="0.1" d="M405.203 442.908C395.848 438.614 385.836 436.09 375.634 435.455C370.73 424.761 369.954 419.26 376.305 419.531C378.069 419.862 379.845 420.255 381.609 420.709C394.077 431.514 405.203 442.908 405.203 442.908Z" fill="black" />
                <path opacity="0.1" d="M195.31 122.448C196.194 124.003 197.266 125.433 198.498 126.703C197.593 125.163 196.523 123.736 195.31 122.448V122.448Z" fill="black" />
                <path opacity="0.1" d="M336.975 254.328C338.173 255.511 339.296 256.775 340.336 258.111C336.94 249.588 332.746 242.219 327.566 237.139C301.98 212.049 260.113 213.668 260.113 213.668L312.619 238.789C321.616 242.293 329.884 247.568 336.975 254.328Z" fill="black" />
                <path opacity="0.1" d="M392.692 144.873C395.856 149.644 394.079 169.891 391.19 190.598C385.1 232.901 391.822 276.134 410.415 314.255C412.885 319.356 415.644 324.299 418.677 329.059C400.957 291.501 394.65 249.189 400.599 207.787C403.488 187.08 405.266 166.833 402.102 162.063C395.124 151.541 365.662 86.7931 363.336 69.7968C362.638 63.203 362.476 56.5596 362.85 49.9372C356.827 32.0991 356.252 0 356.252 0C356.252 0 351.6 35.6114 353.926 52.6076C356.252 69.6037 385.714 134.352 392.692 144.873Z" fill="black" />
                <path opacity="0.1" d="M465.429 32.9839C465.118 31.3843 464.646 29.8234 464.021 28.3272C464.021 28.3272 464.617 30.074 465.429 32.9839Z" fill="black" />
                <path opacity="0.1" d="M191.584 114.496C198.417 115.369 206.277 117.558 212.272 122.633C211.881 121.252 211.54 120.014 211.268 118.974C204.29 92.2658 167.075 97.1219 167.075 97.1219C183.893 99.3726 188.237 106.882 191.584 114.496Z" fill="black" />

                {/* Leaf clusters in #009688 */}
                <g id="Leaf1">
                  <path d="M922.725 787.189C911.162 805.7 914.33 829.243 914.33 829.243C914.33 829.243 936.246 822.774 947.809 804.264C959.372 785.753 956.203 762.21 956.203 762.21C956.203 762.21 934.288 768.679 922.725 787.189Z" fill="#3F3D56" />
                  <path d="M931.411 790.462C930.497 812.54 914.797 829.762 914.797 829.762C914.797 829.762 900.579 811.19 901.493 789.112C902.407 767.034 918.107 749.812 918.107 749.812C918.107 749.812 932.325 768.384 931.411 790.462Z" fill="#009688" />
                </g>
                <path d="M1006 827.544H58.0041V830H1006V827.544Z" fill="#3F3D56" />

                {/* Animated Swing & Girl */}
                <g id="Girl" className="swinging-girl">
                  <path d="M702.547 721.083H700.195V452.382C700.197 451.287 699.964 450.206 699.513 449.218C699.063 448.229 698.407 447.358 697.592 446.669L699.078 444.764C700.164 445.684 701.039 446.845 701.639 448.163C702.239 449.481 702.55 450.923 702.547 452.382V721.083Z" fill="#3F3D56" />
                  <path d="M727.752 653.747C727.752 653.747 741.057 639.176 746.503 642.108C751.948 645.039 730.845 658.068 730.845 658.068L727.752 653.747Z" fill="#FFB9B9" />
                  <path opacity="0.1" d="M727.752 653.747C727.752 653.747 741.057 639.176 746.503 642.108C751.948 645.039 730.845 658.068 730.845 658.068L727.752 653.747Z" fill="black" />
                  <path d="M687.158 621.945C687.158 621.945 682.267 631.097 683.547 640.962C684.827 650.827 696.531 682.483 700.51 681.92C704.489 681.358 733.964 658.685 733.964 658.685L728.343 650.491L706.81 664.11C706.81 664.11 703.53 615.401 687.158 621.945Z" fill="#D0CDE1" />
                  <path d="M766.999 644.223L733.432 663.47C733.237 663.605 733.016 663.694 732.785 663.73C732.554 663.767 732.319 663.75 732.095 663.681C731.87 663.612 731.664 663.493 731.489 663.331C731.313 663.17 731.174 662.97 731.081 662.747L722.858 644.804C722.702 644.293 722.728 643.74 722.929 643.246C723.131 642.752 723.496 642.351 723.958 642.114L751.827 627.119C752.17 626.903 752.578 626.828 752.971 626.906C753.365 626.985 753.717 627.212 753.96 627.544L767.881 641.235C768.018 641.49 768.104 641.771 768.133 642.062C768.163 642.353 768.136 642.647 768.053 642.926C767.971 643.206 767.835 643.465 767.654 643.688C767.472 643.91 767.25 644.093 766.999 644.223V644.223Z" fill="#2F2E41" />
                  <path d="M764.759 641.572L733.29 660.348L724.916 644.593L751.911 629.268L764.759 641.572Z" fill="#009688" />
                  <path d="M738.355 636.145C738.519 635.94 738.516 635.656 738.348 635.51C738.181 635.364 737.913 635.412 737.749 635.617C737.585 635.822 737.588 636.106 737.755 636.252C737.923 636.398 738.191 636.35 738.355 636.145Z" fill="#F2F2F2" />
                  <path d="M749.938 652.176C750.047 652.039 750.045 651.85 749.934 651.753C749.822 651.656 749.643 651.688 749.534 651.824C749.425 651.961 749.427 652.15 749.538 652.247C749.65 652.345 749.829 652.313 749.938 652.176Z" fill="#F2F2F2" />
                  <path opacity="0.1" d="M687.158 621.945C687.158 621.945 682.267 631.097 683.547 640.962C684.827 650.827 696.531 682.483 700.51 681.92C704.489 681.358 733.964 658.685 733.964 658.685L728.343 650.491L706.81 664.11C706.81 664.11 703.53 615.401 687.158 621.945Z" fill="black" />
                  <path d="M718.757 656.531C718.757 656.531 733.815 643.956 738.834 647.624C743.853 651.292 721.267 661.247 721.267 661.247L718.757 656.531Z" fill="#FFB9B9" />
                  <path d="M698.68 606.231C706.719 606.231 713.236 599.428 713.236 591.036C713.236 582.645 706.719 575.842 698.68 575.842C690.641 575.842 684.124 582.645 684.124 591.036C684.124 599.428 690.641 606.231 698.68 606.231Z" fill="#FFB9B9" />
                  <path d="M748.873 696.876C748.873 696.876 764.432 698.972 763.93 708.927C763.429 718.882 751.884 760.275 751.884 760.275L750.88 776.517C750.88 776.517 751.884 803.763 748.873 803.239C745.861 802.715 738.834 783.853 738.834 783.853C738.834 783.853 730.301 778.089 734.317 772.85C738.332 767.61 741.344 768.134 740.34 762.37C739.336 756.607 739.838 732.505 742.85 725.169C745.861 717.834 747.616 713.788 747.616 713.788L737.83 713.118L748.873 696.876Z" fill="#FFB9B9" />
                  <path opacity="0.1" d="M748.873 696.876C748.873 696.876 764.432 698.972 763.93 708.927C763.429 718.882 751.884 760.275 751.884 760.275L750.88 776.517C750.88 776.517 751.884 803.763 748.873 803.239C745.861 802.715 738.834 783.853 738.834 783.853C738.834 783.853 730.301 778.089 734.317 772.85C738.332 767.61 741.344 768.134 740.34 762.37C739.336 756.607 739.838 732.505 742.85 725.169C745.861 717.834 747.616 713.788 747.616 713.788L737.83 713.118L748.873 696.876Z" fill="black" />
                  <path d="M749.877 699.495C749.877 699.495 764.934 703.163 766.44 713.642C767.946 724.121 775.475 755.035 775.475 755.035L783.506 774.421C783.506 774.421 796.054 797.999 790.532 797.475C785.011 796.951 777.482 785.424 774.973 785.424C772.463 785.424 764.934 782.281 765.436 780.185C765.938 778.089 769.452 771.802 769.452 771.802L757.308 749.72C754.963 745.457 753.191 740.878 752.041 736.112C750.794 730.94 749.375 724.605 749.375 722.55C749.375 718.882 739.336 717.31 739.336 717.31L749.877 699.495Z" fill="#FFB9B9" />
                  <path d="M700.688 665.962L707.715 686.921C707.715 686.921 718.757 690.064 726.788 692.684C734.819 695.304 749.877 691.636 751.382 697.924C752.888 704.211 748.371 715.214 743.853 717.834C739.336 720.454 736.826 723.073 722.271 718.882C707.715 714.69 673.082 713.642 673.082 713.642C669.725 715.745 665.944 717.001 662.04 717.31C655.515 717.834 654.009 718.358 652.001 716.786C649.993 715.214 653.005 715.214 654.009 711.023C655.013 706.831 655.515 708.403 660.032 703.687C664.549 698.972 668.063 684.825 670.572 680.109C673.082 675.393 674.588 665.962 674.588 665.962H700.688Z" fill="#2F2E41" />
                  <path d="M699.684 603.611C697.861 605.002 696.369 606.813 695.324 608.903C694.28 610.993 693.711 613.306 693.661 615.662C693.661 623.522 678.603 607.279 678.603 607.279C678.603 607.279 686.634 596.8 686.634 593.656C686.634 590.513 699.684 603.611 699.684 603.611Z" fill="#FFB9B9" />
                  <path d="M680.611 600.468C680.611 600.468 689.646 604.135 691.653 609.375C693.661 614.614 701.19 625.618 701.19 625.618C701.19 625.618 711.73 637.145 708.217 649.72C704.703 662.295 701.692 665.438 701.692 667.534C701.692 669.63 696.672 673.298 692.657 672.774C688.642 672.25 673.584 670.154 672.58 668.058C671.576 665.962 665.553 636.097 669.569 625.094C672.826 616.685 676.512 608.465 680.611 600.468V600.468Z" fill="#D0CDE1" />
                  <path d="M702.902 591.728C706.159 592.535 709.356 590.368 712.025 588.22C713.54 587.001 715.208 585.261 714.744 583.298C714.332 581.557 712.367 580.57 712.081 578.8C711.882 577.57 712.571 576.374 712.626 575.127C712.577 574.177 712.278 573.259 711.763 572.475C711.247 571.69 710.535 571.068 709.704 570.678C708.117 569.785 706.317 569.413 704.687 568.615C702.197 567.396 700.128 565.198 697.469 564.494C693.837 563.533 690.138 565.58 686.404 565.845C684.144 566.006 681.855 565.508 679.619 565.895C677.487 566.345 675.562 567.532 674.154 569.263C672.746 570.995 671.938 573.17 671.86 575.44C671.831 577.107 672.15 578.968 671.197 580.29C670.82 580.746 670.391 581.151 669.92 581.497C666.598 584.301 665.091 588.985 664.919 593.498C664.835 595.719 665.28 598.357 667.168 599.301C668.179 599.662 669.247 599.817 670.315 599.757C670.851 599.734 671.384 599.848 671.869 600.089C672.353 600.331 672.773 600.692 673.093 601.142C673.953 602.725 672.664 605.064 673.789 606.446C674.634 607.484 676.282 607.139 677.268 606.255C678.255 605.37 678.87 604.098 679.806 603.153C681.625 601.313 684.324 600.98 686.817 600.7C687.556 600.694 688.275 600.448 688.874 599.996C689.327 599.5 689.622 598.869 689.718 598.191C690.046 596.63 690.05 595.013 689.73 593.45C689.572 592.966 689.552 592.445 689.673 591.949C689.838 591.597 690.092 591.299 690.409 591.089C691.954 589.877 694.662 588.112 696.671 588.446C698.9 588.816 700.653 591.171 702.902 591.728Z" fill="#2F2E41" />
                  <path d="M682.619 619.33C682.619 619.33 676.596 627.713 676.596 637.669C676.596 647.624 684.124 680.633 688.14 680.633C692.155 680.633 724.278 662.295 724.278 662.295L719.761 653.387L696.673 663.866C696.673 663.866 699.684 615.138 682.619 619.33Z" fill="#D0CDE1" />
                  <path d="M750.77 713.904H635.505V737.232H750.77V713.904Z" fill="#009688" />
                  <path d="M693.138 738.459C690.643 738.456 688.252 737.421 686.488 735.579C684.724 733.738 683.731 731.241 683.728 728.637V452.382C683.728 450.525 684.233 448.705 685.183 447.135C686.134 445.565 687.491 444.308 689.098 443.511C690.705 442.713 692.496 442.408 694.262 442.63C696.029 442.852 697.699 443.592 699.078 444.764L697.592 446.669C696.557 445.789 695.305 445.234 693.98 445.068C692.655 444.901 691.312 445.131 690.107 445.729C688.902 446.327 687.884 447.269 687.172 448.447C686.459 449.625 686.081 450.989 686.081 452.382V728.637C686.083 730.59 686.827 732.463 688.15 733.844C689.473 735.225 691.267 736.002 693.138 736.004V738.459Z" fill="#3F3D56" />
                  <path d="M675.352 584.173C675.859 583.749 675.28 582.119 674.06 580.532C672.839 578.946 671.44 578.005 670.933 578.429C670.427 578.854 671.005 580.484 672.226 582.07C673.446 583.656 674.846 584.598 675.352 584.173Z" fill="#009688" />
                </g>

                {/* Additional leaves */}
                <g id="leaf11">
                  <path d="M574.578 787.189C563.015 805.7 566.183 829.243 566.183 829.243C566.183 829.243 588.098 822.774 599.661 804.264C611.224 785.753 608.056 762.21 608.056 762.21C608.056 762.21 586.141 768.679 574.578 787.189Z" fill="#3F3D56" />
                  <path d="M583.263 790.462C582.349 812.54 566.65 829.762 566.65 829.762C566.65 829.762 552.432 811.19 553.346 789.112C554.26 767.034 569.959 749.812 569.959 749.812C569.959 749.812 584.177 768.384 583.263 790.462Z" fill="#009688" />
                </g>
                <g id="leaf10">
                  <path d="M384.286 794.191C389.814 815.523 408.748 828.734 408.748 828.734C408.748 828.734 418.72 807.36 413.192 786.028C407.664 764.697 388.73 751.485 388.73 751.485C388.73 751.485 378.758 772.86 384.286 794.191Z" fill="#3F3D56" />
                  <path d="M392.409 789.607C407.578 805.021 409.43 828.717 409.43 828.717C409.43 828.717 386.69 827.421 371.521 812.006C356.352 796.592 354.499 772.896 354.499 772.896C354.499 772.896 377.24 774.192 392.409 789.607Z" fill="#009688" />
                </g>
                <path d="M342.133 211.239C340.814 233.294 324.801 250.2 324.801 250.2C324.801 250.2 310.927 231.347 312.245 209.292C313.564 187.236 329.577 170.33 329.577 170.33C329.577 170.33 343.451 189.183 342.133 211.239Z" fill="#009688" />
                <path d="M175.215 71.808C193.122 83.5934 199.653 106.369 199.653 106.369C199.653 106.369 177.151 110.037 159.244 98.2512C141.337 86.4658 134.805 63.6902 134.805 63.6902C134.805 63.6902 157.307 60.0225 175.215 71.808Z" fill="#009688" />
                <path d="M135.225 340.696C153.132 352.482 159.664 375.257 159.664 375.257C159.664 375.257 137.162 378.925 119.254 367.14C101.347 355.354 94.8153 332.578 94.8153 332.578C94.8153 332.578 117.317 328.911 135.225 340.696Z" fill="#009688" />
                <path d="M499.273 111.117C493.873 132.485 475.018 145.819 475.018 145.819C475.018 145.819 464.918 124.51 470.319 103.143C475.719 81.7755 494.574 68.4412 494.574 68.4412C494.574 68.4412 504.674 89.7501 499.273 111.117Z" fill="#009688" />
                <path d="M669.625 127.778C663.278 148.86 643.849 161.263 643.849 161.263C643.849 161.263 634.71 139.487 641.057 118.405C647.405 97.3233 666.834 84.9197 666.834 84.9197C666.834 84.9197 675.972 106.696 669.625 127.778Z" fill="#009688" />
                <path d="M853.749 362.407C842.251 380.962 820.358 387.514 820.358 387.514C820.358 387.514 817.107 363.984 828.605 345.429C840.103 326.874 861.995 320.321 861.995 320.321C861.995 320.321 865.246 343.852 853.749 362.407Z" fill="#009688" />
              </g>
              <defs>
                <clipPath id="clip0_hero">
                  <rect width="1006" height="830" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION (Matching 1-stop.web.app exactly: 2 columns, left gif/illustration, right heading + paragraphs) */}
      <section className="about-section" id="about" style={{ padding: "80px 0 60px", background: "var(--dark)" }}>
        <div className="container" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "40px" }}>
          <div style={{ flex: "1 1 420px", maxWidth: "500px", textAlign: "center" }}>
            <img
              src="https://i.pinimg.com/originals/81/2c/22/812c229c60047ee347f778135cd76b81.gif"
              alt="About 1STOP"
              style={{ width: "100%", maxWidth: "480px", borderRadius: "12px", boxShadow: "0 8px 30px rgba(0,0,0,0.3)" }}
              loading="lazy"
            />
          </div>
          <div style={{ flex: "1 1 500px", maxWidth: "620px" }}>
            <h2 style={{ fontSize: "clamp(32px, 4.5vw, 48px)", fontWeight: 800, color: "var(--pri)", marginBottom: "20px", textAlign: "left" }}>
              About {BRAND}
            </h2>
            <p style={{ color: "#f8f9fa", fontSize: "15.5px", lineHeight: 1.7, marginBottom: "16px", textAlign: "justify" }}>
              A platform that enables startups to scout the right investors, gov grants and the right pilot opportunities
              for their startup, in which they can connect, apply and track the progress of every application in
              the same platform.
            </p>
            <p style={{ color: "#f8f9fa", fontSize: "15.5px", lineHeight: 1.7, marginBottom: "16px", textAlign: "justify" }}>
              Startups using this platform gain access to a curated network of investors who are interested in funding
              innovative ventures. The platform facilitates the scouting process, allowing startups to showcase their ideas,
              business plans, and growth potential to these investors. By providing a streamlined communication channel, it
              enables startups to establish valuable connections and pitch their concepts more effectively.
            </p>
            <p style={{ color: "#f8f9fa", fontSize: "15.5px", lineHeight: 1.7, textAlign: "justify" }}>
              Moreover, the platform helps startups navigate the landscape of government grants. It provides information
              about various grant programs and assists in identifying opportunities that align with the startups' industry and
              objectives. Startups can explore the eligibility criteria, application requirements, and deadlines for different
              grants, all within the platform.
            </p>
          </div>
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
