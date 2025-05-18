import { Alert, AlertsResponse } from "../types/alert";
import { ID } from "../types/common";
import alertsData from '../services/data/alerts.json';

export const alertService = {
  getAllAlerts: async (): Promise<Alert[]> => {
    try {
      const alertsResponse = alertsData as AlertsResponse;
      return alertsResponse.data;
    } catch (error) {
      console.error("Error getting alerts:", error);
      return [];
    }
  },

  getAlertById: async (id: ID): Promise<Alert | null> => {
    try {
      const alertsResponse = alertsData as AlertsResponse;
      const alert = alertsResponse.data.find(alert => alert.id === id);
      
      if (!alert) {
        throw new Error('Alert not found');
      }
      
      return alert;
    } catch (error) {
      console.error("Error getting alert:", error);
      return null;
    }
  },

  getAlertsByPatientId: async (patientId: ID): Promise<Alert[]> => {
    try {
      const alertsResponse = alertsData as AlertsResponse;
      return alertsResponse.data.filter(alert => alert.patient.id === patientId);
    } catch (error) {
      console.error("Error getting patient alerts:", error);
      return []; 
    }
  },

  createAlert: async (alert: Partial<Alert>): Promise<Alert> => {
    // In a real implementation, I would update the local data
    // For now, just return a mock response
    console.log('Create alert called with:', alert);
    return {
      id: `alrt_${Math.random().toString(36).substring(2, 15)}`,
      createdDate: new Date().toISOString(),
      ...alert
    } as Alert;
  },

  updateAlert: async (id: ID, alert: Partial<Alert>): Promise<Alert> => {
    // In a real implementation, I would update the local data
    // For now, just return a mock response
    console.log('Update alert called with:', id, alert);
    return {
      id,
      ...alert
    } as Alert;
  },

  deleteAlert: async (id: ID): Promise<void> => {
    // In a real implementation, I would update the local data
    console.log('Delete alert called with ID:', id);
  },

  resolveAlert: async (id: ID, providerId: ID): Promise<Alert> => {
    try {
      const alertsResponse = alertsData as AlertsResponse;
      const alert = alertsResponse.data.find(a => a.id === id);
      
      if (!alert) {
        throw new Error('Alert not found');
      }
      
      return {
        ...alert,
        resolvedDate: new Date().toISOString(),
        resolvingProvider: {
          id: providerId, 
          firstName: 'Provider',
          lastName: 'Name',
          email: 'provider@example.com'
        }
      };
    } catch (error) {
      console.error("Error resolving alert:", error);
      throw error;
    }
  }
};

export default alertService; 