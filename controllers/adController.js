import Ad from "../models/Ad.js";
import AdAccount from "../models/AdAccount.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

// ================== CREATE AD ==================
export async function createAd(req, res) {
  try {
    const data = req.body;

    // Check if advertiser has an account
    const adAccount = await AdAccount.findById(data.advertiserId);
    if (!adAccount) {
      return res.status(404).json({ error: "Ad Account not found" });
    }

    // ================== FILE UPLOAD ==================
    if (req.file) {
      data.contentUrl = req.file.path;

      // If video, check 30-second max duration
      if (data.adType === "Video") {
        const duration = await new Promise((resolve, reject) => {
          ffmpeg.ffprobe(data.contentUrl, (err, metadata) => {
            if (err) reject(err);
            else resolve(metadata.format.duration);
          });
        });

        if (duration > 30) {
          fs.unlinkSync(data.contentUrl); // delete video
          return res.status(400).json({ error: "Video exceeds 30 seconds" });
        }
      }
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

      // Limit geo to only one location (country + region + city)
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
    data.uniqueUrl = `/ads/preview/${uuidv4()}`;

    // Save ad as draft initially
    data.status = "draft";

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

// ================== PUBLISH AD ==================
export async function publishAd(req, res) {
  try {
    const { adId } = req.params;

    const ad = await Ad.findById(adId);
    if (!ad) return res.status(404).json({ error: "Ad not found" });

    // Validate Free ad rules again before publishing
    if (ad.adModel === "Free") {
      if (ad.targetInterests?.length > 5) {
        return res
          .status(400)
          .json({ error: "Free ads can have a maximum of 5 interests" });
      }
      const geo = ad.targeting?.geo;
      if (geo?.country && geo?.region && geo?.city) {
        // OK, only one geo-location allowed
      }
    }

    ad.status = "active";
    await ad.save();

    res.json({ message: "Ad published successfully", ad });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ================== GET ALL ADS ==================
export async function getAds(req, res) {
  try {
    const ads = await Ad.find();
    res.json(ads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ================== GET SINGLE AD ==================
export async function getAdById(req, res) {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ error: "Ad not found" });
    res.json(ad);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ================== UPDATE AD ==================
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

// ================== DELETE AD ==================
export async function deleteAd(req, res) {
  try {
    const ad = await Ad.findByIdAndDelete(req.params.id);
    if (!ad) return res.status(404).json({ error: "Ad not found" });
    res.json({ message: "Ad deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
