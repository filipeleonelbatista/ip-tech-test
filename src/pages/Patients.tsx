import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Patient } from "@/@types/types";
import Layout from "@/components/layout";
import PatientForm from "@/components/patient-form";
import { Badge } from "@/components/ui/badge";
import { ArrowDown01, ArrowDownAz, ArrowUp01, ArrowUpDown, ArrowUpZa, FilePenIcon, PlusIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { calculateAge } from "@/lib/calculateAge";
import { usePatientContext } from "@/hooks/usePatientContext";

export default function Component() {
  const { patients, fetchPatients, togglePatientStatus } = usePatientContext();

  const [searchQuery, setSearchQuery] = useState("");

  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const filteredPatients = patients.filter((patient: Patient) => {
    const nameMatch = patient.name.toLowerCase().includes(searchQuery.toLowerCase());
    const cpfMatch = patient.cpf.includes(searchQuery);
    const statusMatch = patient.status.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || cpfMatch || statusMatch;
  });

  const sortedPatients = [...filteredPatients].sort((a, b) => {
    const { key, direction } = sortConfig;
    let aValue: string | Date;
    let bValue: string | Date;

    if (key === "dateOfBirth") {
      aValue = new Date(a[key]);
      bValue = new Date(b[key]);
    } else {
      aValue = a[key]?.toLowerCase() || "";
      bValue = b[key]?.toLowerCase() || "";
    }

    if (aValue < bValue) {
      return direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedPatients.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleDisable = async (patient: Patient) => {
    await togglePatientStatus(patient.id);
  };

  const handleSort = (key: string) => {
    setSortConfig((prevConfig) => {
      const direction =
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc";
      return { key, direction };
    });
  };

  return (
    <Layout>
      <div className={`container mx-auto`}>
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" id="page-title">
              Pacientes
            </h1>
            <p className="text-muted-foreground" id="page-description">
              Cadastre e atualize informações do paciente
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Filtrar por nome, CPF ou status"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
              aria-label="Campo de filtro"
              title="Campo de filtro"
              aria-describedby="filter-description"
            />
            <span id="filter-description" className="sr-only">
              Digite para filtrar a lista de pacientes por nome, CPF ou status.
            </span>
            <Dialog>
              <DialogTrigger asChild>
                <Button aria-label="Adicionar Paciente" title="Adicionar Paciente">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Adicionar Paciente
                </Button>
              </DialogTrigger>
              <DialogContent
                aria-labelledby="dialog-title"
                aria-describedby="dialog-description"
                role="dialog"
                aria-modal="true"
              >
                <DialogHeader className="flex flex-col gap-6">
                  <div>
                    <DialogTitle id="dialog-title">Adicionar paciente</DialogTitle>
                    <DialogDescription id="dialog-description">
                      Adicione as informações do paciente
                    </DialogDescription>
                  </div>
                  <PatientForm />
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </header>
        <div className={`overflow-x-auto`} role="table" aria-label="Tabela de pacientes">
          {currentItems.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <h3 className="text-2xl font-bold">Não há pacientes cadastrados</h3>
                <p className="text-muted-foreground">
                  Você pode adicionar um novo paciente clicando no botão "Adicionar Paciente".
                </p>
              </div>
            </div>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr className={`bg-muted`}>
                  <th className="py-3 px-4 text-left hover:bg-gray-200" scope="col">
                    <button
                      onClick={() => handleSort("name")}
                      className="flex items-center w-full"
                    >
                      Nome
                      {sortConfig.key === "name" ?
                        (sortConfig.direction === "asc" ? (
                          <ArrowDownAz className="w-4 h-4 ml-1" />
                        ) : (
                          <ArrowUpZa className="w-4 h-4 ml-1" />
                        )) : (
                          <ArrowUpDown className="w-4 h-4 ml-1" />
                        )
                      }
                    </button>
                  </th>
                  <th className="py-3 px-4 text-left hover:bg-gray-200" scope="col">
                    <button
                      onClick={() => handleSort("dateOfBirth")}
                      className="flex items-center w-full"
                    >
                      Dt. Nasc.
                      {sortConfig.key === "dateOfBirth" ?
                        (sortConfig.direction === "asc" ? (
                          <ArrowDown01 className="w-4 h-4 ml-1" />
                        ) : (
                          <ArrowUp01 className="w-4 h-4 ml-1" />
                        )) : (
                          <ArrowUpDown className="w-4 h-4 ml-1" />
                        )}
                    </button>
                  </th>
                  <th className="py-3 px-4 text-left hover:bg-gray-200" scope="col">
                    <button
                      onClick={() => handleSort("cpf")}
                      className="flex items-center w-full"
                    >
                      CPF
                      {sortConfig.key === "cpf" ?
                        (sortConfig.direction === "asc" ? (
                          <ArrowDown01 className="w-4 h-4 ml-1" />
                        ) : (
                          <ArrowUp01 className="w-4 h-4 ml-1" />
                        )) : (
                          <ArrowUpDown className="w-4 h-4 ml-1" />
                        )}
                    </button>
                  </th>
                  <th className="py-3 px-4 text-left" scope="col">
                    Sexo
                  </th>
                  <th className="py-3 px-4 text-left" scope="col">
                    Endereço
                  </th>
                  <th className="py-3 px-4 text-left hover:bg-gray-200" scope="col">
                    <button
                      onClick={() => handleSort("status")}
                      className="flex items-center w-full"
                    >
                      Status
                      {sortConfig.key === "status" ?
                        (sortConfig.direction === "asc" ? (
                          <ArrowDown01 className="w-4 h-4 ml-1" />
                        ) : (
                          <ArrowUp01 className="w-4 h-4 ml-1" />
                        )) : (
                          <ArrowUpDown className="w-4 h-4 ml-1" />
                        )}
                    </button>
                  </th>
                  <th className="py-3 px-4 text-left" scope="col">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((patient: Patient) => (
                  <tr
                    key={patient.id}
                    className={`border-b border-muted/40 hover:bg-muted/20`}
                    role="row"
                  >
                    <td className="py-3 px-4" role="cell">
                      {patient.name}
                    </td>
                    <td className="py-3 px-4" role="cell">
                      {new Date(patient.dateOfBirth).toLocaleDateString("pt-br")}
                      {" - "}
                      {calculateAge(patient.dateOfBirth)} Anos
                    </td>
                    <td className="py-3 px-4" role="cell">
                      {patient.cpf}
                    </td>
                    <td className="py-3 px-4" role="cell">
                      {patient.gender}
                    </td>
                    <td className="py-3 px-4" role="cell">
                      {patient.address.street}, {patient.address.complement}
                      <br />
                      {patient.address.neighborhood}, {patient.address.city} -{" "}
                      {patient.address.zipCode}
                    </td>
                    <td
                      className="py-3 px-4 flex justify-center items-center"
                      role="cell"
                    >
                      <Badge
                        data-status={patient.status}
                        className="w-full flex items-center justify-center data-[status='active']:bg-green-600"
                        variant={patient.status === "active" ? "default" : "destructive"}
                        role="status"
                        aria-live="polite"
                      >
                        {patient.status === "active" ? "Habilitado" : "Desabilitado"}
                      </Badge>
                    </td>
                    <td
                      className="py-3 px-4 space-x-2 items-center justify-center"
                      role="cell"
                    >
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            aria-label="Editar informações do paciente"
                            title="Editar informações do paciente"
                          >
                            <FilePenIcon className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent
                          aria-labelledby={`edit-dialog-title-${patient.id}`}
                          aria-describedby={`edit-dialog-description-${patient.id}`}
                          role="dialog"
                          aria-modal="true"
                        >
                          <DialogHeader className="flex flex-col gap-6">
                            <div>
                              <DialogTitle id={`edit-dialog-title-${patient.id}`}>
                                Editar paciente
                              </DialogTitle>
                              <DialogDescription
                                id={`edit-dialog-description-${patient.id}`}
                              >
                                Atualize as informações do paciente
                              </DialogDescription>
                            </div>
                            <PatientForm isEditable editablePatient={patient} />
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                      <Switch
                        id={`patient-${patient.id}-status`}
                        checked={patient.status === "active"}
                        onCheckedChange={() => handleDisable(patient)}
                        className={`relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 ${patient.status === "active" ? "bg-green-600" : "bg-muted"
                          }`}
                        role="switch"
                        aria-checked={patient.status === "active"}
                        aria-labelledby={`switch-label-${patient.id}`}
                        title="Alterar status do paciente"
                      >
                        <span className="sr-only" id={`switch-label-${patient.id}`}>
                          Alterar status do paciente {patient.name}
                        </span>
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${patient.status === "active"
                            ? "translate-x-5"
                            : "translate-x-0"
                            }`}
                        />
                      </Switch>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className={`flex justify-center mt-6 items-center`} role="navigation">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Página anterior"
            aria-disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span className="mx-4 text-muted-foreground" aria-live="polite">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Próxima página"
            aria-disabled={currentPage === totalPages}
          >
            Próximo
          </Button>
        </div>
      </div>
    </Layout>
  );
}
