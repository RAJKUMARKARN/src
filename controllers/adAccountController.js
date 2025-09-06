import AdAccount from "../models/AdAccount.js";
import User from "../models/User.js";

// ================== Create Ad Account + Auto-create User ==================
export async function createAdAccount(req, res) {
  try {
    // Step 1: Create a new user automatically from businessEmail
    const user = new User({
      email: req.body.businessEmail,
      role: "advertiser",
    });
    await user.save();

    // Step 2: Create Ad Account linked to that user
    const adAccount = new AdAccount({
      ...req.body,
      userId: user._id, // auto-linked
    });

    await adAccount.save();

    res.status(201).json({
      message: "Ad Account created successfully",
      adAccount,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// ================== Get Ad Account by User ID ==================
export async function getAdAccount(req, res) {
  try {
    const adAccount = await AdAccount.findOne({ userId: req.params.userId }).populate("userId");
    if (!adAccount) return res.status(404).json({ error: "Ad account not found" });

    res.json(adAccount);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ================== Update Ad Account ==================
export async function updateAdAccount(req, res) {
  try {
    const adAccount = await AdAccount.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!adAccount) return res.status(404).json({ error: "Ad account not found" });

    res.json({ message: "Ad account updated successfully", adAccount });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
