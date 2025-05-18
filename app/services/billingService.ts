import { PaymentMethod, Charge } from '../types/billing';
import paymentMethods from '../services/data/payment_methods.json';
import charges from '../services/data/charges.json';

class BillingService {
  async getPatientPaymentMethods(patientId: string): Promise<PaymentMethod[]> {
    try {
      console.log(`Getting payment methods for patient: ${patientId}`);
      
      const data = paymentMethods as PaymentMethod[];
      const patientPaymentMethods = data.filter(pm => pm.patientId === patientId);
      console.log(`Retrieved ${patientPaymentMethods.length} payment methods`);
      return patientPaymentMethods;
    } catch (error) {
      console.error('Error getting payment methods:', error);
      return [];
    }
  }

  async getPatientCharges(patientId: string): Promise<Charge[]> {
    try {
      console.log(`Getting charges for patient: ${patientId}`);
      
      const data = (charges.data || []) as Charge[];
      
      const patientCharges = data.filter((charge: Charge) => 
        charge.patient && charge.patient.id === patientId
      ) as Charge[];
      
      console.log(`Retrieved ${patientCharges.length} charges`);
      return patientCharges;
    } catch (error) {
      console.error('Error getting charges:', error);
      return [];
    }
  }
}

// export as a singleton
export const billingService = new BillingService(); 