import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectToDb, getDbStatus } from "./db.js";
import backgroundRoutes from "./routes/background.js";
import daysRoutes from "./routes/days.js";
import galleryRoutes from "./routes/gallery.js";
import randomImageRoute from "./routes/randomImage.js";
import shareRoutes from "./routes/share.js";
import uploadRoute from "./routes/upload.js";
import weatherRoutes from "./routes/weather.js";

dotenv.config();

const app = express();
const release =
  process.env.RAILWAY_GIT_COMMIT_SHA ||
  process.env.RAILWAY_DEPLOYMENT_ID ||
  "local";

const configuredOrigins = (process.env.CORS_ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const defaultOrigins = [
  "http://localhost",
  "http://localhost:3000",
  "https://reflections-in-light.onrender.com",
];

function isAllowedOrigin(origin) {
  if (!origin) return true;

  const allowedLocal = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/i;
  if (allowedLocal.test(origin)) return true;
  if (configuredOrigins.includes(origin) || defaultOrigins.includes(origin)) {
    return true;
  }
  if (/^https:\/\/.+\.netlify\.app$/i.test(origin)) return true;
  if (/^https:\/\/.+\.onrender\.com$/i.test(origin)) return true;
  if (/^https:\/\/.+\.up\.railway\.app$/i.test(origin)) return true;

  return false;
}

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("API running");
});

app.get("/health", async (_req, res) => {
  try {
    await connectToDb();
  } catch (error) {
    const dbStatus = getDbStatus();
    return res.status(503).json({
      app: "ok",
      release,
      db: dbStatus.state,
      dbError: dbStatus.error || error.message,
      timestamp: new Date().toISOString(),
    });
  }

  const dbStatus = getDbStatus();
  return res.json({
    app: "ok",
    release,
    db: dbStatus.state,
    dbError: dbStatus.error,
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/gallery", galleryRoutes);
app.use("/api/background", backgroundRoutes);
app.use("/api/days", daysRoutes);
app.use("/api/upload", uploadRoute);
app.use("/api/share", shareRoutes);
app.use("/days", daysRoutes);
app.use("/upload", uploadRoute);
app.use("/api", weatherRoutes);
app.use("/random-image", randomImageRoute);

export default app;
