import AdAccount from "../models/AdAccount.js";
import User from "../models/User.js";

// Create Ad Account + auto-create User
export async function createAdAccount(req, res) {
  try {
    // 1. Auto-generate a user
    const user = new User({ email: req.body.businessEmail, role: "advertiser" });
    await user.save();

    // 2. Prevent duplicate ad accounts
    const existingAccount = await AdAccount.findOne({ userId: user._id });
    if (existingAccount) {
      return res.status(400).json({ error: "Ad account already exists for this user" });
    }

    // 3. Create ad account linked to userId
    const adAccount = new AdAccount({
      ...req.body,
      userId: user._id,
    });
    await adAccount.save();

    res.status(201).json({
      message: "Ad account created successfully",
      adAccount,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Get Ad Account by User ID
export async function getAdAccount(req, res) {
  try {
    const adAccount = await AdAccount.findOne({ userId: req.params.userId });
    if (!adAccount) return res.status(404).json({ error: "Ad account not found" });

    res.json(adAccount);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Update Ad Account
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
