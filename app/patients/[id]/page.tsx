"use client";

import QuickActionsBar from "@/app/components/QuickActionsBar";
import { Patient } from "@/app/types/patient";
import Avatar from "@/app/UI/Avatar";
import BreadcrumbNavigator from "@/app/UI/BreadcrumbNavigator";
import { useParams } from "next/navigation";
import { Reducer, useEffect, useReducer, useState, useCallback } from "react";
import { CreditCard, FileText, PlusIcon } from "lucide-react";
import ActionModal from "@/app/components/ActionModal";
import PatientInfo from "@/app/components/PatientInfo";
import MedicalOverview from "@/app/components/MedicalOverview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notesService } from "@/app/services/notesService";
import { DoctorNote } from "@/app/types/note";
import Appointments from "@/app/components/Appointments";
import Billing from "@/app/components/Billing";
import Notes from "@/app/components/Notes";
import Alerts from "@/app/components/Alerts";

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
  const [notes, setNotes] = useState<DoctorNote[]>([]);

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
  const getNotesByPatientId = useCallback(
    (id: string) => notesService.getNotesByPatientId(id),
    []
  );

  const onChooseActions = (action: {
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
  }) => {
    if (action.isActive) {
      setActions(actions.map((a) => ({ ...a, isActive: false })));
    } else {
      setActions(
        actions.map((a) => ({ ...a, isActive: a.label === action.label }))
      );
    }
  };

  useEffect(() => {
    const getPatient = async () => {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/patients/${patientId}`
      );
      const data = await res.json();
      console.log("patient data", data);
      dispatch({ type: "setPatient", payload: data });
      setIsLoading(false);
    };
    console.log("patientId", patientId);
    getPatient();
    getNotesByPatientId(patientId as string)
      .then((notes: DoctorNote[]) => {
        setNotes(notes);
      })
      .catch((error: Error) => {
        console.error("Error fetching notes:", error);
      });
  }, [patientId, getNotesByPatientId]);

  if (patientId === "new") {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 relative">
        <div className="absolute top-8 left-8 hidden lg:block">
        <BreadcrumbNavigator
          breadcrumbs={[
            { label: "Patients", href: "/patients" },
            { label: "New Patient", href: "/patients/new" },
          ]}
        />
        </div>
        <h1 className="text-3xl font-bold text-center">New Patient</h1>
        <div className="text-center text-gray-500 text-lg">
          Feature will be added soon ...
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

  // Create a wrapper function that converts string to object format
  const handleMedicalActionChoice = (action: string) => {
    const actionObj = actions.find((a) => a.label === action);
    if (actionObj) {
      onChooseActions(actionObj);
    }
  };

  const tabs = [
    {
      label: "Info",
      value: "info",
      component: (
        <PatientInfo
          patient={patient as Patient}
          dispatch={dispatch}
          save={savePatient}
          isLoading={isLoading}
          saveSuccess={saveSuccess}
        />
      ),
    },
    {
      label: "Medical",
      value: "medical",
      component: (
        <MedicalOverview
          data={{
            patient: patient as Patient,
            doctorsNotes: notes,
          }}
          dispatch={dispatch}
          save={savePatient}
          isLoading={isLoading}
          saveSuccess={saveSuccess}
          onChooseActions={handleMedicalActionChoice}
        />
      ),
    },
    {
      label: "Appointments",
      value: "appointments",
      component: (
        <Appointments
          patient={patient as Patient}
          
          
        />
      ),
    },
    {
      label: "Billing",
      value: "billing",
      component: <Billing patient={patient as Patient} />,
    },
    {
      label: "Notes",
      value: "notes",
      component: (
        <Notes
          patient={patient as Patient}
          onChooseActions={handleMedicalActionChoice}
        />
      ),
    },
    {
      label: "Alerts",
      value: "alerts",
      component: <Alerts patient={patient as Patient} />,
    },
  ];

  return (
    <div className="flex flex-col w-full h-screen px-8 py-2 items-center relative">
      <div className="flex  items-center justify-center gap-3 h-1/12">
        <Avatar
          name={getPatientName()}
          size="lg"
          type="rounded"
          className="text-2xl font-semibold border-2 text-black bg-white "
        />
        <h1 className="text-2xl font-medium">{getPatientName()}</h1>
      </div>

      <BreadcrumbNavigator
        breadcrumbs={[
          { label: "Patients", href: "/patients" },
          { label: getPatientName(), href: `/patients/${patientId}` },
        ]}
        className="absolute top-8 left-8 hidden lg:block"
      />

      <QuickActionsBar
        actionsButton={actions}
        onChooseActions={onChooseActions}
      />

      {isLoading ? (
        <div className="w-full h-11/12 flex items-center justify-center">
          <div className="animate-pulse">Loading patient data...</div>
        </div>
      ) : (
        <div className="w-full h-5/6 flex gap-4 py-4 overflow-auto">
          <Tabs defaultValue="info" className="w-full h-full ">
            <TabsList className="w-full ">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:bg-emerald-950 data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:border-emerald-950 "
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {patient && (
              <>
                {tabs.map((tab) => (
                  <TabsContent
                    key={tab.value}
                    value={tab.value}
                    className="w-full h-full overflow-auto p-6"
                  >
                    {tab?.component || <div>No component for this tab yet</div>}
                  </TabsContent>
                ))}
              </>
            )}
          </Tabs>
          {actions.find((a) => a.isActive) && (
            <ActionModal
              onClose={() => {
                setActions(actions.map((a) => ({ ...a, isActive: false })));
              }}
              action={actions.find((a) => a.isActive)?.label || ""}
              data={patient || null}
            />
          )}
        </div>
      )}
    </div>
  );
}
