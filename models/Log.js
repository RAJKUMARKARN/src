import mongoose from 'mongoose';


const logSchema = new mongoose.Schema(
{
eventType: { type: String, enum: ['impression', 'click', 'conversion', 'debit', 'credit'], required: true },
adId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ad' },
advertiserId: { type: mongoose.Schema.Types.ObjectId, ref: 'Advertiser' },
user: { type: Object }, // anonymized context: geo/device/audience
amount: { type: Number, default: 0 },
note: { type: String }
},
{ timestamps: true }
);


export default mongoose.model('Log', logSchema);