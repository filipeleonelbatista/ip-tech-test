export interface Patient {
  id: number;
  name: string;
  dateOfBirth: string;
  cpf: string;
  gender: string;
  address: {
    zipCode: string;
    city: string;
    neighborhood: string;
    street: string;
    complement: string;
  };
  status: "active" | "inactive";
}

export interface Atendimento {
  id: number;
  id_Paciente: number;
  dataHora: string;
  descricao: string;
  status: 'Ativo' | 'Inativo';
}

export interface AtendimentoComUsuario {
  id: number;
  id_Paciente: number;
  dataHora: string;
  descricao: string;
  status: 'Ativo' | 'Inativo';
  patient: Patient | null;
}
