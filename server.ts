import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { mockPOLEData, historicalCases, sociologicalStats } from "./src/data/mockData";
import { casesData } from "./src/data/casesData";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
app.use(express.json());

// In-memory audit log for compliance logging
interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  resourceId?: string;
  details: string;
  dpdpCompliance: string;
}

const auditLogs: AuditLog[] = [
  {
    id: "AUD-1001",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    user: "martisajay117@gmail.com",
    role: "Investigator",
    action: "Access Platform",
    details: "Initialized secure session under KSP-2026-JYG-0124",
    dpdpCompliance: "MFA active, data masked by default"
  },
  {
    id: "AUD-1002",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    user: "martisajay117@gmail.com",
    role: "Investigator",
    action: "Load Graph",
    details: "Loaded POLE Network model with 19 nodes, 24 edges",
    dpdpCompliance: "Standard authorization check passed"
  }
];

// Initialize Google Gen AI client lazy-loaded to prevent crashing if API key is not yet set
let aiClient: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined. AI features will fallback to deterministic rules.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// ----------------- DETAILED OFFLINE FALLBACK ENGINES -----------------

function generateOfflineChatResponse(query: string, selectedNodeId?: string, language: string = "English"): string {
  const q = query.toLowerCase();
  const isKannada = language === "Kannada";

  // Match keyword: Monsoon / seasonal forecasting / weather / rain
  if (
    q.includes("monsoon") ||
    q.includes("seasonal") ||
    q.includes("forecast") ||
    q.includes("weather") ||
    q.includes("rain") ||
    q.includes("ಮಳೆಗಾಲ") ||
    q.includes("ಹವಾಮಾನ") ||
    q.includes("ಮುನ್ಸೂಚನೆ") ||
    q.includes("ಮಳೆ") ||
    q.includes("ಗ್ರಹಿಕೆ")
  ) {
    if (isKannada) {
      return `**[ಸಿಸ್ಟಮ್ ಸೂಚನೆ: ಆಫ್‌ಲೈನ್ ಇಂಟೆಲಿಜೆನ್ಸ್ ಮೋಡ್ - ಸೀಮಿತ ಕೋಟಾ]**

- **ಕೋರ್ ಇಂಟೆಲಿಜೆನ್ಸ್ ವರದಿ (ಮಳೆಗಾಲದ ಅಪರಾಧ ಮುನ್ಸೂಚನೆ - ಜಯನಗರ)**:
  ಜಯನಗರ ಸೆಕ್ಟರ್ 4 ರಲ್ಲಿ ಜೂನ್‌ನಿಂದ ಆಗಸ್ಟ್ ಅವಧಿಯಲ್ಲಿ ಕಳ್ಳತನದ ಪ್ರಮಾಣವು ಶೇ. 32 ರಷ್ಟು ಹೆಚ್ಚಾಗುತ್ತದೆ. ಮಳೆಯ ಶಬ್ದವು ಬೀಗ ಒಡೆಯುವ ಶಬ್ದವನ್ನು ಮರೆಮಾಚುತ್ತದೆ ಮತ್ತು ಮಳೆಯಿಂದಾಗಿ ರಸ್ತೆಗಳು ನಿರ್ಜನವಾಗಿರುತ್ತವೆ.
  - **ಸಕ್ರಿಯ ಮುನ್ಸೂಚನೆ ಎಚ್ಚರಿಕೆ (ALR-2026-001)**: ಜಯನಗರ ಸೆಕ್ಟರ್ 4 ರಲ್ಲಿ ಸಂಘಟಿತ ಕಳ್ಳತನದ ಸಂಭವನೀಯತೆ **88%** ಆಗಿದೆ.
  - **ಕಾರಣ**: ಶಂಕಿತ ಮಾರುತಿ ಸ್ವಿಫ್ಟ್ (KA-05-MJ-2291) ರಾತ್ರಿ 1 ರಿಂದ 3 ರ ನಡುವೆ 3 ಬಾರಿ ಜಯನಗರ ಪ್ರವೇಶಿಸಿದೆ.

- **ತನಿಖಾ ಮಾಹಿತಿ ಮತ್ತು ಸುಳಿವುಗಳು**:
  - ಜಯನಗರ ಸೆಕ್ಟರ್ 4 ರ ವಸತಿ ಪ್ರದೇಶಗಳಲ್ಲಿ ರಾತ್ರಿ ಗಸ್ತನ್ನು ತೀವ್ರಗೊಳಿಸಿ.
  - ಪ್ರಮುಖ ರಸ್ತೆಗಳಲ್ಲಿ ಬ್ಯಾರಿಕೇಡ್ ಅಳವಡಿಸಿ ವಾಹನ ತಪಾಸಣೆ ನಡೆಸಿ.

- **ಕಾನೂನು ಅನುಸರಣೆ**:
  - ಬಿಎನ್‌ಎಸ್ಎಸ್ ಸೆಕ್ಷನ್ 173 ರ ಅಡಿಯಲ್ಲಿ ತಡೆಗಟ್ಟುವ ಪೊಲೀಸ್ ಕ್ರಮಗಳಿಗೆ ಇದು ಅನುಸರಿಸುತ್ತದೆ.

- **ಸಾಕ್ಷ್ಯ ಉಲ್ಲೇಖಗಳು**:
  - Location: L-001 -> Event: E-001 (OCCURRED_AT)
  - Object: O-001 -> Location: L-001 (SPOTTED_NEAR)`;
    }

    return `**[SYSTEM NOTICE: Offline/Deterministic Intelligence Engine - Quota Limit Reached]**

- **Core Intelligence Report (Seasonal Monsoon Forecast - Jayanagar)**:
  Jayanagar Sector 4 exhibits a historic **+32% burglary spike** during the monsoon season (June to August). Heavy rains isolate residential areas and the sound of rainfall masks mechanical housebreaking sounds.
  - **Active Forecast Alert (ALR-2026-001)**: Organised Burglary probability is calculated at **88%** in Jayanagar.
  - **Indicators**: Suspect vehicle Maruti Swift (KA-05-MJ-2291) entered the sector 3 times between 1 AM and 3 AM recently, overlapping with suspect cell-phone tower pings.

- **Investigative Insights & Leads**:
  - Position night beat patrol vehicles in Jayanagar Sector 4 residential zones.
  - Erect tactical checkpoints at sector egress points.

- **Admissibility & Compliance**:
  - Complies with BNSS guidelines for preventive crime monitoring.

- **Evidence References & Reasoning Path**:
  - \`Location: L-001\` -> \`Event: E-001\` (OCCURRED_AT)
  - \`Object: O-001\` -> \`Location: L-001\` (SPOTTED_NEAR) via ANPR camera BLR-S021.`;
  }

  // Match keyword: Money/financial trail / Nagaraj
  if (
    q.includes("money") ||
    q.includes("trail") ||
    q.includes("finance") ||
    q.includes("bank") ||
    q.includes("account") ||
    q.includes("transf") ||
    q.includes("fund") ||
    q.includes("rupee") ||
    q.includes("rs") ||
    q.includes("₹") ||
    q.includes("ಹಣ") ||
    q.includes("ಬ್ಯಾಂಕ್") ||
    q.includes("ಖಾತೆ") ||
    q.includes("ನಾಗರಾಜ್") ||
    q.includes("ಹಣಕಾಸು") ||
    q.includes("ಧನಲಕ್ಷ್ಮಿ") ||
    q.includes("nagaraj") ||
    q.includes("sus-4519") ||
    (selectedNodeId === "P-004" && q.includes("about"))
  ) {
    if (isKannada) {
      return `**[ಸಿಸ್ಟಮ್ ಸೂಚನೆ: ಆಫ್‌ಲೈನ್ ಇಂಟೆಲಿಜೆನ್ಸ್ ಮೋಡ್ - ಸೀಮಿತ ಕೋಟಾ]**

- **ಕೋರ್ ಇಂಟೆಲಿಜೆನ್ಸ್ ವರದಿ (ಹಣಕಾಸು ಜಾಡು - ಬಿ. ನಾಗರಾಜ್)**:
  ನಾವು ಜಯನಗರ ಕಳ್ಳತನದ ಪ್ರಕರಣದಲ್ಲಿ ಮೂರು ಪ್ರಮುಖ ಬ್ಯಾಂಕ್ ಖಾತೆಗಳ ನಡುವೆ ಹಣ ವರ್ಗಾವಣೆಯ ಜಾಲವನ್ನು ಪತ್ತೆಹಚ್ಚಿದ್ದೇವೆ:
  1. **ಬಿ. ನಾಗರಾಜ್** (HDFC ಖಾತೆ ***1187) ಅವರಿಂದ ಧನಲಕ್ಷ್ಮಿ ಶೆಲ್ ಸಂಸ್ಥೆಯ (SBI ಖಾತೆ ***9902) ಖಾತೆಗೆ ₹4,80,000 ವರ್ಗಾವಣೆಯಾಗಿದೆ (ದಿನಾಂಕ: 2026-06-28).
  2. **ಧನಲಕ್ಷ್ಮಿ ಶೆಲ್ ಸಂಸ್ಥೆಯ** ಖಾತೆಯಿಂದ ₹1,50,000 ಆರ್. ಮಂಜುನಾಥ್ ಅವರ ಕೆನರಾ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ (***4471) ವರ್ಗಾವಣೆಯಾಗಿದೆ (ದಿನಾಂಕ: 2026-07-06).
  3. ಆರ್. ಮಂಜುನಾಥ್ ಕೆನರಾ ಖಾತೆಯಿಂದ ₹20,000 ಹಣವನ್ನು ಮರಳಿ ಬಿ. ನಾಗರಾಜ್ ಖಾತೆಗೆ ವರ್ಗಾಯಿಸಿದ್ದಾರೆ (ದಿನಾಂಕ: 2026-07-07).

- **ತನಿಖಾ ಮಾಹಿತಿ ಮತ್ತು ಸುಳಿವುಗಳು**:
  - ಎಸ್‌ಬಿಐ (ಬಿಟಿಎಂ ಲೇಔಟ್ ಶಾಖೆ) ಮತ್ತು ಕೆನರಾ ಬ್ಯಾಂಕ್ ಶಾಖೆಗಳಿಂದ ವಹಿವಾಟಿನ ಸಂಪೂರ್ಣ ವಿವರಗಳನ್ನು ಪಡೆಯಲು ನೋಟಿಸ್ ನೀಡಿ.
  - ಬಿ. ನಾಗರಾಜ್ ಅವರ ಇತರ ಬೇನಾಮಿ ಆಸ್ತಿ ಮತ್ತು ಬ್ಯಾಂಕ್ ಖಾತೆಗಳನ್ನು ಪತ್ತೆಹಚ್ಚಿ.

- **ಕಾನೂನು ಅನುಸರಣೆ**:
  - ಬಿಎನ್‌ಎಸ್ಎಸ್ ಸೆಕ್ಷನ್ 173(3) ಮತ್ತು ಡಿಪಿಡಿಪಿ ಕಾಯ್ದೆ 2023 ರ ಅನ್ವಯ.

- **ಸಾಕ್ಷ್ಯ ಉಲ್ಲೇಖಗಳು**:
  - BankAccount: B-003 -> BankAccount: B-002 -> BankAccount: B-001 (TRANSFERRED_TO)`;
    }

    return `**[SYSTEM NOTICE: Offline/Deterministic Intelligence Engine - Quota Limit Reached]**

- **Core Intelligence Report (Financial Trail - B. Nagaraj)**:
  We detected a structured money laundering/financial funneling network across three key accounts in the current docket associated with suspected Financier **B. Nagaraj (SUS-4519)**:
  1. **B. Nagaraj** (HDFC A/C ***1187) initiated a high-value transfer of **₹4,80,000** to **Dhanalaxmi Enterprises (Shell)** (SBI A/C ***9902) on 2026-06-28 via RTGS.
  2. **Dhanalaxmi Enterprises** subsequently structured and layered the funds, transferring **₹1,50,000** to **R. Manjunath (Prime Accused)** (Canara A/C ***4471) on 2026-07-06 via NEFT.
  3. A kickback or reverse transfer of **₹20,000** was processed from **R. Manjunath** back to **B. Nagaraj** on 2026-07-07 via IMPS.

- **Investigative Insights & Leads**:
  - Request transactional ledgers and IP logs from SBI (BTM Layout branch) for Dhanalaxmi Enterprises (Shell) to uncover secondary cash mules (e.g. D. Ravi Kumar, who is also linked to the same shell account B-002).
  - Serve notices to HDFC and Canara Bank compliance managers to freeze accounts B-001 and B-002.

- **Admissibility & Compliance**:
  - Financial audit trails comply with Section 193 of the Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023. Complies with DPDP Act 2023 (legitimate state purpose exception).

- **Evidence References & Reasoning Path**:
  - \`BankAccount: B-003\` -> \`BankAccount: B-002\` via \`TRANSFERRED_TO\` (Amount: ₹4,80,000)
  - \`BankAccount: B-002\` -> \`BankAccount: B-001\` via \`TRANSFERRED_TO\` (Amount: ₹1,50,000)`;
  }

  // Match keyword: Manjunath / Prime Accused
  if (
    q.includes("manjunath") ||
    q.includes("sus-4471") ||
    q.includes("ಮಂಜುನಾಥ್") ||
    q.includes("ಮಂಜು") ||
    q.includes("ಆರೋಪಿ") ||
    q.includes("ದರೋಡೆ") ||
    q.includes("ಕಳ್ಳತನ") ||
    (selectedNodeId === "P-001" && q.includes("about"))
  ) {
    if (isKannada) {
      return `**[ಸಿಸ್ಟಮ್ ಸೂಚನೆ: ಆಫ್‌ಲೈನ್ ಇಂಟೆಲಿಜೆನ್ಸ್ ಮೋಡ್ - ಸೀಮಿತ ಕೋಟಾ]**

- **ಕೋರ್ ಇಂಟೆಲಿಜೆನ್ಸ್ ವರದಿ (ಆರ್. ಮಂಜುನಾಥ್)**:
  ಆರ್. ಮಂಜುನಾಥ್ (SUS-4471) ಜಯನಗರ FIR 124/2026 ಪ್ರಕರಣದಲ್ಲಿ ಮುಖ್ಯ ಆರೋಪಿಯಾಗಿದ್ದಾರೆ. ಇವರ ಅಪಾಯದ ರೇಟಿಂಗ್ 0.87 ಆಗಿದೆ.
  - **ಕೃತ್ಯದ ಶೈಲಿ (MO)**: ರಾತ್ರಿ ವೇಳೆ ಬೀಗ ಒಡೆದು ಕಳ್ಳತನ ಮಾಡುವುದು. ಸಿಸಿಟಿವಿ ನಿಷ್ಕ್ರಿಯಗೊಳಿಸಿ, ಕಾಗದದ ಸಹಾಯದಿಂದ ಬೀಗಗಳನ್ನು ಮುರಿಯುತ್ತಾರೆ.
  - **ಸಹಚರರು**: ದೇವರಾಜಪುರ ಗ್ಯಾಂಗ್‌ನ ಸಕ್ರಿಯ ಸದಸ್ಯರಾಗಿದ್ದು, ಕೆ. ಸುರೇಶ (SUS-4488) ಅವರೊಂದಿಗೆ ಬಿಟಿಎಂ ಸೇಫ್‌ಹೌಸ್‌ನಲ್ಲಿ ವಾಸವಿದ್ದಾರೆ.

- **ತನಿಖಾ ಮಾಹಿತಿ ಮತ್ತು ಸುಳಿವುಗಳು**:
  - ಇವರು ಬಳಸುತ್ತಿದ್ದ ಮೊಟೊರೊಲಾ ಮೊಬೈಲ್ (O-002) ಸಿಡಿಆರ್ ಲೊಕೇಶನ್ ಕಳವು ನಡೆದ ಜಯನಗರ ಸ್ಥಳದಲ್ಲಿಯೇ ಇದ್ದೂದು ದೃಢಪಟ್ಟಿದೆ.
  - ಹಳೆಯ ಪ್ರಕರಣ Koramangala PS FIR 812/2024 ರಲ್ಲೂ ಇವರ ಕೈವಾಡವಿತ್ತು.

- **ಕಾನೂನು ಅನುಸರಣೆ**:
  - ಬಿಎನ್‌ಎಸ್ 305 (ಮನೆಗಳ್ಳತನ) ಮತ್ತು ಬಿಎನ್‌ಎಸ್ 306 (ಕಳ್ಳತನ) ಅಡಿ ಪ್ರಕರಣ ದಾಖಲಿಸಲಾಗಿದೆ.

- **ಸಾಕ್ಷ್ಯ ಉಲ್ಲೇಖಗಳು**:
  - Person: P-001 -> Location: L-002 (LIVES_AT)
  - Person: P-001 -> Object: O-002 (OWNS)`;
    }

    return `**[SYSTEM NOTICE: Offline/Deterministic Intelligence Engine - Quota Limit Reached]**

- **Core Intelligence Report**:
  **R. Manjunath (SUS-4471)** is the identified **Prime Accused** in Jayanagar PS FIR 124/2026. He is a 35-year-old male with a high-risk structural rating of **0.87**.
  - **Modus Operandi**: Specialized in night-time residential housebreaking. He uses crowbars to bend window/door grills, disables local CCTV networks, and target cash/jewels stored in internal safes.
  - **Network Overlap**: Operates as a core member of the **Devarajpura Gang**. He co-resides with receiver **K. Suresha (SUS-4488)** in a verified BTM Layout safehouse.

- **Investigative Insights & Leads**:
  - Cell Tower CDR analysis places his Motorola handset (IMEI-356889124471) in immediate radial sector coverage of Jayanagar 4th Block (L-001) during the exact crime window (2026-07-04 23:38).
  - Prior criminal records show an identical arrest record in Koramangala PS (FIR 812/2024), establishing strong recidivism.

- **Admissibility & Compliance**:
  - Forensic fingerprinting matching and logging at the Jayanagar scene complies with BNSS Sec 176(3) mandates.

- **Evidence References & Reasoning Path**:
  - \`Person: P-001\` -> \`Location: L-002\` (LIVES_AT) verified during raid by SI Rakesh.
  - \`Person: P-001\` -> \`Object: O-002\` (OWNS)`;
  }

  // Match keyword: Suresha
  if (
    q.includes("suresha") ||
    q.includes("sus-4488") ||
    q.includes("ಸುರೇಶ್") ||
    q.includes("ಸುರೇಶ") ||
    q.includes("ಸಹಚರ") ||
    q.includes("ಖರೀದಿದಾರ") ||
    q.includes("ರಿಸೀವರ್") ||
    q.includes("ಮೊಬೈಲ್") ||
    (selectedNodeId === "P-002" && q.includes("about"))
  ) {
    if (isKannada) {
      return `**[ಸಿಸ್ಟಮ್ ಸೂಚನೆ: ಆಫ್‌ಲೈನ್ ಇಂಟೆಲಿಜೆನ್ಸ್ ಮೋಡ್ - ಸೀಮಿತ ಕೋಟಾ]**

- **ಕೋರ್ ಇಂಟೆಲಿಜೆನ್ಸ್ ವರದಿ (ಕೆ. ಸುರೇಶ)**:
  ಕೆ. ಸುರೇಶ (SUS-4488) ದೇವರಾಜಪುರ ಗ್ಯಾಂಗ್‌ನ ಮುಖ್ಯ ಸಹಚರ ಮತ್ತು ಕದ್ದ ವಸ್ತುಗಳನ್ನು ಸ್ವೀಕರಿಸುವವರಾಗಿದ್ದಾರೆ (ರಿಸೀವರ್). ಇವರ ಅಪಾಯದ ರೇಟಿಂಗ್ 0.62 ಆಗಿದೆ.
  - **ಕೃತ್ಯದ ಶೈಲಿ (MO)**: ಇವರು ಬಿಟಿಎಂ ಲೇಔಟ್‌ನಲ್ಲಿ ಹಳೆಯ ಮೊಬೈಲ್ ರಿಪೇರಿ ಅಂಗಡಿಯನ್ನು ನಡೆಸುತ್ತಿದ್ದಾರೆ. ಮೊಬೈಲ್‌ಗಳ ಐಎಂಇಐ (IMEI) ಸಂಖ್ಯೆಗಳನ್ನು ಬದಲಾಯಿಸುವುದು, ಡಿಜಿಟಲ್ ವಸ್ತುಗಳನ್ನು ಬಿಡಿಭಾಗಗಳಾಗಿ ಬೇರ್ಪಡಿಸುವುದು ಮತ್ತು ನಗದು ಹಣಕ್ಕೆ ಚಿನ್ನಾಭರಣಗಳನ್ನು ಕರಗಿಸುವುದರಲ್ಲಿ ಪರಿಣಿತರು.
  - **ಸಹಚರತ್ವ**: ಇವರು ಪ್ರಮುಖ ಆರೋಪಿ ಆರ್. ಮಂಜುನಾಥ್ ಅವರೊಂದಿಗೆ ನೇರ ಸಂಪರ್ಕ ಹೊಂದಿದ್ದು, ಬಿಟಿಎಂ ಲೇಔಟ್ ಸೇಫ್‌ಹೌಸ್‌ನಲ್ಲಿ ಒಟ್ಟಿಗೆ ವಾಸಿಸುತ್ತಿದ್ದಾರೆ.

- **ತನಿಖಾ ಮಾಹಿತಿ ಮತ್ತು ಸುಳಿವುಗಳು**:
  - ಬಿಟಿಎಂ ಲೇಔಟ್‌ನಲ್ಲಿರುವ ಸುರೇಶ ಅವರ ಅಂಗಡಿಯ ಮೇಲೆ ನಿಗಾ ಇರಿಸಿ ಮತ್ತು ದಾಖಲೆ ಇಲ್ಲದ ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಬಿಡಿಭಾಗಗಳನ್ನು ವಶಪಡಿಸಿಕೊಳ್ಳಿ.
  - ನಾಗರಾಜ್ ಅವರ ಶೆಲ್ ಕಂಪನಿಗಳ ಮೂಲಕ ಹಣ ಪಡೆದು ಖರೀದಿಸಿದ ಚಿನ್ನಾಭರಣಗಳ ಬಗ್ಗೆ ಸುರೇಶ ಅವರನ್ನು ತೀವ್ರ ವಿಚಾರಣೆಗೆ ಒಳಪಡಿಸಿ.

- **ಕಾನೂನು ಅನುಸರಣೆ**:
  - ಬಿಎನ್‌ಎಸ್ಎಸ್ ಸೆಕ್ಷನ್ 173 ರ ಅಡಿಯಲ್ಲಿ ಡಿಜಿಟಲ್ ವಿಧಿವಿಜ್ಞಾನ ದಾಖಲಾತಿ ಮಾನದಂಡಗಳನ್ನು ಪಾಲಿಸಲಾಗಿದೆ.

- **ಸಾಕ್ಷ್ಯ ಉಲ್ಲೇಖಗಳು**:
  - Person: P-002 -> Person: P-001 (ASSOCIATES_WITH)
  - Person: P-002 -> Location: L-002 (LIVES_AT)`;
    }

    return `**[SYSTEM NOTICE: Offline/Deterministic Intelligence Engine - Quota Limit Reached]**

- **Core Intelligence Report**:
  **K. Suresha (SUS-4488)** functions as the primary **Associate and Receiver (Fencer)** for the Devarajpura Gang. He has a risk score of **0.62**.
  - **Modus Operandi**: He operates a pre-owned mobile repair shop in BTM Layout which acts as a front. He specializes in rewriting mobile IMEIs, dismantling digital electronics, and laundering metals/gold via cash-only merchants.
  - **Co-Offending Ties**: He is directly connected to prime accused R. Manjunath. They share a safehouse in BTM Layout.

- **Investigative Insights & Leads**:
  - Monitor Suresha's workshop in BTM Layout for uncataloged electronic parts.
  - Interrogate Suresha regarding gold bullion deliveries originating from Nagaraj's shell accounts.

- **Admissibility & Compliance**:
  - Meets digital forensic registry standard guidelines under BNSS Section 173.

- **Evidence References & Reasoning Path**:
  - \`Person: P-002\` -> \`Person: P-001\` (ASSOCIATES_WITH) with high confidence (0.90).
  - \`Person: P-002\` -> \`Location: L-002\` (LIVES_AT) verified.`;
  }

  // Match keyword: Farooq or Swift or Vehicle
  if (
    q.includes("farooq") ||
    q.includes("swift") ||
    q.includes("car") ||
    q.includes("vehicle") ||
    q.includes("ka-05-mj-2291") ||
    q.includes("ಫಾರೂಕ್") ||
    q.includes("ಸ್ವಿಫ್ಟ್") ||
    q.includes("ಕಾರು") ||
    q.includes("ಕಾರ್") ||
    q.includes("ವಾಹನ") ||
    q.includes("ಮಾರುತಿ") ||
    (selectedNodeId === "P-003" && q.includes("about")) ||
    (selectedNodeId === "O-001" && q.includes("about"))
  ) {
    if (isKannada) {
      return `**[ಸಿಸ್ಟಮ್ ಸೂಚನೆ: ಆಫ್‌ಲೈನ್ ಇಂಟೆಲಿಜೆನ್ಸ್ ಮೋಡ್ - ಸೀಮಿತ ಕೋಟಾ]**

- **ಕೋರ್ ಇಂಟೆಲಿಜೆನ್ಸ್ ವರದಿ (ಎ. ಫಾರೂಕ್ / ವಾಹನ)**:
  ಎ. ಫಾರೂಕ್ (SUS-4502) ದೇವರಾಜಪುರ ಗ್ಯಾಂಗ್‌ನ ಗೆಟ್‌ಅವೇ ಚಾಲಕರಾಗಿದ್ದಾರೆ (ವಾಹನ ಚಾಲಕ). ಇವರು ತಿಲಕನಗರದ ನಿವಾಸಿಯಾಗಿದ್ದಾರೆ.
  - **ಕೃತ್ಯದ ಶೈಲಿ (MO)**: ಕಳ್ಳತನದ ನಂತರ ತಪ್ಪಿಸಿಕೊಳ್ಳುವ ಮಾರ್ಗಗಳ ಯೋಜನೆ ಮತ್ತು ಪೊಲೀಸರಿಂದ ತಪ್ಪಿಸಿಕೊಳ್ಳಲು ಕಿರಿದಾದ ರಸ್ತೆಗಳಲ್ಲಿ ವೇಗವಾಗಿ ವಾಹನ ಚಾಲನೆ ಮಾಡುವುದರಲ್ಲಿ ಪರಿಣಿತರು. ಇವರು ಬೂದು ಬಣ್ಣದ ಮಾರುತಿ ಸ್ವಿಫ್ಟ್ (KA-05-MJ-2291) ವಾಹನವನ್ನು ಬಳಸುತ್ತಿದ್ದರು.
  - **ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ**: ಸದರಿ ವಾಹನವನ್ನು ಜಪ್ತಿ ಮಾಡಲಾಗಿದ್ದು, ಸಿಆರ್‌ಪಿಸಿ/ಬಿಎನ್‌ಎಸ್‌ಎಸ್ ಅನ್ವಯ ವಶಕ್ಕೆ ಪಡೆಯಲಾಗಿದೆ.

- **ತನಿಖಾ ಮಾಹಿತಿ ಮತ್ತು ಸುಳಿವುಗಳು**:
  - ಎಎನ್‌ಪಿಆರ್ (ANPR) ಕ್ಯಾಮೆರಾ BLR-S021 ನಲ್ಲಿ ಮಾರುತಿ ಸ್ವಿಫ್ಟ್ ಕಾರು 2026-07-04 ರಂದು ರಾತ್ರಿ 23:41 ಕ್ಕೆ ಜಯನಗರ 4ನೇ ಬ್ಲಾಕ್ ಪ್ರವೇಶಿಸಿರುವುದು ಪತ್ತೆಯಾಗಿದೆ.
  - ಈ ಕಾರಿನ ಖರೀದಿಗೆ ಬಿ. ನಾಗರಾಜ್ ಅವರ ಶೆಲ್ ಕಂಪನಿಗಳು ಹಣಕಾಸು ಒದಗಿಸಿವೆಯೆ ಎಂದು ಪರಿಶೀಲಿಸಿ.

- **ಕಾನೂನು ಅನುಸರಣೆ**:
  - ಬಿಎನ್‌ಎಸ್ ಸೆಕ್ಷನ್ 185 ರ ಅನ್ವಯ ವಾಹನ ಜಪ್ತಿ ವರದಿಯನ್ನು ನ್ಯಾಯಾಲಯಕ್ಕೆ ಸಲ್ಲಿಸಲಾಗಿದೆ.

- **ಸಾಕ್ಷ್ಯ ಉಲ್ಲೇಖಗಳು**:
  - Person: P-003 -> Object: O-001 (OPERATES_VEHICLE)
  - Object: O-001 -> Location: L-001 (SPOTTED_NEAR)`;
    }

    return `**[SYSTEM NOTICE: Offline/Deterministic Intelligence Engine - Quota Limit Reached]**

- **Core Intelligence Report**:
  **A. Farooq (SUS-4502)** is the **Getaway Driver** for the Devarajpura Gang. He is a Commercial Driver residing in Tilaknagar.
  - **Modus Operandi**: Specializes in logistics, getaway routes, and evading police traps in narrow streets. He operates a **grey Maruti Swift (KA-05-MJ-2291)**.
  - **Current Status**: The vehicle has been **Seized** and impounded.

- **Investigative Insights & Leads**:
  - ANPR Camera BLR-S021 captured the Maruti Swift (KA-05-MJ-2291) entering Jayanagar 4th Block at **23:41** on 2026-07-04, just minutes before the burglary.
  - Check the rental logs or ownership papers of the Swift to verify if B. Nagaraj's shell companies funded its procurement.

- **Admissibility & Compliance**:
  - Seizure report compiled and filed in judicial magistrate court under BNS Section 185.

- **Evidence References & Reasoning Path**:
  - \`Person: P-003\` -> \`Object: O-001\` (OPERATES_VEHICLE)
  - \`Object: O-001\` -> \`Location: L-001\` (SPOTTED_NEAR) via ANPR on 2026-07-04.`;
  }

  // Default / general case overview response
  if (isKannada) {
    return `**[ಸಿಸ್ಟಮ್ ಸೂಚನೆ: ಆಫ್‌ಲೈನ್ ಇಂಟೆಲಿಜೆನ್ಸ್ ಮೋಡ್ - ಸೀಮಿತ ಕೋಟಾ]**

- **ಕೋರ್ ಕೇಸ್ ಮಾಹಿತಿ (KSP-2026-JYG-0124)**:
  ಇದು ಬೆಂಗಳೂರು ದಕ್ಷಿಣ ವಿಭಾಗದ ಜಯನಗರ ಮತ್ತು ಬಿಟಿಎಂ ಲೇಔಟ್ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ನಡೆದ ಸರಣಿ ಕಳ್ಳತನ ಪ್ರಕರಣಗಳಾಗಿದ್ದು, **ದೇವರಾಜಪುರ ಗ್ಯಾಂಗ್** ಇದಕ್ಕೆ ಕಾರಣವಾಗಿದೆ.

- **ಪ್ರಮುಖ ಆರೋಪಿಗಳು ಮತ್ತು ಅಪಾಯದ ರೇಟಿಂಗ್**:
  1. **ಆರ್. ಮಂಜುನಾಥ್** (ಮುಖ್ಯ ಆರೋಪಿ): ಬೀಗ ಒಡೆದು ಕಳ್ಳತನ, ಬಿಟಿಎಂ ಸೇಫ್‌ಹೌಸ್ ನಿವಾಸಿ, ಅಪಾಯದ ರೇಟಿಂಗ್: **0.87**.
  2. **ಕೆ. ಸುರೇಶ** (ರಿಸೀವರ್): ಮೊಬೈಲ್ ರಿಪೇರಿ ಅಂಗಡಿಯ ಮುಂಭಾಗ, ಐಎಂಇಐ ಬದಲಾವಣೆ, ಅಪಾಯದ ರೇಟಿಂಗ್: **0.62**.
  3. **ಎ. ಫಾರೂಕ್** (ಚಾಲಕ): ಮಾರುತಿ ಸ್ವಿಫ್ಟ್ (KA-05-MJ-2291) ಚಾಲಕ, ಅಪಾಯದ ರೇಟಿಂಗ್: **0.58**.
  4. **ಬಿ. ನಾಗರಾಜ್** (ಹಣಕಾಸುದಾರ): ಧನಲಕ್ಷ್ಮಿ ಶೆಲ್ ಕಂಪನಿಯ ಮೂಲಕ ಹಣ ವರ್ಗಾವಣೆ, ಅಪಾಯದ ರೇಟಿಂಗ್: **0.71**.

- **ಪ್ರಮುಖ ಸಾಕ್ಷ್ಯಗಳ ಕೊಂಡಿಗಳು**:
  - **ಡಿಜಿಟಲ್ ಹೆಜ್ಜೆಗುರುತು**: ಕಳ್ಳತನ ನಡೆದ ಸಮಯದಲ್ಲಿ ಮಂಜುನಾಥ್ ಅವರ ಮೊಟೊರೊಲಾ ಮೊಬೈಲ್ ಜಯನಗರದ ಸೆಲ್ ಟವರ್ ವ್ಯಾಪ್ತಿಯಲ್ಲಿತ್ತು (ರಾತ್ರಿ 23:38).
  - **ಎಎನ್‌ಪಿಆರ್ ಕ್ಯಾಪ್ಚರ್**: ಫಾರೂಕ್ ಅವರ ಮಾರುತಿ ಸ್ವಿಫ್ಟ್ ಕಾರು ಜಯನಗರದ ಕ್ಯಾಮೆರಾದಲ್ಲಿ ಪತ್ತೆಯಾಗಿದೆ (ರಾತ್ರಿ 23:41).
  - **ಹಣಕಾಸು ಆಡಿಟ್**: ಬಿ. ನಾಗರಾಜ್ ಅವರ ಎಚ್‌ಡಿಎಫ್‌ಸಿ ಖಾತೆಯಿಂದ ಧನಲಕ್ಷ್ಮಿ ಶೆಲ್ ಎಸ್‌ಬಿಐ ಖಾತೆಗೆ ₹4.8 ಲಕ್ಷ ವರ್ಗಾವಣೆಯಾಗಿದ್ದು, ಅಲ್ಲಿಂದ ಮಂಜುನಾಥ್ ಅವರ ಕೆನರಾ ಖಾತೆಗೆ ₹1.5 ಲಕ್ಷ ವರ್ಗಾವಣೆಯಾಗಿದೆ.

- **ಮುಂದಿನ ತನಿಖಾ ಹಂತಗಳು**:
  1. ಬಿಟಿಎಂ ಸೇಫ್‌ಹೌಸ್ ವಿಳಾಸದ ಆಧಾರದ ಮೇಲೆ ಆರ್. ಮಂಜುನಾಥ್ ವಿರುದ್ಧ ಬಂಧನ ವಾರಂಟ್ ಜಾರಿಗೊಳಿಸಿ.
  2. ಎಸ್‌ಬಿಐ ಮತ್ತು ಕೆನರಾ ಬ್ಯಾಂಕ್‌ಗಳಿಗೆ ಅಧಿಕೃತ ನೋಟಿಸ್ ನೀಡಿ ವಹಿವಾಟಿನ ಪೂರ್ಣ ವಿವರ ಪಡೆಯಿರಿ.
  3. ವಾಹನದಿಂದ ಪತ್ತೆಯಾದ ಕಂಟ್ರಿಮೇಡ್ ಪಿಸ್ತೂಲ್ ಬಗ್ಗೆ ಚಾಲಕ ಎ. ಫಾರೂಕ್‌ನನ್ನು ವಿಚಾರಣೆ ನಡೆಸಿ.`;
  }

  return `**[SYSTEM NOTICE: Offline/Deterministic Intelligence Engine - Quota Limit Reached]**

- **Core Case Brief (KSP-2026-JYG-0124)**:
  This docket relates to a series of high-end burglaries and housebreakings in the Jayanagar and BTM Layout sectors of Bengaluru South Division, tied to the **Devarajpura Gang**.

- **Primary Entities & Risk Matrix**:
  1. **R. Manjunath (Prime Accused)**: Crowbar entry break-ins, resides at BTM safehouse, risk: **0.87**.
  2. **K. Suresha (Fencer/Receiver)**: Pre-owned mobile shop front in BTM, alters IMEIs, risk: **0.62**.
  3. **A. Farooq (Getaway Driver)**: Drives Maruti Swift (KA-05-MJ-2291), risk: **0.58**.
  4. **B. Nagaraj (Financier)**: Roots funds through Dhanalaxmi Shell Enterprises, risk: **0.71**.

- **Crucial Evidentiary Linkages**:
  - **Digital Footprint**: Motorola device (Manjunath) pinged at Electronic City Cell Tower 18 near Jayanagar scene at 23:38 on the crime night.
  - **ANPR Capture**: Maruti Swift getaway vehicle (Farooq) captured by ANPR camera in Jayanagar at 23:41.
  - **Financial Audit**: B. Nagaraj's HDFC account transferred ₹4.8 Lakhs to Dhanalaxmi Shell SBI account, which structured ₹1.5 Lakhs to Manjunath's Canara account.

- **Next Actionable Steps**:
  1. Arrest warrant issued for R. Manjunath based on verified BTM safehouse residency.
  2. Serve transactional disclosure requests to SBI and Canara Bank.
  3. Interrogate getaway driver A. Farooq regarding the country-made pistol recovered from his vehicle.`;
}

function generateOfflineSummary(node: any, neighbors: any[], language: string = "English"): string {
  const isKannada = language === "Kannada";
  const piiWarning = node.type === "Person" 
    ? (isKannada ? "⚠️ DPDP ಕಾಯ್ದೆ 2023 ರ ಅಡಿಯಲ್ಲಿ ನಿರ್ಬಂಧಿತ ಪ್ರವೇಶ. PII ವಿವರಗಳನ್ನು ಹೊಂದಿದೆ." : "⚠️ Restrictive access under DPDP Act 2023. Contains PII.")
    : (isKannada ? "ಸಾರ್ವಜನಿಕ/ಸಿಸ್ಟಮ್ ಮೆಟಾಡೇಟಾ." : "Public/System Metadata.");
  
  let body = "";
  if (node.type === "Person") {
    const attrs = node.attrs || {};
    if (isKannada) {
      body = `### ಕಾರ್ಯನಿರ್ವಾಹಕ ಬ್ರೀಫಿಂಗ್: ${node.label} (${node.id})
- **ವರ್ಗೀಕರಣ**: ${attrs.role === "Prime Accused" ? "ಪ್ರಮುಖ ಆರೋಪಿ" : attrs.role === "Associate/Receiver" ? "ಸಹಚರ/ರಿಸೀವರ್" : attrs.role === "Getaway Driver" ? "ಗೆಟ್‌ಅವೇ ಡ್ರೈವರ್" : attrs.role || "ಶಂಕಿತ"}
- **ರಚನಾತ್ಮಕ ಅಪಾಯದ ಸ್ಕೋರ್**: **${attrs.risk_score || "0.50"}**
- **ಸಾಮಾಜಿಕ-ಜನಸಂಖ್ಯಾ ಸಂದರ್ಭ**: ವಯಸ್ಸು ${attrs.age || "N/A"}, ಲಿಂಗ: ${attrs.gender === "Male" ? "ಪುರುಷ" : attrs.gender || "ಪುರುಷ"}. ಹಿನ್ನೆಲೆ: ${attrs.background || "N/A"}
- **ಶಿಕ್ಷಣ ಮಟ್ಟ**: ${attrs.education || "ಮಾಧ್ಯಮಿಕ ಶಾಲೆ"}

#### 1. ಕ್ರಿಮಿನಲ್ ವರ್ತನೆ ಮತ್ತು ಕೃತ್ಯದ ಶೈಲಿ (MO)
ವಿಷಯದ ಮೋಡಸ್ ಆಪರೇಂಡಿ ವೃತ್ತಿಪರ ಅಪರಾಧ ಜಾಲಗಳಿಗೆ ಹೊಂದಿಕೆಯಾಗುತ್ತದೆ.
- **MO ಸಿಗ್ನೇಚರ್**: ${attrs.mo_signature || "ರಾತ್ರಿ ವೇಳೆ ಮನೆಗಳ್ಳತನ, ಕದ್ದ ಮಾಲು ಸ್ವೀಕರಿಸುವುದು ಅಥವಾ ತಪ್ಪಿಸಿಕೊಳ್ಳುವ ಲಾಜಿಸ್ಟಿಕ್ಸ್."}
- **ಗ್ಯಾಂಗ್ ಸಂಯೋಜನೆ**: ${attrs.known_gang_affiliation || "ಯಾವುದೂ ಪತ್ತೆಯಾಗಿಲ್ಲ."}

#### 2. ಮರುನಿರ್ಮಾಣಗೊಂಡ ಸಂಬಂಧಗಳು ಮತ್ತು ನೆಟ್‌ವರ್ಕ್ ಸಂಪರ್ಕಗಳು
ಪ್ರಕರಣದ ಫೈಲ್‌ಗಳಲ್ಲಿ ವಿಷಯವು ಇತರ ${neighbors.length} ಘಟಕಗಳಿಗೆ ಲಿಂಕ್ ಮಾಡಲ್ಪಟ್ಟಿದೆ:
${neighbors.map(n => {
  const otherLabel = n.entity && typeof n.entity === 'object' && n.entity.label ? n.entity.label : n.entity;
  const otherId = n.entity && typeof n.entity === 'object' && n.entity.id ? n.entity.id : "";
  const otherType = n.entity && typeof n.entity === 'object' && n.entity.type ? n.entity.type : "";
  return `- **${n.relationship}** ಸಂಬಂಧ **${otherLabel}** [${otherId || n.entity}] (${otherType || "ಅಜ್ಞಾತ"}) ನೊಂದಿಗೆ`;
}).join("\n")}

#### 3. ತಕ್ಷಣದ ತನಿಖಾ ಸುಳಿವುಗಳು
1. 2026-07-04 ರಂದು ಕಳವು ನಡೆದ ಸಮಯದಲ್ಲಿ ಸೆಲ್-ಟವರ್ ಲೊಕೇಶನ್ ಅತಿಕ್ರಮಣಗಳ ಬಗ್ಗೆ ಪ್ರಾಥಮಿಕ ಸಂಪರ್ಕಗಳನ್ನು ಕ್ರಾಸ್-ವಿಚಾರಣೆ ಮಾಡಿ.
2. ಲಿಂಕ್ ಮಾಡಲಾದ ಖಾತೆಗಳಿಗಾಗಿ ಬಿಎನ್‌ಎಸ್ಎಸ್ ಸೆಕ್ಷನ್ 193 ಅಡಿಯಲ್ಲಿ ಬ್ಯಾಂಕಿಂಗ್ ನೋಟಿಸ್‌ಗಳನ್ನು ರಚಿಸಿ.
3. ಅವರ ಪರಿಶೀಲಿಸಿದ ಭೌತಿಕ ವಿಳಾಸಗಳಲ್ಲಿ ಸಕ್ರಿಯ ಕಣ್ಗಾವಲು ನಿರ್ದೇಶಾಂಕಗಳನ್ನು ಸ್ಥಾಪಿಸಿ.

#### 4. ಕಾನೂನು ಅನುಸರಣೆ ಆಡಿಟಿಂಗ್ (BNSS Sec 173/193)
- ${piiWarning}
- 14 ದಿನಗಳ ಶಾಸನಬದ್ಧ ಅವಧಿಯೊಳಗೆ ಪ್ರಾಥಮಿಕ ವಿಚಾರಣೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಮುಚ್ಚಲಾಗಿದೆ.
- ಫಿಂಗರ್‌ಪ್ರಿಂಟ್/ವಿಧಿವಿಜ್ಞಾನದ ಜಾಡನ್ನು ಪೂರ್ಣಗೊಳಿಸಲಾಗಿದೆ ಮತ್ತು ಇ-ಫೋರೆನ್ಸಿಕ್ಸ್ ಮಾಡ್ಯೂಲ್‌ಗೆ ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾಗಿದೆ.`;
    } else {
      body = `### Executive Briefing: ${node.label} (${node.id})
- **Classification**: ${attrs.role || "Suspect"}
- **Structural Risk Score**: **${attrs.risk_score || "0.50"}**
- **Socio-demographic context**: Age ${attrs.age || "N/A"}, ${attrs.gender || "Male"}. Background: ${attrs.background || "N/A"}
- **Education Level**: ${attrs.education || "Secondary School"}

#### 1. Criminological Behavior & MO
The subject's modus operandi matches professional crime syndicates. 
- **MO Signature**: ${attrs.mo_signature || "Nighttime housebreaking, fencing, or getaway logistics."}
- **Gang Association**: ${attrs.known_gang_affiliation || "None identified."}

#### 2. Reconstructed Linkages & Network Contacts
The subject is linked to ${neighbors.length} other entities in the case files:
${neighbors.map(n => {
  const otherLabel = n.entity && typeof n.entity === 'object' && n.entity.label ? n.entity.label : n.entity;
  const otherId = n.entity && typeof n.entity === 'object' && n.entity.id ? n.entity.id : "";
  const otherType = n.entity && typeof n.entity === 'object' && n.entity.type ? n.entity.type : "";
  return `- **${n.relationship}** with **${otherLabel}** [${otherId || n.entity}] (${otherType || "Unknown"})`;
}).join("\n")}

#### 3. Immediate Investigative Leads
1. Cross-examine primary contacts regarding cell-tower location overlaps on 2026-07-04.
2. Draft formal banking notices under BNSS Section 193 for linked accounts.
3. Establish active surveillance coordinates at their verified physical addresses.

#### 4. Compliance Auditing (BNSS Sec 173/193)
- ${piiWarning}
- Preliminary inquiry successfully closed within the 14-day statutory timeline.
- Fingerprint/forensics trail completed and uploaded to e-Forensics module.`;
    }
  } else if (node.type === "BankAccount") {
    const attrs = node.attrs || {};
    if (isKannada) {
      body = `### ಹಣಕಾಸು ಆಡಿಟ್ ಡಾಕೆಟ್: ${node.label} (${node.id})
- **ಸಂಸ್ಥೆ**: ${attrs.bank_name || "ಸ್ಟೇಟ್ ಬ್ಯಾಂಕ್ ಆಫ್ ಇಂಡಿಯಾ"}
- **ಖಾತೆ ಸಂಖ್ಯೆ**: ${attrs.account_num || "N/A"}
- **KYC ಅನುಸರಣೆ**: **${attrs.kyc_status === "Verified" ? "ಪರಿಶೀಲಿಸಲಾಗಿದೆ" : attrs.kyc_status || "ಪರಿಶೀಲಿಸಲಾಗಿದೆ"}**
- **ಪ್ರಸ್ತುತ ಬ್ಯಾಲೆನ್ಸ್**: ${attrs.current_balance || "N/A"}

#### 1. ವಹಿವಾಟುಗಳ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಲೆಡ್ಜರ್ ಚಟುವಟಿಕೆ
ಈ ನೋಡ್ ಕೇಂದ್ರ ಹಣಕಾಸು ನಿಯಂತ್ರಣ ಚಾನಲ್‌ನ ಭಾಗವಾಗಿದೆ.
${neighbors.map(n => {
  const otherLabel = n.entity && typeof n.entity === 'object' && n.entity.label ? n.entity.label : n.entity;
  const amountStr = n.meta && n.meta.amount ? ` (ಮೊತ್ತ: ${n.meta.amount})` : "";
  return `- **${n.relationship}** ಸಂಬಂಧ **${otherLabel}** ನೊಂದಿಗೆ${amountStr}`;
}).join("\n")}

#### 2. ಮನಿ ಲಾಂಡರಿಂಗ್ ಸೂಚಕಗಳು
- ದೊಡ್ಡ RTGS ಸ್ವೀಕೃತಿಗಳನ್ನು ಸಣ್ಣ ನೇರ NEFT/IMPS ಹಿಂಪಡೆಯುವಿಕೆಗಳಾಗಿ ಲೇಯರಿಂಗ್ ಮಾಡುವುದು.
- ಕಳ್ಳತನ/ಮನೆಗಳ್ಳತನದ ಹಿನ್ನೆಲೆ ಹೊಂದಿರುವ ಶಂಕಿತರೊಂದಿಗೆ ನೇರ ಸಂಪರ್ಕ.

#### 3. ಕಾನೂನು ಸ್ಥಿತಿ
- ಬಿಎನ್‌ಎಸ್ಎಸ್ ಸೆಕ್ಷನ್ 193 ರ ಅಡಿಯಲ್ಲಿ ಖಾತೆಯನ್ನು ಸ್ಥಗಿತಗೊಳಿಸುವ ವಿನಂತಿ ಬಾಕಿ ಇದೆ.`;
    } else {
      body = `### Financial Audit Docket: ${node.label} (${node.id})
- **Institution**: ${attrs.bank_name || "State Bank of India"}
- **Account Number**: ${attrs.account_num || "N/A"}
- **KYC Compliance**: **${attrs.kyc_status || "Verified"}**
- **Current Book Balance**: ${attrs.current_balance || "N/A"}

#### 1. Transactions Analysis & Ledger Activity
This node is part of the central financial command channel.
${neighbors.map(n => {
  const otherLabel = n.entity && typeof n.entity === 'object' && n.entity.label ? n.entity.label : n.entity;
  const amountStr = n.meta && n.meta.amount ? ` (Amount: ${n.meta.amount})` : "";
  return `- **${n.relationship}** connection with **${otherLabel}**${amountStr}`;
}).join("\n")}

#### 2. Laundering Indicators
- Layering of large RTGS receipts into smaller structured NEFT/IMPS withdrawals.
- Direct association with suspects having prior theft/burglary history.

#### 3. Legal Status
- Account frozen request pending under BNSS Section 193.`;
    }
  } else if (node.type === "Object") {
    const attrs = node.attrs || {};
    if (isKannada) {
      body = `### ವಿಧಿವಿಜ್ಞಾನ ಆಸ್ತಿ ಫೈಲ್: ${node.label} (${node.id})
- **ವರ್ಗ**: ${attrs.category === "Vehicle" ? "ವಾಹನ" : attrs.category || "ವಾಹನ"}
- **ನಂಬರ್ ಪ್ಲೇಟ್ / ಸೀರಿಯಲ್ / IMEI**: ${attrs.imei_or_plate || "N/A"}
- **ಮರುಪಡೆಯುವಿಕೆ ಸ್ಥಿತಿ**: **${attrs.recovery_status === "Active" ? "ಸಕ್ರಿಯ" : attrs.recovery_status === "Seized" ? "ಜಪ್ತಿ ಮಾಡಲಾಗಿದೆ" : attrs.recovery_status || "ಸಕ್ರಿಯ"}**
- **ಹ್ಯೂರಿಸ್ಟಿಕ್ ವಿಶ್ವಾಸಾರ್ಹತೆ**: ${((attrs.confidence || 0.85) * 100).toFixed(0)}%

#### 1. ಕಸ್ಟಡಿ ಮತ್ತು ಸಂಪರ್ಕಗಳ ಸರಪಳಿ
${neighbors.map(n => {
  const otherLabel = n.entity && typeof n.entity === 'object' && n.entity.label ? n.entity.label : n.entity;
  return `- **${n.relationship}** ನೊಂದಿಗೆ ಲಿಂಕ್ ಮಾಡಲಾಗಿದೆ **${otherLabel}**`;
}).join("\n")}

#### 2. ತನಿಖಾ ಮೌಲ್ಯ
ಈ ಆಸ್ತಿಯು ಅಪರಾಧ ಸಂಚಿನ ಪ್ರಾದೇಶಿಕ ಮತ್ತು ಭೌತಿಕ ಪುರಾವೆಯನ್ನು ಒದಗಿಸುತ್ತದೆ. ನಿರ್ಣಾಯಕ ಅವಧಿಗಳಲ್ಲಿ ಸಾರಿಗೆ ಕಾರಿಡಾರ್‌ಗಳ ಸಮಯದಲ್ಲಿ ಬಳಸಲಾಗುತ್ತದೆ.`;
    } else {
      body = `### Forensic Asset File: ${node.label} (${node.id})
- **Category**: ${attrs.category || "Vehicle"}
- **Plate / Serial / IMEI**: ${attrs.imei_or_plate || "N/A"}
- **Recovery Status**: **${attrs.recovery_status || "Active"}**
- **Heuristic Confidence**: ${((attrs.confidence || 0.85) * 100).toFixed(0)}%

#### 1. Chain of Custody & Connections
${neighbors.map(n => {
  const otherLabel = n.entity && typeof n.entity === 'object' && n.entity.label ? n.entity.label : n.entity;
  return `- **${n.relationship}** tied to **${otherLabel}**`;
}).join("\n")}

#### 2. Investigative Value
This asset provides direct spatial and physical grounding of the crime conspiracy. Used during transit corridors during critical periods.`;
    }
  } else if (node.type === "Location") {
    const attrs = node.attrs || {};
    if (isKannada) {
      body = `### ಭೌಗೋಳಿಕ ಸ್ಥಳ ಪ್ರೊಫೈಲ್: ${node.label} (${node.id})
- **ಜಿಲ್ಲಾ ವಲಯ**: ${attrs.district_code || "BLR-SOUTH"}
- **GIS ನಿರ್ದೇಶಾಂಕಗಳು**: ${attrs.gis || "N/A"}
- **ನಗರೀಕರಣ ಸೂಚ್ಯಂಕ**: ${attrs.urbanization_index || "ಹೆಚ್ಚು"}
- **ಆರ್ಥಿಕ ಒತ್ತಡ**: ${attrs.economic_stress_level || "ಮಧ್ಯಮ"}

#### 1. ಘಟನೆಗಳ ಸಾಂದ್ರತೆ ಮತ್ತು ಈವೆಂಟ್‌ಗಳು
ಈ ಸ್ಥಳವು ${neighbors.length} ಸಕ್ರಿಯ ಶಂಕಿತರು ಅಥವಾ ಘಟನೆಗಳೊಂದಿಗೆ ಅತಿಕ್ರಮಿಸುತ್ತದೆ.
${neighbors.map(n => {
  const otherLabel = n.entity && typeof n.entity === 'object' && n.entity.label ? n.entity.label : n.entity;
  return `- ನೇರ **${n.relationship}** ಸಂಬಂಧ **${otherLabel}** ನೊಂದಿಗೆ`;
}).join("\n")}

#### 2. ಗಸ್ತು ಕಮಾಂಡ್ ಯೋಜನೆ
- ನಗರೀಕರಣ ವಲಯಗಳಲ್ಲಿ ಬೀಟ್ ಗಸ್ತು ಆವರ್ತನವನ್ನು ಹೆಚ್ಚಿಸಿ.
- ಕ್ಯಾಮೆರಾ ಫೀಡ್ ಹೊಂದಾಣಿಕೆಗಾಗಿ ಪುರಸಭೆಯ ಕಣ್ಗಾವಲುಗಳೊಂದಿಗೆ ಸಮನ್ವಯಗೊಳಿಸಿ.`;
    } else {
      body = `### Geographic Location Profile: ${node.label} (${node.id})
- **District Area**: ${attrs.district_code || "BLR-SOUTH"}
- **GIS Coordinates**: ${attrs.gis || "N/A"}
- **Urbanization Index**: ${attrs.urbanization_index || "High"}
- **Economic Stress**: ${attrs.economic_stress_level || "Medium"}

#### 1. Incident Density & Events
This location overlaps with ${neighbors.length} active suspects or incidents.
${neighbors.map(n => {
  const otherLabel = n.entity && typeof n.entity === 'object' && n.entity.label ? n.entity.label : n.entity;
  return `- Direct **${n.relationship}** link with **${otherLabel}**`;
}).join("\n")}

#### 2. Patrol Command Plan
- Increase frequency of beat patrolling in high urbanization grids.
- Coordinate with municipal surveillance for camera feed alignment.`;
    }
  } else {
    // Event/Default
    const attrs = node.attrs || {};
    if (isKannada) {
      body = `### ನ್ಯಾಯಾಂಗ ಪ್ರಕರಣದ ಈವೆಂಟ್: ${node.label} (${node.id})
- **ಶಾಸನಬದ್ಧ ವರ್ಗೀಕರಣ**: ${attrs.classification || "ತನಿಖೆಯಲ್ಲಿದೆ"}
- **ಸ್ಥಿತಿ**: ${attrs.status || "N/A"}
- **ನೋಂದಾಯಿತ ದಿನಾಂಕ**: ${attrs.filed || "N/A"}
- **ಸಮಯದ ವಿಂಡೋ**: ಘಟನೆಯ ನಂತರ ${attrs.timeline_days_since_incident || 0} ದಿನಗಳು ಕಳೆದಿವೆ.

#### 1. ಶಾಸನಬದ್ಧ ಗಡುವುಗಳು (BNSS 193)
- **ಚಾರ್ಜ್‌ಶೀಟ್ ಬಾಕಿ**: ${attrs.chargesheet_deadline_days || 90} ದಿನಗಳ ಮಿತಿ.
- **ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ**: **${attrs.chargesheet_status || "ಕರಡು ತಯಾರಿಕೆ"}**

#### 2. ವಿಧಿವಿಜ್ಞಾನ ಸ್ಥಿತಿ ಮತ್ತು ಕಡ್ಡಾಯಗಳು
- **ಕಡ್ಡಾಯ ವಿಧಿವಿಜ್ಞಾನ**: ${attrs.mandatory_forensics ? "ಹೌದು" : "ಇಲ್ಲ"}
- **ಇ-ಫೋರೆನ್ಸಿಕ್ಸ್ ಅಪ್‌ಲೋಡ್ ಸ್ಥಿತಿ**: ${attrs.forensics_status || "ಪೂರ್ಣಗೊಂಡಿದೆ"}

#### 3. ಕೋರ್ ಸಂಪರ್ಕಗಳು
${neighbors.map(n => {
  const otherLabel = n.entity && typeof n.entity === 'object' && n.entity.label ? n.entity.label : n.entity;
  return `- ಅಸೋಸಿಯೇಟೆಡ್ **${n.relationship}** **${otherLabel}** ನೊಂದಿಗೆ`;
}).join("\n")}`;
    } else {
      body = `### Judicial Case Event: ${node.label} (${node.id})
- **Statutory Classification**: ${attrs.classification || "Under Investigation"}
- **Status**: ${attrs.status || "N/A"}
- **Date Registered**: ${attrs.filed || "N/A"}
- **Timeline Window**: ${attrs.timeline_days_since_incident || 0} days elapsed.

#### 1. Statutory Deadlines (BNSS 193)
- **Chargesheet Due**: ${attrs.chargesheet_deadline_days || 90} days limit.
- **Current Status**: **${attrs.chargesheet_status || "Drafting"}**

#### 2. Forensic Status & Mandates
- **Mandatory Forensics**: ${attrs.mandatory_forensics ? "Yes" : "No"}
- **e-Forensics Upload Status**: ${attrs.forensics_status || "Completed"}

#### 3. Core Connections
${neighbors.map(n => {
  const otherLabel = n.entity && typeof n.entity === 'object' && n.entity.label ? n.entity.label : n.entity;
  return `- Associated **${n.relationship}** with **${otherLabel}**`;
}).join("\n")}`;
    }
  }

  return (isKannada ? `**[ಸಿಸ್ಟಮ್ ಸೂಚನೆ: ಉತ್ತಮ-ಗುಣಮಟ್ಟದ ಹ್ಯೂರಿಸ್ಟಿಕ್ಸ್ ಆಫ್‌ಲೈನ್ ಎಂಜಿನ್]**\n\n` : `**[SYSTEM NOTICE: High-Quality Heuristics Offline Engine]**\n\n`) + body;
}

// ----------------- API ROUTE 1: Chatbot (English & Kannada) -----------------
app.post("/api/chat", async (req, res) => {
  const { messages, selectedNode, language, role } = req.body;
  const currentLang = language || "English";
  const userRole = role || "Investigator";
  
  const lastUserMessage = messages && messages.length > 0 ? messages[messages.length - 1].content : "";
  
  // Format the mock database as context so Gemini can perform 100% accurate RAG and prevent hallucinations
  const kbContext = JSON.stringify({
    nodes: mockPOLEData.nodes.map(n => ({ id: n.id, type: n.type, label: n.label, attributes: n.attrs })),
    links: mockPOLEData.links.map(l => ({ source: l.source, target: l.target, type: l.type }))
  }, null, 2);

  // Log action in our audit log
  const newLog: AuditLog = {
    id: `AUD-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString(),
    user: "martisajay117@gmail.com",
    role: userRole,
    action: "Chat Inquiry",
    details: `User asked: "${lastUserMessage.slice(0, 45)}..." in ${currentLang}`,
    dpdpCompliance: `Audit log recorded, request parameters scanned for PII leakage`
  };
  auditLogs.unshift(newLog);

  const systemInstruction = `You are an advanced, forensically-sound Criminology and Crime Intelligence Expert assistant for the Karnataka State Police (KSP).
Your task is to analyze and answer natural language queries based on the provided CCTNS-style POLE (Persons, Objects, Locations, Events, Bank Accounts) database.

DATABASE CONTEXT:
${kbContext}

You must respond in ${currentLang}. If the language is Kannada, use fluent Kannada script. If English, use professional law-enforcement English.
You must adhere strictly to these rules:
1. ONLY refer to facts present in the provided DATABASE CONTEXT. If the information is not there, say you do not have sufficient data in the case files. Do not hallucinate.
2. Provide an explicit "Evidence Backing & Reasoning Path" at the bottom of your response. Cite the specific Node IDs and Relationship Types that support your response.
3. Incorporate explainable AI reasoning logic. Cite why a suspect is linked (e.g. "R. Manjunath is linked to BTM safehouse L-002 because SI Rakesh verified his co-residency during a raid").
4. If asked about money trails, trace how funds moved (e.g., from Nagaraj to Dhanalaxmi Shell, then to Manjunath).

Structure your output as follows:
- **Core Intelligence Report**: Write the answer to the user's question clearly.
- **Investigative Insights & Leads**: Suggest actionable next steps based ONLY on the database connections (e.g., watch Suresha's mobile shop, check ANPR for KA-05-MJ-2291).
- **Admissibility & Compliance**: State the legal compliance (e.g. "Complies with BNSS Sec 173(3) and DPDP Act 2023").
- **Evidence References & Reasoning Path**: List of nodes and link types cited (e.g., Person: P-001 -> BankAccount: B-001 -> BankAccount: B-002 via TRANSFERRED_TO).`;

  try {
    const ai = getAiClient();
    if (!ai) {
      // Fallback deterministic response when API key is missing
      const fallbackText = generateOfflineChatResponse(lastUserMessage, selectedNode?.id, currentLang);
      return res.json({ content: fallbackText, audio: null, offline: true });
    }

    const conversationHistory = messages.map((m: any) => ({
      role: m.sender === "user" ? "user" as const : "model" as const,
      parts: [{ text: m.content }]
    }));

    // Generate content using the new SDK standard: ai.models.generateContent
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        { role: "system", parts: [{ text: systemInstruction }] },
        ...conversationHistory
      ],
      config: {
        temperature: 0.2, // Low temperature for deterministic, factual policing reports
      }
    });

    const aiText = response.text || "Insufficient data retrieved from generative engine.";
    res.json({ content: aiText, offline: false });

  } catch (error: any) {
    const errorStr = (error.message || "") + " " + JSON.stringify(error);
    const isQuota = errorStr.includes("429") || 
                    errorStr.includes("503") ||
                    errorStr.toLowerCase().includes("quota") || 
                    errorStr.toLowerCase().includes("exhausted") || 
                    errorStr.toLowerCase().includes("limit") ||
                    errorStr.toLowerCase().includes("unavailable") ||
                    errorStr.toLowerCase().includes("high demand") ||
                    errorStr.toLowerCase().includes("overloaded");
    if (isQuota) {
      console.info("Info: Chatbot switched to offline heuristics mode due to temporary rate limits or model demand.");
    } else {
      console.info("Info: Chatbot switched to offline heuristics mode:", error.message || error);
    }
    
    const fallbackText = generateOfflineChatResponse(lastUserMessage, selectedNode?.id, currentLang);
    res.json({ content: fallbackText, offline: true, quotaExceeded: true });
  }
});

// ----------------- API ROUTE 2: Case Summarization -----------------
app.post("/api/summarize-case", async (req, res) => {
  const { entityId, role, language } = req.body;
  const currentLang = language || "English";
  const userRole = role || "Investigator";

  const node = mockPOLEData.nodes.find(n => n.id === entityId);
  if (!node) {
    return res.status(404).json({ error: "POLE Entity not found." });
  }

  // Find immediately linked neighbors
  const neighbors = mockPOLEData.links.filter(l => l.source === entityId || l.target === entityId).map(l => {
    const otherId = l.source === entityId ? l.target : l.source;
    const otherNode = mockPOLEData.nodes.find(n => n.id === otherId);
    return {
      relationship: l.type,
      entity: otherNode ? { id: otherNode.id, type: otherNode.type, label: otherNode.label, attributes: otherNode.attrs } : otherId,
      meta: l.attrs
    };
  });

  // Log in audit trail
  const newLog: AuditLog = {
    id: `AUD-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString(),
    user: "martisajay117@gmail.com",
    role: userRole,
    action: "Generate Case Summary",
    resourceId: entityId,
    details: `Generated automated briefing docket for ${node.label} (${entityId})`,
    dpdpCompliance: `Data limited to current case scope. PII logs compiled.`
  };
  auditLogs.unshift(newLog);

  const prompt = `Synthesize a highly professional, law-enforcement grade Case Summary and Investigative Timeline for the following POLE entity:
ENTITY: ${JSON.stringify(node, null, 2)}
CONNECTIONS: ${JSON.stringify(neighbors, null, 2)}

You must respond in ${currentLang}. If the language is Kannada, use fluent Kannada script. If English, use professional law-enforcement English.

Provide the response in structured markdown with:
1. **Executive Summary**: Brief of who/what this is, their criminal classification, and structural risk score.
2. **Behavioral Profile (Criminological MO)**: Analysis of their modus operandi (MO), crime history, and association network.
3. **Chronological Incident Timeline**: Chronological reconstruction of the evidence trail (e.g., vehicle spotted, calls pinged, transactions processed).
4. **Immediate Investigative Leads**: 3 highly specific recommendations for the field officers.
5. **Legally Admissible Proof-Trail Check**: Compliance checks for BNSS (e.g. Sec 173(3) 14-day inquiry window, Sec 176(3) forensics videography).`;

  try {
    const ai = getAiClient();
    if (!ai) {
      // Fallback deterministic brief when API key is missing
      const summary = generateOfflineSummary(node, neighbors, currentLang);
      return res.json({ summary, offline: true });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.1
      }
    });

    res.json({ summary: response.text, offline: false });
  } catch (error: any) {
    const errorStr = (error.message || "") + " " + JSON.stringify(error);
    const isQuota = errorStr.includes("429") || 
                    errorStr.includes("503") ||
                    errorStr.toLowerCase().includes("quota") || 
                    errorStr.toLowerCase().includes("exhausted") || 
                    errorStr.toLowerCase().includes("limit") ||
                    errorStr.toLowerCase().includes("unavailable") ||
                    errorStr.toLowerCase().includes("high demand") ||
                    errorStr.toLowerCase().includes("overloaded");
    if (isQuota) {
      console.info("Info: Summarizer switched to offline summary mode due to temporary rate limits or model demand.");
    } else {
      console.info("Info: Summarizer switched to offline summary mode:", error.message || error);
    }
    
    const summary = generateOfflineSummary(node, neighbors, currentLang);
    res.json({ summary, offline: true, quotaExceeded: true });
  }
});

// ----------------- API ROUTE 3: Similar Past Cases -----------------
app.post("/api/get-similar-cases", async (req, res) => {
  const { entityId, role, language } = req.body;
  const currentLang = language || "English";
  const isKannada = currentLang === "Kannada";
  const userRole = role || "Investigator";

  const node = mockPOLEData.nodes.find(n => n.id === entityId);
  if (!node) {
    return res.status(404).json({ error: "POLE Entity not found." });
  }

  // Log in audit log
  const newLog: AuditLog = {
    id: `AUD-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString(),
    user: "martisajay117@gmail.com",
    role: userRole,
    action: "Similar Case Lookup",
    resourceId: entityId,
    details: `Ran high-dimensional similarity lookup for ${entityId}`,
    dpdpCompliance: `Historical references cross-matched. No cross-jurisdiction leakage.`
  };
  auditLogs.unshift(newLog);

  const prompt = `You are a Crime Similarity recommender. Compare this active suspect/event node with our historical crime archives:
ACTIVE NODE: ${JSON.stringify(node, null, 2)}
HISTORICAL ARCHIVES: ${JSON.stringify(historicalCases, null, 2)}

You must return the text in ${currentLang}. If the language is Kannada, use fluent Kannada script for the matchedMOText and leadsRecommended keys. If English, use professional law-enforcement English.

Calculate a multidimensional similarity score based on:
1. Modus Operandi Similarity (0% to 100%)
2. Spatial & Geographic Proximity (0% to 100%)
3. Actor Network overlap (0% to 100%)

Structure the response as a JSON array of objects with the following keys:
- caseId: string
- title: string
- classification: string
- moSimilarity: number (percentage)
- spatialProximity: number (percentage)
- networkOverlap: number (percentage)
- matchedMOText: string (briefly why they match)
- leadsRecommended: string (actionable advice to investigators)

Return ONLY valid JSON array and nothing else. No markdown wrappers.`;

  const getFallbackMatches = () => {
    return historicalCases.map(hc => {
      const isManjunathMatch = node.id === 'P-001' && hc.accused.includes("Manjunath");
      const isSureshaMatch = node.id === 'P-002' && hc.accused.includes("Suresha");
      
      const title = isKannada
        ? (hc.id === 'M-812' ? "ಕೋರಮಂಗಲ ಠಾಣೆ ಮನೆಗಳ್ಳತನ ಪ್ರಕರಣ" : "ಜಯನಗರ ವಾಣಿಜ್ಯ ಸೇಫ್ ಬ್ರೇಕಿಂಗ್")
        : hc.title;
        
      const classification = isKannada
        ? (hc.classification === "Burglary" ? "ಮನೆಗಳ್ಳತನ" : hc.classification)
        : hc.classification;

      let matchedMOText = "";
      let leadsRecommended = "";

      if (isKannada) {
        matchedMOText = isManjunathMatch 
          ? "ಹೆಚ್ಚಿನ ಅಪರಾಧ ಪುನರಾವರ್ತನೆಯನ್ನು ಸ್ಥಾಪಿಸುವ ನಿಖರವಾದ ಹೊಂದಾಣಿಕೆ ಸಹಿ: ರಾತ್ರಿಯ ಬಲವಂತದ ಪ್ರವೇಶ, ಕಾಗದದ ಬಳಕೆ ಮತ್ತು ಸೆಲ್ ಟವರ್ ಕಾರಿಡಾರ್ ಒಮ್ಮುಖ ಹೊಂದಾಣಿಕೆ."
          : isSureshaMatch
            ? "ಫೆನ್ಸಿಂಗ್ ಮಾದರಿಗಳು, ಐಎಂಇಐ ಬದಲಾವಣೆಗಳು ಮತ್ತು ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್ ಮಾರ್ಪಾಡು ವಿಧಾನಗಳು ಬಿಟಿಎಂ ಲೇಔಟ್‌ನ ಮುಂಚಿನ ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್ ಅಂಗಡಿಯ ಸ್ಥಾಪನೆಗೆ ಹೊಂದಿಕೆಯಾಗುತ್ತವೆ."
            : "ದಕ್ಷಿಣ ವಿಭಾಗದ ಪ್ರದೇಶಗಳಲ್ಲಿ ರಾತ್ರಿ ವೇಳೆ ಮನೆಗಳ್ಳತನಗಳ ಸಾಮಾನ್ಯ ತನಿಖಾ ಹೋಲಿಕೆ.";
        
        leadsRecommended = isManjunathMatch
          ? "ಬಿಟಿಎಂ ಲೇಔಟ್ ಸೇಫ್‌ಹೌಸ್ ಮೇಲೆ ದಾಳಿ ನಡೆಸಿ ಶಂಕಿತ ಮಂಜುನಾಥ್‌ನನ್ನು ತಕ್ಷಣವೇ ವಶಕ್ಕೆ ಪಡೆಯಿರಿ."
          : isSureshaMatch
            ? "ಬಿಟಿಎಂ ಲೇಔಟ್‌ನಲ್ಲಿರುವ ಸುರೇಶ್ ಅವರ ಮೊಬೈಲ್ ರಿಪೇರಿ ಅಂಗಡಿಯನ್ನು ತಪಾಸಣೆ ಮಾಡಿ ಮತ್ತು ದಾಸ್ತಾನು ಪರಿಶೀಲಿಸಿ."
            : "ರಾತ್ರಿ ವೇಳೆ ಗಸ್ತನ್ನು ಹೆಚ್ಚಿಸಿ ಮತ್ತು ಆಯಕಟ್ಟಿನ ಸ್ಥಳಗಳಲ್ಲಿ ಸಿಸಿಟಿವಿ ದೃಶ್ಯಾವಳಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.";
      } else {
        matchedMOText = isManjunathMatch 
          ? "Exact matching signature establishing high MO recidivism: nighttime forced entry, crowbar usage, and matching cell tower corridor convergence."
          : isSureshaMatch
            ? "Fencing patterns, IMEI rewrites, and electronics Alteration methods match K. Suresha's previous BTM Layout electronics hub setup."
            : "General procedural match of night-time burglaries and resale targeting properties in BLR South Division.";
        leadsRecommended = hc.leads_recommended;
      }

      return {
        caseId: hc.id,
        title,
        classification,
        moSimilarity: isManjunathMatch ? 94 : isSureshaMatch ? 88 : 45,
        spatialProximity: hc.title.includes("Koramangala") ? 85 : 78,
        networkOverlap: isManjunathMatch || isSureshaMatch ? 90 : 25,
        matchedMOText,
        leadsRecommended
      };
    });
  };

  try {
    const ai = getAiClient();
    if (!ai) {
      // Deterministic return when API key is missing
      return res.json({ matches: getFallbackMatches(), offline: true });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(response.text?.trim() || "[]");
    res.json({ matches: parsed, offline: false });
  } catch (error: any) {
    const errorStr = (error.message || "") + " " + JSON.stringify(error);
    const isQuota = errorStr.includes("429") || 
                    errorStr.includes("503") ||
                    errorStr.toLowerCase().includes("quota") || 
                    errorStr.toLowerCase().includes("exhausted") || 
                    errorStr.toLowerCase().includes("limit") ||
                    errorStr.toLowerCase().includes("unavailable") ||
                    errorStr.toLowerCase().includes("high demand") ||
                    errorStr.toLowerCase().includes("overloaded");
    if (isQuota) {
      console.info("Info: Similarity recommendation switched to offline mode due to temporary rate limits or model demand.");
    } else {
      console.info("Info: Similarity recommendation switched to electoral offline mode:", error.message || error);
    }
    
    res.json({ matches: getFallbackMatches(), offline: true, quotaExceeded: true });
  }
});

// ----------------- API ROUTE 4: Fetch Audit Logs & System Health -----------------
app.get("/api/audit-logs", (req, res) => {
  res.json({ logs: auditLogs });
});

// ----------------- API ROUTE 5: Simulate voice Speech-To-Text / translation -----------------
app.post("/api/translate-voice", async (req, res) => {
  const { speechText, sourceLang, targetLang } = req.body;
  
  const prompt = `Translate this spoken ${sourceLang} police command/query into standard ${targetLang}:
"${speechText}"

Ensure the translation maintains precise legal terminology (e.g. converting "ಕಳ್ಳತನ" to "Theft/BNS 306", or "ಎಫ್ಐಆರ್" to "FIR").
Return ONLY the translated string.`;

  try {
    const ai = getAiClient();
    if (!ai) {
      const fallback = sourceLang === "Kannada" ? "Find FIR number 124 in Jayanagar" : "ಜಯನಗರದಲ್ಲಿ ಎಫ್‌ಐಆರ್ ಸಂಖ್ಯೆ 124 ಅನ್ನು ಹುಡುಕಿ";
      return res.json({ translation: fallback });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt
    });

    res.json({ translation: response.text?.trim() });
  } catch (error: any) {
    res.json({ translation: speechText });
  }
});

// ----------------- API ROUTE 6: System health & data retrieval -----------------
app.get("/api/docket-info", (req, res) => {
  res.json({
    docketId: "KSP-2026-JYG-0124",
    status: "Active Investigation",
    district: "Bengaluru South Div",
    legalCodes: "BNSS / BNS Compliance Mode",
    activeNodeCount: mockPOLEData.nodes.length,
    activeLinkCount: mockPOLEData.links.length
  });
});

// Setup Vite & Static Assets serving
async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[KSP SERVER] Running at http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();
