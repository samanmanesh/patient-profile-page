import { DoctorNote } from "../types/note";
import { Patient } from "../types/patient";
import notes from "./data/doctors_notes.json";
export const notesService = {
  // Get all notes
  getAllNotes: async (): Promise<DoctorNote[]> => {
    try {
      return notes.data as unknown as DoctorNote[];
    } catch (error) {
      console.error("Error fetching notes:", error);
      return [];
    }
  },

  // Get a note by ID
  getNoteById: async (id: string): Promise<DoctorNote | null> => {
    try {
      const response = await fetch("/data/doctors_notes.json");
      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }
      const notesResponse = await response.json();
      const note = notesResponse.data.find(
        (note: DoctorNote) => note.id === id
      );

      if (!note) {
        throw new Error("Note not found");
      }

      return note;
    } catch (error) {
      console.error("Error fetching note:", error);
      return null;
    }
  },

  // Get notes by patient ID
  getNotesByPatientId: async (patientId: string): Promise<DoctorNote[]> => {
    try {
      const response = await fetch("/data/doctors_notes.json");
      if (!response.ok) {
        throw new Error("Failed to fetch patient notes");
      }
      const notesResponse = await response.json();
      return notesResponse.data.filter(
        (note: DoctorNote) => note.patient.id === patientId
      );
    } catch (error) {
      console.error("Error fetching patient notes:", error);
      return [];
    }
  },

  // Create a new note - mocked implementation
  createNote: async (note: Partial<DoctorNote>): Promise<DoctorNote> => {
    // In a real implementation, we would update the local data
    // For now, just return a mock response
    console.log("Create note called with:", note);
    return {
      id: `nt_${Math.random().toString(36).substring(2, 15)}`,
      createdDate: new Date().toISOString(),
      version: 1,
      currentVersion: 1,
      ...note,
    } as DoctorNote;
  },

  // Update a note - mocked implementation
  updateNote: async (
    id: string,
    note: Partial<DoctorNote>
  ): Promise<DoctorNote> => {
    try {
      // Get the current note
      const response = await fetch("/data/doctors_notes.json");
      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }
      const notesResponse = await response.json();
      const existingNote = notesResponse.data.find(
        (n: DoctorNote) => n.id === id
      );

      if (!existingNote) {
        throw new Error("Note not found");
      }

      // Return the updated note (in a real app, we would save this)
      const updatedNote = {
        ...existingNote,
        ...note,
        version: existingNote.version + 1,
        currentVersion: existingNote.currentVersion + 1,
      };

      return updatedNote;
    } catch (error) {
      console.error("Error updating note:", error);
      throw error;
    }
  },

  // Delete a note - mocked implementation
  deleteNote: async (id: string): Promise<void> => {
    // In a real implementation, we would update the local data
    console.log("Delete note called with ID:", id);
  },

  // Create a quick note with minimum required fields
  createQuickNote: async (
    patientId: string,
    content: string,
    providerName: string
  ): Promise<DoctorNote> => {
    try {
      // Get the patient data
      const response = await fetch("/data/patient.json");
      if (!response.ok) {
        throw new Error("Failed to fetch patient data");
      }
      const patients: Patient[] = await response.json();
      const patient = patients.find((p) => p.id === patientId);

      if (!patient) {
        throw new Error("Patient not found");
      }

      // Create the note with the patient reference
      const noteData: Partial<DoctorNote> = {
        content,
        summary:
          content.substring(0, 100) + (content.length > 100 ? "..." : ""),
        patient,
        providerNames: [providerName],
      };

      return notesService.createNote(noteData);
    } catch (error) {
      console.error("Error creating quick note:", error);
      throw error;
    }
  },
};

export default notesService;
