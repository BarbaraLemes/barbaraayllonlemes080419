import { useState } from "react";
import InputText from "../../../components/InputText";
import Button from "../../../components/Button";

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
    <div className="flex gap-4 items-center mb-6">
      <div className="flex-1 relative">
        <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
        <InputText
          placeholder="Buscar por nome..."
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          className="pl-10 h-12"
        />
      </div>
      <Button 
        variant="primary"
        onClick={handleSearchClick}
        className="px-6 h-12"
      >
        <i className="pi pi-search mr-2" />
        Buscar
      </Button>
    </div>
  );
}
