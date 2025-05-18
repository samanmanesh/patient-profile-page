import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
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

// Helper function to write memos to the JSON file
const saveMemos = (memos: Memo[]): void => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(memos, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing memos data:', error);
  }
};

// GET handler - Get all memos
export async function GET() {
  try {
    const memos = getMemos();
    return NextResponse.json(memos);
  } catch (error) {
    console.error('Error fetching memos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch memos' },
      { status: 500 }
    );
  }
}

// POST handler - Create a new memo
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const memos = getMemos();
    
    // Create a new memo with required fields
    const newMemo: Memo = {
      id: `qn_${uuidv4().substring(0, 18)}`,
      patient: data.patient,
      note: data.note,
      creator: data.creator,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString()
    };
    
    // Add the new memo to the array
    memos.push(newMemo);
    
    // Save the updated memos array
    saveMemos(memos);
    
    return NextResponse.json(newMemo, { status: 201 });
  } catch (error) {
    console.error('Error creating memo:', error);
    return NextResponse.json(
      { error: 'Failed to create memo' },
      { status: 500 }
    );
  }
} 