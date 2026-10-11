import { Store } from "./storage";

export const Auth = {
  getCurrentUser() {
    const id = Store.getSessionUserId();
    if (!id) return null;
    const data = Store.get();
    return data.users.find(u => u.id === id) || null;
  },

  login(email, pass) {
    const data = Store.get();
    const user = data.users.find(
      u => u.email.toLowerCase() === email.toLowerCase().trim() && u.pass === pass
    );
    if (user) {
      Store.setSessionUserId(user.id);
      return user;
    }
    return null;
  },

  logout() {
    Store.setSessionUserId(null);
  },

  getDefaultRoute(role) {
    if (role === "startup") return "#/apply";
    return "#/applicants";
  }
};
