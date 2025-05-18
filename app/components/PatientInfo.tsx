import React, { Dispatch, useState } from "react";
import { Patient } from "../types/patient";
import { Input } from "@/components/ui/input";
import { cn, getKeyLabel } from "../utils";
import { CheckIcon, Loader2, SaveIcon, SquarePenIcon } from "lucide-react";

type PatientInfoProps = {
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

const PatientInfo = ({
  patient,
  dispatch,
  save,
  isLoading,
  saveSuccess,
}: PatientInfoProps) => {
  const basicInfoToShow: (keyof Patient)[] = [
    "firstName",
    "lastName",
    "dateOfBirth",
    "gender",
    "phoneNumber",
    "email",
    "address",
    "addressLineTwo",
    "city",
    "state",
    "zipCode",
    "country",
    "guardianName",
    "guardianPhoneNumber",
  ];
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (key: keyof Patient, value: string) => {
    dispatch({
      type: "updatePatientField",
      payload: {
        field: key,
        value: value,
      },
    });
  };

  const getInputType = (key: keyof Patient) => {
    switch (key) {
      case "dateOfBirth":
        return "date";
      case "gender":
        return "select";
      case "phoneNumber":
        return "tel";
      default:
        return "text";
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex justify-between items-center">
        <h3 className="px-2 text-lg font-medium text-[#73726E]">Patient Info</h3>
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

      <div className=" grid grid-cols-1 md:grid-cols-3  gap-2 rounded-lg border-2 border-[#F1F1F1]">
        {Object.entries(patient).map(([key, value]) => {
          if (basicInfoToShow.includes(key as keyof Patient)) {
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
                    " rounded-sm bg-white text-black p-2 focus-visible:ring-blue-500 focus-visible:ring-2 disabled:opacity-100 disabled:cursor-not-allowed disabled:bg-stone-500/40 disabled:border-none [&::-webkit-calendar-picker-indicator]:hidden border-2 border-stone-400",
                    isLoading && "opacity-50 cursor-not-allowed"
                  )}
                />
              </div>
            );
          }
          return null;
        })}
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

export default PatientInfo;
