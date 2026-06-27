import express from "express";
import { connectToDb } from "../db.js";
import {
  addPhotoToDay,
  deletePhotoFromDay,
  getAllDays,
  getDayByDate,
  setDayMood
} from "../models/Day.js";
import { sendRouteError } from "../utils/apiErrors.js";
import { DAY_DATE_MESSAGE, normalizeDayDate } from "../utils/dayDate.js";

const router = express.Router();

router.post("/add-photo", async (req, res) => {
  try {
    const { date: rawDate, photoUrl } = req.body;

    if (!rawDate || !photoUrl) {
      return res.status(400).json({ error: "Missing date or photoUrl" });
    }

    const date = normalizeDayDate(rawDate);
    if (!date) return res.status(400).json({ error: DAY_DATE_MESSAGE });

    const db = await connectToDb();
    await addPhotoToDay(db, date, photoUrl);
    return res.json({ ok: true });
  } catch (error) {
    console.error("Day add-photo error:", error);
    return sendRouteError(res, error, "Failed to add photo to day");
  }
});

router.post("/set-mood", async (req, res) => {
  try {
    const { date: rawDate, mood } = req.body;

    if (!rawDate || !mood) {
      return res.status(400).json({ error: "Missing date or mood" });
    }

    const date = normalizeDayDate(rawDate);
    if (!date) return res.status(400).json({ error: DAY_DATE_MESSAGE });

    const db = await connectToDb();
    await setDayMood(db, date, mood);
    return res.json({ ok: true });
  } catch (error) {
    console.error("Day set-mood error:", error);
    return sendRouteError(res, error, "Failed to save mood");
  }
});

router.get("/:date", async (req, res) => {
  try {
    const date = normalizeDayDate(req.params.date);
    if (!date) return res.status(400).json({ error: DAY_DATE_MESSAGE });
    const db = await connectToDb();
    const day = await getDayByDate(db, date);

    if (!day) {
      return res.json({ date, photos: [], mood: null });
    }

    return res.json(day);
  } catch (error) {
    console.error("Day fetch error:", error);
    return sendRouteError(res, error, "Failed to fetch day");
  }
});

router.post("/delete-photo", async (req, res) => {
  try {
    const { date: rawDate, photoUrl } = req.body;

    if (!rawDate || !photoUrl) {
      return res.status(400).json({ error: "Missing date or photoUrl" });
    }

    const date = normalizeDayDate(rawDate);
    if (!date) return res.status(400).json({ error: DAY_DATE_MESSAGE });

    const db = await connectToDb();
    await deletePhotoFromDay(db, date, photoUrl);
    const updatedDay = await getDayByDate(db, date);

    return res.json({
      ok: true,
      day: updatedDay || { date, photos: [], mood: null }
    });
  } catch (error) {
    console.error("Day delete-photo error:", error);
    return sendRouteError(res, error, "Failed to delete photo from day");
  }
});

router.get("/", async (req, res) => {
  try {
    const db = await connectToDb();
    const days = await getAllDays(db);
    return res.json(days);
  } catch (error) {
    console.error("Days fetch error:", error);
    return sendRouteError(res, error, "Failed to fetch days");
  }
});

export default router;
