import { NextResponse } from "next/server";
import { Patient } from "@/app/types/patient";
import { v4 as uuidv4 } from "uuid";
import { getPatients, savePatients } from "@/app/lib/data";

// GET /api/patients - Get all patients with filtering and pagination
export async function GET(request: Request) {
  try {
    const patientsData = await getPatients();
    const patients = Array.isArray(patientsData) ? patientsData : [patientsData];
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const sortBy = (searchParams.get("sortBy") as keyof Patient) || "createdDate";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    let filteredPatients = patients;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPatients = patients.filter(
        (patient) =>
          patient.firstName.toLowerCase().includes(searchLower) ||
          patient.lastName.toLowerCase().includes(searchLower) ||
          patient.email.toLowerCase().includes(searchLower) ||
          patient.phoneNumber.includes(search)
      );
    }

    filteredPatients.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (sortOrder === "asc") {
        return String(aValue) > String(bValue) ? 1 : -1;
      }
      return String(aValue) < String(bValue) ? 1 : -1;
    });

    // Paginate results
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
        pageCount: Math.ceil(filteredPatients.length / limit), // Adding pageCount for compatibility
        currentPage: page
      },
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { error: "Failed to fetch patients", details: error },
      { status: 500 }
    );
  }
}

// POST /api/patients - Create a new patient
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const patientsData = await getPatients();
    const patients = Array.isArray(patientsData) ? patientsData : [patientsData];

    // Generate a new ID using uuidv4
    const newId = `pt_${uuidv4()}`;

    const newPatient: Patient = {
      ...body,
      id: newId,
      createdDate: new Date().toISOString(),
      isOnboardingComplete: false,
      measurements: [],
      medications: [],
    };
    
    // Add to patients array
    patients.push(newPatient);
    
    // Save in development mode (will be a no-op in production)
    await savePatients(patients);

    return NextResponse.json(newPatient, { status: 201 });
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json(
      { error: "Invalid patient data", details: error },
      { status: 400 }
    );
  }
}
