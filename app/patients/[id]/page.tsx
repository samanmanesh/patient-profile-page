"use client";

import { Patient } from "@/app/types/patient";
import BreadcrumbNavigator from "@/app/UI/BreadcrumbNavigator";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";




export default function PatientDetail() {
  const params = useParams();
  const patientId = params.id;

  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const getPatient = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patients/${patientId}`);
      const data = await res.json();
      setPatient(data);
    }
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
  }
  

  return (
    <div className="flex w-full h-screen bg-white p-8
    ">
      <BreadcrumbNavigator breadcrumbs={[{ label: "Patients", href: "/patients" }, { label: getPatientName(), href: `/patients/${patientId}` }]} />
    </div>
  );
}
