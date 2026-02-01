import Text from "../../../components/Text";
import Card from "../../../components/Card";

interface InfoPetDetailProps {
  nome: string;
  idade: number;
  raca: string;
}

export default function InfoPetDetail({
  nome,
  idade,
  raca,
}: InfoPetDetailProps) {
  return (
    <Card variant="default" padding="lg" className="shadow-md ">
      <div className="flex items-center gap-2 mb-6">
        <i className="pi pi-tag text-yellow-400 text-xl" />
        <Text as="h2" variant="heading-lg" className="text-slate-900">
          {nome}
        </Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border-l-4 border-yellow-400 pl-4">
          <div className="flex items-center gap-2 mb-2">
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
            <Text variant="body-sm" className="text-slate-600">
              Raça
            </Text>
          </div>
          <Text variant="body-base" className="text-slate-900 font-medium">
            {raca}
          </Text>
        </div>
      </div>
    </Card>
  );
}
