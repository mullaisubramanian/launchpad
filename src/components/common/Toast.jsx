import React from "react";
import { useApp } from "../../context/AppContext";

export const ToastContainer = () => {
  const { toasts } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div id="toast-container">
      {toasts.map((toast) => {
        const borderLeftColor =
          toast.type === "bad"
            ? "var(--bad)"
            : toast.type === "ok"
            ? "var(--ok)"
            : toast.type === "warn"
            ? "var(--acc)"
            : "var(--pri)";

        const iconStroke =
          toast.type === "bad"
            ? "#dc2626"
            : toast.type === "ok"
            ? "#15803d"
            : toast.type === "warn"
            ? "#f59e0b"
            : "#0d9488";

        return (
          <div key={toast.id} className="toast" style={{ borderLeftColor }}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke={iconStroke}
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
};
