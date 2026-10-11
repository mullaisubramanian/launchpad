import { Store } from "./storage";

export const Auth = {
  getCurrentUser() {
    const sessionUser = Store.getSessionUser();
    const id = Store.getSessionUserId() || sessionUser?.id;
    if (!id && !sessionUser) return null;

    const data = Store.get();
    const storeUser = data.users.find(
      (u) =>
        (id && u.id === id) ||
        (sessionUser?.id && u.id === sessionUser.id) ||
        (sessionUser?.email && u.email?.toLowerCase() === sessionUser.email.toLowerCase())
    );

    if (storeUser) {
      return storeUser;
    }
    return sessionUser || null;
  },

  login(email, pass) {
    const data = Store.get();
    const user = data.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.pass === pass
    );
    if (user) {
      Store.setSessionUser(user);
      return user;
    }
    return null;
  },

  logout() {
    Store.setSessionUser(null);
  },

  getDefaultRoute(role) {
    if (role === "startup") return "#/apply";
    return "#/applicants";
  }
};
