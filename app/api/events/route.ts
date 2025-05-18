import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Appointment, Event } from '@/app/types/event';
import { Status } from '@/app/types/common';

// Path to the events JSON file
const dataFilePath = path.join(process.cwd(), 'app/data/events.json');

// Helper function to read events
function readEvents(): Event[] {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading events:', error);
    return [];
  }
}

// Helper function to write events
function writeEvents(events: Event[]) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(events, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing events:', error);
    return false;
  }
}

// GET all events
export async function GET() {
  const events = readEvents();
  return NextResponse.json(events);
}

// POST new event
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Check required fields
  if (!body.title || !body.organizerId || !body.start || !body.end || !body.type) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }
  
  const events = readEvents();
  
  // Generate new ID
  const eventId = `evt_${uuidv4().replace(/-/g, '')}`.substring(0, 20);
  
  // Create appointment if needed
  let appointment = undefined;
  if (body.isAppointment && body.patientId) {
    const appointmentId = `apt_${uuidv4().replace(/-/g, '')}`.substring(0, 20);
    appointment = {
      id: appointmentId,
      eventId: eventId,
      patientId: body.patientId,
      providerId: body.organizerId,
      reason: body.reason || 'Medical appointment',
      confirmationStatus: 'PENDING',
      confirmationDate: null,
      checkedInDate: null,
      appointmentType: body.appointmentType || 'FOLLOW_UP'
    };
  }
  
  // Build attendees list
  const attendees = (body.attendeeIds || []).map((id: string) => ({
    user: {
      id: id,
      firstName: body.attendeeFirstName || 'Attendee',
      lastName: body.attendeeLastName || 'Name',
      email: body.attendeeEmail || 'attendee@example.com'
    },
    inviteStatus: 'ACCEPTED'
  }));
  
  // Add organizer to attendees if not already included
  if (!attendees.some((a: {user: {id: string}}) => a.user.id === body.organizerId)) {
    attendees.push({
      user: {
        id: body.organizerId,
        firstName: body.organizerFirstName || 'Organizer',
        lastName: body.organizerLastName || 'Name',
        email: body.organizerEmail || 'organizer@example.com'
      },
      inviteStatus: 'ACCEPTED'
    });
  }
  
  // Create new event
  const newEvent: Event = {
    id: eventId,
    title: body.title,
    organizer: {
      id: body.organizerId,
      firstName: body.organizerFirstName || 'Organizer',
      lastName: body.organizerLastName || 'Name',
      email: body.organizerEmail || 'organizer@example.com'
    },
    start: body.start,
    end: body.end,
    type: body.type,
    status: 'SCHEDULED' as Status,
    meetingLink: body.meetingLink || null,
    attendees: attendees,
    location: {
      id: body.locationId || 'loc_default',
      name: body.locationName || 'Default Clinic',
      address: body.locationAddress || '123 Medical St',
      city: body.locationCity || 'City',
      state: body.locationState || 'State',
      zipCode: body.locationZipCode || '12345',
      country: body.locationCountry || 'USA',
      isVirtual: body.isVirtual || false,
      meetingLink: body.isVirtual ? body.meetingLink : null
    },
    formCompleted: false,
    appointment: appointment as unknown as Appointment
  };
  
  events.push(newEvent);
  
  const result = writeEvents(events);
  
  if (result) {
    return NextResponse.json(newEvent);
  } else {
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
} 