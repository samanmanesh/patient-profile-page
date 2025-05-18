import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { AlertsResponse } from '@/app/types/alert';

// Path to the alerts data file
const dataFilePath = path.join(process.cwd(), 'app/data/alerts.json');

// Helper function to read alerts from the JSON file
const getAlerts = (): AlertsResponse => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading alerts data:', error);
    return { data: [], total: 0 };
  }
};

// GET handler - Get alerts by patient ID
export async function GET(
  request: NextRequest,
  { params }: { params: { patientId: string } }
) {
  try {
    const alerts = getAlerts();
    // Filter alerts where patient.id matches the patientId parameter
    const patientAlerts = alerts.data.filter((alert) => {
      return alert.patient && alert.patient.id === params.patientId;
    });

    return NextResponse.json({
      data: patientAlerts,
      total: patientAlerts.length
    });
  } catch (error) {
    console.error('Error fetching patient alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patient alerts' },
      { status: 500 }
    );
  }
} 