import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true, uppercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  exchange: { type: String, default: "NASDAQ", trim: true },
  sector: { type: String, default: "Other", trim: true },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Stock", stockSchema);
