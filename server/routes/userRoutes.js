import { Router } from "express";
import { db } from "../data/db.js";

const router = Router();

// GET /api/users/:id - get user profile
router.get("/:id", (req, res) => {
  const data = db.read();
  const user = data.users.find((u) => u.id === req.params.id);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const { pass: _, ...safeUser } = user;
  return res.json({ success: true, user: safeUser });
});

// PUT /api/users/:id - update user profile
router.put("/:id", (req, res) => {
  const { name, org, phone, city, state, pincode, newPass } = req.body;

  const data = db.read();
  const user = data.users.find((u) => u.id === req.params.id);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  if (name) user.name = name.trim();
  if (org !== undefined) user.org = org.trim();
  if (phone) user.phone = phone.trim();
  if (city) user.city = city.trim();
  if (state) user.state = state.trim();
  if (pincode) user.pincode = pincode.trim();
  if (newPass && newPass.trim().length >= 6) {
    user.pass = newPass.trim();
  }

  db.write(data);

  const { pass: _, ...safeUser } = user;
  return res.json({ success: true, user: safeUser });
});

// POST /api/data/reset - restore platform seed data
router.post("/reset-seed", (req, res) => {
  const resetData = db.reset();
  return res.json({ success: true, message: "Platform restored to seed data", data: resetData });
});

// GET /api/data/all - get full state for synchronized client cache
router.get("/all-data", (req, res) => {
  const data = db.read();
  const safeUsers = data.users.map(({ pass: _, ...u }) => u);
  return res.json({
    success: true,
    data: {
      users: safeUsers,
      schemes: data.schemes,
      apps: data.apps
    }
  });
});

export default router;
