import React, { useState, useEffect } from "react";
import { Patient } from "../types/patient";
import { PaymentMethod, Charge } from "../types/billing";
import { billingService } from "../services/billingService";
import { HotelIcon, CheckCircle, Clock } from "lucide-react";
import { CreditCard } from "lucide-react";
import { cn, getKeyLabel } from "../utils";

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
                    "flex w-full  justify-between items-center px-4 py-2 rounded-lg relative shadow-xs border  hover:bg-sky-50 transition-colors duration-100 cursor-pointer",
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
        <div className="col-span-1 border-2 border-[#F1F1F1] rounded-lg p-4">
          <section className="flex flex-col gap-1 mb-8">
            <h3 className="text-lg font-medium text-black/70  ">
              Billing Summary
            </h3>
            <p className="text-sm text-gray-500 ">
              Current balance information
            </p>
          </section>
          <section className="flex flex-col gap-2 mb-4 border-b border-gray-300 pb-4">
            <div className="  rounded flex justify-between items-center">
              <p className="text ">Total Charges</p>
              <p className="text-xl font-semibold">
                $
                {charges
                  .reduce((sum, charge) => sum + charge.total, 0)
                  .toFixed(2)}
              </p>
            </div>
            <div className="rounded  flex justify-between items-center">
              <p className="text ">Outstanding Balance</p>
              <p className="text-xl font-semibold text-red-600">
                ${totalBalance.toFixed(2)}
              </p>
            </div>
          </section>

          <div className=" flex gap-2 flex-col justify-between  ">
            <h3 className="font-medium ">Payment Status:</h3>
            <section className="flex h-full  gap-4">
              <div className="flex flex-col w-full items-center justify-between bg-gray-100 p-4 rounded-lg h-full">
                <p className="text-sm font-medium text-gray-500"> Paid</p>
                <span className="text-lg font-bold ">
                  $
                  {(
                    charges.reduce((sum, charge) => sum + charge.total, 0) -
                    totalBalance
                  ).toFixed(2)}
                </span>
              </div>
              <div className=" p-4 flex flex-col w-full items-center justify-between bg-gray-100 rounded-lg">
                <span className="text-sm font-medium text-gray-500">
                  Unpaid:
                </span>
                <span className="text-lg font-bold text-red-600">
                  ${totalBalance.toFixed(2)}
                </span>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Charge History Section */}
      <div className="border-2 border-[#F1F1F1] rounded-lg p-4 mt-2">
        <section className="flex justify-between items-center mb-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-medium text-black/70">
              Charge History
            </h3>
            <p className="text-sm text-gray-500">
              View your charge and payment history
            </p>
          </div>

          {charges.length > 0 && (
            <div className="text-sm text-gray-500">
              {charges.length} {charges.length === 1 ? "charge" : "charges"}{" "}
              total
            </div>
          )}
        </section>

        {charges.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-gray-500 italic mb-2">No charges found</p>
            <p className="text-sm text-gray-400">
              Charges will appear here when created
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {charges.map((charge) => (
              <div
                key={charge.id}
                className="border-2 border-[#EBEBE8] rounded-lg p-4  transition-colors duration-100"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3 items-start">
                    <div
                      className={`p-2 rounded-lg ${
                        charge.status === "PAID"
                          ? "bg-green-100"
                          : "bg-blue-100"
                      }`}
                    >
                      {charge.status === "PAID" ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{charge.description}</p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            charge.status === "PAID"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {getKeyLabel(charge.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(charge.createdDate).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      ${charge.total.toFixed(2)}
                    </p>
                    {charge.status !== "PAID" && charge.totalOutstanding && (
                      <p className="text-sm text-red-500">
                        ${charge.totalOutstanding.toFixed(2)} outstanding
                      </p>
                    )}
                  </div>
                </div>

                {/* Items */}
                {charge.items && (
                  <div className="mt-4 bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
                    <p className="font-medium text-gray-700 mb-2">Items</p>
                    {charge.items.map((item, idx) => {
                      const itemData = item.item || item;
                      const itemId = item.item_id || item.id || `item_${idx}`;
                      const name = itemData.name;
                      const price = itemData.price;
                      const quantity = item.quantity || 1;

                      return (
                        <div
                          key={itemId}
                          className="flex justify-between py-1 border-b border-gray-200 last:border-0"
                        >
                          <span>
                            {name}{" "}
                            <span className="text-gray-400">(x{quantity})</span>
                          </span>
                          <span className="font-medium">
                            ${(price * quantity).toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Payments */}
                {charge.payments?.length > 0 && (
                  <div className="mt-3 bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Payment History
                    </p>
                    {charge.payments.map((payment, idx) => (
                      <div
                        key={payment.id || `payment_${idx}`}
                        className="flex justify-between text-sm py-1 border-b border-gray-200 last:border-0"
                      >
                        <span className="text-gray-600">
                          {new Date(payment.createdDate).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                          <span className="ml-2 px-2 py-0.5 bg-gray-200 rounded-full text-xs">
                            {payment.paymentMedium}
                          </span>
                        </span>
                        <span className="text-green-500 font-medium">
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
