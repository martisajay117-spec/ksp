export interface Person {
  id: string;
  type: 'Person';
  label: string;
  attrs: {
    suspect_id: string;
    role: string;
    risk_score: number; // 0 to 1
    dob: string;
    age: number;
    gender: 'Male' | 'Female';
    background: string;
    education: string;
    mo_signature: string;
    known_gang_affiliation?: string;
  };
}

export interface ObjEntity {
  id: string;
  type: 'Object';
  label: string;
  attrs: {
    object_id: string;
    imei_or_plate: string;
    category: 'Vehicle' | 'Mobile Device' | 'Weapon';
    confidence: number;
    owner_id?: string;
    recovery_status?: string;
  };
}

export interface LocEntity {
  id: string;
  type: 'Location';
  label: string;
  attrs: {
    location_id: string;
    district_code: string;
    gis: string;
    urbanization_index: 'High' | 'Medium' | 'Low';
    economic_stress_level: 'High' | 'Medium' | 'Low';
    unemployment_rate: string;
  };
}

export interface EventEntity {
  id: string;
  type: 'Event';
  label: string;
  attrs: {
    event_id: string;
    classification: string;
    status: string;
    filed: string;
    timeline_days_since_incident: number;
    bns_sections: string[];
    mandatory_forensics: boolean;
    forensics_status: string;
    chargesheet_deadline_days: number;
    chargesheet_status: string;
  };
}

export interface BankAccountEntity {
  id: string;
  type: 'BankAccount';
  label: string;
  attrs: {
    account_num: string;
    kyc_status: 'Verified' | 'Flagged' | 'Suspended';
    owner: string;
    bank_name: string;
    current_balance: string;
  };
}

export type POLEEntity = Person | ObjEntity | LocEntity | EventEntity | BankAccountEntity;

export interface POLELink {
  source: string;
  target: string;
  type: string;
  attrs: {
    since?: string;
    confidence?: number;
    amount?: string;
    channel?: string;
    timestamp?: string;
    verified_by_officer?: string;
    capture_source?: string;
    distance_to_scene?: string;
    investigation_outcome?: string;
    officer_id?: string;
  };
}

// Full mock database of cases, suspects, and statistics
export const mockPOLEData = {
  nodes: [
    // --- Persons ---
    {
      id: 'P-001',
      type: 'Person',
      label: 'R. Manjunath',
      attrs: {
        suspect_id: 'SUS-4471',
        role: 'Prime Accused',
        risk_score: 0.87,
        dob: '1989-04-12',
        age: 35,
        gender: 'Male',
        background: 'Low income, migrant worker from Chitradurga. Resides in temporary quarters.',
        education: 'Secondary School (Grade 10)',
        mo_signature: 'Night-time residential break-ins targeting lockers/safes. Uses a crowbar, disables CCTV.',
        known_gang_affiliation: 'Devarajpura Gang (Local theft ring)'
      }
    },
    {
      id: 'P-002',
      type: 'Person',
      label: 'K. Suresha',
      attrs: {
        suspect_id: 'SUS-4488',
        role: 'Associate / Receiver',
        risk_score: 0.62,
        dob: '1993-09-02',
        age: 31,
        gender: 'Male',
        background: 'Middle income, owns a pre-owned mobile repair shop in BTM Layout.',
        education: 'Diploma in Electronics',
        mo_signature: 'Fences stolen goods, rewrites mobile IMEIs, sells metals through cash channels.',
        known_gang_affiliation: 'Devarajpura Gang'
      }
    },
    {
      id: 'P-003',
      type: 'Person',
      label: 'A. Farooq',
      attrs: {
        suspect_id: 'SUS-4502',
        role: 'Getaway Driver',
        risk_score: 0.58,
        dob: '1985-01-30',
        age: 39,
        gender: 'Male',
        background: 'Low-middle income. Freelance commercial driver, resident of Tilaknagar.',
        education: 'Primary School (Grade 5)',
        mo_signature: 'Provides logistics and getaway vehicles (rental or stolen plates). Familiar with narrow routes.',
        known_gang_affiliation: 'Devarajpura Gang'
      }
    },
    {
      id: 'P-004',
      type: 'Person',
      label: 'B. Nagaraj',
      attrs: {
        suspect_id: 'SUS-4519',
        role: 'Financier',
        risk_score: 0.71,
        dob: '1979-11-18',
        age: 45,
        gender: 'Male',
        background: 'High income, real estate broker. Suspected money launderer for multiple gangs.',
        education: 'Bachelor of Commerce',
        mo_signature: 'Funneling theft and extortion proceeds into real estate and shell companies.',
        known_gang_affiliation: 'Commercial Street Syndicate'
      }
    },
    {
      id: 'P-005',
      type: 'Person',
      label: 'S. Priya',
      attrs: {
        suspect_id: 'VIC-1102',
        role: 'Victim / Complainant',
        risk_score: 0.1,
        dob: '1991-06-05',
        age: 33,
        gender: 'Female',
        background: 'IT Consultant in Jayanagar 4th Block.',
        education: 'Master of Tech (M.Tech)',
        mo_signature: 'N/A'
      }
    },
    {
      id: 'P-006',
      type: 'Person',
      label: 'D. Ravi Kumar',
      attrs: {
        suspect_id: 'SUS-4530',
        role: 'Peripheral Cash Mule',
        risk_score: 0.21,
        dob: '1997-02-14',
        age: 27,
        gender: 'Male',
        background: 'Unemployed youth, migrant from Kalaburagi. Works odd jobs in Silk Board.',
        education: 'Uneducated',
        mo_signature: 'Withdraws/transfers small cash increments through digital wallets.',
        known_gang_affiliation: 'None'
      }
    },

    // --- Objects ---
    {
      id: 'O-001',
      type: 'Object',
      label: 'Maruti Swift KA-05-MJ-2291',
      attrs: {
        object_id: 'OBJ-771',
        imei_or_plate: 'KA-05-MJ-2291',
        category: 'Vehicle',
        confidence: 0.94,
        owner_id: 'A. Farooq',
        recovery_status: 'Seized'
      }
    },
    {
      id: 'O-002',
      type: 'Object',
      label: 'Motorola Handset G54',
      attrs: {
        object_id: 'OBJ-772',
        imei_or_plate: 'IMEI-356889124471',
        category: 'Mobile Device',
        confidence: 0.88,
        owner_id: 'R. Manjunath',
        recovery_status: 'Active'
      }
    },
    {
      id: 'O-003',
      type: 'Object',
      label: 'Country-made Pistol',
      attrs: {
        object_id: 'OBJ-773',
        imei_or_plate: 'N/A',
        category: 'Weapon',
        confidence: 0.99,
        recovery_status: 'Recovered'
      }
    },
    {
      id: 'O-004',
      type: 'Object',
      label: 'Royal Enfield KA-05-BX-4410',
      attrs: {
        object_id: 'OBJ-774',
        imei_or_plate: 'KA-05-BX-4410',
        category: 'Vehicle',
        confidence: 0.81,
        owner_id: 'K. Suresha',
        recovery_status: 'Active'
      }
    },

    // --- Locations ---
    {
      id: 'L-001',
      type: 'Location',
      label: 'Jayanagar 4th Block',
      attrs: {
        location_id: 'LOC-091',
        district_code: 'BLR-SOUTH',
        gis: '12.9250 N, 77.5938 E',
        urbanization_index: 'High',
        economic_stress_level: 'Low',
        unemployment_rate: '4.2%'
      }
    },
    {
      id: 'L-002',
      type: 'Location',
      label: 'BTM Layout safehouse',
      attrs: {
        location_id: 'LOC-092',
        district_code: 'BLR-SOUTH',
        gis: '12.9166 N, 77.6101 E',
        urbanization_index: 'High',
        economic_stress_level: 'Medium',
        unemployment_rate: '8.5%'
      }
    },
    {
      id: 'L-003',
      type: 'Location',
      label: 'Electronic City Cell Tower 18',
      attrs: {
        location_id: 'LOC-093',
        district_code: 'BLR-EAST',
        gis: '12.8452 N, 77.6602 E',
        urbanization_index: 'High',
        economic_stress_level: 'Low',
        unemployment_rate: '3.1%'
      }
    },
    {
      id: 'L-004',
      type: 'Location',
      label: 'Silk Board Junction',
      attrs: {
        location_id: 'LOC-094',
        district_code: 'BLR-SOUTH',
        gis: '12.9172 N, 77.6228 E',
        urbanization_index: 'High',
        economic_stress_level: 'Medium',
        unemployment_rate: '9.8%'
      }
    },

    // --- Events ---
    {
      id: 'E-001',
      type: 'Event',
      label: 'FIR 124/2026 — Jayanagar PS',
      attrs: {
        event_id: 'FIR-124-26',
        classification: 'Housebreaking and Theft',
        status: 'Under Investigation',
        filed: '2026-07-05',
        timeline_days_since_incident: 14,
        bns_sections: ['BNS 305 (Housebreaking)', 'BNS 306 (Theft)'],
        mandatory_forensics: true,
        forensics_status: 'Completed (Fingerprints matched & logged)',
        chargesheet_deadline_days: 90,
        chargesheet_status: 'Drafting (76 days remaining under BNSS 193)'
      }
    },
    {
      id: 'E-002',
      type: 'Event',
      label: 'FIR 131/2026 — Jayanagar PS',
      attrs: {
        event_id: 'FIR-131-26',
        classification: 'Criminal Conspiracy & Arms Act',
        status: 'Under Investigation',
        filed: '2026-07-12',
        timeline_days_since_incident: 7,
        bns_sections: ['BNS 61 (Conspiracy)', 'Arms Act Sec 25'],
        mandatory_forensics: true,
        forensics_status: 'Completed (Ballistics uploaded)',
        chargesheet_deadline_days: 60,
        chargesheet_status: 'Pending legal opinion from e-Prosecution'
      }
    },
    {
      id: 'E-003',
      type: 'Event',
      label: 'Vehicle Recovery & Seizure Memo',
      attrs: {
        event_id: 'EVT-3391',
        classification: 'Seizure Memo (BNS 185)',
        status: 'Closed',
        filed: '2026-07-08',
        timeline_days_since_incident: 11,
        bns_sections: ['BNS 185 (Property Seizure)'],
        mandatory_forensics: false,
        forensics_status: 'Not Required',
        chargesheet_deadline_days: 30,
        chargesheet_status: 'Filed in Court (Seizure report)'
      }
    },

    // --- Bank Accounts ---
    {
      id: 'B-001',
      type: 'BankAccount',
      label: 'Canara A/C ***4471',
      attrs: {
        account_num: 'XXXXXX4471',
        kyc_status: 'Verified',
        owner: 'R. Manjunath',
        bank_name: 'Canara Bank (Jayanagar)',
        current_balance: '₹12,450'
      }
    },
    {
      id: 'B-002',
      type: 'BankAccount',
      label: 'SBI A/C ***9902 (Dhanalaxmi Shell)',
      attrs: {
        account_num: 'XXXXXX9902',
        kyc_status: 'Flagged',
        owner: 'Dhanalaxmi Enterprises (Shell)',
        bank_name: 'State Bank of India (BTM Layout)',
        current_balance: '₹8,92,400'
      }
    },
    {
      id: 'B-003',
      type: 'BankAccount',
      label: 'HDFC A/C ***1187',
      attrs: {
        account_num: 'XXXXXX1187',
        kyc_status: 'Verified',
        owner: 'B. Nagaraj',
        bank_name: 'HDFC Bank (Richmond Road)',
        current_balance: '₹42,50,000'
      }
    }
  ] as POLEEntity[],

  links: [
    // Co-offending & Associates
    { source: 'P-001', target: 'P-002', type: 'ASSOCIATES_WITH', attrs: { since: '2024', confidence: 0.90, verified_by_officer: 'SI Rakesh' } },
    { source: 'P-001', target: 'P-003', type: 'ASSOCIATES_WITH', attrs: { since: '2024', confidence: 0.83, verified_by_officer: 'SI Rakesh' } },
    { source: 'P-002', target: 'P-003', type: 'ASSOCIATES_WITH', attrs: { since: '2025', confidence: 0.77, verified_by_officer: 'SI Rakesh' } },
    { source: 'P-001', target: 'P-004', type: 'ASSOCIATES_WITH', attrs: { since: '2023', confidence: 0.68, verified_by_officer: 'CI Divya' } },
    { source: 'P-004', target: 'P-006', type: 'ASSOCIATES_WITH', attrs: { since: '2025', confidence: 0.40, verified_by_officer: 'SI Rakesh' } },
    { source: 'P-003', target: 'P-006', type: 'ASSOCIATES_WITH', attrs: { since: '2026', confidence: 0.35, verified_by_officer: 'Unverified' } },
    { source: 'P-005', target: 'P-001', type: 'VICTIM_OF', attrs: { timestamp: '2026-07-04' } },

    // Lives At
    { source: 'P-001', target: 'L-002', type: 'LIVES_AT', attrs: { verified_by_officer: 'SI Rakesh (BTM safehouse raid)' } },
    { source: 'P-002', target: 'L-002', type: 'LIVES_AT', attrs: { verified_by_officer: 'SI Rakesh' } },
    { source: 'P-004', target: 'L-004', type: 'LIVES_AT', attrs: { verified_by_officer: 'Unverified' } },

    // Operates / Owns Vehicle & Mobile
    { source: 'P-001', target: 'O-001', type: 'OPERATES_VEHICLE', attrs: { capture_source: 'ANPR Camera BLR-S021', confidence_level: 0.94 } as any },
    { source: 'P-003', target: 'O-001', type: 'OPERATES_VEHICLE', attrs: { capture_source: 'ANPR Camera BLR-S021', confidence_level: 0.88 } as any },
    { source: 'P-002', target: 'O-004', type: 'OPERATES_VEHICLE', attrs: { capture_source: 'Witness statement' } as any },
    { source: 'P-001', target: 'O-002', type: 'OWNS', attrs: { capture_source: 'CDR Match' } },
    { source: 'P-003', target: 'O-003', type: 'OWNS', attrs: { capture_source: 'Seizure memo' } },

    // Spotted Near Locations
    { source: 'O-001', target: 'L-001', type: 'SPOTTED_NEAR', attrs: { timestamp: '2026-07-04 23:41', capture_source: 'ANPR' } },
    { source: 'O-002', target: 'L-003', type: 'SPOTTED_NEAR', attrs: { timestamp: '2026-07-04 23:38', capture_source: 'Cell Tower Ping' } },
    { source: 'O-004', target: 'L-004', type: 'SPOTTED_NEAR', attrs: { timestamp: '2026-07-05 00:05', capture_source: 'ANPR' } },

    // Event connections
    { source: 'E-001', target: 'L-001', type: 'OCCURRED_AT', attrs: { distance_to_scene: '0 meters' } },
    { source: 'E-002', target: 'L-001', type: 'OCCURRED_AT', attrs: { distance_to_scene: '40 meters' } },
    { source: 'E-003', target: 'L-004', type: 'OCCURRED_AT', attrs: { distance_to_scene: '0 meters' } },

    { source: 'P-001', target: 'E-001', type: 'PARTY_TO', attrs: { officer_id: 'SI Rakesh', investigation_outcome: 'Primary Burglary Suspect' } },
    { source: 'P-002', target: 'E-001', type: 'PARTY_TO', attrs: { officer_id: 'SI Rakesh', investigation_outcome: 'Receiver of Stolen Jewelry' } },
    { source: 'P-005', target: 'E-001', type: 'WITNESSED', attrs: { officer_id: 'SI Rakesh' } },
    { source: 'P-003', target: 'E-002', type: 'PARTY_TO', attrs: { officer_id: 'CI Divya', investigation_outcome: 'Possession of Illegal Firearm' } },
    { source: 'P-006', target: 'E-002', type: 'WITNESSED', attrs: { officer_id: 'CI Divya' } },
    { source: 'O-001', target: 'E-003', type: 'USED_IN', attrs: { investigation_outcome: 'Getaway Car Impounded' } },

    // Financial money trails
    { source: 'P-001', target: 'B-001', type: 'HELD_BY', attrs: { kyc_status: 'Verified' } },
    { source: 'P-004', target: 'B-003', type: 'HELD_BY', attrs: { kyc_status: 'Verified' } },
    { source: 'P-004', target: 'B-002', type: 'HELD_BY', attrs: { kyc_status: 'Flagged' } },
    { source: 'P-006', target: 'B-002', type: 'HELD_BY', attrs: { kyc_status: 'Flagged' } },
    { source: 'B-003', target: 'B-002', type: 'TRANSFERRED_TO', attrs: { amount: '₹4,80,000', channel: 'RTGS', timestamp: '2026-06-28' } },
    { source: 'B-002', target: 'B-001', type: 'TRANSFERRED_TO', attrs: { amount: '₹1,50,000', channel: 'NEFT', timestamp: '2026-07-06' } },
    { source: 'B-001', target: 'B-003', type: 'TRANSFERRED_TO', attrs: { amount: '₹20,000', channel: 'IMPS', timestamp: '2026-07-07' } }
  ] as POLELink[]
};

// Past Cases for Similarity Matching
export const historicalCases = [
  {
    id: 'HIST-FIR-812-24',
    title: 'FIR 812/2024 — Koramangala PS',
    date: '2024-11-15',
    classification: 'Housebreaking & Theft (BNS 305)',
    modus_operandi: 'Night burglary between 2 AM and 4 AM. Locked houses targeted, back grill bent using a crowbar, jewelry and digital items stolen. CCTV cables cut, high spatial proximity to transit hubs.',
    accused: 'R. Manjunath (arrested, released on bail)',
    investigation_timeline: 'FIR registered Day 1 -> Forensics matched footprints on Day 3 -> Suspect vehicle tracked on ANPR on Day 5 -> Accused arrested with crowbar on Day 7 -> Chargesheet filed on Day 58.',
    leads_recommended: 'Check nearby ANPR logs for grey Maruti hatchback, verify local scrap metal and pawn dealers near Jayanagar/BTM.',
    outcome: 'Jewelry recovered, accused pled guilty, currently on parole.'
  },
  {
    id: 'HIST-FIR-432-25',
    title: 'FIR 432/2025 — BTM Layout PS',
    date: '2025-04-20',
    classification: 'Theft & Disposal of stolen property (BNS 306)',
    modus_operandi: 'Serial smartphone snatching and fencing. Stolen items transported to mobile repair shops in BTM Layout, where IMEI rewrite tools are used before shipping metals out of state.',
    accused: 'K. Suresha (convicted)',
    investigation_timeline: 'FIR Day 1 -> CDR shows cell tower convergence -> Shop searched on Day 12 -> 45 altered handsets seized -> Convicted under BNS 317.',
    leads_recommended: 'Verify IMEI registers, cross-check shop receipts with gold smelting shops in Commercial Street.',
    outcome: 'Sentenced to 18 months, released on good behavior.'
  }
];

// Sociological Crime Statistics for the Charts
export const sociologicalStats = {
  ageDistribution: [
    { range: '18-25', percentage: 22, count: 48 },
    { range: '26-35', percentage: 45, count: 98 },
    { range: '36-45', percentage: 21, count: 46 },
    { range: '46-60', percentage: 9, count: 20 },
    { range: '60+', percentage: 3, count: 6 }
  ],
  genderRatio: [
    { gender: 'Male', percentage: 91, count: 198 },
    { gender: 'Female', percentage: 9, count: 20 }
  ],
  socioEconomicBackground: [
    { status: 'Low Income / Daily Wages', percentage: 58, count: 126 },
    { status: 'Lower Middle Class', percentage: 28, count: 61 },
    { status: 'Upper Middle Class', percentage: 11, count: 24 },
    { status: 'Affluent / Business Elite', percentage: 3, count: 7 }
  ],
  correlationStats: [
    { metric: 'Urbanization Rate', correlationScore: 0.78, impact: 'High (Triggers property crimes & transit bottlenecks)' },
    { metric: 'Youth Unemployment', correlationScore: 0.84, impact: 'Very High (Strong link to gang recruitment)' },
    { metric: 'School Drop-out Rate', correlationScore: 0.69, impact: 'High (Correlates with early juvenile delinquency)' },
    { metric: 'Digital Wallet Penetration', correlationScore: 0.72, impact: 'High (Linked to rise in cyber-extortion & money mules)' }
  ],
  crimeTrends: [
    { month: 'Jan', burglary: 45, robbery: 12, financial_fraud: 28, cyber_crime: 35 },
    { month: 'Feb', burglary: 38, robbery: 15, financial_fraud: 32, cyber_crime: 42 },
    { month: 'Mar', burglary: 52, robbery: 10, financial_fraud: 41, cyber_crime: 50 },
    { month: 'Apr', burglary: 60, robbery: 18, financial_fraud: 45, cyber_crime: 55 },
    { month: 'May', burglary: 48, robbery: 22, financial_fraud: 39, cyber_crime: 49 },
    { month: 'Jun', burglary: 65, robbery: 25, financial_fraud: 52, cyber_crime: 62 },
    { month: 'Jul', burglary: 72, robbery: 30, financial_fraud: 60, cyber_crime: 70 } // Current month
  ],
  seasonalFactors: [
    { season: 'Monsoon Spike (Jun-Aug)', factor: 'Heavy rain isolates houses, noise masks break-ins', change: '+32% Burglaries' },
    { season: 'Festival Season (Oct-Dec)', factor: 'Families travel, vacant homes targeted', change: '+45% Burglaries' },
    { season: 'Academic Start (May-Jul)', factor: 'High student migrations, room-sharing mobile theft spikes', change: '+20% Thefts' }
  ]
};

// Forecasting Alerts & Early Warnings
export const forecastingAlerts = [
  {
    id: 'ALR-2026-001',
    severity: 'Critical',
    area: 'Jayanagar Sector 4',
    crimeType: 'Organized Housebreaking (BNS 305)',
    probability: '88%',
    justification: 'ANPR detected repeat suspect vehicle Maruti Swift (KA-05-MJ-2291) entering Jayanagar 3 times between 1 AM and 3 AM. Cell tower logs indicate suspect device active in immediate proximity. 12-day seasonal window matches peak historic monsoon burglaries.',
    actionPlan: 'Deploy night patrolling beat vehicle to Sector 4 residential sector, establish checkpoints at Jayanagar 4th Block exit roads.'
  },
  {
    id: 'ALR-2026-002',
    severity: 'Medium',
    area: 'BTM Layout 2nd Stage',
    crimeType: 'IMEI Smuggling / Digital Fence',
    probability: '65%',
    justification: 'High density of flag transactions (SBI A/C ***9902) to multiple suspicious accounts. Modus Operandi matches historical fences disposing of digital devices within 7 days of Jayanagar incidents.',
    actionPlan: 'Verify local mobile repair registers in BTM Layout. Send plainclothes officers to monitor Suresha\'s workshop.'
  },
  {
    id: 'ALR-2026-003',
    severity: 'High',
    area: 'Silk Board Ingress',
    crimeType: 'Illegal Firearm Transit',
    probability: '74%',
    justification: 'Dhanalaxmi Enterprises cash flows tracked to vehicle rent accounts used by Farooq. Incident timeline points to active procurement of country-made weapons ahead of planned heist.',
    actionPlan: 'Set up intensive vehicle checks (ANPR-triggered) at Silk Board flyover exit.'
  }
];
