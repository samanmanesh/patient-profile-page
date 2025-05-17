import React from "react";
import { Suspense } from "react";
import { PatientsTable } from "../UI/PatientsTable";

async function getPatients(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  const search =
    typeof searchParams.search === "string" ? searchParams.search : "";
  const status =
    typeof searchParams.status === "string" ? searchParams.status : "";
  const page = typeof searchParams.page === "string" ? searchParams.page : "1";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/patients?search=${search}&status=${status}&page=${page}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch patients");
  }

  return res.json();
}

export default function PatientsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Patients</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
          Add New Patient
        </button>
      </div>

      <Suspense fallback={<div className="p-4">Loading patients...</div>}>
        <PatientsTableWrapper searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function PatientsTableWrapper({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const data = await getPatients(searchParams);
  return (
    <div className="p-4">
      <PatientsTable data={data.patients} paginationData={data.pagination} />
    </div>
  );
}
