import { useState, useEffect } from "react";
import Card from "../../../components/Card";
import Text from "../../../components/Text";
import Button from "../../../components/Button";
import InputText from "../../../components/InputText";
import { useToast } from "../../../contexts/ToastContext";
import { petsService } from "../../pets/services/pets.service";
import { tutoresService } from "../services/tutores.service";
import type { Pet } from "../../pets/types/pets.types";

interface VinculoPetsProps {
  tutorId: number;
  petsVinculados: Pet[];
  onVinculoChange: () => void;
}

export default function VinculoPets({
  tutorId,
  petsVinculados,
  onVinculoChange,
}: VinculoPetsProps) {
  const { showToast } = useToast();
  const [petsDisponiveis, setPetsDisponiveis] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const loadPetsDisponiveis = async () => {
    setIsLoading(true);
    try {
      const response = await petsService.getPets({ size: 100 });
      // Filtrar pets que já estão vinculados
      const disponiveis = response.content.filter(
        (pet) => !petsVinculados.some((vinculado) => vinculado.id === pet.id),
      );
      setPetsDisponiveis(disponiveis);
    } catch (error) {
      console.error("Erro ao carregar pets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (showSelector) {
      loadPetsDisponiveis();
    }
  }, [showSelector, petsVinculados]);

  const handleVincular = async (petId: number) => {
    try {
      await tutoresService.vincularPetTutor(tutorId, petId);
      showToast("success", "Sucesso", "Pet vinculado com sucesso!");
      setShowSelector(false);
      setSearchTerm("");
      onVinculoChange();
    } catch (error) {
      console.error("Erro ao vincular pet:", error);
      showToast("error", "Erro", "Não foi possível vincular o pet. Tente novamente.");
    }
  };

  const handleDesvincular = async (petId: number) => {
    try {
      await tutoresService.removerVinculoPetTutor(tutorId, petId);
      showToast("success", "Sucesso", "Pet desvinculado com sucesso!");
      onVinculoChange();
    } catch (error) {
      console.error("Erro ao desvincular pet:", error);
      showToast("error", "Erro", "Não foi possível desvincular o pet. Tente novamente.");
    }
  };

  return (
    <Card
      variant="default"
      padding="none"
      className="shadow-lg overflow-hidden"
    >
      <div className="bg-yellow-400 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <i className="pi pi-link text-slate-900 text-xl" />
              <Text
                as="h2"
                variant="heading-lg"
                className="text-slate-900 font-bold"
              >
                Vinculação de Pets
              </Text>
            </div>
            <Text variant="body-base" className="text-slate-800">
              Gerencie os pets associados a este tutor
            </Text>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowSelector(!showSelector)}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white border-none"
          >
            <i className="pi pi-plus" />
            Vincular Pet
          </Button>
        </div>
      </div>

      <div className="p-6">
        {/* Seletor de pets disponíveis */}
        {showSelector && (
          <Card
            variant="default"
            padding="md"
            className="mb-6 border-2 border-yellow-400"
          >
            <div className="flex items-center justify-between mb-4">
              <Text variant="heading-lg" className="text-slate-900">
                Selecione um pet disponível
              </Text>
              <Button
              variant="ghost"
              icon="pi pi-times"
                onClick={() => {
                  setShowSelector(false);
                  setSearchTerm("");
                }}
                className="text-slate-600 hover:text-slate-900"
              />
            </div>

            {/* Input de pesquisa */}
            <div className="mb-4">
              <InputText
                placeholder="Pesquisar por nome ou raça..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            {isLoading ? (
              <div className="text-center py-4">
                <i className="pi pi-spin pi-spinner text-slate-400 text-2xl" />
              </div>
            ) : (() => {
                const petsFiltrados = petsDisponiveis.filter((pet) =>
                  pet.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  pet.raca?.toLowerCase().includes(searchTerm.toLowerCase())
                );

                return petsFiltrados.length === 0 ? (
                  <Text
                    variant="body-sm"
                    className="text-slate-600 text-center py-4"
                  >
                    {searchTerm ? "Nenhum pet encontrado com esse critério" : "Nenhum pet disponível para vincular"}
                  </Text>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {petsFiltrados.map((pet) => (
                  <div
                    key={pet.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 hover:border-yellow-400 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {pet.foto?.url ? (
                        <img
                          src={pet.foto.url}
                          alt={pet.nome}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                          <i className="pi pi-heart text-slate-400 text-xl" />
                        </div>
                      )}
                      <div className=" flex flex-col">
                        <Text
                          variant="body-base"
                          className="text-slate-900 font-semibold mb-0.5"
                        >
                          {pet.nome}
                        </Text>
                        <Text variant="body-sm" className="text-slate-500">
                          {pet.raca} • {pet.idade}{" "}
                          {pet.idade === 1 ? "ano" : "anos"}
                        </Text>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      icon="pi pi-plus"
                      onClick={() => handleVincular(pet.id)}
                      className="text-yellow-400 hover:text-yellow-600 hover:bg-transparent transition-colors"
                      tooltip="Vincular Pet"
                    />
                  </div>
                ))}
              </div>
            );
          })()}
          </Card>
        )}

        {/* Lista de pets vinculados */}
        {petsVinculados.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 flex flex-col">
            <i className="pi pi-inbox text-slate-300 text-5xl mb-3" />
            <Text variant="body-base" className="text-slate-600">
              Nenhum pet vinculado
            </Text>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {petsVinculados.map((pet) => (
              <Card
                key={pet.id}
                variant="default"
                padding="md"
                className="shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Foto do Pet */}
                    {pet.foto?.url ? (
                      <img
                        src={pet.foto.url}
                        alt={pet.nome}
                        className="w-16 h-16 rounded-full object-cover border-2 border-slate-400"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center border-2 border-slate-400">
                        <i className="pi pi-heart text-slate-600 text-xl" />
                      </div>
                    )}

                    {/* Informações do Pet */}
                    <div className="space-y-1">
                      <Text
                        variant="heading-lg"
                        className="text-slate-900 font-semibold"
                      >
                        {pet.nome}
                      </Text>
                      <div className="flex items-center gap-3 text-slate-600">
                        <div className="flex items-center gap-1">
                          <Text variant="body-sm" className="text-slate-600">
                            {pet.raca} • {pet.idade}{" "}
                            {pet.idade === 1 ? "ano" : "anos"}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botão Desvincular */}
                  <Button
                    variant="ghost"
                    icon="pi pi-times"
                    onClick={() => handleDesvincular(pet.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-transparent transition-colors"
                    tooltip="Desvincular Pet"
                    tooltipOptions={{ position: "top" }}
                  />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
