import express from "express";
import cloudinary from "../cloudinary.js";
import multer from "multer";
import { connectToDb, getDbStatus } from "../db.js";
import { createGalleryItem } from "../models/Gallery.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.get("/health", async (_req, res) => {
  try {
    await connectToDb();
  } catch (error) {
    const dbStatus = getDbStatus();
    return res.status(503).json({
      app: "ok",
      route: "upload",
      db: dbStatus.state,
      dbError: dbStatus.error || error.message,
    });
  }

  const dbStatus = getDbStatus();
  return res.json({
    app: "ok",
    route: "upload",
    db: dbStatus.state,
    dbError: dbStatus.error,
  });
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "Sandbox" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(file.buffer);
    });

    // ⭐ Save to MongoDB
    const shouldSaveToGallery = req.body.saveToGallery !== "false";

    if (shouldSaveToGallery) {
      const db = await connectToDb();
      await createGalleryItem(db, {
        title: req.body.title || "Untitled",
        photoUrl: result.secure_url,
        mood: req.body.mood || null,
        season: req.body.season || null
      });
    }

    res.json({ photoUrl: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
