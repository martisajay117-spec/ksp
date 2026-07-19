import { ArrowRight, AlertTriangle, ShieldAlert, Coins, RefreshCw } from "lucide-react";
import { mockPOLEData } from "../data/mockData";

export default function FinancialCrime() {
  // Transfers
  const transfers = [
    { from: "B. Nagaraj (HDFC)", to: "Dhanalaxmi Shell (SBI)", amount: "₹4,80,000", date: "2026-06-28", channel: "RTGS", flag: "High Value Layering" },
    { from: "Dhanalaxmi Shell (SBI)", to: "R. Manjunath (Canara)", amount: "₹1,50,000", date: "2026-07-06", channel: "NEFT", flag: "Suspicious Retail Distribution" },
    { from: "R. Manjunath (Canara)", to: "B. Nagaraj (HDFC)", amount: "₹20,000", date: "2026-07-07", channel: "IMPS", flag: "Circular kickback loop" }
  ];

  return (
    <div className="space-y-6">
      
      {/* Financial Overview header */}
      <div className="bg-[#111111] border border-[#333333] rounded p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#9884AC]/10 rounded border border-[#9884AC]/20 text-[#9884AC]">
            <Coins size={18} />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-[#E0E0E0] block">Financial Transaction Link Audit</span>
            <span className="text-[10px] font-mono text-[#888888]">Suspicious transaction laundering cycles (circular money trails) flagged under active case.</span>
          </div>
        </div>
        <div className="text-right font-mono">
          <span className="text-[10px] font-mono text-[#888888] block">LAUNDERING VOLUME</span>
          <span className="text-sm font-bold text-[#E53935]">₹6,50,000</span>
        </div>
      </div>

      {/* Money Trail Visualizer Flow */}
      <div className="bg-[#1A1A1A] border border-[#333333] rounded p-4">
        <span className="text-xs font-mono font-bold text-[#E0E0E0] tracking-tight uppercase block mb-1">Visual Money Trail (Cycle Detection)</span>
        <span className="text-[10px] font-mono text-[#888888] block mb-6">Circular money trail routing theft proceeds from financier through shell enterprise back to prime accused.</span>

        <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-4 py-4 px-2 select-none font-mono">
          
          {/* Node 1 */}
          <div className="bg-[#111111] border border-[#333333] rounded p-3 text-center">
            <span className="text-[9px] text-[#555555] block">FINANCIER</span>
            <span className="text-xs font-bold text-[#E0E0E0]">B. Nagaraj</span>
            <span className="text-[10px] text-[#888888] block mt-1">HDFC A/C ***1187</span>
            <span className="text-[9px] text-[#7f9e6e] mt-1 inline-block bg-[#7f9e6e]/10 px-1 rounded">KYC Verified</span>
          </div>

          {/* Arrow 1 */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-[9px] text-[#E53935] font-bold mb-1">₹4,80,000</span>
            <div className="flex items-center gap-1">
              <span className="w-12 h-0.5 bg-[#E53935]"></span>
              <ArrowRight size={13} className="text-[#E53935]" />
            </div>
            <span className="text-[8px] text-[#555555] mt-1">RTGS · 2026-06-28</span>
          </div>

          {/* Node 2 */}
          <div className="bg-[#111111] border border-[#E53935]/40 rounded p-3 text-center glow-crimson">
            <span className="text-[9px] text-[#E53935] font-bold block animate-pulse">SHELL ENTITY</span>
            <span className="text-xs font-bold text-[#E0E0E0]">Dhanalaxmi Enterprises</span>
            <span className="text-[10px] text-[#888888] block mt-1">SBI A/C ***9902</span>
            <span className="text-[9px] text-[#E53935] mt-1 inline-block bg-[#E53935]/10 px-1.5 rounded animate-pulse">FLAGGED KYCs</span>
          </div>

          {/* Arrow 2 */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-[9px] text-[#D69A4E] font-bold mb-1">₹1,50,000</span>
            <div className="flex items-center gap-1">
              <span className="w-12 h-0.5 bg-[#D69A4E]"></span>
              <ArrowRight size={13} className="text-[#D69A4E]" />
            </div>
            <span className="text-[8px] text-[#555555] mt-1">NEFT · 2026-07-06</span>
          </div>

          {/* Node 3 */}
          <div className="bg-[#111111] border border-[#333333] rounded p-3 text-center">
            <span className="text-[9px] text-[#555555] block">PRIME ACCUSED</span>
            <span className="text-xs font-bold text-[#E0E0E0]">R. Manjunath</span>
            <span className="text-[10px] text-[#888888] block mt-1">Canara A/C ***4471</span>
            <span className="text-[9px] text-[#D69A4E] mt-1 inline-block bg-[#D69A4E]/10 px-1 rounded">Under Audit</span>
          </div>

        </div>

        {/* Circular kickback feedback loop */}
        <div className="mt-4 p-2.5 bg-[#E53935]/10 border border-[#E53935]/30 rounded flex items-center justify-between text-[10px] font-mono text-[#E53935]">
          <div className="flex items-center gap-2">
            <RefreshCw size={13} className="animate-spin text-[#E53935]" />
            <span><b>Red Flag Circular Loop Detected</b>: R. Manjunath sent ₹20,000 (IMPS kickback) back to B. Nagaraj within 24 hours of receiving shell funds.</span>
          </div>
          <span className="font-bold">CONSPIRACY CONFIDENCE: 89%</span>
        </div>
      </div>

      {/* Transaction Log Ledger */}
      <div className="bg-[#1A1A1A] border border-[#333333] rounded p-4">
        <span className="text-xs font-mono font-bold text-[#E0E0E0] tracking-tight uppercase block mb-1">Laundering Ledger</span>
        <span className="text-[10px] font-mono text-[#888888] block mb-4">Chronological record of transactions matching the active crime proceeds funnel.</span>

        <div className="space-y-3 font-mono">
          {transfers.map((t, i) => (
            <div key={i} className="bg-[#111111] border border-[#333333] rounded p-3 flex justify-between items-center text-xs text-[#888888]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[#E0E0E0] font-semibold">{t.from}</span>
                  <ArrowRight size={12} className="text-[#555555]" />
                  <span className="text-[#E0E0E0] font-semibold">{t.to}</span>
                </div>
                <div className="text-[10px] text-[#555555]">{t.date} · Channel: {t.channel}</div>
              </div>

              <div className="text-right">
                <span className="text-sm font-bold text-[#E53935] block">{t.amount}</span>
                <span className="text-[9px] text-[#D69A4E]">{t.flag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
