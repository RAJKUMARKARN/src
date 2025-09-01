import express from "express";

const router = express.Router();

// Example route
router.get("/", (req, res) => {
  res.json({ message: "Tracking route working 🚀" });
});

export default router;
