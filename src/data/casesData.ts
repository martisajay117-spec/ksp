export interface CaseData {
  id: string;
  docketId: string;
  title: string;
  status: string;
  district: string;
  crimeNo: string;
  caseNo: string;
  registeredDate: string;
  policeStation: string;
  investigatingOfficer: string;
  briefFacts: string;
  latitude: string;
  longitude: string;
  gravity: string;
  crimeMajorHead: string;
  crimeMinorHead: string;
  complainant: {
    id: string;
    name: string;
    age: number;
    occupation: string;
    religion: string;
    caste: string;
    gender: string;
  };
  victim: {
    id: string;
    name: string;
    age: number;
    gender: string;
    isPolice: string;
  };
  accused: Array<{
    id: string;
    name: string;
    age: number;
    gender: string;
    personId: string;
    suspectId?: string;
  }>;
  arrest: {
    id: string;
    date: string;
    type: string;
    district: string;
    station: string;
    court: string;
    isPrimary: string;
  };
  acts: Array<{
    act: string;
    section: string;
    description: string;
  }>;
}

export const casesData: Record<string, CaseData> = {
  jayanagar: {
    id: "jayanagar",
    docketId: "KSP-2026-JYG-0124",
    title: "Jayanagar & BTM Burglaries Series",
    status: "Active Investigation",
    district: "Bengaluru South Division",
    crimeNo: "104430006202600001",
    caseNo: "202600001",
    registeredDate: "2026-06-15",
    policeStation: "Jayanagar PS (Unit-1044)",
    investigatingOfficer: "Inspector K. Gowda (ID: EMP-9032)",
    briefFacts: "This docket relates to a series of high-end burglaries and housebreakings in the Jayanagar and BTM Layout sectors of Bengaluru South Division. The modus operandi involves scoping locked premium bungalows during twilight hours, breaking central entrance deadbolts using high-gauge customized iron bars, and bypassing residential CCTV lines by shorting street mains.",
    latitude: "12.9242",
    longitude: "77.5954",
    gravity: "Heinous (Offence Code 4)",
    crimeMajorHead: "Crimes Against Property",
    crimeMinorHead: "House Breaking & Theft by Night (HBT-N)",
    complainant: {
      id: "COMP-402",
      name: "Ananth Kumar Swamy",
      age: 46,
      occupation: "Software Architect",
      religion: "Hindu",
      caste: "General / Brahmin",
      gender: "Male"
    },
    victim: {
      id: "VIC-811",
      name: "Asha Devi Ramachandran",
      age: 38,
      gender: "Female",
      isPolice: "No"
    },
    accused: [
      {
        id: "ACC-091",
        name: "Manjunath @ Manja",
        age: 34,
        gender: "Male",
        personId: "A1 (Primary Accused)",
        suspectId: "P-001"
      },
      {
        id: "ACC-092",
        name: "Kiran @ Putta",
        age: 29,
        gender: "Male",
        personId: "A2 (Accomplice / Fence)",
        suspectId: "P-002"
      }
    ],
    arrest: {
      id: "ARR-5531",
      date: "2026-07-02",
      type: "Arrest under Warrant",
      district: "Bengaluru South",
      station: "Jayanagar PS",
      court: "6th ACMM Bengaluru",
      isPrimary: "Yes"
    },
    acts: [
      { act: "IPC (Indian Penal Code)", section: "Section 380", description: "Theft in dwelling house, etc." },
      { act: "IPC (Indian Penal Code)", section: "Section 457", description: "Lurking house-trespass or house-breaking by night" },
      { act: "IPC (Indian Penal Code)", section: "Section 411", description: "Dishonestly receiving stolen property" }
    ]
  },
  whitefield: {
    id: "whitefield",
    docketId: "KSP-2026-WFD-1200",
    title: "Whitefield Lookalike Phishing Campaign",
    status: "Archived / Charge-Sheeted",
    district: "Bengaluru East Division",
    crimeNo: "104430006202600045",
    caseNo: "202600045",
    registeredDate: "2026-04-10",
    policeStation: "Whitefield IT Corridor PS (Unit-1280)",
    investigatingOfficer: "Inspector Anita Das (ID: EMP-8812)",
    briefFacts: "Cyber intelligence case involving a distributed criminal syndicate operating lookalike bank portals and credential harvesting kits. Targets were primarily IT professionals based in Whitefield. Assets were immediately laundered through decentralized crypto mixers and layered mule bank accounts.",
    latitude: "12.9698",
    longitude: "77.7499",
    gravity: "Medium (Offence Code 2)",
    crimeMajorHead: "Cyber & Financial Crime",
    crimeMinorHead: "Phishing & Wire Transfer Fraud",
    complainant: {
      id: "COMP-112",
      name: "Sudhir Deshpande",
      age: 31,
      occupation: "Tech Lead",
      religion: "Hindu",
      caste: "General",
      gender: "Male"
    },
    victim: {
      id: "VIC-304",
      name: "Sudhir Deshpande",
      age: 31,
      gender: "Male",
      isPolice: "No"
    },
    accused: [
      {
        id: "ACC-502",
        name: "Siddharth @ Sid Mallik",
        age: 26,
        gender: "Male",
        personId: "A1 (Syndicate Admin)",
        suspectId: "P-005"
      }
    ],
    arrest: {
      id: "ARR-2190",
      date: "2026-05-11",
      type: "Arrest on Spot",
      district: "Bengaluru East",
      station: "Whitefield PS",
      court: "CBI Special Court",
      isPrimary: "Yes"
    },
    acts: [
      { act: "IT Act 2000", section: "Section 66D", description: "Punishment for cheating by personation by using computer resource" },
      { act: "IPC (Indian Penal Code)", section: "Section 420", description: "Cheating and dishonestly inducing delivery of property" }
    ]
  },
  seshadripuram: {
    id: "seshadripuram",
    docketId: "KSP-2026-SDR-4411",
    title: "Seshadripuram Hawala Jewelry Ledger",
    status: "Under Prosecution",
    district: "Bengaluru Central Division",
    crimeNo: "304430006202600112",
    caseNo: "202600112",
    registeredDate: "2026-05-18",
    policeStation: "Seshadripuram PS (Unit-3044)",
    investigatingOfficer: "ACP R. Prasanna (ID: EMP-7741)",
    briefFacts: "Structured financial audit targeting three high-volume jewelry storefronts in Seshadripuram suspected of masking illegal hawala channels. Hand-written ledgers seized during a surprise search revealed transaction matches coordinating cash-drops with active burglary gangs across Bengaluru South.",
    latitude: "12.9879",
    longitude: "77.5738",
    gravity: "Heinous (Offence Code 5)",
    crimeMajorHead: "Economic Offence",
    crimeMinorHead: "Money Laundering & Parallel Banking",
    complainant: {
      id: "COMP-901",
      name: "Enforcement Directorate Suo Moto",
      age: 50,
      occupation: "Government Service",
      religion: "N/A",
      caste: "N/A",
      gender: "Male"
    },
    victim: {
      id: "VIC-998",
      name: "State Treasury of Karnataka",
      age: 78,
      gender: "Male",
      isPolice: "Yes"
    },
    accused: [
      {
        id: "ACC-841",
        name: "Vijay Lalit Mehta",
        age: 58,
        gender: "Male",
        personId: "A1 (Funder / Jeweler)",
        suspectId: "P-003"
      }
    ],
    arrest: {
      id: "ARR-4491",
      date: "2026-06-02",
      type: "Surrender in Court",
      district: "Bengaluru Central",
      station: "Seshadripuram PS",
      court: "Special PMLA Court",
      isPrimary: "Yes"
    },
    acts: [
      { act: "PMLA 2002", section: "Section 3", description: "Offence of money-laundering" },
      { act: "PMLA 2002", section: "Section 4", description: "Punishment for money-laundering" }
    ]
  },
  drug_trafficking: {
    id: "drug_trafficking",
    docketId: "KSP-2026-SDN-2215",
    title: "Sadashivanagar NDPS Synthetics Seizure",
    status: "Active Investigation",
    district: "Bengaluru Central Division",
    crimeNo: "104430006202600215",
    caseNo: "202600215",
    registeredDate: "2026-07-01",
    policeStation: "Sadashivanagar PS (Unit-3012)",
    investigatingOfficer: "Inspector K. Prasanna (ID: EMP-9110)",
    briefFacts: "Narcotics control raid conducted at a private commercial lounge in Sadashivanagar. Seizure of commercial grade synthetic MDMA tablets and high-purity hashish. Trans-national supply chain routed through dark web markets and local high-volume courier services.",
    latitude: "13.0068",
    longitude: "77.5815",
    gravity: "Heinous (Offence Code 4)",
    crimeMajorHead: "Drug Trafficking & Narcotics",
    crimeMinorHead: "Possession & Sale of Commercial Quantities (NDPS Act)",
    complainant: {
      id: "COMP-221",
      name: "Officer S. Nagaraj",
      age: 44,
      occupation: "Police Sub-Inspector",
      religion: "Hindu",
      caste: "General",
      gender: "Male"
    },
    victim: {
      id: "VIC-215",
      name: "State of Karnataka (Represented by NCB)",
      age: 78,
      gender: "Male",
      isPolice: "Yes"
    },
    accused: [
      {
        id: "ACC-215a",
        name: "Rohan @ MDMA Roy",
        age: 24,
        gender: "Male",
        personId: "A1 (Distributor)",
        suspectId: "P-001"
      },
      {
        id: "ACC-215b",
        name: "Sarah D'Souza @ Queen",
        age: 27,
        gender: "Female",
        personId: "A2 (Courier Facilitator)",
        suspectId: "P-004"
      }
    ],
    arrest: {
      id: "ARR-2215",
      date: "2026-07-01",
      type: "Arrest on Spot",
      district: "Bengaluru Central",
      station: "Sadashivanagar PS",
      court: "NDPS Special Court, Bengaluru",
      isPrimary: "Yes"
    },
    acts: [
      { act: "NDPS Act 1985", section: "Section 22", description: "Punishment for contravention in relation to psychotropic substances" },
      { act: "NDPS Act 1985", section: "Section 29", description: "Punishment for abetment and criminal conspiracy" }
    ]
  },
  murder_heinous: {
    id: "murder_heinous",
    docketId: "KSP-2026-MLS-0088",
    title: "Malleshwaram Senior Citizen Homicide",
    status: "Active Investigation",
    district: "Bengaluru North Division",
    crimeNo: "104430006202600088",
    caseNo: "202600088",
    registeredDate: "2026-06-20",
    policeStation: "Malleshwaram PS (Unit-2021)",
    investigatingOfficer: "ACP S. Venkateshwar (ID: EMP-1011)",
    briefFacts: "Inside a residential apartment in Malleshwaram 15th Cross, an elderly widow was found murdered with sharp weapon wounds. Golden ornaments and locker keys were stolen. Suspect was identified through neighborhood retail store CCTV as a domestic help service provider who fled the state.",
    latitude: "12.9961",
    longitude: "77.5712",
    gravity: "Heinous (Offence Code 5)",
    crimeMajorHead: "Crimes Against Body",
    crimeMinorHead: "Murder for Gain (Section 302 IPC)",
    complainant: {
      id: "COMP-088",
      name: "Ramesh Kumar",
      age: 49,
      occupation: "Bank Manager (Son)",
      religion: "Hindu",
      caste: "General",
      gender: "Male"
    },
    victim: {
      id: "VIC-088",
      name: "Sharadamma Kumar",
      age: 74,
      gender: "Female",
      isPolice: "No"
    },
    accused: [
      {
        id: "ACC-088a",
        name: "Dipak Mandal @ Sahu",
        age: 31,
        gender: "Male",
        personId: "A1 (Fleeing Suspect)",
        suspectId: "P-002"
      }
    ],
    arrest: {
      id: "ARR-0088",
      date: "2026-07-05",
      type: "Arrest under Transit Warrant",
      district: "Bengaluru North",
      station: "Malleshwaram PS",
      court: "Fast Track Court-I, Bengaluru",
      isPrimary: "Yes"
    },
    acts: [
      { act: "IPC (Indian Penal Code)", section: "Section 302", description: "Punishment for Murder" },
      { act: "IPC (Indian Penal Code)", section: "Section 397", description: "Robbery or dacoity, with attempt to cause death or grievous hurt" }
    ]
  },
  land_grabbing: {
    id: "land_grabbing",
    docketId: "KSP-2026-KRM-0304",
    title: "Koramangala Real Estate Document Forgery",
    status: "Under Prosecution",
    district: "Bengaluru South-East Division",
    crimeNo: "104430006202600304",
    caseNo: "202600304",
    registeredDate: "2026-05-10",
    policeStation: "Koramangala PS (Unit-5011)",
    investigatingOfficer: "Inspector Shalini Hegde (ID: EMP-9051)",
    briefFacts: "Highly structured forgery ring specializing in creating fabricated mother-deeds and old partition deeds for prime vacant plots in Koramangala 4th Block. The ring manipulated the Sub-Registrar CCTNS log offline using cloned staff biometric credentials.",
    latitude: "12.9352",
    longitude: "77.6244",
    gravity: "Heinous (Offence Code 4)",
    crimeMajorHead: "White Collar Document Forgery & Land Grabbing",
    crimeMinorHead: "Forgery of Valuable Security (Sec 467 IPC)",
    complainant: {
      id: "COMP-304",
      name: "Dr. Elizabeth D'Souza",
      age: 63,
      occupation: "Retired Neurosurgeon (Living Abroad)",
      religion: "Christian",
      caste: "General",
      gender: "Female"
    },
    victim: {
      id: "VIC-304p",
      name: "Dr. Elizabeth D'Souza",
      age: 63,
      gender: "Female",
      isPolice: "No"
    },
    accused: [
      {
        id: "ACC-304a",
        name: "G. Venkatesh @ Gowda",
        age: 52,
        gender: "Male",
        personId: "A1 (Syndicate Leader)",
        suspectId: "P-003"
      },
      {
        id: "ACC-304b",
        name: "K. Sridhar @ Sub-Registrar Clerk",
        age: 45,
        gender: "Male",
        personId: "A2 (Insider Facilitator)",
        suspectId: "P-005"
      }
    ],
    arrest: {
      id: "ARR-0304",
      date: "2026-05-28",
      type: "Arrest under Warrant",
      district: "Bengaluru South-East",
      station: "Koramangala PS",
      court: "Principal City Civil Court, Bengaluru",
      isPrimary: "No"
    },
    acts: [
      { act: "IPC (Indian Penal Code)", section: "Section 467", description: "Forgery of valuable security, will, etc." },
      { act: "IPC (Indian Penal Code)", section: "Section 468", description: "Forgery for purpose of cheating" },
      { act: "IPC (Indian Penal Code)", section: "Section 471", description: "Using as genuine a forged document" }
    ]
  },
  vehicle_lifting: {
    id: "vehicle_lifting",
    docketId: "KSP-2026-IND-0192",
    title: "Indiranagar Premium Automobile Lifting Ring",
    status: "Active Investigation",
    district: "Bengaluru East Division",
    crimeNo: "104430006202600192",
    caseNo: "202600192",
    registeredDate: "2026-06-25",
    policeStation: "Indiranagar PS (Unit-4022)",
    investigatingOfficer: "Inspector S. Alva (ID: EMP-1124)",
    briefFacts: "Investigation into a series of premium SUV thefts in Indiranagar and Koramangala. The gang utilizes electronic CAN-bus injectors imported from international forums to duplicate key fobs and disable engine immobilizers in under 90 seconds. Vehicles are driven through border checkpoints using cloned license plates.",
    latitude: "12.9718",
    longitude: "77.6411",
    gravity: "Heinous (Offence Code 4)",
    crimeMajorHead: "Organised Property Crime",
    crimeMinorHead: "Motor Vehicle Theft using CAN-Bus Injectors",
    complainant: {
      id: "COMP-192",
      name: "Vikram Aditya Sen",
      age: 41,
      occupation: "Business Director",
      religion: "Hindu",
      caste: "General",
      gender: "Male"
    },
    victim: {
      id: "VIC-192",
      name: "Vikram Aditya Sen",
      age: 41,
      gender: "Male",
      isPolice: "No"
    },
    accused: [
      {
        id: "ACC-192a",
        name: "Wasim @ Turbo Wasim",
        age: 28,
        gender: "Male",
        personId: "A1 (Master Lifter)",
        suspectId: "P-001"
      },
      {
        id: "ACC-192b",
        name: "Jagdish @ Jaggu",
        age: 33,
        gender: "Male",
        personId: "A2 (Chassis Stamper)",
        suspectId: "P-002"
      }
    ],
    arrest: {
      id: "ARR-0192",
      date: "2026-07-09",
      type: "Arrest under Warrant",
      district: "Bengaluru East",
      station: "Indiranagar PS",
      court: "4th ACMM Bengaluru",
      isPrimary: "Yes"
    },
    acts: [
      { act: "IPC (Indian Penal Code)", section: "Section 379", description: "Punishment for Theft" },
      { act: "IPC (Indian Penal Code)", section: "Section 413", description: "Habitually dealing in stolen property" }
    ]
  }
};
