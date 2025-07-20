import mongoose from "mongoose";

const sessionLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, required: true },
    loginTime: { type: Date, default: Date.now },
    logoutTime: { type: Date },
  },
  { timestamps: true }
);

export const SessionLogModel = mongoose.model("SessionLog", sessionLogSchema);
