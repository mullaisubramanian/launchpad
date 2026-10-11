import React, { useEffect } from "react";
import { useApp } from "../../context/AppContext";

export const Modal = () => {
  const { modal, closeModal } = useApp();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && modal.isOpen) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modal.isOpen, closeModal]);

  if (!modal.isOpen) return null;

  return (
    <div
      className="modal-overlay open"
      id="app-modal-overlay"
      onClick={(e) => {
        if (e.target.id === "app-modal-overlay") {
          closeModal();
        }
      }}
    >
      <div className="modal-box" id="app-modal-content">
        <button
          className="modal-close-btn"
          onClick={closeModal}
          title="Close"
          aria-label="Close"
        >
          &times;
        </button>
        {modal.content}
      </div>
    </div>
  );
};
