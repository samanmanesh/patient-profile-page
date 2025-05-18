import React, { useEffect, useState } from "react";
import { Patient } from "../types/patient";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tabs } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { DoctorNote } from "../types/note";
import { Memo } from "../types/memo";
import { notesService } from "../services/notesService";

type NotesProps = {
  patient: Patient;
};

const Notes = ({ patient }: NotesProps) => {
  const [notes, setNotes] = useState<DoctorNote[]>([]);
  const [memos, setMemos] = useState<Memo[]>([]);
  const [clinicalNotes, setClinicalNotes] = useState<DoctorNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const notes = await notesService.getNotesByPatientId(patient.id);
        setNotes(notes);
      } catch (error) {
        setError("Failed to fetch notes");
        console.error("Error fetching notes:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchNotes();
  }, [patient.id]);
        console.log("notes", notes);
  console.log("patient", patient);
  const tabs = [
    { lable: "All Notes", value: "allNotes" },
    { lable: "Memos", value: "memos" },
    { lable: "Clinical Notes", value: "clinicalNotes" },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col h-full gap-4">
        <div className="flex justify-between px-2">
          <h3 className="px-2 text-lg font-medium text-[#73726E]">Notes</h3>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading notes...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex justify-between px-2">
        <h3 className="px-2 text-lg font-medium text-[#73726E]">
          Appointments
        </h3>
        <button className="flex items-center ">
          <Plus className="w-4 h-4 mr-1" />
          Add Note
        </button>
      </div>

      <div className="p-4 gap-12 rounded-lg border-2 border-[#F1F1F1] w-full  flex flex-col">
        <Tabs defaultValue="allNotes" className=" rounded-lg  ">
          <TabsList className=" bg-white shadow-none w-xs">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="shadow-none drop-shadow-none rounded-t-xl  px-2 bg-none data-[state=active]:shadow-none data-[state=active]:bg-black data-[state=active]:text-white"
              >
                {tab.lable}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className="w-full h-full overflow-auto p-6 bg-neutral-100 rounded-lg"
            >
              <div>
                <h1 className="text-lg font-medium ">{tab.lable}</h1>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Notes;
