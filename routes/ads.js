import express from 'express';
const router = express.Router();

import {
  createAd,
  getAds,
  getAdById,
  updateAd,
  deleteAd,
} from '../controllers/adController.js';

// router.get("/", (req, res) => {
//   res.json({ message: "Ads route working 🚀" });
// });



// Ad CRUD endpoints
router.post("/", createAd);
router.get("/", getAds);
router.get("/:id", getAdById);
router.put("/:id", updateAd);
router.delete("/:id", deleteAd);

export default router;