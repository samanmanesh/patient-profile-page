import React, { Dispatch, useState } from "react";
import { Patient } from "../types/patient";
import { cn, getKeyLabel } from "../utils";
import { Input } from "@/components/ui/input";
import { CheckIcon, Loader2, SaveIcon, SquarePenIcon } from "lucide-react";

type Props = {
  patient: Patient;
  dispatch: Dispatch<{
    type: string;
    payload:
      | Partial<Patient>
      | Patient
      | { field: keyof Patient; value: string };
  }>;
  save: () => void;
  isLoading: boolean;
  saveSuccess: boolean;
};

type Vitals = Partial<Patient>["measurements"];

const VitalsSection = ({
  data,
  dispatch,
  isLoading,
  isEditing,
}: {
  data: Vitals | null;
  dispatch: Dispatch<{
    type: string;
    payload:
      | Partial<Patient>
      | Patient
      | { field: keyof Patient; value: string };
  }>;
  isLoading: boolean;
  isEditing: boolean;
}) => {
  return (
    <div className="flex flex-col gap-2 p-4 w-full ">
      <h4 className=" font-medium text-[#73726E]">Vitals / Measurements</h4>
      <div className="flex flex-row gap-4 w-full ">
        {data?.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between items-center gap-4 p-4  rounded-lg bg-[#F1F1F1]/50 w-full "
          >
            <h5 className="text-sm font-medium text-[#73726E] text-nowrap ">
              {getKeyLabel(item.type as keyof typeof getKeyLabel)}:
            </h5>
            <div className="flex  gap-2 w-full">
              <Input
                disabled={!isEditing || isLoading}
                className={cn(
                  " rounded-sm bg-[#F1F1F1] text-black p-2 focus-visible:ring-blue-500 focus-visible:ring-2 disabled:opacity-100 disabled:cursor-not-allowed disabled:bg-[#F1F1F1] disabled:border-none [&::-webkit-calendar-picker-indicator]:hidden",
                  isLoading && "opacity-50 cursor-not-allowed"
                )}
                value={item.value}
                onChange={(e) => {
                  dispatch({
                    type: "updatePatientField",
                    payload: {
                      field: "measurements",
                      value: e.target.value,
                    },
                  });
                }}
              />
              <Input
                disabled={!isEditing || isLoading}
                className={cn(
                  " rounded-sm bg-[#F1F1F1] text-black p-2 focus-visible:ring-blue-500 focus-visible:ring-2 disabled:opacity-100 disabled:cursor-not-allowed disabled:bg-[#F1F1F1] disabled:border-none [&::-webkit-calendar-picker-indicator]:hidden",
                  isLoading && "opacity-50 cursor-not-allowed"
                )}
                value={item.unit}
                type="select"
                onChange={(e) => {
                  dispatch({
                    type: "updatePatientField",
                    payload: {
                      field: "measurements",
                      value: e.target.value,
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

const MedicalOverview = ({
  patient,
  dispatch,
  save,
  isLoading,
  saveSuccess,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const medicalOverviewToShow: (keyof Patient)[] = [
    "measurements",
    "medications",
    "medicalHistory",
    "allergies",
    "familyHistory",
  ];

  return (
    <div className="flex flex-col gap-2 p-4">
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

      <div className="p-2 gap-2 rounded-lg border-2 border-[#F1F1F1]">
        {/* {Object.entries(patient).map(([key, value]) => {
        if (medicalOverviewToShow.includes(key as keyof Patient)) {
          return (
            <div key={key} className="flex flex-col gap-2 p-4">
              <h4 className="text-sm font-medium text-[#73726E]">
                {getKeyLabel(key)}
              </h4>
              <Input
                value={value ?? ""}
                type={getInputType(key as keyof Patient)}
                placeholder={
                  key === "dateOfBirth"
                    ? "MM/DD/YYYY"
                    : key === "phoneNumber"
                    ? "123-456-7890"
                    : ""
                }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleInputChange(key as keyof Patient, e.target.value);
                }}
                disabled={!isEditing || isLoading}
                className={cn(
                  " rounded-sm bg-[#F1F1F1] text-black p-2 focus-visible:ring-blue-500 focus-visible:ring-2 disabled:opacity-100 disabled:cursor-not-allowed disabled:bg-[#F1F1F1] disabled:border-none [&::-webkit-calendar-picker-indicator]:hidden",
                  isLoading && "opacity-50 cursor-not-allowed"
                )}
              />
            </div>
          );
        }
        return null;
      })} */}
        <VitalsSection
          data={patient.measurements}
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
  );
};

export default MedicalOverview;
