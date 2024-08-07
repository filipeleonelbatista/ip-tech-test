import { PatientContext, PatientContextType } from "@/contexts/PatientsContext";
import { useContext } from "react";

export const usePatientContext = (): PatientContextType => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatientContext must be used within a PatientProvider');
  }
  return context;
};