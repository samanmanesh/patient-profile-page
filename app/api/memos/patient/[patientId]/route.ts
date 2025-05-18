import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Memo } from '@/app/types/memos';

// Path to the memos data file
const dataFilePath = path.join(process.cwd(), 'app/data/memos.json');

// Helper function to read memos from the JSON file
const getMemos = (): Memo[] => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading memos data:', error);
    return [];
  }
};

// GET handler - Get memos by patient ID
export async function GET(
  request: NextRequest,
  { params }: { params: { patientId: string } }
) {
  try {
    const memos = getMemos();
    // Filter memos where patient.id matches the patientId parameter
    const patientMemos = memos.filter((memo) => {
      return memo.patient && memo.patient.id === params.patientId;
    });

    return NextResponse.json(patientMemos);
  } catch (error) {
    console.error('Error fetching patient memos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patient memos' },
      { status: 500 }
    );
  }
} 