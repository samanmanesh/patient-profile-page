import { ID, DateTime } from '../common';
import { Patient } from '../patient';

export interface DoctorNote {
  id: ID;
  eventId: ID;
  parentNoteId: ID;
  noteTranscriptId: ID | null;
  duration: number | null;
  version: number;
  currentVersion: number;
  content: string;
  summary: string;
  aiGenerated: boolean;
  template: string | null;
  patient: Patient;
  createdDate: DateTime;
  providerNames: string[];
}

export interface NotesResponse {
  data: DoctorNote[];
  total: number;
} 