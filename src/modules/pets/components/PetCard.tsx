import Card from "../../../components/Card";
import Text from "../../../components/Text";

interface PetCardProps {
  id: number;
  nome: string;
  raca: string;
  idade: number;
  imageUrl?: string;
  onClick: (id: number) => void;
}

export default function PetCard({
  id,
  nome,
  raca,
  idade,
  imageUrl,
  onClick,
}: PetCardProps) {
  return (
    <Card
      variant="elevated"
      padding="none"
      hover={true}
      className="overflow-hidden transition-all duration-200 hover:scale-[1.02]"
      onClick={() => onClick(id)}
    >
      <div className="w-full h-48 bg-slate-200 flex items-center justify-center pointer-events-none">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={nome}
            className="w-full h-full object-cover"
          />
        ) : (
          <i className="pi pi-image text-slate-400 text-6xl" />
        )}
      </div>

      <div className="p-4 pointer-events-none">
        <Text as="h3" variant="heading-lg" className="text-slate-800 mb-3">
          {nome}
        </Text>

        <div className="flex flex-col gap-2">
          <Text variant="body-sm" className="text-slate-600">
            Espécie: {raca}
          </Text>
          <Text variant="body-sm" className="text-slate-600">
            Idade: {idade ? `${idade} ${idade === 1 ? "ano" : "anos"}` : ""}
          </Text>
        </div>
      </div>
    </Card>
  );
}
