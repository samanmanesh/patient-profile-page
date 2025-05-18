"use client";

import QuickActionsBar from "@/app/components/QuickActionsBar";
import { Patient } from "@/app/types/patient";
import Avatar from "@/app/UI/Avatar";
import BreadcrumbNavigator from "@/app/UI/BreadcrumbNavigator";
import { useParams } from "next/navigation";
import { Reducer, useEffect, useReducer, useState } from "react";
import { CreditCard, FileText, PlusIcon } from "lucide-react";
import ActionModal from "@/app/components/ActionModal";
import PatientInfo from "@/app/components/PatientInfo";
import MedicalOverview from "@/app/components/MedicalOverview";

const patientReducer = (
  state: Patient | null,
  action: {
    type: string;
    payload:
      | Partial<Patient>
      | Patient
      | { field: keyof Patient; value: string; subField?: keyof Patient };
  }
) => {
  switch (action.type) {
    case "setPatient":
      return action.payload as Patient;

    case "updatePatientField":
      if ("field" in action.payload && "value" in action.payload) {
        return {
          ...state,
          [action.payload.field]: action.payload.value,
          ...(action.payload.subField &&
            state &&
            action.payload.subField in state && {
              [action.payload.subField]: action.payload.value,
            }),
        } as Patient;
      }
      return state;
    default:
      return state;
  }
};
export default function PatientDetail() {
  const params = useParams();
  const patientId = params.id;
  const [patient, dispatch] = useReducer(
    patientReducer as Reducer<
      Patient | null,
      {
        type: string;
        payload:
          | Partial<Patient>
          | Patient
          | { field: keyof Patient; value: string; subField?: keyof Patient };
      }
    >,
    null
  );
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
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
      isActive: true,
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
    setIsLoading(true);
    const getPatient = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/patients/${patientId}`
      );
      const data = await res.json();
      dispatch({ type: "setPatient", payload: data });
      setIsLoading(false);
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

  const savePatient = async () => {
    if (!patient || isLoading) return;
    setIsLoading(true);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/patients/${patientId}`,
      {
        method: "PUT",
        body: JSON.stringify(patient),
      }
    );
    const data = await res.json();
    console.log("updated patient", data);
    dispatch({ type: "setPatient", payload: data });
    setIsLoading(false);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col w-full h-screen px-8 py-2 items-center relative">
      <div className="flex  items-center justify-center gap-3 h-1/6">
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

      <div className="w-full h-5/6  flex gap-4 py-4 ">
        <div className="w-full flex flex-col gap-8 overflow-auto">
          {patient && (
            <PatientInfo
              patient={patient}
              dispatch={dispatch}
              save={savePatient}
              isLoading={isLoading}
              saveSuccess={saveSuccess}
            />
          )}
          {patient && (
            <MedicalOverview
              patient={patient}
              dispatch={dispatch}
              save={savePatient}
              isLoading={isLoading}
              saveSuccess={saveSuccess}
            />
          )}
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
