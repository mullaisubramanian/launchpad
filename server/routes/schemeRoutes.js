import { Router } from "express";
import { db } from "../data/db.js";

const router = Router();

// GET /api/schemes - list schemes with optional filters
router.get("/", (req, res) => {
  const { type, dept, ownerId } = req.query;
  const data = db.read();
  let schemes = data.schemes || [];

  if (type) {
    schemes = schemes.filter((s) => s.type === type);
  }
  if (dept && dept !== "All industries") {
    schemes = schemes.filter((s) => s.dept === dept);
  }
  if (ownerId) {
    schemes = schemes.filter((s) => s.ownerId === ownerId);
  }

  return res.json({ success: true, schemes });
});

// GET /api/schemes/:id - get single scheme
router.get("/:id", (req, res) => {
  const data = db.read();
  const scheme = data.schemes.find((s) => s.id === req.params.id);
  if (!scheme) {
    return res.status(404).json({ success: false, message: "Scheme not found" });
  }
  return res.json({ success: true, scheme });
});

// POST /api/schemes - create new scheme
router.post("/", (req, res) => {
  const { type, ownerId, company, name, amount, dept, desc, eligibility, grantKind } = req.body;

  if (!type || !ownerId || !company || !name || !amount || !dept || !desc || !eligibility) {
    return res.status(400).json({ success: false, message: "All required scheme fields must be filled" });
  }

  const data = db.read();
  const newScheme = {
    id: `s_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    type,
    ownerId,
    company: company.trim(),
    name: name.trim(),
    amount: amount.trim(),
    dept,
    desc: desc.trim(),
    eligibility: eligibility.trim(),
    grantKind: type === "grant" ? grantKind || "Grant" : undefined,
    created: new Date().toISOString()
  };

  data.schemes.unshift(newScheme);
  db.write(data);

  return res.status(201).json({ success: true, scheme: newScheme });
});

// PUT /api/schemes/:id - update scheme
router.put("/:id", (req, res) => {
  const data = db.read();
  const idx = data.schemes.findIndex((s) => s.id === req.params.id);

  if (idx === -1) {
    return res.status(404).json({ success: false, message: "Scheme not found" });
  }

  const existing = data.schemes[idx];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id,
    created: existing.created
  };

  data.schemes[idx] = updated;
  db.write(data);

  return res.json({ success: true, scheme: updated });
});

// DELETE /api/schemes/:id - delete scheme and associated applications
router.delete("/:id", (req, res) => {
  const data = db.read();
  const schemeId = req.params.id;

  const exists = data.schemes.some((s) => s.id === schemeId);
  if (!exists) {
    return res.status(404).json({ success: false, message: "Scheme not found" });
  }

  data.schemes = data.schemes.filter((s) => s.id !== schemeId);
  data.apps = data.apps.filter((a) => a.schemeId !== schemeId);
  db.write(data);

  return res.json({ success: true, message: "Scheme and associated applications deleted" });
});

export default router;
