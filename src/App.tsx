import React, { useState, useEffect } from "react";
import { 
  Network, TrendingUp, Users, Coins, Zap, Shield, 
  HelpCircle, RefreshCw, FileText, Search, BookOpen, Clock, AlertTriangle, Play, Sparkles,
  Maximize2, Minimize2, Compass, Sun, Moon, Lock, Mail, ChevronRight
} from "lucide-react";

// Components
import NetworkGraph from "./components/NetworkGraph";
import ChatbotInterface from "./components/ChatbotInterface";
import TrendsAnalytics from "./components/TrendsAnalytics";
import SociologicalInsights from "./components/SociologicalInsights";
import OffenderProfiling from "./components/OffenderProfiling";
import FinancialCrime from "./components/FinancialCrime";
import ForecastingAlerts from "./components/ForecastingAlerts";
import AccessGovernance from "./components/AccessGovernance";
import CaseInvestigation from "./components/CaseInvestigation";

// Types & Mock Data
import { POLEEntity, POLELink, AuditLog, HistoricalCase } from "./types";
import { mockPOLEData } from "./data/mockData";
import { casesData } from "./data/casesData";

const TYPE_COLOR: Record<string, string> = {
  Person: '#E53935',
  Object: '#6E93B8',
  Location: '#7F9E6E',
  Event: '#D69A4E',
  BankAccount: '#9884AC'
};

const karnatakaDistricts = [
  "Bagalkot",
  "Ballari",
  "Belagavi",
  "Bengaluru Rural",
  "Bengaluru Urban",
  "Bidar",
  "Chamarajanagar",
  "Chikkaballapura",
  "Chikkamagaluru",
  "Chitradurga",
  "Dakshina Kannada",
  "Davanagere",
  "Dharwad",
  "Gadag",
  "Hassan",
  "Haveri",
  "Kalaburagi",
  "Kodagu",
  "Kolar",
  "Koppal",
  "Mandya",
  "Mysuru",
  "Raichur",
  "Ramanagara",
  "Shivamogga",
  "Tumakuru",
  "Udupi",
  "Uttara Kannada",
  "Vijayanagara",
  "Vijayapura",
  "Yadgir"
];

const karnatakaStationMap: Record<string, { name: string; code: string }[]> = {
  "Bagalkot": [
    { name: "Bagalkot Town PS", code: "0649" },
    { name: "Bagalkot Rural PS", code: "0651" },
    { name: "Badami PS", code: "0653" },
    { name: "Jamkhandi PS", code: "0660" }
  ],
  "Ballari": [
    { name: "Ballari Town PS", code: "0512" },
    { name: "Cowll Bazar PS", code: "0514" },
    { name: "Brucepet PS", code: "0515" },
    { name: "Ballari Rural PS", code: "0516" }
  ],
  "Belagavi": [
    { name: "Belagavi Market PS", code: "0551" },
    { name: "Belagavi Khadebazar PS", code: "0541" },
    { name: "Belagavi Rural PS", code: "0557" },
    { name: "Chikkodi PS", code: "0587" }
  ],
  "Bengaluru Rural": [
    { name: "Hoskote PS", code: "0130" },
    { name: "Doddaballapura Town PS", code: "0132" },
    { name: "Nelamangala Town PS", code: "0135" },
    { name: "Devanahalli PS", code: "0138" }
  ],
  "Bengaluru Urban": [
    { name: "Jayanagar PS", code: "0031" },
    { name: "Indiranagar PS", code: "0055" },
    { name: "Yeshwanthpur PS", code: "0001" },
    { name: "Whitefield PS", code: "0133" }
  ],
  "Bidar": [
    { name: "Bidar Town PS", code: "0710" },
    { name: "Gandhi Gunj PS", code: "0712" },
    { name: "Basavakalyan PS", code: "0715" },
    { name: "Bhalki Town PS", code: "0718" }
  ],
  "Chamarajanagar": [
    { name: "Chamarajanagar Town PS", code: "0310" },
    { name: "Kollegal Town PS", code: "0312" },
    { name: "Gundlupet PS", code: "0315" },
    { name: "Yelandur PS", code: "0318" }
  ],
  "Chikkaballapura": [
    { name: "Chikkaballapura Town PS", code: "0180" },
    { name: "Chintamani Town PS", code: "0182" },
    { name: "Gauribidanur PS", code: "0185" },
    { name: "Sidlaghatta Town PS", code: "0188" }
  ],
  "Chikkamagaluru": [
    { name: "Chikkamagaluru Town PS", code: "0380" },
    { name: "Kadur PS", code: "0382" },
    { name: "Tarikere PS", code: "0385" },
    { name: "Mudigere PS", code: "0388" }
  ],
  "Chitradurga": [
    { name: "Chitradurga Town PS", code: "0530" },
    { name: "Challakere PS", code: "0532" },
    { name: "Hiriyur PS", code: "0535" },
    { name: "Hosadurga PS", code: "0538" }
  ],
  "Dakshina Kannada": [
    { name: "Mangaluru Town PS", code: "0360" },
    { name: "Barke PS", code: "0362" },
    { name: "Puttur Town PS", code: "0365" },
    { name: "Bantwal Town PS", code: "0368" }
  ],
  "Davanagere": [
    { name: "Davanagere Layout PS", code: "0501" },
    { name: "Vidhananagar PS", code: "0503" },
    { name: "Harihar Town PS", code: "0506" },
    { name: "Honnali PS", code: "0509" }
  ],
  "Dharwad": [
    { name: "Dharwad Town PS", code: "0410" },
    { name: "Dharwad Suburban PS", code: "0412" },
    { name: "Hubballi Town PS", code: "0117" },
    { name: "Keshwapur PS", code: "0125" }
  ],
  "Gadag": [
    { name: "Gadag Town PS", code: "0480" },
    { name: "Gadag Rural PS", code: "0482" },
    { name: "Nargund PS", code: "0485" },
    { name: "Ronn PS", code: "0488" }
  ],
  "Hassan": [
    { name: "Hassan Town PS", code: "0330" },
    { name: "Extension PS", code: "0332" },
    { name: "Arsikere Town PS", code: "0335" },
    { name: "Channarayapatna PS", code: "0338" }
  ],
  "Haveri": [
    { name: "Haveri Town PS", code: "0490" },
    { name: "Ranebennur Town PS", code: "0492" },
    { name: "Shiggaon PS", code: "0495" },
    { name: "Byadgi PS", code: "0498" }
  ],
  "Kalaburagi": [
    { name: "Kalaburagi Town PS", code: "0701" },
    { name: "Brahampur PS", code: "0703" },
    { name: "Sedam PS", code: "0708" },
    { name: "Aland PS", code: "0711" }
  ],
  "Kodagu": [
    { name: "Madikeri Town PS", code: "0340" },
    { name: "Somwarpet PS", code: "0342" },
    { name: "Virajpet Town PS", code: "0345" },
    { name: "Gonikoppal PS", code: "0348" }
  ],
  "Kolar": [
    { name: "Kolar Town PS", code: "0170" },
    { name: "Robertsonpet PS (KGF)", code: "0172" },
    { name: "Bangarapet PS", code: "0175" },
    { name: "Mulbagal Town PS", code: "0178" }
  ],
  "Koppal": [
    { name: "Koppal Town PS", code: "0730" },
    { name: "Gangavathi Town PS", code: "0732" },
    { name: "Yelburga PS", code: "0735" },
    { name: "Kushtagi PS", code: "0738" }
  ],
  "Mandya": [
    { name: "Mandya Town PS", code: "0320" },
    { name: "Maddur PS", code: "0322" },
    { name: "Srirangapatna PS", code: "0325" },
    { name: "Pandavapura PS", code: "0328" }
  ],
  "Mysuru": [
    { name: "Mandi PS", code: "0095" },
    { name: "Narasimharaja PS", code: "0096" },
    { name: "Jayalaxmipuram PS", code: "0098" },
    { name: "Devaraja PS", code: "0101" }
  ],
  "Raichur": [
    { name: "Raichur Town PS", code: "0740" },
    { name: "Raichur West PS", code: "0742" },
    { name: "Sindhanur Town PS", code: "0745" },
    { name: "Manvi PS", code: "0748" }
  ],
  "Ramanagara": [
    { name: "Ramanagara Town PS", code: "0149" },
    { name: "Ijoor PS", code: "0150" },
    { name: "Channapatna Town PS", code: "0140" },
    { name: "Kanakapura Town PS", code: "0146" }
  ],
  "Shivamogga": [
    { name: "Doddapet PS", code: "0540" },
    { name: "Jayanagar PS", code: "0542" },
    { name: "Bhadravathi Town PS", code: "0545" },
    { name: "Sagara Town PS", code: "0548" }
  ],
  "Tumakuru": [
    { name: "Tumakuru Town PS", code: "0160" },
    { name: "Jayanagara PS", code: "0162" },
    { name: "Sira PS", code: "0165" },
    { name: "Tiptur Town PS", code: "0168" }
  ],
  "Udupi": [
    { name: "Udupi Town PS", code: "0370" },
    { name: "Manipal PS", code: "0372" },
    { name: "Kundapura PS", code: "0375" },
    { name: "Karkala Town PS", code: "0378" }
  ],
  "Uttara Kannada": [
    { name: "Karwar Town PS", code: "0460" },
    { name: "Sirsi Town PS", code: "0462" },
    { name: "Bhatkal Town PS", code: "0465" },
    { name: "Dandeli Town PS", code: "0468" }
  ],
  "Vijayanagara": [
    { name: "Hosapete Town PS", code: "0520" },
    { name: "Hampi PS", code: "0522" },
    { name: "Kudligi PS", code: "0525" },
    { name: "Harapanahalli PS", code: "0528" }
  ],
  "Vijayapura": [
    { name: "Vijayapura Town PS", code: "0670" },
    { name: "Gol Gumbaz PS", code: "0672" },
    { name: "Indi PS", code: "0675" },
    { name: "Muddebihal PS", code: "0678" }
  ],
  "Yadgir": [
    { name: "Yadgir Town PS", code: "0750" },
    { name: "Shahapur PS", code: "0752" },
    { name: "Shorapur PS", code: "0755" },
    { name: "Gurmatkal PS", code: "0758" }
  ]
};

export default function App() {
  const [activeTab, setActiveTab] = useState<"graph" | "investigation" | "trends" | "sociology" | "offender" | "financial" | "forecasting" | "governance">("graph");
  const [selectedNode, setSelectedNode] = useState<POLEEntity | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [role, setRole] = useState<string>("Investigator");
  const [selectedCaseId, setSelectedCaseId] = useState<string>("jayanagar");
  
  // Dynamically calculate docketInfo based on selectedCaseId from casesData
  const currentCase = casesData[selectedCaseId] || casesData.jayanagar;
  const docketInfo = {
    docketId: currentCase.docketId,
    status: currentCase.status,
    district: currentCase.district
  };

  // Authentication & Theme States
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState<string>("martisajay117@gmail.com");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [tempTheme, setTempTheme] = useState<"dark" | "light">("light");
  const [language, setLanguage] = useState<"English" | "Kannada">("English");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [gatewayStep, setGatewayStep] = useState<1 | 2>(1);

  // CCTNS FIR Search Access Gateway States
  const [searchDistrict, setSearchDistrict] = useState<string>("");
  const [searchStation, setSearchStation] = useState<string>("");
  const [searchYear, setSearchYear] = useState<string>("2026");
  const [searchFirNumber, setSearchFirNumber] = useState<string>("");
  const [captchaInput, setCaptchaInput] = useState<string>("");
  const [captchaCode, setCaptchaCode] = useState<string>(() => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  });

  const handleRefreshCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(result);
    setCaptchaInput("");
  };

  // Graph Algorithm States
  const [activeAlgo, setActiveAlgo] = useState<"core" | "between" | "community" | null>(null);
  const [kValue, setKValue] = useState<number>(2);
  const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set(["Person", "Object", "Location", "Event", "BankAccount"]));

  // Layout states for panel adjustments
  const [rightPanelWidth, setRightPanelWidth] = useState<"hidden" | "narrow" | "default" | "wide">("default");
  const [splitRatio, setSplitRatio] = useState<"default" | "chatOnly" | "inspectorOnly">("default");

  // Live Server States
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [summaryText, setSummaryText] = useState<string>("");
  const [loadingSummary, setLoadingSummary] = useState<boolean>(false);
  const [summaryOffline, setSummaryOffline] = useState<boolean>(false);
  const [similarCases, setSimilarCases] = useState<any[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState<boolean>(false);
  const [similarOffline, setSimilarOffline] = useState<boolean>(false);
  const [apiQuotaExceeded, setApiQuotaExceeded] = useState<boolean>(false);

  // Fetch live docket, audit logs and statistics on load
  const fetchLogs = async () => {
    try {
      const response = await fetch("/api/audit-logs");
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
      const data = await response.json();
      setAuditLogs(data.logs || []);
    } catch (e) {
      console.warn("Audit logs offline:", e);
    }
  };

  useEffect(() => {
    fetchLogs();
    
    // Automatically select prime suspect on load
    const manjunath = mockPOLEData.nodes.find(n => n.id === "P-001");
    if (manjunath) setSelectedNode(manjunath as POLEEntity);
  }, []);

  const handleSelectNode = (node: POLEEntity | null) => {
    setSelectedNode(node);
    setSummaryText("");
    setSimilarCases([]);
  };

  const handleToggleType = (type: string) => {
    const updated = new Set(activeTypes);
    if (updated.has(type)) {
      updated.delete(type);
    } else {
      updated.add(type);
    }
    setActiveTypes(updated);
  };

  // Trigger server-side Gemini case summarizer
  const handleSummarizeCase = async () => {
    if (!selectedNode) return;
    setLoadingSummary(true);
    setSummaryText("");
    setSummaryOffline(false);
    try {
      const response = await fetch("/api/summarize-case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entityId: selectedNode.id, role: role, language: language })
      });
      const data = await response.json();
      setSummaryText(data.summary);
      setSummaryOffline(!!data.offline);
      if (data.quotaExceeded) {
        setApiQuotaExceeded(true);
      }
      fetchLogs(); // refresh log list
    } catch (e) {
      setSummaryText("Failed to retrieve summary from the KSP neural compiler. fallback to local index records.");
      setSummaryOffline(true);
    } finally {
      setLoadingSummary(false);
    }
  };

  // Trigger server-side Gemini similar case finder
  const handleFindSimilarCases = async () => {
    if (!selectedNode) return;
    setLoadingSimilar(true);
    setSimilarCases([]);
    setSimilarOffline(false);
    try {
      const response = await fetch("/api/get-similar-cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entityId: selectedNode.id, role: role, language: language })
      });
      const data = await response.json();
      setSimilarCases(data.matches || []);
      setSimilarOffline(!!data.offline);
      if (data.quotaExceeded) {
        setApiQuotaExceeded(true);
      }
      fetchLogs(); // refresh log list
    } catch (e) {
      console.warn("Similarity search offline:", e);
      setSimilarOffline(true);
    } finally {
      setLoadingSimilar(false);
    }
  };

  // Count active matching nodes
  const filteredNodesCount = mockPOLEData.nodes.filter(n => {
    const matchesType = activeTypes.has(n.type);
    const matchesSearch = searchQuery.trim() === "" || 
      n.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
      n.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  }).length;

  if (!isLoggedIn) {
    // Dynamic police station list based on selected district
    let availableStations: string[] = [];
    if (searchDistrict) {
      const stations = karnatakaStationMap[searchDistrict] || [];
      availableStations = stations.map(s => `${s.name} (Unit-${s.code})`);
    }

    const handleSubmitSearch = (e: React.FormEvent) => {
      e.preventDefault();
      if (!searchDistrict) {
        setLoginError("Please select District / Division.");
        return;
      }
      if (!searchStation) {
        setLoginError("Please select Police Station.");
        return;
      }
      if (!searchYear) {
        setLoginError("Please select Year.");
        return;
      }
      if (!searchFirNumber.trim()) {
        setLoginError("Please enter FIR Number.");
        return;
      }
      if (captchaInput.trim().toUpperCase() !== captchaCode) {
        setLoginError(`Invalid Security Code (CAPTCHA). Please enter '${captchaCode}'.`);
        return;
      }

      // Success! Map to active case target
      setLoginError(null);
      if (searchStation.includes("Jayanagar") || searchStation.includes("Town PS")) {
        setSelectedCaseId("jayanagar");
      } else if (searchStation.includes("Whitefield") || searchStation.includes("Rural PS")) {
        setSelectedCaseId("whitefield");
      } else if (searchStation.includes("Seshadripuram") || searchStation.includes("Traffic PS")) {
        setSelectedCaseId("seshadripuram");
      } else {
        setSelectedCaseId("jayanagar");
      }
      setIsLoggedIn(true);
    };

    return (
      <div className="h-screen w-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans select-none overflow-y-auto relative">
        {/* Ambient background styling */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(241,245,249,0)_50%,rgba(15,23,42,0.02)_50%),linear-gradient(90deg,rgba(59,130,246,0.02),rgba(0,0,0,0),rgba(59,130,246,0.02))] bg-[length:100%_4px,3px_100%] pointer-events-none opacity-40"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none"></div>

        {/* Centered Form Card */}
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-8 shadow-xl relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex w-20 h-20 rounded-full bg-slate-50 border border-slate-200 items-center justify-center p-2.5 shadow-inner mb-1">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/a/aa/Seal_of_Karnataka.svg" 
                alt="Government of Karnataka Emblem" 
                className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(59,130,246,0.15)]"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-blue-600 tracking-[0.25em] uppercase block">
                CCTNS PORTAL GATEWAY
              </span>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mt-1">
                Karnataka State Police
              </h2>
              <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                Centralized FIR Search & Docket Access
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmitSearch} className="space-y-4">
            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded p-3 text-[11px] font-mono text-red-600 flex items-center gap-2">
                <AlertTriangle size={14} className="shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Vertical Stacking: Input fields in single-column */}
            <div className="space-y-4">
              
              {/* District Dropdown */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono font-semibold text-slate-600">
                  Select District <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <select
                    value={searchDistrict}
                    onChange={(e) => {
                      setSearchDistrict(e.target.value);
                      setSearchStation(""); // Reset station on district change
                    }}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded px-3 py-2 text-xs font-mono text-slate-800 outline-none transition-colors cursor-pointer appearance-none"
                  >
                    <option value="">Select District / Division</option>
                    {karnatakaDistricts.map(dist => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
                    <ChevronRight size={14} className="rotate-90 text-slate-500" />
                  </div>
                </div>
              </div>

              {/* Police Station Dropdown */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono font-semibold text-slate-600">
                  Select Police Station <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <select
                    value={searchStation}
                    onChange={(e) => setSearchStation(e.target.value)}
                    disabled={!searchDistrict}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded px-3 py-2 text-xs font-mono text-slate-800 outline-none transition-colors cursor-pointer appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {searchDistrict ? "Select Police Station" : "Select District first"}
                    </option>
                    {availableStations.map((station) => (
                      <option key={station} value={station}>
                        {station}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
                    <ChevronRight size={14} className="rotate-90 text-slate-500" />
                  </div>
                </div>
              </div>

              {/* Select Year Dropdown */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono font-semibold text-slate-600">
                  Select Year <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <select
                    value={searchYear}
                    onChange={(e) => setSearchYear(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded px-3 py-2 text-xs font-mono text-slate-800 outline-none transition-colors cursor-pointer appearance-none"
                  >
                    {Array.from({ length: 2026 - 2010 + 1 }, (_, i) => 2026 - i).map(year => (
                      <option key={year} value={year.toString()}>{year}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
                    <ChevronRight size={14} className="rotate-90 text-slate-500" />
                  </div>
                </div>
              </div>

              {/* FIR Number Text Input */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono font-semibold text-slate-600">
                  FIR Number <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  placeholder="ex : 0124"
                  value={searchFirNumber}
                  onChange={(e) => setSearchFirNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded px-3 py-2 text-xs font-mono text-slate-800 outline-none transition-colors"
                />
              </div>

              {/* Security CAPTCHA section */}
              <div className="space-y-3 pt-2">
                <label className="block text-[11px] font-mono font-semibold text-slate-600 flex justify-between items-center">
                  <span>Security Check <span className="text-red-500 font-bold">*</span></span>
                  <span 
                    onClick={handleRefreshCaptcha}
                    className="text-[10px] font-mono text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer select-none normal-case"
                    title="Generate new CAPTCHA code"
                  >
                    <RefreshCw size={10} /> Refresh Code
                  </span>
                </label>
                
                {/* Image-based Security Challenge Box */}
                <div 
                  onClick={handleRefreshCaptcha}
                  className="bg-slate-100 border border-slate-200 rounded-lg py-3 flex items-center justify-center relative overflow-hidden shadow-inner cursor-pointer group"
                  title="Click to refresh CAPTCHA"
                >
                  {/* Styled security noise lines overlay */}
                  <div className="absolute inset-0 pointer-events-none opacity-20">
                    <div className="w-full h-full bg-[repeating-linear-gradient(45deg,#ccc,#ccc_10px,#fff_10px,#fff_20px)] opacity-15"></div>
                    <div className="absolute top-2 left-0 right-0 h-0.5 bg-red-400 rotate-6"></div>
                    <div className="absolute top-6 left-0 right-0 h-0.5 bg-blue-400 -rotate-3"></div>
                    <div className="absolute top-4 left-0 right-0 h-0.5 bg-green-400 rotate-12"></div>
                  </div>
                  <span className="text-lg font-mono font-extrabold tracking-[0.4em] text-slate-700 select-none px-4 py-1 border-2 border-dashed border-slate-300 rounded bg-white skew-x-12 transition-transform group-hover:scale-105">
                    {captchaCode}
                  </span>
                </div>

                {/* Enter Captcha verification field */}
                <input
                  type="text"
                  placeholder="Enter Captcha"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded px-3 py-2 text-xs font-mono text-slate-800 outline-none transition-colors uppercase placeholder:normal-case"
                />
              </div>

            </div>

            {/* CTA Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-mono font-bold text-xs uppercase tracking-wider py-2.5 rounded transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer mt-6"
            >
              <Search size={14} /> Submit
            </button>
          </form>

          <div className="text-center font-mono text-[9px] text-slate-400 pt-2">
            Authorized Public & Official CCTNS Access · IP Logged · Karnataka IT Act
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen font-sans flex flex-col antialiased overflow-hidden ${theme === 'light' ? 'light-theme bg-[#F8FAFC] text-[#0F172A]' : 'bg-[#111111] text-[#E0E0E0]'}`}>
      
      {/* Top Banner Header */}
      <header className="bg-[#111111] border-b-2 border-[#333333] px-8 py-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-[51px] h-[42px] rounded bg-white border border-slate-200 flex items-center justify-center p-0.5 shadow-inner shrink-0">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/a/aa/Seal_of_Karnataka.svg" 
              alt="Government of Karnataka Emblem" 
              className="object-contain"
              style={{ height: '42px', width: '51px' }}
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#E53935] tracking-[0.15em] uppercase">
                {language === "English" ? "KSP Intelligence Terminal" : "ಕೆಎಸ್‌ಪಿ ಇಂಟೆಲಿಜೆನ್ಸ್ ಟರ್ಮಿನಲ್"}
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#E53935]/15 text-[#E53935] border border-[#E53935]/30">
                {language === "English" ? "SECURE SHELL" : "ಸುರಕ್ಷಿತ ಸಂಪರ್ಕ"}
              </span>
            </div>
            <h1 className="text-sm font-bold tracking-wider uppercase text-[#E0E0E0] font-sans mt-0.5">
              {language === "English" 
                ? "Karnataka State Police · Centralized Docket System" 
                : "ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ · ಕೇಂದ್ರೀಕೃತ ಡಾಕೆಟ್ ವ್ಯವಸ್ಥೆ"}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap lg:flex-nowrap items-center justify-between lg:justify-end gap-4 text-xs font-mono w-full lg:w-auto">
          {/* Theme Quick Selector */}
          <div className="flex items-center gap-2 bg-[#1A1A1A] border border-[#333333] rounded px-2.5 py-0.5">
            <span className="text-[9px] text-[#888888] font-mono uppercase tracking-wider">
              {language === "English" ? "Theme:" : "ಥೀಮ್:"}
            </span>
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="px-2 py-0.5 text-[9px] font-mono rounded-sm transition-all cursor-pointer text-[#888888] hover:text-[#E53935] flex items-center gap-1.5 font-bold uppercase"
              title={language === "English" ? "Toggle Light/Dark Theme" : "ಬೆಳಕು/ಕತ್ತಲು ಥೀಮ್ ಬದಲಾಯಿಸಿ"}
            >
              {theme === "dark" ? <Moon size={11} className="text-[#9884AC]" /> : <Sun size={11} className="text-[#D69A4E]" />}
              <span>{theme === "dark" ? (language === "English" ? "dark" : "ಕತ್ತಲು") : (language === "English" ? "light" : "ಬೆಳಕು")}</span>
            </button>
          </div>

          <div className="h-8 w-px bg-[#333333]"></div>

          {/* Language Selector */}
          <div className="flex items-center gap-2 bg-[#1A1A1A] border border-[#333333] rounded px-2.5 py-0.5">
            <span className="text-[9px] text-[#888888] font-mono uppercase tracking-wider">
              {language === "English" ? "Language:" : "ಭಾಷೆ:"}
            </span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-[#1A1A1A] border-none text-[9px] font-mono text-[#E0E0E0] outline-none cursor-pointer pl-1 uppercase font-bold"
            >
              <option value="English">English</option>
              <option value="Kannada">ಕನ್ನಡ (KN)</option>
            </select>
          </div>

          <div className="h-8 w-px bg-[#333333]"></div>

          {/* Workspace Layout Settings */}
          <div className="flex items-center gap-2 bg-[#1A1A1A] border border-[#333333] rounded px-2 py-0.5">
            <span className="text-[9px] text-[#888888] font-mono uppercase tracking-wider pl-1">
              {language === "English" ? "Sidebar:" : "ಸೈಡ್‌ಬಾರ್:"}
            </span>
            <div className="flex bg-[#111111] rounded border border-[#333333] overflow-hidden p-0.5">
              <button 
                onClick={() => setRightPanelWidth("hidden")}
                title={language === "English" ? "Hide Sidebar (Full Canvas)" : "ಸೈಡ್‌ಬಾರ್ ಮರೆಮಾಡು"}
                className={`px-2 py-0.5 text-[9px] font-mono rounded-sm transition-all cursor-pointer ${rightPanelWidth === "hidden" ? "bg-[#E53935] text-white font-bold" : "text-[#888888] hover:text-[#E0E0E0]"}`}
              >
                {language === "English" ? "Hide" : "ಮರೆಮಾಡು"}
              </button>
              <button 
                onClick={() => setRightPanelWidth("narrow")}
                title={language === "English" ? "Narrow Sidebar" : "ಕಿರಿದಾದ ಸೈಡ್‌ಬಾರ್"}
                className={`px-2 py-0.5 text-[9px] font-mono rounded-sm transition-all cursor-pointer ${rightPanelWidth === "narrow" ? "bg-[#E53935] text-white font-bold" : "text-[#888888] hover:text-[#E0E0E0]"}`}
              >
                {language === "English" ? "Narrow" : "ಕಿರಿದಾದ"}
              </button>
              <button 
                onClick={() => setRightPanelWidth("default")}
                title={language === "English" ? "Default Sidebar" : "ಸಾಮಾನ್ಯ ಸೈಡ್‌ಬಾರ್"}
                className={`px-2 py-0.5 text-[9px] font-mono rounded-sm transition-all cursor-pointer ${rightPanelWidth === "default" ? "bg-[#E53935] text-white font-bold" : "text-[#888888] hover:text-[#E0E0E0]"}`}
              >
                {language === "English" ? "Std" : "ಸಾಮಾನ್ಯ"}
              </button>
              <button 
                onClick={() => setRightPanelWidth("wide")}
                title={language === "English" ? "Wide Sidebar" : "ಅಗಲವಾದ ಸೈಡ್‌ಬಾರ್"}
                className={`px-2 py-0.5 text-[9px] font-mono rounded-sm transition-all cursor-pointer ${rightPanelWidth === "wide" ? "bg-[#E53935] text-white font-bold" : "text-[#888888] hover:text-[#E0E0E0]"}`}
              >
                {language === "English" ? "Wide" : "ಅಗಲ"}
              </button>
            </div>
          </div>

          <div className="h-8 w-px bg-[#333333]"></div>

          <div className="text-right">
            <span className="text-[#888888] text-[9px] tracking-widest block uppercase">
              {language === "English" ? "Active Case Docket" : "ಸಕ್ರಿಯ ಪ್ರಕರಣ ದಾಖಲೆ"}
            </span>
            <span className="text-[#E0E0E0] font-bold">{docketInfo.docketId} · {language === "English" ? "South Div" : "ದಕ್ಷಿಣ ವಿಭಾಗ"}</span>
          </div>
          
          <div className="h-8 w-px bg-[#333333]"></div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="text-[#888888] text-[9px] tracking-widest block uppercase">
                {language === "English" ? "Operator" : "ನಿರ್ವಾಹಕರು"}
              </span>
              <span className="text-[#E0E0E0] font-medium">martisajay117@gmail.com</span>
            </div>
            
            {/* Quick role switcher dropdown */}
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                fetchLogs();
              }}
              className="bg-[#1A1A1A] border border-[#333333] text-xs font-mono text-[#E53935] rounded px-2.5 py-1 outline-none focus:border-[#E53935] cursor-pointer"
            >
              <option value="Supervisor">{language === "English" ? "Supervisor (Full PII)" : "ಮೇಲ್ವಿಚಾರಕರು (ಪೂರ್ಣ PII)"}</option>
              <option value="Investigator">{language === "English" ? "Investigator (Standard)" : "ತನಿಖಾಧಿಕಾರಿ (ಸಾಮಾನ್ಯ)"}</option>
              <option value="Analyst">{language === "English" ? "Analyst (Masked PII)" : "ವಿಶ್ಲೇಷಕರು (ಮರೆಮಾಡಿದ PII)"}</option>
              <option value="Policymaker">{language === "English" ? "Policymaker (Macro-only)" : "ನೀತಿ ನಿರೂಪಕರು (ಮ್ಯಾಕ್ರೋ ಮಾತ್ರ)"}</option>
            </select>
          </div>
        </div>
      </header>

      {apiQuotaExceeded && (
        <div className="bg-[#D69A4E]/10 border-b border-[#D69A4E]/30 px-8 py-2.5 flex items-center justify-between text-xs font-mono text-[#D69A4E]">
          <div className="flex items-center gap-2.5">
            <AlertTriangle size={15} className="shrink-0 animate-pulse text-[#D69A4E]" />
            <span className="leading-normal">
              <strong>[SYSTEM NOTIFICATION - CHATBOT API RATE-LIMIT OVERFLOW]</strong>: The Gemini API free quota limit has been exceeded. The KSP Intelligence Terminal has automatically switched to <strong>Offline Autonomous Diagnostics Mode</strong>. Core functionality is fully preserved.
            </span>
          </div>
          <button 
            onClick={() => setApiQuotaExceeded(false)}
            className="text-[#D69A4E] hover:text-white font-bold px-2 py-0.5 rounded hover:bg-[#D69A4E]/20 transition-all cursor-pointer uppercase text-[10px]"
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* Main Grid Layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden min-h-0">
        
        {/* Left/Middle Column (Tab content workspace) */}
        <section className={`${rightPanelWidth === "hidden" ? "lg:col-span-12" : rightPanelWidth === "narrow" ? "lg:col-span-9" : rightPanelWidth === "wide" ? "lg:col-span-7" : "lg:col-span-8"} flex flex-col p-4 space-y-4 h-full min-h-0 overflow-y-auto border-r border-[#333333] bg-[#111111] min-w-0`}>
          
          {/* Tab buttons */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 border-b border-[#333333] no-scrollbar select-none">
            {[
              { id: "graph", label: language === "English" ? "POLE Link Network" : "ಲಿಂಕ್ ನೆಟ್‌ವರ್ಕ್ (POLE)", icon: <Network size={14} /> },
              { id: "investigation", label: language === "English" ? "Case Investigation" : "ಪ್ರಕರಣ ತನಿಖೆ", icon: <Compass size={14} /> },
              { id: "trends", label: language === "English" ? "Pattern & Hotspots" : "ಅಪರಾಧ ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳು", icon: <TrendingUp size={14} /> },
              { id: "sociology", label: language === "English" ? "Demographic Insights" : "ಜನಸಂಖ್ಯಾ ಒಳನೋಟಗಳು", icon: <Users size={14} /> },
              { id: "offender", label: language === "English" ? "Offender Profiling" : "ಅಪರಾಧಿಗಳ ವಿವರ", icon: <Clock size={14} /> },
              { id: "financial", label: language === "English" ? "Money Trail Ledger" : "ಹಣಕಾಸು ಜಾಡು", icon: <Coins size={14} /> },
              { id: "forecasting", label: language === "English" ? "Forecasting Alerts" : "ಮುನ್ಸೂಚನೆ ಎಚ್ಚರಿಕೆಗಳು", icon: <Zap size={14} /> },
              { id: "governance", label: language === "English" ? "Governance & Compliance Logs" : "ಆಡಳಿತ ಮತ್ತು ಅನುಸರಣೆ", icon: <Shield size={14} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  fetchLogs();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono border transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? "bg-[#1A1A1A] text-[#E53935] border-[#E53935]/40 font-bold" 
                    : "bg-transparent text-[#888888] border-transparent hover:text-[#E0E0E0] hover:border-[#333333]"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active Tab Screen */}
          <div className={`flex-1 min-h-0 ${activeTab === 'graph' ? 'flex flex-col overflow-hidden' : 'overflow-y-auto pr-1'}`}>
            {activeTab === "graph" && (
              <div className="flex flex-col h-full gap-4 overflow-hidden min-h-0">
                {/* Search & node filters control bar */}
                <div className="flex flex-wrap gap-3 items-center justify-between bg-[#1A1A1A] border border-[#333333] rounded px-4 py-3">
                  <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                    <Search size={14} className="text-[#888888]" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search entities by name, ID, plates, accounts..."
                      className="bg-transparent text-xs font-mono text-[#E0E0E0] outline-none flex-1 placeholder-[#555555]"
                    />
                  </div>

                  {/* Filter node types via chips */}
                  <div className="flex gap-2 items-center flex-wrap select-none text-[10px] font-mono text-[#888888]">
                    <span>Node Types:</span>
                    {[
                      { type: "Person", color: "border-[#E53935]/40 text-[#E53935] bg-[#E53935]/5" },
                      { type: "Object", color: "border-[#6E93B8]/40 text-[#6E93B8] bg-[#6E93B8]/5" },
                      { type: "Location", color: "border-[#7F9E6E]/40 text-[#7F9E6E] bg-[#7F9E6E]/5" },
                      { type: "Event", color: "border-[#D69A4E]/40 text-[#D69A4E] bg-[#D69A4E]/5" },
                      { type: "BankAccount", color: "border-[#9884AC]/40 text-[#9884AC] bg-[#9884AC]/5" }
                    ].map((btn) => (
                      <button
                        key={btn.type}
                        onClick={() => handleToggleType(btn.type)}
                        className={`px-2 py-0.5 rounded border ${btn.color} transition-opacity cursor-pointer ${
                          activeTypes.has(btn.type) ? "opacity-100 font-semibold" : "opacity-30"
                        }`}
                      >
                        {btn.type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main link visualizer space (Full width D3 Graph Canvas) */}
                <div className="flex-1 w-full h-full min-h-[450px] overflow-hidden">
                  <NetworkGraph 
                    nodes={mockPOLEData.nodes as POLEEntity[]}
                    links={mockPOLEData.links as POLELink[]}
                    selectedId={selectedNode ? selectedNode.id : null}
                    onSelectNode={handleSelectNode}
                    activeAlgo={activeAlgo}
                    kValue={kValue}
                    activeTypes={activeTypes}
                    searchQuery={searchQuery}
                    role={role}
                  />
                </div>

                {/* Horizontal Graph Solvers Bar (placed below the graph canvas) */}
                <div className="bg-[#1A1A1A] border border-[#333333] rounded px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 font-mono">
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono font-bold text-[#888888] uppercase tracking-wider">Graph Solvers</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
                    <button 
                      onClick={() => setActiveAlgo(activeAlgo === "core" ? null : "core")}
                      className={`px-3 py-1.5 rounded border text-xs leading-tight transition-all cursor-pointer flex items-center gap-2 ${
                        activeAlgo === "core" ? "bg-[#E53935]/15 border-[#E53935] text-[#E0E0E0]" : "bg-[#111111] border-[#333333] text-[#888888] hover:border-[#E53935]"
                      }`}
                    >
                      <div className="text-left">
                        <span className="font-bold block text-[#E0E0E0] text-[11px]">k-Core Decomposition</span>
                        <span className="text-[9px] text-[#888888] block">Strip peripheral nodes</span>
                      </div>
                    </button>

                    {activeAlgo === "core" && (
                      <div className="flex items-center gap-2 px-2.5 py-1.5 bg-[#111111] rounded border border-[#333333] shrink-0">
                        <span className="text-[10px] text-[#888888]">k = <strong className="text-[#E53935]">{kValue}</strong></span>
                        <input 
                          type="range" 
                          min="1" 
                          max="4" 
                          value={kValue} 
                          onChange={(e) => setKValue(Number(e.target.value))}
                          className="w-16 accent-[#E53935] cursor-pointer"
                        />
                      </div>
                    )}

                    <button 
                      onClick={() => setActiveAlgo(activeAlgo === "between" ? null : "between")}
                      className={`px-3 py-1.5 rounded border text-xs leading-tight transition-all cursor-pointer text-left ${
                        activeAlgo === "between" ? "bg-[#D69A4E]/15 border-[#D69A4E] text-[#E0E0E0]" : "bg-[#111111] border-[#333333] text-[#888888] hover:border-[#D69A4E]"
                      }`}
                    >
                      <span className="font-bold block text-[#E0E0E0] text-[11px]">Betweenness Centrality</span>
                      <span className="text-[9px] text-[#888888] block">Bridging middlemen</span>
                    </button>

                    <button 
                      onClick={() => setActiveAlgo(activeAlgo === "community" ? null : "community")}
                      className={`px-3 py-1.5 rounded border text-xs leading-tight transition-all cursor-pointer text-left ${
                        activeAlgo === "community" ? "bg-[#9884AC]/15 border-[#9884AC] text-[#E0E0E0]" : "bg-[#111111] border-[#333333] text-[#888888] hover:border-[#9884AC]"
                      }`}
                    >
                      <span className="font-bold block text-[#E0E0E0] text-[11px]">Louvain Communities</span>
                      <span className="text-[9px] text-[#888888] block">Modularity clusters</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 pl-3 border-l border-[#333333] shrink-0">
                    <span className="text-[9px] text-[#888888] uppercase">Matched POLE:</span>
                    <span className="text-sm font-mono font-bold text-[#E53935]">{filteredNodesCount} / {mockPOLEData.nodes.length}</span>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "investigation" && (
              <CaseInvestigation 
                selectedCaseId={selectedCaseId}
                onChangeCaseId={(caseId) => setSelectedCaseId(caseId)}
                onFocusNode={(nodeId) => {
                  const n = mockPOLEData.nodes.find(node => node.id === nodeId);
                  if (n) {
                    setSelectedNode(n as any);
                    setActiveTab("graph");
                  }
                }} 
              />
            )}
            
            {activeTab === "trends" && <TrendsAnalytics />}
            {activeTab === "sociology" && <SociologicalInsights />}
            {activeTab === "offender" && <OffenderProfiling onSelectNode={handleSelectNode} role={role} />}
            {activeTab === "financial" && <FinancialCrime />}
            {activeTab === "forecasting" && <ForecastingAlerts />}
            {activeTab === "governance" && (
              <AccessGovernance 
                role={role} 
                setRole={setRole} 
                auditLogs={auditLogs}
                onRefreshLogs={fetchLogs}
              />
            )}
          </div>

        </section>

        {/* Right Column (Inspection and Chatbot Dialogue) */}
        <section className={`${rightPanelWidth === "hidden" ? "hidden" : rightPanelWidth === "narrow" ? "lg:col-span-3" : rightPanelWidth === "wide" ? "lg:col-span-5" : "lg:col-span-4"} p-4 flex flex-col gap-4 h-full overflow-hidden bg-[#0d0d0d] border-l border-[#333333] min-w-0`}>
          
          {/* Quick restore bar if Case Inspector is hidden */}
          {splitRatio === "chatOnly" && (
            <div className="bg-[#1A1A1A] border border-[#333333] rounded px-3 py-1.5 flex justify-between items-center text-[10px] font-mono text-[#888888] shrink-0">
              <span>{language === "English" ? "Case Inspector is collapsed." : "ಪ್ರಕರಣ ಇನ್ಸ್‌ಪೆಕ್ಟರ್ ಕಿರಿದಾಗಿದೆ."}</span>
              <button
                onClick={() => setSplitRatio("default")}
                className="text-[#E53935] hover:underline font-bold cursor-pointer"
              >
                {language === "English" ? "Restore Inspector" : "ಇನ್ಸ್‌ಪೆಕ್ಟರ್ ಮರುಸ್ಥಾಪಿಸಿ"}
              </button>
            </div>
          )}

          {/* Active Node Inspector */}
          <div className={`bg-[#1A1A1A] border border-[#333333] rounded p-4 flex flex-col gap-3 shrink-0 overflow-y-auto ${
            splitRatio === "chatOnly" ? "hidden" :
            splitRatio === "inspectorOnly" ? "flex-1 h-full max-h-none" :
            "max-h-[45%]"
          }`}>
            <div className="flex justify-between items-center border-b border-[#333333] pb-1.5">
              <span className="text-[10px] font-mono font-bold text-[#888888] uppercase tracking-widest block">
                {language === "English" ? "CCTNS Case Inspector" : "ಸಿಸಿಟಿಎನ್ಎಸ್ ಪ್ರಕರಣ ಇನ್ಸ್‌ಪೆಕ್ಟರ್"}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSplitRatio(splitRatio === "inspectorOnly" ? "default" : "inspectorOnly")}
                  title={splitRatio === "inspectorOnly" ? "Reset to Split View" : "Maximize Inspector"}
                  className="p-1 rounded hover:bg-[#333333] text-[#888888] hover:text-[#E0E0E0] transition-colors cursor-pointer"
                >
                  <Maximize2 size={11} />
                </button>
                <button
                  onClick={() => setSplitRatio(splitRatio === "chatOnly" ? "default" : "chatOnly")}
                  title="Hide Inspector (Chat Full Height)"
                  className="p-1 rounded hover:bg-[#333333] text-[#888888] hover:text-[#E53935] transition-colors cursor-pointer"
                >
                  <Minimize2 size={11} />
                </button>
              </div>
            </div>

            {selectedNode ? (
              <div className="space-y-3 font-mono text-xs">
                {/* Node Identity */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] px-1.5 py-0.5 rounded uppercase font-bold bg-[#111111]" style={{ color: (TYPE_COLOR as any)[selectedNode.type] }}>
                      {selectedNode.type}
                    </span>
                    <span className="text-[10px] text-[#888888]">{selectedNode.id}</span>
                  </div>
                  
                  <span className="text-sm font-bold text-[#E0E0E0] block">
                    {role === "Analyst" && selectedNode.type === "Person" && selectedNode.id !== "P-001" 
                      ? `Suspect ${selectedNode.id}` 
                      : selectedNode.label
                    }
                  </span>
                </div>

                {/* Attribute Fields */}
                <div className="space-y-1.5 pt-2 border-t border-[#333333]">
                  {Object.entries(selectedNode.attrs).map(([key, val]) => {
                    // Mask PII based on active permissions
                    const isSensitive = ["dob", "imei_or_plate", "account_num", "background"].includes(key);
                    const shouldMask = role === "Analyst" && isSensitive;
                    const displayVal = shouldMask ? " [REDACTED PER DPDP ACT] " : String(val);

                    return (
                      <div key={key} className="flex justify-between gap-4 text-[10px] text-[#888888]">
                        <span className="text-[#888888] capitalize">{key.replace(/_/g, " ")}:</span>
                        <span className="text-right text-[#E0E0E0] truncate max-w-[65%]" title={displayVal}>
                          {displayVal}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Interactive RAG Action triggers */}
                <div className="flex gap-2 pt-3 border-t border-[#333333]">
                  <button
                    onClick={handleSummarizeCase}
                    disabled={loadingSummary}
                    className="flex-1 bg-[#E53935] hover:bg-[#c62828] text-[#ffffff] rounded px-2.5 py-1.5 text-[10px] font-bold tracking-wider uppercase transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    {loadingSummary 
                      ? (language === "English" ? "Compiling..." : "ಸಂಕಲಿಸಲಾಗುತ್ತಿದೆ...") 
                      : (language === "English" ? "Generate Brief" : "ವರದಿ ರಚಿಸಿ")}
                  </button>

                  <button
                    onClick={handleFindSimilarCases}
                    disabled={loadingSimilar}
                    className="flex-1 bg-transparent hover:bg-[#111111] text-[#E0E0E0] rounded px-2.5 py-1.5 text-[10px] border border-[#333333] hover:border-[#E53935] font-bold tracking-wider uppercase transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    {loadingSimilar 
                      ? (language === "English" ? "Matching..." : "ಹೋಲಿಸಲಾಗುತ್ತಿದೆ...") 
                      : (language === "English" ? "Compare Past" : "ಹಿಂದಿನ ಹೋಲಿಕೆ")}
                  </button>
                </div>

                {/* AI Briefing outputs rendering space */}
                {summaryText && (
                  <div className="bg-[#111111] p-3 border border-[#333333] rounded mt-3 max-h-[160px] overflow-y-auto text-[10px] leading-relaxed text-[#b8bfca]">
                    <div className="flex items-center justify-between text-[#E53935] font-bold mb-1">
                      <div className="flex items-center gap-1">
                        <Sparkles size={11} />
                        <span>
                          {summaryOffline 
                            ? (language === "English" ? "Autonomous Compiled Brief" : "ಸ್ವಾಯತ್ತ ಸಂಕಲಿತ ವರದಿ") 
                            : (language === "English" ? "Gemini Compiled Brief" : "ಜೆಮಿನಿ ಸಂಕಲಿತ ವರದಿ")}
                        </span>
                      </div>
                      {summaryOffline && (
                        <span className="text-[8px] font-mono px-1 py-0.2 bg-[#D69A4E]/15 text-[#D69A4E] border border-[#D69A4E]/30 rounded">
                          {language === "English" ? "OFFLINE" : "ಆಫ್‌ಲೈನ್"}
                        </span>
                      )}
                    </div>
                    <div className="whitespace-pre-line">{summaryText}</div>
                  </div>
                )}

                {/* Similar matches lists rendering space */}
                {similarCases.length > 0 && (
                  <div className="space-y-2 mt-3 pt-3 border-t border-[#333333]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#D69A4E] block uppercase">
                        {language === "English" ? "Archive Matches" : "ಆರ್ಕೈವ್ ಹೋಲಿಕೆಗಳು"}
                      </span>
                      {similarOffline && (
                        <span className="text-[8px] font-mono px-1 py-0.2 bg-[#D69A4E]/15 text-[#D69A4E] border border-[#D69A4E]/30 rounded">
                          {language === "English" ? "OFFLINE" : "ಆಫ್‌ಲೈನ್"}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2 max-h-[160px] overflow-y-auto">
                      {similarCases.map((sc, i) => (
                        <div key={i} className="bg-[#111111] border border-[#333333] rounded p-2 text-[10px]">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[#E0E0E0] font-semibold">{sc.title}</span>
                            <span className="text-[#E53935] font-bold">{sc.moSimilarity}% Match</span>
                          </div>
                          <div className="text-[9px] text-[#888888] mb-1"><b>MO</b>: {sc.matchedMOText}</div>
                          <div className="text-[8px] text-[#888888] bg-[#1a1a1a] p-1 rounded"><b>Recommendation</b>: {sc.leadsRecommended}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <span className="text-[10px] text-[#888888] italic">
                {language === "English" 
                  ? "No active target selected. Click any node in the canvas to inspect its POLE attributes and compile briefings."
                  : "ಯಾವುದೇ ಸಕ್ರಿಯ ಗುರಿಯನ್ನು ಆಯ್ಕೆ ಮಾಡಲಾಗಿಲ್ಲ. ಗುಣಲಕ್ಷಣಗಳನ್ನು ಪರಿಶೀಲಿಸಲು ಮತ್ತು ಬ್ರೀಫಿಂಗ್‌ಗಳನ್ನು ಕಂಪೈಲ್ ಮಾಡಲು ಕ್ಯಾನ್ವಾಸ್‌ನಲ್ಲಿರುವ ಯಾವುದೇ ನೋಡ್ ಅನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ."}
              </span>
            )}
          </div>

          {/* Intelligent Chatbot Panel */}
          <div className={`flex-1 min-h-0 flex flex-col overflow-hidden ${
            splitRatio === "inspectorOnly" ? "hidden" : ""
          }`}>
            <ChatbotInterface 
              selectedNode={selectedNode} 
              role={role} 
              selectedCaseId={selectedCaseId} 
              language={language}
              setLanguage={setLanguage}
            />
          </div>

          {/* Quick restore bar if Conversational Intelbot is hidden */}
          {splitRatio === "inspectorOnly" && (
            <div className="bg-[#1A1A1A] border border-[#333333] rounded px-3 py-1.5 flex justify-between items-center text-[10px] font-mono text-[#888888] shrink-0">
              <span>{language === "English" ? "Intelbot is collapsed." : "ಇಂಟೆಲ್‌ಬಾಟ್ ಕಿರಿದಾಗಿದೆ."}</span>
              <button
                onClick={() => setSplitRatio("default")}
                className="text-[#E53935] hover:underline font-bold cursor-pointer"
              >
                {language === "English" ? "Restore Intelbot" : "ಇಂಟೆಲ್‌ಬಾಟ್ ಮರುಸ್ಥಾಪಿಸಿ"}
              </button>
            </div>
          )}

        </section>

      </main>
    </div>
  );
}
