import React from "react";
import { Suspense } from "react";
import { PatientsTable } from "../UI/PatientsTable";
import { Plus } from "lucide-react";
import Link from "next/link";
import BreadcrumbNavigator from "../UI/BreadcrumbNavigator";

interface PageParams {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

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

export default async function PatientsPage({ searchParams }: PageParams) {
  const params = await searchParams;
  
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
        <PatientsTableWrapper searchParams={params} />
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
    <div className="mt-4">
      <PatientsTable
        data={data.patients}
        pageCount={data.pagination.pageCount}
      />
    </div>
  );
}
