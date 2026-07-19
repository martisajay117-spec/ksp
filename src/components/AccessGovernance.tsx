import { useState, useEffect } from "react";
import { Shield, Eye, Lock, FileSpreadsheet, RefreshCw, KeyRound } from "lucide-react";
import { AuditLog } from "../types";

interface AccessGovernanceProps {
  role: string;
  setRole: (role: string) => void;
  auditLogs: AuditLog[];
  onRefreshLogs: () => void;
}

export default function AccessGovernance({ role, setRole, auditLogs, onRefreshLogs }: AccessGovernanceProps) {
  const [mfaCode, setMfaCode] = useState("448-124");
  const [mfaTimer, setMfaTimer] = useState(30);

  // Rotate simulated MFA tokens
  useEffect(() => {
    const interval = setInterval(() => {
      setMfaTimer(prev => {
        if (prev <= 1) {
          const rand = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`;
          setMfaCode(rand);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Role Management and simulated MFA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Role Config */}
        <div className="bg-[#1A1A1A] border border-[#333333] rounded p-4 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#333333]">
            <Shield size={14} className="text-[#E53935]" />
            <span className="text-xs font-mono font-bold text-[#E0E0E0] uppercase">Secure Role Level</span>
          </div>

          <div className="space-y-2">
            {[
              { r: "Supervisor", desc: "Full decryption of PII details & master overrides." },
              { r: "Investigator", desc: "Factual search access & case summary compiling." },
              { r: "Analyst", desc: "Graph structure audits. Sensitive suspect names masked." },
              { r: "Policymaker", desc: "Access limited to sociological dashboards & trends charts." }
            ].map((item) => (
              <label 
                key={item.r}
                className={`flex items-start gap-3 p-2.5 rounded border transition-colors cursor-pointer text-xs font-mono ${
                  role === item.r 
                    ? "bg-[#E53935]/5 border-[#E53935]/40 text-[#E0E0E0]" 
                    : "bg-[#111111] border-transparent text-[#888888] hover:bg-[#1A1A1A]"
                }`}
              >
                <input 
                  type="radio" 
                  name="user-role" 
                  value={item.r} 
                  checked={role === item.r}
                  onChange={() => setRole(item.r)}
                  className="mt-0.5 accent-[#E53935]"
                />
                <div>
                  <span className="font-semibold block">{item.r}</span>
                  <span className="text-[9px] text-[#555555] leading-tight block mt-0.5">{item.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Multi-Factor Authentication Token */}
        <div className="bg-[#1A1A1A] border border-[#333333] rounded p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2 border-b border-[#333333] mb-4">
              <KeyRound size={14} className="text-[#D69A4E]" />
              <span className="text-xs font-mono font-bold text-[#E0E0E0] uppercase">Simulated MFA Token</span>
            </div>

            <p className="text-[10px] font-mono text-[#888888] leading-relaxed mb-4">
              Karnataka State Police SSO requires continuous Multi-Factor Authentication (MFA) verification to decrypt CCTNS field dockets.
            </p>

            <div className="bg-[#111111] border border-[#333333] rounded p-4 text-center font-mono select-none">
              <div className="text-[9px] text-[#555555] uppercase mb-1">MFA PIN TOKEN</div>
              <div className="text-2xl font-bold text-[#D69A4E] tracking-widest">{mfaCode}</div>
              <div className="text-[9px] text-[#888888] mt-2 flex justify-between px-4">
                <span>ACTIVE: <b>martisajay117</b></span>
                <span className="text-[#E53935]">Rotates in {mfaTimer}s</span>
              </div>
            </div>
          </div>

          <div className="text-[9px] font-mono text-[#555555] leading-relaxed pt-3 border-t border-[#333333] flex items-start gap-1.5">
            <Lock size={10} className="mt-0.5 text-[#D69A4E]" />
            SSO tokens comply with DPDP Section 11 privacy-safeguard criteria.
          </div>
        </div>

        {/* DPDP Act Governance checklist */}
        <div className="bg-[#1A1A1A] border border-[#333333] rounded p-4 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#333333]">
            <Lock size={14} className="text-[#E53935]" />
            <span className="text-xs font-mono font-bold text-[#E0E0E0] uppercase">DPDP Act Compliance</span>
          </div>

          <div className="space-y-3 font-mono text-xs text-[#888888]">
            {[
              { label: "Data Minimization", status: "Active", desc: "Selective node property indexing based on role." },
              { label: "Immutable Trail", status: "Active", desc: "Write-once log writes for every chatbot question." },
              { label: "Breach Warning Engine", status: "Active", desc: "Sec 12 automated alerts triggers within 72 hrs." },
              { label: "PII Masking Filter", status: "Active", desc: "Dob, contact, KYC masking active for non-supervisors." }
            ].map((check, i) => (
              <div key={i} className="bg-[#111111] border border-[#333333] rounded p-2.5">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-[#E0E0E0]">{check.label}</span>
                  <span className="text-[9px] px-1 bg-[#7f9e6e]/15 text-[#7f9e6e] rounded">{check.status}</span>
                </div>
                <p className="text-[9px] text-[#555555] leading-tight">{check.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Live Immutable Audit Logs */}
      <div className="bg-[#1A1A1A] border border-[#333333] rounded p-4">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#333333]">
          <div className="flex items-center gap-2">
            <FileSpreadsheet size={15} className="text-[#E53935]" />
            <span className="text-xs font-mono font-bold text-[#E0E0E0] tracking-tight uppercase">Immutable CCTNS Governance Audit Logs</span>
          </div>
          <button 
            onClick={onRefreshLogs}
            className="flex items-center gap-1.5 text-[9px] font-mono bg-[#111111] border border-[#333333] hover:border-[#E53935]/40 text-[#888888] hover:text-[#E0E0E0] px-2 py-1 rounded transition-colors cursor-pointer"
          >
            <RefreshCw size={11} />
            REFRESH AUDIT TRAIL
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left font-mono text-[11px] text-[#888888]">
            <thead>
              <tr className="border-b border-[#333333] uppercase text-[#E0E0E0] text-[9px]">
                <th className="pb-2 font-medium">Log ID</th>
                <th className="pb-2 font-medium">Timestamp (UTC)</th>
                <th className="pb-2 font-medium">Operator</th>
                <th className="pb-2 font-medium">Role</th>
                <th className="pb-2 font-medium">Triggered Action</th>
                <th className="pb-2 font-medium">Details / Target</th>
                <th className="pb-2 font-medium text-right">DPDP Act Safeguard Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333333]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#111111]/40 transition-colors">
                  <td className="py-2.5 font-bold text-[#E53935]">{log.id}</td>
                  <td className="py-2.5 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="py-2.5 text-[#E0E0E0]">{log.user}</td>
                  <td className="py-2.5">{log.role}</td>
                  <td className="py-2.5 text-[#d69a4e]">{log.action}</td>
                  <td className="py-2.5 max-w-[200px] truncate">{log.details}</td>
                  <td className="py-2.5 text-right text-[#7f9e6e]">{log.dpdpCompliance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
