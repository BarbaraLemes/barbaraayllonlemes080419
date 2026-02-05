import Text from "../../../../../components/Text";
import Card from "../../../../../components/Card";
import Button from "../../../../../components/Button";

interface InfoPetDetailProps {
  nome: string;
  idade: number;
  raca: string;
  onEdit: () => void;
  onDelete: () => void;
}

export default function InfoPetDetail({
  nome,
  idade,
  raca,
  onEdit,
  onDelete,
}: InfoPetDetailProps) {
  return (
    <Card
      variant="default"
      padding="none"
      className="shadow-lg overflow-hidden"
    >
      <div className="bg-slate-900 text-white px-6 py-5 shadow-lg">
        <div className="flex items-center gap-2">
          <i className="pi pi-tag text-yellow-400 text-xl" />
          <Text variant="label-base" className="font-medium text-white">
            Informações completas do pet
          </Text>
        </div>
      </div>

      {/* Container de informações */}
      <div className="px-6 pt-4 pb-6">
        <div className="mb-6 flex items-center justify-between">
          <Text
            as="h2"
            variant="heading-lg"
            className="text-slate-900 font-semibold"
          >
            {nome}
          </Text>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="secondary"
              onClick={onEdit}
              className="flex items-center gap-2 text-xs sm:text-sm md:text-base px-2 sm:px-4 justify-center"
            >
              <i className="pi pi-pencil" />
              Editar
            </Button>
            <Button
              variant="danger"
              onClick={onDelete}
              className="flex items-center gap-2 text-xs sm:text-sm md:text-base px-2 sm:px-4 justify-center"
            >
              <i className="pi pi-trash" />
              Excluir
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-l-4 border-yellow-400 pl-4">
            <div className="flex items-center gap-2 mb-2">
              <img src="/pata_cinza.svg" alt="Pata" className="w-4 h-4" />
              <Text variant="body-sm" className="text-slate-600">
                Idade
              </Text>
            </div>
            <Text variant="body-base" className="text-slate-900 font-medium">
              {idade} {idade === 1 ? "ano" : "anos"}
            </Text>
          </div>

          <div className="border-l-4 border-yellow-400 pl-4">
            <div className="flex items-center gap-2 mb-2">
              <img src="/pata_cinza.svg" alt="Pata" className="w-4 h-4" />
              <Text variant="body-sm" className="text-slate-600">
                Raça
              </Text>
            </div>
            <Text variant="body-base" className="text-slate-900 font-medium">
              {raca}
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );
}
