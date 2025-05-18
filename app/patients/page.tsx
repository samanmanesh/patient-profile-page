import React from "react";
import { Suspense } from "react";
import { PatientsTable } from "../UI/PatientsTable";
import { Plus } from "lucide-react";
import Link from "next/link";
import BreadcrumbNavigator from "../UI/BreadcrumbNavigator";
import patientService from "../services/patientService";

export default async function PatientsPage() {
  const page = 1;
  const limit = 10;
  
  const patients = await patientService.getAllPatients({
    page,
    limit,
  });
  
  // Calculate total pages based on pagination
  const allPatients = await patientService.getAllPatients();
  const pageCount = Math.ceil(allPatients.length / limit);
  
  const data = {
    patients,
    pagination: {
      pageCount
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center ">
        <BreadcrumbNavigator
          breadcrumbs={[{ label: "Patients", href: "/patients" }]}
        />
        <Link href="/patients/new">
          <button className="bg-[#007AFF] text-sm font-medium text-white px-2 py-1 rounded-lg hover:bg-[#007AFF]/90 transition-colors flex items-center gap-1 cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>New Patient</span>
          </button>
        </Link>
      </div>

      <Suspense fallback={<div className="p-4">Loading patients...</div>}>
        <PatientsTable
          data={data.patients}
          pageCount={data.pagination.pageCount}
        />
      </Suspense>
    </div>
  );
}
