import { STORAGE_KEY, SESSION_KEY } from "../data/constants";
import { SEED_USERS, SEED_SCHEMES, SEED_APPS } from "../data/seedData";

export class Store {
  static normalizeRole(role) {
    if (!role) return "startup";
    const r = String(role).trim().toLowerCase();
    if (r === "startup") return "startup";
    if (r === "pilot") return "pilot";
    if (r === "grant") return "grant";
    if (r === "investor" || r === "investment") return "investor";
    return "startup";
  }

  static init() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        Store.resetSeedData();
      } else {
        // Run once on load: normalise every stored user's role and clean session
        const data = JSON.parse(raw);
        let changed = false;
        if (data && Array.isArray(data.users)) {
          data.users = data.users.map((u) => {
            const normalized = Store.normalizeRole(u.role);
            if (u.role !== normalized) {
              changed = true;
              return { ...u, role: normalized };
            }
            return u;
          });
        }
        if (changed) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }

        // Validate session
        const sessId = Store.getSessionUserId();
        const sessUser = Store.getSessionUser();
        const targetId = sessId || sessUser?.id;
        if (targetId) {
          const userExists = data.users.some((u) => u.id === targetId);
          if (!userExists) {
            Store.setSessionUser(null);
          } else if (sessUser && sessUser.role !== Store.normalizeRole(sessUser.role)) {
            sessUser.role = Store.normalizeRole(sessUser.role);
            Store.setSessionUser(sessUser);
          }
        }
      }
    } catch (e) {
      console.error("Storage initialization error:", e);
    }
  }

  static resetSeedData() {
    const initial = {
      users: JSON.parse(JSON.stringify(SEED_USERS)),
      schemes: JSON.parse(JSON.stringify(SEED_SCHEMES)),
      apps: JSON.parse(JSON.stringify(SEED_APPS))
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    } catch (e) {
      console.error("Failed to write seed data:", e);
    }
    return initial;
  }

  static get() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error("Failed to read storage:", e);
    }
    return Store.resetSeedData();
  }

  static save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save storage:", e);
    }
  }

  static getSessionUserId() {
    try {
      return localStorage.getItem(SESSION_KEY);
    } catch (e) {
      return null;
    }
  }

  static setSessionUserId(id) {
    try {
      if (id) localStorage.setItem(SESSION_KEY, id);
      else localStorage.removeItem(SESSION_KEY);
    } catch (e) {
      console.error("Failed to set session:", e);
    }
  }

  static getSessionUser() {
    try {
      const raw = localStorage.getItem("launchbridge_platform_session_user");
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error("Failed to get session user:", e);
    }
    return null;
  }

  static setSessionUser(user) {
    try {
      if (user) {
        localStorage.setItem("launchbridge_platform_session_user", JSON.stringify(user));
        localStorage.setItem(SESSION_KEY, user.id);
      } else {
        localStorage.removeItem("launchbridge_platform_session_user");
        localStorage.removeItem(SESSION_KEY);
      }
    } catch (e) {
      console.error("Failed to set session user:", e);
    }
  }
}

// Ensure storage is initialized
Store.init();
