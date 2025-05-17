"use client";

import QuickActionsBar from "@/app/components/QuickActionsBar";
import { Patient } from "@/app/types/patient";
import Avatar from "@/app/UI/Avatar";
import BreadcrumbNavigator from "@/app/UI/BreadcrumbNavigator";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CreditCard, FileText, PlusIcon } from "lucide-react";
import ActionModal from "@/app/components/ActionModal";

export default function PatientDetail() {
  const params = useParams();
  const patientId = params.id;
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  const [actions, setActions] = useState<
    {
      label: string;
      icon: React.ReactNode;
      isActive: boolean;
    }[]
  >([
    {
      label: "New Memo",
      icon: <PlusIcon className="w-4 h-4" />,
      isActive: false,
    },
    {
      label: "Doctor Note",
      icon: <FileText className="w-4 h-4" />,
      isActive: false,
    },
    {
      label: "Charge a payment",
      icon: <CreditCard className="w-4 h-4" />,
      isActive: false,
    },
  ]);

  const onChooseActions = (action: {
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
  }) => {
    setActions(
      actions.map((a) => ({ ...a, isActive: a.label === action.label }))
    );
  };

  useEffect(() => {
    const getPatient = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/patients/${patientId}`
      );
      const data = await res.json();
      setPatient(data);
    };
    getPatient();
  }, [patientId]);

  if (patientId === "new") {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-3xl font-bold text-center">New Patient</h1>
        <div className="text-center text-gray-500 text-lg">
          Feature Will Be Added Soon ...
        </div>
      </div>
    );
  }

  const getPatientName = () => {
    if (!patient) return "";
    return `${patient?.firstName} ${patient?.lastName}`;
  };

  return (
    <div
      className="flex flex-col w-full h-screen p-8 items-center relative
    "
    >
      <div className="flex  items-center justify-center gap-3">
        <Avatar
          name={getPatientName()}
          size="xl"
          type="rounded"
          className="text-3xl font-semibold  border text-black"
          bgColor="#ffffff"
        />
        <h1 className="text-3xl font-medium">{getPatientName()}</h1>
      </div>

      <BreadcrumbNavigator
        breadcrumbs={[
          { label: "Patients", href: "/patients" },
          { label: getPatientName(), href: `/patients/${patientId}` },
        ]}
        className="absolute top-8 left-8"
      />

      <QuickActionsBar
        patientId={patientId as string}
        actionsButton={actions}
        onChooseActions={onChooseActions}
      />

      <div className="w-full h-full  flex gap-4 p-4">
        <div className="w-full h-full">
          
        

        
        </div>
        <ActionModal
          isOpen={isActionModalOpen}
          onClose={() => setIsActionModalOpen(false)}
          action={actions.find((a) => a.isActive)?.label || ""}
          data={patient || null}
        />
      </div>
    </div>
  );
}
