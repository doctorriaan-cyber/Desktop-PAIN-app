export interface Patient {
  name: string;
  telephone: string;
  dob: string;
  email: string;
  idNumber: string;
  age: string;
  medicalAidName: string;
  medicalAidNumber: string;
  dependantNumber: string;
  gender: string;
  authNumber: string;
  icd10Codes: string;
  procedureCodes: string;
  procedureSummary: string;
  // New editable fields
  weight?: string;
  height?: string;
  inTime?: string;
  outTime?: string;
  tci?: string;
  ketamine?: string;
  sedationType?: 'Deep' | 'Awake';
  caution?: boolean;
  penicillinAllergy?: boolean;
  previouslyDone?: boolean;
  notes?: string[];
}

export interface TheaterListInfo {
  doctorName: string;
  hospitalLocation: string;
  date: string;
}

export interface TheaterList {
  id: number;
  info: TheaterListInfo;
  patients: Patient[];
}

export interface Doctor {
  id: number;
  name: string;
  practiceNumber: string;
}

export interface Hospital {
  id: number;
  name: string;
}