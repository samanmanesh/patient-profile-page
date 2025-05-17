import { ID, Email, PhoneNumber, DateTime, DateString } from '../common';

// Measurement types
export type MeasurementType = 'WEIGHT' | 'HEIGHT' | 'BLOOD_PRESSURE';
export type MeasurementUnit = 'lb' | 'in' | 'mmHg';

export interface Measurement {
  id: ID;
  patientId: ID;
  type: MeasurementType;
  value: number | string;
  unit: MeasurementUnit;
  date: DateTime;
}

// Medication types
export interface Medication {
  id: ID;
  patientId: ID;
  name: string;
  dosage: string;
  frequency: string;
  startDate: DateString;
  endDate: DateString | null;
  active: boolean;
}

// Patient types
export type MaritalStatus = 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type EmploymentStatus = 'EMPLOYED' | 'UNEMPLOYED' | 'RETIRED' | 'STUDENT';

export interface PatientBasic {
  id: ID;
  firstName: string;
  lastName: string;
}

export interface Patient extends PatientBasic {
  phoneNumber: PhoneNumber;
  email: Email;
  address: string;
  addressLineTwo: string | null;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  addressValid: boolean;
  guardianName: string | null;
  guardianPhoneNumber: PhoneNumber | null;
  maritalStatus: MaritalStatus;
  gender: Gender;
  employmentStatus: EmploymentStatus;
  dateOfBirth: DateString;
  allergies: string[];
  familyHistory: string[];
  medicalHistory: string[];
  prescriptions: string[];
  goalWeight: number;
  isOnboardingComplete: boolean;
  createdDate: DateTime;
  firebaseUid: string;
  measurements: Measurement[];
  medications: Medication[];
} 