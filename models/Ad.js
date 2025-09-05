import mongoose from 'mongoose';

const targetingSchema = new mongoose.Schema(
  {
    audience: [{ type: String }],
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
    daysOfWeek: [{ type: Number, min: 0, max: 6 }],
    timesOfDay: [{ start: String, end: String }]
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
    advertiserId: { type: mongoose.Schema.Types.ObjectId, ref: 'AdAccount', required: true },

    title: { type: String, required: true },
    description: { type: String, maxlength: 500 },

    adType: { type: String, enum: ['Image', 'Video'], required: true },
    contentUrl: { type: String },

    adElement: { type: String, enum: ['Website', 'Form', 'App Installation'], required: true },
    websiteLink: { type: String },
    formFields: [{ type: String }],
    appLinks: {
      appStore: { type: String },
      playStore: { type: String }
    },

    targetAgeGroup: { type: String, enum: ['Teen', 'Young Adult', 'Middle Age', 'Senior'] },
    targetInterests: [{ type: String }],

    targeting: targetingSchema,
    schedule: scheduleSchema,
    bidding: biddingSchema,
    tracking: trackingSchema,

    adModel: { type: String, enum: ['Free', 'Premium', 'Elite', 'Ultimate'], required: true },

    status: { type: String, enum: ['active', 'paused', 'expired', 'draft'], default: 'draft' },

    uniqueUrl: { type: String, unique: true }
  },
  { timestamps: true }
);

// ✅ Indexes
adSchema.index({ advertiserId: 1 });
adSchema.index({ status: 1 });
adSchema.index({ 'targeting.geo.country': 1, 'targeting.geo.region': 1, 'targeting.geo.city': 1 });

// ✅ Virtual
adSchema.virtual('isRunning').get(function () {
  const now = new Date();
  return (
    this.status === 'active' &&
    now >= this.schedule.startDate &&
    now <= this.schedule.endDate
  );
});

export default mongoose.model('Ad', adSchema);
