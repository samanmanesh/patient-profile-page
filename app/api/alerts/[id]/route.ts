import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Alert, AlertsResponse } from '@/app/types/alert';

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

// Helper function to write alerts to the JSON file
const saveAlerts = (alerts: AlertsResponse): void => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(alerts, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing alerts data:', error);
  }
};

// GET handler - Get an alert by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const alerts = getAlerts();
    const alert = alerts.data.find((alert) => alert.id === params.id);

    if (!alert) {
      return NextResponse.json(
        { error: 'Alert not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(alert);
  } catch (error) {
    console.error('Error fetching alert:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alert' },
      { status: 500 }
    );
  }
}

// PUT handler - Update an alert by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const alertData = await request.json();
    const alerts = getAlerts();
    const index = alerts.data.findIndex((alert) => alert.id === params.id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Alert not found' },
        { status: 404 }
      );
    }

    // Update the alert with new data, preserving the ID
    const updatedAlert = {
      ...alerts.data[index],
      ...alertData,
      id: params.id,
    };

    alerts.data[index] = updatedAlert;
    saveAlerts(alerts);

    return NextResponse.json(updatedAlert);
  } catch (error) {
    console.error('Error updating alert:', error);
    return NextResponse.json(
      { error: 'Failed to update alert' },
      { status: 500 }
    );
  }
}

// DELETE handler - Delete an alert by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const alerts = getAlerts();
    const filteredAlerts = alerts.data.filter((alert) => alert.id !== params.id);

    if (filteredAlerts.length === alerts.data.length) {
      return NextResponse.json(
        { error: 'Alert not found' },
        { status: 404 }
      );
    }

    const updatedAlerts = {
      data: filteredAlerts,
      total: filteredAlerts.length
    };
    
    saveAlerts(updatedAlerts);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting alert:', error);
    return NextResponse.json(
      { error: 'Failed to delete alert' },
      { status: 500 }
    );
  }
} 