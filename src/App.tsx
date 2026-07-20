import { useState, useEffect } from "react";
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
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [tempTheme, setTempTheme] = useState<"dark" | "light">("dark");
  const [loginError, setLoginError] = useState<string | null>(null);

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
      const data = await response.json();
      setAuditLogs(data.logs || []);
    } catch (e) {
      console.error(e);
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
        body: JSON.stringify({ entityId: selectedNode.id, role: role })
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
        body: JSON.stringify({ entityId: selectedNode.id, role: role })
      });
      const data = await response.json();
      setSimilarCases(data.matches || []);
      setSimilarOffline(!!data.offline);
      if (data.quotaExceeded) {
        setApiQuotaExceeded(true);
      }
      fetchLogs(); // refresh log list
    } catch (e) {
      console.error(e);
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
    return (
      <div className="h-screen w-screen bg-[#0D0D0D] flex items-center justify-center p-4 font-sans select-none overflow-hidden relative">
        {/* Animated matrix scanline overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none opacity-40"></div>
        
        {/* Background ambient red circle glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#E53935]/5 blur-[120px] pointer-events-none"></div>

        {/* Access Gateway Card */}
        <div className="w-full max-w-md bg-[#161616] border-2 border-[#E53935]/40 rounded-lg p-8 shadow-2xl relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex w-12 h-12 rounded bg-[#111111] border-2 border-[#E53935] items-center justify-center font-bold text-xl text-[#E53935] font-mono shadow-inner">
              KSP
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-[#E53935] tracking-[0.2em] uppercase block">
                MHA Secure Access Portal
              </span>
              <h2 className="text-base font-bold text-[#E0E0E0] uppercase tracking-wider mt-1">
                Karnataka State Police Terminal
              </h2>
              <p className="text-[10px] font-mono text-[#888888]">
                Centralized POLE Docket & Auditing Environment
              </p>
            </div>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (!loginEmail.trim() || !loginPassword.trim()) {
                setLoginError("Registered Email and Security Password are required.");
                return;
              }
              // Simulate credential verification
              setLoginError(null);
              setTheme(tempTheme);
              setIsLoggedIn(true);
            }}
            className="space-y-4"
          >
            {loginError && (
              <div className="bg-[#E53935]/10 border border-[#E53935]/30 rounded p-3 text-[11px] font-mono text-[#E53935] flex items-center gap-2">
                <AlertTriangle size={14} className="shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Stage 1: Credentials */}
            <div className="space-y-3.5">
              <span className="text-[10px] font-mono font-bold text-[#888888] uppercase tracking-wider block border-b border-[#333333] pb-1">
                01. SECURE ACCESS CREDENTIALS
              </span>
              
              <div className="space-y-2.5">
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#888888]" />
                  <input
                    type="email"
                    placeholder="Registered Operator Email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-[#111111] border border-[#333333] focus:border-[#E53935] rounded pl-10 pr-3 py-2 text-xs font-mono text-[#E0E0E0] outline-none transition-colors"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#888888]" />
                  <input
                    type="password"
                    placeholder="Terminal Security Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-[#111111] border border-[#333333] focus:border-[#E53935] rounded pl-10 pr-3 py-2 text-xs font-mono text-[#E0E0E0] outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Stage 2: Theme selection */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-mono font-bold text-[#888888] uppercase tracking-wider block border-b border-[#333333] pb-1">
                02. TERMINAL VISUAL ENVIRONMENT
              </span>
              
              <div className="grid grid-cols-2 gap-3">
                {/* Dark option */}
                <button
                  type="button"
                  onClick={() => setTempTheme("dark")}
                  className={`p-3 rounded border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    tempTheme === "dark" 
                      ? "bg-[#E53935]/10 border-[#E53935] text-white" 
                      : "bg-[#111111] border-[#333333] text-[#888888] hover:border-[#555555]"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <Moon size={15} className={tempTheme === "dark" ? "text-[#E53935]" : "text-[#888888]"} />
                    <span className={`w-2 h-2 rounded-full ${tempTheme === "dark" ? "bg-[#E53935]" : "bg-transparent"}`}></span>
                  </div>
                  <div className="mt-3">
                    <span className="text-xs font-bold block">Dark Terminal</span>
                    <span className="text-[9px] text-[#888888] mt-0.5 block font-mono">Recommended night theme</span>
                  </div>
                </button>

                {/* Light option */}
                <button
                  type="button"
                  onClick={() => setTempTheme("light")}
                  className={`p-3 rounded border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    tempTheme === "light" 
                      ? "bg-[#D69A4E]/10 border-[#D69A4E] text-white" 
                      : "bg-[#111111] border-[#333333] text-[#888888] hover:border-[#555555]"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <Sun size={15} className={tempTheme === "light" ? "text-[#D69A4E]" : "text-[#888888]"} />
                    <span className={`w-2 h-2 rounded-full ${tempTheme === "light" ? "bg-[#D69A4E]" : "bg-transparent"}`}></span>
                  </div>
                  <div className="mt-3">
                    <span className="text-xs font-bold block">Light Tactical</span>
                    <span className="text-[9px] text-[#888888] mt-0.5 block font-mono">High contrast sunlight view</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Stage 3: Case selection */}
            <div className="space-y-3 pt-4">
              <span className="text-[10px] font-mono font-bold text-[#888888] uppercase tracking-wider block border-b border-[#333333] pb-1">
                03. ACTIVE CASE TARGET
              </span>
              
              <div className="relative">
                <Compass className="absolute left-3 top-2.5 h-4 w-4 text-[#E53935]" />
                <select
                  value={selectedCaseId}
                  onChange={(e) => setSelectedCaseId(e.target.value)}
                  className="w-full bg-[#111111] border border-[#333333] focus:border-[#E53935] rounded pl-10 pr-3 py-2 text-xs font-mono text-[#E0E0E0] outline-none transition-colors cursor-pointer appearance-none"
                >
                  {Object.values(casesData).map((c) => (
                    <option key={c.id} value={c.id}>
                      🚨 [{c.status.toUpperCase()}] {c.title}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                  <ChevronRight size={14} className="rotate-90 text-[#888888]" />
                </div>
              </div>
            </div>

            {/* Launch button */}
            <button
              type="submit"
              className="w-full bg-[#E53935] hover:bg-[#c62828] text-white font-mono font-bold text-xs uppercase tracking-wider py-2.5 rounded transition-colors shadow-lg shadow-[#E53935]/25 flex items-center justify-center gap-2 cursor-pointer mt-6"
            >
              <Shield size={14} /> Establish Secure Connection
            </button>
          </form>

          <div className="text-center font-mono text-[9px] text-[#555555]">
            Authorized Access Only · IP Logged · Karnataka State IT Act
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
          <div className="w-8 h-8 rounded bg-[#1A1A1A] border-2 border-[#E53935] flex items-center justify-center font-bold text-lg text-[#E53935] font-mono">
            K
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#E53935] tracking-[0.15em] uppercase">KSP Intelligence Terminal</span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#E53935]/15 text-[#E53935] border border-[#E53935]/30">SECURE SHELL</span>
            </div>
            <h1 className="text-sm font-bold tracking-wider uppercase text-[#E0E0E0] font-sans mt-0.5">Karnataka State Police · Centralized Docket System</h1>
          </div>
        </div>

        <div className="flex flex-wrap lg:flex-nowrap items-center justify-between lg:justify-end gap-4 text-xs font-mono w-full lg:w-auto">
          {/* Theme Quick Selector */}
          <div className="flex items-center gap-2 bg-[#1A1A1A] border border-[#333333] rounded px-2.5 py-0.5">
            <span className="text-[9px] text-[#888888] font-mono uppercase tracking-wider">Theme:</span>
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="px-2 py-0.5 text-[9px] font-mono rounded-sm transition-all cursor-pointer text-[#888888] hover:text-[#E53935] flex items-center gap-1.5 font-bold uppercase"
              title="Toggle Light/Dark Theme"
            >
              {theme === "dark" ? <Moon size={11} className="text-[#9884AC]" /> : <Sun size={11} className="text-[#D69A4E]" />}
              <span>{theme}</span>
            </button>
          </div>

          <div className="h-8 w-px bg-[#333333]"></div>

          {/* Workspace Layout Settings */}
          <div className="flex items-center gap-2 bg-[#1A1A1A] border border-[#333333] rounded px-2 py-0.5">
            <span className="text-[9px] text-[#888888] font-mono uppercase tracking-wider pl-1">Sidebar:</span>
            <div className="flex bg-[#111111] rounded border border-[#333333] overflow-hidden p-0.5">
              <button 
                onClick={() => setRightPanelWidth("hidden")}
                title="Hide Sidebar (Full Canvas)"
                className={`px-2 py-0.5 text-[9px] font-mono rounded-sm transition-all cursor-pointer ${rightPanelWidth === "hidden" ? "bg-[#E53935] text-white font-bold" : "text-[#888888] hover:text-[#E0E0E0]"}`}
              >
                Hide
              </button>
              <button 
                onClick={() => setRightPanelWidth("narrow")}
                title="Narrow Sidebar"
                className={`px-2 py-0.5 text-[9px] font-mono rounded-sm transition-all cursor-pointer ${rightPanelWidth === "narrow" ? "bg-[#E53935] text-white font-bold" : "text-[#888888] hover:text-[#E0E0E0]"}`}
              >
                Narrow
              </button>
              <button 
                onClick={() => setRightPanelWidth("default")}
                title="Default Sidebar"
                className={`px-2 py-0.5 text-[9px] font-mono rounded-sm transition-all cursor-pointer ${rightPanelWidth === "default" ? "bg-[#E53935] text-white font-bold" : "text-[#888888] hover:text-[#E0E0E0]"}`}
              >
                Std
              </button>
              <button 
                onClick={() => setRightPanelWidth("wide")}
                title="Wide Sidebar"
                className={`px-2 py-0.5 text-[9px] font-mono rounded-sm transition-all cursor-pointer ${rightPanelWidth === "wide" ? "bg-[#E53935] text-white font-bold" : "text-[#888888] hover:text-[#E0E0E0]"}`}
              >
                Wide
              </button>
            </div>
          </div>

          <div className="h-8 w-px bg-[#333333]"></div>

          <div className="text-right">
            <span className="text-[#888888] text-[9px] tracking-widest block uppercase">Active Case Docket</span>
            <span className="text-[#E0E0E0] font-bold">{docketInfo.docketId} · South Div</span>
          </div>
          
          <div className="h-8 w-px bg-[#333333]"></div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="text-[#888888] text-[9px] tracking-widest block uppercase">Operator</span>
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
              <option value="Supervisor">Supervisor (Full PII)</option>
              <option value="Investigator">Investigator (Standard)</option>
              <option value="Analyst">Analyst (Masked PII)</option>
              <option value="Policymaker">Policymaker (Macro-only)</option>
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
        <section className={`${rightPanelWidth === "hidden" ? "lg:col-span-12" : rightPanelWidth === "narrow" ? "lg:col-span-9" : rightPanelWidth === "wide" ? "lg:col-span-7" : "lg:col-span-8"} flex flex-col p-4 space-y-4 h-full min-h-0 overflow-hidden border-r border-[#333333] bg-[#111111] min-w-0`}>
          
          {/* Tab buttons */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 border-b border-[#333333] no-scrollbar select-none">
            {[
              { id: "graph", label: "POLE Link Network", icon: <Network size={14} /> },
              { id: "investigation", label: "Case Investigation", icon: <Compass size={14} /> },
              { id: "trends", label: "Pattern & Hotspots", icon: <TrendingUp size={14} /> },
              { id: "sociology", label: "Demographic Insights", icon: <Users size={14} /> },
              { id: "offender", label: "Offender Profiling", icon: <Clock size={14} /> },
              { id: "financial", label: "Money Trail Ledger", icon: <Coins size={14} /> },
              { id: "forecasting", label: "Forecasting Alerts", icon: <Zap size={14} /> },
              { id: "governance", label: "Governance & Compliance Logs", icon: <Shield size={14} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  fetchLogs();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono border transition-all ${
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

                {/* Main link visualizer space split (Algorithms on Left, D3 Graph on Right) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1 min-h-0 overflow-hidden">
                  
                  {/* Left sub-panel: Graph Solver Algorithms */}
                  <div className="md:col-span-1 bg-[#1A1A1A] border border-[#333333] rounded p-4 flex flex-col justify-between overflow-y-auto min-h-0 h-full">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#888888] uppercase tracking-wider block mb-3">Graph Solvers</span>
                      
                      <div className="space-y-2 font-mono">
                        <button 
                          onClick={() => setActiveAlgo(activeAlgo === "core" ? null : "core")}
                          className={`w-full text-left p-2.5 rounded border text-xs leading-relaxed transition-all flex flex-col justify-between cursor-pointer ${
                            activeAlgo === "core" ? "bg-[#E53935]/15 border-[#E53935] text-[#E0E0E0]" : "bg-[#111111] border-[#333333] text-[#888888] hover:border-[#E53935]"
                          }`}
                        >
                          <span className="font-bold block text-[#E0E0E0]">k-Core Decomposition</span>
                          <span className="text-[9px] text-[#888888] mt-0.5">Strip peripheral nodes to isolate structural gangs.</span>
                        </button>

                        {activeAlgo === "core" && (
                          <div className="p-2 bg-[#111111] rounded border border-[#333333] mt-1 space-y-1">
                            <div className="flex justify-between text-[10px] text-[#888888] font-mono">
                              <span>Min Degree:</span>
                              <span className="text-[#E53935] font-bold">k = {kValue}</span>
                            </div>
                            <input 
                              type="range" 
                              min="1" 
                              max="4" 
                              value={kValue} 
                              onChange={(e) => setKValue(Number(e.target.value))}
                              className="w-full accent-[#E53935] cursor-pointer"
                            />
                          </div>
                        )}

                        <button 
                          onClick={() => setActiveAlgo(activeAlgo === "between" ? null : "between")}
                          className={`w-full text-left p-2.5 rounded border text-xs leading-relaxed transition-all flex flex-col justify-between cursor-pointer ${
                            activeAlgo === "between" ? "bg-[#D69A4E]/15 border-[#D69A4E] text-[#E0E0E0]" : "bg-[#111111] border-[#333333] text-[#888888] hover:border-[#D69A4E]"
                          }`}
                        >
                          <span className="font-bold block text-[#E0E0E0]">Betweenness Centrality</span>
                          <span className="text-[9px] text-[#888888] mt-0.5">Sized by bridging middlemen nodes.</span>
                        </button>

                        <button 
                          onClick={() => setActiveAlgo(activeAlgo === "community" ? null : "community")}
                          className={`w-full text-left p-2.5 rounded border text-xs leading-relaxed transition-all flex flex-col justify-between cursor-pointer ${
                            activeAlgo === "community" ? "bg-[#9884AC]/15 border-[#9884AC] text-[#E0E0E0]" : "bg-[#111111] border-[#333333] text-[#888888] hover:border-[#9884AC]"
                          }`}
                        >
                          <span className="font-bold block text-[#E0E0E0]">Louvain Communities</span>
                          <span className="text-[9px] text-[#888888] mt-0.5">Color code modularity clusters.</span>
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#333333]">
                      <span className="text-[9px] font-mono text-[#888888] block">MATCHED POLE COUNT</span>
                      <div className="text-xl font-mono font-bold text-[#E53935]">{filteredNodesCount} / {mockPOLEData.nodes.length}</div>
                    </div>
                  </div>

                  {/* Right sub-panel: D3 Graph Canvas */}
                  <div className="md:col-span-3 h-full min-h-0">
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
              <span>Case Inspector is collapsed.</span>
              <button
                onClick={() => setSplitRatio("default")}
                className="text-[#E53935] hover:underline font-bold cursor-pointer"
              >
                Restore Inspector
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
                CCTNS Case Inspector
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
                    {loadingSummary ? "Compiling..." : "Generate Brief"}
                  </button>

                  <button
                    onClick={handleFindSimilarCases}
                    disabled={loadingSimilar}
                    className="flex-1 bg-transparent hover:bg-[#111111] text-[#E0E0E0] rounded px-2.5 py-1.5 text-[10px] border border-[#333333] hover:border-[#E53935] font-bold tracking-wider uppercase transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    {loadingSimilar ? "Matching..." : "Compare Past"}
                  </button>
                </div>

                {/* AI Briefing outputs rendering space */}
                {summaryText && (
                  <div className="bg-[#111111] p-3 border border-[#333333] rounded mt-3 max-h-[160px] overflow-y-auto text-[10px] leading-relaxed text-[#b8bfca]">
                    <div className="flex items-center justify-between text-[#E53935] font-bold mb-1">
                      <div className="flex items-center gap-1">
                        <Sparkles size={11} />
                        <span>{summaryOffline ? "Autonomous Compiled Brief" : "Gemini Compiled Brief"}</span>
                      </div>
                      {summaryOffline && (
                        <span className="text-[8px] font-mono px-1 py-0.2 bg-[#D69A4E]/15 text-[#D69A4E] border border-[#D69A4E]/30 rounded">OFFLINE</span>
                      )}
                    </div>
                    <div className="whitespace-pre-line">{summaryText}</div>
                  </div>
                )}

                {/* Similar matches lists rendering space */}
                {similarCases.length > 0 && (
                  <div className="space-y-2 mt-3 pt-3 border-t border-[#333333]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#D69A4E] block uppercase">Archive Matches</span>
                      {similarOffline && (
                        <span className="text-[8px] font-mono px-1 py-0.2 bg-[#D69A4E]/15 text-[#D69A4E] border border-[#D69A4E]/30 rounded">OFFLINE</span>
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
                No active target selected. Click any node in the canvas to inspect its POLE attributes and compile briefings.
              </span>
            )}
          </div>

          {/* Intelligent Chatbot Panel */}
          <div className={`flex-1 min-h-0 flex flex-col overflow-hidden ${
            splitRatio === "inspectorOnly" ? "hidden" : ""
          }`}>
            <ChatbotInterface selectedNode={selectedNode} role={role} selectedCaseId={selectedCaseId} />
          </div>

          {/* Quick restore bar if Conversational Intelbot is hidden */}
          {splitRatio === "inspectorOnly" && (
            <div className="bg-[#1A1A1A] border border-[#333333] rounded px-3 py-1.5 flex justify-between items-center text-[10px] font-mono text-[#888888] shrink-0">
              <span>Intelbot is collapsed.</span>
              <button
                onClick={() => setSplitRatio("default")}
                className="text-[#E53935] hover:underline font-bold cursor-pointer"
              >
                Restore Intelbot
              </button>
            </div>
          )}

        </section>

      </main>
    </div>
  );
}
