import React from "react";
import { Suspense } from "react";
import { PatientsTable } from "../UI/PatientsTable";
import { Plus } from "lucide-react";
import Link from "next/link";
import BreadcrumbNavigator from "../UI/BreadcrumbNavigator";
import { getPatients as getPatientData } from "@/app/lib/data";

// Define an interface for patient data from API which may have additional fields
interface PatientWithStatus {
  id: string;
  firstName: string;
  lastName: string;
  status?: string;
}

interface PageParams {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

// Use this helper function to determine if we're on the server side
const isServer = () => typeof window === 'undefined';

async function getPatients(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  try {
    const search =
      typeof searchParams.search === "string" ? searchParams.search : "";
    const status =
      typeof searchParams.status === "string" ? searchParams.status : "";
    const page = typeof searchParams.page === "string" ? searchParams.page : "1";

    // For server-side rendering, try to use our data helper directly
    // This avoids network requests between server components
    if (isServer()) {
      console.log('Server-side: Using direct data access');
      try {
        const patients = await getPatientData();
        // Apply the same filtering logic that would happen in the API
        const filteredPatients = patients.filter(patient => {
          // Simple search implementation - match name or id
          if (search && !`${patient.firstName} ${patient.lastName}`.toLowerCase().includes(search.toLowerCase()) && 
              !patient.id.includes(search)) {
            return false;
          }
          // Status filtering - if using status field
          if (status && (patient as PatientWithStatus).status !== status) {
            return false;
          }
          return true;
        });
        
        // Simple pagination
        const pageSize = 10;
        const pageNumber = parseInt(page, 10) || 1;
        const start = (pageNumber - 1) * pageSize;
        const end = start + pageSize;
        const paginatedPatients = filteredPatients.slice(start, end);
        
        const totalPages = Math.ceil(filteredPatients.length / pageSize);
        
        return {
          patients: paginatedPatients,
          pagination: {
            currentPage: pageNumber,
            pageCount: totalPages,
            totalItems: filteredPatients.length
          }
        };
      } catch (err) {
        console.error('Direct data access failed, falling back to API request', err);
        // Fall through to API request
      }
    }

    // Fix URL construction for both server and client side
    let url: string;
    const apiPath = `/api/patients?search=${search}&status=${status}&page=${page}`;
    
    // When running on server side in Vercel
    if (isServer()) {
      if (process.env.NEXT_PUBLIC_VERCEL_URL) {
        // Use the Vercel URL from environment
        url = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}${apiPath}`;
      } else if (process.env.NEXT_PUBLIC_API_URL) {
        // Use provided API URL if available
        const baseUrl = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
        url = `${baseUrl}${apiPath}`;
      } else {
        // Last resort - use a relative URL but this may fail in server context
        url = apiPath;
        console.warn('No base URL available for server-side request. This may fail.');
      }
    } else {
      // Client-side - we can use relative URLs safely
      url = apiPath;
    }

    // For debugging
    console.log(`Fetching patients from URL: ${url} (server: ${isServer()})`);
    
    const res = await fetch(url, { 
      cache: "no-store",
      // Add headers to help with debugging
      headers: {
        'x-request-source': isServer() ? 'server' : 'client',
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch patients: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error in getPatients:', error);
    // Return a valid but empty response structure to avoid breaking the UI
    return {
      patients: [],
      pagination: {
        currentPage: 1,
        pageCount: 0,
        totalItems: 0
      }
    };
  }
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
  try {
    const data = await getPatients(searchParams);
    return (
      <div className="mt-4">
        <PatientsTable
          data={data.patients}
          pageCount={data.pagination.pageCount}
        />
      </div>
    );
  } catch (err) {
    console.error('Error rendering patients table:', err);
    return (
      <div className="mt-4 p-4 bg-red-50 text-red-700 rounded">
        Error loading patients. Please try again.
      </div>
    );
  }
}
