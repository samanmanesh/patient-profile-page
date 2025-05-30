import React, { Dispatch, useState } from "react";
import { Medication, Patient, MeasurementUnit } from "../types/patient";
import { cn, getKeyLabel } from "../utils";
import { Input } from "@/components/ui/input";
import {
  CheckIcon,
  FileTextIcon,
  Loader2,
  PillIcon,
  PlusIcon,
  SaveIcon,
  SquarePenIcon,
  UsersIcon,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DoctorNote } from "../types/note/index";

type MedicalOverviewProps = {
  data: {
    patient: Patient;
    doctorsNotes: DoctorNote[];
  };
  dispatch: Dispatch<{
    type: string;
    payload:
      | Partial<Patient>
      | Patient
      | { field: keyof Patient; value: string; subField?: keyof Patient };
  }>;
  save: () => void;
  isLoading: boolean;
  saveSuccess: boolean;
  onChooseActions: (action: string) => void;
};

type Vitals = Partial<Patient>["measurements"];

const VitalsSection = ({
  data,
  dispatch,
  isLoading,
  isEditing,
  patient,
}: {
  data: Vitals | null;
  dispatch: Dispatch<{
    type: string;
    payload:
      | Partial<Patient>
      | Patient
      | { field: keyof Patient; value: string; subField?: keyof Patient };
  }>;
  isLoading: boolean;
  isEditing: boolean;
  patient: Patient;
}) => {
  return (
    <div className="flex flex-col gap-2 p-4 w-full ">
      <div className="flex flex-col gap-2 mb-4">
        <h4 className=" font-semibold text-black/80">Vitals / Measurements</h4>
        <p className="text-sm text-[#73726E] ">
          Patient&apos;s health measurements
        </p>
      </div>
      <div className="flex flex-row gap-4 w-full ">
        {data?.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between items-start gap-4 p-4  rounded-lg bg-[#fbfbfb]/50 w-full  border-2 border-[#F1F1F1] "
          >
            <h5 className="text-sm font-bold  text-nowrap ">
              {getKeyLabel(item.type as keyof typeof getKeyLabel)}:
            </h5>
            <div className="flex  gap-2 w-full">
              <Input
                disabled={!isEditing || isLoading}
                className={cn(
                  " rounded-sm bg-white  text-black p-2 focus-visible:ring-blue-500 focus-visible:ring-2 disabled:opacity-100 disabled:cursor-not-allowed disabled:bg-stone-400/40  [&::-webkit-calendar-picker-indicator]:hidden ",
                  isLoading && "opacity-50 cursor-not-allowed border"
                )}
                value={item.value ?? ""}
                onChange={(e) => {
                  const updatedMeasurements = patient.measurements.map((m) =>
                    m.id === item.id ? { ...m, value: e.target.value } : m
                  );
                  dispatch({
                    type: "setPatient",
                    payload: {
                      ...patient,
                      measurements: updatedMeasurements,
                    },
                  });
                }}
              />
              <Input
                disabled={!isEditing || isLoading}
                className={cn(
                  " rounded-sm bg-white  text-black p-2 focus-visible:ring-blue-500 focus-visible:ring-2 disabled:opacity-100 disabled:cursor-not-allowed disabled:bg-stone-400/40  [&::-webkit-calendar-picker-indicator]:hidden ",
                  isLoading && "opacity-50 cursor-not-allowed border"
                )}
                value={item.unit ?? ""}
                type="select"
                onChange={(e) => {
                  const updatedMeasurements = patient.measurements.map((m) =>
                    m.id === item.id
                      ? { ...m, unit: e.target.value as MeasurementUnit }
                      : m
                  );
                  dispatch({
                    type: "setPatient",
                    payload: {
                      ...patient,
                      measurements: updatedMeasurements,
                    },
                  });
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MedicationsSection = ({
  data,
  dispatch,
  isLoading,
  isEditing,
  patient,
}: {
  data: Medication[] | null;
  dispatch: Dispatch<{
    type: string;
    payload:
      | Partial<Patient>
      | Patient
      | { field: keyof Patient; value: string; subField?: keyof Patient };
  }>;
  isLoading: boolean;
  isEditing: boolean;
  patient: Patient;
}) => {
  const medicationFields = [
    "name",
    "dosage",
    "frequency",
    "startDate",
    "endDate",
    "active",
  ];
  return (
    <div className="flex flex-col gap-2 p-4 w-full ">
      <div className="flex flex-col gap-2 mb-4">
        <h4 className=" font-semibold text-black/80">Medications</h4>
        <p className="text-sm text-[#73726E] ">Current and past medications</p>
      </div>
      <div className="flex flex-row justify-between gap-4 w-full flex-wrap ">
        {data?.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between items-start gap-4 p-4  rounded-lg bg-[#fbfbfb] w-full flex-1 border-2 border-[#F1F1F1] "
          >
            <h4 className="text font-semibold  text-nowrap flex items-center gap-2">
              <PillIcon className="w-6 h-6" /> <span>{item.name}:</span>
            </h4>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
              {Object.entries(item).map(
                ([key, value]) =>
                  medicationFields.includes(key) && (
                    <div
                      key={key}
                      className="flex  items-start flex-col  gap-2"
                    >
                      <h5 className="text-sm font-medium  text-nowrap ">
                        {getKeyLabel(key as keyof Medication)}:
                      </h5>
                      <Input
                        disabled={!isEditing || isLoading}
                        className={cn(
                          " rounded-sm bg-white  text-black p-2 focus-visible:ring-blue-500 focus-visible:ring-2 disabled:opacity-100 disabled:cursor-not-allowed disabled:bg-slate-400/40  [&::-webkit-calendar-picker-indicator]:hidden ",
                          isLoading && "opacity-50 cursor-not-allowed border"
                        )}
                        value={value ?? ""}
                        onChange={(e) => {
                          const updatedMedications = data.map((med) =>
                            med.id === item.id
                              ? { ...med, [key]: e.target.value }
                              : med
                          );
                          dispatch({
                            type: "setPatient",
                            payload: {
                              ...patient,
                              medications: updatedMedications,
                            },
                          });
                        }}
                      />
                    </div>
                  )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MedicalHistorySection = ({
  data,
  dispatch,
  isLoading,
  isEditing,
}: {
  data: {
    patient: Patient;
    doctorsNotes: DoctorNote[];
  };
  dispatch: Dispatch<{
    type: string;
    payload:
      | Partial<Patient>
      | Patient
      | { field: keyof Patient; value: string; subField?: keyof Patient };
  }>;
  isLoading: boolean;
  isEditing: boolean;
}) => {
  const { allergies, familyHistory, medicalHistory } = data.patient ?? {};

  const randomTailwindColor = () => {
    const colors = [
      "bg-red-400/50",
      "bg-blue-400/50",
      "bg-green-400/50",
      "bg-yellow-400/50",
      "bg-purple-400/50",
      "bg-pink-400/50",
      "bg-orange-400/50",
      "bg-teal-400/50",
      "bg-indigo-400/50",
      "bg-violet-400/50",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleArrayUpdate = (
    field: keyof Pick<
      Patient,
      "allergies" | "familyHistory" | "medicalHistory"
    >,
    value: string
  ) => {
    const updatedArray = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    dispatch({
      type: "setPatient",
      payload: {
        ...data.patient,
        [field]: updatedArray,
      },
    });
  };

  return (
    <div className="flex flex-col gap-2 p-4 w-full">
      <div className="flex flex-col gap-2 mb-4">
        <h4 className=" font-semibold text-black/80">Medical History</h4>
        <p className="text-sm text-[#73726E] ">
          Conditions, allergies, and family history
        </p>
      </div>

      <Accordion
        type="multiple"
        defaultValue={["allergies", "family-history", "medical-history"]}
        className="w-full bg-[#fbfbfb] rounded-lg p-4 shadow-sm"
      >
        {/* Allergies Section */}
        <AccordionItem value="allergies">
          <AccordionTrigger className=" font-semibold text-black/80 flex items-center gap-2">
            <div className="flex gap-2">
              <PillIcon className="w-4 h-4" /> <span>Allergies</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pl-4">
              {isEditing ? (
                <Input
                  disabled={isLoading}
                  className={cn(
                    "rounded-sm bg-[#F1F1F1] text-black p-2 focus-visible:ring-blue-500 focus-visible:ring-2 disabled:opacity-100 disabled:cursor-not-allowed disabled:bg-[#F1F1F1] disabled:border-none",
                    isLoading && "opacity-50 cursor-not-allowed"
                  )}
                  value={allergies?.join(", ") ?? ""}
                  onChange={(e) =>
                    handleArrayUpdate("allergies", e.target.value)
                  }
                  placeholder="Enter allergies separated by commas"
                />
              ) : allergies && allergies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {allergies.map((allergy, index) => (
                    <span
                      key={index}
                      className={cn(
                        " text-black  px-3 py-1 rounded-full",
                        randomTailwindColor()
                      )}
                    >
                      {allergy}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#73726E] ">No known allergies</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Family History Section */}
        <AccordionItem value="family-history">
          <AccordionTrigger className="font-semibold text-black flex items-center gap-2">
            <div className="flex gap-2">
              <UsersIcon className="w-4 h-4" />
              <span>Family History</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pl-4">
              {isEditing ? (
                <Input
                  disabled={isLoading}
                  className={cn(
                    "rounded-sm bg-[#F1F1F1] text-black p-2 focus-visible:ring-blue-500 focus-visible:ring-2 disabled:opacity-100 disabled:cursor-not-allowed disabled:bg-[#F1F1F1] disabled:border-none",
                    isLoading && "opacity-50 cursor-not-allowed"
                  )}
                  value={familyHistory?.join(", ") ?? ""}
                  onChange={(e) =>
                    handleArrayUpdate("familyHistory", e.target.value)
                  }
                  placeholder="Enter family history conditions separated by commas"
                />
              ) : familyHistory && familyHistory.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {familyHistory.map((condition, index) => (
                    <span
                      key={index}
                      className={cn(
                        " text-black  px-3 py-1 rounded-full",
                        randomTailwindColor()
                      )}
                    >
                      {condition}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#73726E] ">
                  No significant family history
                </p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Medical History Section */}
        <AccordionItem value="medical-history">
          <AccordionTrigger className="font-semibold text-black/80 flex items-center gap-2">
            <div className="flex gap-2">
              <FileTextIcon className="w-4 h-4" />
              <span>Medical History</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pl-4">
              {isEditing ? (
                <Input
                  disabled={isLoading}
                  className={cn(
                    "rounded-sm bg-[#F1F1F1] text-black p-2 focus-visible:ring-blue-500 focus-visible:ring-2 disabled:opacity-100 disabled:cursor-not-allowed disabled:bg-[#F1F1F1] disabled:border-none",
                    isLoading && "opacity-50 cursor-not-allowed"
                  )}
                  value={medicalHistory?.join(", ") ?? ""}
                  onChange={(e) =>
                    handleArrayUpdate("medicalHistory", e.target.value)
                  }
                  placeholder="Enter medical conditions separated by commas"
                />
              ) : medicalHistory && medicalHistory.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {medicalHistory.map((condition, index) => (
                    <span
                      key={index}
                      className={cn(
                        " text-black/80  px-3 py-1 rounded-full",
                        randomTailwindColor()
                      )}
                    >
                      {condition}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#73726E] ">
                  No significant medical history
                </p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

const MedicalOverview = ({
  data,
  dispatch,
  save,
  isLoading,
  saveSuccess,
  onChooseActions,
}: MedicalOverviewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { patient, doctorsNotes } = data ?? {};

  return (
    <div className="flex flex-col gap-12 p-4">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h3 className="px-2 text-lg font-medium text-[#73726E]">
            Medical Overview
          </h3>
          <button
            className="rounded-lg gap-2 flex items-center cursor-pointer hover:scale-105 transition-all duration-300 p-1 "
            onClick={() => setIsEditing(!isEditing)}
          >
            <SquarePenIcon
              className={cn(
                "w-5 h-5 text-[#73726E] ",
                isEditing && "text-[#000000]"
              )}
            />
          </button>
        </div>

        <div className="p-4 gap-2 rounded-lg border-2 border-[#F1F1F1]">
          <VitalsSection
            data={patient.measurements}
            dispatch={dispatch}
            isLoading={isLoading}
            isEditing={isEditing}
            patient={patient}
          />
          <hr className="w-full border-t-2 border-[#F1F1F1] my-4" />
          <MedicationsSection
            data={patient.medications}
            dispatch={dispatch}
            isLoading={isLoading}
            isEditing={isEditing}
            patient={patient}
          />
          <hr className="w-full border-t-2 border-[#F1F1F1] my-4" />
          <MedicalHistorySection
            data={data}
            dispatch={dispatch}
            isLoading={isLoading}
            isEditing={isEditing}
          />
        </div>
        <div className="flex justify-end">
          <button
            className={cn(
              "rounded-xl bg-emerald-900 text-white  px-3 py-2 hover:bg-emerald-900/80 transition-all duration-300 flex items-center gap-2",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
            disabled={isLoading}
            onClick={() => {
              if (isLoading) return;
              setIsEditing(false);
              save();
            }}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : saveSuccess ? (
              <>
                <CheckIcon className="w-5 h-5" />
                Saved
              </>
            ) : (
              <>
                <SaveIcon className="w-5 h-5" />
                Save
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h3 className="px-2 text-lg font-medium text-[#73726E]">
            Clinical Notes
          </h3>
          <div className="flex gap-2">
            <button
              className="rounded-lg gap-2 flex items-center cursor-pointer hover:scale-105 transition-all duration-300 p-1 font-medium text-black/60 "
              onClick={() => onChooseActions("Doctor Note")}
            >
              <PlusIcon className="w-4 h-4" />
              Add Note
            </button>
          </div>
        </div>
        <div className="p-6 flex flex-col gap-12 rounded-lg border-2 border-[#F1F1F1]">
          {doctorsNotes.map((note) => (
            <div
              key={note.id}
              className="flex flex-col gap-2 p-4 rounded-lg bg-[#fbfbfb]"
            >
              <div className="flex gap-4 items-center px-2">
                <FileTextIcon className="w-6 h-6 flex-shrink-0" />
                <h4 className="text-lg font-medium overflow-hidden text-ellipsis whitespace-wrap">
                  {note.summary}
                </h4>
              </div>
              <p className="text-sm text-[#73726E] px-2">
                {new Date(note.createdDate).toLocaleDateString()}
              </p>
              <textarea
                className="bg-white text-neutral-800 border-2 border-[#F1F1F1] rounded-lg p-4 resize-none h-80 w-full"
                value={note.content}
                disabled={true}
              ></textarea>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicalOverview;
