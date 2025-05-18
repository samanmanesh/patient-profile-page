export interface PatientInfo {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface PaymentMethod {
  id: string;
  patientId: string;
  description: string;
  type: 'CARD' | 'BANK_ACCOUNT';
  brand?: string | null;
  last4?: string | null;
  expMonth?: number | null;
  expYear?: number | null;
  accountHolderType?: string | null;
  accountNumberLast4?: number | null;
  bankName?: string | null;
  routingNumber?: number | null;
  isDefault: boolean;
}

export interface PaymentMethodInfo {
  id: string;
  brand: string | null;
  last4: string | null;
  expMonth: number | null;
  expYear: number | null;
}

export interface Refund {
  id: string;
  amount: number;
  reason?: string;
  createdDate: string;
}

export interface Payment {
  id: string;
  amount: number;
  createdDate: string;
  paymentMethod?: PaymentMethodInfo;
  paymentMethodId?: string;
  paymentMedium: string;
  refunds?: Refund[];
}

export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  active: boolean;
  createdDate: string;
  category: string;
}

export interface ChargeItem {
  item_id: string;
  charge_id: string;
  quantity: number;
  item: Item;
  // For the simpler structure
  id?: string;
  name?: string;
  price?: number;
}

export interface Adjustment {
  id: string;
  chargeId: string;
  amount: number;
  type: string;
  description: string;
  createdDate: string;
}

export interface PlannedPayment {
  id: string;
  amount: number;
  paymentDate: string;
  status: string;
}

export interface Charge {
  id: string;
  patientId?: string;
  patient?: PatientInfo;
  description: string;
  total: number;
  totalOutstanding?: number;
  status: 'PAID' | 'UNPAID' | 'PARTIALLY_PAID' | 'CANCELLED' | 'REFUNDED';
  createdDate: string;
  adjustments?: Adjustment[];
  payments: Payment[];
  plannedPayments?: PlannedPayment[];
  comment?: string | null;
  items: ChargeItem[];
  locationId?: string | null;
  locationName?: string | null;
} 