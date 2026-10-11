import { Router } from "express";
import { db } from "../data/db.js";
import { syncUserToSupabase, findUserInSupabase } from "../supabase.js";

const router = Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, pass, role } = req.body;
  if (!email || !pass) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  const trimmedEmail = email.toLowerCase().trim();
  const trimmedPass = (pass || "").trim();
  const data = db.read();

  let user = data.users.find((u) => {
    const matchEmail = (u.email || "").toLowerCase().trim() === trimmedEmail;
    const matchPass = (u.pass || "").trim() === trimmedPass;
    const matchRole = role ? (u.role || "").toLowerCase() === role.toLowerCase() : true;
    return matchEmail && matchPass && matchRole;
  });

  // If not found in local db, check Supabase
  if (!user) {
    const suUser = await findUserInSupabase(email, pass);
    if (suUser && (!role || suUser.role?.toLowerCase() === role.toLowerCase())) {
      user = {
        id: suUser.id,
        role: suUser.role?.toLowerCase() || "startup",
        name: suUser.name,
        phone: suUser.phone,
        email: suUser.email,
        pass: suUser.pass,
        city: suUser.city,
        state: suUser.state,
        pincode: suUser.pincode,
        org: suUser.org,
        created: suUser.created_at
      };
      data.users.push(user);
      db.write(data);
    }
  }

  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid email, password, or role" });
  }

  // Sync to Supabase in background
  syncUserToSupabase(user).catch(() => {});

  // Omit password from response
  const { pass: _, ...safeUser } = user;
  return res.json({ success: true, user: safeUser });
});

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name, phone, email, pass, city, state, pincode, role } = req.body;

  if (!name || !email || !pass || !phone || !city || !state || !pincode || !role) {
    return res.status(400).json({ success: false, message: "All registration fields are required" });
  }

  const normalizedRole = role.toLowerCase().trim();
  const trimmedEmail = email.toLowerCase().trim();

  const data = db.read();
  const exists = data.users.find(
    (u) =>
      (u.email || "").toLowerCase().trim() === trimmedEmail &&
      (u.role || "").toLowerCase().trim() === normalizedRole
  );

  if (exists) {
    const displayRole = normalizedRole.charAt(0).toUpperCase() + normalizedRole.slice(1);
    return res.status(409).json({ success: false, message: `You already have a ${displayRole} account with this email. Please login.` });
  }

  const newUser = {
    id: `u_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    role,
    name: name.trim(),
    phone: phone.trim(),
    email: email.toLowerCase().trim(),
    pass,
    city: city.trim(),
    state: state.trim(),
    pincode: pincode.trim(),
    org: role === "startup" ? `${name.trim()}'s Venture` : `${name.trim()}'s Org`,
    created: new Date().toISOString()
  };

  data.users.push(newUser);
  db.write(data);

  // Sync newly registered user to Supabase
  await syncUserToSupabase(newUser);

  const { pass: _, ...safeUser } = newUser;
  return res.status(201).json({ success: true, user: safeUser });
});

// POST /api/auth/forgot-password
router.post("/forgot-password", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  const data = db.read();
  const user = data.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "No account found with this email. Demo password is demo123."
    });
  }

  return res.json({
    success: true,
    name: user.name,
    hint: user.pass
  });
});

export default router;
