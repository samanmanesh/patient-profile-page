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

// Helper function to write memos to the JSON file
const saveMemos = (memos: Memo[]): void => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(memos, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing memos data:', error);
  }
};

// GET handler - Get a memo by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const id = await context.params.then(params => params.id);
    const memos = getMemos();
    const memo = memos.find((memo) => memo.id === id);

    if (!memo) {
      return NextResponse.json(
        { error: 'Memo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(memo);
  } catch (error) {
    console.error('Error fetching memo:', error);
    return NextResponse.json(
      { error: 'Failed to fetch memo' },
      { status: 500 }
    );
  }
}

// PUT handler - Update a memo by ID
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const id = await context.params.then(params => params.id);
    const memoData = await request.json();
    const memos = getMemos();
    const index = memos.findIndex((memo) => memo.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Memo not found' },
        { status: 404 }
      );
    }

    // Update the memo with new data, preserving the ID
    const updatedMemo = {
      ...memos[index],
      ...memoData,
      id: id,
      updatedDate: new Date().toISOString()
    };

    memos[index] = updatedMemo;
    saveMemos(memos);

    return NextResponse.json(updatedMemo);
  } catch (error) {
    console.error('Error updating memo:', error);
    return NextResponse.json(
      { error: 'Failed to update memo' },
      { status: 500 }
    );
  }
}

// DELETE handler - Delete a memo by ID
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const id = await context.params.then(params => params.id);
    const memos = getMemos();
    const updatedMemos = memos.filter((memo) => memo.id !== id);

    if (updatedMemos.length === memos.length) {
      return NextResponse.json(
        { error: 'Memo not found' },
        { status: 404 }
      );
    }

    saveMemos(updatedMemos);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting memo:', error);
    return NextResponse.json(
      { error: 'Failed to delete memo' },
      { status: 500 }
    );
  }
} 