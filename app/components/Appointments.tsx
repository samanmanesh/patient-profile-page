import { useState, useEffect } from "react";
import { Patient } from "../types/patient";
import { Event } from "../types/event";
import { eventsService } from "../services/eventsService";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Plus, Trash2, User } from "lucide-react";
import { format, parseISO } from "date-fns";

interface AppointmentsProps {
  patient: Patient;
}

export default function Appointments({ patient }: AppointmentsProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewAppointmentDialog, setShowNewAppointmentDialog] =
    useState(false);
  const [newAppointment, setNewAppointment] = useState({
    title: "",
    reason: "",
    appointmentType: "FOLLOW_UP",
    start: new Date().toISOString().split("T")[0] + "T09:00",
    end: new Date().toISOString().split("T")[0] + "T09:30",
    providerId: "",
    providerName: "",
  });

  // Load patient's events on component mount
  useEffect(() => {
    if (patient?.id) {
      loadEvents();
    }
  }, [patient?.id]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const patientEvents = await eventsService.getEventsByPatientId(
        patient.id
      );
      setEvents(patientEvents);
      setError(null);
    } catch (err) {
      console.error("Error loading events:", err);
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAppointment = async () => {
    if (
      !newAppointment.title ||
      !newAppointment.start ||
      !newAppointment.end ||
      !newAppointment.providerId
    ) {
      setError("Please fill out all required fields");
      return;
    }

    try {
      await eventsService.createAppointment({
        patientId: patient.id,
        providerId: newAppointment.providerId,
        title: newAppointment.title,
        reason: newAppointment.reason,
        start: newAppointment.start,
        end: newAppointment.end,
        appointmentType: newAppointment.appointmentType,
      });

      // Reset form and close dialog
      setNewAppointment({
        title: "",
        reason: "",
        appointmentType: "FOLLOW_UP",
        start: new Date().toISOString().split("T")[0] + "T09:00",
        end: new Date().toISOString().split("T")[0] + "T09:30",
        providerId: "",
        providerName: "",
      });
      setShowNewAppointmentDialog(false);

      // Reload events
      loadEvents();
    } catch (err) {
      console.error("Error creating appointment:", err);
      setError("Failed to create appointment");
    }
  };

  const handleDeleteAppointment = async (eventId: string) => {
    if (confirm("Are you sure you want to delete this appointment?")) {
      try {
        await eventsService.deleteEvent(eventId);
        loadEvents();
      } catch (err) {
        console.error("Error deleting appointment:", err);
        setError("Failed to delete appointment");
      }
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "MMM d, yyyy h:mm a");
    } catch (err) {
      console.error("Error formatting date:", err);
      return dateString;
    }
  };

  // Group events into upcoming and past
  const now = new Date().toISOString();
  const upcomingEvents = events.filter((event) => event.start > now);
  const pastEvents = events.filter((event) => event.start <= now);

  // Providers (mockup data for demo)
  const providers = [
    { id: "usr_3c4d5e6f7g8h9i0j1k", name: "Dr. Robert Davis" },
    { id: "usr_4d5e6f7g8h9i0j1k2l", name: "Dr. Emily Chen" },
  ];

  if (loading && events.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        Loading appointments...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex justify-between px-2">
        <h3 className="px-2 text-lg font-medium text-[#73726E]">
          Appointments
        </h3>
        <button
          className="rounded-lg gap-2 flex items-center cursor-pointer hover:scale-105 transition-all duration-300 p-1 font-medium text-black/60 "
          onClick={() => setShowNewAppointmentDialog(true)}
        >
          <Plus className="w-4 h-4 " />
          New Appointment
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showNewAppointmentDialog && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Schedule New Appointment
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newAppointment.title}
                  onChange={(e) =>
                    setNewAppointment({
                      ...newAppointment,
                      title: e.target.value,
                    })
                  }
                  placeholder="Appointment title"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reason</label>
                <textarea
                  value={newAppointment.reason}
                  onChange={(e) =>
                    setNewAppointment({
                      ...newAppointment,
                      reason: e.target.value,
                    })
                  }
                  placeholder="Reason for appointment"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={newAppointment.appointmentType}
                  onChange={(e) =>
                    setNewAppointment({
                      ...newAppointment,
                      appointmentType: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="NEW_PATIENT">New Patient</option>
                  <option value="FOLLOW_UP">Follow-up</option>
                  <option value="ANNUAL_PHYSICAL">Annual Physical</option>
                  <option value="CONSULTATION">Consultation</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Provider
                </label>
                <select
                  value={newAppointment.providerId}
                  onChange={(e) => {
                    const provider = providers.find(
                      (p) => p.id === e.target.value
                    );
                    setNewAppointment({
                      ...newAppointment,
                      providerId: e.target.value,
                      providerName: provider?.name || "",
                    });
                  }}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select a provider</option>
                  {providers.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Start</label>
                <input
                  type="datetime-local"
                  value={newAppointment.start}
                  onChange={(e) =>
                    setNewAppointment({
                      ...newAppointment,
                      start: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End</label>
                <input
                  type="datetime-local"
                  value={newAppointment.end}
                  onChange={(e) =>
                    setNewAppointment({
                      ...newAppointment,
                      end: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowNewAppointmentDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateAppointment}>
                Create Appointment
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 gap-12 rounded-lg border-2 border-[#F1F1F1] w-full  flex flex-col">
        <div className="flex flex-col gap-2">
          <h3 className="px-2 text-lg font-medium text-[#73726E]">
            Upcoming Appointments
          </h3>
          {upcomingEvents.length === 0 ? (
            <p className="text-gray-500 text-center">
              No upcoming appointments
            </p>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white p-4 rounded-lg shadow border border-gray-100"
                >
                  <div className="flex justify-between">
                    <h4 className="font-semibold">{event.title}</h4>
                    <Button
                      variant="ghost"
                      onClick={() => handleDeleteAppointment(event.id)}
                    >
                      <Trash2 className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                  <div className="flex items-center text-gray-600 mt-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">{formatDate(event.start)}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mt-1">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      {format(parseISO(event.start), "h:mm a")} -{" "}
                      {format(parseISO(event.end), "h:mm a")}
                    </span>
                  </div>
                  {event.location && (
                    <div className="flex items-center text-gray-600 mt-1">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{event.location.name}</span>
                    </div>
                  )}
                  {event.organizer && (
                    <div className="flex items-center text-gray-600 mt-1">
                      <User className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        Dr. {event.organizer.firstName}{" "}
                        {event.organizer.lastName}
                      </span>
                    </div>
                  )}
                  {event.appointment && (
                    <div className="mt-2 text-sm text-gray-700">
                      <p>
                        <span className="font-medium">Reason:</span>{" "}
                        {event.appointment.reason}
                      </p>
                      <p>
                        <span className="font-medium">Status:</span>{" "}
                        {event.appointment.confirmationStatus}
                      </p>
                      <p className="capitalize">
                        <span className="font-medium">Type:</span>{" "}
                        {event.appointment.appointmentType
                          .replace(/_/g, " ")
                          .toLowerCase()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="px-2 text-lg font-medium text-[#73726E]">
            Past Appointments
          </h3>
          {pastEvents.length === 0 ? (
            <p className="text-gray-500">No past appointments</p>
          ) : (
            <div className="flex flex-col gap-4">
              {pastEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-[#FBFBFB] p-4 rounded-lg border border-gray-100"
                >
                  <h4 className="font-semibold">{event.title}</h4>
                  <div className="flex items-center text-gray-600 mt-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">{formatDate(event.start)}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center text-gray-600 mt-1">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{event.location.name}</span>
                    </div>
                  )}
                  {event.organizer && (
                    <div className="flex items-center text-gray-600 mt-1">
                      <User className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        Dr. {event.organizer.firstName}{" "}
                        {event.organizer.lastName}
                      </span>
                    </div>
                  )}
                  {event.appointment && (
                    <div className="mt-2 text-sm text-gray-700">
                      <p>
                        <span className="font-medium">Reason:</span>{" "}
                        {event.appointment.reason}
                      </p>
                      <p className="capitalize">
                        <span className="font-medium">Type:</span>{" "}
                        {event.appointment.appointmentType
                          .replace(/_/g, " ")
                          .toLowerCase()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
