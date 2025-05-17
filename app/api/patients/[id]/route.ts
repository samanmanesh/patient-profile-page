import { NextResponse } from "next/server";
import patientsData from "@/app/data/patient.json";
import { Patient } from "@/app/types/patient";

const patients = (
  Array.isArray(patientsData) ? patientsData : [patientsData]
) as Patient[];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const patient = patients.find((patient) => patient.id === id);
  if (!patient) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }
  return NextResponse.json(patient);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
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

    // For now, we'll just return the updated patient
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
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const patientIndex = patients.findIndex((patient) => patient.id === id);

  if (patientIndex === -1) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }

  // In a real app, this would delete from the database
  // For now, we'll just return a success message
  return NextResponse.json({ message: "Patient deleted successfully" });
}
