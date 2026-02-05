import { useNavigate } from "react-router";
import { useState } from "react";
import { Paginator } from "primereact/paginator";
import Text from "../../../../components/Text";
import Button from "../../../../components/Button";
import { useTutors } from "../../hooks/useTutors";
import TutorCard from "./components/TutorCard";
import BuscarTutores from "./components/BuscarTutores";

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
    <div className="min-h-screen p-3 sm:p-6">
      <div className="max-w-[95%] mx-auto">
        <div className="mb-4 sm:mb-8">
          <Text as="h1" variant="heading-2xl" className="text-slate-800 mb-2">
            Tutores Cadastrados
          </Text>
          <Text as="p" variant="body-base" className="text-slate-600">
            Gerencie os tutores responsáveis pelos pets
          </Text>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between mb-4 sm:mb-8 gap-3 sm:gap-4">
          <Button
            variant="warning"
            onClick={handleNewTutor}
            icon="pi-plus"
            className="h-10 sm:h-11 px-4 sm:px-5 text-sm sm:text-base"
          >
            Novo Tutor
          </Button>

          <BuscarTutores onSearch={handleSearch} />
        </div>

        {isLoading ? (
          <div className="text-center py-8 sm:py-12">
            <i className="pi pi-spin pi-spinner text-slate-400 text-3xl sm:text-4xl" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                  template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                  pt={{
                    firstPageButton: {
                      className: "bg-white hover:bg-slate-100 text-slate-700 rounded-full mx-1"
                    },
                    prevPageButton: {
                      className: "bg-white hover:bg-slate-100 text-slate-700 rounded-full mx-1"
                    },
                    nextPageButton: {
                      className: "bg-white hover:bg-slate-100 text-slate-700 rounded-full mx-1"
                    },
                    lastPageButton: {
                      className: "bg-white hover:bg-slate-100 text-slate-700 rounded-full mx-1"
                    },
                    pageButton: (options: any) => ({
                      className: options.context.active
                        ? "bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold rounded-full mx-1"
                        : "bg-white hover:bg-slate-100 text-slate-700 rounded-full mx-1",
                    }),
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
