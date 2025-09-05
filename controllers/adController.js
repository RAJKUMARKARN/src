import Ad from "../models/Ad.js";
import AdAccount from "../models/AdAccount.js";
import { v4 as uuidv4 } from "uuid";

// ✅ Create new ad with rules
export async function createAd(req, res) {
  try {
    const data = req.body;

    // Check if advertiser has an account
    const adAccount = await AdAccount.findById(data.advertiserId);
    if (!adAccount) {
      return res.status(404).json({ error: "Ad Account not found" });
    }

    // ================= Free Ad Rules =================
    if (data.adModel === "Free") {
      // Allow only 1 free ad per advertiser
      const freeAdExists = await Ad.findOne({
        advertiserId: data.advertiserId,
        adModel: "Free",
      });
      if (freeAdExists) {
        return res.status(400).json({ error: "Free ad already used" });
      }

      // Give free credit
      data.billing = { balance: 1000, spent: 0 };

      // Limit interests
      if (data.targetInterests?.length > 5) {
        return res
          .status(400)
          .json({ error: "Free ads can have a maximum of 5 interests" });
      }

      // Limit geo to only one location (country + region + city max)
      if (data.targeting?.geo) {
        const { country, region, city } = data.targeting.geo;
        data.targeting.geo = {
          country: country || null,
          region: region || null,
          city: city || null,
        };
      }
    }
    // =================================================

    // Generate unique preview URL
    data.uniqueUrl = `/ads/${uuidv4()}`;

    // Save ad
    const ad = new Ad(data);
    await ad.save();

    res.status(201).json({
      message: "Ad created successfully",
      ad,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// ✅ Get all ads
export async function getAds(req, res) {
  try {
    const ads = await Ad.find();
    res.json(ads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ✅ Get single ad by ID
export async function getAdById(req, res) {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ error: "Ad not found" });
    res.json(ad);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ✅ Update ad
export async function updateAd(req, res) {
  try {
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!ad) return res.status(404).json({ error: "Ad not found" });
    res.json(ad);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// ✅ Delete ad
export async function deleteAd(req, res) {
  try {
    const ad = await Ad.findByIdAndDelete(req.params.id);
    if (!ad) return res.status(404).json({ error: "Ad not found" });
    res.json({ message: "Ad deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
