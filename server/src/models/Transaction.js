import mongoose from "mongoose";
export default mongoose.model("Transaction", new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  portfolio: { type: mongoose.Schema.Types.ObjectId, ref: "Portfolio", required: true },
  symbol: { type: String, required: true, uppercase: true }, name: String,
  type: { type: String, enum: ["BUY", "SELL"], required: true },
  quantity: { type: Number, required: true, min: 1 }, price: { type: Number, required: true, min: 0 }
}, { timestamps: true }));
