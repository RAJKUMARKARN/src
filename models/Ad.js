import mongoose from 'mongoose';

const targetingSchema = new mongoose.Schema(
  {
    audience: [{ type: String }], // removed index:true
    geo: {
      country: { type: String },
      region: { type: String },
      city: { type: String }
    },
    device: [{ type: String, enum: ['mobile', 'desktop', 'tablet'] }]
  },
  { _id: false }
);

const scheduleSchema = new mongoose.Schema(
  {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    daysOfWeek: [{ type: Number, min: 0, max: 6 }], // 0 = Sunday
    timesOfDay: [{ start: String, end: String }] // "09:00", "17:30"
  },
  { _id: false }
);

const biddingSchema = new mongoose.Schema(
  {
    model: { type: String, enum: ['CPC', 'CPM', 'CPA'], required: true },
    maxBid: { type: Number, required: true },
    dailyBudget: { type: Number, default: 0 }
  },
  { _id: false }
);

const trackingSchema = new mongoose.Schema(
  {
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 }
  },
  { _id: false }
);

const adSchema = new mongoose.Schema(
  {
    advertiserId: { type: mongoose.Schema.Types.ObjectId, ref: 'Advertiser', required: true },
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    link: { type: String },
    targeting: targetingSchema,
    schedule: scheduleSchema,
    bidding: biddingSchema,
    tracking: trackingSchema,
    billing: {
      spent: { type: Number, default: 0 }
    },
    status: { type: String, enum: ['active', 'paused', 'expired', 'draft'], default: 'draft' }
  },
  { timestamps: true }
);

// ✅ Keep only schema-level indexes
adSchema.index({ 'targeting.audience': 1 });
adSchema.index({ 'targeting.geo.country': 1, 'targeting.geo.region': 1, 'targeting.geo.city': 1 });
adSchema.index({ 'schedule.startDate': 1, 'schedule.endDate': 1 });
adSchema.index({ status: 1 }); // added index for faster status queries
adSchema.index({ advertiserId: 1 }); // added index for filtering by advertiser

// ✅ Virtual field for checking if ad is running
adSchema.virtual('isRunning').get(function () {
  const now = new Date();
  return (
    this.status === 'active' &&
    now >= this.schedule.startDate &&
    now <= this.schedule.endDate
  );
});

export default mongoose.model('Ad', adSchema);
