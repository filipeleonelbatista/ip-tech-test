import { Atendimento, AtendimentoComUsuario } from "@/@types/types";
import AtendimentoForm from "@/components/atendimento-form";
import Layout from "@/components/layout";
import { Badge } from "@/components/ui/badge";
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
import { Switch } from "@/components/ui/switch";
import { useAtendimentoContext } from "@/hooks/useAtendimentoContext";
import { ArrowDown01, ArrowDownAz, ArrowUp01, ArrowUpDown, ArrowUpZa, CalendarArrowDown, CalendarArrowUp, FilePenIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

export default function Attendances() {
  const { attendances, toggleAttendanceStatus } = useAtendimentoContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "dataHora", direction: "desc" });

  const filteredAttendances = attendances.filter(
    (atendimento: AtendimentoComUsuario) => {
      const patientMatch = atendimento?.patient?.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const descriptionMatch = atendimento.descricao
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const statusMatch = atendimento.status
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return patientMatch || descriptionMatch || statusMatch;
    }
  );

  const sortedAttendances = [...filteredAttendances].sort((a, b) => {
    const key = sortConfig.key;
    if (!key) return 0;

    let aValue: string | Date;
    let bValue: string | Date;

    if (key === "dataHora") {
      aValue = new Date(a[key]);
      bValue = new Date(b[key]);
    } else if (key === "patient.name") {
      aValue = a.patient?.name.toLowerCase() || "";
      bValue = b.patient?.name.toLowerCase() || "";
    } else {
      aValue = a[key]?.toLowerCase() || "";
      bValue = b[key]?.toLowerCase() || "";
    }

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedAttendances.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredAttendances.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleDisable = async (atendimento: Atendimento) => {
    await toggleAttendanceStatus(atendimento.id);
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
      <div className="container mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" id="page-title">
              Atendimentos
            </h1>
            <p className="text-muted-foreground" id="page-description">
              Cadastre e atualize informações dos atendimentos
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Filtrar por descrição nome ou descrição"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
              aria-label="Campo de filtro"
              title="Campo de filtro"
              aria-describedby="filter-description"
            />
            <span id="filter-description" className="sr-only">
              Digite para filtrar a lista de atendimentos por descrição ou
              status.
            </span>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  aria-label="Adicionar Atendimento"
                  title="Adicionar Atendimento"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Adicionar Atendimento
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
                    <DialogTitle id="dialog-title">
                      Adicionar atendimento
                    </DialogTitle>
                    <DialogDescription id="dialog-description">
                      Adicione as informações do atendimento
                    </DialogDescription>
                  </div>
                  <AtendimentoForm />
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </header>
        <div
          className="overflow-x-auto"
          role="table"
          aria-label="Tabela de atendimentos"
        >
          {currentItems.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <h3 className="text-2xl font-bold">
                  Não há atendimentos cadastrados
                </h3>
                <p className="text-muted-foreground">
                  Você pode adicionar um novo atendimento clicando no botão
                  "Adicionar Atendimento".
                </p>
              </div>
            </div>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-muted">
                  <th className="py-3 px-4 text-left hover:bg-gray-200" scope="col">
                    <button
                      onClick={() => handleSort("patient.name")}
                      className="flex items-center w-full"
                    >
                      Paciente
                      {sortConfig.key === "patient.name" ?
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
                      onClick={() => handleSort("dataHora")}
                      className="flex items-center w-full"
                    >
                      Data e Hora
                      {sortConfig.key === "dataHora" ?
                        (sortConfig.direction === "asc" ? (
                          <CalendarArrowDown className="w-4 h-4 ml-1" />
                        ) : (
                          <CalendarArrowUp className="w-4 h-4 ml-1" />
                        )) : (
                          <ArrowUpDown className="w-4 h-4 ml-1" />
                        )}
                    </button>
                  </th>
                  <th className="py-3 px-4 text-left" scope="col">
                    Descrição
                  </th>
                  <th className="py-3 px-4 text-left hover:bg-gray-200" scope="col">
                    <button
                      onClick={() => handleSort("status")}
                      className="flex items-center w-full"
                    >
                      Status
                      {sortConfig.key === "status" ?
                        (sortConfig.direction === "asc" ? (
                          <ArrowUp01 className="w-4 h-4 ml-1" />
                        ) : (
                          <ArrowDown01 className="w-4 h-4 ml-1" />
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
                {currentItems.map((atendimento: AtendimentoComUsuario) => (
                  <tr
                    key={atendimento.id}
                    className="border-b border-muted/40 hover:bg-muted/20"
                    role="row"
                  >
                    <td className="py-3 px-4" role="cell">
                      {atendimento.patient?.name}
                    </td>
                    <td className="py-3 px-4" role="cell">
                      {new Date(atendimento.dataHora).toLocaleString("pt-br")}
                    </td>
                    <td className="py-3 px-4" role="cell">
                      {atendimento.descricao}
                    </td>
                    <td
                      className="py-3 px-4 flex justify-center items-center"
                      role="cell"
                    >
                      <Badge
                        data-status={atendimento.status}
                        className="w-full flex items-center justify-center data-[status='Ativo']:bg-green-600"
                        variant={
                          atendimento.status === "Ativo" ? "default" : "destructive"
                        }
                        role="status"
                        aria-live="polite"
                      >
                        {atendimento.status}
                      </Badge>
                    </td>
                    <td
                      className="py-3 px-4 space-x-2 items-center justify-center"
                      role="cell"
                    >
                      {atendimento.patient?.status === "active" && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              aria-label="Editar informações do atendimento"
                              title="Editar informações do atendimento"
                            >
                              <FilePenIcon className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent
                            aria-labelledby={`edit-dialog-title-${atendimento.id}`}
                            aria-describedby={`edit-dialog-description-${atendimento.id}`}
                            role="dialog"
                            aria-modal="true"
                          >
                            <DialogHeader className="flex flex-col gap-6">
                              <div>
                                <DialogTitle
                                  id={`edit-dialog-title-${atendimento.id}`}
                                >
                                  Editar atendimento
                                </DialogTitle>
                                <DialogDescription
                                  id={`edit-dialog-description-${atendimento.id}`}
                                >
                                  Atualize as informações do atendimento
                                </DialogDescription>
                              </div>
                              <AtendimentoForm
                                isEditable
                                editableAtendimento={atendimento}
                              />
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      )}
                      <Switch
                        id={`atendimento-${atendimento.id}-status`}
                        checked={atendimento.status === "Ativo"}
                        onCheckedChange={() => handleDisable(atendimento)}
                        className={`relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 ${atendimento.status === "Ativo"
                          ? "bg-green-600"
                          : "bg-muted"
                          }`}
                        role="switch"
                        aria-checked={atendimento.status === "Ativo"}
                        aria-labelledby={`switch-label-${atendimento.id}`}
                        title="Alterar status do atendimento"
                      >
                        <span
                          className="sr-only"
                          id={`switch-label-${atendimento.id}`}
                        >
                          Alterar status do atendimento {atendimento.id}
                        </span>
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${atendimento.status === "Ativo"
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
        <div className="flex justify-center mt-6 items-center" role="navigation">
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
