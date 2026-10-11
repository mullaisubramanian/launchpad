import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Store } from "../services/storage";
import { Auth } from "../services/auth";
import { api } from "../services/api";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(() => Store.get());
  const [currentUser, setCurrentUser] = useState(() => Auth.getCurrentUser());
  const [toasts, setToasts] = useState([]);
  const [modal, setModal] = useState({ isOpen: false, content: null });
  const [currentRoute, setCurrentRoute] = useState(() => window.location.hash || "#/home");
  const [serverOnline, setServerOnline] = useState(false);

  // Sync state from server on mount
  const syncFromServer = useCallback(async () => {
    try {
      const res = await api.getAllData();
      if (res && res.success && res.data) {
        setServerOnline(true);
        // Sync local store cache
        const local = Store.get();
        const merged = {
          users: res.data.users && res.data.users.length ? res.data.users : local.users,
          schemes: res.data.schemes || local.schemes,
          apps: res.data.apps || local.apps
        };
        Store.save(merged);
        setData(merged);
      } else {
        setServerOnline(false);
      }
    } catch {
      setServerOnline(false);
    }
  }, []);

  useEffect(() => {
    syncFromServer();
  }, [syncFromServer]);

  const refreshData = useCallback(() => {
    const updated = Store.get();
    setData(updated);
    setCurrentUser(Auth.getCurrentUser());
    syncFromServer();
  }, [syncFromServer]);

  const showToast = useCallback((message, type = "pri") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const openModal = useCallback((content) => {
    setModal({ isOpen: true, content });
  }, []);

  const closeModal = useCallback(() => {
    setModal({ isOpen: false, content: null });
  }, []);

  const navigate = useCallback((hash) => {
    if (window.location.hash === hash) {
      setCurrentRoute(hash);
    } else {
      window.location.hash = hash;
    }
  }, []);

  const handleLogin = useCallback(
    async (email, pass) => {
      // Attempt backend API login first
      try {
        const res = await api.login(email, pass);
        if (res && res.success && res.user) {
          Store.setSessionUserId(res.user.id);
          setCurrentUser(res.user);
          refreshData();
          return res.user;
        }
      } catch (e) {
        console.warn("Server login fallback to local store:", e);
      }

      // Fallback to local storage auth
      const user = Auth.login(email, pass);
      if (user) {
        setCurrentUser(user);
        refreshData();
        return user;
      }
      return null;
    },
    [refreshData]
  );

  const handleLogout = useCallback(() => {
    Auth.logout();
    setCurrentUser(null);
    showToast("Logged out successfully");
    navigate("#/home");
  }, [navigate, showToast]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || "#/home";
      setCurrentRoute(hash);
      window.scrollTo(0, 0);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <AppContext.Provider
      value={{
        data,
        setData,
        currentUser,
        setCurrentUser,
        refreshData,
        toasts,
        showToast,
        modal,
        openModal,
        closeModal,
        currentRoute,
        navigate,
        login: handleLogin,
        logout: handleLogout,
        serverOnline,
        api
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
