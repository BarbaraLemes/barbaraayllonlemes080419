import { useState, useEffect } from "react";
import { Paginator } from "primereact/paginator";
import Modal from "../../../components/Modal";
import InputText from "../../../components/InputText";
import Button from "../../../components/Button";
import Text from "../../../components/Text";
import type { Pet } from "../../pets/types/pets.types";

interface VincularPetModalProps {
  visible: boolean;
  onHide: () => void;
  petsDisponiveis: Pet[];
  isLoading: boolean;
  onVincular: (petId: number) => void;
}

export default function VincularPetModal({
  visible,
  onHide,
  petsDisponiveis,
  isLoading,
  onVincular,
}: VincularPetModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  // Resetar página quando modal abre
  useEffect(() => {
    if (visible) {
      setCurrentPage(0);
      setSearchTerm("");
    }
  }, [visible]);

  // Filtrar pets baseado na busca
  const petsFiltrados = petsDisponiveis.filter((pet) =>
    pet.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.raca?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular pets da página atual
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const petsPaginados = petsFiltrados.slice(startIndex, endIndex);

  // Resetar para primeira página quando busca muda
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  const handlePageChange = (event: any) => {
    setCurrentPage(event.page);
  };

  return (
    <Modal
      visible={visible}
      onHide={onHide}
      title="Vincular Pet"
      description="Selecione um pet disponível para vincular a este tutor"
      icon="pi pi-link"
      width="900px"
    >
      <div className="p-4 sm:p-6 max-h-[65vh] sm:max-h-[75vh] overflow-y-auto">
        {/* Campo de busca */}
        <div className="mb-6">
          <InputText
            placeholder="Buscar por nome ou raça..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Lista de pets */}
        {isLoading ? (
          <div className="text-center py-12">
            <i className="pi pi-spin pi-spinner text-slate-400 text-3xl" />
          </div>
        ) : petsFiltrados.length === 0 ? (
          <div className="text-center py-12 flex flex-col">
            <i className="pi pi-inbox text-slate-300 text-5xl mb-3" />
            <Text variant="body-base" className="text-slate-600">
              {searchTerm
                ? "Nenhum pet encontrado com esse critério"
                : "Nenhum pet disponível para vincular"}
            </Text>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {petsPaginados.map((pet) => (
                <div
                  key={pet.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-yellow-400 hover:shadow-md transition-all h-[90px]"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {pet.foto?.url ? (
                      <img
                        src={pet.foto.url}
                        alt={pet.nome}
                        className="w-14 h-14 rounded-full object-cover border-2 border-slate-300 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center border-2 border-slate-300 flex-shrink-0">
                        <i className="pi pi-heart text-slate-400 text-xl" />
                      </div>
                    )}
                    <div className="flex flex-col flex-1 min-w-0">
                      <Text
                        variant="body-base"
                        className="text-slate-900 font-semibold mb-0.5 truncate"
                      >
                        {pet.nome}
                      </Text>
                      <Text variant="body-sm" className="text-slate-500 truncate">
                        {pet.raca} • {pet.idade} {pet.idade === 1 ? "ano" : "anos"}
                      </Text>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    icon="pi pi-plus"
                    onClick={() => onVincular(pet.id)}
                    className="text-yellow-500 hover:text-yellow-700 hover:bg-transparent transition-colors"
                    tooltip="Vincular Pet"
                  />
                </div>
              ))}
            </div>

            {/* Paginação */}
            {petsFiltrados.length > itemsPerPage && (
              <div className="flex justify-center border-t border-slate-200 pt-4">
                <Paginator
                  first={currentPage * itemsPerPage}
                  rows={itemsPerPage}
                  totalRecords={petsFiltrados.length}
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
    </Modal>
  );
}
