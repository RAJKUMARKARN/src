import express from "express";
const router = express.Router();

import {
  createAd,
  getAds,
  getAdById,
  updateAd,
  deleteAd,
  publishAd,
} from "../controllers/adController.js";

import { upload } from "../middleware/upload.js"; // ✅ keep this one only

// Create Draft Ad with file upload
router.post("/", upload.single("media"), createAd);

// Publish Ad
router.post("/publish/:adId", publishAd);

// Existing CRUD endpoints
router.get("/", getAds);
router.get("/:id", getAdById);
router.put("/:id", updateAd);
router.delete("/:id", deleteAd);

export default router;
