import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Event } from '@/app/types/event';

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

// GET events by patient ID
export async function GET(
  request: NextRequest,
  { params }: { params: { patientId: string } }
) {
  const patientId = params.patientId;
  const events = readEvents();
  
  // Filter events for the specific patient
  // This looks for the patient either as an attendee or in the appointment data
  const patientEvents = events.filter((event: Event) => {
    // Check if event has an appointment for this patient
    if (event.appointment && event.appointment.patientId === patientId) {
      return true;
    }
    
    // Check if patient is an attendee
    return event.attendees.some(attendee => attendee.user.id === patientId);
  });
  
  // Sort by date (upcoming first, then past events)
  const now = new Date().toISOString();
  
  // Separate upcoming and past events
  const upcomingEvents = patientEvents
    .filter(event => event.start > now)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    
    
  const pastEvents = patientEvents
    .filter(event => event.start <= now)
    .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());
  

  // Combine with upcoming events first, then past events
  const sortedEvents = [...upcomingEvents, ...pastEvents];
  
  return NextResponse.json(sortedEvents);
} 