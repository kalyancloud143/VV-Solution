import { useState, useEffect, useRef } from "react";

const NAV_LINKS = ["Features", "Markets", "AI Engine", "Pricing", "Dashboard"];

const STOCKS = [
  { sym: "RELIANCE", price: 2847.35, chg: 1.24, sector: "Energy" },
  { sym: "TCS", price: 3921.10, chg: -0.38, sector: "IT" },
  { sym: "INFY", price: 1756.80, chg: 2.11, sector: "IT" },
  { sym: "HDFC", price: 1643.20, chg: -0.72, sector: "Finance" },
  { sym: "WIPRO", price: 478.45, chg: 0.93, sector: "IT" },
  { sym: "TATAMOTORS", price: 912.60, chg: 3.44, sector: "Auto" },
  { sym: "ICICIBANK", price: 1127.75, chg: 1.87, sector: "Finance" },
  { sym: "BAJFINANCE", price: 7234.50, chg: -1.12, sector: "Finance" },
];

const AI_SIGNALS = [
  { sym: "RELIANCE", signal: "BUY", score: 87, conf: "High", reason: "Breakout above resistance ₹2810" },
  { sym: "TCS", signal: "HOLD", score: 62, conf: "Med", reason: "Consolidation phase, await volume" },
  { sym: "TATAMOTORS", signal: "BUY", score: 91, conf: "High", reason: "Strong momentum + EV sector rally" },
  { sym: "HDFC", signal: "SELL", score: 34, conf: "Med", reason: "Below 50-DMA, weak banking sentiment" },
];

const PLANS = [
  {
    name: "Free", price: "₹0", period: "/mo",
    features: ["5 Watchlist Stocks", "3 AI Signals/Day", "Basic Charts", "Email Alerts"],
    cta: "Start Free", highlight: false,
  },
  {
    name: "Pro", price: "₹999", period: "/mo",
    features: ["Unlimited Trades", "Full AI Analysis", "Portfolio Management", "WhatsApp Alerts", "Broker Integration", "Priority Support"],
    cta: "Start Pro", highlight: true,
  },
  {
    name: "Premium", price: "₹2499", period: "/mo",
    features: ["Everything in Pro", "Advanced AI Engine", "Auto Trade Execution", "Premium Research", "Multi-Broker", "Dedicated Manager"],
    cta: "Go Premium", highlight: false,
  },
];

const BROKERS = ["Zerodha", "Angel One", "Upstox", "Groww", "Dhan", "Alice Blue"];

const PORTFOLIO = [
  { sym: "RELIANCE", qty: 50, entry: 2710, ltp: 2847.35, pnl: 6867.50, pct: 5.07 },
  { sym: "TCS", qty: 20, entry: 3980, ltp: 3921.10, pnl: -1178.00, pct: -1.48 },
  { sym: "INFY", qty: 100, entry: 1700, ltp: 1756.80, pnl: 5680.00, pct: 3.34 },
  { sym: "TATAMOTORS", qty: 200, entry: 870, ltp: 912.60, pnl: 8520.00, pct: 4.90 },
];

const TABS = ["Homepage", "Dashboard", "Trade Setup", "AI Signals", "Pricing"];

const sparkData = (base, len = 20) => Array.from({ length: len }, (_, i) => base + Math.sin(i * 0.7) * base * 0.03 + (Math.random() - 0.5) * base * 0.02);

function Spark({ data, positive }) {
  const min = Math.min(...data), max = Math.max(...data);
  const w = 80, h = 28;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / (max - min)) * h}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline fill="none" stroke={positive ? "#10b981" : "#ef4444"} strokeWidth="1.5" points={pts} />
    </svg>
  );
}

function AIScoreBadge({ score, signal }) {
  const color = signal === "BUY" ? "#10b981" : signal === "SELL" ? "#ef4444" : "#f59e0b";
  const bg = signal === "BUY" ? "rgba(16,185,129,0.12)" : signal === "SELL" ? "rgba(239,68,68,0.12)" : "rgba(245,158,11,0.12)";
  return (
    <span style={{ background: bg, color, fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 4, letterSpacing: "0.08em" }}>
      {signal}
    </span>
  );
}

function TickerBar() {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setOffset(o => (o + 1) % (STOCKS.length * 160)), 30);
    return () => clearInterval(id);
  }, []);
  const items = [...STOCKS, ...STOCKS];
  return (
    <div style={{ background: "#0a0f1e", borderBottom: "1px solid rgba(255,255,255,0.07)", overflow: "hidden", padding: "6px 0" }}>
      <div style={{ display: "flex", gap: 0, transform: `translateX(-${offset}px)`, transition: "transform 0.03s linear", whiteSpace: "nowrap" }}>
        {items.map((s, i) => (
          <span key={i} style={{ padding: "0 20px", fontSize: 12, color: "#94a3b8", display: "inline-flex", gap: 8, alignItems: "center" }}>
            <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{s.sym}</span>
            <span>₹{s.price.toLocaleString("en-IN")}</span>
            <span style={{ color: s.chg >= 0 ? "#10b981" : "#ef4444" }}>{s.chg >= 0 ? "▲" : "▼"} {Math.abs(s.chg)}%</span>
            <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Nav({ activeTab, setActiveTab }) {
  return (
    <nav style={{ background: "rgba(8,12,28,0.95)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(12px)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#fff", fontSize: 14, fontWeight: 800 }}>VV</span>
        </div>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 16, letterSpacing: "-0.02em" }}>Solutions</span>
        <span style={{ color: "#3b82f6", fontSize: 10, fontWeight: 600, background: "rgba(59,130,246,0.15)", padding: "2px 6px", borderRadius: 4, marginLeft: 4 }}>AI</span>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ background: activeTab === t ? "rgba(59,130,246,0.2)" : "transparent", color: activeTab === t ? "#60a5fa" : "#94a3b8", border: activeTab === t ? "1px solid rgba(59,130,246,0.4)" : "1px solid transparent", padding: "5px 12px", borderRadius: 6, fontSize: 13, cursor: "pointer", fontWeight: activeTab === t ? 600 : 400 }}>
            {t}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#94a3b8", padding: "6px 14px", borderRadius: 6, fontSize: 13, cursor: "pointer" }}>Login</button>
        <button style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", border: "none", color: "#fff", padding: "6px 14px", borderRadius: 6, fontSize: 13, cursor: "pointer", fontWeight: 600 }}>Start Free</button>
      </div>
    </nav>
  );
}

function Homepage() {
  return (
    <div>
      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg, #080c1c 0%, #0d1230 60%, #080c1c 100%)", padding: "80px 32px 60px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "20%", left: "60%", width: 500, height: 500, background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "40%", left: "10%", width: 300, height: 300, background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 20, padding: "5px 14px", marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 6px #10b981" }} />
            <span style={{ color: "#60a5fa", fontSize: 12, fontWeight: 500 }}>NSE & BSE Live · AI Powered · SEBI Compliant</span>
          </div>
          <h1 style={{ fontSize: 52, fontWeight: 800, color: "#f1f5f9", lineHeight: 1.15, marginBottom: 20, letterSpacing: "-0.03em" }}>
            Trade Smarter with<br />
            <span style={{ background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI-Powered Automation</span>
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 18, lineHeight: 1.7, marginBottom: 36, maxWidth: 600, margin: "0 auto 36px" }}>
            Set Entry, Target & Stop Loss once. Our AI monitors the Indian stock market 24×7, fires alerts, and manages your trades automatically.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "#fff", border: "none", padding: "13px 28px", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Start Free Trial →</button>
            <button style={{ background: "transparent", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.15)", padding: "13px 28px", borderRadius: 8, fontSize: 15, cursor: "pointer" }}>▶ Watch Demo</button>
            <button style={{ background: "transparent", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.15)", padding: "13px 28px", borderRadius: 8, fontSize: 15, cursor: "pointer" }}>Create Account</button>
          </div>
          {/* Trust badges */}
          <div style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 48, flexWrap: "wrap" }}>
            {["NSE & BSE", "AI Analysis", "Real-Time Data", "256-bit SSL", "6+ Brokers", "Portfolio Sync"].map(b => (
              <div key={b} style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", fontSize: 12 }}>
                <span style={{ color: "#3b82f6" }}>✓</span> {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: "#0d1230", padding: "32px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", gap: 0, justifyContent: "center", flexWrap: "wrap" }}>
          {[["50,000+", "Active Traders"], ["₹2,400 Cr+", "Trade Volume"], ["94.2%", "Alert Accuracy"], ["6", "Broker Integrations"]].map(([v, l]) => (
            <div key={l} style={{ padding: "16px 40px", textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.03em" }}>{v}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Market Preview */}
      <section style={{ background: "#080c1c", padding: "48px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ color: "#f1f5f9", fontSize: 20, fontWeight: 700, margin: 0 }}>Live Market Watch</h2>
            <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#10b981", fontSize: 12 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
              Market Open
            </span>
          </div>
          <div style={{ background: "#0d1230", borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  {["Symbol", "Sector", "LTP", "Change", "Trend", "AI Signal"].map(h => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, color: "#64748b", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {STOCKS.map(s => (
                  <tr key={s.sym} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{s.sym}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "#64748b" }}>{s.sector}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: "#f1f5f9", fontWeight: 500 }}>₹{s.price.toLocaleString("en-IN")}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: s.chg >= 0 ? "#10b981" : "#ef4444", fontWeight: 600 }}>{s.chg >= 0 ? "+" : ""}{s.chg}%</td>
                    <td style={{ padding: "12px 16px" }}><Spark data={sparkData(s.price)} positive={s.chg >= 0} /></td>
                    <td style={{ padding: "12px 16px" }}>
                      <AIScoreBadge signal={s.chg > 1.5 ? "BUY" : s.chg < -0.5 ? "SELL" : "HOLD"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ background: "#0a0e1f", padding: "60px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: 34, fontWeight: 800, color: "#f1f5f9", margin: "0 0 12px", letterSpacing: "-0.02em" }}>Everything You Need to Trade Professionally</h2>
            <p style={{ color: "#64748b", fontSize: 15 }}>From intraday scalping to long-term investing — one platform, unlimited potential</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              { icon: "⚡", title: "Automated Trade Engine", desc: "Set Entry, Target & SL once. System monitors and fires orders automatically via broker API." },
              { icon: "🤖", title: "AI Signal Engine", desc: "ML-powered Buy/Sell/Hold signals with confidence scores, support/resistance, and trend analysis." },
              { icon: "📊", title: "Intraday Scanner", desc: "Real-time breakout, volume surge, and momentum scanner for NSE & BSE stocks." },
              { icon: "📈", title: "Swing Trade Finder", desc: "Multi-day setup detection with risk-reward calculator and trend strength indicators." },
              { icon: "🏦", title: "Mutual Fund Manager", desc: "SIP tracking, fund comparison, goal planning, and retirement corpus calculator." },
              { icon: "🔔", title: "Smart Alerts", desc: "WhatsApp, SMS, Email & push notifications for every trade event and AI signal." },
            ].map(f => (
              <div key={f.title} style={{ background: "#0d1230", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "20px" }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", margin: "0 0 8px" }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Broker Section */}
      <section style={{ background: "#080c1c", padding: "48px 32px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: "#64748b", fontSize: 13, marginBottom: 20, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>Integrated with India's Top Brokers</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {BROKERS.map(b => (
              <div key={b} style={{ background: "#0d1230", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "8px 18px", fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>{b}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <div style={{ background: "#060a18", padding: "16px 32px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <p style={{ color: "#475569", fontSize: 11, textAlign: "center", margin: 0, lineHeight: 1.6 }}>
          ⚠️ Trading and investing involve market risk. Past performance does not guarantee future returns. AI recommendations are informational only. Users remain responsible for all investment decisions. VV Solutions is not a SEBI-registered investment advisor.
        </p>
      </div>
    </div>
  );
}

function Dashboard() {
  const totalValue = PORTFOLIO.reduce((s, p) => s + p.qty * p.ltp, 0);
  const totalPnL = PORTFOLIO.reduce((s, p) => s + p.pnl, 0);
  return (
    <div style={{ background: "#080c1c", minHeight: "100vh", padding: "24px 32px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", margin: 0 }}>Portfolio Dashboard</h1>
            <p style={{ color: "#64748b", fontSize: 13, margin: "4px 0 0" }}>Last updated: 06 Jun 2026, 3:28 PM</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.3)", padding: "7px 14px", borderRadius: 6, fontSize: 13, cursor: "pointer" }}>+ Add Trade</button>
            <button style={{ background: "transparent", color: "#64748b", border: "1px solid rgba(255,255,255,0.1)", padding: "7px 14px", borderRadius: 6, fontSize: 13, cursor: "pointer" }}>⟳ Refresh</button>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Portfolio Value", value: `₹${(totalValue / 100000).toFixed(2)}L`, sub: "+₹19,889 today", pos: true },
            { label: "Total P&L", value: `₹${totalPnL.toLocaleString("en-IN")}`, sub: "+18.90% overall", pos: true },
            { label: "Open Positions", value: "4", sub: "₹14.2L invested" },
            { label: "Today's P&L", value: "₹4,230", sub: "+0.83% today", pos: true },
          ].map(k => (
            <div key={k.label} style={{ background: "#0d1230", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "16px" }}>
              <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{k.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}>{k.value}</div>
              {k.sub && <div style={{ fontSize: 12, color: k.pos ? "#10b981" : "#64748b", marginTop: 4 }}>{k.sub}</div>}
            </div>
          ))}
        </div>

        {/* Holdings Table */}
        <div style={{ background: "#0d1230", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, marginBottom: 20, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 14 }}>Holdings</span>
            <span style={{ color: "#64748b", fontSize: 12 }}>4 positions</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                {["Stock", "Qty", "Avg Buy", "LTP", "P&L", "%", "Action"].map(h => (
                  <th key={h} style={{ padding: "9px 16px", textAlign: "left", fontSize: 11, color: "#475569", fontWeight: 600, letterSpacing: "0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PORTFOLIO.map(p => (
                <tr key={p.sym} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{p.sym}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#94a3b8" }}>{p.qty}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#94a3b8" }}>₹{p.entry.toLocaleString("en-IN")}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#f1f5f9", fontWeight: 500 }}>₹{p.ltp.toLocaleString("en-IN")}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: p.pnl >= 0 ? "#10b981" : "#ef4444", fontWeight: 600 }}>
                    {p.pnl >= 0 ? "+" : ""}₹{p.pnl.toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ color: p.pct >= 0 ? "#10b981" : "#ef4444", fontSize: 13, fontWeight: 600 }}>{p.pct >= 0 ? "+" : ""}{p.pct}%</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <button style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.25)", padding: "4px 10px", borderRadius: 5, fontSize: 11, cursor: "pointer", fontWeight: 600 }}>Exit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI Recommendations */}
        <div style={{ background: "#0d1230", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 14 }}>🤖 AI Recommendations</span>
            <span style={{ color: "#64748b", fontSize: 12 }}>Updated 2 min ago</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
            {AI_SIGNALS.map(s => (
              <div key={s.sym} style={{ background: "#080c1c", borderRadius: 8, padding: "12px 14px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, color: "#e2e8f0", fontSize: 13 }}>{s.sym}</span>
                  <AIScoreBadge signal={s.signal} score={s.score} />
                </div>
                <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{s.reason}</div>
                <div style={{ marginTop: 8, display: "flex", gap: 16 }}>
                  <div style={{ fontSize: 11, color: "#475569" }}>Score <span style={{ color: "#94a3b8", fontWeight: 600 }}>{s.score}/100</span></div>
                  <div style={{ fontSize: 11, color: "#475569" }}>Confidence <span style={{ color: "#94a3b8", fontWeight: 600 }}>{s.conf}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TradeSetup() {
  const [form, setForm] = useState({ symbol: "RELIANCE", side: "BUY", entry: "2810", target: "2950", sl: "2740", qty: "50", type: "swing" });
  const [submitted, setSubmitted] = useState(false);

  const rr = form.entry && form.target && form.sl
    ? ((parseFloat(form.target) - parseFloat(form.entry)) / (parseFloat(form.entry) - parseFloat(form.sl))).toFixed(2)
    : "--";
  const invest = form.entry && form.qty ? (parseFloat(form.entry) * parseInt(form.qty)).toLocaleString("en-IN") : "--";
  const profitAmt = form.target && form.entry && form.qty
    ? ((parseFloat(form.target) - parseFloat(form.entry)) * parseInt(form.qty)).toLocaleString("en-IN")
    : "--";

  return (
    <div style={{ background: "#080c1c", minHeight: "100vh", padding: "32px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", margin: "0 0 8px" }}>Create Automated Trade</h2>
        <p style={{ color: "#64748b", fontSize: 14, margin: "0 0 32px" }}>Set your entry, target, and stop loss once — AI monitors and executes automatically</p>

        {submitted ? (
          <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 12, padding: "32px", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
            <h3 style={{ color: "#10b981", fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>Trade Setup Active!</h3>
            <p style={{ color: "#64748b", fontSize: 14 }}>Monitoring {form.symbol} for entry at ₹{form.entry}. You'll receive alerts via WhatsApp & email.</p>
            <button onClick={() => setSubmitted(false)} style={{ marginTop: 20, background: "rgba(59,130,246,0.15)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.3)", padding: "8px 20px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>Create Another</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {/* Form */}
            <div style={{ background: "#0d1230", borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)", padding: "24px" }}>
              <h3 style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 20px" }}>Trade Configuration</h3>

              {/* Buy/Sell Toggle */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 6 }}>Order Side</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["BUY", "SELL"].map(s => (
                    <button key={s} onClick={() => setForm(f => ({ ...f, side: s }))} style={{ flex: 1, padding: "8px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, background: form.side === s ? (s === "BUY" ? "#10b981" : "#ef4444") : "rgba(255,255,255,0.07)", color: form.side === s ? "#fff" : "#64748b" }}>{s}</button>
                  ))}
                </div>
              </div>

              {[
                { label: "Stock Symbol", key: "symbol", placeholder: "e.g. RELIANCE" },
                { label: "Entry Price (₹)", key: "entry", placeholder: "2810" },
                { label: "Target Price (₹)", key: "target", placeholder: "2950" },
                { label: "Stop Loss (₹)", key: "sl", placeholder: "2740" },
                { label: "Quantity (Shares)", key: "qty", placeholder: "50" },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 5 }}>{f.label}</label>
                  <input value={form[f.key]} onChange={e => setForm(x => ({ ...x, [f.key]: e.target.value }))} placeholder={f.placeholder}
                    style={{ width: "100%", background: "#080c1c", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "9px 12px", color: "#f1f5f9", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                </div>
              ))}

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 6 }}>Trade Type</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={{ width: "100%", background: "#080c1c", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "9px 12px", color: "#f1f5f9", fontSize: 13 }}>
                  <option value="intraday">Intraday</option>
                  <option value="swing">Swing Trade</option>
                  <option value="short">Short-Term</option>
                  <option value="long">Long-Term</option>
                </select>
              </div>

              <button onClick={() => setSubmitted(true)} style={{ width: "100%", background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "#fff", border: "none", padding: "12px", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                🚀 Activate Auto Trade
              </button>
            </div>

            {/* Risk Summary */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "#0d1230", borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)", padding: "20px" }}>
                <h3 style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 16px" }}>Risk Analysis</h3>
                {[
                  { label: "Total Investment", value: `₹${invest}`, color: "#94a3b8" },
                  { label: "Max Profit", value: `₹${profitAmt}`, color: "#10b981" },
                  { label: "Max Loss", value: form.entry && form.sl && form.qty ? `₹${((parseFloat(form.entry) - parseFloat(form.sl)) * parseInt(form.qty)).toLocaleString("en-IN")}` : "--", color: "#ef4444" },
                  { label: "Risk:Reward", value: `1 : ${rr}`, color: parseFloat(rr) >= 2 ? "#10b981" : "#f59e0b" },
                ].map(r => (
                  <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <span style={{ fontSize: 13, color: "#64748b" }}>{r.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: r.color }}>{r.value}</span>
                  </div>
                ))}
              </div>

              {/* Trade Logic Flow */}
              <div style={{ background: "#0d1230", borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)", padding: "20px" }}>
                <h3 style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 16px" }}>Auto Execution Flow</h3>
                {[
                  { step: "1", label: "Monitor", desc: `Watch ${form.symbol || "stock"} every second` },
                  { step: "2", label: "Entry", desc: `Price = ₹${form.entry || "Entry"} → BUY ${form.qty || "N"} shares` },
                  { step: "3", label: "OCO Active", desc: "Target + Stop Loss both armed" },
                  { step: "4a", label: "Target Hit", desc: `₹${form.target || "Target"} → Sell, cancel SL` },
                  { step: "4b", label: "Stop Loss Hit", desc: `₹${form.sl || "SL"} → Exit, cancel target` },
                ].map(s => (
                  <div key={s.step} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(59,130,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#60a5fa", fontWeight: 700, flexShrink: 0 }}>{s.step}</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8" }}>{s.label}</div>
                      <div style={{ fontSize: 11, color: "#475569" }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AISignals() {
  const [filter, setFilter] = useState("ALL");
  const allSignals = [
    ...AI_SIGNALS,
    { sym: "WIPRO", signal: "BUY", score: 79, conf: "High", reason: "Double bottom pattern confirmed at ₹465" },
    { sym: "ICICIBANK", signal: "BUY", score: 84, conf: "High", reason: "NPA improving + rate cut tailwind" },
    { sym: "BAJFINANCE", signal: "SELL", score: 28, conf: "Med", reason: "Overbought RSI 78, distribution candles" },
    { sym: "INFY", signal: "HOLD", score: 58, conf: "Low", reason: "Mixed signals, Q1 results awaited" },
  ];
  const filtered = filter === "ALL" ? allSignals : allSignals.filter(s => s.signal === filter);

  return (
    <div style={{ background: "#080c1c", minHeight: "100vh", padding: "32px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", margin: 0 }}>AI Signal Engine</h2>
            <p style={{ color: "#64748b", fontSize: 13, margin: "4px 0 0" }}>ML-powered buy/sell signals updated every 5 minutes</p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["ALL", "BUY", "SELL", "HOLD"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? "rgba(59,130,246,0.2)" : "transparent", color: filter === f ? "#60a5fa" : "#64748b", border: filter === f ? "1px solid rgba(59,130,246,0.4)" : "1px solid rgba(255,255,255,0.1)", padding: "5px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>{f}</button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
          {filtered.map(s => (
            <div key={s.sym} style={{ background: "#0d1230", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "18px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9" }}>{s.sym}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>NSE · Equity</div>
                </div>
                <AIScoreBadge signal={s.signal} />
              </div>

              {/* Score bar */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: "#64748b" }}>AI Score</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: s.score >= 70 ? "#10b981" : s.score >= 40 ? "#f59e0b" : "#ef4444" }}>{s.score}/100</span>
                </div>
                <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${s.score}%`, background: s.score >= 70 ? "#10b981" : s.score >= 40 ? "#f59e0b" : "#ef4444", borderRadius: 2, transition: "width 0.6s ease" }} />
                </div>
              </div>

              <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 14px", lineHeight: 1.5 }}>{s.reason}</p>

              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1, background: "rgba(59,130,246,0.08)", borderRadius: 6, padding: "7px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "#64748b" }}>CONFIDENCE</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#60a5fa", marginTop: 2 }}>{s.conf}</div>
                </div>
                <div style={{ flex: 1, background: "rgba(59,130,246,0.08)", borderRadius: 6, padding: "7px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "#64748b" }}>SIGNAL</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: s.signal === "BUY" ? "#10b981" : s.signal === "SELL" ? "#ef4444" : "#f59e0b", marginTop: 2 }}>{s.signal}</div>
                </div>
                <button style={{ flex: 2, background: "rgba(59,130,246,0.15)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 6, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Trade This →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Pricing() {
  return (
    <div style={{ background: "#080c1c", minHeight: "100vh", padding: "60px 32px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: "#f1f5f9", margin: "0 0 12px", letterSpacing: "-0.03em" }}>Simple, Transparent Pricing</h2>
          <p style={{ color: "#64748b", fontSize: 15 }}>Start free. Upgrade when you're ready to automate everything.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {PLANS.map(p => (
            <div key={p.name} style={{ background: p.highlight ? "linear-gradient(160deg, #0f1d3e, #1a1040)" : "#0d1230", border: p.highlight ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "28px 24px", position: "relative" }}>
              {p.highlight && (
                <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #6366f1, #3b82f6)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 20, whiteSpace: "nowrap" }}>Most Popular</div>
              )}
              <div style={{ fontSize: 14, fontWeight: 700, color: "#94a3b8", marginBottom: 12 }}>{p.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 24 }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.03em" }}>{p.price}</span>
                <span style={{ fontSize: 13, color: "#64748b" }}>{p.period}</span>
              </div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20, marginBottom: 24 }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 10 }}>
                    <span style={{ color: "#10b981", fontSize: 14, marginTop: 1 }}>✓</span>
                    <span style={{ fontSize: 13, color: "#94a3b8" }}>{f}</span>
                  </div>
                ))}
              </div>
              <button style={{ width: "100%", background: p.highlight ? "linear-gradient(135deg, #3b82f6, #6366f1)" : "transparent", color: p.highlight ? "#fff" : "#60a5fa", border: p.highlight ? "none" : "1px solid rgba(59,130,246,0.4)", padding: "11px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{p.cta}</button>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", color: "#475569", fontSize: 12, marginTop: 32 }}>
          All plans include 7-day free trial · No setup fees · Cancel anytime
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("Homepage");
  const views = { Homepage, Dashboard, "Trade Setup": TradeSetup, "AI Signals": AISignals, Pricing };
  const View = views[activeTab];

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#080c1c", minHeight: "100vh" }}>
      <TickerBar />
      <Nav activeTab={activeTab} setActiveTab={setActiveTab} />
      <View />
    </div>
  );
}

