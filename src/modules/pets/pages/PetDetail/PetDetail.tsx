import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { usePetDetail } from "../../hooks/usePetDetail";
import { petsService } from "../../services/pets.service";
import { useToast } from "../../../../contexts/ToastContext";
import Text from "../../../../shared/components/ui/Text";
import Button from "../../../../shared/components/ui/Button";
import ConfirmDialog from "../../../../shared/components/feedback/ConfirmDialog";
import ImagePetDetail from "./components/ImagePetDetail";
import InfoPetDetail from "./components/InfoPetDetail";
import PetTutorInfo from "./components/PetTutorInfo";
import Card from "../../../../shared/components/ui/Card";

export default function PetDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { pet, isLoading, error } = usePetDetail(Number(id));

  const handleEdit = () => {
    navigate(`/pets/${id}/editar`);
  };

  const handleDelete = async () => {
    try {
      await petsService.deletePet(Number(id));
      showToast("success", "Sucesso", "Pet excluído com sucesso!");
      navigate("/pets");
    } catch (error) {
      console.error("Erro ao excluir pet:", error);
      showToast("error", "Erro", "Não foi possível excluir o pet. Tente novamente.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <i className="pi pi-spin pi-spinner text-slate-400 text-4xl" />
      </div>
    );
  }

  if (!pet || error) {
    return (
      <div className="h-screen flex items-center justify-center flex-col">
        <i className="pi pi-inbox text-slate-300 text-5xl mb-3" />
        <Text variant="body-base" className="text-slate-600">
          {error || "Pet não encontrado"}
        </Text>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Botão voltar */}
        <div className="mb-4 sm:mb-6">
          <Button
            icon="pi pi-arrow-left"
            onClick={() => navigate("/pets")}
            variant="ghost"
            className="text-slate-600 hover:text-slate-900 text-xs sm:text-sm md:text-base"
          >
            Voltar para lista de pets
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-4 sm:mt-6">
          {/* Foto do pet fixada */}
          <div className="lg:col-span-1">
            <ImagePetDetail imageUrl={pet.foto?.url} nome={pet.nome} />
          </div>

          {/* Informações */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <InfoPetDetail
              idade={pet.idade}
              raca={pet.raca}
              nome={pet.nome}
              onEdit={handleEdit}
              onDelete={() => setShowDeleteDialog(true)}
            />

            {pet.tutores && pet.tutores.length > 0 ? (
              <PetTutorInfo tutores={pet.tutores} />
            ) : (
              <Card
                variant="default"
                padding="lg"
                className="shadow-md border-l-4 border-slate-900"
              >
                <div className="flex items-start gap-3">
                  <i className="pi pi-info-circle text-slate-400 text-lg mt-0.5" />
                  <div className="flex flex-col">
                    <Text variant="body-sm" className="text-slate-600 mb-1">
                      Este pet não possui tutor vinculado.
                    </Text>
                    <Text variant="body-xs" className="text-slate-500">
                      A vinculação pode ser realizada na tela de tutores.
                    </Text>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        visible={showDeleteDialog}
        onHide={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Excluir Pet"
        message={`Tem certeza que deseja excluir: ${pet.nome}?`}
        confirmLabel="Excluir Pet"
        cancelLabel="Cancelar"
        severity="danger"
      />
    </div>
  );
}
