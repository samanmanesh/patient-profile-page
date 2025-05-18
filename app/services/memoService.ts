import { Memo } from "../types/memos";
import { ID } from "../types/common";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const memoService = {
  // Get all memos
  getAllMemos: async (): Promise<Memo[]> => {
    const response = await fetch(`${API_BASE_URL}/api/memos`);
    if (!response.ok) {
      throw new Error('Failed to fetch memos');
    }
    return response.json();
  },

  // Get a memo by ID
  getMemoById: async (id: ID): Promise<Memo> => {
    const response = await fetch(`${API_BASE_URL}/api/memos/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch memo');
    }
    return response.json();
  },

  // Get memos by patient ID
  getMemosByPatientId: async (patientId: ID): Promise<Memo[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/memos/patient/${patientId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch patient memos');
      }
      return response.json();
    } catch (error) {
      console.error("Error fetching patient memos:", error);
      return []; // Return empty array if there's an error
    }
  },

  // Create a new memo
  createMemo: async (memo: Partial<Memo>): Promise<Memo> => {
    const response = await fetch(`${API_BASE_URL}/api/memos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(memo),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create memo');
    }
    
    return response.json();
  },

  // Update a memo
  updateMemo: async (id: ID, memo: Partial<Memo>): Promise<Memo> => {
    const response = await fetch(`${API_BASE_URL}/api/memos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(memo),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update memo');
    }
    
    return response.json();
  },

  // Delete a memo
  deleteMemo: async (id: ID): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/memos/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete memo');
    }
  },

  // Create a quick memo
  createQuickMemo: async (
    patientId: ID,
    note: string,
    creator: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    },
    patient: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
    }
  ): Promise<Memo> => {
    const memoData: Partial<Memo> = {
      patient,
      note,
      creator,
    };
    
    return memoService.createMemo(memoData);
  }
};

export default memoService; 