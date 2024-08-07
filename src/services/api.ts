import { Patient } from '@/@types/types';
import { Atendimento, AtendimentoComUsuario } from '@/@types/types';

const STORAGE_KEY_PATIENTS = 'patients';
const STORAGE_KEY_ATTENDANCES = 'attendances';

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

const getAttendancesFromStorage = (): Atendimento[] => {
  const attendances = localStorage.getItem(STORAGE_KEY_ATTENDANCES);
  return attendances ? (JSON.parse(attendances) as Atendimento[]) : [];
};

const saveAttendancesToStorage = (attendances: Atendimento[]) => {
  localStorage.setItem(STORAGE_KEY_ATTENDANCES, JSON.stringify(attendances));
};

export const getAttendances = async (): Promise<Atendimento[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getAttendancesFromStorage());
    }, 500);
  });
};

export const createAttendance = async (attendance: Omit<Atendimento, 'id'>): Promise<AtendimentoComUsuario> => {
  return new Promise(async (resolve, reject) => {
    setTimeout(async () => {
      try {
        const attendances = getAttendancesFromStorage();
        const newAttendance: Atendimento = { ...attendance, id: Date.now() }; 
        const updatedAttendances = [...attendances, newAttendance];
        saveAttendancesToStorage(updatedAttendances);

        const patient = await getPatientById(newAttendance.id_Paciente);

        const attendanceWithPatient: AtendimentoComUsuario = {
          ...newAttendance,
          patient, 
        };

        resolve(attendanceWithPatient);
      } catch (error) {
        console.error('Erro ao criar o atendimento:', error);
        reject(error);
      }
    }, 500);
  });
};

export const updateAttendance = async (updatedAttendance: Atendimento): Promise<AtendimentoComUsuario> => {
  return new Promise(async (resolve, reject) => {
    setTimeout(async () => {
      try {
        const attendances = getAttendancesFromStorage();
        const updatedAttendances = attendances.map((attendance) =>
          attendance.id === updatedAttendance.id ? updatedAttendance : attendance
        );
        saveAttendancesToStorage(updatedAttendances);

        const patient = await getPatientById(updatedAttendance.id_Paciente);

        const attendanceWithPatient: AtendimentoComUsuario = {
          ...updatedAttendance,
          patient, 
        };

        resolve(attendanceWithPatient);
      } catch (error) {
        console.error('Erro ao atualizar o atendimento:', error);
        reject(error);
      }
    }, 500);
  });
};

export const toggleAttendanceStatus = async (attendanceId: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const attendances = getAttendancesFromStorage();
      const updatedAttendances = attendances.map((attendance) => {
        if (attendance.id === attendanceId) {
          const updatedStatus: 'Ativo' | 'Inativo' = attendance.status === 'Ativo' ? 'Inativo' : 'Ativo';
          return { ...attendance, status: updatedStatus };
        }
        return attendance;
      });
      saveAttendancesToStorage(updatedAttendances);
      resolve();
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

export const getAttendancesWithPatientInfo = async (): Promise<AtendimentoComUsuario[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const attendances = getAttendancesFromStorage();
      const patients = getPatientsFromStorage();

      const attendancesWithPatientInfo = attendances.map((attendance) => {
        const patient = patients.find((p) => p.id === attendance.id_Paciente) || null;
        return {
          ...attendance,
          patient,
        };
      });

      resolve(attendancesWithPatientInfo);
    }, 500);
  });
};
