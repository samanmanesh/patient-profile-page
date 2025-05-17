import React, { useState } from "react";
import { Patient } from "../types/patient";
import { Input } from "@/components/ui/input";
import { cn, getKeyLabel } from "../utils";
import { PencilIcon, SaveIcon, SquarePenIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type PatientInfoProps = {
  patient: Patient;
};

const PatientInfo = ({ patient }: PatientInfoProps) => {
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

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-[#73726E]">Patient Info</h3>
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
            console.log(key, value);
            return (
              <div key={key} className="flex flex-col gap-2 p-4">
                <h4 className="text-sm font-medium text-[#73726E]">
                  {getKeyLabel(key)}
                </h4>
                <Input
                  value={value}
                  
                  disabled={!isEditing}
                  className=" rounded-sm bg-[#F1F1F1] text-black p-2 focus-visible:ring-blue-500 focus-visible:ring-2 disabled:opacity-100 disabled:cursor-not-allowed disabled:bg-[#F1F1F1] disabled:border-none"
                />
              </div>
            );
          }
          return null;
        })}
      </div>
      <div className="flex justify-end">
        <button
          className="rounded-xl bg-emerald-900 text-white  px-3 py-2 hover:bg-emerald-900/80 transition-all duration-300 flex items-center gap-2"
          onClick={() => setIsEditing(false)}
        >
          <SaveIcon className="w-5 h-5" />
          Save
        </button>
      </div>
    </div>
  );
};

export default PatientInfo;
