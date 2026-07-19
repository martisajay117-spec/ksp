export interface Person {
  id: string;
  type: 'Person';
  label: string;
  attrs: {
    suspect_id: string;
    role: string;
    risk_score: number;
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
  source: string | any;
  target: string | any;
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

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  resourceId?: string;
  details: string;
  dpdpCompliance: string;
}

export interface ForecastAlert {
  id: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  area: string;
  crimeType: string;
  probability: string;
  justification: string;
  actionPlan: string;
}

export interface HistoricalCase {
  id: string;
  title: string;
  date: string;
  classification: string;
  modus_operandi: string;
  accused: string;
  investigation_timeline: string;
  leads_recommended: string;
  outcome: string;
}
