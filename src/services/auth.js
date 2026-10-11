import { Store } from "./storage";

export const Auth = {
  getCurrentUser() {
    const id = Store.getSessionUserId();
    const sessionUser = Store.getSessionUser();
    const targetId = id || sessionUser?.id;
    if (!targetId) return null;

    const data = Store.get();
    const storeUser = data.users.find((u) => u.id === targetId);

    if (storeUser) {
      storeUser.role = Store.normalizeRole(storeUser.role);
      return storeUser;
    }
    // If user no longer exists, clear invalid session
    Store.setSessionUser(null);
    return null;
  },

  login(email, pass, role) {
    const data = Store.get();
    const trimmedEmail = (email || "").trim().toLowerCase();
    const trimmedPass = (pass || "").trim();
    const targetRole = Store.normalizeRole(role);

    // 1. Check if ANY user exists with this email
    const usersWithEmail = data.users.filter(
      (u) => (u.email || "").trim().toLowerCase() === trimmedEmail
    );

    if (usersWithEmail.length === 0) {
      return {
        success: false,
        reason: "no_email",
        message: "No account found with this email. Please register first."
      };
    }

    // 2. Check if user exists with this email AND role
    const account = usersWithEmail.find(
      (u) => Store.normalizeRole(u.role) === targetRole
    );

    if (!account) {
      const displayRole = targetRole.charAt(0).toUpperCase() + targetRole.slice(1);
      return {
        success: false,
        reason: "wrong_role",
        message: `No ${displayRole} account with this email. Register as ${displayRole} or choose another role.`
      };
    }

    // 3. Check password
    if ((account.pass || "").trim() !== trimmedPass) {
      return {
        success: false,
        reason: "wrong_password",
        message: "Incorrect password."
      };
    }

    // Success: normalize role
    account.role = targetRole;
    Store.setSessionUser(account);
    return {
      success: true,
      user: account
    };
  },

  logout() {
    Store.setSessionUser(null);
  },

  getDefaultRoute(role) {
    const r = Store.normalizeRole(role);
    if (r === "startup") return "#/apply";
    return "#/applicants";
  }
};
