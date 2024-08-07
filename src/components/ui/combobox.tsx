import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { usePatientContext } from "@/hooks/usePatientContext";
import { calculateAge } from "@/lib/calculateAge";
import { cn } from "@/lib/utils";

interface ComboboxProps {
  onChange: (id: string | null) => void;
}

export function Combobox({ onChange }: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const { patients } = usePatientContext()

  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = patients.filter(
    (patient) =>
      patient.status === 'active' && (
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.cpf.includes(searchTerm))
  );

  const selectedPatient = patients.find(
    (patient) => patient.id.toString() === selectedPatientId
  );

  const handleSelect = (id: string) => {
    const current_id = id.split("| ")[0];
    onChange(current_id);
    setSelectedPatientId(current_id === selectedPatientId ? "" : current_id);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={(open) => {
      setOpen(open);
      setSearchTerm("");
    }}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedPatient ? selectedPatient.name : "Selecione um paciente..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Pesquisar por Nome ou CPF..."
            onKeyUp={(event) => setSearchTerm(event.currentTarget.value)}
          />
          <CommandList>
            <CommandEmpty>Paciente não encontrado.</CommandEmpty>
            <CommandGroup>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <CommandItem
                    key={patient.id}
                    value={patient.id.toString() + "| " + patient.name}
                    onSelect={() => handleSelect(patient.id.toString())}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedPatientId === patient.id.toString() ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-muted-foreground text-sm">
                          {new Date(patient.dateOfBirth).toLocaleDateString("pt-br")}
                          {" - "}
                          {calculateAge(patient.dateOfBirth)} Anos | {patient.cpf} | {patient.gender}
                        </div>
                        <div className="text-muted-foreground text-sm">
                          {patient.address.street}, {patient.address.complement}
                          <br />
                          {patient.address.neighborhood}, {patient.address.city} -{" "}
                          {patient.address.zipCode}
                        </div>
                      </div>
                      <div
                        className={`px-2 py-1 rounded-md text-xs font-medium ${patient.status === "active" ? "bg-green-500 text-green-50" : "bg-red-500 text-red-50"
                          }`}
                      >
                        {patient.status === "active" ? "Habilitado" : "Desabilitado"}
                      </div>
                    </div>
                  </CommandItem>
                ))
              ) : (
                <CommandEmpty>Paciente não encontrado.</CommandEmpty>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
