import { Patient } from '@/@types/types';

const STORAGE_KEY_PATIENTS = 'patients';

const getPatientsFromStorage = (): Patient[] => {
  const patients = localStorage.getItem(STORAGE_KEY_PATIENTS);
  return patients ? (JSON.parse(patients) as Patient[]) : [];
};

const savePatientsToStorage = (patients: Patient[]) => {
  localStorage.setItem(STORAGE_KEY_PATIENTS, JSON.stringify(patients));
};

export const getPatients = async (): Promise<Patient[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getPatientsFromStorage());
    }, 500);
  });
};

export const createPatient = async (patient: Omit<Patient, 'id'>): Promise<Patient> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const patients = getPatientsFromStorage();
      const newPatient: Patient = { ...patient, id: Date.now(), status: 'active' }; // Garantir que o status é do tipo correto
      const updatedPatients = [...patients, newPatient];
      savePatientsToStorage(updatedPatients);
      resolve(newPatient);
    }, 500);
  });
};

export const updatePatient = async (updatedPatient: Patient): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const patients = getPatientsFromStorage();
      const updatedPatients = patients.map((patient) =>
        patient.id === updatedPatient.id ? updatedPatient : patient
      );
      savePatientsToStorage(updatedPatients);
      resolve();
    }, 500);
  });
};

export const togglePatientStatus = async (patientId: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const patients = getPatientsFromStorage();
      const updatedPatients = patients.map((patient) => {
        if (patient.id === patientId) {
          const updatedStatus: 'active' | 'inactive' = patient.status === 'active' ? 'inactive' : 'active';
          return { ...patient, status: updatedStatus };
        }
        return patient;
      });
      savePatientsToStorage(updatedPatients);
      resolve();
    }, 500);
  });
};

export const checkCpfExists = async (cpf: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const patients = getPatientsFromStorage();
      const cpfExists = patients.some((patient) => patient.cpf === cpf);
      resolve(cpfExists);
    }, 500);
  });
};

export const getActivePatients = async (): Promise<Patient[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const patients = getPatientsFromStorage();
      const activePatients = patients.filter((patient) => patient.status === 'active');
      resolve(activePatients);
    }, 500);
  });
};

export const getPatientById = async (id: number): Promise<Patient | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const patients = getPatientsFromStorage();
      const patient = patients.find((patient) => patient.id === id) || null;
      resolve(patient);
    }, 500);
  });
};