import { Shield, Sparkles, Clipboard, Clock, AlertOctagon } from "lucide-react";
import { mockPOLEData, historicalCases } from "../data/mockData";
import { Person } from "../types";

interface OffenderProfilingProps {
  onSelectNode: (node: any) => void;
  role: string;
}

export default function OffenderProfiling({ onSelectNode, role }: OffenderProfilingProps) {
  // Get only the persons from the mock data
  const offenders = mockPOLEData.nodes.filter(n => n.type === "Person") as Person[];

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div>
        <span className="text-xs font-mono font-bold text-[#E0E0E0] tracking-tight uppercase block mb-1">Criminology Offender Registry</span>
        <span className="text-[10px] font-mono text-[#888888] block">
          Habitual and repeat offenders tracked under CCTNS. Evaluated under advanced AI recidivism algorithms.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Offender Cards list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {offenders.map((o) => {
              const score = o.attrs.risk_score;
              const isVictim = o.attrs.role.toLowerCase().includes("victim");

              // Determine color class based on score
              const scoreColor = isVictim ? "text-[#7f9e6e]" : score > 0.8 ? "text-[#E53935]" : score > 0.5 ? "text-[#D69A4E]" : "text-[#6E93B8]";
              const scoreBg = isVictim ? "bg-[#7f9e6e]/10" : score > 0.8 ? "bg-[#E53935]/10" : score > 0.5 ? "bg-[#D69A4E]/10" : "bg-[#6E93B8]/10";
              const borderCol = isVictim ? "border-[#7f9e6e]/20" : score > 0.8 ? "border-[#E53935]/20" : score > 0.5 ? "border-[#D69A4E]/20" : "border-[#6E93B8]/20";

              return (
                <div 
                  key={o.id} 
                  onClick={() => onSelectNode(o)}
                  className="bg-[#1A1A1A] hover:bg-[#111111] border border-[#333333] hover:border-[#E53935]/40 rounded p-4 cursor-pointer transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-xs font-mono font-bold text-[#E0E0E0] block">
                          {role === "Analyst" && o.id !== "P-001" ? `Suspect ${o.id}` : o.label}
                        </span>
                        <span className="text-[9px] font-mono text-[#555555]">{o.id} · DOB: {role === "Analyst" ? "XX-XX-XXXX" : o.attrs.dob}</span>
                      </div>
                      
                      <div className={`text-right px-2 py-0.5 rounded border text-[10px] font-mono ${scoreColor} ${scoreBg} ${borderCol}`}>
                        {isVictim ? "Victim" : `Risk: ${(score * 100).toFixed(0)}%`}
                      </div>
                    </div>

                    <p className="text-[10px] font-mono text-[#888888] leading-relaxed mb-3 line-clamp-2">
                      {o.attrs.background}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#333333] mt-2 flex justify-between text-[9px] font-mono text-[#555555]">
                    <span>Role: <b className="text-[#E0E0E0]">{o.attrs.role}</b></span>
                    {o.attrs.known_gang_affiliation && (
                      <span className="text-[#E53935] truncate max-w-[50%]">{o.attrs.known_gang_affiliation}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Behavioral Signature & MO Analysis */}
        <div className="bg-[#1A1A1A] border border-[#333333] rounded p-4 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#333333]">
            <Shield size={14} className="text-[#D69A4E]" />
            <span className="text-xs font-mono font-bold text-[#E0E0E0] uppercase">MO & Behavioral Fingerprint</span>
          </div>

          <div className="space-y-4 font-mono text-xs text-[#888888]">
            <div>
              <span className="text-[9px] text-[#555555] block mb-1 uppercase">R. Manjunath (Prime Accused)</span>
              <div className="bg-[#111111] rounded p-2.5 border border-[#333333] text-[10px] leading-relaxed">
                <b>Modus Operandi</b>: Forced physical entries between 1 AM and 3 AM. Targets safes, bents back door grills with a crowbar. Wears gloves, disables surveillance. Disposes jewelry via local receiving rings immediately.
              </div>
            </div>

            <div>
              <span className="text-[9px] text-[#555555] block mb-1 uppercase">Recidivism Factors</span>
              <ul className="space-y-1 text-[10px] list-disc list-inside leading-relaxed text-[#888888]">
                <li>Multi-arrest history within Bengaluru South PS</li>
                <li>Migrant profile creates transit flight risk</li>
                <li>Close link with high-value receiver K. Suresha</li>
                <li>No formal income registered (Daily wages fallback)</li>
              </ul>
            </div>

            <div className="pt-2 border-t border-[#333333] flex items-center gap-1.5 text-[9px] text-[#E53935]">
              <AlertOctagon size={11} />
              Supervisor overrides active on recidivism scores.
            </div>
          </div>
        </div>

      </div>

      {/* Historical Cases Timeline */}
      <div className="bg-[#1A1A1A] border border-[#333333] rounded p-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={15} className="text-[#E53935]" />
          <span className="text-xs font-mono font-bold text-[#E0E0E0] tracking-tight uppercase">Criminal Activity & Seizure Timelines</span>
        </div>

        <div className="relative border-l border-[#333333] ml-3 pl-4 space-y-5">
          {historicalCases.map((hc, i) => (
            <div key={i} className="relative">
              {/* Timeline dot */}
              <div className="absolute -left-[20.5px] top-1 w-2.5 h-2.5 rounded-full bg-[#E53935] border border-[#111111]"></div>
              
              <div className="text-[10px] font-mono text-[#555555] mb-1">{hc.date} · CCTNS ID: {hc.id}</div>
              <span className="text-xs font-mono font-bold text-[#E0E0E0] block">{hc.title}</span>
              <span className="text-[10px] font-mono text-[#E53935] block mb-2">{hc.classification}</span>
              
              <p className="text-[10px] font-mono text-[#888888] leading-relaxed mb-2">
                <b>Modus Operandi</b>: {hc.modus_operandi}
              </p>
              
              <div className="bg-[#111111] p-2 border border-[#333333] rounded text-[9px] font-mono text-[#888888]">
                <b>Investigation Timelines</b>: {hc.investigation_timeline}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
