import { DoctorNote } from "../types/note";
import { Patient } from "../types/patient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const notesService = {
  // Get all notes
  getAllNotes: async (): Promise<DoctorNote[]> => {
    const response = await fetch(`${API_BASE_URL}/api/notes`);
    if (!response.ok) {
      throw new Error('Failed to fetch notes');
    }
    return response.json();
  },

  // Get a note by ID
  getNoteById: async (id: string): Promise<DoctorNote> => {
    const response = await fetch(`${API_BASE_URL}/api/notes/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch note');
    }
    return response.json();
  },

  // Get notes by patient ID
  getNotesByPatientId: async (patientId: string): Promise<DoctorNote[]> => {
    const response = await fetch(`${API_BASE_URL}/api/notes/patient/${patientId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch patient notes');
    }
    return response.json();
  },

  // Create a new note
  createNote: async (note: Partial<DoctorNote>): Promise<DoctorNote> => {
    const response = await fetch(`${API_BASE_URL}/api/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create note');
    }
    
    return response.json();
  },

  // Update a note
  updateNote: async (id: string, note: Partial<DoctorNote>): Promise<DoctorNote> => {
    const response = await fetch(`${API_BASE_URL}/api/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update note');
    }
    
    return response.json();
  },

  // Delete a note
  deleteNote: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/notes/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete note');
    }
  },

  // Create a quick note with minimum required fields
  createQuickNote: async (patientId: string, content: string, providerName: string): Promise<DoctorNote> => {
    // First get the patient data
    const patientResponse = await fetch(`${API_BASE_URL}/api/patients/${patientId}`);
    if (!patientResponse.ok) {
      throw new Error('Failed to fetch patient data');
    }
    const patient: Patient = await patientResponse.json();
    
    // Create the note with the patient reference
    const noteData: Partial<DoctorNote> = {
      content,
      summary: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
      patient,
      providerNames: [providerName],
    };
    
    return notesService.createNote(noteData);
  }
};

export default notesService; 