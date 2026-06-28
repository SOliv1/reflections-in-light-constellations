// server/routes/randomImage.js
import express from "express";
import cloudinary from "../cloudinary.js";

const router = express.Router();

const FOLDER_ALIASES = {
  reflections: "reflections-in-light",
};

const SEASON_FOLDERS = new Set(["winter", "spring", "summer", "autumn"]);

async function findImagesInFolder(folder) {
  return cloudinary.search
    .expression(`asset_folder:${folder}`)
    .sort_by("public_id", "desc")
    .max_results(200)
    .execute();
}

router.get("/", async (req, res) => {
  const requestedFolder = req.query.folder;

  if (!requestedFolder) {
    return res.status(400).json({ error: "Missing folder parameter" });
  }

  if (!/^[a-z0-9_-]+$/i.test(requestedFolder)) {
    return res.status(400).json({ error: "Invalid folder parameter" });
  }

  try {
    let selectedFolder = FOLDER_ALIASES[requestedFolder] || requestedFolder;
    let result = await findImagesInFolder(selectedFolder);

    // Not every season has its own Cloudinary folder yet. Keep the carousel
    // alive with the general reflections collection until that folder exists.
    if (
      (!result.resources || result.resources.length === 0) &&
      SEASON_FOLDERS.has(requestedFolder)
    ) {
      selectedFolder = FOLDER_ALIASES.reflections;
      result = await findImagesInFolder(selectedFolder);
    }

    if (!result.resources || result.resources.length === 0) {
      return res.status(404).json({ error: "No images found" });
    }

    const random =
      result.resources[Math.floor(Math.random() * result.resources.length)];

    // Prefer Cloudinary's canonical, versioned URL. Generating a URL from the
    // public ID alone can point at a stale asset version after folder changes.
    const url = random.secure_url;

    res.json({ url, folder: selectedFolder });
  } catch (err) {
    console.error("Cloudinary Search API error:", err);
    res.status(500).json({ error: "Cloudinary search failed" });
  }
});

export default router;
