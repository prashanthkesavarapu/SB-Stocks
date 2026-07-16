import { Router } from "express";
import Stock from "../models/Stock.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router(); router.use(protect, adminOnly);
router.get("/stocks", async (_, res, next) => { try { res.json(await Stock.find().sort({ symbol: 1 })); } catch (error) { next(error); } });
router.post("/stocks", async (req, res, next) => { try {
  const { symbol, name, exchange, sector } = req.body;
  if (!symbol || !name) return res.status(400).json({ message: "Symbol and company name are required." });
  const stock = await Stock.create({ symbol, name, exchange, sector }); res.status(201).json(stock);
} catch (error) { if (error.code === 11000) return res.status(409).json({ message: "This symbol already exists." }); next(error); } });
router.patch("/stocks/:id", async (req, res, next) => { try {
  const stock = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!stock) return res.status(404).json({ message: "Stock not found." }); res.json(stock);
} catch (error) { next(error); } });
router.delete("/stocks/:id", async (req, res, next) => { try {
  const stock = await Stock.findByIdAndDelete(req.params.id); if (!stock) return res.status(404).json({ message: "Stock not found." }); res.status(204).end();
} catch (error) { next(error); } });
export default router;
