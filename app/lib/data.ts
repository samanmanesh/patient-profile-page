import { AlertsResponse } from "@/app/types/alert";
import { Memo } from "@/app/types/memos";
import { Patient } from "@/app/types/patient";



// Helper to read data based on environment
export async function readData<T>(
  filename: string,
  defaultValue: T
): Promise<T> {
  try {
    // Use dynamic imports instead of require()
    const fs = await import("fs");
    const path = await import("path");
    const dataFilePath = path.join(process.cwd(), `public/data/${filename}`);
    const data = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return defaultValue;
  }
}

// Helper for writing data - only works in development
export async function writeData<T>(
  filename: string,
  data: T
): Promise<boolean> {
  if (process.env.NODE_ENV === "development") {
    try {
      // Use dynamic imports instead of require()
      const fs = await import("fs");
      const path = await import("path");
      const dataFilePath = path.join(process.cwd(), `public/data/${filename}`);
      fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");

      // Also update the public copy to keep them in sync
      const publicPath = path.join(process.cwd(), `public/data/${filename}`);
      fs.writeFileSync(publicPath, JSON.stringify(data, null, 2), "utf8");

      return true;
    } catch (error) {
      console.error(`Error writing ${filename}:`, error);
      return false;
    }
  } else {
    console.warn(
      "Write operations are not supported in production environment"
    );
    return false;
  }
}

// Specific data helper functions
export async function getAlerts(): Promise<AlertsResponse> {
  return readData<AlertsResponse>("alerts.json", { data: [], total: 0 });
}

export async function saveAlerts(alerts: AlertsResponse): Promise<boolean> {
  return writeData("alerts.json", alerts);
}

export async function getMemos(): Promise<Memo[]> {
  return readData<Memo[]>("memos.json", []);
}

export async function saveMemos(memos: Memo[]): Promise<boolean> {
  return writeData("memos.json", memos);
}

export async function getPatients(): Promise<Patient[]> {
  return readData<Patient[]>("patient.json", []);
}

export async function savePatients(patients: Patient[]): Promise<boolean> {
  return writeData("patient.json", patients);
}

// Add more helpers for other data types as needed
