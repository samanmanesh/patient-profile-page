import { Memo } from "../types/memos";
import { ID } from "../types/common";
import memos from '../services/data/memos.json';
export const memoService = {
  getAllMemos: async (): Promise<Memo[]> => {
    try {
      return memos as Memo[];
    } catch (error) {
      console.error("Error getting memos:", error);
      return [];
    }
  },

  getMemoById: async (id: ID): Promise<Memo | null> => {
    try {
      const memo = (memos as Memo[]).find((memo: Memo) => memo.id === id);
      
      if (!memo) {
        throw new Error('Memo not found');
      }
      
      return memo;
    } catch (error) {
      console.error("Error getting memo:", error);
      return null;
    }
  },

  getMemosByPatientId: async (patientId: ID): Promise<Memo[]> => {
    try {
      return (memos as Memo[]).filter((memo: Memo) => memo.patient.id === patientId);
    } catch (error) {
      console.error("Error getting patient memos:", error);
      return []; 
    }
  },

  createMemo: async (memo: Partial<Memo>): Promise<Memo> => {
    // In a real implementation, I would update the local data
    console.log('Create memo called with:', memo);
    return {
      id: `qn_${Math.random().toString(36).substring(2, 15)}`,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      ...memo
    } as Memo;
  },

  updateMemo: async (id: ID, memo: Partial<Memo>): Promise<Memo> => {
    try {
      const existingMemo = (memos as Memo[]).find((m: Memo) => m.id === id);
      
      if (!existingMemo) {
        throw new Error('Memo not found');
      }
      
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

  deleteMemo: async (id: ID): Promise<void> => {
    console.log('Delete memo called with ID:', id);
  },

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