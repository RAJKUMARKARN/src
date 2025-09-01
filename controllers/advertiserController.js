import Advertiser from '../models/Advertiser.js';
import Wallet from '../models/Wallet.js';

// Create new advertiser and auto-create wallet
export async function createAdvertiser(req, res) {
  try {
    const advertiser = new Advertiser(req.body);
    await advertiser.save();

    const wallet = new Wallet({
      advertiserId: advertiser._id,
      walletBalance: 0,
      totalSpent: 0,
    });
    await wallet.save();

    res.status(201).json({ advertiser, wallet });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// ✅ You MUST export this too
export async function getAdvertiserById(req, res) {
  try {
    const advertiser = await Advertiser.findById(req.params.id);
    if (!advertiser) return res.status(404).json({ error: 'Advertiser not found' });

    res.json(advertiser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
