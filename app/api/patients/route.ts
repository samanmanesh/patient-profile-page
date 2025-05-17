import { NextResponse } from "next/server";
import patients from "@/app/data/patient.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";

  const patientsArray = Array.isArray(patients) ? patients : [patients];
  let filteredPatients = [...patientsArray];

  if (search) {
    const searchLower = search.toLowerCase();
    filteredPatients = filteredPatients.filter(
      (patient) =>
        `${patient.firstName} ${patient.lastName}`
          .toLowerCase()
          .includes(searchLower) ||
        patient.email.toLowerCase().includes(searchLower)
    );
  }

  if (status) {
    filteredPatients = filteredPatients.filter(
      (patient) => patient.isOnboardingComplete === (status === "active")
    );
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPatients = filteredPatients.slice(startIndex, endIndex);

  return NextResponse.json({
    patients: paginatedPatients,
    pagination: {
      total: filteredPatients.length,
      page,
      limit,
      totalPages: Math.ceil(filteredPatients.length / limit),
    },
  });
}
