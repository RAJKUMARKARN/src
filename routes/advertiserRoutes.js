import express from 'express';
import {
  createAdvertiser,
  getAdvertiserById,
} from '../controllers/advertiserController.js';

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Advertisers route working 🚀" });
});


// Advertiser endpoints
router.post('/', createAdvertiser);
router.get('/:id', getAdvertiserById);

export default router;