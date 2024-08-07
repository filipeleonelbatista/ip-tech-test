import { Patient } from "@/@types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from 'yup';
import { useToast } from "./ui/use-toast";
import { cep, cpf } from "@/lib/mask";
import { fetchCep } from "@/lib/fetchCep";
import { checkCpfExists } from "@/services/api";
import { usePatientContext } from "@/hooks/usePatientContext";

export default function PatientForm({ isEditable = false, editablePatient = null }: { isEditable?: boolean; editablePatient?: Patient | null }) {
  const { toast } = useToast();

  const [cpfExists, setCpfExists] = useState(false);

  const { patients, updatePatient, createPatient } = usePatientContext();

  const [patient, setPatient] = useState<Patient>({
    id: patients.length + 1,
    name: "",
    dateOfBirth: "",
    cpf: "",
    gender: "",
    address: {
      zipCode: "",
      city: "",
      neighborhood: "",
      street: "",
      complement: "",
    },
    status: "active",
  });

  const formik = useFormik({
    initialValues: patient,
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Nome é obrigatório"),
      dateOfBirth: Yup.string().required("Data de nascimento é obrigatória"),
      cpf: Yup.string()
        .required("CPF é obrigatório")
        .test('cpf-exists', 'Este CPF já está cadastrado.', async function (value) {
          if (!value) return true;
          if (isEditable && editablePatient && editablePatient.cpf === value) return true;
          const exists = await checkCpfExists(value);
          setCpfExists(exists);
          return !exists;
        }),
      gender: Yup.string().required("Gênero é obrigatório"),
      address: Yup.object().shape({
        zipCode: Yup.string().required("CEP é obrigatório"),
        city: Yup.string().required("Cidade é obrigatória"),
        neighborhood: Yup.string().required("Bairro é obrigatório"),
        street: Yup.string().required("Endereço é obrigatório"),
      }),
      status: Yup.string().required("Status é obrigatório"),
    }),
    onSubmit: async (values) => {
      try {
        let result;
        if (!isEditable) {
          result = await createPatient(values);
        } else {
          result = await updatePatient({ ...editablePatient, ...values });
        }

        if (result.success) {
          toast({
            variant: 'default',
            title: isEditable ? "Paciente atualizado com sucesso!" : "Paciente criado com sucesso!",
          })

        } else {
          toast({
            variant: 'destructive',
            title: result.error || "Ocorreu um erro ao processar a solicitação.",
          })
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: "Ocorreu um erro inesperado.",
        })
      } finally {
        document.getElementById('close-btn')?.click()
      }
    },
    enableReinitialize: true,
  });

  const { handleSubmit, handleChange, errors, values, setFieldValue } = formik;

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFieldValue(`address.${id}`, value);
  };

  useEffect(() => {
    if (isEditable && editablePatient) {
      setPatient(editablePatient);
    } else {
      setPatient({
        id: patients.length ?? 1,
        name: "",
        dateOfBirth: "",
        cpf: "",
        gender: "",
        address: {
          zipCode: "",
          city: "",
          neighborhood: "",
          street: "",
          complement: "",
        },
        status: "active",
      });
    }
  }, [isEditable, editablePatient]);

  return (
    <form onSubmit={handleSubmit} className="grid gap-4" aria-label="Formulário de Paciente">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            value={values.name}
            onChange={handleChange}
            className={errors.name ? "border-red-500" : ""}
            required
            title="Nome"
            aria-label="Nome"
            aria-required="true"
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && <div id="name-error" className="text-red-500 text-sm">{errors.name}</div>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={values.dateOfBirth}
            onChange={handleChange}
            className={errors.dateOfBirth ? "border-red-500" : ""}
            required
            title="Data de Nascimento"
            aria-label="Data de Nascimento"
            aria-required="true"
            aria-describedby={errors.dateOfBirth ? "dob-error" : undefined}
          />
          {errors.dateOfBirth && <div id="dob-error" className="text-red-500 text-sm">{errors.dateOfBirth}</div>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="cpf">CPF</Label>
          <Input
            disabled={isEditable}
            id="cpf"
            maxLength={14}
            type="text"
            value={values.cpf}
            onChange={async (event) => {
              const maskedCpf = cpf(event.target.value);
              setFieldValue("cpf", maskedCpf);

              if (maskedCpf.length === 14) {
                const exists = await checkCpfExists(maskedCpf);
                setCpfExists(exists);
                if (exists) {
                  formik.setFieldError('cpf', 'Este CPF já está cadastrado.');
                }
              }
            }}
            className={errors.cpf || cpfExists ? "border-red-500" : ""}
            required
            title="CPF"
            aria-label="CPF"
            aria-required="true"
            aria-describedby={errors.cpf ? "cpf-error" : undefined}
          />
          {errors.cpf && <div id="cpf-error" className="text-red-500 text-sm">{errors.cpf}</div>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="gender">Gênero</Label>
          <Select
            id="gender"
            value={values.gender}
            onValueChange={(value) => setFieldValue("gender", value)}
            aria-label="Gênero"
            aria-required="true"
            title="Gênero"
            className={errors.gender ? "border-red-500" : ""}
          >
            <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
              <SelectValue placeholder="Selecione o gênero" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="masculino">Masculino</SelectItem>
              <SelectItem value="feminino">Feminino</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && <div id="gender-error" className="text-red-500 text-sm">{errors.gender}</div>}
        </div>
      </div>
      <Separator />
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="zipCode">CEP</Label>
            <Input
              id="zipCode"
              maxLength={9}
              type="text"
              onChange={async (event) => {
                const cepValue = cep(event.target.value);
                setFieldValue('address.zipCode', cepValue);

                if (cepValue.length === 9) {
                  const addressData = await fetchCep(cepValue.replace("-", ""));

                  if (addressData) {
                    setFieldValue('address.city', addressData.localidade);
                    setFieldValue('address.neighborhood', addressData.bairro);
                    setFieldValue('address.street', addressData.logradouro);
                    setFieldValue('address.complement', addressData.complemento);

                    toast({
                      variant: 'default',
                      title: 'Endereço preenchido automaticamente',
                      description: `Cidade: ${addressData.localidade}, Bairro: ${addressData.bairro}`,
                    });
                  } else {
                    toast({
                      variant: 'destructive',
                      title: 'CEP não encontrado',
                      description: 'Não foi possível encontrar o endereço para o CEP fornecido.',
                    });
                  }
                }
              }}
              value={values.address.zipCode}
              className={errors.address?.zipCode ? "border-red-500" : ""}
              required
              title="CEP"
              aria-label="CEP"
              aria-required="true"
              aria-describedby={errors.address?.zipCode ? "zipCode-error" : undefined}
            />
            {errors.address?.zipCode && <div id="zipCode-error" className="text-red-500 text-sm">{errors.address.zipCode}</div>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="city">Cidade</Label>
            <Input
              id="city"
              value={values.address.city}
              onChange={handleAddressChange}
              className={errors.address?.city ? "border-red-500" : ""}
              required
              title="Cidade"
              aria-label="Cidade"
              aria-required="true"
              aria-describedby={errors.address?.city ? "city-error" : undefined}
            />
            {errors.address?.city && <div id="city-error" className="text-red-500 text-sm">{errors.address.city}</div>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="neighborhood">Bairro</Label>
            <Input
              id="neighborhood"
              value={values.address.neighborhood}
              onChange={handleAddressChange}
              className={errors.address?.neighborhood ? "border-red-500" : ""}
              required
              title="Bairro"
              aria-label="Bairro"
              aria-required="true"
              aria-describedby={errors.address?.neighborhood ? "neighborhood-error" : undefined}
            />
            {errors.address?.neighborhood && <div id="neighborhood-error" className="text-red-500 text-sm">{errors.address.neighborhood}</div>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="street">Endereço</Label>
            <Input
              id="street"
              value={values.address.street}
              onChange={handleAddressChange}
              className={errors.address?.street ? "border-red-500" : ""}
              required
              title="Endereço"
              aria-label="Endereço"
              aria-required="true"
              aria-describedby={errors.address?.street ? "street-error" : undefined}
            />
            {errors.address?.street && <div id="street-error" className="text-red-500 text-sm">{errors.address.street}</div>}
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="complement">Complemento</Label>
          <Textarea
            id="complement"
            value={values.address.complement}
            onChange={handleAddressChange}
            title="Complemento"
            aria-label="Complemento"
            aria-required="false"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <Select
            id="status"
            value={values.status}
            onValueChange={(value) => setFieldValue("status", value)}
            aria-label="Status"
            aria-required="true"
            title="Status"
            className={errors.status ? "border-red-500" : ""}
          >
            <SelectTrigger className={errors.status ? "border-red-500" : ""}>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="inactive">Inativo</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && <div id="status-error" className="text-red-500 text-sm">{errors.status}</div>}
        </div>
      </div>
      <Button type="submit" aria-label={isEditable ? "Atualizar Paciente" : "Salvar Paciente"}>
        {isEditable ? "Atualizar Paciente" : "Salvar Paciente"}
      </Button>
    </form>
  );
}
