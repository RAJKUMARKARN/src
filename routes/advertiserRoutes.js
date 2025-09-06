import express from "express";
import {
  registerAdvertiser,   // ✅ correct name
  loginAdvertiser,
  getAllAdvertisers,
} from "../controllers/advertiserController.js";

const router = express.Router();

// Register new advertiser
router.post("/register", registerAdvertiser);

// Login
router.post("/login", loginAdvertiser);

// Get all advertisers
router.get("/", getAllAdvertisers);

export default router;
