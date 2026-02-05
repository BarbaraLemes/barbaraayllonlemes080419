import { useState } from "react";
import InputText from "../../../../../shared/components/ui/InputText";
import Button from "../../../../../shared/components/ui/Button";

interface BuscarPetsProps {
  onSearch: (searchTerm: string) => void;
}

export default function BuscarPets({ onSearch }: BuscarPetsProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Se apagar tudo, busca todos os pets
    if (value === "") {
      onSearch("");
    }
  };

  const handleSearchClick = () => {
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <div className="flex gap-2 sm:gap-4 items-center w-full sm:w-auto">
      <div className="flex-1 relative">
        <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10 text-sm" />
        <InputText
          placeholder="Buscar por nome..."
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          className="pl-9 sm:pl-10 h-10 sm:h-11 text-sm sm:text-base"
        />
      </div>
      <Button 
        variant="primary"
        onClick={handleSearchClick}
        className="px-4 sm:px-6 h-10 sm:h-11 text-sm sm:text-base"
      >
        <i className="pi pi-search sm:mr-2" />
        <span className="hidden sm:inline">Buscar</span>
      </Button>
    </div>
  );
}
