import { ID, DateTime } from '../common';
import { Patient } from '../patient';

export type ChargeStatus = 'PAID' | 'UNPAID' | 'PARTIALLY_PAID';

export interface Provider {
  id: ID;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Adjustment {
  id: ID;
  chargeId: ID;
  amount: number;
  type: 'DISCOUNT' | 'REFUND' | 'ADJUSTMENT';
  description: string;
  createdDate: DateTime;
}

export interface ChargePaymentMethod {
  id: ID;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

export interface ChargePayment {
  id: ID;
  amount: number;
  createdDate: DateTime;
  paymentMethod: ChargePaymentMethod;
  paymentMedium: 'CARD' | 'CASH' | 'INSURANCE' | 'TRANSFER';
  refunds: Refund[];
}

export interface Refund {
  id: ID;
  amount: number;
  reason: string;
  createdDate: DateTime;
}

export interface PlannedPayment {
  id: ID;
  amount: number;
  paymentDate: DateTime;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}

export interface ChargeItem {
  item_id: ID;
  charge_id: ID;
  quantity: number;
  item: {
    id: ID;
    name: string;
    description: string;
    price: number;
    active: boolean;
    createdDate: DateTime;
    category: string;
  };
}

export interface Charge {
  id: ID;
  total: number;
  totalOutstanding: number;
  description: string;
  status: ChargeStatus;
  patient: Patient;
  createdDate: DateTime;
  creator: Provider;
  adjustments: Adjustment[];
  payments: ChargePayment[];
  plannedPayments: PlannedPayment[];
  comment: string | null;
  items: ChargeItem[];
  locationId: ID | null;
  locationName: string | null;
}

export interface ChargesResponse {
  data: Charge[];
  total: number;
} 