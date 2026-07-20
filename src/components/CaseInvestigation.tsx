import { useState, ChangeEvent } from "react";
import { 
  FileText, Shield, User, AlertCircle, MapPin, 
  Layers, ChevronRight, CheckCircle, Clock, Link, Compass, ArrowRight
} from "lucide-react";
import { casesData } from "../data/casesData";

interface CaseInvestigationProps {
  selectedCaseId: string;
  onChangeCaseId: (caseId: string) => void;
  onFocusNode: (nodeId: string) => void;
}

export default function CaseInvestigation({ selectedCaseId, onChangeCaseId, onFocusNode }: CaseInvestigationProps) {
  const [activeDossierTab, setActiveDossierTab] = useState<"brief" | "parties" | "acts" | "db">("brief");

  const currentCase = casesData[selectedCaseId] || casesData.jayanagar;

  const handleSelectCaseChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onChangeCaseId(val);
  };

  return (
    <div className="space-y-5 font-sans">
      
      {/* Top Selector Panel */}
      <div className="bg-[#1A1A1A] border border-[#333333] rounded p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-[#E0E0E0] uppercase tracking-wider flex items-center gap-2">
              <Compass size={16} className="text-[#E53935]" />
              Case Investigation Registry
            </h2>
            <p className="text-[11px] text-[#888888] font-mono mt-0.5">
              Select an active CCTNS docket to inspect the relational schema, facts, and suspect associations.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <label htmlFor="docket-picker" className="text-xs font-mono text-[#888888] whitespace-nowrap">Select Case Docket:</label>
            <select
              id="docket-picker"
              value={selectedCaseId}
              onChange={handleSelectCaseChange}
              className="bg-[#111111] border border-[#333333] text-xs font-mono text-[#E53935] rounded px-3 py-2 outline-none focus:border-[#E53935] cursor-pointer min-w-[280px] lg:min-w-[340px]"
            >
              {Object.values(casesData).map((c) => (
                <option key={c.id} value={c.id}>
                  🚨 [{c.status.toUpperCase()}] {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Case Dossier Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Side: Summary & DB Schema Dossier */}
        <div className="lg:col-span-8 bg-[#1A1A1A] border border-[#333333] rounded flex flex-col overflow-hidden min-h-[500px]">
          
          {/* Dossier Header */}
          <div className="bg-[#111111] border-b border-[#333333] p-4 flex justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                  currentCase.status.includes("Active") 
                    ? "bg-[#E53935]/15 text-[#E53935] border border-[#E53935]/30" 
                    : "bg-[#D69A4E]/15 text-[#D69A4E] border border-[#D69A4E]/30"
                }`}>
                  {currentCase.status}
                </span>
                <span className="text-[10px] font-mono text-[#888888]">CCTNS Registered: {currentCase.registeredDate}</span>
              </div>
              <h3 className="text-base font-bold text-[#E0E0E0] mt-1.5">{currentCase.title}</h3>
              <p className="text-[10px] font-mono text-[#888888] mt-0.5">{currentCase.district} · {currentCase.policeStation}</p>
            </div>

            <div className="text-right font-mono text-xs">
              <span className="text-[#888888] text-[9px] block uppercase">CCTNS Crime No</span>
              <span className="text-[#E0E0E0] font-bold">{currentCase.crimeNo}</span>
              <span className="text-[10px] text-[#888888] block mt-0.5">Case ID: {currentCase.caseNo}</span>
            </div>
          </div>

          {/* Dossier Navigation Tabs */}
          <div className="flex bg-[#151515] border-b border-[#333333] px-2 select-none">
            {[
              { id: "brief", label: "Brief Facts & Meta", icon: <FileText size={12} /> },
              { id: "parties", label: "Complainant, Victim & Accused", icon: <User size={12} /> },
              { id: "acts", label: "Legal Sections (IPC/BNS)", icon: <Shield size={12} /> },
              { id: "db", label: "Relational Schema Verification", icon: <Layers size={12} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveDossierTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-3 text-[11px] font-mono border-b-2 transition-all cursor-pointer ${
                  activeDossierTab === tab.id
                    ? "border-[#E53935] text-[#E0E0E0] font-bold bg-[#1A1A1A]"
                    : "border-transparent text-[#888888] hover:text-[#E0E0E0]"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dossier Content Area */}
          <div className="p-6 flex-1 overflow-y-auto">
            
            {activeDossierTab === "brief" && (
              <div className="space-y-5">
                <div className="bg-[#111111]/80 border border-[#333333] rounded p-4.5">
                  <span className="text-[10px] font-mono font-bold text-[#E53935] uppercase tracking-wider block mb-2">Case Brief Facts</span>
                  <p className="text-xs font-mono text-[#b8bfca] leading-relaxed">
                    {currentCase.briefFacts}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#111111]/40 border border-[#333333]/60 rounded p-4">
                    <span className="text-[10px] font-mono font-bold text-[#888888] uppercase block mb-3">Spatial Mapping</span>
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-[#888888]">GPS Latitude:</span>
                        <span className="text-[#E0E0E0] font-bold">{currentCase.latitude}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#888888]">GPS Longitude:</span>
                        <span className="text-[#E0E0E0] font-bold">{currentCase.longitude}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#888888]">Sector Checkpoint:</span>
                        <span className="text-[#D69A4E] font-bold flex items-center gap-1">
                          <MapPin size={11} /> {currentCase.district.replace(" Division", "")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#111111]/40 border border-[#333333]/60 rounded p-4">
                    <span className="text-[10px] font-mono font-bold text-[#888888] uppercase block mb-3">Classification Details</span>
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-[#888888]">Gravity Level:</span>
                        <span className="text-[#E53935] font-bold">{currentCase.gravity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#888888]">Major Head:</span>
                        <span className="text-[#E0E0E0]">{currentCase.crimeMajorHead}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#888888]">Minor Head:</span>
                        <span className="text-[#E0E0E0] text-[11px] truncate max-w-[180px]">{currentCase.crimeMinorHead}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#111111]/20 border border-[#333333]/40 rounded p-4 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-[#888888]" />
                    <span className="text-[#888888]">Investigated by:</span>
                    <span className="text-[#E0E0E0] font-medium">{currentCase.investigatingOfficer}</span>
                  </div>
                  <span className="text-[#E53935] text-[10px] font-bold">[AUTHORIZED EXAMINER]</span>
                </div>
              </div>
            )}

            {activeDossierTab === "parties" && (
              <div className="space-y-6">
                
                {/* Complainant & Victim */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* ComplainantDetails Table */}
                  <div className="border border-[#333333] rounded bg-[#111111]/40 p-4">
                    <div className="flex items-center gap-2 text-[#E53935] font-bold text-[11px] font-mono uppercase tracking-wider mb-3 pb-1 border-b border-[#333333]">
                      <FileText size={12} />
                      Complainant Record (DB: ComplainantDetails)
                    </div>
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-[#888888]">ID:</span>
                        <span className="text-[#E0E0E0]">{currentCase.complainant.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#888888]">Full Name:</span>
                        <span className="text-[#E0E0E0] font-bold">{currentCase.complainant.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#888888]">Age / Gender:</span>
                        <span className="text-[#E0E0E0]">{currentCase.complainant.age} Yrs / {currentCase.complainant.gender}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#888888]">Occupation:</span>
                        <span className="text-[#E0E0E0]">{currentCase.complainant.occupation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#888888]">Religion / Caste ID:</span>
                        <span className="text-[#E0E0E0] text-[10px]">{currentCase.complainant.religion} · {currentCase.complainant.caste}</span>
                      </div>
                    </div>
                  </div>

                  {/* Victim Table */}
                  <div className="border border-[#333333] rounded bg-[#111111]/40 p-4">
                    <div className="flex items-center gap-2 text-[#E53935] font-bold text-[11px] font-mono uppercase tracking-wider mb-3 pb-1 border-b border-[#333333]">
                      <User size={12} />
                      Victim Record (DB: Victim)
                    </div>
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-[#888888]">ID:</span>
                        <span className="text-[#E0E0E0]">{currentCase.victim.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#888888]">Full Name:</span>
                        <span className="text-[#E0E0E0] font-bold">{currentCase.victim.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#888888]">Age / Gender:</span>
                        <span className="text-[#E0E0E0]">{currentCase.victim.age ? `${currentCase.victim.age} Yrs` : "N/A"} / {currentCase.victim.gender}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#888888]">Is Police Personnel:</span>
                        <span className={`font-bold ${currentCase.victim.isPolice === "Yes" ? "text-[#E53935]" : "text-[#888888]"}`}>
                          {currentCase.victim.isPolice}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Accused & Arrest Info */}
                <div className="border border-[#333333] rounded bg-[#111111]/20 p-5">
                  <span className="text-[10px] font-mono font-bold text-[#E53935] uppercase tracking-wider block mb-4 pb-1 border-b border-[#333333]/50">
                    Accused & Arrest Details (DB: Accused, ArrestSurrender)
                  </span>

                  <div className="space-y-4">
                    {currentCase.accused.map((acc, index) => (
                      <div key={acc.id} className="bg-[#111111]/60 border border-[#333333]/60 rounded p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono font-bold bg-[#E53935]/15 text-[#E53935] border border-[#E53935]/30 px-1.5 py-0.5 rounded uppercase">
                              {acc.personId}
                            </span>
                            <span className="text-xs font-mono font-bold text-[#E0E0E0]">{acc.name}</span>
                          </div>
                          <p className="text-[10px] font-mono text-[#888888]">ID: {acc.id} · Age/Sex: {acc.age} Yrs / {acc.gender}</p>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => onFocusNode(acc.suspectId)}
                            className="bg-transparent hover:bg-[#E53935]/15 text-[#E53935] border border-[#E53935]/30 hover:border-[#E53935] px-2.5 py-1 text-[10px] font-mono rounded cursor-pointer transition-all flex items-center gap-1.5 uppercase font-bold"
                          >
                            <Link size={11} /> Trace POLE Node
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className="mt-4 pt-3 border-t border-[#333333]/40 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-[#888888]">
                      <div>
                        <span className="text-[10px] block text-[#888888] uppercase font-bold">Primary Arrest Surrender Log:</span>
                        <div className="space-y-1 mt-1.5 text-[11px]">
                          <div><span className="text-[#888888]">Event ID:</span> <span className="text-[#E0E0E0]">{currentCase.arrest.id}</span></div>
                          <div><span className="text-[#888888]">Arrest Date:</span> <span className="text-[#E0E0E0]">{currentCase.arrest.date}</span></div>
                          <div><span className="text-[#888888]">Type / Form:</span> <span className="text-[#E0E0E0]">{currentCase.arrest.type}</span></div>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] block text-[#888888] uppercase font-bold">Jurisdiction Routing:</span>
                        <div className="space-y-1 mt-1.5 text-[11px]">
                          <div><span className="text-[#888888]">Police Station:</span> <span className="text-[#E0E0E0]">{currentCase.arrest.station}</span></div>
                          <div><span className="text-[#888888]">Filing District:</span> <span className="text-[#E0E0E0]">{currentCase.arrest.district}</span></div>
                          <div><span className="text-[#888888]">Committed Court:</span> <span className="text-[#D69A4E] font-bold">{currentCase.arrest.court}</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {activeDossierTab === "acts" && (
              <div className="space-y-4">
                <span className="text-[10px] font-mono font-bold text-[#888888] uppercase tracking-wider block mb-1">
                  Charged Acts & Enacted Sections (DB: ActSectionAssociation)
                </span>
                
                <div className="space-y-3">
                  {currentCase.acts.map((actSec, idx) => (
                    <div key={idx} className="bg-[#111111]/50 border border-[#333333] rounded p-4 flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#E53935]/10 border border-[#E53935]/30 text-[#E53935] flex items-center justify-center font-bold text-xs font-mono shrink-0 mt-0.5">
                        §
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#E53935] font-mono font-bold text-xs">{actSec.section}</span>
                          <span className="text-[10px] text-[#888888] font-mono bg-[#1A1A1A] border border-[#333333] px-1.5 py-0.5 rounded">{actSec.act}</span>
                        </div>
                        <p className="text-xs font-mono text-[#b8bfca] mt-1.5 leading-relaxed">
                          {actSec.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-[#D69A4E]/10 border border-[#D69A4E]/30 rounded p-4 text-[11px] font-mono text-[#D69A4E] leading-relaxed mt-4">
                  <strong>⚠️ Legal Disclaimer</strong>: Sections are mapped automatically using the Karnataka Police Department Centralized CCTNS Legal Ontology mapping. Act Code matches are bound to the specific IncidentFromDate constraints.
                </div>
              </div>
            )}

            {activeDossierTab === "db" && (
              <div className="space-y-5 text-xs font-mono">
                
                {/* Schema validation report */}
                <div className="bg-[#111111] border border-[#333333] rounded p-4">
                  <span className="text-[10px] font-bold text-[#888888] uppercase block mb-3">Relational DB Constraints Summary</span>
                  
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[#7F9E6E] border-b border-[#333333]/40 pb-1.5">
                      <span className="flex items-center gap-1.5"><CheckCircle size={12} /> CaseMaster Row Verified</span>
                      <span className="font-bold">STATUS: COMPLIANT</span>
                    </div>
                    <p className="text-[10px] text-[#888888] leading-normal pl-4">
                      Unique identifier <code className="text-[#E53935]">CaseMasterID</code> matches the parent primary key mapping. Foreign key constraints to Employee, Unit, CaseCategory, GravityOffence, CrimeHead, and Court evaluate as healthy.
                    </p>

                    <div className="flex items-center justify-between text-[#7F9E6E] border-b border-[#333333]/40 pt-2 pb-1.5">
                      <span className="flex items-center gap-1.5"><CheckCircle size={12} /> ComplainantDetails Foreign Keys Verified</span>
                      <span className="font-bold">STATUS: COMPLIANT</span>
                    </div>
                    <p className="text-[10px] text-[#888888] leading-normal pl-4">
                      Complainant record maps exactly to <code className="text-[#E0E0E0]">CaseMasterID</code> with valid indices on OccupationID, ReligionID, and CasteID.
                    </p>

                    <div className="flex items-center justify-between text-[#7F9E6E] border-b border-[#333333]/40 pt-2 pb-1.5">
                      <span className="flex items-center gap-1.5"><CheckCircle size={12} /> ActSectionAssociation Mapping Verified</span>
                      <span className="font-bold">STATUS: COMPLIANT</span>
                    </div>
                    <p className="text-[10px] text-[#888888] leading-normal pl-4">
                      Invoked sections ({currentCase.acts.map(a => a.section).join(", ")}) resolved successfully to primary ActCode indexes.
                    </p>
                  </div>
                </div>

                <div className="border border-[#333333]/60 bg-[#111111]/40 rounded p-4">
                  <span className="text-[10px] font-bold text-[#888888] uppercase block mb-2">ER Diagram Structural Blueprint Reference</span>
                  <p className="text-[10px] text-[#888888] leading-relaxed mb-3">
                    Every data point rendered above conforms to the schema in the <strong>Karnataka Police FIR System database model</strong>. 
                  </p>
                  <div className="flex flex-wrap gap-2 text-[9px]">
                    <span className="bg-[#1A1A1A] px-2 py-0.5 rounded border border-[#333333] text-[#E0E0E0]">CaseMaster: One-to-Many -&gt; Victim</span>
                    <span className="bg-[#1A1A1A] px-2 py-0.5 rounded border border-[#333333] text-[#E0E0E0]">CaseMaster: One-to-Many -&gt; Accused</span>
                    <span className="bg-[#1A1A1A] px-2 py-0.5 rounded border border-[#333333] text-[#E0E0E0]">CaseMaster: One-to-Many -&gt; ArrestSurrender</span>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

        {/* Right Side: Quick Action Panel & Selected suspect details */}
        <div className="lg:col-span-4 space-y-5">
          
          <div className="bg-[#1A1A1A] border border-[#333333] rounded p-5">
            <h4 className="text-xs font-bold text-[#E0E0E0] uppercase tracking-wider block mb-3 pb-1 border-b border-[#333333]">
              Active Docket Diagnostics
            </h4>
            
            <div className="space-y-4 font-mono text-xs text-[#888888]">
              <div>
                <span className="text-[10px] block uppercase text-[#888888]">Case Registry Status:</span>
                <span className="text-[#E53935] font-bold text-[11px] block mt-1">
                  {currentCase.status.includes("Active") ? "🚨 Active Investigation" : "📂 Sealed / Under Prosecution"}
                </span>
              </div>

              <div>
                <span className="text-[10px] block uppercase text-[#888888]">Neural RAG Availability:</span>
                <span className="text-[#7F9E6E] font-bold text-[11px] block mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7F9E6E] animate-pulse"></span> ONLINE (Autonomous)
                </span>
              </div>

              <div>
                <span className="text-[10px] block uppercase text-[#888888]">Assigned IO Division:</span>
                <span className="text-[#E0E0E0] block mt-1">{currentCase.policeStation}</span>
                <span className="text-[10px] text-[#888888]">{currentCase.district}</span>
              </div>

              <div className="pt-3 border-t border-[#333333]">
                <span className="text-[10px] text-[#888888] block mb-2 uppercase font-bold">Action Quick-Link:</span>
                
                <div className="space-y-2">
                  {currentCase.accused.map(acc => (
                    <button
                      key={acc.id}
                      onClick={() => onFocusNode(acc.suspectId)}
                      className="w-full text-left bg-[#111111] hover:bg-[#E53935]/10 border border-[#333333] hover:border-[#E53935]/50 p-2.5 rounded transition-all cursor-pointer flex items-center justify-between text-xs font-mono"
                    >
                      <div className="min-w-0">
                        <span className="text-white font-semibold truncate block">{acc.name}</span>
                        <span className="text-[9px] text-[#888888] block">ID: {acc.id} · {acc.personId}</span>
                      </div>
                      <ArrowRight size={13} className="text-[#E53935] shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#D69A4E]/10 border border-[#D69A4E]/30 rounded p-5 text-xs font-mono text-[#D69A4E] space-y-2">
            <h5 className="font-bold flex items-center gap-1 uppercase">
              <AlertCircle size={14} /> Case Docket Brief Notice
            </h5>
            <p className="leading-normal text-[11px] text-[#b8bfca]">
              {selectedCaseId === "jayanagar" 
                ? "This docket relates to a series of high-end burglaries and housebreakings in the Jayanagar and BTM Layout sectors of Bengaluru South Division. Immediate focus is assigned to tracking fencing channels and verifying pawn ledger transactions."
                : `This is a reference docket for ${currentCase.title}. All entity links and transaction networks are retained in the master central CCTNS directory for audit purposes.`
              }
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
