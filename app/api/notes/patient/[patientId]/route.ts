import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { DoctorNote } from "@/app/types/note";

// Path to the doctor notes JSON file
const dataFilePath = path.join(process.cwd(), "public/data/doctors_notes.json");

// Helper function
function readNotes() {
  try {
    const data = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading notes:", error);
    return { data: [] };
  }
}

// GET notes by patient ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ patientId: string }> }
) {
  const patientId = await context.params.then(params => params.patientId);
  const notesData = readNotes();
  const notes = notesData.data || [];

  // Filter notes by patient ID
  const patientNotes = notes.filter(
    (note: DoctorNote) => note.patient?.id === patientId
  );

  // Sort by created date (newest first)
  patientNotes.sort(
    (a: DoctorNote, b: DoctorNote) =>
      new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
  );

  return NextResponse.json(patientNotes);
}
