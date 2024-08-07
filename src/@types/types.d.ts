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