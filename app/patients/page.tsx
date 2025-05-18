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

  // Fix URL construction for both server and client side
  let url: string;
  
  // When running on server side in Vercel
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    // Use the Vercel URL from environment
    url = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/patients?search=${search}&status=${status}&page=${page}`;
  } else if (process.env.NEXT_PUBLIC_API_URL) {
    // Use provided API URL if available
    const baseUrl = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, ''); // Remove trailing slash if present
    url = `${baseUrl}/api/patients?search=${search}&status=${status}&page=${page}`;
  } else {
    // Fall back to relative URL (only works in browser context)
    url = `/api/patients?search=${search}&status=${status}&page=${page}`;
  }

  // For debugging
  console.log('Fetching from URL:', url);
  
  const res = await fetch(url, { cache: "no-store" });

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
