import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";

// Import routes (case must match filenames exactly!)
import adsRoutes from "./routes/ads.js";
import adAccountRoutes from "./routes/adAccountRoutes.js";
import advertiserRoutes from "./routes/advertiserRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import trackingRoutes from "./routes/Tracking.js";

// Import error middleware
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

// ================== Middlewares ==================
// Parse JSON bodies
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Stripe (or other webhooks) require raw body
app.use("/webhooks", bodyParser.raw({ type: "application/json" }));



// ================== API Routes ==================
app.use("/ads", adsRoutes);               // Ad CRUD
app.use("/ad-accounts", adAccountRoutes); // Ad Account CRUD
app.use("/advertisers", advertiserRoutes);// Advertiser routes
app.use("/wallet", walletRoutes);         // Wallet routes
app.use("/track", trackingRoutes);        // Tracking routes

// Health check
app.get("/", (req, res) => {
  res.json({ message: "API is working 🚀" });
});

// ================== Error Handling ==================
app.use(notFound);
app.use(errorHandler);

export default app;
