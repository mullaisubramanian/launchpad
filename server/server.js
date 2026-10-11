import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import schemeRoutes from "./routes/schemeRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { db } from "./data/db.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Initialize DB file
db.read();

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    product: "LaunchBridge Platform API",
    timestamp: new Date().toISOString()
  });
});

// Mount modular API routes
app.use("/api/auth", authRoutes);
app.use("/api/schemes", schemeRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api", userRoutes);

// Production: serve built static files from dist
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 LaunchBridge Node.js Server listening on port ${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log(`===============================================`);
});

export default app;
