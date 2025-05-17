
export default function Home() {
  return (
    <div className="flex w-full h-screen bg-white">
      
      <div className="flex-1 h-full p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Welcome to Decoda Health</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quick Stats Cards */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EBEBE8]">
              <h3 className="text-lg font-semibold mb-2">Total Patients</h3>
              <p className="text-3xl font-bold text-primary">0</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EBEBE8]">
              <h3 className="text-lg font-semibold mb-2">Active Cases</h3>
              <p className="text-3xl font-bold text-primary">0</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EBEBE8]">
              <h3 className="text-lg font-semibold mb-2">Recent Updates</h3>
              <p className="text-3xl font-bold text-primary">0</p>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EBEBE8]">
              <p className="text-gray-500">No recent activity to display</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
