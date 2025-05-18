import { Alert, AlertsResponse } from "../types/alert";
import { ID } from "../types/common";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const alertService = {
  // Get all alerts
  getAllAlerts: async (): Promise<Alert[]> => {
    const response = await fetch(`${API_BASE_URL}/api/alerts`);
    if (!response.ok) {
      throw new Error('Failed to fetch alerts');
    }
    const alertsResponse: AlertsResponse = await response.json();
    return alertsResponse.data;
  },

  // Get an alert by ID
  getAlertById: async (id: ID): Promise<Alert> => {
    const response = await fetch(`${API_BASE_URL}/api/alerts/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch alert');
    }
    return response.json();
  },

  // Get alerts by patient ID
  getAlertsByPatientId: async (patientId: ID): Promise<Alert[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/alerts/patient/${patientId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch patient alerts');
      }
      const alertsResponse: AlertsResponse = await response.json();
      return alertsResponse.data;
    } catch (error) {
      console.error("Error fetching patient alerts:", error);
      return []; // Return empty array if there's an error
    }
  },

  // Create a new alert
  createAlert: async (alert: Partial<Alert>): Promise<Alert> => {
    const response = await fetch(`${API_BASE_URL}/api/alerts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(alert),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create alert');
    }
    
    return response.json();
  },

  // Update an alert
  updateAlert: async (id: ID, alert: Partial<Alert>): Promise<Alert> => {
    const response = await fetch(`${API_BASE_URL}/api/alerts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(alert),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update alert');
    }
    
    return response.json();
  },

  // Delete an alert
  deleteAlert: async (id: ID): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/alerts/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete alert');
    }
  },

  // Resolve an alert
  resolveAlert: async (id: ID, providerId: ID): Promise<Alert> => {
    const response = await fetch(`${API_BASE_URL}/api/alerts/${id}/resolve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resolvingProviderId: providerId,
        resolvedDate: new Date().toISOString()
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to resolve alert');
    }
    
    return response.json();
  }
};

export default alertService; 