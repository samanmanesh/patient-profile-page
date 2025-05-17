import { ID, DateTime, Status } from '../common';

export type EventType = 'APPOINTMENT' | 'MEETING' | 'CONSULTATION';
export type InviteStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED';
export type AppointmentType = 'NEW_PATIENT' | 'FOLLOW_UP' | 'ANNUAL_PHYSICAL' | 'CONSULTATION';

export interface User {
  id: ID;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Attendee {
  user: User;
  inviteStatus: InviteStatus;
}

export interface Location {
  id: ID;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isVirtual: boolean;
  meetingLink: string | null;
}

export interface Appointment {
  id: ID;
  eventId: ID;
  patientId: ID;
  providerId: ID;
  reason: string;
  confirmationStatus: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  confirmationDate: DateTime;
  checkedInDate: DateTime | null;
  appointmentType: AppointmentType;
}

export interface Event {
  id: ID;
  title: string;
  organizer: User;
  start: DateTime;
  end: DateTime;
  type: EventType;
  status: Status;
  meetingLink: string | null;
  attendees: Attendee[];
  location: Location;
  formCompleted: boolean;
  appointment: Appointment;
}

export type EventsResponse = Event[]; 