import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    advertiserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdAccount", // or "Advertiser" if that’s your model name
      required: true,
      unique: true,
    },
    walletBalance: { type: Number, default: 500 }, // total (free + paid)
    freeCredits: { type: Number, default: 500 },   // signup bonus
    paidCredits: { type: Number, default: 0 },     // top-ups
    totalSpent: { type: Number, default: 0 },
    lowBalanceThreshold: { type: Number, default: 5 }, // warning threshold
    transactions: [
      {
        type: {
          type: String,
          enum: ["BONUS", "DEBIT", "CREDIT"],
          required: true,
        },
        amount: { type: Number, required: true },
        source: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// 🔹 Pre-save hook → auto-update walletBalance = free + paid
walletSchema.pre("save", function (next) {
  this.walletBalance = (this.freeCredits || 0) + (this.paidCredits || 0);
  next();
});

// 🔹 Method: Add credits (e.g. top-up)
walletSchema.methods.credit = function (amount, source = "TOPUP") {
  this.paidCredits += amount;
  this.transactions.push({ type: "CREDIT", amount, source });
  return this.save();
};

// 🔹 Method: Spend credits (use free first, then paid)
walletSchema.methods.debit = function (amount) {
  if (this.walletBalance < amount) throw new Error("Insufficient wallet balance");

  let remaining = amount;

  // Spend free credits first
  if (this.freeCredits > 0) {
    const used = Math.min(this.freeCredits, remaining);
    this.freeCredits -= used;
    remaining -= used;
  }

  // Then spend paid credits
  if (remaining > 0) {
    this.paidCredits -= remaining;
    remaining = 0;
  }

  this.totalSpent += amount;
  this.transactions.push({ type: "DEBIT", amount, source: "AD_SPEND" });

  return this.save();
};

const Wallet = mongoose.model("Wallet", walletSchema);

export default mongoose.model('Wallet', walletSchema);