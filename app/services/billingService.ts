import { PaymentMethod, Charge } from '../types/billing';

class BillingService {
  // Payment Methods
  async getPatientPaymentMethods(patientId: string): Promise<PaymentMethod[]> {
    try {
      console.log(`Fetching payment methods for patient: ${patientId}`);
      const response = await fetch(`/api/billing/payment-methods?patientId=${patientId}`);
      
      if (!response.ok) {
        console.error(`Failed to fetch payment methods: ${response.status} ${response.statusText}`);
        return [];
      }
      
      const data = await response.json();
      console.log(`Received ${data.length} payment methods`);
      return data;
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      return [];
    }
  }

  // Charges
  async getPatientCharges(patientId: string): Promise<Charge[]> {
    try {
      console.log(`Fetching charges for patient: ${patientId}`);
      const response = await fetch(`/api/billing/charges?patientId=${patientId}`);
      
      if (!response.ok) {
        console.error(`Failed to fetch charges: ${response.status} ${response.statusText}`);
        return [];
      }
      
      const data = await response.json();
      console.log(`Received ${Array.isArray(data) ? data.length : 0} charges`);
      return data;
    } catch (error) {
      console.error('Error fetching charges:', error);
      return [];
    }
  }
}

// Export as a singleton
export const billingService = new BillingService(); 