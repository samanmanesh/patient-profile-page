import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Charge } from '@/app/types/billing';

// Path to the charges JSON file
const dataFilePath = path.join(process.cwd(), 'public/data/charges.json');

// Helper function to read charges
function readCharges(): Charge[] {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    console.log("Raw data length from charges.json:", data.length);
    
    const jsonData = JSON.parse(data);
    console.log("JSON data structure:", 
      Array.isArray(jsonData) ? "Array" : 
      (jsonData.data ? "Object with data property" : "Other structure")
    );
    
    // Handle both array and {data: []} formats
    const charges = Array.isArray(jsonData) ? jsonData : (jsonData.data || []);
    console.log(`Parsed ${charges.length} charges from data`);
    return charges;
  } catch (error) {
    console.error('Error reading charges:', error);
    return [];
  }
}

// GET all charges or filtered by patientId
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get('patientId');
  console.log(`Fetching charges for patientId: ${patientId || 'all'}`);
  
  const charges = readCharges();
  console.log(`Total charges before filtering: ${charges.length}`);
  
  if (patientId) {
    // Filter by patient.id (nested) instead of patientId (direct property)
    const filteredCharges = charges.filter(charge => {
      const matchesPatientId = charge.patientId === patientId;
      const matchesNestedId = charge.patient && charge.patient.id === patientId;
      console.log(`Charge ${charge.id}: patientId=${charge.patientId}, patient.id=${charge.patient?.id}, matches=${matchesPatientId || matchesNestedId}`);
      return matchesPatientId || matchesNestedId;
    });
    
    console.log(`Returning ${filteredCharges.length} charges after filtering for patient ${patientId}`);
    return NextResponse.json(filteredCharges);
  }
  
  return NextResponse.json(charges);
} 