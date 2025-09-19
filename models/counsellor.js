import mongoose from "mongoose";

const counsellorSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
    },
    // Proof of counsellor credentials
    proofTitle: {
      type: String,
      trim: true,
    },
    proofNumber: {
      type: String,
      trim: true,
    },
    proofUrls: [
      {
        type: String,
        trim: true,
      },
    ],
    // Additional document links
    documents: [
      {
        label: { type: String, trim: true },
        url: { type: String, trim: true },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Counsellor = mongoose.models.Counsellor || mongoose.model("Counsellor", counsellorSchema);
export default Counsellor;



