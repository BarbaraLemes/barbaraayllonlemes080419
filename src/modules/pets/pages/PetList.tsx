import { useNavigate } from "react-router";
import { useState } from "react";
import { Paginator } from "primereact/paginator";
import Text from "../../../components/Text";
import { usePets } from "../hooks/usePets";
import PetCard from "../components/PetCard";
import BuscarPets from "../components/BuscarPets";
import Button from "../../../components/Button";

export default function PetList() {
  const navigate = useNavigate();
  const { pets, isLoading, loadPets, pagination } = usePets();
  const [searchTerm, setSearchTerm] = useState("");

  const handleCardClick = (id: number) => {
    navigate(`/pets/${id}`);
  };

  const handleNewPet = () => {
    navigate(`/pets/novo`);
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    loadPets({ nome: searchTerm, page: 0, size: 10 });
  };

  const handlePageChange = (event: any) => {
    const newPage = event.page;
    window.scrollTo(0, 0);
    loadPets({ nome: searchTerm, page: newPage, size: 10 });
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-[95%] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Text as="h1" variant="heading-2xl" className="text-slate-800 mb-2">
            Pets Cadastrados
          </Text>
          <Text as="p" variant="body-base" className="text-slate-600">
            Gerencie os pets registrados no sistema
          </Text>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between mb-8 gap-4">
          <Button
            variant="warning"
            onClick={handleNewPet}
            icon="pi-plus"
            className="h-11 px-5"
          >
            Novo Pet
          </Button>

          <BuscarPets onSearch={handleSearch} />
        </div>

        {/* Quando estiver carregando */}
        {isLoading ? (
          <div className="text-center py-12">
            <i className="pi pi-spin pi-spinner text-slate-400 text-4xl" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {pets.map((pet) => (
                <PetCard
                  key={pet.id}
                  id={pet.id}
                  nome={pet.nome}
                  raca={pet.raca}
                  idade={pet.idade}
                  imageUrl={pet.foto?.url}
                  onClick={handleCardClick}
                />
              ))}
            </div>

            {pets.length === 0 && (
              <div className="text-center py-12 flex flex-col">
                <i className="pi pi-inbox text-slate-300 text-6xl mb-4" />
                <Text variant="body-base" className="text-slate-600 mb-2">
                  Nenhum pet encontrado
                </Text>
              </div>
            )}

            {/* Paginação */}
            {pets.length > 0 && pagination.pageCount > 1 && (
              <div className="mt-8 flex justify-center">
                <Paginator
                  first={pagination.page * pagination.size}
                  rows={pagination.size}
                  totalRecords={pagination.total}
                  onPageChange={handlePageChange}
                  // template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPage"
                  // className="bg-transparent border-none"
                  pt={{
                    //   root: { className: 'bg-transparent border-none' },
                    //   firstPageButton: { className: 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg mx-1' },
                    //   previousPageButton: { className: 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg mx-1' },
                    //   nextPageButton: { className: 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg mx-1' },
                    //   lastPageButton: { className: 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg mx-1' },
                    pageButton: {
                      className:
                        "bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg mx-1 min-w-[2.5rem]",
                    },
                    //   current: { className: 'bg-slate-800 text-white border-slate-800 hover:bg-slate-900' }
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
