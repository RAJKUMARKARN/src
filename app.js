import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";

// Routes
import adsRoutes from "./routes/ads.js";
import advertiserRoutes from "./routes/advertiserRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import trackingRoutes from "./routes/tracking.js";

// Middleware
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Middlewares
app.use(cors());
app.use(morgan("dev"));

// Stripe requires raw body for webhooks
app.use("/webhooks", bodyParser.raw({ type: "application/json" }));

// Parse JSON bodies
app.use(express.json());

// API Routes
app.use("/ads", adsRoutes);
app.use("/advertisers", advertiserRoutes);
app.use("/wallet", walletRoutes);
app.use("/track", trackingRoutes);

// Health check route
app.get("/", (req, res) => res.json({ status: "ok" }));

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;