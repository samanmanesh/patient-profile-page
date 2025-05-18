import { Memo } from "../types/memos";
import { ID } from "../types/common";

export const memoService = {
  // Get all memos
  getAllMemos: async (): Promise<Memo[]> => {
    try {
      const response = await fetch('/data/memos.json');
      if (!response.ok) {
        throw new Error('Failed to fetch memos');
      }
      return response.json();
    } catch (error) {
      console.error("Error fetching memos:", error);
      return [];
    }
  },

  // Get a memo by ID
  getMemoById: async (id: ID): Promise<Memo | null> => {
    try {
      const response = await fetch('/data/memos.json');
      if (!response.ok) {
        throw new Error('Failed to fetch memos');
      }
      const memos: Memo[] = await response.json();
      const memo = memos.find(memo => memo.id === id);
      
      if (!memo) {
        throw new Error('Memo not found');
      }
      
      return memo;
    } catch (error) {
      console.error("Error fetching memo:", error);
      return null;
    }
  },

  // Get memos by patient ID
  getMemosByPatientId: async (patientId: ID): Promise<Memo[]> => {
    try {
      const response = await fetch('/data/memos.json');
      if (!response.ok) {
        throw new Error('Failed to fetch patient memos');
      }
      const memos: Memo[] = await response.json();
      return memos.filter(memo => memo.patient.id === patientId);
    } catch (error) {
      console.error("Error fetching patient memos:", error);
      return []; // Return empty array if there's an error
    }
  },

  // Create a new memo - mocked implementation
  createMemo: async (memo: Partial<Memo>): Promise<Memo> => {
    // In a real implementation, we would update the local data
    // For now, just return a mock response
    console.log('Create memo called with:', memo);
    return {
      id: `qn_${Math.random().toString(36).substring(2, 15)}`,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      ...memo
    } as Memo;
  },

  // Update a memo - mocked implementation
  updateMemo: async (id: ID, memo: Partial<Memo>): Promise<Memo> => {
    try {
      // Get the current memo
      const response = await fetch('/data/memos.json');
      if (!response.ok) {
        throw new Error('Failed to fetch memos');
      }
      const memos: Memo[] = await response.json();
      const existingMemo = memos.find(m => m.id === id);
      
      if (!existingMemo) {
        throw new Error('Memo not found');
      }
      
      // Return the updated memo (in a real app, we would save this)
      return {
        ...existingMemo,
        ...memo,
        updatedDate: new Date().toISOString()
      };
    } catch (error) {
      console.error("Error updating memo:", error);
      throw error;
    }
  },

  // Delete a memo - mocked implementation
  deleteMemo: async (id: ID): Promise<void> => {
    // In a real implementation, we would update the local data
    console.log('Delete memo called with ID:', id);
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