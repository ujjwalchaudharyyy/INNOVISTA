import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

dotenv.config();

import authRoutes from "./routes/auth";
import linksRoutes from "./routes/links";
import redirectRoutes from "./routes/redirect";
import analyticsRoutes from "./routes/analytics";
import campaignsRoutes from "./routes/campaigns";
import bulkRoutes from "./routes/bulk";
import adminRoutes from "./routes/admin";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

// Permissive CORS for development & cross-port communication
app.use(cors({ origin: true, credentials: true }));

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Rate limiting for API protection
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { error: "Too many requests from this IP, please try again later." },
});
app.use("/api/", generalLimiter);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "LinkPulse Engine",
    timestamp: new Date().toISOString(),
  });
});

// Short URL Redirect Engine (High Priority: Mounted on /r)
app.use("/r", redirectRoutes);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/links", linksRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/campaigns", campaignsRoutes);
app.use("/api/bulk", bulkRoutes);
app.use("/api/admin", adminRoutes);

// 404 handler for unknown API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`🚀 LinkPulse Backend Engine running on http://localhost:${PORT}`);
  console.log(`🔗 Short links resolving at http://localhost:${PORT}/r/:code`);
});

export default app;