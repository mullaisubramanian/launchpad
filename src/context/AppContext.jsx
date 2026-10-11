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
    async (email, pass) => {
      // 1. Attempt backend API login first
      try {
        const res = await api.login(email, pass);
        if (res && res.success && res.user) {
          // Store user into local storage so local cache always has this user
          const local = Store.get();
          const userIdx = local.users.findIndex(
            (u) => u.id === res.user.id || u.email.toLowerCase() === res.user.email.toLowerCase()
          );
          if (userIdx >= 0) {
            local.users[userIdx] = { ...local.users[userIdx], ...res.user };
          } else {
            local.users.push(res.user);
          }
          Store.save(local);
          Store.setSessionUser(res.user);

          setData(local);
          setCurrentUser(res.user);
          supabaseSyncProfile(res.user).catch(() => {});
          return res.user;
        }
      } catch (e) {
        console.warn("Server login fallback to local store:", e);
      }

      // 2. Fallback to local storage auth
      const user = Auth.login(email, pass);
      if (user) {
        Store.setSessionUser(user);
        setCurrentUser(user);
        setData(Store.get());
        supabaseSyncProfile(user).catch(() => {});
        return user;
      }
      return null;
    },
    []
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
