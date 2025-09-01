import Ad from '../models/Ad.js';

// Create new ad
export async function createAd(req, res) {
  try {
    const ad = new Ad(req.body);
    await ad.save();
    res.status(201).json(ad);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Get all ads
export async function getAds(req, res) {
  try {
    const ads = await Ad.find();
    res.json(ads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get single ad by ID
export async function getAdById(req, res) {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ error: 'Ad not found' });
    res.json(ad);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Update ad
export async function updateAd(req, res) {
  try {
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ad) return res.status(404).json({ error: 'Ad not found' });
    res.json(ad);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Delete ad
export async function deleteAd(req, res) {
  try {
    const ad = await Ad.findByIdAndDelete(req.params.id);
    if (!ad) return res.status(404).json({ error: 'Ad not found' });
    res.json({ message: 'Ad deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
