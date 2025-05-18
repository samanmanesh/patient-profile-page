import { PaymentMethod, Charge } from '../types/billing';

class BillingService {
  // Payment Methods
  async getPatientPaymentMethods(patientId: string): Promise<PaymentMethod[]> {
    try {
      console.log(`Fetching payment methods for patient: ${patientId}`);
      const response = await fetch('/data/payment_methods.json');
      
      if (!response.ok) {
        console.error(`Failed to fetch payment methods: ${response.status} ${response.statusText}`);
        return [];
      }
      
      const data: PaymentMethod[] = await response.json();
      const patientPaymentMethods = data.filter(pm => pm.patientId === patientId);
      console.log(`Received ${patientPaymentMethods.length} payment methods`);
      return patientPaymentMethods;
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      return [];
    }
  }

  // Charges
  async getPatientCharges(patientId: string): Promise<Charge[]> {
    try {
      console.log(`Fetching charges for patient: ${patientId}`);
      const response = await fetch('/data/charges.json');
      
      if (!response.ok) {
        console.error(`Failed to fetch charges: ${response.status} ${response.statusText}`);
        return [];
      }
      
      const chargesResponse = await response.json();
      const data = chargesResponse.data || [];
      
      const patientCharges = data.filter((charge: Charge) => charge.patient && charge.patient.id === patientId);
      console.log(`Received ${patientCharges.length} charges`);
      return patientCharges;
    } catch (error) {
      console.error('Error fetching charges:', error);
      return [];
    }
  }
}

// Export as a singleton
export const billingService = new BillingService(); 