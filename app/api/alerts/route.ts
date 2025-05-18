import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Alert, AlertsResponse } from '@/app/types/alert';

// Path to the alerts data file
const dataFilePath = path.join(process.cwd(), 'public/data/alerts.json');

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

// Helper function to write alerts to the JSON file
const saveAlerts = (alerts: AlertsResponse): void => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(alerts, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing alerts data:', error);
  }
};

// GET handler - Get all alerts
export async function GET() {
  try {
    const alerts = getAlerts();
    return NextResponse.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

// POST handler - Create a new alert
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const alerts = getAlerts();
    
    // Create a new alert with required fields
    const newAlert: Alert = {
      id: `alrt_${uuidv4().substring(0, 18)}`,
      ...data,
      createdDate: new Date().toISOString(),
      resolvedDate: null,
      occurances: 1
    };
    
    // Add the new alert to the array
    alerts.data.push(newAlert);
    alerts.total = alerts.data.length;
    
    // Save the updated alerts array
    saveAlerts(alerts);
    
    return NextResponse.json(newAlert, { status: 201 });
  } catch (error) {
    console.error('Error creating alert:', error);
    return NextResponse.json(
      { error: 'Failed to create alert' },
      { status: 500 }
    );
  }
} 