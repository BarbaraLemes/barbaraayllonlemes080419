import { useNavigate, useParams } from "react-router-dom";
import { usePetDetail } from "../hooks/usePetDetail";
import Text from "../../../components/Text";
import Button from "../../../components/Button";
import ImagePetDetail from "../components/ImagePetDetail";
import InfoPetDetail from "../components/InfoPetDetail";
import PetTutorInfo from "../components/PetTutorInfo";

export default function PetDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { pet, isLoading, error } = usePetDetail(Number(id));

  const handleEdit = () => {
    navigate(`/pets/${id}/editar`);
  };

  const handleDelete = () => {
    // TODO: Implementar exclusão
    console.log("Excluir pet", id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <i className="pi pi-spin pi-spinner text-slate-400 text-4xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <Text as="h1" variant="heading-lg" className="text-slate-600 ">
            Informações do Pet
          </Text>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={handleEdit}
              className="flex items-center gap-2"
            >
              <i className="pi pi-pencil" />
              Editar
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
            >
              <i className="pi pi-trash" />
              Excluir
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ImagePetDetail imageUrl={pet.foto?.url} nome={pet.nome} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <InfoPetDetail idade={pet.idade} raca={pet.raca} nome={pet.nome} />

            {pet.tutores && pet.tutores.length > 0 && (
              <PetTutorInfo tutores={pet.tutores} />
            )}
          </div>
        </div>

        <div className="mt-8">
          <Button
            icon="pi pi-arrow-left"
            onClick={() => navigate(-1)}
            variant="ghost"
            className="text-slate-600 hover:text-slate-900"
          >
            Voltar para lista
          </Button>
        </div>
      </div>
    </div>
  );
}
