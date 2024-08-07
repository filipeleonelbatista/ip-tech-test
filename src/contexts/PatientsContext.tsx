import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  getPatients,
  createPatient as createPatientApi,
  updatePatient as updatePatientApi,
  togglePatientStatus as togglePatientStatusApi
} from '@/services/api';
import { Patient } from '@/@types/types';

export interface PatientContextType {
  patients: Patient[];
  currentPatient: Patient | null;
  setCurrentPatient: React.Dispatch<React.SetStateAction<Patient | null>>;
  createPatient: (patient: Omit<Patient, 'id'>) => Promise<OperationResult>;
  updatePatient: (updatedPatient: Patient) => Promise<OperationResult>;
  togglePatientStatus: (patientId: number) => Promise<OperationResult>;
  fetchPatients: () => Promise<void>;
}

export const PatientContext = createContext<PatientContextType | undefined>(undefined);

interface PatientProviderProps {
  children: ReactNode;
}

interface OperationResult {
  success: boolean;
  error?: string;
}

export const PatientProvider: React.FC<PatientProviderProps> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);

  const fetchPatients = async () => {
    try {
      const patientsList = await getPatients();
      setPatients(patientsList);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const createPatient = async (patient: Omit<Patient, 'id'>): Promise<OperationResult> => {
    try {
      const newPatient = await createPatientApi(patient);
      setPatients((prevPatients) => [...prevPatients, newPatient]);
      return { success: true };
    } catch (error) {
      console.error('Error creating patient:', error);
      return { success: false, error: 'Failed to create patient' };
    }
  };

  const updatePatient = async (updatedPatient: Patient): Promise<OperationResult> => {
    try {
      await updatePatientApi(updatedPatient);
      setPatients((prevPatients) =>
        prevPatients.map((patient) =>
          patient.id === updatedPatient.id ? updatedPatient : patient
        )
      );
      return { success: true };
    } catch (error) {
      console.error('Error updating patient:', error);
      return { success: false, error: 'Failed to update patient' };
    }
  };

  const togglePatientStatus = async (patientId: number): Promise<OperationResult> => {
    try {
      await togglePatientStatusApi(patientId);
      setPatients((prevPatients) =>
        prevPatients.map((patient) =>
          patient.id === patientId
            ? { ...patient, status: patient.status === 'active' ? 'inactive' : 'active' }
            : patient
        )
      );
      return { success: true };
    } catch (error) {
      console.error('Error toggling patient status:', error);
      return { success: false, error: 'Failed to toggle patient status' };
    }
  };

  return (
    <PatientContext.Provider
      value={{
        patients,
        currentPatient,
        setCurrentPatient,
        createPatient,
        updatePatient,
        togglePatientStatus,
        fetchPatients,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};
