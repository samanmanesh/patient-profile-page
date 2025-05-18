import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Event } from '@/app/types/event';

// Path to the events JSON file
const dataFilePath = path.join(process.cwd(), 'public/data/events.json');

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

// GET specific event by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const eventId = await context.params.then(params => params.id);
  const events = readEvents();
  
  const event = events.find((event: Event) => event.id === eventId);
  
  if (!event) {
    return NextResponse.json(
      { error: 'Event not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(event);
}

// PUT - Update an event
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const eventId = await context.params.then(params => params.id);
  const body = await request.json();
  const events = readEvents();
  
  const eventIndex = events.findIndex((event: Event) => event.id === eventId);
  
  if (eventIndex === -1) {
    return NextResponse.json(
      { error: 'Event not found' },
      { status: 404 }
    );
  }
  
  // Update event with new data, preserving ID and any fields not in body
  const updatedEvent = {
    ...events[eventIndex],
    ...body,
    id: eventId, // Ensure ID doesn't change
  };
  
  events[eventIndex] = updatedEvent;
  
  const result = writeEvents(events);
  
  if (result) {
    return NextResponse.json(updatedEvent);
  } else {
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// DELETE an event
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const eventId = await context.params.then(params => params.id);
  const events = readEvents();
  
  const filteredEvents = events.filter((event: Event) => event.id !== eventId);
  
  if (filteredEvents.length === events.length) {
    return NextResponse.json(
      { error: 'Event not found' },
      { status: 404 }
    );
  }
  
  const result = writeEvents(filteredEvents);
  
  if (result) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
} 