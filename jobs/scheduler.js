import cron from "node-cron";
import Ad from "../models/Ad.js";

// Example: run every midnight to deactivate expired ads
cron.schedule("0 0 * * *", async () => {
  console.log("Running daily ad check...");

  try {
    const now = new Date();
    const result = await Ad.updateMany(
      { "schedule.end": { $lt: now } },
      { $set: { active: false } }
    );

    console.log(`Deactivated ${result.modifiedCount} expired ads`);
  } catch (err) {
    console.error("Error in scheduler:", err.message);
  }
});
