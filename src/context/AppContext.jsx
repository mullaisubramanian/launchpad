import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Store } from "../services/storage";
import { Auth } from "../services/auth";
import { api } from "../services/api";
import { supabaseSyncProfile } from "../services/supabase";

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
        // Sync local store cache while preserving credentials and offline registered users
        const local = Store.get();
        const serverUsers = res.data.users || [];

        // Map server users and keep passwords from local users if known
        const mergedUsers = serverUsers.map((u) => {
          const localUser = local.users.find(
            (lu) => lu.id === u.id || lu.email.toLowerCase() === u.email.toLowerCase()
          );
          return {
            ...u,
            pass: localUser?.pass || u.pass || "demo123"
          };
        });

        // Add any local users that aren't on the server yet so they aren't lost
        local.users.forEach((lu) => {
          if (
            !mergedUsers.some(
              (mu) => mu.id === lu.id || mu.email.toLowerCase() === lu.email.toLowerCase()
            )
          ) {
            mergedUsers.push(lu);
          }
        });

        const merged = {
          users: mergedUsers,
          schemes: res.data.schemes && res.data.schemes.length ? res.data.schemes : local.schemes,
          apps: res.data.apps && res.data.apps.length ? res.data.apps : local.apps
        };
        Store.save(merged);
        setData(merged);

        // Keep current session user synchronized
        const active = Auth.getCurrentUser();
        if (active) {
          setCurrentUser(active);
        }
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
    const active = Auth.getCurrentUser();
    if (active) {
      setCurrentUser(active);
    }
  }, []);

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
    setCurrentRoute(hash);
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    }
  }, []);

  const handleLogin = useCallback(
    async (email, pass, role) => {
      // Clear previous session first
      Store.setSessionUser(null);
      setCurrentUser(null);

      // Re-read latest users from localStorage before checking credentials
      const local = Store.get();
      setData(local);

      // Perform login using Auth.login (email + pass + role)
      const result = Auth.login(email, pass, role);
      if (!result.success) {
        return result;
      }

      const user = result.user;
      setCurrentUser(user);

      // Reset page states in sessionStorage if any
      try {
        window.sessionStorage.removeItem("expanded_scheme_id");
      } catch {}

      // Background sync
      supabaseSyncProfile(user).catch(() => {});
      api.login(email, pass, role).catch(() => {});

      return { success: true, user };
    },
    []
  );

  const handleLogout = useCallback(() => {
    // Full reset on logout: remove session, set currentUser = null, reset page state, navigate to #/home
    Auth.logout();
    setCurrentUser(null);
    try {
      window.sessionStorage.removeItem("expanded_scheme_id");
    } catch {}
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
