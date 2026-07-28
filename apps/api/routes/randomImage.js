// server/routes/randomImage.js
import express from "express";
import cloudinary from "../cloudinary.js";

const router = express.Router();

const FOLDER_ALIASES = {
  reflections: "reflections-in-light",
  constellations: process.env.CLOUDINARY_CONSTELLATIONS_FOLDER || "constellations",
};

const SEASON_FOLDERS = new Set(["winter", "spring", "summer", "autumn"]);
const FALLBACK_TO_REFLECTIONS = new Set(["constellations", ...SEASON_FOLDERS]);

async function findImagesInFolder(folder) {
  return cloudinary.search
    .expression(`asset_folder:${folder}`)
    .sort_by("public_id", "desc")
    .max_results(200)
    .execute();
}

const LEGACY_CONSTELLATION_PATTERN = /^sunset\d*(?:_|$)/i;

function selectPool(resources, requestedFolder) {
  if (requestedFolder !== "constellations") return resources;

  const constellationAssets = resources.filter((asset) =>
    !LEGACY_CONSTELLATION_PATTERN.test(
      asset.filename || asset.display_name || asset.public_id || ""
    )
  );

  return constellationAssets.length > 0 ? constellationAssets : resources;
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
      FALLBACK_TO_REFLECTIONS.has(requestedFolder)
    ) {
      selectedFolder = FOLDER_ALIASES.reflections;
      result = await findImagesInFolder(selectedFolder);
    }

    if (!result.resources || result.resources.length === 0) {
      return res.status(404).json({ error: "No images found" });
    }

    const pool = selectPool(result.resources, requestedFolder);
    const random = pool[Math.floor(Math.random() * pool.length)];

    // Prefer Cloudinary's canonical, versioned URL. Generating a URL from the
    // public ID alone can point at a stale asset version after folder changes.
    const url = random.secure_url;

    res.json({ url, folder: selectedFolder, poolSize: pool.length });
  } catch (err) {
    console.error("Cloudinary Search API error:", err);
    res.status(500).json({ error: "Cloudinary search failed" });
  }
});

export default router;
