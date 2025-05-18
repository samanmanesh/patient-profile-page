import React, { useCallback, useState, useEffect } from "react";
import { Patient } from "../types/patient";
import { CreditCard, MessageSquare, NotebookPen } from "lucide-react";
import { memoService } from "../services/memoService";
import { notesService } from "../services/notesService";
import { billingService } from "../services/billingService";
import { PaymentMethod } from "../types/billing";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NewMemoForm = ({
  patient,
  onClose,
}: {
  patient: Patient | null;
  onClose: () => void;
}) => {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [creator, setCreator] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient || !note.trim()) return;

    setLoading(true);
    try {
      const patientData = {
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        phoneNumber: patient.phoneNumber,
      };

      const memoData = {
        patient: patientData,
        note,
        creator,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      };

      await memoService.createMemo(memoData);

      onClose();
    } catch (error) {
      console.error("Error creating memo:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="creator-name" className="font-medium">
          Creator
        </label>
        <div className="flex gap-2">
          <Input
            id="creator-firstname"
            className="border rounded-md p-2 flex-1 bg-white"
            placeholder="First Name"
            value={creator.firstName}
            onChange={(e) =>
              setCreator({ ...creator, firstName: e.target.value })
            }
            required
          />
          <Input
            id="creator-lastname"
            className="border rounded-md p-2 flex-1 bg-white"
            placeholder="Last Name"
            value={creator.lastName}
            onChange={(e) =>
              setCreator({ ...creator, lastName: e.target.value })
            }
            required
          />
        </div>
        <Input
          id="creator-email"
          type="email"
          className="border rounded-md p-2 bg-white"
          placeholder="Email"
          value={creator.email}
          onChange={(e) => setCreator({ ...creator, email: e.target.value })}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="memo-text" className="font-medium">
          Memo Content
        </label>
        <textarea
          id="memo-text"
          className="border  rounded-lg p-2 min-h-[150px] bg-white "
          placeholder="Enter memo details here..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          required
        />
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-xl hover:bg-black/80 hover:text-white cursor-pointer transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={
            loading ||
            !note.trim() ||
            !creator.firstName.trim() ||
            !creator.lastName.trim() ||
            !creator.email.trim()
          }
          className="px-4 py-2 bg-emerald-900 text-white rounded-xl disabled:bg-black/30  cursor-pointer hover:bg-emerald-900/95 hover:scale-105 transition-all"
        >
          {loading ? "Saving..." : "Save Memo"}
        </button>
      </div>
    </form>
  );
};

const DoctorNoteForm = ({
  patient,
  onClose,
}: {
  patient: Patient | null;
  onClose: () => void;
}) => {
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [providerName, setProviderName] = useState("");
  const [providerNames, setProviderNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addProvider = () => {
    if (
      providerName.trim() !== "" &&
      !providerNames.includes(providerName.trim())
    ) {
      setProviderNames([...providerNames, providerName.trim()]);
      setProviderName("");
    }
  };

  const removeProvider = (name: string) => {
    setProviderNames(providerNames.filter((provider) => provider !== name));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient || !content.trim() || providerNames.length === 0) return;

    setLoading(true);
    try {
      const noteData = {
        content,
        summary:
          summary ||
          content.substring(0, 100) + (content.length > 100 ? "..." : ""),
        patient,
        providerNames,
      };

      await notesService.createNote(noteData);

      onClose();
    } catch (error) {
      console.error("Error creating doctor note:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="provider-name" className="font-medium">
          Provider Names
        </label>
        <div className="flex gap-2">
          <Input
            id="provider-name"
            className="border rounded-lg p-2 bg-white flex-1"
            placeholder="Enter provider name"
            value={providerName}
            onChange={(e) => setProviderName(e.target.value)}
          />
          <button
            type="button"
            onClick={addProvider}
            className="px-3 py-1 bg-[#2483E2] text-white rounded-xl hover:bg-[#2483E2]/95"
          >
            Add
          </button>
        </div>

        {providerNames.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {providerNames.map((name, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded-lg"
              >
                <span>{name}</span>
                <button
                  type="button"
                  onClick={() => removeProvider(name)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {providerNames.length === 0 && (
          <p className="text-xs text-red-500 mt-1">
            At least one provider name is required
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="note-summary" className="font-medium">
          Summary
        </label>
        <Input
          id="note-summary"
          className="border rounded-lg p-2 bg-white"
          placeholder="Brief summary of the note"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="note-content" className="font-medium">
          Note Content
        </label>
        <textarea
          id="note-content"
          className="border rounded-lg p-2 min-h-[150px] bg-white"
          placeholder="Enter clinical note details here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-xl hover:bg-black/80 hover:text-white cursor-pointer transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || providerNames.length === 0}
          className="px-4 py-2 bg-emerald-900 text-white rounded-xl disabled:bg-black/30 cursor-pointer hover:bg-emerald-900/95 hover:scale-105 transition-all"
        >
          {loading ? "Saving..." : "Save Note"}
        </button>
      </div>
    </form>
  );
};

const PaymentForm = ({
  patient,
  onClose,
}: {
  patient: Patient | null;
  onClose: () => void;
}) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMethods, setLoadingMethods] = useState(false);

  const loadPaymentMethods = useCallback(async () => {
    if (!patient) return;

    setLoadingMethods(true);
    try {
      const methods = await billingService.getPatientPaymentMethods(patient.id);
      setPaymentMethods(methods);
      if (methods.length > 0) {
        // Select default payment method if available
        const defaultMethod = methods.find((m) => m.isDefault);
        setSelectedMethod(defaultMethod ? defaultMethod.id : methods[0].id);
      }
    } catch (error) {
      console.error("Error loading payment methods:", error);
    } finally {
      setLoadingMethods(false);
    }
  }, [patient]);

  useEffect(() => {
    if (patient) {
      loadPaymentMethods();
    }
  }, [patient, loadPaymentMethods]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient || !amount || !description || !selectedMethod) return;

    setLoading(true);
    try {
      // This is just a simulation since we don't have a complete payment API
      console.log("Processing payment:", {
        patientId: patient.id,
        amount: parseFloat(amount),
        description,
        paymentMethodId: selectedMethod,
      });

      // Add a short delay to simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onClose();
    } catch (error) {
      console.error("Error processing payment:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPaymentMethod = (method: PaymentMethod) => {
    if (method.type === "CARD") {
      return `${method.brand || "Card"} •••• ${method.last4 || "****"}`;
    } else if (method.type === "BANK_ACCOUNT") {
      return `${method.bankName || "Bank"} •••• ${
        method.accountNumberLast4 || "****"
      }`;
    }
    return "Unknown payment method";
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="amount" className="font-medium">
          Amount ($)
        </label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0.01"
          className="border rounded-md p-2 bg-white"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="font-medium">
          Description
        </label>
        <Input
          id="description"
          className="border rounded-lg p-2 bg-white"
          placeholder="e.g., Office visit fee"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="payment-method" className="font-medium">
          Payment Method
        </label>
        {loadingMethods ? (
          <p className="text-sm text-gray-500">Loading payment methods...</p>
        ) : paymentMethods.length > 0 ? (
          <Select
            value={selectedMethod}
            onValueChange={(value) => setSelectedMethod(value)}
            required
          >
            <SelectTrigger className="border rounded-lg p-2 bg-white w-full">
              <SelectValue placeholder="Select a payment method" />
            </SelectTrigger>
            <SelectContent>
              {paymentMethods.map((method) => (
                <SelectItem key={method.id} value={method.id}>
                  {formatPaymentMethod(method)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <p className="text-sm text-gray-500">No payment methods available</p>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-xl hover:bg-black/80 hover:text-white cursor-pointer transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={
            loading || paymentMethods.length === 0 || !amount || !selectedMethod
          }
          className="px-4 py-2 bg-emerald-900 text-white rounded-xl disabled:bg-black/30 cursor-pointer hover:bg-emerald-900/95 hover:scale-105 transition-all"
        >
          {loading ? "Processing..." : "Charge Payment"}
        </button>
      </div>
    </form>
  );
};

type ActionModalProps = {
  onClose: () => void;
  action: string;
  data: Patient | null;
};

const ActionModal = ({ onClose, action, data }: ActionModalProps) => {
  const renderActionIcon = () => {
    switch (action) {
      case "New Memo":
        return <MessageSquare className="w-6 h-6" />;
      case "Doctor Note":
        return <NotebookPen className="w-6 h-6" />;
      case "Charge a payment":
        return <CreditCard className="w-6 h-6" />;
      default:
        return null;
    }
  };

  const renderActionContent = () => {
    switch (action) {
      case "New Memo":
        return <NewMemoForm patient={data} onClose={onClose} />;
      case "Doctor Note":
        return <DoctorNoteForm patient={data} onClose={onClose} />;
      case "Charge a payment":
        return <PaymentForm patient={data} onClose={onClose} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-1/3 h-full bg-[#EBEBE8] rounded-lg p-4 transition-all duration-300">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-2 border-b-2 border-gray-500 pb-4">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            {renderActionIcon()}
            {action}
          </h1>
        </div>
        {renderActionContent()}
      </div>
    </div>
  );
};

export default ActionModal;
