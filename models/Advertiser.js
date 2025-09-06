import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define advertiser schema
const advertiserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["advertiser"],
      default: "advertiser",
    },
  },
  { timestamps: true }
);

// Hash password before saving
advertiserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
advertiserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export model safely (avoid OverwriteModelError)
const Advertiser =
  mongoose.models.Advertiser || mongoose.model("Advertiser", advertiserSchema);

export default Advertiser;


