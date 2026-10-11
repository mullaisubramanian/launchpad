import { Router } from "express";
import { db } from "../data/db.js";

const router = Router();

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { email, pass } = req.body;
  if (!email || !pass) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  const data = db.read();
  const user = data.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.pass === pass
  );

  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  // Omit password from response
  const { pass: _, ...safeUser } = user;
  return res.json({ success: true, user: safeUser });
});

// POST /api/auth/register
router.post("/register", (req, res) => {
  const { name, phone, email, pass, city, state, pincode, role } = req.body;

  if (!name || !email || !pass || !phone || !city || !state || !pincode || !role) {
    return res.status(400).json({ success: false, message: "All registration fields are required" });
  }

  const data = db.read();
  const exists = data.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase().trim()
  );

  if (exists) {
    return res.status(409).json({ success: false, message: "This email is already registered. Please login." });
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
