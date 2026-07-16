import { Router } from "express";

const fallback = [
  { symbol: "AAPL", name: "Apple Inc.", price: 213.49, change: 1.12 },
  { symbol: "MSFT", name: "Microsoft Corporation", price: 458.89, change: 0.72 },
  { symbol: "NVDA", name: "NVIDIA Corporation", price: 171.36, change: -0.41 },
  { symbol: "TSLA", name: "Tesla, Inc.", price: 318.67, change: 1.63 },
  { symbol: "AMZN", name: "Amazon.com, Inc.", price: 226.35, change: 0.28 }
];
const chartUrl = (symbol, range = "1mo", interval = "1d") => `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}`;
const quote = result => {
  const closes = (result.indicators?.quote?.[0]?.close || []).filter(value => value != null);
  const price = result.meta.regularMarketPrice || closes.at(-1);
  const previous = result.meta.previousClose || closes.at(-2);
  return { symbol: result.meta.symbol, name: result.meta.longName || result.meta.shortName || result.meta.symbol, price, change: price && previous ? ((price - previous) / previous) * 100 : 0 };
};
const getQuote = async symbol => { const response = await fetch(chartUrl(symbol, "5d", "1d")); if (!response.ok) throw new Error("Market provider unavailable"); const body = await response.json(); return quote(body.chart.result[0]); };
const router = Router();
router.get("/popular", async (_, res) => { try { res.json(await Promise.all(fallback.map(stock => getQuote(stock.symbol)))); } catch { res.json(fallback); } });
router.get("/search", async (req, res) => { const query = req.query.q?.trim(); if (!query) return res.json(fallback); try {
  const response = await fetch(`https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=8&newsCount=0`);
  if (!response.ok) throw new Error(); const body = await response.json();
  const stocks = body.quotes.filter(item => item.quoteType === "EQUITY" && item.symbol).slice(0, 8);
  const detailed = await Promise.all(stocks.map(async item => { try { return await getQuote(item.symbol); } catch { return { symbol: item.symbol, name: item.longname || item.shortname || item.symbol, price: null, change: 0 }; } }));
  res.json(detailed);
} catch { res.json(fallback.filter(stock => `${stock.symbol} ${stock.name}`.toLowerCase().includes(query.toLowerCase()))); } });
router.get("/:symbol/history", async (req, res) => { try {
  const response = await fetch(chartUrl(req.params.symbol.toUpperCase(), req.query.range || "1mo", "1d")); if (!response.ok) throw new Error(); const body = await response.json(); const result = body.chart.result?.[0]; if (!result) throw new Error();
  res.json({ quote: quote(result), points: result.timestamp.map((timestamp, index) => ({ time: new Date(timestamp * 1000).toISOString().slice(0, 10), close: result.indicators.quote[0].close[index] })).filter(point => point.close != null) });
} catch { res.status(502).json({ message: "Live historical data is unavailable right now." }); } });
export default router;
