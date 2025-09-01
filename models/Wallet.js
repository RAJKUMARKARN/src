import mongoose from 'mongoose';


const walletSchema = new mongoose.Schema(
{
advertiserId: { type: mongoose.Schema.Types.ObjectId, ref: 'Advertiser', required: true, unique: true },
walletBalance: { type: Number, default: 0 },
totalSpent: { type: Number, default: 0 },
lowBalanceThreshold: { type: Number, default: 5 } // USD or your currency
},
{ timestamps: true }
);


walletSchema.methods.credit = function (amount) {
this.walletBalance += amount;
return this.save();
};


walletSchema.methods.debit = function (amount) {
if (this.walletBalance < amount) throw new Error('Insufficient wallet balance');
this.walletBalance -= amount;
this.totalSpent += amount;
return this.save();
};


export default mongoose.model('Wallet', walletSchema);