import { Patient, PatientBasic, PatientQueryParams, Measurement, Medication } from "../types/patient";
import patientData from "./data/patient.json";

export const patientService = {
  // Get all patients
  getAllPatients: async (params?: PatientQueryParams): Promise<Patient[]> => {
    try {
      let patients = patientData as unknown as Patient[];
      
      // Apply filtering if search parameter is provided
      if (params?.search) {
        const searchTerm = params.search.toLowerCase();
        patients = patients.filter(
          (patient) =>
            patient.firstName.toLowerCase().includes(searchTerm) ||
            patient.lastName.toLowerCase().includes(searchTerm) ||
            patient.email.toLowerCase().includes(searchTerm)
        );
      }
      
      // Apply sorting if sortBy parameter is provided
      if (params?.sortBy) {
        const sortOrder = params.sortOrder === 'desc' ? -1 : 1;
        patients.sort((a, b) => {
          const aValue = a[params.sortBy as keyof Patient];
          const bValue = b[params.sortBy as keyof Patient];
          
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortOrder * aValue.localeCompare(bValue);
          }
          
          return 0;
        });
      }
      
      // Apply pagination if page and limit parameters are provided
      if (params?.page !== undefined && params?.limit !== undefined) {
        const startIndex = (params.page - 1) * params.limit;
        const endIndex = startIndex + params.limit;
        patients = patients.slice(startIndex, endIndex);
      }
      
      return patients;
    } catch (error) {
      console.error("Error fetching patients:", error);
      return [];
    }
  },

  // Get a patient by ID
  getPatientById: async (id: string): Promise<Patient | null> => {
    try {
      const patients = patientData as unknown as Patient[];
      const patient = patients.find((p) => p.id === id);
      
      if (!patient) {
        console.error(`Patient with ID ${id} not found`);
        return null;
      }
      
      return patient;
    } catch (error) {
      console.error("Error fetching patient:", error);
      return null;
    }
  },

  // Get basic patient info by ID
  getPatientBasicById: async (id: string): Promise<PatientBasic | null> => {
    try {
      const patient = await patientService.getPatientById(id);
      
      if (!patient) {
        return null;
      }
      
      // Return only the basic patient info
      return {
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName
      };
    } catch (error) {
      console.error("Error fetching basic patient info:", error);
      return null;
    }
  },

  // Create a new patient - mocked implementation
  createPatient: async (patient: Partial<Patient>): Promise<Patient> => {
    try {
      // In a real implementation, we would update the local data
      console.log("Create patient called with:", patient);
      
      // Generate a new patient with ID and required fields
      return {
        id: `pt_${Math.random().toString(36).substring(2, 15)}`,
        firstName: patient.firstName || "",
        lastName: patient.lastName || "",
        phoneNumber: patient.phoneNumber || "",
        email: patient.email || "",
        address: patient.address || "",
        addressLineTwo: patient.addressLineTwo || null,
        city: patient.city || "",
        state: patient.state || "",
        zipCode: patient.zipCode || "",
        country: patient.country || "",
        addressValid: patient.addressValid || false,
        guardianName: patient.guardianName || null,
        guardianPhoneNumber: patient.guardianPhoneNumber || null,
        maritalStatus: patient.maritalStatus || "SINGLE",
        gender: patient.gender || "OTHER",
        employmentStatus: patient.employmentStatus || "UNEMPLOYED",
        dateOfBirth: patient.dateOfBirth || "",
        allergies: patient.allergies || [],
        familyHistory: patient.familyHistory || [],
        medicalHistory: patient.medicalHistory || [],
        prescriptions: patient.prescriptions || [],
        goalWeight: patient.goalWeight || 0,
        isOnboardingComplete: patient.isOnboardingComplete || false,
        createdDate: new Date().toISOString(),
        firebaseUid: patient.firebaseUid || "",
        measurements: patient.measurements || [],
        medications: patient.medications || []
      } as Patient;
    } catch (error) {
      console.error("Error creating patient:", error);
      throw error;
    }
  },

  // Update a patient - mocked implementation
  updatePatient: async (id: string, patientUpdate: Partial<Patient>): Promise<Patient> => {
    try {
      const patient = await patientService.getPatientById(id);
      
      if (!patient) {
        throw new Error(`Patient with ID ${id} not found`);
      }
      
      // Return the updated patient (in a real app, we would save this)
      const updatedPatient = {
        ...patient,
        ...patientUpdate
      };
      
      console.log("Update patient called:", updatedPatient);
      return updatedPatient;
    } catch (error) {
      console.error("Error updating patient:", error);
      throw error;
    }
  },

  // Delete a patient - mocked implementation
  deletePatient: async (id: string): Promise<void> => {
    try {
      // In a real implementation, we would update the local data
      console.log("Delete patient called with ID:", id);
    } catch (error) {
      console.error("Error deleting patient:", error);
      throw error;
    }
  },

  // Add a measurement to a patient
  addMeasurement: async (patientId: string, measurement: Omit<Measurement, 'id' | 'patientId'>): Promise<Measurement> => {
    try {
      const patient = await patientService.getPatientById(patientId);
      
      if (!patient) {
        throw new Error(`Patient with ID ${patientId} not found`);
      }
      
      const newMeasurement: Measurement = {
        id: `ms_${Math.random().toString(36).substring(2, 15)}`,
        patientId,
        ...measurement,
        date: measurement.date || new Date().toISOString()
      };
      
      // In a real implementation, we would update the local data
      console.log("Adding measurement to patient:", newMeasurement);
      
      return newMeasurement;
    } catch (error) {
      console.error("Error adding measurement:", error);
      throw error;
    }
  },

  // Add a medication to a patient
  addMedication: async (patientId: string, medication: Omit<Medication, 'id' | 'patientId'>): Promise<Medication> => {
    try {
      const patient = await patientService.getPatientById(patientId);
      
      if (!patient) {
        throw new Error(`Patient with ID ${patientId} not found`);
      }
      
      const newMedication: Medication = {
        id: `md_${Math.random().toString(36).substring(2, 15)}`,
        patientId,
        ...medication
      };
      
      // In a real implementation, we would update the local data
      console.log("Adding medication to patient:", newMedication);
      
      return newMedication;
    } catch (error) {
      console.error("Error adding medication:", error);
      throw error;
    }
  }
};

export default patientService; 