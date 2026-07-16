import mongoose from "mongoose";

export default mongoose.model("Watchlist", new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  symbols: { type: [String], default: [] }
}, { timestamps: true }));
