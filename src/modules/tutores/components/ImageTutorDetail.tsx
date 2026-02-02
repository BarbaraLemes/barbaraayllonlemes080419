import Card from "../../../components/Card";
import Text from "../../../components/Text";

interface ImageTutorDetailProps {
  imageUrl?: string;
  nome: string;
  petsCount: number;
}

export default function ImageTutorDetail({ imageUrl, nome, petsCount }: ImageTutorDetailProps) {
  return (
    <div className="sticky top-24">
      {/* Card da Foto */}
      <div className=" w-80 h-80 bg-slate-200 rounded-lg overflow-hidden shadow-lg flex items-center justify-center mb-4 relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={nome}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <i className="pi pi-user text-slate-400 text-6xl" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-yellow-400 text-slate-900 font-bold text-center py-3">
          {nome}
        </div>
      </div>

      {/* Card de Pets Vinculados */}
      <Card variant="default" padding="md" className="w-80 h-40 shadow-lg text-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-full bg-yellow-400 flex items-center justify-center">
            <img src="/pata_azul.svg" alt="Pata" className="w-7 h-7" />
          </div>
          <Text variant="heading-xl" className="text-slate-900 font-bold">
            {petsCount}
          </Text>
          <Text variant="body-sm" className="text-slate-600">
            Pets vinculados
          </Text>
        </div>
      </Card>
    </div>
  );
}