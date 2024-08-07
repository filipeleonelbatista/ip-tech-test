import { Atendimento, AtendimentoComUsuario } from '@/@types/types';
import {
  createAttendance as createAttendanceApi,
  getAttendancesWithPatientInfo,
  toggleAttendanceStatus as toggleAttendanceStatusApi,
  updateAttendance as updateAttendanceApi,
} from '@/services/api';
import React, { createContext, ReactNode, useEffect, useState } from 'react';

export interface AtendimentoContextType {
  attendances: AtendimentoComUsuario[];
  currentAttendance: AtendimentoComUsuario | null;
  setCurrentAttendance: React.Dispatch<React.SetStateAction<AtendimentoComUsuario | null>>;
  createAttendance: (attendance: Omit<Atendimento, 'id'>) => Promise<OperationResult>;
  updateAttendance: (updatedAttendance: Atendimento) => Promise<OperationResult>;
  toggleAttendanceStatus: (attendanceId: number) => Promise<OperationResult>;
  fetchAttendances: () => Promise<void>;
}

export const AtendimentoContext = createContext<AtendimentoContextType | undefined>(undefined);

interface AtendimentoProviderProps {
  children: ReactNode;
}

interface OperationResult {
  success: boolean;
  error?: string;
}

export const AtendimentoProvider: React.FC<AtendimentoProviderProps> = ({ children }) => {
  const [attendances, setAttendances] = useState<AtendimentoComUsuario[]>([]);
  const [currentAttendance, setCurrentAttendance] = useState<AtendimentoComUsuario | null>(null);

  const fetchAttendances = async () => {
    try {
      const attendancesList = await getAttendancesWithPatientInfo();
      setAttendances(attendancesList);
    } catch (error) {
      console.error('Error fetching attendances:', error);
    }
  };

  useEffect(() => {
    fetchAttendances();
  }, []);

  const createAttendance = async (attendance: Omit<Atendimento, 'id'>): Promise<OperationResult> => {
    try {
      const newAttendance = await createAttendanceApi(attendance);

      setAttendances((prevAttendances) => [...prevAttendances, newAttendance]);
      return { success: true };
    } catch (error) {
      console.error('Error creating attendance:', error);
      return { success: false, error: 'Failed to create attendance' };
    }
  };

  const updateAttendance = async (updatedAttendance: Atendimento): Promise<OperationResult> => {
    try {
      const updatedAttendanceWithPatient = await updateAttendanceApi(updatedAttendance);
      setAttendances((prevAttendances) =>
        prevAttendances.map((attendance) =>
          attendance.id === updatedAttendance.id ? updatedAttendanceWithPatient : attendance
        )
      );
      return { success: true };
    } catch (error) {
      console.error('Error updating attendance:', error);
      return { success: false, error: 'Failed to update attendance' };
    }
  };

  const toggleAttendanceStatus = async (attendanceId: number): Promise<OperationResult> => {
    try {
      await toggleAttendanceStatusApi(attendanceId);
      setAttendances((prevAttendances) =>
        prevAttendances.map((attendance) =>
          attendance.id === attendanceId
            ? { ...attendance, status: attendance.status === 'Ativo' ? 'Inativo' : 'Ativo' }
            : attendance
        )
      );
      return { success: true };
    } catch (error) {
      console.error('Error toggling attendance status:', error);
      return { success: false, error: 'Failed to toggle attendance status' };
    }
  };

  return (
    <AtendimentoContext.Provider
      value={{
        attendances,
        currentAttendance,
        setCurrentAttendance,
        createAttendance,
        updateAttendance,
        toggleAttendanceStatus,
        fetchAttendances,
      }}
    >
      {children}
    </AtendimentoContext.Provider>
  );
};
