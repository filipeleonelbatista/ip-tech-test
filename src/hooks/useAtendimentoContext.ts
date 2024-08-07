import { AtendimentoContext, AtendimentoContextType } from "@/contexts/AtendimentosContext";
import { useContext } from "react";

export const useAtendimentoContext = (): AtendimentoContextType => {
  const context = useContext(AtendimentoContext);
  if (!context) {
    throw new Error('useAtendimentoContext must be used within a AtendimentoProvider');
  }
  return context;
};