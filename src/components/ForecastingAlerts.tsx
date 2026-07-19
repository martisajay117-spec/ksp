import { AlertTriangle, ShieldCheck, Zap, Sparkles, Network } from "lucide-react";
import { forecastingAlerts } from "../data/mockData";

export default function ForecastingAlerts() {
  const alerts = forecastingAlerts;

  return (
    <div className="space-y-6">
      
      {/* Forecasting Core Architecture Info */}
      <div className="bg-[#1A1A1A] border border-[#333333] rounded p-4">
        <div className="flex items-center gap-2 mb-2">
          <Zap size={15} className="text-[#E53935]" />
          <span className="text-xs font-mono font-bold text-[#E0E0E0] uppercase">AI Forecasting Core (RW-STGCN / Hawkes Process)</span>
        </div>
        <p className="text-[10px] font-mono text-[#888888] leading-relaxed mb-4">
          Calculates spatio-temporal dependencies using road-weighted graph spectral convolutions. 
          To capture self-exciting repeat burglary patterns, the engine integrates a **Hawkes Point Process model** directly into temporal Gated ResNet layers.
        </p>

        {/* Graph representation of the GCN */}
        <div className="bg-[#111111] p-3 border border-[#333333] rounded font-mono text-[10px] text-[#888888] space-y-3">
          <div className="flex justify-between items-center text-[9px] text-[#555555] border-b border-[#333333] pb-1.5">
            <span>SPATIO-TEMPORAL FORECASTING PIPELINE</span>
            <span>MODEL ALIAS: gemini-2.5-flash Grounded</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-center text-[9px]">
            <div className="bg-[#1A1A1A] border border-[#333333] rounded p-2">
              <span className="text-[#E0E0E0] font-bold block mb-1">Temporal Gated ResNet</span>
              Extracts day/night activity spikes and historical seasonal frequencies.
            </div>
            <div className="bg-[#1A1A1A] border border-[#E53935]/30 rounded p-2">
              <span className="text-[#E53935] font-bold block mb-1">Spatial Spectral GCN</span>
              Governed by normalized road-weighted graph Laplacian matrices.
            </div>
            <div className="bg-[#1A1A1A] border border-[#333333] rounded p-2">
              <span className="text-[#D69A4E] font-bold block mb-1">Hawkes Point Solver</span>
              Models self-excitation (crime begets crime) within a 500-ft radius.
            </div>
          </div>
        </div>
      </div>

      {/* Early Warning Alerts list */}
      <div className="space-y-4">
        <span className="text-xs font-mono font-bold text-[#E0E0E0] uppercase block">Predictive Early Warning Alerts</span>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((al) => {
            const isCrit = al.severity === "Critical" || al.severity === "High";
            return (
              <div 
                key={al.id} 
                className={`bg-[#1A1A1A] border rounded p-4 flex flex-col justify-between ${
                  isCrit ? 'border-[#E53935]/30' : 'border-[#333333]'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-mono text-[#555555]">{al.id} · Region: {al.area}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                      al.severity === "Critical" ? 'bg-[#E53935]/15 text-[#E53935]' :
                      al.severity === "High" ? 'bg-[#E53935]/10 text-[#E53935]' :
                      'bg-[#D69A4E]/10 text-[#D69A4E]'
                    }`}>
                      {al.severity} Severity
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold text-[#E0E0E0] block mb-1">{al.crimeType}</span>
                  <div className="text-[10px] font-mono text-[#E53935] mb-3">Probability Rate: {al.probability}</div>
                  
                  <p className="text-[10px] font-mono text-[#888888] leading-relaxed mb-4">
                    <b>AI Justification (Explainable AI)</b>: {al.justification}
                  </p>
                </div>

                <div className="bg-[#111111] p-2.5 border border-[#333333] rounded text-[9px] font-mono text-[#888888] flex gap-2 items-start">
                  <ShieldCheck size={14} className="text-[#7f9e6e] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[#E0E0E0] font-semibold block">KSP Action Plan</span>
                    {al.actionPlan}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
