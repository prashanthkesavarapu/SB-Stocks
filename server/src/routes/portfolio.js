import { Router } from "express";
import User from "../models/User.js";
import Portfolio from "../models/Portfolio.js";
import Transaction from "../models/Transaction.js";
import { protect } from "../middleware/auth.js";
const router = Router(); router.use(protect);
router.get("/", async (req, res, next) => { try { res.json(await Portfolio.find({ user: req.user.id })); } catch (e) { next(e); } });
router.post("/", async (req, res, next) => { try { const portfolio = await Portfolio.create({ user: req.user.id, name: req.body.name || "My Portfolio" }); res.status(201).json(portfolio); } catch (e) { next(e); } });
router.delete("/:portfolioId", async (req, res, next) => { try {
  const portfolio = await Portfolio.findOne({ _id: req.params.portfolioId, user: req.user.id });
  if (!portfolio) return res.status(404).json({ message: "Portfolio not found." });
  if (portfolio.holdings.length) return res.status(400).json({ message: "Sell all holdings before deleting this portfolio." });
  await portfolio.deleteOne(); res.status(204).end();
} catch (e) { next(e); } });
router.get("/transactions", async (req, res, next) => { try { res.json(await Transaction.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(50)); } catch (e) { next(e); } });
router.post("/:portfolioId/trade", async (req, res, next) => { try {
  const { symbol, name, type, quantity, price } = req.body; const qty = Number(quantity); const unitPrice = Number(price);
  if (!symbol || !["BUY", "SELL"].includes(type) || !Number.isInteger(qty) || qty < 1 || !Number.isFinite(unitPrice) || unitPrice <= 0) return res.status(400).json({ message: "Enter a valid trade." });
  const [portfolio, user] = await Promise.all([Portfolio.findOne({ _id: req.params.portfolioId, user: req.user.id }), User.findById(req.user.id)]);
  if (!portfolio) return res.status(404).json({ message: "Portfolio not found." }); const total = qty * unitPrice;
  const holding = portfolio.holdings.find(h => h.symbol === symbol.toUpperCase());
  if (type === "BUY") { if (user.virtualBalance < total) return res.status(400).json({ message: "Insufficient virtual funds." }); if (holding) { holding.averagePrice = ((holding.averagePrice * holding.quantity) + total) / (holding.quantity + qty); holding.quantity += qty; } else portfolio.holdings.push({ symbol: symbol.toUpperCase(), name, quantity: qty, averagePrice: unitPrice }); user.virtualBalance -= total; }
  else { if (!holding || holding.quantity < qty) return res.status(400).json({ message: "You do not own enough shares." }); holding.quantity -= qty; if (holding.quantity === 0) portfolio.holdings = portfolio.holdings.filter(h => h.symbol !== symbol.toUpperCase()); user.virtualBalance += total; }
  await Promise.all([portfolio.save(), user.save(), Transaction.create({ user: user._id, portfolio: portfolio._id, symbol, name, type, quantity: qty, price: unitPrice })]);
  res.status(201).json({ portfolio, virtualBalance: user.virtualBalance });
} catch (e) { next(e); } });
export default router;
