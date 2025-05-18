import React, { useEffect, useState } from "react";
import { Patient } from "../types/patient";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tabs } from "@/components/ui/tabs";
import { MessageSquare, NotebookPenIcon, Plus, UserIcon } from "lucide-react";
import { DoctorNote } from "../types/note";
import { Memo } from "../types/memos";
import { notesService } from "../services/notesService";
import { memoService } from "../services/memoService";

type NotesProps = {
  patient: Patient;
};

// Type guard to check if a note is a DoctorNote
const isDoctorNote = (note: DoctorNote | Memo): note is DoctorNote => {
  return (note as DoctorNote).content !== undefined;
};

const Notes = ({ patient }: NotesProps) => {
  const [allNotes, setAllNotes] = useState<(DoctorNote | Memo)[]>([]);
  const [memos, setMemos] = useState<Memo[]>([]);
  const [clinicalNotes, setClinicalNotes] = useState<DoctorNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const notesData = await notesService.getNotesByPatientId(patient.id);
        const memosData = await memoService.getMemosByPatientId(patient.id);

        setClinicalNotes(notesData);
        setMemos(memosData);

        //In descending order (newest first)
        const combined = [...notesData, ...memosData].sort((a, b) => {
          const dateA = isDoctorNote(a)
            ? new Date(a.createdDate).getTime()
            : new Date(a.createdDate).getTime();
          const dateB = isDoctorNote(b)
            ? new Date(b.createdDate).getTime()
            : new Date(b.createdDate).getTime();
          return dateB - dateA;
        });

        setAllNotes(combined);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [patient.id]);

  const tabs = [
    { lable: "All Notes", value: "allNotes" },
    { lable: "Memos", value: "memos" },
    { lable: "Clinical Notes", value: "clinicalNotes" },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderNote = (note: DoctorNote | Memo) => {
    if (isDoctorNote(note)) {
      //Render Doctor Note
      return (
        <div
          key={note.id}
          className="bg-white p-4 rounded-md shadow-sm flex flex-col gap-2"
        >
          <div className="flex justify-between mb-2">
            <div className="flex gap-2 items-center">
              <NotebookPenIcon className="w-4 h-4 flex-shrink-0" />
              <h3 className="font-medium">{note.summary}</h3>
            </div>
            <span className="text-sm text-gray-500 flex-shrink-0">
              {note.createdDate && formatDate(note.createdDate)}
            </span>
          </div>
          <p className="text-sm text-gray-700 mb-3">{note.content}</p>
          <div className="flex gap-2 mb-2">
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full flex gap-2 items-center">
              <UserIcon className="w-4 h-4" />
              <span>By: {note.providerNames.join(", ")}</span>
            </span>
          </div>
        </div>
      );
    } else {
      // Render Memo
      return (
        <div
          key={note.id}
          className="bg-white p-4 rounded-md  border-l-4 border-blue-800"
        >
          <div className="flex justify-between mb-2">
            <div className="flex gap-2 items-center">
              <MessageSquare className="w-4 h-4" />
              <h3 className="font-medium">{`Note for ${note.patient.firstName} ${note.patient.lastName}`}</h3>
            </div>
            <span className="text-sm text-gray-500">
              {formatDate(note.createdDate)}
            </span>
          </div>
          <div className="flex gap-2 mb-2">
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full flex gap-2 ">
              <UserIcon className="w-4 h-4" />
              <span className="items-center">
                By: {note.creator.firstName} {note.creator.lastName}
              </span>
            </span>
          </div>
          <p className="text-sm text-gray-700">{note.note}</p>
        </div>
      );
    }
  };

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
        <h3 className="px-2 text-lg font-medium text-[#73726E]">Notes</h3>
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

          <TabsContent
            value="allNotes"
            className="w-full h-full overflow-auto p-6 bg-neutral-100 rounded-lg"
          >
            <div>
              <h1 className="text-lg font-medium mb-4">All Notes</h1>
              {allNotes.length === 0 ? (
                <p className="text-gray-500">
                  No notes found for this patient.
                </p>
              ) : (
                <div className="space-y-4">
                  {allNotes.map((note) => renderNote(note))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent
            value="memos"
            className="w-full h-full overflow-auto p-6 bg-neutral-100 rounded-lg"
          >
            <div>
              <h1 className="text-lg font-medium mb-4">Memos</h1>
              {memos.length === 0 ? (
                <p className="text-gray-500">
                  No memos found for this patient.
                </p>
              ) : (
                <div className="space-y-4">
                  {memos.map((memo) => (
                    <div
                      key={memo.id}
                      className="bg-white p-4 rounded-md  border-l-4 border-blue-800"
                    >
                      <div className="flex justify-between mb-2">
                        <div className="flex gap-2 items-center">
                          <MessageSquare className="w-4 h-4" />
                          <h3 className="font-medium">
                            {`Note for ${memo.patient.firstName} ${memo.patient.lastName}`}
                          </h3>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(memo.createdDate)}
                        </span>
                      </div>
                      <div className="flex gap-2 mb-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full flex gap-2 items-center">
                          <UserIcon className="w-4 h-4" />
                          <span>
                            By: {memo.creator.firstName} {memo.creator.lastName}
                          </span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{memo.note}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent
            value="clinicalNotes"
            className="w-full h-full overflow-auto p-6 bg-neutral-100 rounded-lg"
          >
            <div>
              <h1 className="text-lg font-medium mb-4">Clinical Notes</h1>
              {clinicalNotes.length === 0 ? (
                <p className="text-gray-500">
                  No clinical notes found for this patient.
                </p>
              ) : (
                <div className="space-y-4">
                  {clinicalNotes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-white p-4 rounded-md  border-l-4 border-emerald-800 flex flex-col gap-2"
                    >
                      <div className="flex justify-between mb-2">
                        <div className="flex gap-2 items-center">
                          <NotebookPenIcon className="w-4 h-4 flex-shrink-0" />
                          <h3 className="font-medium">{note.summary}</h3>
                        </div>
                        <span className="text-sm text-gray-500 flex-shrink-0">
                          {note.createdDate && formatDate(note.createdDate)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{note.content}</p>
                      <div className="flex gap-2 mb-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full flex gap-2 items-center">
                          <UserIcon className="w-4 h-4" />
                          <span>By: {note.providerNames.join(", ")}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Notes;
