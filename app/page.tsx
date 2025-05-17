import Sidebar from "./components/Sidebar";

export default function Home() {
  return (
    <div className="flex w-full h-screen bg-white">
      <div className="w-1/12 h-full ">
        <Sidebar />
      </div>
      <div className="w-11/12 h-full ">
        <div className="w-full h-full">
          <h1>Hello</h1>
        </div>
      </div>
    </div>
  );
}
