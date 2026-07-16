import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8, select: false },
  contact: { type: String, trim: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  virtualBalance: { type: Number, default: 100000, min: 0 }
}, { timestamps: true });
userSchema.pre("save", async function () { if (this.isModified("password")) this.password = await bcrypt.hash(this.password, 12); });
userSchema.methods.comparePassword = function (password) { return bcrypt.compare(password, this.password); };
export default mongoose.model("User", userSchema);
