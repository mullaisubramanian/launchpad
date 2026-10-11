import { STORAGE_KEY, SESSION_KEY } from "../data/constants";
import { SEED_USERS, SEED_SCHEMES, SEED_APPS } from "../data/seedData";

export class Store {
  static init() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        Store.resetSeedData();
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
}

// Ensure storage is initialized
Store.init();
