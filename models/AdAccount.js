import mongoose from "mongoose";

const adAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // assumes you have a User model
      required: true,
    
    },
    businessName: { type: String, required: true },
    industrialSector: { type: String, required: true },
    businessCertificate: { type: String, required: true }, // store file path / URL
    aboutBio: { type: String, required: true, maxlength: 500 },
    businessProfilePicture: { type: String, required: true }, // store file path / URL
    businessThemePicture: { type: String, required: true }, // store file path / URL
    companyWebsite: { type: String }, // optional
    contactNumber: { type: String, required: true },
    businessLocation: { type: String, required: true },
    businessEmail: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("AdAccount", adAccountSchema);
