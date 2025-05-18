import { NextRequest, NextResponse } from 'next/server';
import { getAlerts, saveAlerts } from '@/app/lib/data';

// GET handler - Get an alert by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const id = await context.params.then(params => params.id);
    const alerts = await getAlerts();
    const alert = alerts.data.find((alert) => alert.id === id);

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
  context: { params: Promise<{ id: string }> }
) {
  try {
    const id = await context.params.then(params => params.id);
    const alertData = await request.json();
    const alerts = await getAlerts();
    const index = alerts.data.findIndex((alert) => alert.id === id);

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
      id: id,
    };

    alerts.data[index] = updatedAlert;
    await saveAlerts(alerts);

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
  context: { params: Promise<{ id: string }> }
) {
  try {
    const id = await context.params.then(params => params.id);
    const alerts = await getAlerts();
    const filteredAlerts = alerts.data.filter((alert) => alert.id !== id);

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
    
    await saveAlerts(updatedAlerts);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting alert:', error);
    return NextResponse.json(
      { error: 'Failed to delete alert' },
      { status: 500 }
    );
  }
} 