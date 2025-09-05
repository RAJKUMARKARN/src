import express from "express";
import {
  createAdAccount,
  getAdAccount,
  updateAdAccount,
} from "../controllers/adAccountController.js";

const router = express.Router();

// Create new ad account
router.post("/account/create", createAdAccount);

// Get ad account by userId
router.get("/account/:userId", getAdAccount);

// Update ad account
router.put("/account/:userId", updateAdAccount);

export default router;
