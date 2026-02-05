import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useTutorDetail } from "../../hooks/useTutorDetail";
import { tutoresService } from "../../services/tutores.service";
import { useToast } from "../../../../contexts/ToastContext";
import Text from "../../../../components/Text";
import Button from "../../../../components/Button";
import ConfirmDialog from "../../../../components/ConfirmDialog";
import ImageTutorDetail from "./components/ImageTutorDetail";
import InfoTutorDetail from "./components/InfoTutorDetail";
import VinculoPets from "./components/VinculoPets";

export default function TutorDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { tutor, isLoading, error, loadTutor } = useTutorDetail(Number(id));

  const handleEdit = () => {
    navigate(`/tutores/${id}/editar`);
  };

  const handleDelete = async () => {
    try {
      await tutoresService.deleteTutor(Number(id));
      showToast("success", "Sucesso", "Tutor excluído com sucesso!");
      navigate("/tutores");
    } catch (error) {
      console.error("Erro ao excluir tutor:", error);
      showToast("error", "Erro", "Não foi possível excluir o tutor. Tente novamente.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <i className="pi pi-spin pi-spinner text-slate-400 text-4xl" />
      </div>
    );
  }

  if (!tutor || error) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        <i className="pi pi-inbox text-slate-300 text-5xl mb-3" />
        <Text variant="body-base" className="text-slate-600">
          {error || "Tutor não encontrado"}
        </Text>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <Button
            icon="pi pi-arrow-left"
            onClick={() => navigate("/tutores")}
            variant="ghost"
            className="text-slate-600 hover:text-slate-900 text-xs sm:text-sm md:text-base"
          >
            Voltar para lista de tutores
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-4 sm:mt-6">
          {/* Foto do tutor fixada */}
          <div className="lg:col-span-1">
            <ImageTutorDetail
              imageUrl={tutor.foto?.url}
              nome={tutor.nome}
              petsCount={tutor.pets?.length || 0}
            />
          </div>

          {/* Informações */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <InfoTutorDetail
              nome={tutor.nome}
              telefone={tutor.telefone}
              email={tutor.email}
              endereco={tutor.endereco}
              cpf={tutor.cpf}
              onEdit={handleEdit}
              onDelete={() => setShowDeleteDialog(true)}
            />

            {/* Vinculação de Pets */}
            <VinculoPets
              tutorId={tutor.id}
              petsVinculados={tutor.pets || []}
              onVinculoChange={loadTutor}
            />
          </div>
        </div>
      </div>

      <ConfirmDialog
        visible={showDeleteDialog}
        onHide={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Excluir Tutor"
        message={`Tem certeza que deseja excluir: ${tutor.nome}?`}
        confirmLabel="Excluir Tutor"
        cancelLabel="Cancelar"
        severity="danger"
      />
    </div>
  );
}
