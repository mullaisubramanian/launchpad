import React from "react";
import { BRAND } from "../../data/constants";

export const Footer = () => {
  return (
    <footer>
      <div className="container">
        <p id="footer-text">© 2026 {BRAND}. All rights reserved.</p>
      </div>
    </footer>
  );
};
