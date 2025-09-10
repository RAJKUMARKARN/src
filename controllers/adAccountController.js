import AdAccount from "../models/AdAccount.js";
import Advertiser from "../models/Advertiser.js"; // use your Advertiser model, not User.js

// ================== Create Ad Account ==================
export async function createAdAccount(req, res) {
  try {
    const { userId, businessName, industrialSector, businessEmail } = req.body;

    // Step 1: Ensure advertiser exists
    const advertiser = await Advertiser.findById(userId);
    if (!advertiser) {
      return res.status(404).json({ error: "Advertiser not found" });
    }

    // Step 2: Prevent duplicate accounts for same user
    const existingAccount = await AdAccount.findOne({ userId });
    if (existingAccount) {
      return res
        .status(400)
        .json({ error: "Ad account already exists for this user" });
    }

    // Step 3: Create ad account
    const adAccount = new AdAccount({
      ...req.body,
      userId, // link to existing advertiser
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
    const adAccount = await AdAccount.findOne({
      userId: req.params.userId,
    }).populate("userId", "email role companyName"); // populate useful info

    if (!adAccount)
      return res.status(404).json({ error: "Ad account not found" });

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

    if (!adAccount)
      return res.status(404).json({ error: "Ad account not found" });

    res.json({
      message: "Ad account updated successfully",
      adAccount,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
