import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { AlertsResponse } from '@/app/types/alert';

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

// POST handler - Resolve an alert
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { resolvingProviderId, resolvedDate } = await request.json();
    const alerts = getAlerts();
    const id = await context.params.then(params => params.id);
    const index = alerts.data.findIndex((alert) => alert.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Alert not found' },
        { status: 404 }
      );
    }

    // Find the resolving provider from any existing provider in the data
    const resolvingProvider = alerts.data.find(
      alert => alert.assignedProvider && alert.assignedProvider.id === resolvingProviderId
    )?.assignedProvider || null;

    if (!resolvingProvider) {
      return NextResponse.json(
        { error: 'Resolving provider not found' },
        { status: 400 }
      );
    }

    // Update the alert with resolution info
    const updatedAlert = {
      ...alerts.data[index],
      resolvedDate: resolvedDate || new Date().toISOString(),
      resolvingProvider,
      actionRequired: false
    };

    alerts.data[index] = updatedAlert;
    saveAlerts(alerts);

    return NextResponse.json(updatedAlert);
  } catch (error) {
    console.error('Error resolving alert:', error);
    return NextResponse.json(
      { error: 'Failed to resolve alert' },
      { status: 500 }
    );
  }
} 