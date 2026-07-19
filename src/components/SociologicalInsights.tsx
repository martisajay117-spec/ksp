import { Users, Info, BarChart2, BookOpen } from "lucide-react";
import { sociologicalStats } from "../data/mockData";

export default function SociologicalInsights() {
  const stats = sociologicalStats;

  return (
    <div className="space-y-6">
      
      {/* Intro and info panel */}
      <div className="bg-[#111111] border border-[#333333] rounded p-4 flex items-start gap-4">
        <div className="p-2.5 bg-[#E53935]/10 rounded border border-[#E53935]/20 text-[#E53935] mt-0.5">
          <BookOpen size={18} />
        </div>
        <div>
          <span className="text-xs font-mono font-bold text-[#E0E0E0] block mb-1">Criminological Sociology Audit</span>
          <p className="text-[10px] font-mono text-[#888888] leading-relaxed">
            Criminology-based social indicators match urbanization, economic stress levels, and demographic profiles to highlight key systemic triggers. 
            Aligning patrols with social risk factors enables proactive interventions and restorative local community policing.
          </p>
        </div>
      </div>

      {/* Demographic Breakdown Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Age & Gender Distribution */}
        <div className="bg-[#1A1A1A] border border-[#333333] rounded p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users size={15} className="text-[#E53935]" />
            <span className="text-xs font-mono font-bold text-[#E0E0E0] tracking-tight uppercase">Age and Gender Demographics</span>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono text-[#888888] block mb-2 uppercase">Offender Age Tally (%)</span>
              <div className="space-y-2">
                {stats.ageDistribution.map((a, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[10px] font-mono text-[#888888] mb-1">
                      <span>Age {a.range}</span>
                      <span>{a.percentage}% ({a.count} cases)</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#111111] rounded overflow-hidden">
                      <div 
                        className="h-full bg-[#E53935] rounded" 
                        style={{ width: `${a.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#333333]">
              <span className="text-[10px] font-mono text-[#888888] block mb-2 uppercase">Gender Ratio</span>
              <div className="flex gap-2 text-[10px] font-mono">
                <div className="flex-1 bg-[#111111] border border-[#333333] rounded p-2 text-center">
                  <div className="text-[#888888]">Male Offenders</div>
                  <div className="text-lg font-bold text-[#E0E0E0] mt-1">91%</div>
                </div>
                <div className="flex-1 bg-[#111111] border border-[#333333] rounded p-2 text-center">
                  <div className="text-[#888888]">Female Offenders</div>
                  <div className="text-lg font-bold text-[#E0E0E0] mt-1">9%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Socio-Economic and Class Profile */}
        <div className="bg-[#1A1A1A] border border-[#333333] rounded p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 size={15} className="text-[#D69A4E]" />
              <span className="text-xs font-mono font-bold text-[#E0E0E0] tracking-tight uppercase">Socio-Economic Distribution</span>
            </div>

            <span className="text-[10px] font-mono text-[#888888] block mb-2 uppercase">Economic Background of Registered Offenders</span>
            <div className="space-y-3">
              {stats.socioEconomicBackground.map((s, i) => (
                <div key={i} className="bg-[#111111] border border-[#333333] rounded p-2">
                  <div className="flex justify-between items-center text-[10px] font-mono text-[#888888] mb-1">
                    <span className="text-[#E0E0E0] font-medium">{s.status}</span>
                    <span>{s.percentage}%</span>
                  </div>
                  <div className="w-full h-1 bg-[#1A1A1A] rounded overflow-hidden">
                    <div 
                      className="h-full bg-[#D69A4E] rounded" 
                      style={{ width: `${s.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[9px] font-mono text-[#555555] leading-relaxed pt-3 border-t border-[#333333] flex items-start gap-1.5">
            <Info size={10} className="mt-0.5 text-[#D69A4E]" />
            Note: Migrant labor demographic concentration is closely linked to lack of secure housing, rendering high correlation to casual property offenses.
          </div>
        </div>

      </div>

      {/* Correlation Indicators Table */}
      <div className="bg-[#1A1A1A] border border-[#333333] rounded p-4">
        <span className="text-xs font-mono font-bold text-[#E0E0E0] tracking-tight uppercase block mb-1">Criminological Correlation Metrics</span>
        <span className="text-[10px] font-mono text-[#888888] block mb-4">Statistical Pearson correlation matrix linking systemic stress indicators to crime rates.</span>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left font-mono text-xs text-[#888888]">
            <thead>
              <tr className="border-b border-[#333333] text-[10px] uppercase text-[#E0E0E0]">
                <th className="pb-2 font-medium">Socio-Social Indicator</th>
                <th className="pb-2 font-medium">Pearson Correlation (r)</th>
                <th className="pb-2 font-medium text-right">Systemic Operational Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333333]">
              {stats.correlationStats.map((c, i) => (
                <tr key={i} className="hover:bg-[#111111]/40 transition-colors">
                  <td className="py-3 text-[#E0E0E0] font-medium">{c.metric}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#E53935]">{c.correlationScore}</span>
                      <div className="w-16 h-1.5 bg-[#111111] rounded overflow-hidden">
                        <div 
                          className="h-full bg-[#E53935] rounded" 
                          style={{ width: `${c.correlationScore * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-right text-[#D69A4E]">{c.impact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
