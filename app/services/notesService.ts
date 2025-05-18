import { DoctorNote } from "../types/note";
import { Patient } from "../types/patient";
import notes from "./data/doctors_notes.json";
export const notesService = {

  getAllNotes: async (): Promise<DoctorNote[]> => {
    try {
      return notes.data as unknown as DoctorNote[];
    } catch (error) {
      console.error("Error fetching notes:", error);
      return [];
    }
  },

  getNoteById: async (id: string): Promise<DoctorNote | null> => {
    try {
      const note = (notes.data as unknown as DoctorNote[]).find(
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

  getNotesByPatientId: async (patientId: string): Promise<DoctorNote[]> => {
    try {
      return (notes.data as unknown as DoctorNote[]).filter(
        (note: DoctorNote) => note.patient.id === patientId
      );
    } catch (error) {
      console.error("Error fetching patient notes:", error);
      return [];
    }
  },

  createNote: async (note: Partial<DoctorNote>): Promise<DoctorNote> => {
    // In a real implementation, I would update the local data
    console.log("Create note called with:", note);
    return {
      id: `nt_${Math.random().toString(36).substring(2, 15)}`,
      createdDate: new Date().toISOString(),
      version: 1,
      currentVersion: 1,
      ...note,
    } as DoctorNote;
  },

  updateNote: async (
    id: string,
    note: Partial<DoctorNote>
  ): Promise<DoctorNote> => {
    try {
      const existingNote = (notes.data as unknown as DoctorNote[]).find(
        (n: DoctorNote) => n.id === id
      );

      if (!existingNote) {
        throw new Error("Note not found");
      }

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

  deleteNote: async (id: string): Promise<void> => {    
    console.log("Delete note called with ID:", id);
  },

  createQuickNote: async (
    patientId: string,
    content: string,
    providerName: string
  ): Promise<DoctorNote> => {
    try {
      
      
      const patientsResponse = await import("./data/patient.json");
      const patients = patientsResponse.default as Patient[];
      const patient = patients.find((p) => p.id === patientId);

      if (!patient) {
        throw new Error("Patient not found");
      }

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
