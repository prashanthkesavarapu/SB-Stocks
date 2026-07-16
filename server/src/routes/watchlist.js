import { Router } from "express";
import Watchlist from "../models/Watchlist.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);
router.get("/", async (req, res, next) => { try {
  const watchlist = await Watchlist.findOneAndUpdate({ user: req.user.id }, { $setOnInsert: { user: req.user.id } }, { new: true, upsert: true });
  res.json(watchlist);
} catch (error) { next(error); } });
router.post("/", async (req, res, next) => { try {
  const symbol = req.body.symbol?.trim().toUpperCase();
  if (!symbol || !/^[A-Z.\-]{1,10}$/.test(symbol)) return res.status(400).json({ message: "Enter a valid stock symbol." });
  const watchlist = await Watchlist.findOneAndUpdate({ user: req.user.id }, { $addToSet: { symbols: symbol }, $setOnInsert: { user: req.user.id } }, { new: true, upsert: true });
  res.status(201).json(watchlist);
} catch (error) { next(error); } });
router.delete("/:symbol", async (req, res, next) => { try {
  const watchlist = await Watchlist.findOneAndUpdate({ user: req.user.id }, { $pull: { symbols: req.params.symbol.toUpperCase() } }, { new: true });
  res.json(watchlist || { symbols: [] });
} catch (error) { next(error); } });
export default router;
