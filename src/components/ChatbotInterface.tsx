import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Send, Volume2, VolumeX, Download, AlertCircle, AlertTriangle, FileText, Sparkles, Maximize2, Minimize2 } from "lucide-react";
import { motion } from "motion/react";
import { POLEEntity } from "../types";

interface Message {
  sender: "user" | "bot";
  content: string;
  timestamp: string;
}

interface ChatbotInterfaceProps {
  selectedNode: POLEEntity | null;
  role: string;
  selectedCaseId: string;
}

export default function ChatbotInterface({ selectedNode, role, selectedCaseId }: ChatbotInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      content: "Authorized KSP Intelbot online. Query CCTNS POLE docket registers or trace financial transactions. Language automatically matched for Kannada and English.",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [language, setLanguage] = useState<"English" | "Kannada">("English");
  const [isListening, setIsListening] = useState(false);
  const [isTtsActive, setIsTtsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [isExtended, setIsExtended] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Setup Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = language === "English" ? "en-IN" : "kn-IN";

      rec.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };
      rec.onend = () => setIsListening(false);
      rec.onerror = (e: any) => {
        console.warn("Speech Recognition Info:", e);
        setIsListening(false);
        const errorType = e.error || "unknown";
        let message = "Speech recognition error occurred.";
        if (errorType === "not-allowed") {
          message = "Microphone access denied. Please grant microphone permission in your browser or try opening the app in a new tab.";
        } else if (errorType === "no-speech") {
          message = "No speech detected. Please speak clearly into your microphone.";
        } else if (errorType === "network") {
          message = "Network error. Speech recognition requires an active internet connection.";
        } else if (errorType === "service-not-allowed" || errorType === "aborted") {
          message = "Speech service restricted inside frame container. Please open the application in a new tab to bypass iframe sandbox restrictions.";
        } else {
          message = `Speech Recognition Error (${errorType}). Try opening the application in a new tab to bypass iframe permissions.`;
        }
        setSpeechError(message);
        setTimeout(() => setSpeechError(null), 8000);
      };
      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        if (text) {
          setInputValue(text);
          // Auto-send voice queries
          handleSendMessage(text);
        }
      };
      recognitionRef.current = rec;
    }
  }, [language]);

  const toggleListening = async () => {
    if (!recognitionRef.current) {
      setSpeechError("Speech recognition is not supported in this browser, or iframe microphone permissions are disabled. Try using Google Chrome or open the app in a new tab.");
      setTimeout(() => setSpeechError(null), 8000);
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setSpeechError(null);
      try {
        // Explicitly request microphone permission from browser via getUserMedia before starting SpeechRecognition.
        // This triggers the native browser popup dialog inside allowed frames.
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // Release the microphone stream immediately since speech recognition engine handles recording itself
            stream.getTracks().forEach(track => track.stop());
          } catch (micErr: any) {
            console.warn("Microphone access permission check failed:", micErr);
            if (micErr.name === "NotAllowedError" || micErr.name === "PermissionDeniedError") {
              setSpeechError("Microphone access denied. Please grant microphone permission in your browser address bar or open the app in a new tab.");
              setTimeout(() => setSpeechError(null), 8000);
              return;
            }
          }
        }

        recognitionRef.current.lang = language === "English" ? "en-IN" : "kn-IN";
        recognitionRef.current.start();
      } catch (err: any) {
        console.warn("Speech start info:", err);
        setSpeechError("Failed to start voice listener. Please open in a new tab to bypass iframe sandboxing.");
        setTimeout(() => setSpeechError(null), 8000);
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    if (!textToSend) setInputValue("");

    const newMsg: Message = {
      sender: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, newMsg]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, newMsg].map(m => ({ sender: m.sender, content: m.content })),
          selectedNode: selectedNode,
          language: language,
          role: role,
          selectedCaseId: selectedCaseId
        })
      });

      const data = await response.json();
      
      if (data.offline) {
        setIsOfflineMode(true);
      } else {
        setIsOfflineMode(false);
      }
      setIsQuotaExceeded(!!data.quotaExceeded);
      
      const botMsg: Message = {
        sender: "bot",
        content: data.content,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, botMsg]);

      // Read aloud if TTS is active
      if (isTtsActive && window.speechSynthesis) {
        // Strip markdown before speaking
        const plainText = data.content.replace(/[*#_`\-]/g, "");
        const utterance = new SpeechSynthesisUtterance(plainText);
        utterance.lang = language === "English" ? "en-IN" : "kn-IN";
        window.speechSynthesis.cancel(); // cancel current speech
        window.speechSynthesis.speak(utterance);
      }

    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, {
        sender: "bot",
        content: "Error matching CCTNS secure API gateways. Running fallback routine: check local connections, confirm target suspect's risk metrics.",
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Preset query chips
  const presets = language === "English" ? [
    "Trace full money trail from B. Nagaraj",
    "Brief burglary prime suspect R. Manjunath",
    "Identify getaway vehicle and its linkages",
    "Analyze seasonal monsoon crime risks for Jayanagar"
  ] : [
    "ಬಿ. ನಾಗರಾಜ್ ಅವರ ಹಣಕಾಸಿನ ವರ್ಗಾವಣೆ ಪತ್ತೆ ಮಾಡಿ",
    "ದರೋಡೆ ಪ್ರಮುಖ ಆರೋಪಿ ಮಂಜುನಾಥ್ ವಿವರ ನೀಡಿ",
    "ಮಾರುತಿ ಸ್ವಿಫ್ಟ್ ಕಾರು ಲಿಂಕ್‌ಗಳು ಯಾವುವು?",
    "ಜಯನಗರದ ಮಳೆಗಾಲದ ಅಪರಾಧ ಮುನ್ಸೂಚನೆ ತೋರಿಸಿ"
  ];

  // Save/Print PDF locally
  const exportToPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const chatHtml = messages.map(m => `
      <div style="margin-bottom: 24px; padding: 12px; border-bottom: 1px solid #ddd; font-family: sans-serif;">
        <p style="font-weight: bold; font-size: 11px; text-transform: uppercase; margin: 0 0 6px 0; color: ${m.sender === 'user' ? '#111111' : '#E53935'}">
          ${m.sender === 'user' ? 'KSP INVESTIGATOR REPORT QUERY' : 'AI DOCKET EVIDENCE RESPONSE'} (${m.timestamp})
        </p>
        <p style="white-space: pre-wrap; margin: 0; font-size: 13px; line-height: 1.6; color: #333;">${m.content}</p>
      </div>
    `).join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>KSP Crime Chat History - CASE KSP-2026-JYG-0124</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #111; max-width: 800px; margin: 40px auto; padding: 20px; }
            h1 { font-size: 18px; border-bottom: 2px solid #E53935; padding-bottom: 8px; font-weight: bold; margin-bottom: 30px; letter-spacing: 0.05em; color: #E53935; }
            .meta { font-size: 11px; font-family: monospace; color: #666; margin-bottom: 30px; background: #f5f5f5; padding: 12px; border: 1px solid #ddd; border-radius: 2px; }
          </style>
        </head>
        <body>
          <h1>KARNATAKA STATE POLICE · INTELBOT TRANSCRIPT</h1>
          <div class="meta">
            DOCKET: KSP-2026-JYG-0124<br>
            OPERATOR: martisajay117@gmail.com (Role: ${role})<br>
            TIMESTAMP: ${new Date().toLocaleString()}<br>
            DPDP CLASSIFICATION: Compliant with Digital Personal Data Protection (DPDP) Act 2023 Secure Audit Log.
          </div>
          <div>${chatHtml}</div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const chatContent = (
    <div className={`flex flex-col bg-[#1A1A1A] border border-[#333333] rounded overflow-hidden ${isExtended ? "w-full h-full border-[#444444] shadow-[0_0_60px_rgba(229,57,53,0.25)]" : "h-full"}`}>
      
      {/* Chat header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#111111] border-b border-[#333333] rounded-t shrink-0">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${isOfflineMode ? "bg-[#D69A4E]" : "bg-[#7F9E6E]"}`}></div>
          <div>
            <div className="text-xs font-mono font-bold text-[#E0E0E0] tracking-tight">KSP Conversational Intelbot</div>
            <div className="text-[10px] font-mono text-[#888888]">
              CCTNS Integrated RAG · {language} {isOfflineMode ? "(Autonomous)" : "(Neural)"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="bg-[#1A1A1A] border border-[#333333] text-xs font-mono text-[#E0E0E0] rounded px-2.5 py-0.5 outline-none cursor-pointer focus:border-[#E53935]"
          >
            <option value="English">English</option>
            <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
          </select>

          {/* TTS Audio Toggle */}
          <button
            onClick={() => setIsTtsActive(!isTtsActive)}
            className={`p-1.5 rounded transition-colors border cursor-pointer ${isTtsActive ? 'bg-[#E53935]/15 text-[#E53935] border-[#E53935]/40 font-bold' : 'text-[#888888] hover:text-[#E0E0E0] border-transparent'}`}
            title={isTtsActive ? "Deactivate Voice Output" : "Activate Voice Output"}
          >
            {isTtsActive ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>

          {/* Local Save Transcript PDF */}
          <button
            onClick={exportToPDF}
            className="p-1.5 text-[#888888] hover:text-[#E0E0E0] border border-transparent rounded transition-colors cursor-pointer"
            title="Export Intel Docket to PDF"
          >
            <Download size={15} />
          </button>

          {/* Extend Chat Option */}
          <button
            onClick={() => setIsExtended(!isExtended)}
            className={`p-1.5 rounded border transition-colors cursor-pointer ${isExtended ? 'bg-[#E53935]/15 text-[#E53935] border-[#E53935]/40 font-bold' : 'text-[#888888] hover:text-[#E0E0E0] border-transparent hover:border-[#333333]'}`}
            title={isExtended ? "Minimize/Dock Chat" : "Extend Chat to Center Screen"}
          >
            {isExtended ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>

      {isQuotaExceeded && (
        <div className="bg-[#D69A4E]/10 border-b border-[#D69A4E]/20 px-3 py-1.5 text-[9px] font-mono text-[#D69A4E] flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <AlertTriangle size={11} className="shrink-0 text-[#D69A4E]" />
            <span className="leading-tight">Gemini API Rate Limit exceeded. Running Autonomous Offline Mode.</span>
          </div>
          <button 
            onClick={() => setIsQuotaExceeded(false)}
            className="text-[#D69A4E]/70 hover:text-white px-1 font-bold text-[10px] cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Messages layout */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#1A1A1A]">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}>
            <span className="text-[9px] font-mono text-[#888888] mb-1 px-1">
              {m.sender === "user" ? `Investigator (${role})` : "KSP AI"} · {m.timestamp}
            </span>
            <div 
              className={`max-w-[85%] rounded px-3 py-2 text-xs font-mono leading-relaxed border ${
                m.sender === "user" 
                  ? "bg-[#111111] text-[#E0E0E0] border-[#E53935]/30" 
                  : "bg-[#111111] text-[#CCCCCC] border-[#333333]"
              }`}
            >
              <div className="whitespace-pre-line">
                {m.content}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex flex-col items-start">
            <span className="text-[9px] font-mono text-[#888888] mb-1">Retrieving evidence trail...</span>
            <div className="bg-[#111111] text-[#888888] border border-[#333333] rounded px-3 py-2 text-xs font-mono flex items-center gap-2">
              <Sparkles size={13} className="animate-spin text-[#E53935]" />
              Synthesizing legal references...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Context attachment notification */}
      {selectedNode && (
        <div className="px-4 py-1.5 bg-[#E53935]/10 border-t border-[#E53935]/30 text-[10px] font-mono text-[#E53935] flex items-center gap-2 shrink-0">
          <AlertCircle size={12} />
          Context Linked: {selectedNode.type} — {selectedNode.label} ({selectedNode.id})
        </div>
      )}

      {/* Quick query chips */}
      <div className="px-3 py-2 bg-[#111111] border-t border-[#333333] flex gap-2 overflow-x-auto no-scrollbar select-none shrink-0">
        {presets.map((preset, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(preset)}
            className="flex-shrink-0 text-[10px] font-mono bg-[#1A1A1A] hover:bg-[#111111] text-[#888888] hover:text-[#E0E0E0] border border-[#333333] hover:border-[#E53935] rounded-full px-2.5 py-1 transition-colors cursor-pointer"
          >
            {preset}
          </button>
        ))}
      </div>

      {speechError && (
        <div className="px-4 py-2 bg-yellow-500/10 border-t border-yellow-500/30 text-[10px] font-mono text-yellow-500 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <AlertCircle size={12} className="shrink-0" />
            <span className="leading-tight">{speechError}</span>
          </div>
          <button 
            onClick={() => setSpeechError(null)} 
            className="text-yellow-500/70 hover:text-yellow-500 font-bold px-1.5 cursor-pointer text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Input container */}
      <div className="p-3 bg-[#111111] border-t border-[#333333] flex items-center gap-2 shrink-0 rounded-b shadow-[0_-4px_12px_rgba(0,0,0,0.5)]">
        <button
          onClick={toggleListening}
          className={`p-2 rounded border transition-all cursor-pointer ${
            isListening 
              ? 'bg-[#E53935]/20 text-[#E53935] border-[#E53935]/40 animate-pulse' 
              : 'bg-[#1A1A1A] text-[#888888] border-[#333333] hover:text-[#E0E0E0]'
          }`}
          title={isListening ? "Listening... click to send" : "Initiate Voice Search"}
        >
          {isListening ? <MicOff size={16} /> : <Mic size={16} />}
        </button>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
          placeholder={language === "English" ? "Enter search criteria, BNS sections, suspect..." : "ಖಾತೆಯ ವಿವರಗಳು, ಆರೋಪಿತ ಅಥವಾ ಎಫ್ಐಆರ್ ಹುಡುಕಿ..."}
          className="flex-1 bg-[#1A1A1A] border border-[#333333] hover:border-[#E53935]/40 focus:border-[#E53935] rounded px-3 py-2 text-xs font-mono text-[#E0E0E0] outline-none placeholder-[#555555] focus:ring-1 focus:ring-[#E53935]/25 transition-all"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputValue.trim() || loading}
          className="p-2 bg-[#E53935] hover:bg-[#c62828] text-[#ffffff] rounded border border-[#E53935] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );

  if (isExtended) {
    return (
      <>
        {/* Docked placeholder in the sidebar to keep layout clean */}
        <div className="flex flex-col h-full bg-[#111111] border border-dashed border-[#333333] rounded p-6 items-center justify-center text-center font-mono text-xs text-[#888888]">
          <Sparkles size={24} className="text-[#E53935] animate-pulse mb-3" />
          <div className="font-bold text-[#E0E0E0] mb-1">Intelbot Extended to Center Screen</div>
          <p className="max-w-[180px] text-[10px] leading-relaxed mb-4 text-[#666666]">
            Conversational search is active in full immersive mode.
          </p>
          <button
            onClick={() => setIsExtended(false)}
            className="bg-[#1A1A1A] hover:bg-[#222222] text-[#E53935] border border-[#E53935]/40 rounded px-3.5 py-1.5 font-bold hover:border-[#E53935] transition-all cursor-pointer text-[10px] uppercase font-mono tracking-wider"
          >
            Dock to Sidebar
          </button>
        </div>

        {/* Immersive centered modal overlay */}
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="w-full max-w-5xl h-[85vh] flex flex-col"
          >
            {chatContent}
          </motion.div>
        </div>
      </>
    );
  }

  return chatContent;
}
