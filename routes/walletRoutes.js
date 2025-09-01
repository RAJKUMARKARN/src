import express from "express";
import { getWallet, topUpWallet, spendFromWallet } from "../controllers/walletController.js";

const router = express.Router();

router.get("/:advertiserId", getWallet);
router.post("/topup", topUpWallet);
router.post("/spend", spendFromWallet);

export default router;
