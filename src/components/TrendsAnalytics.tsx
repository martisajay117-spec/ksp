import { useState } from "react";
import { TrendingUp, Flame, Calendar, MapPin, AlertTriangle } from "lucide-react";
import { sociologicalStats } from "../data/mockData";

export default function TrendsAnalytics() {
  const [selectedMonth, setSelectedMonth] = useState<string | null>("Jul");
  const stats = sociologicalStats;

  // Custom responsive SVG line and bar graph calculations to avoid Recharts version issues
  const chartHeight = 160;
  const chartWidth = 500;
  const paddingLeft = 35;
  const paddingRight = 15;
  const paddingTop = 20;
  const paddingBottom = 25;

  const data = stats.crimeTrends;
  const maxVal = 80; // burglaries scale up to 72

  // Map coordinates
  const getX = (index: number) => {
    const space = (chartWidth - paddingLeft - paddingRight) / (data.length - 1);
    return paddingLeft + index * space;
  };

  const getY = (value: number) => {
    const plotHeight = chartHeight - paddingTop - paddingBottom;
    return chartHeight - paddingBottom - (value / maxVal) * plotHeight;
  };

  // Generate SVG path for line chart
  const burglaryPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.burglary)}`).join(" ");
  const fraudPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.financial_fraud)}`).join(" ");
  const cyberPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.cyber_crime)}`).join(" ");

  // Hotspots list
  const hotspots = [
    { area: "Jayanagar Sector 4", density: "High", index: 92, status: "Critical Checkpoint", type: "Burglary & Vehicle Theft" },
    { area: "BTM Layout 2nd Stage", density: "High", index: 84, status: "Active Watch", type: "Stolen Metals Fencing" },
    { area: "Silk Board Corridor", density: "Medium-High", index: 76, status: "Patrol Beat 8", type: "Transit Mugging" },
    { area: "Electronic City Phase 1", density: "Medium", index: 54, status: "Normal Beat", type: "Online Financial Phishing" }
  ];

  return (
    <div className="space-y-6">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1A1A1A] border border-[#333333] rounded p-4">
          <div className="flex items-center gap-2 text-[#888888] text-xs font-mono mb-2">
            <TrendingUp size={14} className="text-[#E53935]" />
            CRIME INTENSITY MOMENTUM
          </div>
          <div className="text-2xl font-mono font-bold text-[#E0E0E0]">+38.5%</div>
          <p className="text-[10px] font-mono text-[#888888] mt-1">Spike detected in non-residential burglaries during peak monsoon window.</p>
        </div>

        <div className="bg-[#1A1A1A] border border-[#333333] rounded p-4">
          <div className="flex items-center gap-2 text-[#888888] text-xs font-mono mb-2">
            <Flame size={14} className="text-[#E53935]" />
            CURRENT ACTIVE HOTSPOTS
          </div>
          <div className="text-2xl font-mono font-bold text-[#E53935]">3 Sectors</div>
          <p className="text-[10px] font-mono text-[#888888] mt-1">High-density areas in Bengaluru South currently flagged as cluster zones.</p>
        </div>

        <div className="bg-[#1A1A1A] border border-[#333333] rounded p-4">
          <div className="flex items-center gap-2 text-[#888888] text-xs font-mono mb-2">
            <Calendar size={14} className="text-[#D69A4E]" />
            HIGH RISK SEASONAL WINDOW
          </div>
          <div className="text-2xl font-mono font-bold text-[#D69A4E]">Monsoon Spike</div>
          <p className="text-[10px] font-mono text-[#888888] mt-1">June to August sees historical 32% rise in structural entry crimes.</p>
        </div>
      </div>

      {/* Main Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SVG Time Series Chart */}
        <div className="lg:col-span-2 bg-[#1A1A1A] border border-[#333333] rounded p-4 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono font-bold text-[#E0E0E0] tracking-tight uppercase block mb-1">Temporal Incident Trends</span>
            <span className="text-[10px] font-mono text-[#888888] block mb-4">Monthly tracking of specific crime classifications across the South division.</span>
          </div>

          <div className="relative w-full overflow-x-auto select-none py-2">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
              {/* Grid Lines */}
              {[0, 20, 40, 60, 80].map((v, i) => (
                <g key={i} opacity="0.15">
                  <line x1={paddingLeft} y1={getY(v)} x2={chartWidth - paddingRight} y2={getY(v)} stroke="#888888" strokeWidth="0.5" />
                  <text x={paddingLeft - 8} y={getY(v) + 3} textAnchor="end" fill="#E0E0E0" fontSize="8" fontFamily="var(--font-mono)">{v}</text>
                </g>
              ))}

              {/* Month Axis Labels */}
              {data.map((d, i) => (
                <text key={i} x={getX(i)} y={chartHeight - 8} textAnchor="middle" fill="#888888" fontSize="8" fontFamily="var(--font-mono)">{d.month}</text>
              ))}

              {/* Chart Paths */}
              <path d={burglaryPath} fill="none" stroke="#D69A4E" strokeWidth="2" strokeLinecap="round" />
              <path d={cyberPath} fill="none" stroke="#E53935" strokeWidth="1.5" strokeLinecap="round" />
              <path d={fraudPath} fill="none" stroke="#9884AC" strokeWidth="1.5" strokeLinecap="round" />

              {/* Interaction Circles */}
              {data.map((d, i) => (
                <g key={i}>
                  <circle cx={getX(i)} cy={getY(d.burglary)} r="3" fill="#D69A4E" className="cursor-pointer hover:r-4 transition-all" onClick={() => setSelectedMonth(d.month)} />
                  {selectedMonth === d.month && (
                    <line x1={getX(i)} y1={paddingTop} x2={getX(i)} y2={chartHeight - paddingBottom} stroke="#E53935" strokeWidth="0.8" strokeDasharray="2,2" />
                  )}
                </g>
              ))}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex gap-4 items-center justify-end text-[10px] font-mono mt-2 pt-2 border-t border-[#333333]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-[#D69A4E]"></span>
              <span className="text-[#888888]">Burglary (BNS 305)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-[#E53935]"></span>
              <span className="text-[#888888]">Cyber Crime</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-[#9884AC]"></span>
              <span className="text-[#888888]">Financial Fraud</span>
            </div>
          </div>
        </div>

        {/* Hotspot Registry */}
        <div className="bg-[#1A1A1A] border border-[#333333] rounded p-4">
          <span className="text-xs font-mono font-bold text-[#E0E0E0] tracking-tight uppercase block mb-1">Geospatial Hotspots</span>
          <span className="text-[10px] font-mono text-[#888888] block mb-4">Active risk-terrain coordinates currently tracked in the live GIS database.</span>

          <div className="space-y-3">
            {hotspots.map((h, i) => (
              <div key={i} className="bg-[#111111] border border-[#333333] rounded p-2.5 flex items-start gap-3">
                <MapPin className={`mt-0.5 ${h.density === "High" ? 'text-[#E53935]' : 'text-[#D69A4E]'} flex-shrink-0`} size={15} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-mono text-[#E0E0E0] font-medium truncate">{h.area}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${h.density === "High" ? 'bg-[#E53935]/15 text-[#E53935]' : 'bg-[#D69A4E]/15 text-[#D69A4E]'}`}>
                      {h.density}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-[#888888] truncate">{h.type}</div>
                  <div className="text-[9px] font-mono text-[#555555] mt-1 flex justify-between">
                    <span>{h.status}</span>
                    <span className="text-[#E53935]">Density Score: {h.index}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seasonal and Spikes Analysis */}
      <div className="bg-[#1A1A1A] border border-[#333333] rounded p-4">
        <span className="text-xs font-mono font-bold text-[#E0E0E0] tracking-tight uppercase block mb-1">Event-Based and Seasonal Spikes</span>
        <span className="text-[10px] font-mono text-[#888888] block mb-4">Empirical factors linked to recurrent local crime surges.</span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.seasonalFactors.map((s, i) => (
            <div key={i} className="bg-[#111111] border border-[#333333] rounded p-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-semibold text-[#E0E0E0]">{s.season}</span>
                  <AlertTriangle size={13} className="text-[#D69A4E]" />
                </div>
                <p className="text-[10px] font-mono text-[#888888] leading-relaxed mb-4">{s.factor}</p>
              </div>
              <div className="text-right text-xs font-mono font-bold text-[#E53935] bg-[#E53935]/5 px-2 py-1 rounded border border-[#E53935]/20">
                {s.change}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
