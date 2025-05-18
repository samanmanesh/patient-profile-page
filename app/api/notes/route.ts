import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { DoctorNote } from '@/app/types/note';

// Path to the doctor notes JSON file
const dataFilePath = path.join(process.cwd(), 'public/data/doctors_notes.json');

// Helper functions
function readNotes() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8'); 
    const jsonData = JSON.parse(data);
    // Return the data array, not the whole object
    return jsonData.data || [];
  } catch (error) {
    console.error('Error reading notes:', error);
    return [];
  }
}

function writeNotes(notes: DoctorNote[]) {
  try {
    // Maintain the same structure with data array and total count
    const jsonData = {
      data: notes,
      total: notes.length
    };
    fs.writeFileSync(dataFilePath, JSON.stringify(jsonData, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing notes:', error);
    return false;
  }
}

// GET notes (all or filtered by patientId)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const patientId = searchParams.get('patientId');
  const notes = readNotes();

  if (patientId) {
    const filteredNotes = notes.filter(
      (note: DoctorNote) => note.patient?.id === patientId
    );
    // Sort by created date (newest first)
    filteredNotes.sort((a: DoctorNote, b: DoctorNote) => 
      new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
    );
    return NextResponse.json(filteredNotes);
  }

  return NextResponse.json(notes);
}

// POST a new note
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const notes = readNotes();
    
    // Create new note with required fields
    const newNote: DoctorNote = {
      id: uuidv4(),
      eventId: body.eventId || uuidv4(),
      parentNoteId: body.parentNoteId || null,
      noteTranscriptId: body.noteTranscriptId || null,
      duration: body.duration || null,
      version: 1,
      currentVersion: 1,
      content: body.content || "",
      summary: body.summary || body.content?.substring(0, 100) + "..." || "",
      aiGenerated: body.aiGenerated || false,
      template: body.template || null,
      patient: body.patient,
      createdDate: new Date().toISOString(),
      providerNames: body.providerNames || ["Doctor"],
    };
    
    notes.push(newNote);
    
    // Write updated notes back to file
    const success = writeNotes(notes);
    
    if (success) {
      return NextResponse.json(newNote, { status: 201 });
    } else {
      return NextResponse.json(
        { error: 'Failed to create note' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
