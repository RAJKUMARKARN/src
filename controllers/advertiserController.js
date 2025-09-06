import Advertiser from "../models/Advertiser.js";

// ================== REGISTER ADVERTISER ==================
export async function registerAdvertiser(req, res) {
  try {
    const { email, password, companyName } = req.body;

    // Validation
    if (!email || !password || !companyName) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if advertiser already exists
    const existing = await Advertiser.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Advertiser already exists" });
    }

    // Create and save advertiser
    const advertiser = new Advertiser({ email, password, companyName });
    await advertiser.save();

    // Remove password from response
    const advertiserObj = advertiser.toObject();
    delete advertiserObj.password;

    res.status(201).json({
      message: "Advertiser registered successfully",
      advertiser: advertiserObj,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// ================== LOGIN ADVERTISER ==================
export async function loginAdvertiser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find advertiser
    const advertiser = await Advertiser.findOne({ email });
    if (!advertiser) {
      return res.status(404).json({ error: "Advertiser not found" });
    }

    // Match password
    const isMatch = await advertiser.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Exclude password before sending response
    const advertiserObj = advertiser.toObject();
    delete advertiserObj.password;

    res.json({ message: "Login successful", advertiser: advertiserObj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ================== GET ALL ADVERTISERS ==================
export async function getAllAdvertisers(req, res) {
  try {
    const advertisers = await Advertiser.find().select("-password"); // exclude password
    res.json(advertisers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
