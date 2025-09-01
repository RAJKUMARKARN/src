import Wallet from "../models/Wallet.js";

// Get wallet for advertiser
export async function getWallet(req, res) {
  try {
    const wallet = await Wallet.findOne({ advertiserId: req.params.advertiserId });
    if (!wallet) return res.status(404).json({ error: "Wallet not found" });
    res.json(wallet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Top up wallet
export async function topUpWallet(req, res) {
  try {
    const { advertiserId, amount } = req.body;
    const wallet = await Wallet.findOne({ advertiserId });
    if (!wallet) return res.status(404).json({ error: "Wallet not found" });

    await wallet.credit(amount);  // <--- uses model method

    res.json({ message: "Wallet topped up successfully", wallet });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}


// Spend from wallet
export async function spendFromWallet(req, res) {
  try {
    const { advertiserId, amount } = req.body;
    const wallet = await Wallet.findOne({ advertiserId });
    if (!wallet) return res.status(404).json({ error: "Wallet not found" });

    await wallet.debit(amount);

    // Optional: Check for low balance
    if (wallet.walletBalance <= wallet.lowBalanceThreshold) {
      return res.json({
        message: "Spent successfully, but wallet balance is low",
        wallet,
      });
    }

    res.json({ message: "Amount deducted successfully", wallet });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
