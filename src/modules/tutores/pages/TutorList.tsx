import { useNavigate } from "react-router";
import { useState } from "react";
import { Paginator } from "primereact/paginator";
import Text from "../../../components/Text";
import Button from "../../../components/Button";
import { useTutors } from "../hooks/useTutors";
import TutorCard from "../components/TutorCard";
import BuscarTutores from "../components/BuscarTutores";

export default function TutorList() {
  const navigate = useNavigate();
  const { tutores, isLoading, loadTutores, pagination } = useTutors();
  const [searchTerm, setSearchTerm] = useState("");

  const handleCardClick = (id: number) => {
    navigate(`/tutores/${id}`);
  };

  const handleNewTutor = () => {
    navigate(`/tutores/novo`);
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    loadTutores({ nome: searchTerm, page: 0, size: 10 });
  };

  const handlePageChange = (event: any) => {
    const newPage = event.page;
    window.scrollTo(0, 0);
    loadTutores({ nome: searchTerm, page: newPage, size: 10 });
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-[95%] mx-auto">
        <div className="mb-8">
          <Text as="h1" variant="heading-2xl" className="text-slate-800 mb-2">
            Tutores Cadastrados
          </Text>
          <Text as="p" variant="body-base" className="text-slate-600">
            Gerencie os tutores responsáveis pelos pets
          </Text>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between mb-8 gap-4">
          <Button
            variant="warning"
            onClick={handleNewTutor}
            icon="pi-plus"
            className="h-11 px-5"
          >
            Novo Tutor
          </Button>

          <BuscarTutores onSearch={handleSearch} />
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <i className="pi pi-spin pi-spinner text-slate-400 text-4xl" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutores.map((tutor) => (
                <TutorCard
                  key={tutor.id}
                  id={tutor.id}
                  nome={tutor.nome}
                  telefone={tutor.telefone}
                  email={tutor.email}
                  endereco={tutor.endereco}
                  imageUrl={tutor.foto?.url}
                  onClick={handleCardClick}
                />
              ))}
            </div>

            {tutores.length === 0 && (
              <div className="text-center py-12 flex flex-col">
                <i className="pi pi-inbox text-slate-300 text-6xl mb-4" />
                <Text variant="body-base" className="text-slate-600 mb-2">
                  Nenhum tutor encontrado
                </Text>
              </div>
            )}

            {/* Paginação */}
            {tutores.length > 0 && pagination.pageCount > 1 && (
              <div className="mt-8 flex justify-center">
                <Paginator
                  first={pagination.page * pagination.size}
                  rows={pagination.size}
                  totalRecords={pagination.total}
                  onPageChange={handlePageChange}
                  pt={{
                    pageButton: {
                      className:
                        "bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg mx-1 min-w-[2.5rem]",
                    },
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
