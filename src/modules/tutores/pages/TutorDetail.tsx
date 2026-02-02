import { useNavigate, useParams } from "react-router-dom";
import { useTutorDetail } from "../hooks/useTutorDetail";
import Text from "../../../components/Text";
import Button from "../../../components/Button";
import ImageTutorDetail from "../components/ImageTutorDetail";
import InfoTutorDetail from "../components/InfoTutorDetail";
import VinculoPets from "../components/VinculoPets";

export default function TutorDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tutor, isLoading, error, loadTutor } = useTutorDetail(Number(id));

  const handleEdit = () => {
    navigate(`/tutores/${id}/editar`);
  };

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir este tutor?")) {
      try {
        // TODO: Implementar exclusão
        console.log("Excluir tutor", id);
        navigate("/tutores");
      } catch (error) {
        console.error("Erro ao excluir tutor:", error);
      }
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
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button
            icon="pi pi-arrow-left"
            onClick={() => navigate("/tutores")}
            variant="ghost"
            className="text-slate-600 hover:text-slate-900"
          >
            Voltar para lista de tutores
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* Foto do tutor fixada */}
          <div className="lg:col-span-1">
            <ImageTutorDetail
              imageUrl={tutor.foto?.url}
              nome={tutor.nome}
              petsCount={tutor.pets?.length || 0}
            />
          </div>

          {/* Informações */}
          <div className="lg:col-span-2 space-y-6">
            <InfoTutorDetail
              nome={tutor.nome}
              telefone={tutor.telefone}
              email={tutor.email}
              endereco={tutor.endereco}
              cpf={tutor.cpf}
              onEdit={handleEdit}
              onDelete={handleDelete}
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
    </div>
  );
}
