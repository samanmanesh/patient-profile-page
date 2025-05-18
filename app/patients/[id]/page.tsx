"use client";

import QuickActionsBar from "@/app/components/QuickActionsBar";
import { Patient } from "@/app/types/patient";
import Avatar from "@/app/UI/Avatar";
import BreadcrumbNavigator from "@/app/UI/BreadcrumbNavigator";
import { useParams } from "next/navigation";
import { useEffect, useReducer, useState, useCallback, Dispatch } from "react";
import { CreditCard, FileText, PlusIcon } from "lucide-react";
import ActionModal from "@/app/components/ActionModal";
import PatientInfo from "@/app/components/PatientInfo";
import MedicalOverview from "@/app/components/MedicalOverview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notesService } from "@/app/services/notesService";
import { patientService } from "@/app/services/patientService";
import { DoctorNote } from "@/app/types/note";
import Appointments from "@/app/components/Appointments";
import Billing from "@/app/components/Billing";
import Notes from "@/app/components/Notes";
import Alerts from "@/app/components/Alerts";

// Define the action type to match what child components expect
type PatientActionPayload = 
  | Partial<Patient>
  | Patient
  | { field: keyof Patient; value: string; subField?: keyof Patient };

type PatientAction = {
  type: string;
  payload: PatientActionPayload;
};

// Improved reducer with better typing
const patientReducer = (
  state: Patient | null,
  action: PatientAction
): Patient | null => {
  switch (action.type) {
    case "setPatient":
      return action.payload as Patient;

    case "updatePatientField":
      if (!state) return null;
      
      if ("field" in action.payload && "value" in action.payload) {
        return {
          ...state,
          [action.payload.field]: action.payload.value,
          ...(action.payload.subField && {
            [action.payload.subField]: action.payload.value,
          }),
        };
      }
      return state;
    default:
      return state;
  }
};

// Type for quick actions
type QuickAction = {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
};

export default function PatientDetail() {
  const params = useParams();
  const patientId = typeof params.id === 'string' ? params.id : '';
  
  // Fixed reducer typing to match child component expectations
  const [patient, dispatch] = useReducer(patientReducer, null) as [
    Patient | null,
    Dispatch<PatientAction>
  ];
  
  const [notes, setNotes] = useState<DoctorNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Typed actions state
  const [actions, setActions] = useState<QuickAction[]>([
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

  const onChooseActions = (action: QuickAction) => {
    if (action.isActive) {
      setActions(actions.map((a) => ({ ...a, isActive: false })));
    } else {
      setActions(
        actions.map((a) => ({ ...a, isActive: a.label === action.label }))
      );
    }
  };

  // Load patient and notes data
  useEffect(() => {
    // Skip loading for new patient
    if (patientId === "new") return;
    
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch patient data
        const data = await patientService.getPatientById(patientId);
        if (data) {
          dispatch({ type: "setPatient", payload: data });
        } else {
          setError("Patient not found");
        }
        
        // Fetch notes data
        const notesData = await getNotesByPatientId(patientId);
        setNotes(notesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load patient data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [patientId, getNotesByPatientId]);

  // Handle "new" patient route
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

  // Safely get patient name
  const getPatientName = () => {
    return patient ? `${patient.firstName} ${patient.lastName}` : "Patient";
  };

  // Save patient data
  const savePatient = async () => {
    if (!patient || isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await patientService.updatePatient(patientId, patient);
      dispatch({ type: "setPatient", payload: data });
      setSaveSuccess(true);
    } catch (error) {
      console.error("Error updating patient:", error);
      setError("Failed to save patient data");
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 2000);
    }
  };

  // Handle medical action selection
  const handleMedicalActionChoice = (actionLabel: string) => {
    const actionObj = actions.find((a) => a.label === actionLabel);
    if (actionObj) {
      onChooseActions(actionObj);
    }
  };

  // Define tabs with components
  const tabs = [
    {
      label: "Info",
      value: "info",
      component: patient ? (
        <PatientInfo
          patient={patient}
          dispatch={dispatch}
          save={savePatient}
          isLoading={isLoading}
          saveSuccess={saveSuccess}
        />
      ) : null,
    },
    {
      label: "Medical",
      value: "medical",
      component: patient ? (
        <MedicalOverview
          data={{
            patient: patient,
            doctorsNotes: notes,
          }}
          dispatch={dispatch}
          save={savePatient}
          isLoading={isLoading}
          saveSuccess={saveSuccess}
          onChooseActions={handleMedicalActionChoice}
        />
      ) : null,
    },
    {
      label: "Appointments",
      value: "appointments",
      component: patient ? (
        <Appointments
          patient={patient}
        />
      ) : null,
    },
    {
      label: "Billing",
      value: "billing",
      component: patient ? <Billing patient={patient} /> : null,
    },
    {
      label: "Notes",
      value: "notes",
      component: patient ? (
        <Notes
          patient={patient}
          onChooseActions={handleMedicalActionChoice}
        />
      ) : null,
    },
    {
      label: "Alerts",
      value: "alerts",
      component: patient ? <Alerts patient={patient} /> : null,
    },
  ];

  // Show error state if we have an error
  if (error && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h2 className="text-xl font-semibold text-red-600">{error}</h2>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-emerald-600 text-white rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-screen px-8 py-2 items-center relative">
      <div className="flex items-center justify-center gap-3 h-1/12">
        <Avatar
          name={getPatientName()}
          size="lg"
          type="rounded"
          className="text-2xl font-semibold border-2 text-black bg-white"
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
          <Tabs defaultValue="info" className="w-full h-full">
            <TabsList className="w-full">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:bg-emerald-950 data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:border-emerald-950"
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
                    {tab.component || <div>No component for this tab yet</div>}
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
              data={patient}
            />
          )}
        </div>
      )}
    </div>
  );
}
