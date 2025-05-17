import { ID, DateTime, Currency, Status } from '../common';

export type PaymentMethodType = 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'INSURANCE';
export type PaymentStatus = Status;

export interface PaymentMethod {
  id: ID;
  type: PaymentMethodType;
  lastFourDigits?: string;
  expiryDate?: string;
  isDefault: boolean;
  status: PaymentStatus;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface InsuranceInfo {
  id: ID;
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  startDate: string;
  endDate?: string;
  status: PaymentStatus;
}

export interface Payment {
  id: ID;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  paymentMethodId: ID;
  description: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  metadata?: Record<string, string | number | boolean | null>;
} 