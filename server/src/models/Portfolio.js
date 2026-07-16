import mongoose from "mongoose";
const holdingSchema = new mongoose.Schema({ symbol: String, name: String, quantity: Number, averagePrice: Number }, { _id: false });
export default mongoose.model("Portfolio", new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true, trim: true },
  holdings: { type: [holdingSchema], default: [] }
}, { timestamps: true }));
