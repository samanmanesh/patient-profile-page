"use client";

import { useParams } from "next/navigation";

export default function PatientDetail() {
  const params = useParams();
  const patientId = params.id;

  return (
    <div className="flex w-full h-screen bg-white">
      <div className="flex-1 h-full p-8">
        <div className="max-w-7xl mx-auto">
          {/* Patient Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Patient Profile</h1>
              <p className="text-gray-500">ID: {patientId}</p>
            </div>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              Edit Profile
            </button>
          </div>

          {/* Patient Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EBEBE8]">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Full Name</label>
                  <p className="font-medium">-</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Date of Birth</label>
                  <p className="font-medium">-</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Gender</label>
                  <p className="font-medium">-</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">
                    Contact Number
                  </label>
                  <p className="font-medium">-</p>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EBEBE8]">
              <h2 className="text-xl font-semibold mb-4">
                Medical Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Blood Type</label>
                  <p className="font-medium">-</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Allergies</label>
                  <p className="font-medium">-</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">
                    Chronic Conditions
                  </label>
                  <p className="font-medium">-</p>
                </div>
              </div>
            </div>

            {/* Recent Visits */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EBEBE8] md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Recent Visits</h2>
              <div className="space-y-4">
                <p className="text-gray-500">No recent visits recorded</p>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EBEBE8] md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Clinical Notes</h2>
              <div className="space-y-4">
                <p className="text-gray-500">No clinical notes available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
