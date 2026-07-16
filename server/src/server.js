import "dotenv/config"; import express from "express"; import cors from "cors"; import mongoose from "mongoose"; import morgan from "morgan";
import authRoutes from "./routes/auth.js"; import portfolioRoutes from "./routes/portfolio.js"; import marketRoutes from "./routes/market.js"; import watchlistRoutes from "./routes/watchlist.js"; import adminRoutes from "./routes/admin.js";
const app = express();
const localOrigins = [process.env.CLIENT_URL || "http://localhost:5173", "http://127.0.0.1:5173"];
app.use(cors({ origin: localOrigins })); app.use(express.json()); app.use(morgan("dev"));
app.get("/api/health", (_, res) => res.json({ status: "ok" })); app.use("/api/auth", authRoutes); app.use("/api/portfolios", portfolioRoutes); app.use("/api/market", marketRoutes); app.use("/api/watchlist", watchlistRoutes); app.use("/api/admin", adminRoutes);
app.use((err, _, res, __) => { console.error(err); res.status(500).json({ message: "Something went wrong." }); });
mongoose.connect(process.env.MONGODB_URI).then(() => app.listen(process.env.PORT || 5000, () => console.log("API running"))).catch(error => { console.error("MongoDB connection failed:", error.message); process.exit(1); });
