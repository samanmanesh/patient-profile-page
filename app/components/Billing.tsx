import React, { useState, useEffect } from "react";
import { Patient } from "../types/patient";
import { PaymentMethod, Charge } from "../types/billing";
import { billingService } from "../services/billingService";
import { Banknote, HotelIcon } from "lucide-react";
import { CreditCard } from "lucide-react";
import { cn } from "../utils";

type Props = {
  patient: Patient;
};

const Billing = ({ patient }: Props) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [charges, setCharges] = useState<Charge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (patient?.id) {
      loadBillingData();
    }
  }, [patient]);

  const loadBillingData = async () => {
    setIsLoading(true);
    try {
      console.log("Loading billing data for patient ID:", patient.id);

      const [methods, chargesData] = await Promise.all([
        billingService.getPatientPaymentMethods(patient.id),
        billingService.getPatientCharges(patient.id),
      ]);

      console.log("Received payment methods:", methods);
      console.log("Received charges:", chargesData);

      setPaymentMethods(methods || []);
      setCharges(chargesData || []);
    } catch (error) {
      console.error("Error loading billing data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatExpirationDate = (expYear: number, expMonth: number) => {
    const date = new Date(expYear, expMonth - 1);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  // Calculate total balance from all charges
  const totalBalance = charges.reduce((sum, charge) => {
    // Skip invalid charges
    if (!charge || typeof charge.total !== "number") return sum;

    // Use totalOutstanding if available, otherwise calculate it
    if (typeof charge.totalOutstanding === "number") {
      return sum + charge.totalOutstanding;
    }

    const paidAmount =
      charge.payments?.reduce(
        (total: number, payment) => total + (payment?.amount || 0),
        0
      ) || 0;
    return sum + (charge.total - paidAmount);
  }, 0);

  const handlePaymentMethodClick = (method: PaymentMethod) => {
    console.log("Payment method clicked:", method);
    //it updates the default payment method in the database
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full gap-4">
        <div className="flex justify-between px-2">
          <h3 className="px-2 text-lg font-medium text-[#73726E]">Billing</h3>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading billing information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex justify-between px-2">
        <h3 className="px-2 text-lg font-medium text-[#73726E]">Billing</h3>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Payment Methods Section */}

        <div className="col-span-2 p-4 gap-12 rounded-lg border-2 border-[#F1F1F1]">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-black/70">
              Saved Payment Methods
            </h3>
          </div>

          {/* List of Payment Methods */}
          <div className="space-y-2">
            {paymentMethods.length === 0 ? (
              <p className="text-gray-500 italic">No payment methods found</p>
            ) : (
              paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={cn(
                    "flex w-full  justify-between items-center px-4 py-2 rounded-lg relative shadow-xs border border-sky-100 hover:bg-sky-50 transition-colors duration-100 cursor-pointer",
                    method.isDefault && "border-l-4 border-l-sky-600"
                  )}
                  onClick={() => handlePaymentMethodClick(method)}
                >
                  <div className="flex items-center  w-full gap-4    ">
                    <div className="flex items-center gap-2 bg-gray-200 p-2 rounded-lg">
                      {method.type === "CARD" ? (
                        <CreditCard className="w-6 h-6" />
                      ) : (
                        <HotelIcon className="w-6 h-6" />
                      )}
                    </div>

                    <div>
                      <p className=" font-medium">
                        {method.type === "CARD"
                          ? `${method.brand} •••• ${method.last4}`
                          : `${method.bankName} Bank`}
                      </p>
                      <p className="text-sm text-gray-500 font-medium">
                        {method.description}
                      </p>
                      <p className="text-sm text-gray-500 font-medium">
                        {formatExpirationDate(
                          method.expYear || 0,
                          method.expMonth || 0
                        )}
                      </p>
                    </div>

                    {method.isDefault && (
                      <span className=" absolute top-2 right-2 text-blue-900 font-semibold px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Billing Summary Section */}
        <div className="col-span-1 border rounded-lg p-4">
          <h3 className="text-lg font-medium text-[#73726E] mb-4">
            Billing Summary
          </h3>
          <div className="bg-blue-50 p-3 rounded mb-3">
            <p className="text-sm text-gray-600">Total Balance</p>
            <p className="text-2xl font-bold">${totalBalance.toFixed(2)}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm flex justify-between">
              <span>Total Charges:</span>
              <span>
                $
                {charges
                  .reduce((sum, charge) => sum + charge.total, 0)
                  .toFixed(2)}
              </span>
            </p>
            <p className="text-sm flex justify-between">
              <span>Payments Made:</span>
              <span>
                $
                {(
                  charges.reduce((sum, charge) => sum + charge.total, 0) -
                  totalBalance
                ).toFixed(2)}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Charge History Section */}
      <div className="border rounded-lg p-4 mt-2">
        <h3 className="text-lg font-medium text-[#73726E] mb-4">
          Charge History
        </h3>

        {charges.length === 0 ? (
          <p className="text-gray-500 italic">No charges found</p>
        ) : (
          <div className="space-y-3">
            {charges.map((charge) => (
              <div key={charge.id} className="border rounded p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{charge.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(charge.createdDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${charge.total.toFixed(2)}</p>
                    <p
                      className={`text-sm ${
                        charge.status === "PAID"
                          ? "text-green-500"
                          : "text-blue-500"
                      }`}
                    >
                      {charge.status}
                    </p>
                  </div>
                </div>

                {/* Items */}
                {charge.items && (
                  <div className="mt-2 text-sm text-gray-600">
                    {charge.items.map((item, idx) => {
                      // Handle both item formats (direct or nested in item property)
                      const itemData = item.item || item;
                      const itemId = item.item_id || item.id || `item_${idx}`;
                      const name = itemData.name;
                      const price = itemData.price;
                      const quantity = item.quantity || 1;

                      return (
                        <div key={itemId} className="flex justify-between">
                          <span>
                            {name} (x{quantity})
                          </span>
                          <span>${(price * quantity).toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Payments */}
                {charge.payments?.length > 0 && (
                  <div className="mt-2 pt-2 border-t">
                    <p className="text-sm font-medium">Payments:</p>
                    {charge.payments.map((payment, idx) => (
                      <div
                        key={payment.id || `payment_${idx}`}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-gray-600">
                          {new Date(payment.createdDate).toLocaleDateString()} (
                          {payment.paymentMedium})
                        </span>
                        <span className="text-green-500">
                          -${payment.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Billing;
