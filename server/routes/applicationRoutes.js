import { Router } from "express";
import { db } from "../data/db.js";
import { syncApplicationToSupabase, syncApplicationStatusToSupabase } from "../supabase.js";

const router = Router();

// GET /api/applications - list applications with optional filters (userId, schemeId)
router.get("/", (req, res) => {
  const { userId, schemeId } = req.query;
  const data = db.read();
  let apps = data.apps || [];

  if (userId) {
    apps = apps.filter((a) => a.userId === userId);
  }
  if (schemeId) {
    apps = apps.filter((a) => a.schemeId === schemeId);
  }

  return res.json({ success: true, applications: apps });
});

// POST /api/applications - submit new application
router.post("/", (req, res) => {
  const { schemeId, userId, startupName, desc, fileName, fileData } = req.body;

  if (!schemeId || !userId || !startupName || !desc) {
    return res.status(400).json({
      success: false,
      message: "schemeId, userId, startupName and desc are required"
    });
  }

  const data = db.read();

  // Prevent duplicate applications
  const existing = data.apps.find((a) => a.schemeId === schemeId && a.userId === userId);
  if (existing) {
    return res.status(409).json({
      success: false,
      message: "You have already applied to this scheme",
      application: existing
    });
  }

  const newApp = {
    id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    schemeId,
    userId,
    startupName: startupName.trim(),
    desc: desc.trim(),
    fileName: fileName || "",
    fileData: fileData || "",
    status: "Registered",
    created: new Date().toISOString(),
    updated: new Date().toISOString()
  };

  data.apps.unshift(newApp);
  db.write(data);

  // Sync to Supabase
  syncApplicationToSupabase(newApp).catch(() => {});

  return res.status(201).json({ success: true, application: newApp });
});

// PATCH /api/applications/:id/status - update application status
router.patch("/:id/status", (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ success: false, message: "Status is required" });
  }

  const data = db.read();
  const app = data.apps.find((a) => a.id === req.params.id);

  if (!app) {
    return res.status(404).json({ success: false, message: "Application not found" });
  }

  app.status = status;
  app.updated = new Date().toISOString();
  db.write(data);

  // Sync status to Supabase
  syncApplicationStatusToSupabase(app.id, status).catch(() => {});

  return res.json({ success: true, application: app });
});

export default router;
