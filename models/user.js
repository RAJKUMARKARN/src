import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String }, // optional, since auto-created users may not set one
    role: { type: String, enum: ["advertiser", "admin"], default: "advertiser" },
  },
  { timestamps: true }
);

// Hash password before save (only if password is set/modified)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ✅ Prevent OverwriteModelError
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
