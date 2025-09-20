import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    gmail: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },
    // Add these fields for Stream integration
    streamUserId: {
      type: String,
      unique: true,
      sparse: true, // Allows null values
    },
    streamUserToken: {
      type: String,
      sparse: true,
    },
    // Track which institutes the user has joined
    joinedInstitutes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
    }],
    // User profile info for Stream
    displayName: String,
    profileImage: String,
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;