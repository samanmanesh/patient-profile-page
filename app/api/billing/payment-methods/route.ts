import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { PaymentMethod } from '@/app/types/billing';

// Path to the payment methods JSON file
const dataFilePath = path.join(process.cwd(), 'app/data/payment_methods.json');

// Helper function to read payment methods
function readPaymentMethods(): PaymentMethod[] {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    console.log("Raw data length from payment_methods.json:", data.length);
    
    const paymentMethods = JSON.parse(data);
    console.log(`Parsed ${paymentMethods.length} payment methods from data`);
    return paymentMethods;
  } catch (error) {
    console.error('Error reading payment methods:', error);
    return [];
  }
}

// GET all payment methods or filtered by patientId
export async function GET(request: NextRequest) {
  const paymentMethods = readPaymentMethods();
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get('patientId');
  console.log(`Fetching payment methods for patientId: ${patientId || 'all'}`);
  
  
  if (patientId) {
    const filteredMethods = paymentMethods.filter(method => method.patientId === patientId);
    console.log(`Returning ${filteredMethods.length} payment methods for patient ${patientId}`);
    return NextResponse.json(filteredMethods);
  }
  
  return NextResponse.json(paymentMethods);
} 