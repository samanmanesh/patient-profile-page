import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import { Patient } from "@/app/types/patient";

const dataFilePath = path.join(process.cwd(), 'app/data/patient.json');

// Read patients data from file
const readPatientsFromFile = (): Patient[] => {
  try {
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    const patientsData = JSON.parse(fileData);
    return Array.isArray(patientsData) ? patientsData : [patientsData];
  } catch (error) {
    console.error('Error reading patients data:', error);
    return [];
  }
};

// Write patients data to file
const writePatientsToFile = (patients: Patient[]): boolean => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(patients, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing patients data:', error);
    return false;
  }
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const id = await context.params.then(params => params.id);
  const patients = readPatientsFromFile();
  const patient = patients.find((patient) => patient.id === id);
  if (!patient) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }
  return NextResponse.json(patient);
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const id = await context.params.then(params => params.id);
  const patients = readPatientsFromFile();
  const patientIndex = patients.findIndex((patient) => patient.id === id);

  if (patientIndex === -1) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const updatedPatient = {
      ...patients[patientIndex],
      ...body,
      id, // Ensure ID cannot be changed
    };

    // Update patient in the array
    patients[patientIndex] = updatedPatient;
    
    // Write updated data back to file
    if (!writePatientsToFile(patients)) {
      return NextResponse.json(
        { error: "Failed to save patient data" },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedPatient);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid patient data", details: error },
      { status: 400 }
    );
  }
}

// DELETE /api/patients/[id] - Delete a patient
export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const id = await context.params.then(params => params.id);
  const patients = readPatientsFromFile();
  const patientIndex = patients.findIndex((patient) => patient.id === id);

  if (patientIndex === -1) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }

  // Remove patient from array
  patients.splice(patientIndex, 1);
  
  // Write updated data back to file
  if (!writePatientsToFile(patients)) {
    return NextResponse.json(
      { error: "Failed to save changes" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Patient deleted successfully" });
}
