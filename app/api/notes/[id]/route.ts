import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { DoctorNote } from '@/app/types/note';

// Path to the doctor notes JSON file
const dataFilePath = path.join(process.cwd(), 'app/data/doctors_notes.json');

// Helper functions
function readNotes() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading notes:', error);
    return [];
  }
}

function writeNotes(notes: DoctorNote[]) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(notes, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing notes:', error);
    return false;
  }
}

// GET a note by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const noteId = await context.params.then(params => params.id);
  const notes = readNotes();
  
  const note = notes.find((note: DoctorNote) => note.id === noteId);
  
  if (!note) {
    return NextResponse.json(
      { error: 'Note not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(note);
}

// UPDATE a note
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const noteId = await context.params.then(params => params.id);
    const body = await request.json();
    const notes = readNotes();
    
    const index = notes.findIndex((note: DoctorNote) => note.id === noteId);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }
    
    // Increment version
    const version = notes[index].version + 1;
    
    // Update note
    const updatedNote = {
      ...notes[index],
      ...body,
      id: noteId, // Ensure ID doesn't change
      version,
      currentVersion: version,
      createdDate: notes[index].createdDate, // Keep original created date
    };
    
    notes[index] = updatedNote;
    
    const success = writeNotes(notes);
    
    if (success) {
      return NextResponse.json(updatedNote);
    } else {
      return NextResponse.json(
        { error: 'Failed to update note' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

// DELETE a note
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const noteId = await context.params.then(params => params.id);
  const notes = readNotes();
  
  const index = notes.findIndex((note: DoctorNote) => note.id === noteId);
  
  if (index === -1) {
    return NextResponse.json(
      { error: 'Note not found' },
      { status: 404 }
    );
  }
  
  notes.splice(index, 1);
  
  const success = writeNotes(notes);
  
  if (success) {
    return NextResponse.json({ message: 'Note deleted successfully' });
  } else {
    return NextResponse.json(
      { error: 'Failed to delete note' },
      { status: 500 }
    );
  }
} 