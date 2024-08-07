import { Atendimento, AtendimentoComUsuario } from "@/@types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useAtendimentoContext } from "@/hooks/useAtendimentoContext";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from 'yup';
import { Combobox } from "./ui/combobox";
import { useToast } from "./ui/use-toast";
import { calculateAge } from "@/lib/calculateAge";

export default function AtendimentoForm({ isEditable = false, editableAtendimento = null }: { isEditable?: boolean; editableAtendimento?: AtendimentoComUsuario | null }) {
  const { toast } = useToast();

  const { attendances, updateAttendance, createAttendance } = useAtendimentoContext();

  const formatDateForInput = (date) => {
    const localDate = new Date(date);
    return localDate.toISOString().slice(0, 16);
  };

  const [atendimento, setAtendimento] = useState<Atendimento>({
    id: attendances.length + 1,
    id_Paciente: editableAtendimento?.id_Paciente ?? 0,
    dataHora: formatDateForInput(new Date()),
    descricao: "",
    status: "Ativo",
  });

  const formik = useFormik({
    initialValues: atendimento,
    validationSchema: Yup.object().shape({
      id_Paciente: Yup.string().required("Paciente é obrigatório"),
      dataHora: Yup.string().required("Data é obrigatória"),
      descricao: Yup.string().required("Descrição é obrigatória"),
      status: Yup.string().required("Status é obrigatório"),
    }),
    onSubmit: async (values) => {
      try {
        let result;
        if (!isEditable) {
          result = await createAttendance(values);
        } else {
          result = await updateAttendance({ ...editableAtendimento, ...values });
        }

        if (result.success) {
          toast({
            variant: 'default',
            title: isEditable ? "Atendimento atualizado com sucesso!" : "Atendimento criado com sucesso!",
          });
        } else {
          toast({
            variant: 'destructive',
            title: result.error || "Ocorreu um erro ao processar a solicitação.",
          });
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: "Ocorreu um erro inesperado.",
        });
      } finally {
        document.getElementById('close-btn')?.click();
      }
    },
    enableReinitialize: true,
  });

  const { handleSubmit, handleChange, errors, values } = formik;

  useEffect(() => {
    if (isEditable && editableAtendimento) {
      setAtendimento(editableAtendimento);
    } else {
      setAtendimento({
        id: attendances.length ?? 1,
        id_Paciente: 0,
        dataHora: formatDateForInput(new Date()),
        descricao: "",
        status: "Ativo",
      });
    }
  }, [isEditable, editableAtendimento]);

  return (
    <form onSubmit={handleSubmit} className="grid gap-4" aria-label="Formulário de Atendimento">
      <div className="grid grid-cols-1 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="paciente">Paciente</Label>
          {
            !isEditable ? (
              <>
                <Combobox
                  onChange={(id) => formik.setFieldValue("id_Paciente", Number(id))}
                />
                {errors.id_Paciente && <div id="paciente-error" className="text-red-500 text-sm">{errors.id_Paciente}</div>}
              </>
            ) : (
              <div className="flex items-start justify-between border p-2 rounded-md">
                <div>
                  <div className="font-medium">{editableAtendimento?.patient?.name}</div>
                  <div className="text-muted-foreground text-sm">
                    {new Date(editableAtendimento?.patient?.dateOfBirth ?? new Date()).toLocaleDateString("pt-br")}
                    {" - "}
                    {calculateAge(editableAtendimento?.patient?.dateOfBirth ?? "")} Anos | {editableAtendimento?.patient?.cpf} | {editableAtendimento?.patient?.gender}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {editableAtendimento?.patient?.address.street}, {editableAtendimento?.patient?.address.complement}
                    <br />
                    {editableAtendimento?.patient?.address.neighborhood}, {editableAtendimento?.patient?.address.city} -{" "}
                    {editableAtendimento?.patient?.address.zipCode}
                  </div>
                </div>
                <div
                  className={`px-2 py-1 rounded-md text-xs font-medium ${editableAtendimento?.patient?.status === "active" ? "bg-green-500 text-green-50" : "bg-red-500 text-red-50"
                    }`}
                >
                  {editableAtendimento?.patient?.status === "active" ? "Habilitado" : "Desabilitado"}
                </div>
              </div>
            )
          }
        </div>
        <div className="grid gap-2">
          <Label htmlFor="dataHora">Data</Label>
          <Input
            id="dataHora"
            type="datetime-local"
            value={values.dataHora}
            onChange={handleChange}
            className={errors.dataHora ? "border-red-500" : ""}
            required
            title="Data"
            aria-label="Data"
            aria-required="true"
            aria-describedby={errors.dataHora ? "data-error" : undefined}
          />
          {errors.dataHora && <div id="data-error" className="text-red-500 text-sm">{errors.dataHora}</div>}
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          value={values.descricao}
          onChange={handleChange}
          className={errors.descricao ? "border-red-500" : ""}
          required
          title="Descrição"
          aria-label="Descrição"
          aria-required="true"
          aria-describedby={errors.descricao ? "descricao-error" : undefined}
        />
        {errors.descricao && <div id="descricao-error" className="text-red-500 text-sm">{errors.descricao}</div>}
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <Select
            id="status"
            value={values.status}
            onValueChange={(value) => formik.setFieldValue("status", value)}
            aria-label="Status"
            aria-required="true"
            title="Status"
            className={errors.status ? "border-red-500" : ""}
          >
            <SelectTrigger className={errors.status ? "border-red-500" : ""}>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ativo">Ativo</SelectItem>
              <SelectItem value="Inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && <div id="status-error" className="text-red-500 text-sm">{errors.status}</div>}
        </div>
      </div>
      <Button type="submit" aria-label={isEditable ? "Atualizar Atendimento" : "Salvar Atendimento"}>
        {isEditable ? "Atualizar Atendimento" : "Salvar Atendimento"}
      </Button>
    </form>
  );
}
