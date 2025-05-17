import { ID, DateTime } from '../common';
import { Patient, PatientBasic } from '../patient';

export type AlertType = 'FORM_SUBMITTED' | 'APPOINTMENT_SCHEDULED' | 'MESSAGE_RECEIVED';

export interface Tag {
  id: ID;
  name: string;
}

export interface AlertProvider {
  id: ID;
  firstName: string;
  lastName: string;
  email: string;
}

// Alert Data Types
export interface FormSubmittedData {
  id: ID;
  name: string;
  patient: PatientBasic;
  submittedAt: DateTime;
}

export interface AppointmentData {
  id: ID;
  title: string;
  start: DateTime;
  end: DateTime;
  organizer: AlertProvider;
  appointment: {
    id: ID;
    reason: string;
    confirmationStatus: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  };
}

export interface MessageData {
  message: string;
  data: {
    chatId: ID;
    messageType: 'TEXT' | 'IMAGE' | 'FILE';
  };
  patient: PatientBasic;
}

export type AlertData = FormSubmittedData | AppointmentData | MessageData;

export interface Alert {
  id: ID;
  type: AlertType;
  data: AlertData;
  createdDate: DateTime;
  actionRequired: boolean;
  resolvedDate: DateTime | null;
  tags: Tag[];
  assignedProvider: AlertProvider;
  resolvingProvider: AlertProvider | null;
  occurances: number;
  patient: Patient;
}

export interface AlertsResponse {
  data: Alert[];
  total: number;
} 