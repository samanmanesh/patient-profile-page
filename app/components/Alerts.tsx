import React, { useEffect, useState } from "react";
import { Patient } from "../types/patient";
import {
  Alert,
  AlertType,
  FormSubmittedData,
  AppointmentData,
  MessageData,
} from "../types/alert";
import { alertService } from "../services/alertService";
import {
  BellRing,
  Calendar,
  CheckCircle,
  MessageCircle,
  File,
  User,
  BellDot,
} from "lucide-react";

type AlertsProps = {
  patient: Patient;
};

//Helper Functions
const getAlertIcon = (type: AlertType) => {
  switch (type) {
    case "FORM_SUBMITTED":
      return <File className="w-4 h-4" />;
    case "APPOINTMENT_SCHEDULED":
      return <Calendar className="w-4 h-4" />;
    case "MESSAGE_RECEIVED":
      return <MessageCircle className="w-4 h-4" />;
    default:
      return <BellRing className="w-4 h-4" />;
  }
};

const getAlertTitle = (alert: Alert) => {
  switch (alert.type) {
    case "FORM_SUBMITTED":
      return `Form Submitted: ${(alert.data as FormSubmittedData).name}`;
    case "APPOINTMENT_SCHEDULED":
      return `Appointment: ${(alert.data as AppointmentData).title}`;
    case "MESSAGE_RECEIVED":
      return "New Message";
    default:
      return "Alert";
  }
};

const getAlertDescription = (alert: Alert) => {
  switch (alert.type) {
    case "FORM_SUBMITTED": {
      const formData = alert.data as FormSubmittedData;
      return `Patient submitted the ${formData.name} form.`;
    }
    case "APPOINTMENT_SCHEDULED": {
      const apptData = alert.data as AppointmentData;
      const startDate = new Date(apptData.start);
      return `${
        apptData.title
      } scheduled on ${startDate.toLocaleDateString()} at ${startDate.toLocaleTimeString(
        [],
        { hour: "2-digit", minute: "2-digit" }
      )}.`;
    }
    case "MESSAGE_RECEIVED": {
      const msgData = alert.data as MessageData;
      return (
        msgData.message.substring(0, 100) +
        (msgData.message.length > 100 ? "..." : "")
      );
    }
    default:
      return "New alert.";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const Alerts = ({ patient }: AlertsProps) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      setIsLoading(true);
      try {
        const data = await alertService.getAlertsByPatientId(patient.id);
        setAlerts(data);
      } catch (error) {
        console.error("Error fetching alerts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlerts();
  }, [patient.id]);

  const resolveAlert = async (alertId: string, providerId: string) => {
    try {
      await alertService.resolveAlert(alertId, providerId);
      // Update the alert in the UI
      setAlerts((currentAlerts) =>
        currentAlerts.map((alert) =>
          alert.id === alertId
            ? {
                ...alert,
                actionRequired: false,
                resolvedDate: new Date().toISOString(),
              }
            : alert
        )
      );
    } catch (error) {
      console.error("Error resolving alert:", error);
    }
  };

  return (
    <div className="flex flex-col gap-12 p-4">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h3 className="px-2 text-lg font-medium text-[#73726E]">Alerts</h3>
          {!isLoading && alerts.length > 0 && (
            <span className="bg-red-50 text-red-900 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <BellDot className="w-4 h-4" />
              {alerts.filter((a) => a.actionRequired).length} Pending
            </span>
          )}
        </div>

        <div className="p-6 gap-2 rounded-lg border-2 border-[#F1F1F1] overflow-y-auto ">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-gray-500">Loading alerts...</p>
            </div>
          ) : alerts.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-gray-500">No alerts for this patient.</p>
            </div>
          ) : (
            <div className="space-y-4 rounded-lg">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-md  shadow-xs ${
                    alert.actionRequired
                      ? "bg-amber-50/40  border-l-4 border-amber-500"
                      : "bg-white border-l-4 border-green-500"
                  }`}
                >
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getAlertIcon(alert.type)}
                      <h3 className="font-medium">{getAlertTitle(alert)}</h3>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(alert.createdDate)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 mb-3">
                    {getAlertDescription(alert)}
                  </p>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {alert.assignedProvider.firstName}{" "}
                        {alert.assignedProvider.lastName}
                      </span>
                      {alert.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>

                    {alert.actionRequired ? (
                      <button
                        onClick={() =>
                          resolveAlert(alert.id, alert.assignedProvider.id)
                        }
                        className="text-xs flex items-center gap-1 text-green-700 hover:text-green-800 px-2 py-1 rounded-lg shadow-xs border border-green-700 hover:border-green-800"
                      >
                        <CheckCircle className="w-3 h-3" />
                        Mark as Resolved
                      </button>
                    ) : (
                      <span className="text-xs flex items-center gap-1 text-green-700 px-2 py-1">
                        <CheckCircle className="w-3 h-3" />
                        Resolved{" "}
                        {alert.resolvedDate && formatDate(alert.resolvedDate)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alerts;
